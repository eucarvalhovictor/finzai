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
import { transactions as allTransactions, formatCurrency } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { useRouter } from 'next/navigation';

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
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
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-primary' : ''}`}>
                  {transaction.type === 'expense' && '-'}{formatCurrency(Math.abs(transaction.amount))}
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
  // In a real app, this state would come from a global store or be fetched from an API
  const [transactions, setTransactions] = useState(allTransactions);
  const router = useRouter();

  const handleAddTransactionClick = () => {
    // This now just opens the dialog via a query param handled in the sidebar
    router.push('/transactions?action=add', { scroll: false });
  };


  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Rendas & Despesas"
        description="Acompanhe todas as suas transações financeiras em um só lugar."
      >
        <Button onClick={handleAddTransactionClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Transação
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Rendas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TransactionsTable transactions={transactions} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionsTable transactions={incomeTransactions} />
        </TabsContent>
        <TabsContent value="expenses">
          <TransactionsTable transactions={expenseTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
