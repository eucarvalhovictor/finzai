'use server';

import { getFinancialAnalysis } from '@/ai/flows/ai-powered-budget-suggestions';
import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';


// A versão serializada da transação que a action recebe do cliente.
type SerializableTransaction = {
  id: string;
  date: string; // A data é uma string aqui.
  description: string;
  amount: number;
  category: 'Renda' | 'Moradia' | 'Alimentação' | 'Transporte' | 'Entretenimento' | 'Saúde' | 'Compras' | 'Serviços' | 'Outros';
  transactionType: 'income' | 'expense';
  userId: string;
  paymentMethod: 'cash' | 'pix' | 'card';
  creditCardId?: string | null;
  installments?: number;
  installmentNumber?: number;
  originalTransactionId?: string;
};


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
  { transactions, investments }: { transactions: SerializableTransaction[], investments: InvestmentForAI[] }
): Promise<AnalysisState> {
  
  if (!transactions || transactions.length < 10) {
    return {
      isSuccess: false,
      message: 'É necessário ter pelo menos 10 transações para gerar uma análise.',
    };
  }

  try {
    // O fluxo de IA já espera a data como string, então podemos passar diretamente.
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
