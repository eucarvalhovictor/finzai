'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/lib/types';

const roles: UserRole[] = ['basico', 'completo', 'admin'];

const userSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório.'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(roles, { required_error: 'Selecione um cargo.' }),
});

type UserFormValues = z.infer<typeof userSchema>;

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddUserDialog({ isOpen, onOpenChange }: AddUserDialogProps) {
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Criar uma instância de Auth secundária para não deslogar o admin
  // Esta é uma abordagem avançada e requer cuidado
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'basico',
    },
  });
  
  // NOTE: A criação de usuários por um admin logado requer uma abordagem mais complexa,
  // geralmente usando Firebase Admin SDK no backend (via Cloud Functions), para não
  // interferir com a sessão de autenticação atual do admin.
  // Para este protótipo, vamos simular a criação, mas ela pode não funcionar como esperado
  // no lado do cliente sem essa arquitetura de backend.
  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true);
    if (!firestore || !auth) {
        toast({ title: 'Erro', description: 'Serviços do Firebase não estão disponíveis.' });
        setIsSubmitting(false);
        return;
    }

    try {
        // Esta é uma simplificação. Em um app real, usaríamos o Admin SDK.
        // A tentativa de criar um usuário aqui pode deslogar o admin.
        // Por agora, vamos focar em criar o documento no Firestore.
        // A criação da autenticação real precisaria de uma Cloud Function.
        
        // Simulação: Criar o documento no Firestore. O usuário precisaria
        // ter a senha resetada para poder logar, já que não estamos criando a auth real.
        
        // A forma correta (mas que não podemos fazer aqui) seria:
        // const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
        // const user = userCredential.user;

        // Solução para o protótipo: Adicionar diretamente ao Firestore.
        // O ID será gerado automaticamente pelo Firestore.
        const newUserRef = doc(collection(firestore, 'users'));
        
        await setDoc(newUserRef, {
            id: newUserRef.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            registrationDate: serverTimestamp(),
            role: data.role,
        });

        toast({
            title: 'Usuário Adicionado (Simulação)',
            description: `O perfil de ${data.firstName} foi criado. Em um app real, um e-mail de boas-vindas com definição de senha seria enviado.`,
        });
        
        form.reset();
        onOpenChange(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Adicionar Usuário',
        description: error.message || 'Não foi possível adicionar o usuário.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie uma nova conta de usuário e defina seu cargo inicial.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl><Input placeholder="João" {...field} /></FormControl>
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
                                <FormControl><Input placeholder="Silva" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl><Input type="email" placeholder="joao.silva@email.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha Temporária</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cargo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                     {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adicionando...' : 'Adicionar Usuário'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
