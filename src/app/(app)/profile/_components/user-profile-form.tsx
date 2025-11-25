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
import { useEffect } from 'react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório.'),
  lastName: z.string().min(1, 'O sobrenome é obrigatório.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
}

export function UserProfileForm() {
  const { user, firestore, auth } = useFirebase();
  const { toast } = useToast();

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
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      });
    }
  }, [userProfile, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user || !userDocRef) return;

    try {
      // Update Firestore document
      updateDocumentNonBlocking(userDocRef, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`
      });

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
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize seu nome e sobrenome.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                <FormMessage />
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
