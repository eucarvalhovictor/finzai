'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // We start the navigation progress bar.
    setIsNavigating(true);

    // We complete the navigation progress bar when the route change is complete.
    // We use a timeout to ensure the progress bar is visible for a minimum duration.
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500); // Minimum duration of 500ms

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-0.5 z-50 ${
        isNavigating ? 'animate-navigation-progress' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
      }}
    />
  );
}
