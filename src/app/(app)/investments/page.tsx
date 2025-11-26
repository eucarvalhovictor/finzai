"use client"

import * as React from 'react'
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Button } from '@/components/ui/button';
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Investment } from '@/lib/types';
import { formatCurrency } from '@/lib/data';
import { TrendingUp, PlusCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AddInvestmentDialog } from './_components/add-investment-dialog';

const chartConfig = {
  value: {
    label: "Valor",
  },
  "Ação": { label: "Ações", color: "hsl(var(--chart-1))" },
  "FII": { label: "FIIs", color: "hsl(var(--chart-2))" },
  "BDR": { label: "BDRs", color: "hsl(var(--chart-3))" },
  "Cripto": { label: "Cripto", color: "hsl(var(--chart-4))" },
  "Renda Fixa": { label: "Renda Fixa", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function InvestmentsPage() {
  const { user, firestore } = useFirebase();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const investmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/investments`));
  }, [user, firestore]);

  const { data: investments, isLoading } = useCollection<Investment>(investmentsQuery);

  const { totalInvestments, assetAllocation, investmentsByBrokerage } = React.useMemo(() => {
    if (!investments) {
      return { totalInvestments: 0, assetAllocation: [], investmentsByBrokerage: new Map() };
    }

    const total = investments.reduce((sum, inv) => sum + (inv.quantity * inv.valuePerShare), 0);
    
    const allocation = investments.reduce((acc, inv) => {
      const existing = acc.find(a => a.type === inv.type);
      const value = inv.quantity * inv.valuePerShare;
      if (existing) {
        existing.value += value;
      } else {
        acc.push({ type: inv.type, value: value });
      }
      return acc;
    }, [] as { type: string; value: number }[]);

    const byBrokerage = investments.reduce((acc, inv) => {
      if (!acc.has(inv.institution)) {
        acc.set(inv.institution, []);
      }
      acc.get(inv.institution)!.push(inv);
      return acc;
    }, new Map<string, Investment[]>());


    return { totalInvestments: total, assetAllocation: allocation, investmentsByBrokerage: byBrokerage };
  }, [investments]);

  const [activeType, setActiveType] = React.useState(
    () => (assetAllocation.length > 0 ? assetAllocation[0].type : "N/A")
  );
  
  React.useEffect(() => {
      if (assetAllocation.length > 0 && !assetAllocation.find(a => a.type === activeType)) {
          setActiveType(assetAllocation[0].type);
      }
  }, [assetAllocation, activeType]);

  const activeValue = React.useMemo(
    () => assetAllocation.find((a) => a.type === activeType)?.value,
    [activeType, assetAllocation]
  );
  
  const brokerages = Array.from(investmentsByBrokerage.keys());

  return (
    <>
      <div className="grid gap-6">
        <PageHeader
          title="Carteira de Investimentos"
          description="Monitore o desempenho e a alocação de seus ativos."
        >
          <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Ativo
          </Button>
        </PageHeader>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-3/4 mt-1" /> : <div className="text-2xl font-bold">{formatCurrency(totalInvestments)}</div>}
                <p className="text-xs text-muted-foreground">
                  Valor total da sua carteira de investimentos.
                </p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle>Alocação de Ativos</CardTitle>
                 </CardHeader>
                 <CardContent className="flex items-center justify-center gap-8">
                     {isLoading ? <Skeleton className="h-[150px] w-[150px] rounded-full" /> : 
                     investments && investments.length > 0 ? (
                      <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[150px]">
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={assetAllocation}
                            dataKey="value"
                            nameKey="type"
                            innerRadius={40}
                            strokeWidth={5}
                            onMouseOver={(_, index) => {
                              setActiveType(assetAllocation[index].type)
                            }}
                          >
                            {assetAllocation.map((entry) => (
                               <Cell key={entry.type} fill={chartConfig[entry.type as keyof typeof chartConfig]?.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    ) : <div className="h-[150px] flex items-center justify-center"><p className="text-muted-foreground">Sem dados para exibir.</p></div>}
                    <div className="grid gap-2 text-sm">
                        {assetAllocation.map(item => (
                            <div key={item.type} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{backgroundColor: chartConfig[item.type as keyof typeof chartConfig]?.color}}></span>
                                <span>{item.type}</span>
                                <span className="ml-auto font-medium">{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>
                 </CardContent>
            </Card>
        </div>

        <div className="grid gap-6">
            <h2 className="text-xl font-bold">Ativos por Corretora</h2>
            {isLoading ? <Skeleton className="h-64 w-full" /> : 
            brokerages.length > 0 ? brokerages.map(brokerage => (
                <Card key={brokerage}>
                    <CardHeader>
                        <CardTitle>{brokerage}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Ativo</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Cotas</TableHead>
                                    <TableHead className="text-right">Valor / Cota</TableHead>
                                    <TableHead className="text-right">Posição Total</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investmentsByBrokerage.get(brokerage)?.map(inv => (
                                    <TableRow key={inv.id}>
                                        <TableCell>
                                            <div className="font-medium">{inv.name}</div>
                                            <div className="text-xs text-muted-foreground">{inv.ticker}</div>
                                        </TableCell>
                                        <TableCell>{inv.type}</TableCell>
                                        <TableCell className="text-right">{inv.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(inv.valuePerShare)}</TableCell>
                                        <TableCell className="text-right font-bold">{formatCurrency(inv.quantity * inv.valuePerShare)}</TableCell>
                                        <TableCell>
                                            {/* Ações como editar/excluir podem ser adicionadas aqui */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )) : (
                <Card className="flex items-center justify-center h-48">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Nenhum ativo de investimento adicionado.</p>
                        <p className="text-sm text-muted-foreground mt-2">Clique em "Adicionar Ativo" para começar.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
      <AddInvestmentDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

    