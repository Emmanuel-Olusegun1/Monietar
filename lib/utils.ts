// app/dashboard/overview/utils.ts

import {
  FinancialData,
  Transaction,
  BankSyncStatus,
} from '../app/components/dashboard/overview/types';

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency = 'NGN',
  locale = 'en-NG'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format compact numbers
 */
export const formatCompactNumber = (
  value: number
): string => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Format large integers
 */
export const formatNumber = (
  value: number
): string => {
  return new Intl.NumberFormat().format(value);
};

/**
 * Calculate Net Profit
 */
export const calculateNetProfit = (
  revenue: number,
  expenses: number
): number => revenue - expenses;

/**
 * Profit Margin
 */
export const calculateProfitMargin = (
  revenue: number,
  expenses: number
): number => {
  if (!revenue) return 0;

  return ((revenue - expenses) / revenue) * 100;
};

/**
 * Cash Ratio
 */
export const calculateCashRatio = (
  cash: number,
  liabilities: number
): number => {
  if (!liabilities) return 0;

  return cash / liabilities;
};

/**
 * Current Ratio
 */
export const calculateCurrentRatio = (
  assets: number,
  liabilities: number
): number => {
  if (!liabilities) return 0;

  return assets / liabilities;
};

/**
 * Growth %
 */
export const calculateGrowth = (
  current: number,
  previous: number
): number => {
  if (!previous) return 0;

  return ((current - previous) / previous) * 100;
};

/**
 * Total Income
 */
export const getTotalIncome = (
  transactions: Transaction[]
): number =>
  transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

/**
 * Total Expenses
 */
export const getTotalExpenses = (
  transactions: Transaction[]
): number =>
  transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

/**
 * Latest Transactions
 */
export const getRecentTransactions = (
  transactions: Transaction[],
  limit = 5
): Transaction[] =>
  [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, limit);

/**
 * Bank Status Color
 */
export const getBankStatusColor = (
  status: BankSyncStatus
): string => {
  switch (status) {
    case 'connected':
      return 'text-emerald-600';

    case 'syncing':
      return 'text-amber-500';

    case 'error':
      return 'text-red-500';

    default:
      return 'text-gray-500';
  }
};

/**
 * Badge Color
 */
export const getBadgeColor = (
  value: number
): string => {
  if (value >= 80)
    return 'bg-emerald-100 text-emerald-700';

  if (value >= 60)
    return 'bg-amber-100 text-amber-700';

  return 'bg-red-100 text-red-700';
};

/**
 * Health Score
 */
export const calculateBusinessHealth = (
  data: FinancialData
): number => {
  let score = 100;

  if (data.totalExpenses > data.totalRevenue)
    score -= 30;

  if (data.cashBalance < 50000)
    score -= 20;

  if (
    data.inventory &&
    data.inventory.outOfStock > 5
  )
    score -= 15;

  if (
    data.inventory &&
    data.inventory.lowStock > 20
  )
    score -= 10;

  return Math.max(score, 0);
};

/**
 * Executive Status
 */
export const getBusinessStatus = (
  score: number
): {
  label: string;
  color: string;
} => {
  if (score >= 90)
    return {
      label: 'Excellent',
      color:
        'bg-emerald-100 text-emerald-700',
    };

  if (score >= 75)
    return {
      label: 'Healthy',
      color: 'bg-blue-100 text-blue-700',
    };

  if (score >= 60)
    return {
      label: 'Fair',
      color:
        'bg-amber-100 text-amber-700',
    };

  return {
    label: 'Needs Attention',
    color: 'bg-red-100 text-red-700',
  };
};

/**
 * Greeting
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12)
    return 'Good Morning';

  if (hour < 17)
    return 'Good Afternoon';

  return 'Good Evening';
};

/**
 * Today's Date
 */
export const getFormattedDate = (): string => {
  return new Date().toLocaleDateString(
    'en-NG',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
};

/**
 * Random AI Confidence
 */
export const getAIConfidence = (): number => {
  return Math.floor(
    Math.random() * (99 - 92) + 92
  );
};