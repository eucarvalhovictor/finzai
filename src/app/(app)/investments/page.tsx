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
    label: "Value",
  },
  Stock: {
    label: "Stocks",
    color: "hsl(var(--chart-1))",
  },
  Fund: {
    label: "Funds",
    color: "hsl(var(--chart-2))",
  },
  Crypto: {
    label: "Crypto",
    color: "hsl(var(--chart-3))",
  },
  Bond: {
    label: "Bonds",
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
        title="Investment Portfolio"
        description="Monitor your portfolio performance and asset allocation."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Distribution of your investment assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
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
          </CardContent>
          <div className="flex flex-col items-center justify-center border-t p-4">
              <span className="text-lg font-medium">
                {formatCurrency(activeValue || 0)}
              </span>
              <span className="text-sm text-muted-foreground">{activeType}</span>
            </div>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Your total investments and their performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-3xl font-bold">{formatCurrency(totalInvestments)}</p>
              <div className={`flex items-center text-sm ${totalChange >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {totalChange >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                <span>{formatCurrency(totalChange)} ({(totalChange / totalInvestments * 100).toFixed(2)}%) all time</span>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
