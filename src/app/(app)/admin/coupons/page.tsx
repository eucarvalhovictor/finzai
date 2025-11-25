'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, TicketPercent } from 'lucide-react';

export default function AdminCouponsPage() {
  return (
    <div className="grid gap-6">
       <div className="flex items-center justify-between">
            <PageHeader
                title="Gerenciamento de Cupons"
                description="Crie e gerencie cupons de desconto para a plataforma."
            />
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Cupom
            </Button>
        </div>
      
      <Card className="flex items-center justify-center h-96">
        <CardContent className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <TicketPercent className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Nenhum Cupom Criado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Clique em "Criar Cupom" para adicionar o primeiro cupom de desconto.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
