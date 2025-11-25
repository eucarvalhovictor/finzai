'use server';

import { getFinancialAnalysis } from '@/ai/flows/ai-powered-budget-suggestions';
import { z } from 'zod';
import type { Transaction, Investment } from '@/lib/types';


export type AnalysisState = {
  message?: string;
  analysis?: string;
  issues?: string[];
  isSuccess: boolean;
};

export async function generateFinancialAnalysis(
  prevState: AnalysisState,
  { transactions, investments }: { transactions: Transaction[], investments: Investment[] }
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
    return {
      isSuccess: false,
      message: 'Ocorreu um erro inesperado ao gerar a análise.',
    };
  }
}
