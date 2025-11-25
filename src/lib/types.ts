export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'Income' | 'Housing' | 'Food' | 'Transport' | 'Entertainment' | 'Health' | 'Shopping' | 'Utilities';
  type: 'income' | 'expense';
};

export type CreditCard = {
  id: string;
  name: string;
  last4: string;
  balance: number;
  limit: number;
  dueDate: string;
  transactions: Transaction[];
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
