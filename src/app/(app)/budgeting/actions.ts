'use server';

import { getBudgetSuggestions } from '@/ai/flows/ai-powered-budget-suggestions';
import { z } from 'zod';

const ExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
});

export const BudgetSchema = z.object({
  income: z.coerce.number().positive('Income must be a positive number.'),
  financialGoals: z.string().min(10, 'Financial goals must be at least 10 characters long.'),
  historicalTransactions: z.string().optional(),
  expenses: z.array(ExpenseSchema).min(1, 'At least one expense is required.'),
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
      message: 'Failed to generate suggestions. Please check your input.',
    };
  }

  try {
    const result = await getBudgetSuggestions(validatedFields.data);
    return {
      isSuccess: true,
      suggestions: result.suggestions,
      message: 'Suggestions generated successfully!',
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'An unexpected error occurred while generating suggestions.',
    };
  }
}
