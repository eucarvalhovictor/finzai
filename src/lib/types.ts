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
  installments?: number; // Total number of installments
  installmentNumber?: number; // The number of the current installment (e.g., 1, 2, 3)
  originalTransactionId?: string; // An ID to group all installments of a single purchase
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
  userId: string;
  name: string;
  ticker: string;
  type: 'Ação' | 'FII' | 'BDR' | 'Cripto' | 'Renda Fixa';
  quantity: number;
  valuePerShare: number;
  institution: string; // Corretora
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

export type UserRole = 'basico' | 'completo' | 'admin';

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  registrationDate: Timestamp;
  role: UserRole;
  photoURL?: string;
};

export type SeoSettings = {
  id: string;
  siteTitle: string;
  defaultDescription: string;
  faviconUrl?: string;
};
