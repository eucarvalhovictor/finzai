'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useMemo } from "react";
import type { Transaction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  income: {
    label: "Renda",
    color: "hsl(var(--primary))",
  },
  expenses: {
    label: "Despesas",
    color: "hsl(var(--destructive))",
  },
}

interface DashboardChartProps {
    transactions: Transaction[] | null;
    isLoading: boolean;
}

export function DashboardChart({ transactions, isLoading }: DashboardChartProps) {

    const chartData = useMemo(() => {
        const data = [
            { month: "Jan", income: 0, expenses: 0 },
            { month: "Fev", income: 0, expenses: 0 },
            { month: "Mar", income: 0, expenses: 0 },
            { month: "Abr", income: 0, expenses: 0 },
            { month: "Mai", income: 0, expenses: 0 },
            { month: "Jun", income: 0, expenses: 0 },
            { month: "Jul", income: 0, expenses: 0 },
            { month: "Ago", income: 0, expenses: 0 },
            { month: "Set", income: 0, expenses: 0 },
            { month: "Out", income: 0, expenses: 0 },
            { month: "Nov", income: 0, expenses: 0 },
            { month: "Dez", income: 0, expenses: 0 },
        ];

        if (transactions) {
            transactions.forEach(t => {
                let monthIndex = -1;
                if (t.date && t.date.toDate) { // Check if it's a Firestore Timestamp
                    monthIndex = t.date.toDate().getMonth();
                }

                if (monthIndex !== -1) {
                    if (t.transactionType === 'income') {
                        data[monthIndex].income += t.amount;
                    } else {
                        data[monthIndex].expenses += Math.abs(t.amount);
                    }
                }
            });
        }
        
        // Return only up to the current month for a cleaner look
        const currentMonthIndex = new Date().getMonth();
        return data.slice(0, currentMonthIndex + 1);

    }, [transactions]);


    if (isLoading) {
        return <Skeleton className="h-[250px] w-full" />
    }

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
