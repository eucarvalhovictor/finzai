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
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { NavigationProgress } from '@/components/ui/navigation-progress';
import { Suspense } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
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

  if (!user) {
    redirect('/login');
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
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1 md:absolute md:inset-x-0 md:flex md:items-center md:justify-center md:text-center">
             <AppLogo />
          </div>
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
