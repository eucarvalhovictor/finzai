'use client';

import { useMemo, useState, useEffect } from 'react';
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
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import type { Transaction, Investment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
}

export default function DashboardPage() {
  const { user, firestore } = useFirebase();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Bom dia';
      if (hour < 18) return 'Boa tarde';
      return 'Boa noite';
    };
    setGreeting(getGreeting());
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  const transactionsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/transactions`);
  }, [user, firestore]);

  const recentTransactionsQuery = useMemoFirebase(() => {
    if (!transactionsRef) return null;
    return query(transactionsRef, orderBy('date', 'desc'), limit(5));
  }, [transactionsRef]);
  
  const investmentsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/investments`);
  }, [user, firestore]);

  const { data: allTransactions, isLoading: isLoadingAll } = useCollection<Transaction>(transactionsRef);
  const { data: recentTransactions, isLoading: isLoadingRecent } = useCollection<Transaction>(recentTransactionsQuery);
  const { data: investments, isLoading: isLoadingInvestments } = useCollection<Investment>(investmentsRef);

  const financialSummary = useMemo(() => {
    if (!allTransactions) {
      return {
        totalBalance: 0,
        totalDebt: 0,
        netWorth: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
      };
    }
    
    const transactionSummary = allTransactions.reduce((acc, t) => {
        if (t.transactionType === 'income') {
            acc.income += t.amount;
        } else {
            // Expenses are stored as negative values
            acc.expenses += t.amount;
        }
        return acc;
    }, { income: 0, expenses: 0 });
    
    // Correctly calculate the debt for the current month's credit card bill
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalDebt = allTransactions
        .filter(t => {
            if (t.paymentMethod !== 'card' || t.transactionType !== 'expense') {
                return false;
            }
            // Ensure t.date is valid and can be converted to a Date object
            if (t.date && typeof t.date.toDate === 'function') {
                const transactionDate = t.date.toDate();
                return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
            }
            return false;
        })
        .reduce((sum, t) => sum + t.amount, 0);


    const totalBalance = transactionSummary.income + transactionSummary.expenses;
    const netWorth = investments?.reduce((sum, inv) => sum + (inv.quantity * inv.valuePerShare), 0) || 0;

    return {
      totalBalance: totalBalance,
      totalDebt: totalDebt, // This will be a negative number, use Math.abs() for display
      netWorth: netWorth,
      monthlyIncome: transactionSummary.income,
      monthlyExpenses: transactionSummary.expenses,
    };

  }, [allTransactions, investments]);

  const isLoading = isLoadingAll || isLoadingProfile || isLoadingInvestments;

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

  const userName = userProfile ? `${userProfile.firstName}` : (user?.displayName?.split(' ')[0] || 'Usuário');
  const pageTitle = isLoadingProfile || !greeting ? 'Carregando...' : `${greeting}, ${userName}`;

  return (
    <div className="grid gap-6">
      <PageHeader
        title={pageTitle}
        description="Aqui está um resumo do seu status financeiro atual."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
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
                <div className="text-xl font-bold sm:text-2xl">
                  {formatCurrency(financialSummary.netWorth)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de seus investimentos
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {formatCurrency(financialSummary.totalBalance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Em todas as suas contas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próxima Fatura do Cartão</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-destructive sm:text-2xl">
                  {formatCurrency(Math.abs(financialSummary.totalDebt))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor estimado da fatura deste mês
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRecent ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
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
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${transaction.transactionType === 'income' ? 'text-primary' : 'text-foreground'}`}>
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
