'use client';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Bot, CreditCard, ShieldCheck, Crown } from 'lucide-react';
import Link from 'next/link';
import { CookieConsentBanner } from '@/components/ui/cookie-consent-banner';
import React from 'react';

const featuresBasic = [
  'Gerenciamento de Transações',
  'Dashboard Financeiro',
  'Criação de Cartões de Crédito (1)',
  'Suporte por E-mail',
];

const featuresComplete = [
  'Todos os benefícios do Básico',
  'Criação de Cartões Ilimitada',
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
              <Link href="/login">Área de Membros</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 sm:py-32 animate-on-scroll">
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
                 <div className="max-w-xl mx-auto text-center mb-16 animate-on-scroll">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tudo que você precisa em um só lugar</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Ferramentas poderosas para transformar sua relação com o dinheiro.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <Card className="flex flex-col items-center text-center p-8 animate-on-scroll bg-card/50 hover-lift">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Bot className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold">Consultor AI</h3>
                        <p className="mt-2 text-muted-foreground">Receba insights e sugestões personalizadas para otimizar seus gastos e investimentos. (Plano Completo)</p>
                    </Card>
                     <Card className="flex flex-col items-center text-center p-8 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: '200ms'}}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold">Gestão de Cartões</h3>
                        <p className="mt-2 text-muted-foreground">Visualize todas as suas faturas, limites e despesas de cartão de crédito em um único dashboard.</p>
                    </Card>
                     <Card className="flex flex-col items-center text-center p-8 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: '400ms'}}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold">Segurança Avançada</h3>
                        <p className="mt-2 text-muted-foreground">Seus dados são protegidos com criptografia de ponta, garantindo total privacidade e segurança.</p>
                    </Card>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Planos para cada jornada financeira</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Escolha o plano que melhor se adapta às suas necessidades e comece a transformar suas finanças hoje.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              {/* Basic Plan */}
              <Card className="flex flex-col rounded-2xl animate-on-scroll bg-card/50 hover-lift">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl">Básico</CardTitle>
                  <CardDescription>Para quem está começando a organizar as finanças.</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">R$15</span>
                    <span className="text-muted-foreground">/mês</span>
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
                  <Card className="flex flex-col rounded-2xl border-2 border-primary shadow-2xl shadow-primary/10 bg-card/80 hover-lift h-full">
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
