'use client';

import { PageHeader } from '@/components/page-header';
import { AIConsultant } from './_components/ai-consultant';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function BudgetingPage() {
  const { user, firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  if (isLoadingProfile) {
    return (
      <div className="grid gap-6">
        <PageHeader
          title="Consultor Financeiro AI"
          description="Receba uma análise detalhada e dicas assertivas para seu perfil financeiro."
        />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (userProfile?.role === 'basico') {
    return (
       <div className="grid gap-6">
        <PageHeader
          title="Consultor Financeiro AI"
          description="Receba uma análise detalhada e dicas assertivas para seu perfil financeiro."
        />
        <Card className="flex items-center justify-center h-64">
            <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Funcionalidade Premium</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    O Consultor AI está disponível apenas para usuários do plano Completo ou Administrador.
                </p>
            </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="grid gap-6">
      <PageHeader
        title="Consultor Financeiro AI"
        description="Receba uma análise detalhada e dicas assertivas para seu perfil financeiro."
      />
      <AIConsultant />
    </div>
  );
}
