// lib/dashboard.ts

import { createClient } from '@/lib/supabase/server';

import type {
  FinancialData,
  Transaction,
  Recommendation,
  BankSyncStatus,
} from '@/app/components/dashboard/overview/types';

export interface DashboardData {
  financialData: FinancialData;

  transactions: Transaction[];

  recommendations: Recommendation[];

  summary: {
    income: number;
    expenses: number;
    profit: number;
    cashVaultBalance: number;
  };

  system: {
    inventoryAlerts: number;
    activeCurrencies: string[];
    bankSyncStatus: BankSyncStatus;
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  /**
   * Logged in user
   */

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not authenticated');
  }

  const userId = user.id;

  /**
   * Transactions
   */

  const {
    data: transactionsData,
    error: transactionsError,
  } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {
      ascending: false,
    });

  if (transactionsError) {
    console.error(transactionsError);
  }

  const transactions: Transaction[] =
    (transactionsData ?? []).map((t: any) => ({
      id: t.id,
      description: t.description ?? '',
      category: t.category ?? '',
      date: t.date,
      type: t.type,
      amount: Number(t.amount),
      status: 'completed',
    }));

  /**
   * Accounts
   */

  const {
    data: accountsData,
    error: accountsError,
  } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);

  if (accountsError) {
    console.error(accountsError);
  }

  const accounts = accountsData ?? [];

  /**
   * Inventory
   *
   * Disabled temporarily.
   */

  const inventoryData = null;

  /**
   * Recommendations
   *
   * Disabled temporarily.
   */

  const recommendations: Recommendation[] = [];

  /**
   * Financial calculations
   */

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = income - expenses;

  const cashVaultBalance = accounts.reduce(
    (sum: number, account: any) =>
      sum + Number(account.balance ?? 0),
    0
  );

  /**
   * Financial object
   */

  const financialData: FinancialData = {
    currency: 'NGN',

    totalRevenue: income,

    totalExpenses: expenses,

    netProfit: profit,

    cashBalance: cashVaultBalance,

    bankBalance: cashVaultBalance,

    monthlyRevenue: [],

    monthlyExpenses: [],

    transactions,

    inventory: undefined,

    recommendations: [],

    alerts: [],
  };

  return {
    financialData,

    transactions,

    recommendations,

    summary: {
      income,
      expenses,
      profit,
      cashVaultBalance,
    },

    system: {
      inventoryAlerts: 0,

      activeCurrencies: ['NGN'],

      bankSyncStatus: 'connected',
    },
  };
}