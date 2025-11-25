'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRightLeft,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import type { Transaction, CreditCard as CreditCardType } from '@/lib/types';
import { transactions as allTransactions } from '@/lib/data'; // This will be replaced by a global state management later

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/credit-cards', label: 'Cartões de Crédito', icon: CreditCard },
  { href: '/investments', label: 'Investimentos', icon: TrendingUp },
  { href: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { href: '/budgeting', label: 'Orçamento IA', icon: Sparkles },
];

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
  type: z.enum(['income', 'expense'], { required_error: 'Selecione o tipo.' }),
  category: z.string().min(1, 'Selecione uma categoria.'),
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
});


type TransactionFormValues = z.infer<typeof transactionSchema>;

export function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fake credit card data. In a real app, this would come from a global state or API.
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([
      { id: '1', name: 'Cartão Principal', last4: '1234', balance: 0, limit: 5000, dueDate: '', transactions: [] },
      { id: '2', name: 'Cartão Secundário', last4: '5678', balance: 0, limit: 3000, dueDate: '', transactions: [] }
  ]);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      paymentMethod: 'cash',
    },
  });

  const paymentMethod = form.watch('paymentMethod');
  const transactionType = form.watch('type');

  function onSubmit(data: TransactionFormValues) {
    const finalAmount = data.type === 'income' ? data.amount : -data.amount;
    const finalCategory = data.type === 'income' ? 'Renda' : data.category;

    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR'),
      description: data.description,
      amount: finalAmount,
      // @ts-ignore - We know this is valid
      category: finalCategory,
      type: data.type,
    };
    
    console.log('Nova transação adicionada (localmente):', newTransaction);
    if(data.paymentMethod === 'card') {
        console.log('Cartão de Crédito ID:', data.creditCardId);
    }
    
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  tooltip="Adicionar Transação"
                >
                  <PlusCircle />
                  <span>Adicionar Transação</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Transação</DialogTitle>
                      <DialogDescription>Preencha os detalhes da sua nova transação.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                       <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Tipo de Transação</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="expense" id="expense" />
                                  </FormControl>
                                  <FormLabel htmlFor="expense" className="font-normal">Despesa</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="income" id="income" />
                                  </FormControl>
                                  <FormLabel htmlFor="income" className="font-normal">Receita</FormLabel>
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
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value="cash" id="cash" /></FormControl>
                                  <FormLabel htmlFor="cash" className="font-normal">Dinheiro</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value="pix" id="pix" /></FormControl>
                                  <FormLabel htmlFor="pix" className="font-normal">Pix</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value="card" id="card" /></FormControl>
                                  <FormLabel htmlFor="card" className="font-normal">Cartão</FormLabel>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o cartão" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {creditCards.map((card) => (
                                    <SelectItem key={card.id} value={card.id}>
                                      {card.name} (final {card.last4})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                    </div>
                    <DialogFooter>
                      <Button type="submit">Salvar Transação</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair">
              <LogOut className="text-destructive" />
              <span className="text-destructive">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
