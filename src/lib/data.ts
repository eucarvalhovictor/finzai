import type { Account, AssetAllocation, CreditCard, Investment, Transaction } from './types';
import type { Timestamp } from 'firebase/firestore';

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

export const formatFirebaseTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'Data indisponível';
  
  // Se for um objeto do Firestore Timestamp, converte para Date
  if (timestamp.toDate) {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  // Se já for uma string (como no mock data)
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  // Fallback
  return 'Data inválida';
};

    