'use client';

import { useMemo } from 'react';
import { useDoc, useFirebase } from '@/firebase';
import type { SeoSettings } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Wallet } from 'lucide-react';
import Image from 'next/image';

export function AppLogo() {
  const { firestore } = useFirebase();

  const seoSettingsRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'globalSeo');
  }, [firestore]);

  const { data: seoSettings } = useDoc<SeoSettings>(seoSettingsRef);

  if (seoSettings?.logoUrl) {
    return (
      <div className="flex items-center gap-2">
        <Image src={seoSettings.logoUrl} alt={seoSettings.siteTitle || "FinzAI Logo"} width={128} height={32} className="h-8 w-auto object-contain" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-primary">
      <Wallet className="h-7 w-7" />
      <h1 className="text-xl font-bold text-foreground">
        FinzAI
      </h1>
    </div>
  );
}
