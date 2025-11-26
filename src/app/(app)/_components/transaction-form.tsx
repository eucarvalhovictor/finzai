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
import { collection, doc, writeBatch } from 'firebase/firestore';
import type { CreditCard } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

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
  installments: z.coerce.number().int().min(1).optional().default(1),
  firstInstallmentDate: z.date().optional(),
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
}).refine(data => {
  // A data da primeira parcela é obrigatória se houver mais de uma parcela
  if (data.transactionType === 'expense' && data.paymentMethod === 'card' && data.installments > 1) {
    return !!data.firstInstallmentDate;
  }
  return true;
}, {
  message: 'Selecione a data da primeira parcela.',
  path: ['firstInstallmentDate'],
});


type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    onTransactionSaved: () => void;
}

export function TransactionForm({ onTransactionSaved }: TransactionFormProps) {
  const { firestore, user } = useFirebase();
  const isMobile = useIsMobile();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
      installments: 1,
    },
  });

  const paymentMethod = form.watch('paymentMethod');
  const transactionType = form.watch('transactionType');
  const installments = form.watch('installments');
  
  async function onSubmit(data: TransactionFormValues) {
    if (!firestore || !user) {
        console.error("Firestore or user not available");
        return;
    }

    const transactionsCollectionRef = collection(firestore, `users/${user.uid}/transactions`);
    
    if (data.transactionType === 'expense' && data.paymentMethod === 'card' && data.installments > 1 && data.firstInstallmentDate) {
        const batch = writeBatch(firestore);
        const originalTransactionId = doc(collection(firestore, 'temp')).id; // Gere um ID único para o grupo de parcelas
        const installmentAmount = data.amount / data.installments;

        for (let i = 0; i < data.installments; i++) {
            const installmentDate = new Date(data.firstInstallmentDate);
            installmentDate.setMonth(installmentDate.getMonth() + i);

            const newDocRef = doc(transactionsCollectionRef);
            batch.set(newDocRef, {
                userId: user.uid,
                description: `${data.description} (${i + 1}/${data.installments})`,
                amount: -installmentAmount, // Despesas são negativas
                category: data.category,
                transactionType: 'expense',
                paymentMethod: 'card',
                creditCardId: data.creditCardId || null,
                date: installmentDate,
                installments: data.installments,
                installmentNumber: i + 1,
                originalTransactionId: originalTransactionId,
            });
        }
        await batch.commit();

    } else {
        const newTransactionData = {
            userId: user.uid,
            description: data.description,
            amount: data.transactionType === 'income' ? data.amount : -data.amount,
            category: data.transactionType === 'income' ? 'Renda' : data.category,
            transactionType: data.transactionType,
            paymentMethod: data.paymentMethod,
            creditCardId: data.creditCardId || null,
            date: data.firstInstallmentDate || serverTimestamp(),
            installments: 1,
            installmentNumber: 1,
        };
        addDocumentNonBlocking(transactionsCollectionRef, newTransactionData);
    }

    form.reset();
    onTransactionSaved();
  }
  
  const CalendarButton = ({ field }: { field: any }) => (
    <Button
      variant={"outline"}
      className={cn(
        "w-full justify-start text-left font-normal",
        !field.value && "text-muted-foreground"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {field.value ? (
        format(field.value, "PPP", { locale: ptBR })
      ) : (
        <span>Escolha uma data</span>
      )}
    </Button>
  );

  const CalendarComponent = ({ field }: { field: any }) => (
    <Calendar
      mode="single"
      selected={field.value}
      onSelect={(date) => {
        field.onChange(date);
        setIsCalendarOpen(false); // Fecha o dialog/popover ao selecionar
      }}
      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
      initialFocus
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="flex flex-row space-x-4"
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
                <FormLabel>Valor Total</FormLabel>
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
                    className="flex flex-row space-x-4"
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
          <>
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
            {transactionType === 'expense' && (
              <>
                 <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Parcelas</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {installments > 1 && (
                   <FormField
                      control={form.control}
                      name="firstInstallmentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data da Primeira Parcela</FormLabel>
                           {isMobile ? (
                                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <DialogTrigger asChild>
                                        <FormControl>
                                             <CalendarButton field={field} />
                                        </FormControl>
                                    </DialogTrigger>
                                    <DialogContent className="w-auto p-0">
                                       <CalendarComponent field={field} />
                                    </DialogContent>
                                </Dialog>
                           ) : (
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <CalendarButton field={field} />
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent field={field} />
                                    </PopoverContent>
                                </Popover>
                           )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
              </>
            )}
          </>
        )}
        <div className="pt-4">
          <Button type="submit" className="w-full">Salvar Transação</Button>
        </div>
      </form>
    </Form>
  );
}

    