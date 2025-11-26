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
  UserCircle,
  Shield,
  ChevronDown
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionForm } from './transaction-form';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/credit-cards', label: 'Cartões de Crédito', icon: CreditCard },
  { href: '/investments', label: 'Investimentos', icon: TrendingUp },
  { href: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { href: '/budgeting', label: 'Consultor AI', icon: Sparkles, role: ['completo', 'admin'] },
  { href: '/admin/metrics', label: 'Admin', icon: Shield, role: ['admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  const { auth, user, firestore } = useFirebase();
  const router = useRouter();
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const handleTransactionSaved = () => {
    setIsDialogOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
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
  
  const filteredNavItems = navItems.filter(item => {
    if (!item.role) return true;
    if (!userProfile) return false;
    return item.role.includes(userProfile.role);
  });
  
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const renderAddTransaction = () => {
    if (!hasMounted) {
      return (
          <SidebarMenuButton
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            tooltip="Adicionar Transação"
            disabled
          >
          <PlusCircle />
          <span>Adicionar Transação</span>
        </SidebarMenuButton>
      );
    }
    if (isMobile) {
      return (
        <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <SheetTrigger asChild>
            {AddTransactionButton}
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full w-full p-0">
             <ScrollArea className="h-full">
                <div className="p-6">
                    <SheetHeader>
                        <SheetTitle>Adicionar Nova Transação</SheetTitle>
                        <SheetDescription>Preencha os detalhes da sua nova transação.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                        <TransactionForm onTransactionSaved={handleTransactionSaved} />
                    </div>
                </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      );
    }
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {AddTransactionButton}
        </DialogTrigger>
        <DialogContent>
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
    <>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
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
           {renderAddTransaction()}
          </SidebarMenuItem>
           <SidebarSeparator />
           <SidebarMenuItem>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-sidebar-accent transition-colors">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={userProfile?.photoURL} />
                            <AvatarFallback>{userProfile?.firstName ? getInitials(userProfile.firstName) : 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                            <p className="font-medium text-sm truncate">{userProfile?.firstName || 'Usuário'}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                    <DropdownMenuItem asChild>
                       <Link href="/profile">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Meu Perfil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
