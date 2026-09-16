'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Landmark,
  PieChart,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type ReportPeriod =
  | 'This month'
  | 'Today'
  | 'This week'
  | 'Last month'
  | 'This year'
  | 'All time';

const periods: ReportPeriod[] = [
  'This month',
  'Today',
  'This week',
  'Last month',
  'This year',
  'All time',
];

type Transaction = {
  id: string;
  user_id: string;
  business_id: string | null;
  account_id: string | null;
  type: string;
  amount: number | string;
  category: string;
  description: string | null;
  date: string;
  created_at: string | null;
  status: string | null;
  currency: string | null;
  exchange_rate: number | string | null;
  amount_base: number | string | null;
  reference: string | null;
  notes: string | null;
  is_deleted: boolean | null;
};

type PeriodRange = {
  start: Date | null;
  end: Date;
};

const toNumber = (
  value: number | string | null | undefined
): number => {
  if (value === null || value === undefined) return 0;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const startOfWeek = (date: Date) => {
  const result = startOfDay(date);
  const day = result.getDay();

  const difference = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - difference);

  return result;
};

const startOfMonth = (date: Date) => {
  const result = startOfDay(date);
  result.setDate(1);

  return result;
};

const startOfYear = (date: Date) => {
  const result = startOfDay(date);
  result.setMonth(0, 1);

  return result;
};

const getPeriodRange = (
  period: ReportPeriod,
  referenceDate = new Date()
): PeriodRange => {
  const current = new Date(referenceDate);

  switch (period) {
    case 'Today':
      return {
        start: startOfDay(current),
        end: endOfDay(current),
      };

    case 'This week':
      return {
        start: startOfWeek(current),
        end: endOfDay(current),
      };

    case 'This month':
      return {
        start: startOfMonth(current),
        end: endOfDay(current),
      };

    case 'Last month': {
      const start = startOfMonth(current);
      start.setMonth(start.getMonth() - 1);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setMilliseconds(-1);

      return {
        start,
        end,
      };
    }

    case 'This year':
      return {
        start: startOfYear(current),
        end: endOfDay(current),
      };

    case 'All time':
      return {
        start: null,
        end: endOfDay(current),
      };
  }
};

const getPreviousPeriodRange = (
  period: ReportPeriod,
  referenceDate = new Date()
): PeriodRange => {
  const current = new Date(referenceDate);

  switch (period) {
    case 'Today': {
      const end = startOfDay(current);
      end.setMilliseconds(-1);

      return {
        start: startOfDay(end),
        end,
      };
    }

    case 'This week': {
      const currentStart = startOfWeek(current);

      const end = new Date(currentStart);
      end.setMilliseconds(-1);

      const start = new Date(currentStart);
      start.setDate(start.getDate() - 7);

      return {
        start,
        end,
      };
    }

    case 'This month': {
      const currentStart = startOfMonth(current);

      const end = new Date(currentStart);
      end.setMilliseconds(-1);

      const start = new Date(currentStart);
      start.setMonth(start.getMonth() - 1);

      return {
        start,
        end,
      };
    }

    case 'Last month': {
      const lastMonthStart = startOfMonth(current);
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

      const end = new Date(lastMonthStart);
      end.setMilliseconds(-1);

      const start = new Date(lastMonthStart);
      start.setMonth(start.getMonth() - 1);

      return {
        start,
        end,
      };
    }

    case 'This year': {
      const currentStart = startOfYear(current);

      const end = new Date(currentStart);
      end.setMilliseconds(-1);

      const start = new Date(currentStart);
      start.setFullYear(start.getFullYear() - 1);

      return {
        start,
        end,
      };
    }

    case 'All time':
      return {
        start: null,
        end: endOfDay(current),
      };
  }
};

const getTransactionAmount = (transaction: Transaction) => {
  const baseAmount = toNumber(transaction.amount_base);

  if (baseAmount !== 0) {
    return baseAmount;
  }

  return toNumber(transaction.amount);
};

const isIncome = (transaction: Transaction) =>
  transaction.type.toLowerCase() === 'income';

const isExpense = (transaction: Transaction) =>
  transaction.type.toLowerCase() === 'expense';

const transactionDate = (transaction: Transaction) => {
  const parsed = new Date(
    transaction.created_at || transaction.date
  );

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date(`${transaction.date}T00:00:00`);
};

const isWithinRange = (
  transaction: Transaction,
  range: PeriodRange
) => {
  const date = transactionDate(transaction);

  if (range.start && date < range.start) {
    return false;
  }

  return date <= range.end;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const formatCompactCurrency = (amount: number) => {
  const absolute = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absolute >= 1_000_000) {
    return `${sign}₦${(absolute / 1_000_000).toFixed(1)}m`;
  }

  if (absolute >= 1_000) {
    return `${sign}₦${Math.round(absolute / 1_000)}k`;
  }

  return `${sign}₦${Math.round(absolute)}`;
};

const formatPercentage = (value: number | null) => {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }

  const sign = value > 0 ? '+' : '';

  return `${sign}${Math.round(value)}%`;
};

const calculateChange = (
  current: number,
  previous: number
): number | null => {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

const escapeCsvValue = (value: string | number | null) => {
  const stringValue =
    value === null || value === undefined
      ? ''
      : String(value);

  return `"${stringValue.replace(/"/g, '""')}"`;
};

function ReportMetric({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  trendPositive,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Wallet;
  trend?: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
          <Icon
            size={18}
            strokeWidth={1.7}
            className="text-emerald-900"
          />
        </div>

        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              trendPositive
                ? 'text-emerald-800'
                : 'text-red-700'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}

            {trend}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function ReportAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border border-gray-200 bg-white p-4 text-left transition-colors hover:border-emerald-900 hover:bg-gray-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
        <Icon
          size={17}
          className="text-emerald-900"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <Download
        size={15}
        className="shrink-0 text-gray-400"
      />
    </button>
  );
}

export default function ReportsPage() {
  const supabase = createClient();

  const [selectedPeriod, setSelectedPeriod] =
    useState<ReportPeriod>('This month');

  const [periodOpen, setPeriodOpen] = useState(false);

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadTransactions = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (mounted) {
          setError('Unable to load your account.');
          setLoading(false);
        }

        return;
      }

      const { data, error: transactionError } =
        await supabase
          .from('transactions')
          .select(`
            id,
            user_id,
            business_id,
            account_id,
            type,
            amount,
            category,
            description,
            date,
            created_at,
            status,
            currency,
            exchange_rate,
            amount_base,
            reference,
            notes,
            is_deleted
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .eq('is_deleted', false)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false });

      if (transactionError) {
        console.error(
          'Reports transaction error:',
          transactionError
        );

        if (mounted) {
          setError(
            'We could not load your financial activity.'
          );
          setLoading(false);
        }

        return;
      }

      if (mounted) {
        setTransactions(
          (data || []) as Transaction[]
        );
        setLoading(false);
      }
    };

    loadTransactions();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const currentRange = useMemo(
    () => getPeriodRange(selectedPeriod),
    [selectedPeriod]
  );

  const previousRange = useMemo(
    () => getPreviousPeriodRange(selectedPeriod),
    [selectedPeriod]
  );

  const currentTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        isWithinRange(transaction, currentRange)
      ),
    [transactions, currentRange]
  );

  const previousTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        isWithinRange(transaction, previousRange)
      ),
    [transactions, previousRange]
  );

  const currentRevenue = useMemo(
    () =>
      currentTransactions
        .filter(isIncome)
        .reduce(
          (total, transaction) =>
            total + getTransactionAmount(transaction),
          0
        ),
    [currentTransactions]
  );

  const currentExpenses = useMemo(
    () =>
      currentTransactions
        .filter(isExpense)
        .reduce(
          (total, transaction) =>
            total + getTransactionAmount(transaction),
          0
        ),
    [currentTransactions]
  );

  const previousRevenue = useMemo(
    () =>
      previousTransactions
        .filter(isIncome)
        .reduce(
          (total, transaction) =>
            total + getTransactionAmount(transaction),
          0
        ),
    [previousTransactions]
  );

  const previousExpenses = useMemo(
    () =>
      previousTransactions
        .filter(isExpense)
        .reduce(
          (total, transaction) =>
            total + getTransactionAmount(transaction),
          0
        ),
    [previousTransactions]
  );

  const grossProfit = currentRevenue - currentExpenses;

  const netCashMovement =
    currentRevenue - currentExpenses;

  const revenueChange = useMemo(
    () =>
      calculateChange(
        currentRevenue,
        previousRevenue
      ),
    [currentRevenue, previousRevenue]
  );

  const expenseChange = useMemo(
    () =>
      calculateChange(
        currentExpenses,
        previousExpenses
      ),
    [currentExpenses, previousExpenses]
  );

  const expenseBreakdown = useMemo(() => {
    const grouped = new Map<
      string,
      number
    >();

    currentTransactions
      .filter(isExpense)
      .forEach((transaction) => {
        const category =
          transaction.category?.trim() ||
          'Uncategorized';

        const current =
          grouped.get(category) || 0;

        grouped.set(
          category,
          current +
            getTransactionAmount(transaction)
        );
      });

    const total = Array.from(
      grouped.values()
    ).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Array.from(grouped.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          total > 0
            ? (amount / total) * 100
            : 0,
      }))
      .sort(
        (a, b) => b.amount - a.amount
      )
      .slice(0, 6);
  }, [currentTransactions]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();

    const months = Array.from(
      { length: 6 },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() -
            (5 - index),
          1
        );

        return {
          key: `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}`,
          month: date.toLocaleDateString(
            'en-US',
            {
              month: 'short',
            }
          ),
          revenue: 0,
          expenses: 0,
        };
      }
    );

    const monthMap = new Map(
      months.map((item) => [
        item.key,
        item,
      ])
    );

    transactions.forEach((transaction) => {
      const date = transactionDate(
        transaction
      );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      const bucket = monthMap.get(key);

      if (!bucket) return;

      const amount =
        getTransactionAmount(transaction);

      if (isIncome(transaction)) {
        bucket.revenue += amount;
      }

      if (isExpense(transaction)) {
        bucket.expenses += amount;
      }
    });

    return months;
  }, [transactions]);

  const maxTrendValue = Math.max(
    ...monthlyTrend.flatMap((item) => [
      item.revenue,
      item.expenses,
    ]),
    1
  );

  const highestRevenue = useMemo(
    () =>
      Math.max(
        ...monthlyTrend.map(
          (item) => item.revenue
        ),
        0
      ),
    [monthlyTrend]
  );

  const highestExpenses = useMemo(
    () =>
      Math.max(
        ...monthlyTrend.map(
          (item) => item.expenses
        ),
        0
      ),
    [monthlyTrend]
  );

  const currentMargin =
    currentRevenue > 0
      ? (grossProfit / currentRevenue) * 100
      : null;

  const exportTransactions = () => {
    if (!currentTransactions.length) {
      return;
    }

    const headers = [
      'Date',
      'Type',
      'Category',
      'Description',
      'Amount',
      'Currency',
      'Reference',
    ];

    const rows =
      currentTransactions.map(
        (transaction) => [
          transaction.date,
          transaction.type,
          transaction.category,
          transaction.description,
          getTransactionAmount(
            transaction
          ),
          transaction.currency || 'NGN',
          transaction.reference,
        ]
      );

    const csv = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map((row) =>
        row
          .map(escapeCsvValue)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download = `monietar-report-${selectedPeriod
      .toLowerCase()
      .replace(/\s+/g, '-')}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-emerald-900">
              <BarChart3 size={14} />
              Finance
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Reports
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Turn your recorded financial activity into
              clear reports for understanding performance,
              cash flow, and profitability.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setPeriodOpen(
                    (open) => !open
                  )
                }
                className="flex h-11 w-full items-center justify-between gap-8 border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {selectedPeriod}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    periodOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              {periodOpen && (
                <div className="absolute right-0 top-12 z-30 w-full min-w-[170px] border border-gray-200 bg-white py-1 shadow-lg sm:w-[180px]">
                  {periods.map(
                    (period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => {
                          setSelectedPeriod(
                            period
                          );
                          setPeriodOpen(
                            false
                          );
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          selectedPeriod ===
                          period
                            ? 'bg-emerald-900 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {period}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={
                exportTransactions
              }
              disabled={
                loading ||
                currentTransactions.length ===
                  0
              }
              className="flex h-11 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export report
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Financial Summary */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportMetric
            label="Revenue"
            value={
              loading
                ? '—'
                : formatCurrency(
                    currentRevenue
                  )
            }
            detail={
              loading
                ? 'Loading transactions...'
                : `${currentTransactions.filter(
                    isIncome
                  ).length} recorded income transactions`
            }
            icon={TrendingUp}
            trend={
              revenueChange === null
                ? undefined
                : formatPercentage(
                    revenueChange
                  )
            }
            trendPositive={
              revenueChange === null
                ? undefined
                : revenueChange >= 0
            }
          />

          <ReportMetric
            label="Expenses"
            value={
              loading
                ? '—'
                : formatCurrency(
                    currentExpenses
                  )
            }
            detail="Total recorded business expenses"
            icon={TrendingDown}
            trend={
              expenseChange === null
                ? undefined
                : formatPercentage(
                    expenseChange
                  )
            }
            trendPositive={
              expenseChange === null
                ? undefined
                : expenseChange <= 0
            }
          />

          <ReportMetric
            label="Gross profit"
            value={
              loading
                ? '—'
                : formatCurrency(
                    grossProfit
                  )
            }
            detail="Revenue less recorded expenses"
            icon={PieChart}
            trend={
              currentRevenue > 0
                ? `${Math.round(
                    currentMargin || 0
                  )}% margin`
                : undefined
            }
            trendPositive={
              currentMargin !== null &&
              currentMargin >= 0
            }
          />

          <ReportMetric
            label="Net cash movement"
            value={
              loading
                ? '—'
                : formatCurrency(
                    netCashMovement
                  )
            }
            detail="Income less recorded expenses"
            icon={Wallet}
            trend={
              loading
                ? undefined
                : netCashMovement >= 0
                ? 'Positive'
                : 'Negative'
            }
            trendPositive={
              netCashMovement >= 0
            }
          />
        </section>

        {/* Main Reports */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* P&L */}
          <section className="border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Profit & Loss
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Financial performance for{' '}
                  {selectedPeriod.toLowerCase()}.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  exportTransactions
                }
                className="flex items-center gap-2 text-sm font-medium text-emerald-900 hover:underline"
              >
                <FileText size={15} />
                Export detailed report
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-0">
                <div className="flex items-center justify-between border-b border-gray-100 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Revenue
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Total income recorded
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-950">
                    {loading
                      ? '—'
                      : formatCurrency(
                          currentRevenue
                        )}
                  </p>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Cost of business activity
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Recorded operating expenses
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-red-700">
                    {loading
                      ? '—'
                      : currentExpenses > 0
                      ? `-${formatCurrency(
                          currentExpenses
                        )}`
                      : formatCurrency(
                          0
                        )}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-[#f8f8f8] px-4 py-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      Gross profit
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Current period result
                    </p>
                  </div>

                  <p
                    className={`text-lg font-semibold ${
                      grossProfit >= 0
                        ? 'text-emerald-900'
                        : 'text-red-700'
                    }`}
                  >
                    {loading
                      ? '—'
                      : formatCurrency(
                          grossProfit
                        )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Expense Breakdown */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-950">
                Expense breakdown
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Where your recorded expenses are going.
              </p>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  Loading expense activity...
                </div>
              ) : expenseBreakdown.length ===
                0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    No expenses recorded
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Expense categories will appear here
                    once you record expenses.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {expenseBreakdown.map(
                    (item) => (
                      <div
                        key={item.category}
                      >
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-700">
                            {item.category}
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(
                              item.amount
                            )}
                          </span>
                        </div>

                        <div className="h-2 bg-gray-100">
                          <div
                            className="h-full bg-emerald-900"
                            style={{
                              width: `${Math.max(
                                item.percentage,
                                2
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-right text-[11px] text-gray-400">
                          {Math.round(
                            item.percentage
                          )}
                          % of expenses
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Trend + Cash Flow */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Performance Trend */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    Revenue vs expenses
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Six-month view of your recorded financial
                    activity.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-emerald-900" />
                    Revenue
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-gray-300" />
                    Expenses
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
                  Loading financial trend...
                </div>
              ) : (
                <>
                  <div className="flex h-[280px] items-end gap-3 sm:gap-5">
                    {monthlyTrend.map(
                      (item) => (
                        <div
                          key={item.key}
                          className="flex h-full min-w-0 flex-1 flex-col justify-end"
                        >
                          <div className="relative flex h-[220px] items-end justify-center gap-1 sm:gap-2">
                            <div
                              className="w-1/2 bg-emerald-900"
                              style={{
                                height: `${Math.max(
                                  (item.revenue /
                                    maxTrendValue) *
                                    100,
                                  item.revenue >
                                    0
                                    ? 3
                                    : 0
                                )}%`,
                              }}
                              title={`Revenue: ${formatCurrency(
                                item.revenue
                              )}`}
                            />

                            <div
                              className="w-1/2 bg-gray-300"
                              style={{
                                height: `${Math.max(
                                  (item.expenses /
                                    maxTrendValue) *
                                    100,
                                  item.expenses >
                                    0
                                    ? 3
                                    : 0
                                )}%`,
                              }}
                              title={`Expenses: ${formatCurrency(
                                item.expenses
                              )}`}
                            />
                          </div>

                          <p className="mt-3 text-center text-xs text-gray-500">
                            {item.month}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-gray-500">
                          Highest revenue
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-950">
                          {formatCompactCurrency(
                            highestRevenue
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Highest expenses
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-950">
                          {formatCompactCurrency(
                            highestExpenses
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Current margin
                        </p>

                        <p className="mt-1 text-sm font-semibold text-emerald-900">
                          {currentMargin ===
                          null
                            ? '—'
                            : `${Math.round(
                                currentMargin
                              )}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Cash Flow */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-950">
                Cash flow
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Recorded money in and money out for the selected
                period.
              </p>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-emerald-200 bg-emerald-50">
                      <ArrowDownRight
                        size={16}
                        className="text-emerald-800"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Money in
                      </p>

                      <p className="text-xs text-gray-500">
                        Recorded income
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-emerald-800">
                    {loading
                      ? '—'
                      : `+${formatCurrency(
                          currentRevenue
                        )}`}
                  </p>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-red-200 bg-red-50">
                      <ArrowUpRight
                        size={16}
                        className="text-red-700"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Money out
                      </p>

                      <p className="text-xs text-gray-500">
                        Recorded expenses
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-red-700">
                    {loading
                      ? '—'
                      : `-${formatCurrency(
                          currentExpenses
                        )}`}
                  </p>
                </div>

                <div className="bg-[#f8f8f8] p-4">
                  <p className="text-xs text-gray-500">
                    Net cash movement
                  </p>

                  <p
                    className={`mt-1 text-xl font-semibold ${
                      netCashMovement >= 0
                        ? 'text-gray-950'
                        : 'text-red-700'
                    }`}
                  >
                    {loading
                      ? '—'
                      : formatCurrency(
                          netCashMovement
                        )}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Based on recorded transactions.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Exportable Reports */}
        <section className="mt-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-950">
              Financial reports
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Generate reports from the financial activity recorded
              in Monietar.
            </p>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
            <ReportAction
              icon={FileText}
              title="Profit & Loss"
              description="Revenue, expenses and profit"
              onClick={
                exportTransactions
              }
            />

            <ReportAction
              icon={Wallet}
              title="Cash Flow Statement"
              description="Money in, money out and movement"
              onClick={
                exportTransactions
              }
            />

            <ReportAction
              icon={Receipt}
              title="Transaction Report"
              description="Detailed transaction activity"
              onClick={
                exportTransactions
              }
            />

            <ReportAction
              icon={FileSpreadsheet}
              title="Financial Statement"
              description="Export-ready business statement"
              onClick={
                exportTransactions
              }
            />
          </div>
        </section>

        {/* Bottom Note */}
        <div className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Landmark size={14} />
            Reports are generated from your recorded financial
            activity.
          </div>

          <p className="text-gray-400">
            Powered by your transaction records
          </p>
        </div>
      </div>
    </div>
  );
}