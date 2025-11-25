'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatFirebaseTimestamp } from '@/lib/data';
import { DollarSign, Wallet, Landmark } from 'lucide-react';
import { DashboardChart } from './_components/dashboard-chart';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Transaction } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, firestore } = useFirebase();

  const transactionsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/transactions`);
  }, [user, firestore]);

  const recentTransactionsQuery = useMemoFirebase(() => {
    if (!transactionsRef) return null;
    return query(transactionsRef, orderBy('date', 'desc'), limit(5));
  }, [transactionsRef]);

  const { data: allTransactions, isLoading: isLoadingAll } = useCollection<Transaction>(transactionsRef);
  const { data: recentTransactions, isLoading: isLoadingRecent } = useCollection<Transaction>(recentTransactionsQuery);
  
  const financialSummary = useMemo(() => {
    if (!allTransactions) {
      return {
        totalBalance: 0,
        totalDebt: 0, // Placeholder, will be calculated from cards later
        netWorth: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
      };
    }
    const income = allTransactions
      .filter(t => t.transactionType === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = allTransactions
      .filter(t => t.transactionType === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
      
    const totalBalance = income + expenses; // expenses are negative

    return {
      totalBalance: totalBalance,
      totalDebt: 0, // Placeholder
      netWorth: totalBalance, // Placeholder
      monthlyIncome: income,
      monthlyExpenses: expenses,
    };

  }, [allTransactions]);

  const CardSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Visão Geral Financeira"
        description="Aqui está um resumo do seu status financeiro atual."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingAll ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(financialSummary.netWorth)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sua saúde financeira total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(financialSummary.totalBalance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Em todas as suas contas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dívida Total</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(financialSummary.totalDebt)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Saldos de cartão de crédito
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Renda vs. Despesas</CardTitle>
            <CardDescription>Fluxo de caixa mensal dos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
             <DashboardChart transactions={allTransactions} isLoading={isLoadingAll} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Suas últimas atividades financeiras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRecent ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  recentTransactions && recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{formatFirebaseTimestamp(transaction.date)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${transaction.transactionType === 'income' ? 'text-primary' : 'text-destructive'}`}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
                 {!isLoadingRecent && (!recentTransactions || recentTransactions.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">Nenhuma transação recente.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    