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
  income: z.number().describe('Renda mensal.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('Categoria da despesa (ex: Moradia, Alimentação, Transporte).'),
      amount: z.number().describe('Valor gasto na categoria.'),
    })
  ).describe('Lista de despesas mensais com categorias e valores.'),
  financialGoals: z.string().describe('Metas financeiras do usuário (ex: economizar para a entrada de uma casa, pagar dívidas).'),
  historicalTransactions: z.string().optional().describe('Opcional: Histórico de transações do usuário, que influenciará as sugestões.')
});

export type AIBudgetSuggestionsInput = z.infer<typeof AIBudgetSuggestionsInputSchema>;

// Define the output schema
const AIBudgetSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Sugestões de orçamento baseadas em IA para otimizar gastos e economias.'),
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
  prompt: `Você é um consultor financeiro pessoal. Analise a renda, despesas, metas financeiras e histórico de transações do usuário (se fornecido) para fornecer sugestões de orçamento.

  Renda: {{{income}}}
  Despesas:
  {{#each expenses}}
  - Categoria: {{{category}}}, Valor: {{{amount}}}
  {{/each}}
  Metas Financeiras: {{{financialGoals}}}
  {{#if historicalTransactions}}
  Histórico de Transações: {{{historicalTransactions}}}
  {{/if}}

  Forneça sugestões específicas e acionáveis para ajudar o usuário a otimizar seus gastos e economias para alcançar suas metas financeiras.
  Concentre-se na redução de despesas e estratégias de economia. Responda em português do Brasil.
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
