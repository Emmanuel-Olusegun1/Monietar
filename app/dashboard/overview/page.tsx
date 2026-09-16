'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  Package,
  Plus,
  Receipt,
  Wallet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/*
|--------------------------------------------------------------------------
| Plan
|--------------------------------------------------------------------------
*/

type Plan =
  | 'RETAIL_STARTER'
  | 'GROWING_MERCHANT'
  | 'BORDERLESS_PRO';

const CURRENT_PLAN: Plan = 'RETAIL_STARTER';

const PLAN_CONFIG = {
  RETAIL_STARTER: {
    name: 'Retail Starter',
    transactionLimit: 500,
  },

  GROWING_MERCHANT: {
    name: 'Growing Merchant',
    transactionLimit: 2500,
  },

  BORDERLESS_PRO: {
    name: 'Borderless Pro',
    transactionLimit: Infinity,
  },
};

const plan = PLAN_CONFIG[CURRENT_PLAN];

/*
|--------------------------------------------------------------------------
| Period
|--------------------------------------------------------------------------
*/

type PeriodKey =
  | 'today'
  | 'this-week'
  | 'this-month'
  | 'last-month'
  | 'this-year'
  | 'all-time';

const PERIODS: Record<
  PeriodKey,
  {
    label: string;
  }
> = {
  today: {
    label: 'Today',
  },

  'this-week': {
    label: 'This week',
  },

  'this-month': {
    label: 'This month',
  },

  'last-month': {
    label: 'Last month',
  },

  'this-year': {
    label: 'This year',
  },

  'all-time': {
    label: 'All time',
  },
};

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

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

type CashFlowDay = {
  key: string;
  label: string;
  income: number;
  expenses: number;
};

type PeriodRange = {
  start: Date;
  end: Date;
  previousStart: Date | null;
  previousEnd: Date | null;
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatCurrency(
  amount: number,
  currency = '₦'
) {
  return `${currency}${Math.round(amount).toLocaleString(
    'en-NG'
  )}`;
}

function formatPercentage(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function toNumber(
  value: number | string | null | undefined
) {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
}

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);

  const day = result.getDay();

  const difference = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - difference);

  return result;
}

function startOfMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
}

function endOfMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
}

function startOfYear(date: Date) {
  return new Date(
    date.getFullYear(),
    0,
    1,
    0,
    0,
    0,
    0
  );
}

function endOfYear(date: Date) {
  return new Date(
    date.getFullYear(),
    11,
    31,
    23,
    59,
    59,
    999
  );
}

function getPeriodRange(
  period: PeriodKey,
  now = new Date()
): PeriodRange {
  if (period === 'today') {
    const start = startOfDay(now);
    const end = endOfDay(now);

    const previousStart = new Date(start);
    previousStart.setDate(
      previousStart.getDate() - 1
    );

    const previousEnd = new Date(end);
    previousEnd.setDate(
      previousEnd.getDate() - 1
    );

    return {
      start,
      end,
      previousStart,
      previousEnd,
    };
  }

  if (period === 'this-week') {
    const start = startOfWeek(now);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const previousStart = new Date(start);
    previousStart.setDate(
      previousStart.getDate() - 7
    );

    const previousEnd = new Date(end);
    previousEnd.setDate(
      previousEnd.getDate() - 7
    );

    return {
      start,
      end,
      previousStart,
      previousEnd,
    };
  }

  if (period === 'this-month') {
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    return {
      start,
      end,
      previousStart: startOfMonth(
        previousMonth
      ),
      previousEnd: endOfMonth(
        previousMonth
      ),
    };
  }

  if (period === 'last-month') {
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1
    );

    return {
      start: startOfMonth(lastMonth),
      end: endOfMonth(lastMonth),
      previousStart:
        startOfMonth(previousMonth),
      previousEnd:
        endOfMonth(previousMonth),
    };
  }

  if (period === 'this-year') {
    const start = startOfYear(now);
    const end = endOfYear(now);

    const previousYear = new Date(
      now.getFullYear() - 1,
      0,
      1
    );

    return {
      start,
      end,
      previousStart:
        startOfYear(previousYear),
      previousEnd:
        endOfYear(previousYear),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | All time
  |--------------------------------------------------------------------------
  |
  | There is no meaningful "previous all-time" period.
  | Therefore comparison percentages are intentionally omitted.
  |--------------------------------------------------------------------------
  */

  return {
    start: new Date(1970, 0, 1),
    end: endOfDay(now),
    previousStart: null,
    previousEnd: null,
  };
}

function dateToISO(date: Date) {
  return date.toISOString().split('T')[0];
}

function calculateChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return null;
  }

  return ((current - previous) / previous) * 100;
}

function getTransactionAmount(
  transaction: Transaction
) {
  const amountBase =
    transaction.amount_base;

  if (
    amountBase !== null &&
    amountBase !== undefined &&
    Number(amountBase) !== 0
  ) {
    return toNumber(amountBase);
  }

  return toNumber(transaction.amount);
}

function getIncome(
  transactions: Transaction[]
) {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total +
        getTransactionAmount(transaction),
      0
    );
}

function getExpenses(
  transactions: Transaction[]
) {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense'
    )
    .reduce(
      (total, transaction) =>
        total +
        getTransactionAmount(transaction),
      0
    );
}

function getDisplayName(
  email: string | undefined
) {
  if (!email) {
    return 'there';
  }

  const localPart = email.split('@')[0];

  const cleaned = localPart
    .replace(/[._-]+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'there';
  }

  return cleaned
    .split(' ')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
}

function formatTransactionDate(
  date: string,
  createdAt: string | null
) {
  const dateValue = createdAt
    ? new Date(createdAt)
    : new Date(`${date}T00:00:00`);

  if (Number.isNaN(dateValue.getTime())) {
    return date;
  }

  return dateValue.toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/*
|--------------------------------------------------------------------------
| Cash Flow Chart
|--------------------------------------------------------------------------
*/

function getChartRange(
  period: PeriodKey,
  now = new Date()
) {
  const selectedRange = getPeriodRange(
    period,
    now
  );

  /*
  |--------------------------------------------------------------------------
  | For today, show today.
  |--------------------------------------------------------------------------
  */

  if (period === 'today') {
    return {
      start: selectedRange.start,
      end: selectedRange.end,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | For this week, show the actual seven days.
  |--------------------------------------------------------------------------
  */

  if (period === 'this-week') {
    return {
      start: selectedRange.start,
      end: selectedRange.end,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | For longer periods, keep the existing seven-bar visual language.
  |--------------------------------------------------------------------------
  */

  return {
    start: selectedRange.start,
    end: selectedRange.end,
  };
}

function getChartDays(
  period: PeriodKey,
  transactions: Transaction[],
  now = new Date()
): CashFlowDay[] {
  const { start, end } = getChartRange(
    period,
    now
  );

  const totalDays =
    Math.floor(
      (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const bucketCount = Math.min(
    7,
    Math.max(1, totalDays)
  );

  const days: CashFlowDay[] = [];

  for (
    let index = 0;
    index < bucketCount;
    index++
  ) {
    const startOffset = Math.floor(
      (index * totalDays) /
        bucketCount
    );

    const endOffset =
      Math.floor(
        ((index + 1) * totalDays) /
          bucketCount
      ) - 1;

    const bucketStart = new Date(start);

    bucketStart.setDate(
      bucketStart.getDate() +
        startOffset
    );

    const bucketEnd = new Date(start);

    bucketEnd.setDate(
      bucketEnd.getDate() +
        Math.max(
          startOffset,
          endOffset
        )
    );

    bucketEnd.setHours(
      23,
      59,
      59,
      999
    );

    const bucketTransactions =
      transactions.filter(
        (transaction) => {
          const transactionDate =
            new Date(
              `${transaction.date}T00:00:00`
            );

          return (
            transactionDate >=
              bucketStart &&
            transactionDate <= bucketEnd
          );
        }
      );

    const income =
      getIncome(bucketTransactions);

    const expenses =
      getExpenses(bucketTransactions);

    let label = '';

    if (period === 'today') {
      label = 'Today';
    } else if (
      period === 'this-week'
    ) {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            weekday: 'short',
          }
        );
    } else if (
      period === 'this-month'
    ) {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            day: 'numeric',
          }
        );
    } else if (
      period === 'last-month'
    ) {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            day: 'numeric',
          }
        );
    } else if (
      period === 'this-year'
    ) {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            month: 'short',
          }
        );
    } else {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            month: 'short',
            year: '2-digit',
          }
        );
    }

    days.push({
      key: `${dateToISO(
        bucketStart
      )}-${index}`,
      label,
      income,
      expenses,
    });
  }

  return days;
}


// Greating function
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 17) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function OverviewPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodKey>('this-month');

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [hoveredDay, setHoveredDay] =
    useState<string | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [
    previousTransactions,
    setPreviousTransactions,
  ] = useState<Transaction[]>([]);

  const [
    recentTransactions,
    setRecentTransactions,
  ] = useState<Transaction[]>([]);

  const [userName, setUserName] =
    useState('there');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const period =
    PERIODS[selectedPeriod];

  /*
  |--------------------------------------------------------------------------
  | Load Overview Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } =
          await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          throw new Error(
            'You must be signed in to view your overview.'
          );
        }

        const metadataName =
          typeof user.user_metadata
            ?.full_name === 'string'
            ? user.user_metadata
                .full_name
            : typeof user.user_metadata
                ?.name === 'string'
            ? user.user_metadata.name
            : undefined;

        if (mounted) {
          setUserName(
            metadataName ||
              getDisplayName(user.email)
          );
        }

        const {
          start,
          end,
          previousStart,
          previousEnd,
        } = getPeriodRange(
          selectedPeriod
        );

        /*
        |--------------------------------------------------------------------------
        | Current transaction query
        |--------------------------------------------------------------------------
        */

        let currentQuery =
          supabase
            .from('transactions')
            .select(
              `
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
              `
            )
            .eq(
              'user_id',
              user.id
            )
            .eq(
              'status',
              'completed'
            )
            .eq(
              'is_deleted',
              false
            )
            .gte(
              'date',
              dateToISO(start)
            )
            .lte(
              'date',
              dateToISO(end)
            )
            .order('date', {
              ascending: false,
            })
            .order('created_at', {
              ascending: false,
            });

        /*
        |--------------------------------------------------------------------------
        | Previous period query
        |--------------------------------------------------------------------------
        */

        let previousQuery =
          supabase
            .from('transactions')
            .select(
              `
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
              `
            )
            .eq(
              'user_id',
              user.id
            )
            .eq(
              'status',
              'completed'
            )
            .eq(
              'is_deleted',
              false
            );

        /*
        |--------------------------------------------------------------------------
        | All time has no previous period.
        |--------------------------------------------------------------------------
        */

        if (
          previousStart &&
          previousEnd
        ) {
          previousQuery =
            previousQuery
              .gte(
                'date',
                dateToISO(
                  previousStart
                )
              )
              .lte(
                'date',
                dateToISO(
                  previousEnd
                )
              )
              .order('date', {
                ascending: false,
              })
              .order(
                'created_at',
                {
                  ascending: false,
                }
              );
        } else {
          /*
          |--------------------------------------------------------------------------
          | Keep this query valid while returning no previous transactions.
          |--------------------------------------------------------------------------
          */

          previousQuery =
            previousQuery
              .eq(
                'id',
                '00000000-0000-0000-0000-000000000000'
              );
        }

        /*
        |--------------------------------------------------------------------------
        | Recent transactions
        |--------------------------------------------------------------------------
        */

        const recentQuery =
          supabase
            .from('transactions')
            .select(
              `
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
              `
            )
            .eq(
              'user_id',
              user.id
            )
            .eq(
              'status',
              'completed'
            )
            .eq(
              'is_deleted',
              false
            )
            .order('date', {
              ascending: false,
            })
            .order('created_at', {
              ascending: false,
            })
            .limit(4);

        /*
        |--------------------------------------------------------------------------
        | Run queries
        |--------------------------------------------------------------------------
        */

        const [
          currentResult,
          previousResult,
          recentResult,
        ] = await Promise.all([
          currentQuery,
          previousQuery,
          recentQuery,
        ]);

        if (currentResult.error) {
          throw currentResult.error;
        }

        if (previousResult.error) {
          throw previousResult.error;
        }

        if (recentResult.error) {
          throw recentResult.error;
        }

        if (!mounted) {
          return;
        }

        setTransactions(
          (currentResult.data ??
            []) as Transaction[]
        );

        setPreviousTransactions(
          (previousResult.data ??
            []) as Transaction[]
        );

        setRecentTransactions(
          (recentResult.data ??
            []) as Transaction[]
        );
      } catch (loadError) {
        console.error(
          'Failed to load dashboard overview:',
          loadError
        );

        if (!mounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load your financial overview.'
        );

        setTransactions([]);
        setPreviousTransactions(
          []
        );
        setRecentTransactions([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      mounted = false;
    };
  }, [
    selectedPeriod,
    supabase,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Financial Calculations
  |--------------------------------------------------------------------------
  */

  const moneyIn = useMemo(
    () => getIncome(transactions),
    [transactions]
  );

  const moneyOut = useMemo(
    () =>
      getExpenses(transactions),
    [transactions]
  );

  const netMovement =
    moneyIn - moneyOut;

  const previousMoneyIn =
    useMemo(
      () =>
        getIncome(
          previousTransactions
        ),
      [previousTransactions]
    );

  const previousMoneyOut =
    useMemo(
      () =>
        getExpenses(
          previousTransactions
        ),
      [previousTransactions]
    );

  const previousNetMovement =
    previousMoneyIn -
    previousMoneyOut;

  const revenue = moneyIn;

  const profit = netMovement;

  const revenueChange =
    selectedPeriod === 'all-time'
      ? null
      : calculateChange(
          revenue,
          previousMoneyIn
        );

  const profitChange =
    selectedPeriod === 'all-time'
      ? null
      : calculateChange(
          profit,
          previousNetMovement
        );

  /*
  |--------------------------------------------------------------------------
  | Cash Flow
  |--------------------------------------------------------------------------
  */

  const cashFlow = useMemo(
    () =>
      getChartDays(
        selectedPeriod,
        transactions
      ),
    [
      selectedPeriod,
      transactions,
    ]
  );

  const chartMax = Math.max(
    1,
    ...cashFlow.flatMap((item) => [
      item.income,
      item.expenses,
    ])
  );

  /*
  |--------------------------------------------------------------------------
  | Current transaction count
  |--------------------------------------------------------------------------
  */

  const transactionCount =
    transactions.length;

  const recentTransactionCount =
    recentTransactions.length;

  /*
  |--------------------------------------------------------------------------
  | Automatic transaction usage
  |--------------------------------------------------------------------------
  |
  | The existing transactions schema does not currently expose whether a
  | transaction was automatically imported from a bank connection.
  |
  | We therefore do NOT pretend that recorded transactions are automatic
  | bank transactions.
  |--------------------------------------------------------------------------
  */

  const automaticTransactions:
    | number
    | null = null;

  const transactionUsage =
    automaticTransactions ===
      null ||
    plan.transactionLimit ===
      Infinity
      ? null
      : Math.min(
          100,
          Math.round(
            (automaticTransactions /
              plan.transactionLimit) *
              100
          )
        );

  const remainingTransactions =
    automaticTransactions ===
      null ||
    plan.transactionLimit ===
      Infinity
      ? null
      : Math.max(
          0,
          plan.transactionLimit -
            automaticTransactions
        );

  /*
  |--------------------------------------------------------------------------
  | Insight
  |--------------------------------------------------------------------------
  */

  let insightTitle =
    'Start recording activity to unlock financial insights.';

  let insightDescription =
    'Monietar will use your recorded transactions to surface useful patterns in your cash flow.';

  if (!loading) {
    if (transactions.length > 0) {
      if (netMovement > 0) {
        insightTitle =
          'More money came in than went out during this period.';

        insightDescription =
          'Your recorded inflows are ahead of your recorded outflows. Keep monitoring expenses as the period progresses.';
      } else if (
        netMovement < 0
      ) {
        insightTitle =
          'Recorded outflows are currently ahead of inflows.';

        insightDescription =
          'Review your recent expenses and monitor upcoming payments to understand what is driving the movement.';
      } else {
        insightTitle =
          'Your recorded money in and money out are currently balanced.';

        insightDescription =
          'Continue recording activity to give Monietar more context about your financial movement.';
      }
    }
  }

  return (
    <main className="min-h-full bg-[#f1f1f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* -------------------------------------------------------------- */}
        {/* Page Introduction */}
        {/* -------------------------------------------------------------- */}

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Financial overview
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
  {getGreeting()}, {userName}.
</h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Here&apos;s what&apos;s happening
              with your business.
            </p>
          </div>

          {/* Period selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setPeriodOpen(
                  (open) => !open
                )
              }
              className="
                flex h-10 w-fit items-center gap-2
                border border-gray-200
                bg-white
                px-3
                text-sm text-gray-700
                transition-colors
                hover:bg-gray-50
              "
              aria-expanded={periodOpen}
              aria-haspopup="listbox"
            >
              <CalendarDays
                size={16}
                strokeWidth={1.7}
              />

              <span>
                {period.label}
              </span>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className={`text-gray-400 transition-transform ${
                  periodOpen
                    ? 'rotate-180'
                    : ''
                }`}
              />
            </button>

            {periodOpen && (
              <div
                className="
                  absolute right-0 z-30 mt-2
                  w-44
                  border border-gray-200
                  bg-white
                  py-1
                  shadow-sm
                "
                role="listbox"
              >
                {(
                  Object.entries(
                    PERIODS
                  ) as [
                    PeriodKey,
                    (typeof PERIODS)[PeriodKey]
                  ][]
                ).map(
                  ([key, option]) => (
                    <button
                      key={key}
                      type="button"
                      role="option"
                      aria-selected={
                        selectedPeriod ===
                        key
                      }
                      onClick={() => {
                        setSelectedPeriod(
                          key
                        );
                        setPeriodOpen(
                          false
                        );
                        setHoveredDay(
                          null
                        );
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedPeriod ===
                        key
                          ? 'bg-emerald-50 text-emerald-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>
                        {
                          option.label
                        }
                      </span>

                      {selectedPeriod ===
                        key && (
                        <span className="h-1.5 w-1.5 bg-emerald-900" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Error */}
        {/* -------------------------------------------------------------- */}

        {error && (
          <section className="mb-6 border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <CircleAlert
                size={17}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-medium text-red-900">
                  We couldn&apos;t load your
                  financial overview.
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Financial Snapshot */}
        {/* -------------------------------------------------------------- */}

        <section className="grid grid-cols-1 gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Revenue"
            value={
              loading
                ? '—'
                : formatCurrency(
                    revenue
                  )
            }
            change={revenueChange}
            description="Total money received"
            icon={ArrowDownRight}
          />

          <MetricCard
            label="Profit"
            value={
              loading
                ? '—'
                : formatCurrency(
                    profit
                  )
            }
            change={profitChange}
            description="Income less recorded expenses"
            icon={BarChart3}
          />

          <MetricCard
            label="Cash Position"
            value="—"
            change={null}
            description="Connect an account to track balance"
            icon={Wallet}
          />

          {/* Bank Activity */}
          <div className="bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                  Bank Activity
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
                  {automaticTransactions ===
                  null
                    ? '—'
                    : automaticTransactions}

                  <span className="text-base font-normal text-gray-400">
                    {' '}
                    /{' '}
                    {plan.transactionLimit ===
                    Infinity
                      ? '∞'
                      : plan.transactionLimit}
                  </span>
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-emerald-900">
                <Zap
                  size={17}
                  strokeWidth={1.7}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Automatic transaction tracking
              will appear here when bank
              connections are enabled.
            </p>

            {transactionUsage !==
              null && (
              <div className="mt-4">
                <div className="h-1.5 w-full bg-gray-100">
                  <div
                    className="h-full bg-emerald-900 transition-all"
                    style={{
                      width: `${transactionUsage}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                  <span>
                    {
                      remainingTransactions
                    }{' '}
                    remaining
                  </span>

                  <span>
                    {transactionUsage}%
                    used
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Main Content */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
          {/* ------------------------------------------------------------ */}
          {/* Cash Flow */}
          {/* ------------------------------------------------------------ */}

          <section className="border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Cash Flow
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Money in versus money out
                </p>
              </div>

              <a
                href="reports"
                target ='_blank'
                rel ='norefopener'
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-900 hover:underline"
              >
                View report
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                />
              </a>
            </div>

            <div className="p-5 sm:p-6">
              {/* Summary */}
              <div className="mb-7 grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Money in
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loading
                      ? '—'
                      : formatCurrency(
                          moneyIn
                        )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Money out
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loading
                      ? '—'
                      : formatCurrency(
                          moneyOut
                        )}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Net movement
                  </p>

                  <p
                    className={`mt-1 text-lg font-semibold ${
                      netMovement >=
                      0
                        ? 'text-emerald-900'
                        : 'text-red-600'
                    }`}
                  >
                    {loading
                      ? '—'
                      : `${
                          netMovement >=
                          0
                            ? '+'
                            : ''
                        }${formatCurrency(
                          netMovement
                        )}`}
                  </p>
                </div>
              </div>

              {/* Empty state */}
              {!loading &&
                !error &&
                transactions.length ===
                  0 && (
                  <div className="flex min-h-[230px] flex-col items-center justify-center border border-dashed border-gray-200 px-6 text-center">
                    <div className="flex h-10 w-10 items-center justify-center bg-gray-50 text-gray-400">
                      <BarChart3
                        size={18}
                        strokeWidth={
                          1.7
                        }
                      />
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No transactions for
                      this period
                    </p>

                    <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                      Record your first
                      financial activity
                      to start seeing
                      your cash flow
                      here.
                    </p>
                  </div>
                )}

              {/* Chart */}
              {(loading ||
                transactions.length >
                  0) && (
                <div className="relative h-[230px]">
                  {/* Grid */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[
                      1,
                      2,
                      3,
                      4,
                    ].map(
                      (line) => (
                        <div
                          key={line}
                          className="border-t border-dashed border-gray-100"
                        />
                      )
                    )}
                  </div>

                  {/* Loading bars */}
                  {loading ? (
                    <div className="absolute inset-x-0 bottom-6 top-2 flex items-end justify-between gap-2">
                      {Array.from({
                        length: 7,
                      }).map(
                        (
                          _,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="flex h-full flex-1 items-end justify-center gap-1"
                          >
                            <div
                              className="w-2.5 animate-pulse bg-gray-100 sm:w-3"
                              style={{
                                height: `${
                                  25 +
                                  ((index *
                                    17) %
                                    55)
                                }%`,
                              }}
                            />

                            <div
                              className="w-2.5 animate-pulse bg-gray-100 sm:w-3"
                              style={{
                                height: `${
                                  15 +
                                  ((index *
                                    13) %
                                    40)
                                }%`,
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-x-0 bottom-6 top-2 flex items-end justify-between gap-2">
                      {cashFlow.map(
                        (day) => {
                          const incomeHeight =
                            (day.income /
                              chartMax) *
                            100;

                          const expenseHeight =
                            (day.expenses /
                              chartMax) *
                            100;

                          const isHovered =
                            hoveredDay ===
                            day.key;

                          return (
                            <div
                              key={
                                day.key
                              }
                              className="relative flex h-full flex-1 items-end justify-center gap-1"
                              onMouseEnter={() =>
                                setHoveredDay(
                                  day.key
                                )
                              }
                              onMouseLeave={() =>
                                setHoveredDay(
                                  null
                                )
                              }
                            >
                              {/* Tooltip */}
                              {isHovered && (
                                <div className="absolute bottom-[calc(100%-10px)] left-1/2 z-20 w-40 -translate-x-1/2 border border-gray-200 bg-white p-3 shadow-lg">
                                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                    {
                                      day.label
                                    }
                                  </p>

                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 bg-emerald-900" />

                                        <span className="text-[10px] text-gray-500">
                                          Money
                                          in
                                        </span>
                                      </div>

                                      <span className="text-[10px] font-semibold text-gray-900">
                                        {formatCurrency(
                                          day.income
                                        )}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 bg-gray-200" />

                                        <span className="text-[10px] text-gray-500">
                                          Money
                                          out
                                        </span>
                                      </div>

                                      <span className="text-[10px] font-semibold text-gray-900">
                                        {formatCurrency(
                                          day.expenses
                                        )}
                                      </span>
                                    </div>

                                    <div className="mt-2 border-t border-gray-100 pt-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400">
                                          Net
                                        </span>

                                        <span
                                          className={`text-[10px] font-semibold ${
                                            day.income -
                                              day.expenses >=
                                            0
                                              ? 'text-emerald-900'
                                              : 'text-red-600'
                                          }`}
                                        >
                                          {day.income -
                                            day.expenses >=
                                          0
                                            ? '+'
                                            : '-'}
                                          {formatCurrency(
                                            Math.abs(
                                              day.income -
                                                day.expenses
                                            )
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div
                                className="w-2.5 bg-emerald-900 transition-opacity sm:w-3"
                                style={{
                                  height: `${Math.max(
                                    day.income >
                                      0
                                      ? 2
                                      : 0,
                                    incomeHeight
                                  )}%`,
                                  opacity:
                                    hoveredDay &&
                                    hoveredDay !==
                                      day.key
                                      ? 0.45
                                      : 1,
                                }}
                              />

                              <div
                                className="w-2.5 bg-gray-200 transition-opacity sm:w-3"
                                style={{
                                  height: `${Math.max(
                                    day.expenses >
                                      0
                                      ? 2
                                      : 0,
                                    expenseHeight
                                  )}%`,
                                  opacity:
                                    hoveredDay &&
                                    hoveredDay !==
                                      day.key
                                      ? 0.65
                                      : 1,
                                }}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Labels */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2">
                    {loading
                      ? Array.from({
                          length: 7,
                        }).map(
                          (
                            _,
                            index
                          ) => (
                            <span
                              key={
                                index
                              }
                              className="h-2 flex-1 animate-pulse bg-gray-100"
                            />
                          )
                        )
                      : cashFlow.map(
                          (day) => (
                            <span
                              key={
                                day.key
                              }
                              className={`flex-1 text-center text-[10px] ${
                                hoveredDay ===
                                day.key
                                  ? 'font-medium text-emerald-900'
                                  : 'text-gray-400'
                              }`}
                            >
                              {
                                day.label
                              }
                            </span>
                          )
                        )}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-900" />

                  <span className="text-[10px] text-gray-400">
                    Money in
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-gray-200" />

                  <span className="text-[10px] text-gray-400">
                    Money out
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Monietar Insight */}
          {/* ------------------------------------------------------------ */}

          <section className="border border-gray-200 bg-emerald-900 text-white">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Monietar Insight
                  </p>

                  <p className="mt-1 text-xs text-emerald-200">
                    Based on your recorded activity
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                  <Zap
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {loading ? (
                <>
                  <div className="h-5 w-4/5 animate-pulse bg-white/10" />

                  <div className="mt-3 h-5 w-3/5 animate-pulse bg-white/10" />

                  <div className="mt-6 space-y-2">
                    <div className="h-3 w-full animate-pulse bg-white/10" />

                    <div className="h-3 w-11/12 animate-pulse bg-white/10" />

                    <div className="h-3 w-4/5 animate-pulse bg-white/10" />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium leading-7">
                    {insightTitle}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-emerald-100">
                    {insightDescription}
                  </p>
                </>
              )}

              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200">
                    Net cash movement
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      netMovement >=
                      0
                        ? 'text-white'
                        : 'text-red-200'
                    }`}
                  >
                    {loading
                      ? '—'
                      : `${
                          netMovement >=
                          0
                            ? '+'
                            : '-'
                        }${formatCurrency(
                          Math.abs(
                            netMovement
                          )
                        )}`}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Lower Content */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          {/* Recent Transactions */}

          <section className="border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Recent Transactions
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Latest money movement recorded
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-900 hover:underline"
              >
                View all
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {loading ? (
              <div className="divide-y divide-gray-100">
                {Array.from({
                  length: 4,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-9 w-9 shrink-0 animate-pulse bg-gray-100" />

                        <div className="min-w-0">
                          <div className="h-3 w-28 animate-pulse bg-gray-100" />

                          <div className="mt-2 h-2 w-20 animate-pulse bg-gray-100" />
                        </div>
                      </div>

                      <div className="shrink-0">
                        <div className="h-3 w-20 animate-pulse bg-gray-100" />

                        <div className="mt-2 ml-auto h-2 w-14 animate-pulse bg-gray-100" />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : recentTransactionCount ===
              0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center bg-gray-50 text-gray-400">
                  <Receipt
                    size={18}
                    strokeWidth={
                      1.7
                    }
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No transactions yet
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Your latest financial
                  activity will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentTransactions.map(
                  (
                    transaction
                  ) => {
                    const amount =
                      getTransactionAmount(
                        transaction
                      );

                    const isIncome =
                      transaction.type ===
                      'income';

                    return (
                      <div
                        key={
                          transaction.id
                        }
                        className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                              isIncome
                                ? 'bg-emerald-50 text-emerald-900'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownRight
                                size={
                                  16
                                }
                                strokeWidth={
                                  1.7
                                }
                              />
                            ) : (
                              <ArrowUpRight
                                size={
                                  16
                                }
                                strokeWidth={
                                  1.7
                                }
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {transaction.description?.trim() ||
                                transaction.category ||
                                'Financial activity'}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">
                                {
                                  transaction.category
                                }
                              </span>

                              <span className="h-0.5 w-0.5 rounded-full bg-gray-300" />

                              <span className="text-[10px] text-gray-400">
                                {transaction.currency ||
                                  'NGN'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p
                            className={`text-sm font-semibold ${
                              isIncome
                                ? 'text-emerald-900'
                                : 'text-gray-900'
                            }`}
                          >
                            {isIncome
                              ? '+'
                              : '-'}
                            {formatCurrency(
                              amount
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            {formatTransactionDate(
                              transaction.date,
                              transaction.created_at
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* Business Snapshot */}

          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <p className="text-sm font-semibold text-gray-900">
                Business Snapshot
              </p>

              <p className="mt-1 text-xs text-gray-400">
                A quick look at your operations
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              <SnapshotRow
                icon={Receipt}
                label="Transactions"
                value={
                  loading
                    ? 'Loading...'
                    : `${transactionCount} recorded`
                }
                detail={
                  loading
                    ? '—'
                    : selectedPeriod ===
                      'all-time'
                    ? 'All time'
                    : 'Current period'
                }
              />

              <SnapshotRow
                icon={Package}
                label="Products"
                value="—"
                detail="Not connected yet"
              />

              <SnapshotRow
                icon={Wallet}
                label="Cash Vault"
                value="—"
                detail="Not connected yet"
              />
            </div>

            <div className="border-t border-gray-200 p-4">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Plus
                  size={14}
                  strokeWidth={1.8}
                />

                Record activity
              </button>
            </div>
          </section>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Plan Usage */}
        {/* -------------------------------------------------------------- */}

        {CURRENT_PLAN !==
          'BORDERLESS_PRO' && (
          <section className="mt-6 border border-gray-200 bg-white">
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-900">
                  <Zap
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Your automatic transaction
                    allowance
                  </p>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-gray-400">
                    Monietar automatically records
                    transactions from your connected
                    bank account. Your current plan
                    includes{' '}
                    {plan.transactionLimit.toLocaleString()}
                    {' '}
                    automatic logs each month.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-5">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {automaticTransactions ===
                    null
                      ? '—'
                      : automaticTransactions}

                    <span className="text-sm font-normal text-gray-400">
                      {' '}
                      /{' '}
                      {
                        plan.transactionLimit
                      }
                    </span>
                  </p>

                  <p className="text-[10px] text-gray-400">
                    automatic usage
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 bg-emerald-900 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-emerald-800"
                >
                  Explore plans

                  <ArrowRight
                    size={13}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Metric Card
|--------------------------------------------------------------------------
*/

function MetricCard({
  label,
  value,
  change,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: number | null;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-emerald-900">
          <Icon
            size={17}
            strokeWidth={1.7}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          {description}
        </p>

        {change !== null ? (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium ${
              change >= 0
                ? 'text-emerald-800'
                : 'text-red-600'
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight
                size={12}
                strokeWidth={1.8}
              />
            ) : (
              <ArrowDownRight
                size={12}
                strokeWidth={1.8}
              />
            )}

            {formatPercentage(
              change
            )}
          </span>
        ) : (
          <span className="text-[10px] text-gray-400">
            —
          </span>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Snapshot Row
|--------------------------------------------------------------------------
*/

function SnapshotRow({
  icon: Icon,
  label,
  value,
  detail,
  warning = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-50 text-gray-500">
          <Icon
            size={16}
            strokeWidth={1.7}
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-medium text-gray-900">
            {value}
          </p>
        </div>
      </div>

      <div
        className={`flex shrink-0 items-center gap-1 text-[10px] ${
          warning
            ? 'text-amber-600'
            : 'text-gray-400'
        }`}
      >
        {warning && (
          <CircleAlert
            size={12}
            strokeWidth={1.7}
          />
        )}

        {detail}
      </div>
    </div>
  );
}