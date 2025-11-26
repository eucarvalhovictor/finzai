'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie_consent_given';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };
  
  const handleDecline = () => {
    // You can decide what to do here. Maybe disable non-essential cookies.
    // For this example, we'll just hide the banner.
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up-and-fade">
      <Card className="max-w-xl mx-auto shadow-2xl">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-1">
                <Cookie className="h-6 w-6 text-primary" />
             </div>
             <div className="grid gap-1.5">
                <CardTitle>Nós usamos cookies</CardTitle>
                <CardDescription>
                    Este site utiliza cookies para garantir que você tenha a melhor experiência de navegação. Ao continuar, você concorda com nosso uso de cookies.
                </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button variant="ghost" onClick={handleDecline}>Recusar</Button>
            <Button onClick={handleAccept}>Aceitar</Button>
          </CardContent>
      </Card>
    </div>
  );
}
