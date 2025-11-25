import type { Account, AssetAllocation, CreditCard, Investment, Transaction } from './types';

export const accounts: Account[] = [
  { id: '1', name: 'Checking Account', balance: 5210.50 },
  { id: '2', name: 'Savings Account', balance: 15820.75 },
];

export const transactions: Transaction[] = [
  { id: '1', date: '2024-07-26', description: 'Salary Deposit', amount: 4500.00, category: 'Income', type: 'income' },
  { id: '2', date: '2024-07-25', description: 'Grocery Shopping', amount: -150.25, category: 'Food', type: 'expense' },
  { id: '3', date: '2024-07-25', description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', type: 'expense' },
  { id: '4', date: '2024-07-24', description: 'Gasoline', amount: -55.70, category: 'Transport', type: 'expense' },
  { id: '5', date: '2024-07-23', description: 'Rent Payment', amount: -1200.00, category: 'Housing', type: 'expense' },
  { id: '6', date: '2024-07-22', description: 'Dinner with friends', amount: -85.50, category: 'Food', type: 'expense' },
  { id: '7', date: '2024-07-21', description: 'Electricity Bill', amount: -75.00, category: 'Utilities', type: 'expense' },
  { id: '8', date: '2024-07-20', description: 'Freelance Project', amount: 800.00, category: 'Income', type: 'income' },
];

export const creditCards: CreditCard[] = [
  {
    id: 'cc1',
    name: 'Visa Platinum',
    last4: '4242',
    balance: 1250.45,
    limit: 10000,
    dueDate: '2024-08-15',
    transactions: transactions.slice(1, 4),
  },
  {
    id: 'cc2',
    name: 'Amex Gold',
    last4: '8431',
    balance: 342.80,
    limit: 15000,
    dueDate: '2024-08-20',
    transactions: transactions.slice(4, 6),
  },
];

export const investments: Investment[] = [
  { id: 'inv1', name: 'Apple Inc.', type: 'Stock', value: 15000, change: 150.25, changePercent: 1.01 },
  { id: 'inv2', name: 'Vanguard S&P 500 ETF', type: 'Fund', value: 25000, change: -50.10, changePercent: -0.20 },
  { id: 'inv3', name: 'Bitcoin', type: 'Crypto', value: 8500, change: 450.75, changePercent: 5.60 },
  { id: 'inv4', name: 'US Treasury Bond', type: 'Bond', value: 5000, change: 5.50, changePercent: 0.11 },
];

export const assetAllocation: AssetAllocation[] = investments.map(inv => ({ type: inv.type, value: inv.value }));

export const financialSummary = {
  totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
  totalDebt: creditCards.reduce((sum, card) => sum + card.balance, 0),
  netWorth: accounts.reduce((sum, acc) => sum + acc.balance, 0) + investments.reduce((sum, inv) => sum + inv.value, 0) - creditCards.reduce((sum, card) => sum + card.balance, 0),
  monthlyIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
  monthlyExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};
