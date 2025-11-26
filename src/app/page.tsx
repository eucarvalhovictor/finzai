'use client';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const featuresBasic = [
  'Gerenciamento de Transações',
  'Criação de Cartões de Crédito (1)',
  'Dashboard Financeiro',
  'Suporte por E-mail',
];

const featuresComplete = [
  'Todos os benefícios do Básico',
  'Criação de Cartões Ilimitada',
  'Consultor Financeiro com IA',
  'Gerenciamento de Investimentos',
  'Suporte Prioritário',
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrar</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Organize suas finanças, otimize seus investimentos.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              A plataforma inteligente que centraliza sua vida financeira, de cartões a investimentos, com o poder da inteligência artificial.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Comece Agora - É Grátis</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-32 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Planos para cada jornada financeira</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Escolha o plano que melhor se adapta às suas necessidades e comece a transformar suas finanças hoje.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              {/* Basic Plan */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Básico</CardTitle>
                  <CardDescription>Para quem está começando a organizar as finanças.</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">R$15</span>
                    <span className="text-muted-foreground">,00/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {featuresBasic.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Assinar Básico</Button>
                </CardFooter>
              </Card>

              {/* Complete Plan */}
              <Card className="flex flex-col border-primary shadow-lg">
                 <CardHeader>
                  <CardTitle>Completo</CardTitle>
                  <CardDescription>Para investidores e quem busca otimização máxima.</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">R$39</span>
                    <span className="text-muted-foreground">,90/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {featuresComplete.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Assinar Completo</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} FinzAI. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
