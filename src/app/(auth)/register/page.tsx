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

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = () => {
    // Em uma aplicação real, aqui você criaria o usuário
    // Por enquanto, vamos apenas redirecionar para o dashboard
    router.push('/dashboard');
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
          <div className="grid gap-2">
            <Label htmlFor="first-name">Nome</Label>
            <Input id="first-name" placeholder="Seu nome" required {...register('name')} />
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
