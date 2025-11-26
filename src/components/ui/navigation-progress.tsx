'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Começamos a exibir o indicador de navegação.
    setIsNavigating(true);

    // Completamos a navegação quando a mudança de rota estiver concluída.
    // Usamos um timeout para garantir que o indicador seja visível por uma duração mínima.
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500); // Duração mínima de 500ms

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      style={{
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}