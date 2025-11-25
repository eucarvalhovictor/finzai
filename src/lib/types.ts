import type { Timestamp } from 'firebase/firestore';

export type Transaction = {
  id: string;
  date: Timestamp;
  description: string;
  amount: number;
  category: 'Renda' | 'Moradia' | 'Alimentação' | 'Transporte' | 'Entretenimento' | 'Saúde' | 'Compras' | 'Serviços' | 'Outros';
  transactionType: 'income' | 'expense';
  userId: string;
  paymentMethod: 'cash' | 'pix' | 'card';
  creditCardId?: string | null;
};

export type CreditCard = {
  id: string;
  userId: string;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  balance: number;
  creditLimit: number;
};

export type Investment = {
  id: string;
  name: string;
  type: 'Stock' | 'Bond' | 'Crypto' | 'Fund';
  value: number;
  change: number;
  changePercent: number;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export type AssetAllocation = {
  type: string;
  value: number;
};

    