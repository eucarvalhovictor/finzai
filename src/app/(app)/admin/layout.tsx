'use client';
import { PageHeader } from '@/components/page-header';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, BarChart2, Users, Tag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin/metrics', label: 'Métricas', icon: BarChart2 },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/coupons', label: 'Cupons', icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, firestore } = useFirebase();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  if (isLoadingProfile) {
    return (
      <div className="grid gap-6">
        <PageHeader
          title="Painel Administrativo"
          description="Gerencie usuários e configurações do sistema."
        />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
       <div className="grid gap-6">
        <PageHeader
          title="Acesso Negado"
          description="Você não tem permissão para acessar esta página."
        />
        <Card className="flex items-center justify-center h-64">
            <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Acesso Restrito</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Apenas administradores podem visualizar o painel administrativo.
                </p>
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <PageHeader
          title="Painel Administrativo"
          description="Visão geral e gerenciamento do sistema."
      />
      <nav className="flex border-b">
        {adminNavItems.map(item => (
            <Link 
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
        ))}
      </nav>
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
}
