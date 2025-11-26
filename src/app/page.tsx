'use client';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Bot, CreditCard, ShieldCheck, Crown, LogIn, BadgeCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { CookieConsentBanner } from '@/components/ui/cookie-consent-banner';
import React from 'react';

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

const faqItems = [
    {
        question: "Como o Consultor AI funciona?",
        answer: "Nosso consultor de IA analisa suas transações e investimentos para identificar padrões, sugerir orçamentos e fornecer dicas personalizadas de economia e investimento. Esta funcionalidade está disponível exclusivamente no Plano Completo."
    },
    {
        question: "Meus dados financeiros estão seguros?",
        answer: "Sim. A segurança dos seus dados é nossa prioridade máxima. Usamos criptografia de ponta e seguimos as melhores práticas de segurança do setor para garantir que suas informações financeiras permaneçam confidenciais e protegidas."
    },
    {
        question: "Posso cancelar minha assinatura a qualquer momento?",
        answer: "Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas ou burocracia. Você continuará com acesso aos recursos do seu plano até o final do período de faturamento atual."
    }
];

export default function LandingPage() {
  React.useEffect(() => {
    const sections = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);
  
  const handleScrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <a href="#pricing" onClick={handleScrollToPricing}>Planos</a>
            </Button>
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2" />
                Área de Membros
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 animate-on-scroll">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Sua vida financeira,{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                finalmente em ordem.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              A plataforma inteligente que centraliza suas finanças, de cartões a investimentos, com o poder da inteligência artificial para te guiar.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild className="cta-button">
                <Link href="/register">Comece agora, é grátis</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-24 bg-muted/30">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl text-center mx-auto mb-12 animate-on-scroll">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tudo que você precisa em um só lugar</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Ferramentas poderosas para transformar sua relação com o dinheiro.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="flex flex-col text-left p-6 animate-on-scroll bg-card/50 hover-lift">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <Bot className="h-7 w-7" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">Consultor Financeiro com IA</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">Receba insights e orçamentos personalizados, e entenda para onde seu dinheiro está indo. Nossa IA analisa seus padrões de gastos e investimentos para fornecer recomendações que te ajudam a economizar e a investir melhor.</p>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col text-left p-6 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: '200ms'}}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <CreditCard className="h-7 w-7" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">Gestão de Cartões Simplificada</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                           <p className="text-muted-foreground">Visualize todas as suas faturas, limites e despesas de cartão em um único dashboard. Centralize a informação e nunca mais perca uma data de vencimento ou se surpreenda com o valor da fatura.</p>
                        </CardContent>
                    </Card>
                     <Card className="flex flex-col text-left p-6 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: '400ms'}}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">Carteira de Investimentos Unificada</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                           <p className="text-muted-foreground">Acompanhe o desempenho de todos os seus ativos em um só lugar. Suportamos Ações, FIIs, BDRs, Renda Fixa (CDB, LCA, etc.) e Criptomoedas para que você tenha uma visão completa do seu patrimônio.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center mb-4 animate-on-scroll">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Planos para cada jornada financeira</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Escolha o plano que melhor se adapta às suas necessidades e comece a transformar suas finanças hoje.
              </p>
            </div>
             <div className="text-center mb-16 animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-muted/50 text-foreground py-2 px-4 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Garantia incondicional de 7 dias.</span>
                </div>
             </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto items-end">
              {/* Basic Plan */}
              <Card className="flex flex-col rounded-2xl animate-on-scroll bg-card/50 hover-lift">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl">Básico</CardTitle>
                  <CardDescription>Para quem está começando a organizar as finanças.</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">R$15</span>
                    <span className="text-muted-foreground">,00/mês</span>
                  </div>
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
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/register">Começar com o Básico</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Complete Plan */}
              <div className="relative animate-on-scroll">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      <Crown className="h-4 w-4" />
                      MAIS POPULAR
                    </div>
                  </div>
                  <Card className="flex flex-col rounded-2xl border-2 border-primary shadow-2xl shadow-primary/10 bg-card/80">
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl">Completo</CardTitle>
                      <CardDescription>Para investidores e quem busca otimização máxima.</CardDescription>
                      <div className="pt-4">
                        <span className="text-4xl font-bold">R$39</span>
                        <span className="text-muted-foreground">,90/mês</span>
                      </div>
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
                        <Link href="/register">Assinar o Completo</Link>
                      </Button>
                    </CardFooter>
                  </Card>
              </div>
            </div>
          </div>
        </section>

         {/* FAQ Section */}
        <section className="py-20 sm:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="text-center mb-12 animate-on-scroll">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Perguntas Frequentes</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Tudo o que você precisa saber antes de começar.</p>
                </div>
                <Accordion type="single" collapsible className="w-full animate-on-scroll">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-left hover:no-underline">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} FinzAI. Todos os direitos reservados.
        </div>
      </footer>
      <CookieConsentBanner />
    </div>
  );
}
