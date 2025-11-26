'use client';

import { AppLogo } from '@/components/app-logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarNav } from './_components/sidebar-nav';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { NavigationProgress } from '@/components/ui/navigation-progress';
import { Suspense, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    // Se o usuário está carregado e seu perfil tem o cargo 'pending', redireciona
    if (!isLoadingProfile && userProfile?.role === 'pending') {
      router.push('/choose-plan');
    }
  }, [user, isUserLoading, userProfile, isLoadingProfile, router]);

  if (isUserLoading || !user || isLoadingProfile || !userProfile || userProfile.role === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-4 space-y-4">
            <div className="flex justify-center">
                <AppLogo />
            </div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-8 w-60" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Suspense>
        <NavigationProgress />
      </Suspense>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex justify-center p-2">
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarNav />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger />
          </div>
          <div className="absolute inset-x-0 flex items-center justify-center text-center -z-10">
             <AppLogo />
          </div>
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
