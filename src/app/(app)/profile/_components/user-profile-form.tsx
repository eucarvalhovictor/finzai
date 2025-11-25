'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório.'),
  lastName: z.string().optional(),
  photoURL: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type UserProfile = {
  firstName: string;
  lastName?: string;
  email: string;
  photoURL?: string;
}

export function UserProfileForm() {
  const { user, firestore, auth } = useFirebase();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      photoURL: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName || '',
        photoURL: userProfile.photoURL || '',
      });
      setPhotoPreview(userProfile.photoURL || null);
    }
  }, [userProfile, form]);
  
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setPhotoPreview(dataUrl);
            form.setValue('photoURL', dataUrl);
        };
        reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: ProfileFormValues) {
    if (!user || !userDocRef) return;

    try {
      // Data to be saved in Firestore. This can include the long data URI.
      const updatedData: Partial<UserProfile> = {
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: data.photoURL,
      };

      // Update Firestore document with all data.
      updateDocumentNonBlocking(userDocRef, updatedData);
      
      // Update Firebase Auth profile, but ONLY with data that fits.
      // Do NOT send the photoURL here to avoid the "too long" error.
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${data.firstName} ${data.lastName || ''}`.trim(),
          // photoURL is intentionally omitted here.
        });
      }

      toast({
        title: 'Perfil Atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Atualizar',
        description: error.message || 'Não foi possível salvar suas informações.',
      });
    }
  }

  if (isLoadingProfile) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
           <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seu nome, sobrenome e foto de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
                control={form.control}
                name="photoURL"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto de Perfil</FormLabel>
                   <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                         <AvatarImage src={photoPreview || undefined} />
                         <AvatarFallback>
                            {userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Button asChild variant="outline">
                         <label htmlFor="photo-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Carregar Imagem
                            <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                         </label>
                      </Button>
                   </div>
                </FormItem>
                )}
            />
            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                    <Input disabled value={user?.email || ''} />
                </FormControl>
             </FormItem>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
