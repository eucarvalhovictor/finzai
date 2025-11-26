
'use client';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Bot, CreditCard, ShieldCheck, Crown, LogIn, TrendingUp, Star, Instagram, Mail, BrainCircuit, Banknote, Shield, Users, Play } from 'lucide-react';
import Link from 'next/link';
import { CookieConsentBanner } from '@/components/ui/cookie-consent-banner';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';


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
        question: "Que tipo de investimentos posso acompanhar?",
        answer: "Nossa plataforma suporta uma vasta gama de ativos, incluindo Ações, Fundos Imobiliários (FIIs), BDRs, Renda Fixa (CDB, LCI, LCA) e as principais Criptomoedas. Você terá uma visão completa e unificada de todo o seu patrimônio."
    },
    {
        question: "Posso cancelar minha assinatura a qualquer momento?",
        answer: "Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas ou burocracia. Você continuará com acesso aos recursos do seu plano até o final do período de faturamento atual."
    },
    {
        question: "Como funciona o upgrade do plano Básico para o Completo?",
        answer: "Você pode fazer o upgrade a qualquer momento diretamente pelo seu painel de usuário. O valor será calculado proporcionalmente e o acesso às funcionalidades do plano Completo é liberado imediatamente."
    }
];

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Engenheiro de Software',
    avatar: 'CM',
    comment: 'O consultor de IA é simplesmente revolucionário. Finalmente entendi para onde meu dinheiro estava indo e comecei a investir com muito mais confiança. Vale cada centavo do plano Completo!'
  },
  {
    name: 'Juliana P.',
    role: 'Designer Freelancer',
    avatar: 'JP',
    comment: 'Como freelancer, ter todas as minhas finanças e cartões em um só lugar me poupa horas de trabalho administrativo. A interface é limpa e super intuitiva. Recomendo demais!'
  },
  {
    name: 'Fernando L.',
    role: 'Pequeno Empresário',
    avatar: 'FL',
    comment: 'A FinzAI transformou a maneira como eu vejo meu patrimônio. Acompanhar meus investimentos junto com as despesas me deu uma clareza que nenhuma outra plataforma ofereceu.'
  },
  {
    name: 'Ana B.',
    role: 'Advogada',
    avatar: 'AB',
    comment: 'A segurança era minha maior preocupação e a FinzAI superou minhas expectativas. Sinto que meus dados estão mais seguros aqui do que no meu próprio banco. Excelente trabalho!'
  },
  {
    name: 'Ricardo S.',
    role: 'Estudante Universitário',
    avatar: 'RS',
    comment: 'Comecei com o plano básico para organizar minha mesada e despesas. É incrível como a plataforma é fácil de usar. Já estou planejando meu upgrade para o plano Completo!'
  },
  {
    name: 'Beatriz G.',
    role: 'Médica',
    avatar: 'BG',
    comment: 'Plataforma fantástica! A capacidade de visualizar a alocação dos meus investimentos por corretora me deu a confiança que eu precisava para diversificar melhor minha carteira. Indispensável!'
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
  
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo />
          <nav className="hidden items-center gap-2 sm:gap-4 md:flex">
            <Button variant="ghost" asChild>
              <a href="#benefits" onClick={(e) => handleScrollTo(e, 'benefits')}>Benefícios</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#testimonials" onClick={(e) => handleScrollTo(e, 'testimonials')}>Avaliações</a>
            </Button>
             <Button variant="ghost" asChild>
              <a href="#pricing" onClick={(e) => handleScrollTo(e, 'pricing')}>Planos</a>
            </Button>
             <Button variant="ghost" asChild>
              <a href="#faq" onClick={(e) => handleScrollTo(e, 'faq')}>FAQ</a>
            </Button>
          </nav>
          <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2" />
                Área de Membros
              </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col justify-center items-center min-h-screen py-24 sm:py-32 animate-on-scroll">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6 flex justify-center animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-muted/50 text-foreground py-2 px-4 rounded-full border">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Consultor AI disponível</span>
                </div>
             </div>
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
                 <a href="#pricing" onClick={(e) => handleScrollTo(e, 'pricing')}>Ver Planos</a>
              </Button>
               <Button size="lg" variant="outline" asChild>
                <Link href="#">
                  <Play className="mr-2" />
                  Ver Demonstração
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8"><Separator /></div>

        {/* Why Choose Us Section */}
        <section id="benefits" className="flex flex-col justify-center min-h-screen py-20 sm:py-24 bg-muted/30">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl text-center mx-auto mb-12 animate-on-scroll">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Porque escolher a FinzAI?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Ferramentas poderosas para transformar sua relação com o dinheiro.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="flex flex-col text-left p-6 animate-on-scroll bg-card/50 hover-lift">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <BrainCircuit className="h-7 w-7" />
                        </div>
                        <CardHeader className='p-0 pt-4'>
                            <CardTitle className="text-xl">Inteligência que Guia</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 pt-2">
                            <p className="text-muted-foreground">Nosso Consultor AI não apenas mostra números, ele os traduz em ações. Receba insights sobre seus gastos, sugestões de orçamento e recomendações de investimento alinhadas ao seu perfil.</p>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col text-left p-6 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: '200ms'}}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <Banknote className="h-7 w-7" />
                        </div>
                        <CardHeader className='p-0 pt-4'>
                            <CardTitle className="text-xl">Visão 360° do seu Dinheiro</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 pt-2">
                           <p className="text-muted-foreground">Unifique contas, cartões de crédito e investimentos (Ações, FIIs, Renda Fixa, Cripto). Tenha uma visão completa do seu patrimônio em um dashboard simples e poderoso.</p>
                        </CardContent>
                    </Card>
                     <Card className="flex flex-col text-left p-6 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: '400ms'}}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <Shield className="h-7 w-7" />
                        </div>
                        <CardHeader className='p-0 pt-4'>
                            <CardTitle className="text-xl">Segurança em Primeiro Lugar</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 pt-2">
                           <p className="text-muted-foreground">Seus dados são criptografados com os mais altos padrões de segurança. Construímos nossa plataforma sobre a infraestrutura robusta do Google para garantir sua total tranquilidade.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8"><Separator /></div>

        {/* Testimonials Section */}
        <section id="testimonials" className="flex flex-col justify-center min-h-screen py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl text-center mx-auto mb-12 animate-on-scroll">
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`h-6 w-6 text-yellow-400 fill-yellow-400 ${i === 4 ? 'text-yellow-400/70 fill-yellow-400/70' : ''}`} />
                        ))}
                    </div>
                    <p className="font-semibold">Avaliação média de 4.9 de 5 estrelas</p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-2">Amada por mais de 5.000 usuários satisfeitos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col p-6 animate-on-scroll bg-card/50 hover-lift" style={{animationDelay: `${index * 150}ms`}}>
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <CardContent className="flex-1 p-0">
                                <p className="text-muted-foreground">"{testimonial.comment}"</p>
                            </CardContent>
                            <CardFooter className="p-0 mt-6 flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-16 animate-on-scroll">
                    <h3 className="text-xl font-semibold">Junte-se a milhares de pessoas que estão no controle de suas finanças</h3>
                    <Button size="lg" className="mt-6 cta-button" asChild>
                        <Link href="/register">Eu quero ter o controle também</Link>
                    </Button>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8"><Separator /></div>

        {/* Pricing Section */}
        <section id="pricing" className="flex flex-col justify-center min-h-screen py-20 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center mb-4 animate-on-scroll">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Planos para cada jornada financeira</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Escolha o plano que melhor se adapta às suas necessidades e comece a transformar suas finanças hoje.
              </p>
            </div>
             <div className="text-center mb-16 animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-muted/50 text-foreground py-2 px-4 rounded-full border">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Garantia incondicional de 7 dias.</span>
                </div>
             </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto items-end">
              {/* Basic Plan */}
              <Card className="flex flex-col rounded-2xl animate-on-scroll bg-card/50 hover-lift h-full md:h-[95%]">
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
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/register">Começar com o Básico</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Complete Plan */}
              <div className="relative animate-on-scroll hover-lift">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold border border-primary-foreground/20">
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
                        <Link href="/register">Assinar o Completo</Link>
                      </Button>
                    </CardFooter>
                  </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8"><Separator /></div>

         {/* FAQ Section */}
        <section id="faq" className="flex flex-col justify-center min-h-screen py-20 sm:py-24">
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
      
      <footer className="py-16 border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
                <AppLogo />
                <p className="text-muted-foreground max-w-xs">
                    A plataforma inteligente que centraliza suas finanças, de cartões a investimentos, com o poder da inteligência artificial para te guiar.
                </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
                <h3 className="font-semibold text-lg">Contato</h3>
                <div className="flex flex-col gap-2 text-muted-foreground">
                    <a href="#" className="flex items-center gap-2 hover:text-primary">
                        <Mail className="h-4 w-4"/>
                        <span>contato@finzai.com</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 hover:text-primary">
                        <Instagram className="h-4 w-4"/>
                        <span>@finz_ai</span>
                    </a>
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
                 <h3 className="font-semibold text-lg">Pronto para começar?</h3>
                 <p className="text-muted-foreground">Crie sua conta e transforme sua vida financeira.</p>
                 <Button asChild className="cta-button">
                    <Link href="/register">Começar agora</Link>
                 </Button>
            </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} FinzAI. Todos os direitos reservados.
        </div>
      </footer>
      <CookieConsentBanner />
    </div>
  );
}

    
