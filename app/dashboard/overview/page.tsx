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
| Constants
|--------------------------------------------------------------------------
*/

const BUSINESS_TIME_ZONE = 'Africa/Lagos';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

/*
|--------------------------------------------------------------------------
| Plan
|--------------------------------------------------------------------------
*/

type Plan =
  | 'retail-starter'
  | 'growing-merchant'
  | 'borderless-pro';

const PLAN_CONFIG: Record<
  Plan,
  {
    name: string;
    transactionLimit: number;
    connectedBankLimit: number;
    cashVaultLimit: number;
    description: string;
  }
> = {
  'retail-starter': {
    name: 'Retail Starter',
    transactionLimit: 30,
    connectedBankLimit: 1,
    cashVaultLimit: 1,
    description:
      'The essential Monietar experience for everyday merchants who want to move beyond notebooks and start understanding their money.',
  },

  'growing-merchant': {
    name: 'Growing Merchant',
    transactionLimit: 2500,
    connectedBankLimit: 3,
    cashVaultLimit: Infinity,
    description:
      'For established merchants who need more automation, more connected accounts, and a clearer view of a growing business.',
  },

  'borderless-pro': {
    name: 'Borderless Pro',
    transactionLimit: Infinity,
    connectedBankLimit: Infinity,
    cashVaultLimit: Infinity,
    description:
      'For merchants operating across regions who need deeper financial visibility, multi-currency tracking, and intelligent reporting.',
  },
};

function normalizePlan(value: unknown): Plan {
  if (typeof value !== 'string') {
    return 'retail-starter';
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');

  switch (normalized) {
    case 'growing-merchant':
      return 'growing-merchant';

    case 'borderless-pro':
      return 'borderless-pro';

    case 'retail-starter':
    default:
      return 'retail-starter';
  }
}

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
  | 'this-year';

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
  source: string | null;
};

type Account = {
  id: string;
  business_id: string;
  name: string;
  account_type: string;
  currency: string | null;
  opening_balance: number | string | null;
  current_balance: number | string | null;
  institution: string | null;
  account_number: string | null;
  is_default: boolean | null;
  is_active: boolean | null;
  user_id: string;
};

type BankConnection = {
  id: string;
  business_id: string;
  mono_account_id: string | null;
  mono_display_id: string | null;
  institution: string | null;
  account_name: string | null;
  account_number: string | null;
  balance: number | string | null;
  status: string | null;
  last_sync: string | null;
};

type CashVault = {
  id: string;
  business_id: string;
  name: string;
  currency: string | null;
  balance: number | string | null;
};

type Product = {
  id: string;
  business_id: string;
  name: string;
  current_stock: number | null;
  available_stock: number | null;
  is_active: boolean | null;
};

type Sale = {
  id: string;
  business_id: string;
  total_amount: number | string;
  currency: string | null;
  status: string | null;
  sale_date: string;
};

type Business = {
  id: string;
  owner_id: string;
  name: string;
  currency: string | null;
  is_active: boolean | null;
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
| Date Helpers
|--------------------------------------------------------------------------
|
| Important:
| Transactions.date is a DATE column, not a timestamp.
| We therefore avoid toISOString() for date filtering because it can
| shift the calendar date depending on timezone.
|--------------------------------------------------------------------------
*/

function getLagosDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-NG', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(
      parts.find((part) => part.type === 'year')?.value ?? 0
    ),
    month: Number(
      parts.find((part) => part.type === 'month')?.value ?? 0
    ),
    day: Number(
      parts.find((part) => part.type === 'day')?.value ?? 0
    ),
  };
}

function getLagosHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-NG', {
    timeZone: BUSINESS_TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(date);

  return Number(
    parts.find((part) => part.type === 'hour')?.value ?? 0
  );
}

function getLagosDateString(date = new Date()) {
  const { year, month, day } = getLagosDateParts(date);

  return `${year}-${String(month).padStart(
    2,
    '0'
  )}-${String(day).padStart(2, '0')}`;
}

function parseDateOnly(value: string) {
  const [year, month, day] = value
    .split('-')
    .map(Number);

  return new Date(
    year,
    (month || 1) - 1,
    day || 1,
    0,
    0,
    0,
    0
  );
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${String(month).padStart(
    2,
    '0'
  )}-${String(day).padStart(2, '0')}`;
}

function addDays(
  date: Date,
  amount: number
) {
  const result = new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
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

  const difference =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() - difference
  );

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

function getLagosCalendarDate() {
  const { year, month, day } =
    getLagosDateParts();

  return new Date(
    year,
    month - 1,
    day,
    0,
    0,
    0,
    0
  );
}

function getPeriodRange(
  period: PeriodKey,
  now = getLagosCalendarDate()
): PeriodRange {
  const today = getLagosCalendarDate();

  /*
  |--------------------------------------------------------------------------
  | Today
  |--------------------------------------------------------------------------
  */

  if (period === 'today') {
    const start = startOfDay(today);
    const end = endOfDay(today);

    const previousStart = addDays(
      start,
      -1
    );

    const previousEnd = endOfDay(
      previousStart
    );

    return {
      start,
      end,
      previousStart,
      previousEnd,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | This Week
  |--------------------------------------------------------------------------
  |
  | Monday -> today.
  |
  */

  if (period === 'this-week') {
    const start = startOfWeek(now);
    const end = endOfDay(today);

    const previousStart = addDays(
      start,
      -7
    );

    const previousEnd = endOfDay(
      addDays(today, -7)
    );

    return {
      start,
      end,
      previousStart,
      previousEnd,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | This Month
  |--------------------------------------------------------------------------
  |
  | First day of current month -> today.
  |
  */

  if (period === 'this-month') {
    const start = startOfMonth(now);
    const end = endOfDay(today);

    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    return {
      start,
      end,
      previousStart:
        startOfMonth(previousMonth),
      previousEnd:
        endOfMonth(previousMonth),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Last Month
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | This Year
  |--------------------------------------------------------------------------
  |
  | January 1 -> today.
  |
  */

  const start = startOfYear(now);
  const end = endOfDay(today);

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

function dateToISO(date: Date) {
  /*
   * Never use date.toISOString() here.
   * This is a calendar date for a DATE column.
   */
  return formatDateOnly(date);
}

/*
|--------------------------------------------------------------------------
| General Helpers
|--------------------------------------------------------------------------
*/

function formatCurrency(
  amount: number,
  currency = '₦'
) {
  return `${currency}${Math.round(
    amount
  ).toLocaleString('en-NG')}`;
}

function formatPercentage(
  value: number | null
) {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return '—';
  }

  return `${
    value > 0 ? '+' : ''
  }${value.toFixed(1)}%`;
}

function toNumber(
  value:
    | number
    | string
    | null
    | undefined
) {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function calculateChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return 100;
  }

  return (
    ((current - previous) / previous) *
    100
  );
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
        getTransactionAmount(
          transaction
        ),
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
        getTransactionAmount(
          transaction
        ),
      0
    );
}

function getUserDisplayName(
  metadata: Record<
    string,
    unknown
  > | null,
  email: string | undefined
) {
  if (metadata) {
    const displayNameCandidates = [
      metadata.display_name,
      metadata.full_name,
      metadata.name,
    ];

    for (const candidate of displayNameCandidates) {
      if (
        typeof candidate === 'string' &&
        candidate.trim()
      ) {
        return candidate.trim();
      }
    }

    const firstName =
      typeof metadata.first_name ===
      'string'
        ? metadata.first_name.trim()
        : '';

    const lastName =
      typeof metadata.last_name ===
      'string'
        ? metadata.last_name.trim()
        : '';

    const combinedName = [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(' ');

    if (combinedName) {
      return combinedName;
    }
  }

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
    : parseDateOnly(date);

  if (
    Number.isNaN(
      dateValue.getTime()
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    'en-NG',
    {
      timeZone: BUSINESS_TIME_ZONE,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  ).format(dateValue);
}

/*
|--------------------------------------------------------------------------
| Cash Flow Chart
|--------------------------------------------------------------------------
*/

function getChartRange(
  period: PeriodKey,
  now = getLagosCalendarDate()
) {
  const selectedRange =
    getPeriodRange(period, now);

  return {
    start: selectedRange.start,
    end: selectedRange.end,
  };
}

function getTodayChartDays(
  transactions: Transaction[],
  now = new Date()
): CashFlowDay[] {
  const todayString =
    getLagosDateString(now);

  /*
  |--------------------------------------------------------------------------
  | Six 4-hour blocks
  |--------------------------------------------------------------------------
  |
  | 12 AM
  | 4 AM
  | 8 AM
  | 12 PM
  | 4 PM
  | 8 PM
  |
  */

  const buckets = [
    {
      start: 0,
      end: 3,
      label: '12 AM',
    },
    {
      start: 4,
      end: 7,
      label: '4 AM',
    },
    {
      start: 8,
      end: 11,
      label: '8 AM',
    },
    {
      start: 12,
      end: 15,
      label: '12 PM',
    },
    {
      start: 16,
      end: 19,
      label: '4 PM',
    },
    {
      start: 20,
      end: 23,
      label: '8 PM',
    },
  ];

  return buckets.map(
    (bucket, index) => {
      const bucketTransactions =
        transactions.filter(
          (transaction) => {
            if (
              transaction.date !==
                todayString ||
              !transaction.created_at
            ) {
              return false;
            }

            const hour =
              getLagosHour(
                new Date(
                  transaction.created_at
                )
              );

            return (
              hour >= bucket.start &&
              hour <= bucket.end
            );
          }
        );

      return {
        key: `today-${index}`,
        label: bucket.label,
        income: getIncome(
          bucketTransactions
        ),
        expenses: getExpenses(
          bucketTransactions
        ),
      };
    }
  );
}

function getChartDays(
  period: PeriodKey,
  transactions: Transaction[],
  now = new Date()
): CashFlowDay[] {
  /*
  |--------------------------------------------------------------------------
  | Today
  |--------------------------------------------------------------------------
  */

  if (period === 'today') {
    return getTodayChartDays(
      transactions,
      now
    );
  }

  const {
    start,
    end,
  } = getChartRange(
    period,
    getLagosCalendarDate()
  );

  /*
  |--------------------------------------------------------------------------
  | This Year
  |--------------------------------------------------------------------------
  |
  | January -> current month.
  |
  */

  if (period === 'this-year') {
    const startYear =
      start.getFullYear();

    const currentMonth =
      getLagosDateParts(now).month - 1;

    const days: CashFlowDay[] = [];

    for (
      let month = 0;
      month <= currentMonth;
      month++
    ) {
      const bucketStart =
        new Date(
          startYear,
          month,
          1
        );

      const bucketEnd =
        month === currentMonth
          ? end
          : endOfMonth(
              bucketStart
            );

      const bucketTransactions =
        transactions.filter(
          (transaction) => {
            const transactionDate =
              parseDateOnly(
                transaction.date
              );

            return (
              transactionDate >=
                bucketStart &&
              transactionDate <=
                bucketEnd
            );
          }
        );

      days.push({
        key: `year-${startYear}-${month}`,
        label:
          bucketStart.toLocaleDateString(
            'en-NG',
            {
              month: 'short',
            }
          ),
        income:
          getIncome(
            bucketTransactions
          ),
        expenses:
          getExpenses(
            bucketTransactions
          ),
      });
    }

    return days;
  }

  /*
  |--------------------------------------------------------------------------
  | Daily periods
  |--------------------------------------------------------------------------
  |
  | This week / this month / last month use actual calendar days.
  |--------------------------------------------------------------------------
  */

  const startDate =
    startOfDay(start);

  const endDate =
    startOfDay(end);

  const totalDays =
    Math.floor(
      (endDate.getTime() -
        startDate.getTime()) /
        DAY_IN_MS
    ) + 1;

  const days: CashFlowDay[] = [];

  for (
    let index = 0;
    index < totalDays;
    index++
  ) {
    const bucketStart =
      addDays(
        startDate,
        index
      );

    const dateString =
      formatDateOnly(
        bucketStart
      );

    const bucketTransactions =
      transactions.filter(
        (transaction) =>
          transaction.date ===
          dateString
      );

    let label = '';

    if (
      period === 'this-week'
    ) {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            weekday: 'short',
          }
        );
    } else {
      label =
        bucketStart.toLocaleDateString(
          'en-NG',
          {
            day: 'numeric',
          }
        );
    }

    days.push({
      key: `${dateString}-${index}`,
      label,
      income:
        getIncome(
          bucketTransactions
        ),
      expenses:
        getExpenses(
          bucketTransactions
        ),
    });
  }

  return days;
}

/*
|--------------------------------------------------------------------------
| Greeting
|--------------------------------------------------------------------------
*/

function getGreeting() {
  const hour =
    getLagosHour();

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

  const [currentPlan, setCurrentPlan] =
    useState<Plan>(
      'retail-starter'
    );

  const [
    selectedPeriod,
    setSelectedPeriod,
  ] = useState<PeriodKey>(
    'this-month'
  );

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [hoveredDay, setHoveredDay] =
    useState<string | null>(null);

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [
    previousTransactions,
    setPreviousTransactions,
  ] = useState<Transaction[]>([]);

  const [
    recentTransactions,
    setRecentTransactions,
  ] = useState<Transaction[]>([]);

  const [business, setBusiness] =
    useState<Business | null>(
      null
    );

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [
    bankConnections,
    setBankConnections,
  ] = useState<BankConnection[]>(
    []
  );

  const [
    cashVaults,
    setCashVaults,
  ] = useState<CashVault[]>(
    []
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [
    automaticTransactionCount,
    setAutomaticTransactionCount,
  ] = useState(0);

  const [userName, setUserName] =
    useState('there');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const plan =
    PLAN_CONFIG[currentPlan];

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

        /*
        |--------------------------------------------------------------------------
        | User / Plan
        |--------------------------------------------------------------------------
        */

        const metadata =
          user.user_metadata || {};

        const userPlan =
          normalizePlan(
            metadata.subscription_plan ??
              metadata.plan
          );

        const displayName =
          getUserDisplayName(
            metadata as Record<
              string,
              unknown
            >,
            user.email
          );

        if (mounted) {
          setCurrentPlan(userPlan);
          setUserName(displayName);
        }

        /*
        |--------------------------------------------------------------------------
        | Current Period
        |--------------------------------------------------------------------------
        */

        const {
          start,
          end,
          previousStart,
          previousEnd,
        } = getPeriodRange(
          selectedPeriod
        );

        const currentMonthStart =
          startOfMonth(
            getLagosCalendarDate()
          );

        const currentMonthEnd =
          endOfDay(
            getLagosCalendarDate()
          );

        /*
        |--------------------------------------------------------------------------
        | Business
        |--------------------------------------------------------------------------
        */

        const {
          data: businesses,
          error: businessError,
        } = await supabase
          .from('businesses')
          .select(
            `
              id,
              owner_id,
              name,
              currency,
              is_active
            `
          )
          .eq(
            'owner_id',
            user.id
          )
          .eq(
            'is_active',
            true
          )
          .order('created_at', {
            ascending: true,
          });

        if (businessError) {
          throw businessError;
        }

        const activeBusiness =
          (businesses?.[0] ??
            null) as Business | null;

        if (mounted) {
          setBusiness(
            activeBusiness
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Transaction Select
        |--------------------------------------------------------------------------
        */

        const transactionSelect = `
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
          is_deleted,
          source
        `;

        /*
        |--------------------------------------------------------------------------
        | Current Transactions
        |--------------------------------------------------------------------------
        */

        let currentQuery =
          supabase
            .from('transactions')
            .select(
              transactionSelect
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
            );

        /*
        |--------------------------------------------------------------------------
        | Business Scope
        |--------------------------------------------------------------------------
        */

        if (activeBusiness) {
          currentQuery =
            currentQuery.eq(
              'business_id',
              activeBusiness.id
            );
        }

        currentQuery =
          currentQuery
            .order('date', {
              ascending: false,
            })
            .order('created_at', {
              ascending: false,
            });

        /*
        |--------------------------------------------------------------------------
        | Previous Transactions
        |--------------------------------------------------------------------------
        */

        let previousQuery =
          supabase
            .from('transactions')
            .select(
              transactionSelect
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
              );

          if (activeBusiness) {
            previousQuery =
              previousQuery.eq(
                'business_id',
                activeBusiness.id
              );
          }

          previousQuery =
            previousQuery
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
          previousQuery =
            previousQuery.eq(
              'id',
              '00000000-0000-0000-0000-000000000000'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Recent Transactions
        |--------------------------------------------------------------------------
        */

        let recentQuery =
          supabase
            .from('transactions')
            .select(
              transactionSelect
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

        if (activeBusiness) {
          recentQuery =
            recentQuery.eq(
              'business_id',
              activeBusiness.id
            );
        }

        recentQuery =
          recentQuery
            .order('date', {
              ascending: false,
            })
            .order(
              'created_at',
              {
                ascending: false,
              }
            )
            .limit(4);

        /*
        |--------------------------------------------------------------------------
        | Automatic Transactions — Current Month
        |--------------------------------------------------------------------------
        |
        | This count is intentionally independent of the selected
        | dashboard period because the plan limit is monthly.
        |
        */

        let automaticQuery =
          supabase
            .from('transactions')
            .select(
              `
                id,
                source
              `,
              {
                count: 'exact',
                head: true,
              }
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
            .neq(
              'source',
              'manual'
            )
            .gte(
              'date',
              dateToISO(
                currentMonthStart
              )
            )
            .lte(
              'date',
              dateToISO(
                currentMonthEnd
              )
            );

        if (activeBusiness) {
          automaticQuery =
            automaticQuery.eq(
              'business_id',
              activeBusiness.id
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Business Data
        |--------------------------------------------------------------------------
        */

        let accountsResult:
          | {
              data: Account[] | null;
              error: Error | null;
            }
          | null = null;

        let bankConnectionsResult:
          | {
              data:
                | BankConnection[]
                | null;
              error: Error | null;
            }
          | null = null;

        let cashVaultsResult:
          | {
              data:
                | CashVault[]
                | null;
              error: Error | null;
            }
          | null = null;

        let productsResult:
          | {
              data:
                | Product[]
                | null;
              error: Error | null;
            }
          | null = null;

        let salesResult:
          | {
              data: Sale[] | null;
              error: Error | null;
            }
          | null = null;

        if (activeBusiness) {
          const businessId =
            activeBusiness.id;

          const [
            accountsResponse,
            bankConnectionsResponse,
            cashVaultsResponse,
            productsResponse,
            salesResponse,
          ] = await Promise.all([
            supabase
              .from('accounts')
              .select(
                `
                  id,
                  business_id,
                  name,
                  account_type,
                  currency,
                  opening_balance,
                  current_balance,
                  institution,
                  account_number,
                  is_default,
                  is_active,
                  user_id
                `
              )
              .eq(
                'business_id',
                businessId
              )
              .eq(
                'is_active',
                true
              ),

            supabase
              .from(
                'bank_connections'
              )
              .select(
                `
                  id,
                  business_id,
                  mono_account_id,
                  mono_display_id,
                  institution,
                  account_name,
                  account_number,
                  balance,
                  status,
                  last_sync
                `
              )
              .eq(
                'business_id',
                businessId
              ),

            supabase
              .from('cash_vaults')
              .select(
                `
                  id,
                  business_id,
                  name,
                  currency,
                  balance
                `
              )
              .eq(
                'business_id',
                businessId
              ),

            supabase
              .from('products')
              .select(
                `
                  id,
                  business_id,
                  name,
                  current_stock,
                  available_stock,
                  is_active
                `
              )
              .eq(
                'business_id',
                businessId
              )
              .eq(
                'is_active',
                true
              ),

            supabase
              .from('sales')
              .select(
                `
                  id,
                  business_id,
                  total_amount,
                  currency,
                  status,
                  sale_date
                `
              )
              .eq(
                'business_id',
                businessId
              )
              .eq(
                'status',
                'completed'
              )
              .gte(
                'sale_date',
                dateToISO(start)
              )
              .lte(
                'sale_date',
                dateToISO(end)
              ),
          ]);

          accountsResult =
            accountsResponse;

          bankConnectionsResult =
            bankConnectionsResponse;

          cashVaultsResult =
            cashVaultsResponse;

          productsResult =
            productsResponse;

          salesResult =
            salesResponse;
        }

        /*
        |--------------------------------------------------------------------------
        | Run Requests
        |--------------------------------------------------------------------------
        */

        const [
          currentResult,
          previousResult,
          recentResult,
          automaticResult,
        ] = await Promise.all([
          currentQuery,
          previousQuery,
          recentQuery,
          automaticQuery,
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

        if (automaticResult.error) {
          throw automaticResult.error;
        }

        if (
          accountsResult?.error
        ) {
          throw accountsResult.error;
        }

        if (
          bankConnectionsResult?.error
        ) {
          throw bankConnectionsResult.error;
        }

        if (
          cashVaultsResult?.error
        ) {
          throw cashVaultsResult.error;
        }

        if (
          productsResult?.error
        ) {
          throw productsResult.error;
        }

        if (
          salesResult?.error
        ) {
          throw salesResult.error;
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

        setAutomaticTransactionCount(
          automaticResult.count ?? 0
        );

        setAccounts(
          accountsResult?.data ??
            []
        );

        setBankConnections(
          bankConnectionsResult?.data ??
            []
        );

        setCashVaults(
          cashVaultsResult?.data ??
            []
        );

        setProducts(
          productsResult?.data ??
            []
        );

        setSales(
          salesResult?.data ??
            []
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
            : 'We could not load your business overview.'
        );

        setTransactions([]);
        setPreviousTransactions([]);
        setRecentTransactions([]);
        setBusiness(null);
        setAccounts([]);
        setBankConnections([]);
        setCashVaults([]);
        setProducts([]);
        setSales([]);
        setAutomaticTransactionCount(
          0
        );
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
  | Money Calculations
  |--------------------------------------------------------------------------
  */

  const moneyIn = useMemo(
    () => getIncome(transactions),
    [transactions]
  );

  const moneyOut = useMemo(
    () =>
      getExpenses(
        transactions
      ),
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
    calculateChange(
      revenue,
      previousMoneyIn
    );

  const profitChange =
    calculateChange(
      profit,
      previousNetMovement
    );

  /*
  |--------------------------------------------------------------------------
  | Money You Have
  |--------------------------------------------------------------------------
  */

  const accountBalance =
    useMemo(
      () =>
        accounts.reduce(
          (
            total,
            account
          ) =>
            total +
            toNumber(
              account.current_balance
            ),
          0
        ),
      [accounts]
    );

  const cashVaultBalance =
    useMemo(
      () => {
        const usableVaults =
          plan.cashVaultLimit ===
          Infinity
            ? cashVaults
            : cashVaults.slice(
                0,
                plan.cashVaultLimit
              );

        return usableVaults.reduce(
          (
            total,
            vault
          ) =>
            total +
            toNumber(
              vault.balance
            ),
          0
        );
      },
      [
        cashVaults,
        plan.cashVaultLimit,
      ]
    );

  const visibleCashVaultCount =
    plan.cashVaultLimit === Infinity
      ? cashVaults.length
      : Math.min(
          cashVaults.length,
          plan.cashVaultLimit
        );

  const cashPosition =
    accounts.length > 0
      ? accountBalance +
        cashVaultBalance
      : cashVaults.length > 0
      ? cashVaultBalance
      : bankConnections.length >
        0
      ? bankConnections.reduce(
          (
            total,
            connection
          ) =>
            total +
            toNumber(
              connection.balance
            ),
          0
        )
      : 0;

  const hasCashPositionData =
    accounts.length > 0 ||
    cashVaults.length > 0 ||
    bankConnections.length > 0;

  const displayCurrency =
    business?.currency === 'NGN'
      ? '₦'
      : business?.currency || '₦';

  /*
  |--------------------------------------------------------------------------
  | Bank Activity
  |--------------------------------------------------------------------------
  */

  const connectedBankCount =
    bankConnections.filter(
      (connection) =>
        !connection.status ||
        connection.status
          .toLowerCase() ===
          'connected'
    ).length;

  const automaticTransactions =
    automaticTransactionCount;

  const transactionUsage =
    plan.transactionLimit === Infinity
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
    plan.transactionLimit === Infinity
      ? null
      : Math.max(
          0,
          plan.transactionLimit -
            automaticTransactions
        );

  /*
  |--------------------------------------------------------------------------
  | Business Snapshot
  |--------------------------------------------------------------------------
  */

  const salesCount =
    sales.length;

  const lowStockCount =
    products.filter(
      (product) => {
        const available =
          product.available_stock ??
          product.current_stock ??
          0;

        return available <= 0;
      }
    ).length;

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
    ...cashFlow.flatMap(
      (item) => [
        item.income,
        item.expenses,
      ]
    )
  );

  /*
  |--------------------------------------------------------------------------
  | Transaction Counts
  |--------------------------------------------------------------------------
  */

  const transactionCount =
    transactions.length;

  const recentTransactionCount =
    recentTransactions.length;

  /*
  |--------------------------------------------------------------------------
  | Insight
  |--------------------------------------------------------------------------
  */

  let insightTitle =
    'Start recording your business activity to see useful money insights.';

  let insightDescription =
    'As you record sales, expenses and other money movements, Monietar will help you understand what is happening with your money.';

  if (!loading) {
    if (
      transactions.length > 0
    ) {
      if (netMovement > 0) {
        insightTitle =
          'More money came in than went out this period.';

        insightDescription =
          'You received more money than you spent during this period. Keep an eye on your spending as the period continues.';
      } else if (
        netMovement < 0
      ) {
        insightTitle =
          'More money went out than came in this period.';

        insightDescription =
          'Take a look at your recent spending to see what is taking the most money out of your business.';
      } else {
        insightTitle =
          'The money coming in and going out is about the same.';

        insightDescription =
          'Keep recording your business activity so Monietar can give you a clearer picture of your money.';
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-full bg-[#f1f1f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">

        {/* -------------------------------------------------------------- */}
        {/* Page Introduction */}
        {/* -------------------------------------------------------------- */}

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Your business
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                {getGreeting()}, {userName}.
              </h2>

              <span className="border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-emerald-900">
                {plan.name}
              </span>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              {business?.name
                ? `Here is what is happening with ${business.name}.`
                : 'Here is what is happening with your business.'}
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
                  business information.
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
            label="Money In"
            value={
              loading
                ? '—'
                : formatCurrency(
                    revenue,
                    displayCurrency
                  )
            }
            change={revenueChange}
            description="Money received during this period"
            icon={ArrowDownRight}
          />

          <MetricCard
            label="What You Made"
            value={
              loading
                ? '—'
                : formatCurrency(
                    profit,
                    displayCurrency
                  )
            }
            change={profitChange}
            description="Money in after recorded spending"
            icon={BarChart3}
          />

          <MetricCard
            label="Money You Have"
            value={
              loading
                ? '—'
                : hasCashPositionData
                ? formatCurrency(
                    cashPosition,
                    displayCurrency
                  )
                : '—'
            }
            change={null}
            description={
              hasCashPositionData
                ? 'Money in your bank and cash'
                : 'Connect a bank or add cash'
            }
            icon={Wallet}
          />

          {/* Auto-logged Transactions */}

          <div className="bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                  Auto-logged Transactions
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
                  {loading
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

            <p className="text-xs leading-5 text-gray-400">
              {currentPlan ===
              'retail-starter'
                ? 'Your first 30 bank transactions each month are logged automatically. Manual bookkeeping entries and bank statement imports are unlimited.'
                : currentPlan ===
                  'growing-merchant'
                ? 'Up to 2,500 bank transactions can be logged automatically each month.'
                : 'Bank transactions can be logged automatically without a monthly limit.'}
            </p>

            <div className="mt-3 text-[10px] text-gray-400">
              {connectedBankCount}{' '}
              connected bank{' '}
              {connectedBankCount === 1
                ? 'account'
                : 'accounts'}

              {plan.connectedBankLimit !==
                Infinity && (
                <>
                  {' '}
                  /{' '}
                  {plan.connectedBankLimit}{' '}
                  allowed
                </>
              )}
            </div>

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
                    left this month
                  </span>

                  <span>
                    {transactionUsage}%{' '}
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
          {/* Money Flow */}
          {/* ------------------------------------------------------------ */}

          <section className="border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Money In &amp; Out
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  See how much money came in and went out
                </p>
              </div>

              <Link
                href="/dashboard/reports"
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-900 hover:underline"
              >
                View report
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                />
              </Link>
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
                          moneyIn,
                          displayCurrency
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
                          moneyOut,
                          displayCurrency
                        )}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Difference
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
                          netMovement,
                          displayCurrency
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
                      No money records for this period
                    </p>

                    <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                      Add your first sale,
                      expense or other money
                      activity to start seeing
                      your business here.
                    </p>

                    <Link
                      href="/dashboard/transactions"
                      className="mt-4 inline-flex items-center gap-2 bg-emerald-900 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-emerald-800"
                    >
                      <Plus
                        size={13}
                        strokeWidth={1.8}
                      />
                      Add money record
                    </Link>
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
                    <div
                      className={`absolute inset-x-0 bottom-6 top-2 flex items-end justify-between ${
                        cashFlow.length >
                        20
                          ? 'gap-0'
                          : 'gap-2'
                      }`}
                    >
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
                              className="relative flex h-full min-w-0 flex-1 items-end justify-center gap-px"
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
                                          day.income,
                                          displayCurrency
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
                                          day.expenses,
                                          displayCurrency
                                        )}
                                      </span>
                                    </div>

                                    <div className="mt-2 border-t border-gray-100 pt-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400">
                                          Difference
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
                                            ),
                                            displayCurrency
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div
                                className={`bg-emerald-900 transition-opacity ${
                                  cashFlow.length >
                                  20
                                    ? 'w-1'
                                    : 'w-2.5 sm:w-3'
                                }`}
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
                                className={`bg-gray-200 transition-opacity ${
                                  cashFlow.length >
                                  20
                                    ? 'w-1'
                                    : 'w-2.5 sm:w-3'
                                }`}
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

                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-0">
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
                          (
                            day,
                            index
                          ) => {
                            const shouldShowLabel =
                              cashFlow.length <=
                                16 ||
                              index ===
                                0 ||
                              index ===
                                cashFlow.length -
                                  1 ||
                              index %
                                5 ===
                                0;

                            return (
                              <span
                                key={
                                  day.key
                                }
                                className={`min-w-0 flex-1 text-center text-[9px] ${
                                  shouldShowLabel
                                    ? hoveredDay ===
                                      day.key
                                      ? 'font-medium text-emerald-900'
                                      : 'text-gray-400'
                                    : 'text-transparent'
                                }`}
                              >
                                {
                                  day.label
                                }
                              </span>
                            );
                          }
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
                    A simple look at your money
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
                    Money left after spending
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
                          ),
                          displayCurrency
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
                  Recent Money Activity
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Your latest money records
                </p>
              </div>

              <Link
                href="/dashboard/transactions"
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-900 hover:underline"
              >
                View all
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                />
              </Link>
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
                  No money activity yet
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Your latest sales,
                  expenses and other money
                  activity will appear here.
                </p>

                <Link
                  href="/dashboard/transactions"
                  className="mt-4 inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Plus
                    size={13}
                    strokeWidth={
                      1.8
                    }
                  />
                  Add money activity
                </Link>
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
                                'Money activity'}
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
                              amount,
                              displayCurrency
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
                Business at a Glance
              </p>

              <p className="mt-1 text-xs text-gray-400">
                A quick look at your business
              </p>
            </div>

            <div className="divide-y divide-gray-100">

              <SnapshotRow
                icon={Receipt}
                label="Money Records"
                value={
                  loading
                    ? 'Loading...'
                    : `${transactionCount} recorded`
                }
                detail="This period"
              />

              <SnapshotRow
                icon={Receipt}
                label="Sales"
                value={
                  loading
                    ? 'Loading...'
                    : `${salesCount} recorded`
                }
                detail={
                  salesCount > 0
                    ? 'This period'
                    : 'No sales yet'
                }
                href="/dashboard/sales"
              />

              <SnapshotRow
                icon={Package}
                label="Products"
                value={
                  loading
                    ? 'Loading...'
                    : `${products.length} active`
                }
                detail={
                  lowStockCount > 0
                    ? `${lowStockCount} need restocking`
                    : 'View products'
                }
                href="/dashboard/products"
                warning={
                  lowStockCount > 0
                }
              />

              <SnapshotRow
                icon={Wallet}
                label="Cash Vault"
                value={
                  loading
                    ? 'Loading...'
                    : `${visibleCashVaultCount} ${
                        visibleCashVaultCount ===
                        1
                          ? 'vault'
                          : 'vaults'
                      }`
                }
                detail={
                  visibleCashVaultCount >
                  0
                    ? formatCurrency(
                        cashVaultBalance,
                        displayCurrency
                      )
                    : 'Add cash vault'
                }
                href="/dashboard/cash-vault"
              />
            </div>

            <div className="border-t border-gray-200 p-4">
              <Link
                href="/dashboard/transactions"
                className="flex w-full items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Plus
                  size={14}
                  strokeWidth={1.8}
                />

                Add money record
              </Link>
            </div>
          </section>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Retail Starter Plan */}
        {/* -------------------------------------------------------------- */}

        {currentPlan ===
          'retail-starter' && (
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
                    Retail Starter
                  </p>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-400">
                    Your free Monietar plan gives you
                    the essentials: one connected bank
                    account, 30 automatically logged bank
                    transactions each month, unlimited
                    manual bookkeeping and bank statement
                    imports, one physical Cash Vault, and
                    basic product and sales tracking.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-5">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {loading
                      ? '—'
                      : automaticTransactions}

                    <span className="text-sm font-normal text-gray-400">
                      {' '}
                      / 30
                    </span>
                  </p>

                  <p className="text-[10px] text-gray-400">
                    auto-logged transactions this month
                  </p>
                </div>
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
  href,
  warning = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  href?: string;
  warning?: boolean;
}) {
  const content = (
    <div className="flex items-center justify-between gap-4 px-5 py-4 transition-colors sm:px-6">
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
            : href
            ? 'text-emerald-900'
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

        {href && (
          <ArrowRight
            size={11}
            strokeWidth={1.8}
          />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block hover:bg-gray-50"
      >
        {content}
      </Link>
    );
  }

  return content;
}
