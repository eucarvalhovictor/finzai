'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { CreditCard } from '@/lib/types';

const cardSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  last4: z.string().length(4, 'Deve conter os 4 últimos dígitos.'),
  limit: z.coerce.number().positive('O limite deve ser um número positivo.'),
  dueDate: z.string().min(1, 'A data de vencimento é obrigatória.'),
});

type CardFormValues = z.infer<typeof cardSchema>;

export default function CreditCardsPage() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: '',
      last4: '',
      limit: 0,
      dueDate: '',
    },
  });

  function onSubmit(data: CardFormValues) {
    const newCard: CreditCard = {
      id: new Date().toISOString(),
      balance: 0,
      transactions: [],
      ...data,
    };
    setCards(prev => [...prev, newCard]);
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gerenciamento de Cartões"
        description="Acompanhe os saldos, transações e datas de vencimento dos seus cartões."
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Cartão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do seu novo cartão de crédito.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Nome</FormLabel>
                        <FormControl className="col-span-3">
                          <Input placeholder="Ex: Cartão Principal" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last4"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Últimos 4 dígitos</FormLabel>
                        <FormControl className="col-span-3">
                          <Input type="text" placeholder="1234" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Limite</FormLabel>
                        <FormControl className="col-span-3">
                          <Input type="number" placeholder="5000" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Vencimento</FormLabel>
                        <FormControl className="col-span-3">
                          <Input placeholder="dia 10 de cada mês" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Salvar Cartão</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {cards.length > 0 ? cards.map((card) => {
          const usagePercentage = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
          return (
            <Card key={card.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{card.name}</CardTitle>
                  <span className="text-sm font-mono text-muted-foreground">
                    **** {card.last4}
                  </span>
                </div>
                <CardDescription>
                  Vencimento em {card.dueDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {formatCurrency(card.balance)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {formatCurrency(card.limit)}
                  </span>
                </div>
                <Progress value={usagePercentage} aria-label={`${usagePercentage.toFixed(0)}% usado`} />
                <div>
                  <h3 className="mb-2 text-sm font-medium">Transações Recentes</h3>
                   {card.transactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {card.transactions.slice(0, 3).map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              <div className="font-medium">{tx.description}</div>
                              <div className="text-xs text-muted-foreground">{tx.date}</div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(tx.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma transação recente.</p>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        }) : (
            <Card className="flex items-center justify-center h-64 col-span-2">
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhum cartão de crédito adicionado.</p>
                    <p className="text-sm text-muted-foreground mt-2">Adicione seu primeiro cartão para começar.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
