"use client"
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
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

import { investments, assetAllocation, formatCurrency } from '@/lib/data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import * as React from 'react'

const totalInvestments = investments.reduce((sum, inv) => sum + inv.value, 0);
const totalChange = investments.reduce((sum, inv) => sum + inv.change, 0);

const chartConfig: ChartConfig = {
  value: {
    label: "Valor",
  },
  Stock: {
    label: "Ações",
    color: "hsl(var(--chart-1))",
  },
  Fund: {
    label: "Fundos",
    color: "hsl(var(--chart-2))",
  },
  Crypto: {
    label: "Cripto",
    color: "hsl(var(--chart-3))",
  },
  Bond: {
    label: "Títulos",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function InvestmentsPage() {
  const [activeType, setActiveType] = React.useState(
    () => assetAllocation[0]?.type
  )

  const activeValue = React.useMemo(
    () => assetAllocation.find((a) => a.type === activeType)?.value,
    [activeType]
  )

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Carteira de Investimentos"
        description="Monitore o desempenho e a alocação de seus ativos."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alocação de Ativos</CardTitle>
            <CardDescription>
              Distribuição dos seus ativos de investimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             {investments.length > 0 ? (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={assetAllocation}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={60}
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
            ) : <div className="h-[250px] flex items-center justify-center"><p className="text-muted-foreground">Sem dados de alocação.</p></div>
            }
          </CardContent>
          {investments.length > 0 && <div className="flex flex-col items-center justify-center border-t p-4">
              <span className="text-lg font-medium">
                {formatCurrency(activeValue || 0)}
              </span>
              <span className="text-sm text-muted-foreground">{activeType}</span>
            </div>}
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Desempenho da Carteira</CardTitle>
            <CardDescription>Seus investimentos totais e seu desempenho.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-3xl font-bold">{formatCurrency(totalInvestments)}</p>
              <div className={`flex items-center text-sm ${totalChange >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {totalChange > 0 && <TrendingUp className="mr-1 h-4 w-4" />}
                {totalChange < 0 && <TrendingDown className="mr-1 h-4 w-4" />}
                {totalChange !== 0 && <span>{formatCurrency(totalChange)} ({totalInvestments > 0 ? (totalChange / totalInvestments * 100).toFixed(2) : 0}%) total</span>}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Variação 24h</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.name}</TableCell>
                    <TableCell>{inv.type}</TableCell>
                    <TableCell className="text-right">{formatCurrency(inv.value)}</TableCell>
                    <TableCell className={`text-right font-medium ${inv.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      <div className="flex items-center justify-end">
                        {inv.change > 0 && <TrendingUp className="mr-1 h-4 w-4" />}
                        {inv.change < 0 && <TrendingDown className="mr-1 h-4 w-4" />}
                        {inv.change === 0 && <Minus className="mr-1 h-4 w-4" />}
                        {inv.changePercent.toFixed(2)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                 {investments.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum investimento encontrado.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
