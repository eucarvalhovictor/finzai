'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/data';
import { DollarSign, Users, ShoppingCart } from 'lucide-react';


export default function AdminMetricsPage() {

    // Dados mockados
    const metrics = {
        totalRevenue: 12540.50,
        newUsers: 89,
        subscriptions: 230,
    }

  return (
    <div className="grid gap-6">
        <PageHeader
            title="Métricas Principais"
            description="Um resumo do desempenho da sua plataforma."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inscrições</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{metrics.subscriptions}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12.2% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{metrics.newUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  +35.9% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
        </div>

         <Card>
            <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de métricas estará aqui.</p>
            </CardContent>
        </Card>
    </div>
  );
}
