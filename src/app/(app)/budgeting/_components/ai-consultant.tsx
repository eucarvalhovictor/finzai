'use client';

import { useFormState } from 'react-dom';
import { generateFinancialAnalysis, type AnalysisState } from '../actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, AlertCircle, Loader2 } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Transaction, Investment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

const initialState: AnalysisState = {
  message: '',
  isSuccess: false,
};

export function AIConsultant() {
  const { user, firestore } = useFirebase();
  const [isPending, setIsPending] = useState(false);

  // Busca transações
  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/transactions`);
  }, [user, firestore]);
  const { data: transactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsQuery);
  
  // Busca investimentos do Firestore
  const investmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/investments`);
  }, [user, firestore]);
  const { data: investments, isLoading: isLoadingInvestments } = useCollection<Investment>(investmentsQuery);

  const canAnalyze = transactions && transactions.length >= 10;
  
  const [state, formAction] = useFormState(generateFinancialAnalysis, initialState);

  const handleAnalysis = async () => {
    if (!transactions || !investments) return;
    
    // Inicia a transição de estado pendente
    setIsPending(true);
    
    // Mapeia os investimentos para o formato esperado pela IA
    const analysisInvestments = investments.map(inv => ({
        name: inv.name,
        type: inv.type,
        value: inv.quantity * inv.valuePerShare,
        changePercent: 0, // Placeholder, a IA não usa este campo atualmente
    }));

    // Chama a server action com os dados
    await formAction({ transactions, investments: analysisInvestments });

    // Finaliza a transição de estado pendente
    setIsPending(false);
  }

  return (
    <div className="grid gap-6">
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" />
                Sua Análise Financeira Personalizada
            </CardTitle>
            <CardDescription>Clique no botão abaixo para que nossa IA analise seu perfil de transações e investimentos, e forneça insights e recomendações para otimizar suas finanças.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions || isLoadingInvestments ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ) : !canAnalyze ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Dados Insuficientes</AlertTitle>
                    <AlertDescription>
                        É necessário ter pelo menos 10 transações (despesas ou receitas) registradas para que a análise possa ser realizada.
                        Você tem atualmente {transactions?.length || 0} transações.
                    </AlertDescription>
                </Alert>
            ) : (
                 <p className="text-sm text-muted-foreground">
                    Tudo pronto! Temos {transactions?.length} transações e {investments?.length || 0} investimentos para analisar.
                </p>
            )}
            {!state.isSuccess && state.message && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro na Análise</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalysis} disabled={!canAnalyze || isPending} className="w-full sm:w-auto">
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analisando...
                    </>
                ) : "Analisar Minhas Finanças"}
            </Button>
          </CardFooter>
      </Card>

    {isPending && (
        <Card>
            <CardHeader>
                <CardTitle>Analisando seus dados...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    )}

      {state.isSuccess && state.analysis && (
         <Card>
            <CardHeader>
                <CardTitle>Resultados da Análise</CardTitle>
            </CardHeader>
            <CardContent>
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: state.analysis.replace(/##/g, '<h3>').replace(/\n/g, '<br />') }} 
                />
            </CardContent>
        </Card>
      )}
    </div>
  );
}
