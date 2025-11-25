'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
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
import { useState } from 'react';
import type { CreditCard as CreditCardType } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionForm } from './transaction-form';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/credit-cards', label: 'Cartões de Crédito', icon: CreditCard },
  { href: '/investments', label: 'Investimentos', icon: TrendingUp },
  { href: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { href: '/budgeting', label: 'Orçamento IA', icon: Sparkles },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Fake credit card data. In a real app, this would come from a global state or API.
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([
      { id: '1', name: 'Cartão Principal', last4: '1234', balance: 0, limit: 5000, dueDate: '', transactions: [] },
      { id: '2', name: 'Cartão Secundário', last4: '5678', balance: 0, limit: 3000, dueDate: '', transactions: [] }
  ]);

  const handleTransactionSaved = () => {
    setIsDialogOpen(false);
  };
  
  const AddTransactionButton = (
    <SidebarMenuButton
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
      tooltip="Adicionar Transação"
    >
      <PlusCircle />
      <span>Adicionar Transação</span>
    </SidebarMenuButton>
  );

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
           {isMobile ? (
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
                      <TransactionForm creditCards={creditCards} onTransactionSaved={handleTransactionSaved} />
                    </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  {AddTransactionButton}
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Transação</DialogTitle>
                      <DialogDescription>Preencha os detalhes da sua nova transação.</DialogDescription>
                    </DialogHeader>
                    <TransactionForm creditCards={creditCards} onTransactionSaved={handleTransactionSaved} />
                </DialogContent>
              </Dialog>
            )}
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
