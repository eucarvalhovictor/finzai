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
import { PlusCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { CreditCard, UserProfile, Transaction } from '@/lib/types';
import { useFirebase, useCollection, useDoc, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const cardSchema = z.object({
  cardHolderName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  cardNumber: z.string().length(4, 'Deve conter os 4 últimos dígitos.'),
  creditLimit: z.coerce.number().positive('O limite deve ser um número positivo.'),
  expiryDate: z.string().min(1, 'A data de vencimento é obrigatória.'),
});

type CardFormValues = z.infer<typeof cardSchema>;

export default function CreditCardsPage() {
  const { user, firestore } = useFirebase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  const cardsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/creditCards`);
  }, [user, firestore]);
  const { data: cards, isLoading: isLoadingCards } = useCollection<CreditCard>(cardsRef);
  
  const transactionsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/transactions`);
  }, [user, firestore]);
  const { data: transactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsRef);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      creditLimit: 0,
      expiryDate: '',
    },
  });

  function onSubmit(data: CardFormValues) {
    if (!user || !cardsRef) return;

    const newCardData = {
      userId: user.uid,
      balance: 0, // Saldo inicial
      ...data,
    };
    addDocumentNonBlocking(cardsRef, newCardData);
    form.reset();
    setIsDialogOpen(false);
  }
  
  function handleDeleteCard(cardId: string) {
    if (!user || !firestore) return;
    const cardDocRef = doc(firestore, `users/${user.uid}/creditCards`, cardId);
    try {
      deleteDocumentNonBlocking(cardDocRef);
      toast({
        title: 'Cartão Excluído',
        description: 'O cartão de crédito foi removido com sucesso.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Erro ao Excluir',
        description: 'Não foi possível remover o cartão.',
      });
    } finally {
        setCardToDelete(null);
    }
  }


  const userIsBasic = userProfile?.role === 'basico';
  const hasReachedCardLimit = userIsBasic && cards && cards.length >= 1;

  const isLoading = isLoadingCards || isLoadingProfile || isLoadingTransactions;

  return (
    <>
      <div className="grid gap-6">
        <PageHeader
          title="Gerenciamento de Cartões"
          description="Acompanhe os saldos, transações e datas de vencimento dos seus cartões."
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={hasReachedCardLimit || isLoading}>
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
                      name="cardHolderName"
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
                      name="cardNumber"
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
                      name="creditLimit"
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
                      name="expiryDate"
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
          {hasReachedCardLimit && (
              <p className="text-sm text-center text-muted-foreground -mt-4">
                  Seu plano Básico permite cadastrar apenas 1 cartão.
              </p>
          )}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {isLoading ? (
              Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
          ) : cards && cards.length > 0 ? cards.map((card) => {
            const cardTransactions = transactions?.filter(t => t.creditCardId === card.id) || [];
            const cardBalance = cardTransactions.reduce((acc, t) => acc + t.amount, 0);
            const usagePercentage = card.creditLimit > 0 ? (Math.abs(cardBalance) / card.creditLimit) * 100 : 0;
            return (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{card.cardHolderName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">
                          **** {card.cardNumber}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Ações do cartão</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setCardToDelete(card)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardDescription>
                    Vencimento em {card.expiryDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatCurrency(Math.abs(cardBalance))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {formatCurrency(card.creditLimit)}
                    </span>
                  </div>
                  <div>
                      <Progress value={usagePercentage} aria-label={`${usagePercentage.toFixed(0)}% usado`} />
                      <p className="text-xs text-muted-foreground text-right mt-1">{usagePercentage.toFixed(0)}% do limite utilizado</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Transações Recentes</h3>
                    {cardTransactions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cardTransactions.slice(0, 3).map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                <div className="font-medium">{tx.description}</div>
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
      <AlertDialog open={!!cardToDelete} onOpenChange={(isOpen) => !isOpen && setCardToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso irá excluir permanentemente o cartão <span className="font-bold">{cardToDelete?.cardHolderName} (final {cardToDelete?.cardNumber})</span>.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setCardToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                      onClick={() => cardToDelete && handleDeleteCard(cardToDelete.id)}
                      className="bg-destructive hover:bg-destructive/90"
                      >
                      Sim, excluir cartão
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
