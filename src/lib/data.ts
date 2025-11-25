import type { Account, AssetAllocation, CreditCard, Investment, Transaction } from './types';

export const accounts: Account[] = [];

export const transactions: Transaction[] = [];

export const creditCards: CreditCard[] = [];

export const investments: Investment[] = [];

export const assetAllocation: AssetAllocation[] = [];

export const financialSummary = {
  totalBalance: 0,
  totalDebt: 0,
  netWorth: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(amount);
};
