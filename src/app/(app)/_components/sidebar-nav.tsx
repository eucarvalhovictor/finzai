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
import { ArrowRightLeft, CreditCard, LayoutDashboard, Sparkles, TrendingUp, PlusCircle, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/credit-cards', label: 'Cartões de Crédito', icon: CreditCard },
  { href: '/investments', label: 'Investimentos', icon: TrendingUp },
  { href: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { href: '/budgeting', label: 'Orçamento IA', icon: Sparkles },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
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
             <SidebarMenuButton asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" tooltip="Adicionar Despesa">
                <Link href="/transactions?action=add">
                    <PlusCircle />
                    <span>Adicionar Despesa</span>
                </Link>
             </SidebarMenuButton>
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
