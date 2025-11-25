'use server';

import { getBudgetSuggestions } from '@/ai/flows/ai-powered-budget-suggestions';
import { z } from 'zod';

const ExpenseSchema = z.object({
  category: z.string().min(1, 'A categoria é obrigatória'),
  amount: z.coerce.number().positive('O valor deve ser positivo'),
});

export const BudgetSchema = z.object({
  income: z.coerce.number().positive('A renda deve ser um número positivo.'),
  financialGoals: z.string().min(10, 'As metas financeiras devem ter pelo menos 10 caracteres.'),
  historicalTransactions: z.string().optional(),
  expenses: z.array(ExpenseSchema).min(1, 'É necessária pelo menos uma despesa.'),
});

type BudgetsState = {
  message?: string;
  suggestions?: string;
  issues?: string[];
  isSuccess: boolean;
};

export async function generateBudgetSuggestions(
  prevState: BudgetsState,
  formData: FormData
): Promise<BudgetsState> {
  const rawExpenses = formData.getAll('expenses');
  const expenses = rawExpenses.map(exp => {
    try {
      return JSON.parse(exp as string);
    } catch {
      return {};
    }
  });

  const validatedFields = BudgetSchema.safeParse({
    income: formData.get('income'),
    financialGoals: formData.get('financialGoals'),
    historicalTransactions: formData.get('historicalTransactions'),
    expenses: expenses,
  });

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      issues: validatedFields.error.issues.map((issue) => issue.message),
      message: 'Falha ao gerar sugestões. Verifique seus dados.',
    };
  }

  try {
    const result = await getBudgetSuggestions(validatedFields.data);
    return {
      isSuccess: true,
      suggestions: result.suggestions,
      message: 'Sugestões geradas com sucesso!',
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Ocorreu um erro inesperado ao gerar sugestões.',
    };
  }
}
