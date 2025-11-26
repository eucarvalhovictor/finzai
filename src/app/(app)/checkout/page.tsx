'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function CheckoutPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, firestore } = useFirebase();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const plan = searchParams.get('plan'); // 'basico' or 'completo'
    const planName = plan === 'basico' ? 'Básico' : plan === 'completo' ? 'Completo' : 'Nenhum';
    const price = plan === 'basico' ? 'R$15,00/mês' : plan === 'completo' ? 'R$39,90/mês' : 'R$0';

    if (!plan) {
        return (
            <Card className="max-w-md mx-auto">
                 <CardHeader>
                    <CardTitle>Nenhum Plano Selecionado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Por favor, volte e selecione um plano para continuar.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push('/choose-plan')} className="w-full">Escolher Plano</Button>
                </CardFooter>
            </Card>
        )
    }

    const handleConfirmPayment = async () => {
        if (!user || !firestore || !plan) return;

        setIsProcessing(true);
        const userDocRef = doc(firestore, 'users', user.uid);

        try {
            // Atualiza o cargo do usuário no Firestore
            await updateDoc(userDocRef, {
                role: plan as UserRole
            });

            toast({
                title: 'Assinatura Confirmada!',
                description: `Bem-vindo ao plano ${planName}!`,
            });
            
            // Redireciona para o dashboard após a confirmação
            router.push('/dashboard');

        } catch (error) {
            console.error("Erro ao confirmar pagamento: ", error);
            toast({
                variant: 'destructive',
                title: 'Erro na Assinatura',
                description: 'Não foi possível atualizar seu plano. Tente novamente.'
            });
            setIsProcessing(false);
        }
    };


    return (
        <div className="grid gap-8">
            <PageHeader
                title="Finalizar Assinatura"
                description="Confirme os detalhes do seu plano para concluir a compra."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Resumo do Pedido</CardTitle>
                        <CardDescription>Você está assinando o plano {planName}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Plano</span>
                            <span className="font-semibold">{planName}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Valor</span>
                            <span className="font-semibold">{price}</span>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground pt-4">
                           <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Acesso imediato aos recursos.</li>
                           <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Cobrança recorrente mensal.</li>
                           <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Cancele a qualquer momento.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações de Pagamento</CardTitle>
                        <CardDescription>Esta é uma simulação. Clique em confirmar para ativar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center gap-2 p-3 rounded-md border bg-muted">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                            <span className="font-mono text-sm">**** **** **** 1234</span>
                            <span className="ml-auto text-sm text-muted-foreground">12/28</span>
                         </div>
                         <p className="text-xs text-muted-foreground text-center">
                            Ao clicar em "Confirmar Pagamento", você concorda com nossos Termos de Serviço.
                         </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleConfirmPayment} disabled={isProcessing}>
                            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : "Confirmar Pagamento"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CheckoutPageContent />
        </Suspense>
    )
}
