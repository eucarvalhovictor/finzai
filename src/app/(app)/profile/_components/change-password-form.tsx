'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase } from '@/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'A senha atual é obrigatória.'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As novas senhas não coincidem.',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const { user, auth } = useFirebase();
  const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    if (!user || !user.email) return;

    const credential = EmailAuthProvider.credential(user.email, data.currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);
      
      toast({
        title: 'Senha Alterada',
        description: 'Sua senha foi alterada com sucesso.',
      });
      form.reset();
    } catch (error: any) {
      let description = 'Ocorreu um erro ao alterar sua senha.';
      if (error.code === 'auth/wrong-password') {
        description = 'A senha atual informada está incorreta.';
      }
      toast({
        variant: 'destructive',
        title: 'Erro ao Alterar Senha',
        description: description,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Para sua segurança, informe sua senha atual antes de definir uma nova.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
             <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
