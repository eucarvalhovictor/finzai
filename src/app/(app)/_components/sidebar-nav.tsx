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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import { transactions as allTransactions } from '@/lib/data'; // This will be replaced by a global state management later

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/credit-cards', label: 'Cartões de Crédito', icon: CreditCard },
  { href: '/investments', label: 'Investimentos', icon: TrendingUp },
  { href: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { href: '/budgeting', label: 'Orçamento IA', icon: Sparkles },
];

const transactionCategories = [
  'Renda',
  'Moradia',
  'Alimentação',
  'Transporte',
  'Entretenimento',
  'Saúde',
  'Compras',
  'Serviços',
] as const;

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.coerce.number().positive('O valor deve ser um número positivo'),
  category: z.enum(transactionCategories),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    },
  });

  // Note: This state management is local. For a real app, use a global state manager (like Context or Zustand).
  const [transactions, setTransactions] = useState(allTransactions);

  function onSubmit(data: TransactionFormValues) {
    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR'),
      description: data.description,
      amount: data.category === 'Renda' ? data.amount : -data.amount,
      category: data.category,
      type: data.category === 'Renda' ? 'income' : 'expense',
    };
    // This is a temporary solution to demonstrate functionality.
    // In a real app, this would update a global state or database.
    console.log('New transaction added (locally):', newTransaction);
    // You might want to pass this state down or lift it up to see updates on the transactions page.
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
                  tooltip="Adicionar Despesa"
                >
                  <PlusCircle />
                  <span>Adicionar Despesa</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Transação</DialogTitle>
                      <DialogDescription>Preencha os detalhes da sua nova transação.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Descrição</FormLabel>
                            <FormControl className="col-span-3">
                              <Input placeholder="Ex: Café" {...field} />
                            </FormControl>
                            <FormMessage className="col-span-4 text-right" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Valor</FormLabel>
                            <FormControl className="col-span-3">
                              <Input type="number" placeholder="Ex: 5.50" {...field} />
                            </FormControl>
                            <FormMessage className="col-span-4 text-right" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Categoria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl className="col-span-3">
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
                            <FormMessage className="col-span-4 text-right" />
                          </FormItem>
                        )}
                      />
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
