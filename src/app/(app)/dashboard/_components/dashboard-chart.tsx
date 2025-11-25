'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { financialSummary } from '@/lib/data';

const chartData = [
  { month: "Janeiro", income: 0, expenses: 0 },
  { month: "Fevereiro", income: 0, expenses: 0 },
  { month: "Março", income: 0, expenses: 0 },
  { month: "Abril", income: 0, expenses: 0 },
  { month: "Maio", income: 0, expenses: 0 },
  { month: "Junho", income: financialSummary.monthlyIncome, expenses: Math.abs(financialSummary.monthlyExpenses) },
]

const chartConfig = {
  income: {
    label: "Renda",
    color: "hsl(var(--primary))",
  },
  expenses: {
    label: "Despesas",
    color: "hsl(var(--accent))",
  },
}

export function DashboardChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickFormatter={(value) => `R$${value/1000}k`} tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
