'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Check, Crown, ShieldCheck } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

const featuresBasic = [
  'Gerencie transações',
  'Dashboard Financeiro',
  'Gerencie cartões de crédito (1)',
  'Suporte por E-mail',
];

const featuresComplete = [
  'Todos os benefícios do Básico',
  'Gerenciamento de cartões ilimitado',
  'Consultor Financeiro com IA',
  'Gerenciamento de Investimentos',
  'Suporte Prioritário 24/7',
];

export default function ChoosePlanPage() {
    const { user } = useFirebase();
    const router = useRouter();

    if (!user) {
        // Idealmente, o layout já deveria ter redirecionado, mas é uma segurança extra.
        router.push('/login');
        return null;
    }
  
  return (
    <div className="grid gap-8">
      <PageHeader
        title="Escolha seu Plano"
        description="Selecione o plano que melhor se adapta à sua jornada financeira para começar."
      />
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-muted/50 text-foreground py-2 px-4 rounded-full border">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">Garantia incondicional de 7 dias.</span>
        </div>
        </div>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto items-end">
          {/* Basic Plan */}
          <Card className="flex flex-col rounded-2xl h-full">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl">Básico</CardTitle>
              <CardDescription>Para quem está começando a organizar as finanças.</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">R$15</span>
                <span className="text-muted-foreground">,00/mês</span>
              </div>
               <p className="text-xs text-muted-foreground pt-2">Cobrança recorrente. Não compromete o limite do seu cartão. Cancele quando quiser.</p>
            </CardHeader>
            <CardContent className="flex-1 p-8 pt-0">
              <ul className="space-y-4">
                {featuresBasic.map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8">
              <Button className="w-full" asChild>
                <Link href="/checkout?plan=basico">Assinar o Básico</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Complete Plan */}
          <div className="relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold border border-primary-foreground/20">
                  <Crown className="h-4 w-4" />
                  MAIS POPULAR
                </div>
              </div>
              <Card className="flex flex-col rounded-2xl border-2 border-primary shadow-2xl shadow-primary/10">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl">Completo</CardTitle>
                  <CardDescription>Para investidores e quem busca otimização máxima.</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">R$39</span>
                    <span className="text-muted-foreground">,90/mês</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">Cobrança recorrente. Não compromete o limite do seu cartão. Cancele quando quiser.</p>
                </CardHeader>
                <CardContent className="flex-1 p-8 pt-0">
                  <ul className="space-y-4">
                    {featuresComplete.map(feature => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8">
                  <Button className="w-full cta-button" asChild>
                    <Link href="/checkout?plan=completo">Assinar o Completo</Link>
                  </Button>
                </CardFooter>
              </Card>
          </div>
        </div>
    </div>
  );
}
