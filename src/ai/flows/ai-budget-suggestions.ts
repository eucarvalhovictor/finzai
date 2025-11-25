// src/ai/flows/ai-budget-suggestions.ts
'use server';
/**
 * @fileOverview AI-powered budget suggestion flow.
 *
 * This file defines a Genkit flow that provides budget suggestions based on user income, expenses,
 * and financial goals. It uses a generative AI model to analyze spending habits and suggest
 * optimized spending and savings strategies.
 *
 * @interface AIBudgetSuggestionsInput - Defines the input schema for the flow.
 * @interface AIBudgetSuggestionsOutput - Defines the output schema for the flow.
 * @function getBudgetSuggestions - The main function to trigger the budget suggestion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const AIBudgetSuggestionsInputSchema = z.object({
  income: z.number().describe('Monthly income.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('Expense category (e.g., Housing, Food, Transportation).'),
      amount: z.number().describe('Amount spent in the category.'),
    })
  ).describe('List of monthly expenses with categories and amounts.'),
  financialGoals: z.string().describe('User provided financial goals (e.g., save for a down payment, pay off debt).'),
  historicalTransactions: z.string().optional().describe('Optional: User historical transactions, which would influence the suggestions.')
});

export type AIBudgetSuggestionsInput = z.infer<typeof AIBudgetSuggestionsInputSchema>;

// Define the output schema
const AIBudgetSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('AI-powered budget suggestions to optimize spending and savings.'),
});

export type AIBudgetSuggestionsOutput = z.infer<typeof AIBudgetSuggestionsOutputSchema>;

// Exported function to trigger the flow
export async function getBudgetSuggestions(input: AIBudgetSuggestionsInput): Promise<AIBudgetSuggestionsOutput> {
  return aiBudgetSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBudgetSuggestionsPrompt',
  input: {schema: AIBudgetSuggestionsInputSchema},
  output: {schema: AIBudgetSuggestionsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income, expenses, financial goals, and historical transactions (if provided) to provide budget suggestions.

  Income: {{{income}}}
  Expenses:
  {{#each expenses}}
  - Category: {{{category}}}, Amount: {{{amount}}}
  {{/each}}
  Financial Goals: {{{financialGoals}}}
  {{#if historicalTransactions}}
  Historical Transactions: {{{historicalTransactions}}}
  {{/if}}

  Provide specific, actionable suggestions to help the user optimize their spending and savings to reach their financial goals.
  Focus on expense reduction and saving strategies.
  `,
});

// Define the Genkit flow
const aiBudgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiBudgetSuggestionsFlow',
    inputSchema: AIBudgetSuggestionsInputSchema,
    outputSchema: AIBudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
