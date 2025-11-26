'use server';

import { getFinancialAnalysis } from '@/ai/flows/ai-powered-budget-suggestions';
import { z } from 'zod';
import type { Transaction } from '@/lib/types';


export type AnalysisState = {
  message?: string;
  analysis?: string;
  issues?: string[];
  isSuccess: boolean;
};

// Custom type for the investment data that the AI expects.
type InvestmentForAI = {
  name: string;
  type: string;
  value: number;
}

export async function generateFinancialAnalysis(
  prevState: AnalysisState,
  { transactions, investments }: { transactions: Transaction[], investments: InvestmentForAI[] }
): Promise<AnalysisState> {
  
  if (!transactions || transactions.length < 10) {
    return {
      isSuccess: false,
      message: 'É necessário ter pelo menos 10 transações para gerar uma análise.',
    };
  }

  try {
    const result = await getFinancialAnalysis({
        transactions,
        investments,
    });
    return {
      isSuccess: true,
      analysis: result.analysis,
      message: 'Análise gerada com sucesso!',
    };
  } catch (error) {
    console.error("Error generating analysis:", error);
    // Try to extract a more useful message if available
    const errorMessage = (error instanceof Error && error.cause) ? (error.cause as Error).message : (error as Error).message;
    return {
      isSuccess: false,
      message: `Ocorreu um erro inesperado ao gerar a análise: ${errorMessage}`,
    };
  }
}
