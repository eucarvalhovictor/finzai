'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { doc, serverTimestamp, collection, getDocs, query, limit, setDoc } from 'firebase/firestore';


export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro de Registro',
        description: 'As senhas não coincidem.',
      });
      return;
    }
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro de Configuração',
        description: 'O serviço de banco de dados não está disponível.',
      });
      return; // Previne a execução com firestore nulo
    }
    try {
      // Verifica se já existem usuários para definir o primeiro como admin
      const usersCollectionRef = collection(firestore, 'users');
      const q = query(usersCollectionRef, limit(1));
      const existingUsersSnapshot = await getDocs(q);
      const isFirstUser = existingUsersSnapshot.empty;

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`
      });

      // Define o cargo: 'admin' para o primeiro usuário, 'pending' para os demais
      const userRole = isFirstUser ? 'admin' : 'pending';

      // Create user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        firstName: data.firstName,
        lastName: data.lastName,
        registrationDate: serverTimestamp(),
        role: userRole,
      }, { merge: false });

      if(isFirstUser) {
        toast({
          title: 'Conta de Administrador Criada!',
          description: 'Você foi definido como o primeiro administrador do sistema.',
        });
        router.push('/dashboard');
      } else {
        router.push('/choose-plan');
      }

    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Erro de Registro',
        description: error.message || 'Ocorreu um erro ao criar a conta.',
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Registro</CardTitle>
        <CardDescription>
          Crie sua conta para começar a gerenciar suas finanças
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nome</Label>
              <Input id="first-name" placeholder="Seu nome" required {...register('firstName')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Sobrenome</Label>
              <Input id="last-name" placeholder="Seu sobrenome" required {...register('lastName')} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              {...register('email')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required {...register('password')} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input id="confirmPassword" type="password" required {...register('confirmPassword')} />
          </div>
          <Button type="submit" className="w-full">
            Criar conta
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{' '}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
