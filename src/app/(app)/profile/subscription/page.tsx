'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { user, firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  const planName = userProfile ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : '...';
  const isBasico = userProfile?.role === 'basico';
  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Minha Assinatura"
        description="Gerencie seu plano, veja seu histórico de faturas e atualize suas informações de pagamento."
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
          <CardDescription>Você está atualmente no plano {planName}.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-lg bg-muted border">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Crown className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">Plano {planName}</p>
                        <p className="text-sm text-muted-foreground">Sua assinatura está ativa.</p>
                    </div>
                </div>
                {isBasico && (
                     <Button asChild className="mt-4 sm:mt-0">
                        <Link href="/choose-plan?from=upgrade">Fazer Upgrade</Link>
                    </Button>
                )}
                 {isAdmin && (
                    <Badge>Acesso total de Administrador</Badge>
                )}
            </div>
          )}
        </CardContent>
         <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
            <p>Seu plano será renovado automaticamente.</p>
            <Button variant="link" className="p-0 h-auto text-destructive">Cancelar Assinatura</Button>
        </CardFooter>
      </Card>
      
       <Card>
            <CardHeader>
                <CardTitle>Histórico de Cobranças</CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum histórico de cobrança encontrado.</p>
            </CardContent>
        </Card>
    </div>
  );
}
