'use server';
/**
 * @fileOverview AI-powered financial analysis flow.
 *
 * This file defines a Genkit flow that provides a detailed financial analysis based on user
 * transactions and investments. It uses a generative AI model to identify spending patterns,
 * evaluate investment allocation, and provide actionable advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Transaction, Investment } from '@/lib/types';

// Define the input schema, which now takes structured data
const FinancialAnalysisInputSchema = z.object({
  transactions: z.array(
      z.object({
          description: z.string(),
          amount: z.number(),
          category: z.string(),
          transactionType: z.enum(['income', 'expense']),
          date: z.any().describe("A data da transação"),
      })
  ).describe("Uma lista de transações financeiras do usuário."),
  investments: z.array(
      z.object({
          name: z.string(),
          type: z.string(),
          value: z.number(),
          changePercent: z.number(),
      })
  ).describe("Uma lista dos investimentos do usuário."),
});

export type FinancialAnalysisInput = z.infer<typeof FinancialAnalysisInputSchema>;

// Define the output schema
const FinancialAnalysisOutputSchema = z.object({
  analysis: z.string().describe('Uma análise financeira detalhada e dicas de otimização, formatada em markdown.'),
});

export type FinancialAnalysisOutput = z.infer<typeof FinancialAnalysisOutputSchema>;

// Exported function to trigger the flow
export async function getFinancialAnalysis(input: FinancialAnalysisInput): Promise<FinancialAnalysisOutput> {
  return financialAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAnalysisPrompt',
  input: {schema: FinancialAnalysisInputSchema},
  output: {schema: FinancialAnalysisOutputSchema},
  prompt: `Você é um consultor financeiro especialista. Sua tarefa é analisar os dados financeiros de um usuário, incluindo transações e investimentos, para fornecer uma análise completa e dicas assertivas.

  **Instruções:**
  1.  **Analise as Transações:** Identifique os principais padrões de gastos, as maiores categorias de despesas e o fluxo de caixa geral (receitas vs. despesas).
  2.  **Avalie os Investimentos:** Com base na lista de investimentos, comente sobre a alocação de ativos (se diversificada ou concentrada) e o desempenho geral.
  3.  **Forneça Dicas Assertivas:** Com base na análise, forneça conselhos práticos e personalizados. Sugira áreas para cortar gastos, oportunidades de economia e possíveis ajustes na carteira de investimentos para alinhar com um perfil de crescimento equilibrado.
  4.  **Formate a Saída:** Retorne sua análise em formato **Markdown**. Use títulos (##), listas (-, *) e negrito (**) para estruturar a resposta de forma clara e legível. Comece com um resumo geral e depois divida em seções como "Análise de Despesas", "Análise de Investimentos" e "Recomendações".

  **Dados do Usuário:**

  **Transações:**
  \`\`\`json
  {{{jsonStringify transactions}}}
  \`\`\`

  **Investimentos:**
  \`\`\`json
  {{{jsonStringify investments}}}
  \`\`\`

  Agora, gere a análise financeira completa em português do Brasil.
  `,
});

// Define the Genkit flow
const financialAnalysisFlow = ai.defineFlow(
  {
    name: 'financialAnalysisFlow',
    inputSchema: FinancialAnalysisInputSchema,
    outputSchema: FinancialAnalysisOutputSchema,
  },
  async (input) => {
    // A função `jsonStringify` não está disponível no prompt, então stringificamos aqui
    const promptInput = {
        transactions: JSON.stringify(input.transactions, null, 2),
        investments: JSON.stringify(input.investments, null, 2),
    };
  
    // O prompt espera um objeto com as propriedades `transactions` e `investments`
    const adjustedInputForPrompt = {
        ...promptInput,
        // Passamos os dados originais para validação de schema, mas o prompt usará as versões stringified
        ...input
    };

    const {output} = await prompt(adjustedInputForPrompt);
    return output!;
  }
);
