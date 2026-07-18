// app/dashboard/overview/types.ts

export type TransactionType = 'income' | 'expense';

export type TransactionStatus =
  | 'completed'
  | 'pending'
  | 'failed';

export type BankSyncStatus =
  | 'connected'
  | 'syncing'
  | 'error';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface KPI {
  title: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down';
}

export interface CashAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface InventoryStats {
  totalItems: number;
  inventoryValue: number;
  lowStock: number;
  outOfStock: number;
  restockNeeded: number;
  turnover: number;
  warehouseCapacity: number;
  topCategory: string;
}

export interface FinancialRatio {
  title: string;
  value: string;
  target: string;
  score: number;
}

export interface AIAlert {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Positive' | 'Good';
}

export interface SystemService {
  name: string;
  status: BankSyncStatus;
}

export interface FinancialData {
  currency: string;

  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashBalance: number;
  bankBalance: number;

  monthlyRevenue: number[];
  monthlyExpenses: number[];

  transactions: Transaction[];

  inventory?: InventoryStats;

  recommendations?: string[];

  alerts?: AIAlert[];
}

export interface OverviewPageProps {
  darkMode: boolean;

  financialData: FinancialData;

  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;

  setShowIncomeForm: (
    value: boolean
  ) => void;

  setShowExpenseForm: (
    value: boolean
  ) => void;
}