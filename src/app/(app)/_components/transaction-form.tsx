'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFirebase, addDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CreditCard } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

const transactionCategories = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Entretenimento',
  'Saúde',
  'Compras',
  'Serviços',
  'Outros',
] as const;

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.coerce.number().positive('O valor deve ser um número positivo'),
  transactionType: z.enum(['income', 'expense'], { required_error: 'Selecione o tipo.' }),
  category: z.string().optional(),
  paymentMethod: z.enum(['cash', 'pix', 'card'], { required_error: 'Selecione o método.' }),
  creditCardId: z.string().optional(),
}).refine(data => {
  if (data.paymentMethod === 'card') {
    return !!data.creditCardId;
  }
  return true;
}, {
  message: 'Selecione um cartão de crédito.',
  path: ['creditCardId'],
}).refine(data => {
    // A categoria só é obrigatória se for uma despesa
    if (data.transactionType === 'expense') {
        return !!data.category && data.category.length > 0;
    }
    return true;
}, {
    message: 'Selecione uma categoria.',
    path: ['category'],
});


type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    onTransactionSaved: () => void;
}

export function TransactionForm({ onTransactionSaved }: TransactionFormProps) {
  const { firestore, user } = useFirebase();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const creditCardsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/creditCards`);
  }, [firestore, user]);
  const { data: creditCards, isLoading: isLoadingCards } = useCollection<CreditCard>(creditCardsRef);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      transactionType: 'expense',
      paymentMethod: 'cash',
    },
  });

  const paymentMethod = form.watch('paymentMethod');
  const transactionType = form.watch('transactionType');
  
  async function onSubmit(data: TransactionFormValues) {
    if (!firestore || !user) {
        console.error("Firestore or user not available");
        return;
    }

    const transactionsCollection = collection(firestore, `users/${user.uid}/transactions`);

    const newTransactionData = {
        userId: user.uid,
        description: data.description,
        amount: data.transactionType === 'income' ? data.amount : -data.amount,
        category: data.transactionType === 'income' ? 'Renda' : data.category,
        transactionType: data.transactionType,
        paymentMethod: data.paymentMethod,
        creditCardId: data.creditCardId || null,
        date: serverTimestamp(),
    };

    addDocumentNonBlocking(transactionsCollection, newTransactionData);

    form.reset();
    onTransactionSaved();
  }

  const renderDesktopForm = () => (
    <>
        <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel>Tipo de Transação</FormLabel>
                <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col sm:flex-row sm:space-x-4"
                >
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="expense" id="expense_desktop" />
                    </FormControl>
                    <FormLabel htmlFor="expense_desktop" className="font-normal">Despesa</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="income" id="income_desktop" />
                    </FormControl>
                    <FormLabel htmlFor="income_desktop" className="font-normal">Receita</FormLabel>
                    </FormItem>
                </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                <Input placeholder="Ex: Café na padaria" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 5.50" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {transactionType === 'expense' && (
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {transactionCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}
        
        <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel>Forma de Pagamento</FormLabel>
                <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col sm:flex-row sm:space-x-4"
                >
                    <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="cash" id="cash_desktop" /></FormControl>
                    <FormLabel htmlFor="cash_desktop" className="font-normal">Dinheiro</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="pix" id="pix_desktop" /></FormControl>
                    <FormLabel htmlFor="pix_desktop" className="font-normal">Pix</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="card" id="card_desktop" /></FormControl>
                    <FormLabel htmlFor="card_desktop" className="font-normal">Cartão</FormLabel>
                    </FormItem>
                </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {paymentMethod === 'card' && (
            <FormField
            control={form.control}
            name="creditCardId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cartão de Crédito</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCards}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={isLoadingCards ? "Carregando..." : "Selecione o cartão"} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {creditCards?.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                        {card.cardHolderName} (final {card.cardNumber.slice(-4)})
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
    </>
  );

  const renderMobileForm = () => (
     <>
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                <Input placeholder="Ex: Café na padaria" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 5.50" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um tipo" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="expense">Despesa</SelectItem>
                        <SelectItem value="income">Receita</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        
        {transactionType === 'expense' && (
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {transactionCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}

        <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione a forma" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="pix">Pix</SelectItem>
                        <SelectItem value="card">Cartão</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />

        {paymentMethod === 'card' && (
            <FormField
            control={form.control}
            name="creditCardId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cartão de Crédito</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCards}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={isLoadingCards ? "Carregando..." : "Selecione o cartão"} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {creditCards?.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                        {card.cardHolderName} (final {card.cardNumber.slice(-4)})
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
    </>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {hasMounted && isMobile ? renderMobileForm() : renderDesktopForm()}
        </div>
        <div className="pt-4">
          <Button type="submit" className="w-full">Salvar Transação</Button>
        </div>
      </form>
    </Form>
  );
}
