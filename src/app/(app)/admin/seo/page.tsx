'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function AdminSeoPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Controle de SEO"
        description="Gerencie as meta tags, sitemaps e outras configurações de SEO do site."
      />
      
      <Card className="flex items-center justify-center h-96">
        <CardContent className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Ferramentas de SEO</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Em breve, você poderá gerenciar o SEO do seu site aqui.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
