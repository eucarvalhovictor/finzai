'use client';

import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserManagementTable } from './_components/user-management-table';
import { AddUserDialog } from './_components/add-user-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminPage() {
  const { user, firestore } = useFirebase();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

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
    <>
      <div className="grid gap-6">
        <PageHeader
          title="Painel Administrativo"
          description="Gerencie os cargos e permissões dos usuários do sistema."
        >
            <Button onClick={() => setIsAddUserOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Usuário
            </Button>
        </PageHeader>
        <UserManagementTable />
      </div>
      <AddUserDialog isOpen={isAddUserOpen} onOpenChange={setIsAddUserOpen} />
    </>
  );
}
