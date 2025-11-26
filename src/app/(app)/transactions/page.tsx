'use client';
import { PageHeader } from '@/components/page-header';
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
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Transaction } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionForm } from '../_components/transaction-form';


function TransactionsTable({ transactions, isLoading }: { transactions: Transaction[] | null, isLoading: boolean }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                    </TableRow>
                ))
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatFirebaseTimestamp(transaction.date)}</TableCell>
                <TableCell className={`text-right font-medium ${transaction.transactionType === 'income' ? 'text-primary' : ''}`}>
                  {transaction.transactionType === 'expense' && '-'}{formatCurrency(Math.abs(transaction.amount))}
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                        Nenhuma transação encontrada.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function TransactionsPage() {
  const { user, firestore } = useFirebase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleTransactionSaved = () => {
    setIsDialogOpen(false);
  };

  const AddTransactionButton = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Adicionar Transação
    </Button>
  );

  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/transactions`), orderBy('date', 'desc'));
  }, [user, firestore]);

  const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

  const incomeTransactions = transactions?.filter(t => t.transactionType === 'income') || [];
  const expenseTransactions = transactions?.filter(t => t.transactionType === 'expense') || [];

  const renderAddTransaction = () => {
    if (!hasMounted) {
      return (
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Transação
        </Button>
      );
    }
    if (isMobile) {
      return (
        <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <SheetTrigger asChild>
            {AddTransactionButton}
          </SheetTrigger>
          <SheetContent side="bottom" className="sm:max-w-lg mx-auto rounded-t-lg">
            <SheetHeader>
              <SheetTitle>Adicionar Nova Transação</SheetTitle>
              <SheetDescription>Preencha os detalhes da sua nova transação.</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <TransactionForm onTransactionSaved={handleTransactionSaved} />
            </div>
          </SheetContent>
        </Sheet>
      );
    }
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {AddTransactionButton}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Transação</DialogTitle>
            <DialogDescription>Preencha os detalhes da sua nova transação.</DialogDescription>
          </DialogHeader>
          <TransactionForm onTransactionSaved={handleTransactionSaved} />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Rendas & Despesas"
        description="Acompanhe todas as suas transações financeiras em um só lugar."
      >
        {renderAddTransaction()}
      </PageHeader>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Rendas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TransactionsTable transactions={transactions} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionsTable transactions={incomeTransactions} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="expenses">
          <TransactionsTable transactions={expenseTransactions} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
