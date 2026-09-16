'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  Search,
  SlidersHorizontal,
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  Zap,
  X,
  Lock,
  Plus,
  Loader2,
  BarChart3,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type TransactionType = 'income' | 'expense';

type Plan =
  | 'retail-starter'
  | 'growing-merchant'
  | 'borderless-pro';

type PeriodKey =
  | 'today'
  | 'this-week'
  | 'this-month'
  | 'last-month'
  | 'this-year';

type TransactionRow = {
  id: string;
  user_id: string;
  type: string;
  amount: number | string;
  amount_base: number | string | null;
  currency: string | null;
  category: string;
  description: string | null;
  date: string;
  created_at: string | null;
  status: string | null;
  is_deleted: boolean | null;
  account_id: string | null;
  reference: string | null;
  notes: string | null;
};

type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  createdAt: string | null;
  accountId: string | null;
  accountLabel: string;
  reference: string;
  currency: string;
};

type AccountOption = {
  id: string;
  name: string;
  currency: string;
};

type ChartPoint = {
  key: string;
  label: string;
  moneyIn: number;
  moneyOut: number;
};

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const BUSINESS_TIME_ZONE = 'Africa/Lagos';

const periods: {
  key: PeriodKey;
  label: string;
}[] = [
  {
    key: 'today',
    label: 'Today',
  },
  {
    key: 'this-week',
    label: 'This week',
  },
  {
    key: 'this-month',
    label: 'This month',
  },
  {
    key: 'last-month',
    label: 'Last month',
  },
  {
    key: 'this-year',
    label: 'This year',
  },
];

const DEFAULT_CATEGORIES = [
  'Sales',
  'Salary',
  'Transfer',
  'Other income',
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Inventory',
  'Marketing',
  'Equipment',
  'Bank charges',
  'Other expense',
];

/*
|--------------------------------------------------------------------------
| Date Helpers
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
  const value = new Intl.DateTimeFormat('en-NG', {
    timeZone: BUSINESS_TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  }).format(date);

  return Number(value);
}

function getLagosDateString(date = new Date()) {
  const { year, month, day } = getLagosDateParts(date);

  return `${year}-${String(month).padStart(2, '0')}-${String(
    day
  ).padStart(2, '0')}`;
}

function parseDateOnly(value: string) {
  const [year, month, day] = value
    .split('-')
    .map(Number);

  return new Date(
    year,
    (month || 1) - 1,
    day || 1
  );
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');
  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
}

function getTodayInputValue() {
  return getLagosDateString();
}

function getPeriodRange(period: PeriodKey) {
  const today = parseDateOnly(
    getLagosDateString()
  );

  switch (period) {
    case 'today':
      return {
        start: formatDateOnly(today),
        end: formatDateOnly(today),
      };

    case 'this-week': {
      const day = today.getDay();
      const difference =
        day === 0 ? 6 : day - 1;

      const start = addDays(
        today,
        -difference
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(today),
      };
    }

    case 'this-month': {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(today),
      };
    }

    case 'last-month': {
      const start = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(end),
      };
    }

    case 'this-year': {
      const start = new Date(
        today.getFullYear(),
        0,
        1
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(today),
      };
    }
  }
}

function formatTransactionDate(
  date: string
) {
  const parsed = parseDateOnly(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
}

function formatShortDate(date: string) {
  const parsed = parseDateOnly(date);

  return parsed.toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
    }
  );
}

/*
|--------------------------------------------------------------------------
| General Helpers
|--------------------------------------------------------------------------
*/

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

function formatCurrency(
  amount: number,
  currency = 'NGN'
) {
  const currencySymbol =
    currency === 'NGN'
      ? '₦'
      : currency === 'USD'
        ? '$'
        : currency === 'EUR'
          ? '€'
          : currency === 'XOF'
            ? 'CFA '
            : `${currency} `;

  return `${currencySymbol}${Math.round(
    Math.abs(amount)
  ).toLocaleString('en-NG')}`;
}

function toNumber(
  value: number | string | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getTransactionAmount(
  transaction: TransactionRow
) {
  return toNumber(
    transaction.amount
  );
}

function getAccountLabel(
  accountId: string | null
) {
  if (!accountId) {
    return 'No account';
  }

  return `Account ${accountId.slice(0, 8)}`;
}

function getTransactionReference(
  transaction: TransactionRow
) {
  if (transaction.reference) {
    return transaction.reference;
  }

  return transaction.id
    .slice(0, 8)
    .toUpperCase();
}

function normalizeTransaction(
  transaction: TransactionRow
): Transaction {
  return {
    id: transaction.id,
    description:
      transaction.description?.trim() ||
      transaction.category ||
      'Transaction',
    category:
      transaction.category ||
      'Uncategorized',
    amount:
      getTransactionAmount(
        transaction
      ),
    type:
      transaction.type === 'expense'
        ? 'expense'
        : 'income',
    date: transaction.date,
    createdAt:
      transaction.created_at,
    accountId:
      transaction.account_id,
    accountLabel:
      getAccountLabel(
        transaction.account_id
      ),
    reference:
      getTransactionReference(
        transaction
      ),
    currency:
      transaction.currency ||
      'NGN',
  };
}

function getDateValue(date: string) {
  return parseDateOnly(date).getTime();
}

function getPeriodChartPoints(
  period: PeriodKey,
  transactions: Transaction[]
): ChartPoint[] {
  const {
    start,
    end,
  } = getPeriodRange(period);

  const startDate =
    parseDateOnly(start);

  const endDate =
    parseDateOnly(end);

  /*
  |--------------------------------------------------------------------------
  | Today
  |--------------------------------------------------------------------------
  | Six four-hour blocks.
  */

  if (period === 'today') {
    const points: ChartPoint[] =
      Array.from(
        { length: 6 },
        (_, index) => {
          const startHour =
            index * 4;

          const label =
            startHour === 0
              ? '12 AM'
              : startHour === 12
                ? '12 PM'
                : startHour < 12
                  ? `${startHour} AM`
                  : `${startHour - 12} PM`;

          return {
            key: `hour-${startHour}`,
            label,
            moneyIn: 0,
            moneyOut: 0,
          };
        }
      );

    transactions.forEach(
      (transaction) => {
        if (
          transaction.date !==
          start
        ) {
          return;
        }

        if (!transaction.createdAt) {
          return;
        }

        const hour =
          getLagosHour(
            new Date(
              transaction.createdAt
            )
          );

        const bucket = Math.min(
          5,
          Math.floor(hour / 4)
        );

        if (
          transaction.type ===
          'income'
        ) {
          points[bucket].moneyIn +=
            transaction.amount;
        } else {
          points[bucket].moneyOut +=
            transaction.amount;
        }
      }
    );

    return points;
  }

  /*
  |--------------------------------------------------------------------------
  | This Week
  |--------------------------------------------------------------------------
  */

  if (period === 'this-week') {
    const points: ChartPoint[] = [];

    let cursor = new Date(
      startDate
    );

    while (
      cursor <= endDate
    ) {
      const date =
        formatDateOnly(cursor);

      const label =
        cursor.toLocaleDateString(
          'en-NG',
          {
            weekday: 'short',
            day: 'numeric',
          }
        );

      points.push({
        key: date,
        label,
        moneyIn: 0,
        moneyOut: 0,
      });

      cursor = addDays(
        cursor,
        1
      );
    }

    transactions.forEach(
      (transaction) => {
        const point =
          points.find(
            (item) =>
              item.key ===
              transaction.date
          );

        if (!point) {
          return;
        }

        if (
          transaction.type ===
          'income'
        ) {
          point.moneyIn +=
            transaction.amount;
        } else {
          point.moneyOut +=
            transaction.amount;
        }
      }
    );

    return points;
  }

  /*
  |--------------------------------------------------------------------------
  | This Month / Last Month
  |--------------------------------------------------------------------------
  */

  if (
    period === 'this-month' ||
    period === 'last-month'
  ) {
    const points: ChartPoint[] = [];

    let cursor = new Date(
      startDate
    );

    while (
      cursor <= endDate
    ) {
      const date =
        formatDateOnly(cursor);

      points.push({
        key: date,
        label:
          cursor.getDate().toString(),
        moneyIn: 0,
        moneyOut: 0,
      });

      cursor = addDays(
        cursor,
        1
      );
    }

    transactions.forEach(
      (transaction) => {
        const point =
          points.find(
            (item) =>
              item.key ===
              transaction.date
          );

        if (!point) {
          return;
        }

        if (
          transaction.type ===
          'income'
        ) {
          point.moneyIn +=
            transaction.amount;
        } else {
          point.moneyOut +=
            transaction.amount;
        }
      }
    );

    return points;
  }

  /*
  |--------------------------------------------------------------------------
  | This Year
  |--------------------------------------------------------------------------
  */

  const points: ChartPoint[] = [];

  let cursor = new Date(
    startDate.getFullYear(),
    0,
    1
  );

  const currentMonth =
    endDate.getMonth();

  while (
    cursor.getMonth() <=
    currentMonth
  ) {
    const month =
      cursor.getMonth();

    points.push({
      key: `${cursor.getFullYear()}-${String(
        month + 1
      ).padStart(2, '0')}`,
      label:
        cursor.toLocaleDateString(
          'en-NG',
          {
            month: 'short',
          }
        ),
      moneyIn: 0,
      moneyOut: 0,
    });

    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      1
    );
  }

  transactions.forEach(
    (transaction) => {
      const parsed =
        parseDateOnly(
          transaction.date
        );

      if (
        parsed.getFullYear() !==
        endDate.getFullYear()
      ) {
        return;
      }

      const key = `${parsed.getFullYear()}-${String(
        parsed.getMonth() + 1
      ).padStart(2, '0')}`;

      const point =
        points.find(
          (item) =>
            item.key === key
        );

      if (!point) {
        return;
      }

      if (
        transaction.type ===
        'income'
      ) {
        point.moneyIn +=
          transaction.amount;
      } else {
        point.moneyOut +=
          transaction.amount;
      }
    }
  );

  return points;
}

function downloadCsv(
  transactions: Transaction[]
) {
  if (
    transactions.length === 0
  ) {
    return;
  }

  const headers = [
    'Transaction ID',
    'Description',
    'Category',
    'Type',
    'Amount',
    'Currency',
    'Date',
    'Account',
    'Reference',
  ];

  const rows = transactions.map(
    (transaction) => [
      transaction.id,
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount,
      transaction.currency,
      transaction.date,
      transaction.accountLabel,
      transaction.reference,
    ]
  );

  const csv = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((value) => {
          const stringValue =
            String(value ?? '');

          return `"${stringValue.replace(
            /"/g,
            '""'
          )}"`;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob(
    [csv],
    {
      type: 'text/csv;charset=utf-8;',
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;
  link.download = `monietar-transactions-${getLagosDateString()}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function TransactionsPage() {
  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [accounts, setAccounts] =
    useState<AccountOption[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('All categories');

  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState('All accounts');

  const [
    selectedPeriod,
    setSelectedPeriod,
  ] =
    useState<PeriodKey>(
      'this-month'
    );

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [
    selectedTransactions,
    setSelectedTransactions,
  ] = useState<string[]>([]);

  const [canExport, setCanExport] =
    useState(false);

  const [
    addTransactionOpen,
    setAddTransactionOpen,
  ] = useState(false);

  const [
    savingTransaction,
    setSavingTransaction,
  ] = useState(false);

  const [
    transactionError,
    setTransactionError,
  ] = useState<string | null>(null);

  const [
    transactionType,
    setTransactionType,
  ] =
    useState<TransactionType>(
      'income'
    );

  const [amount, setAmount] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [date, setDate] =
    useState(getTodayInputValue());

  const [currency, setCurrency] =
    useState('NGN');

  const [accountId, setAccountId] =
    useState('');

  const [reference, setReference] =
    useState('');

  const [notes, setNotes] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | Supabase
  |--------------------------------------------------------------------------
  */

  const supabase = useMemo(
    () => createClient(),
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Load User Plan
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      const plan = normalizePlan(
        user?.user_metadata
          ?.subscription_plan ??
          user?.user_metadata?.plan
      );

      setCanExport(
        plan === 'borderless-pro'
      );
    }

    loadPlan();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /*
  |--------------------------------------------------------------------------
  | Load Accounts
  |--------------------------------------------------------------------------
  */

  async function loadAccounts(
    userId: string
  ) {
    const {
      data,
      error: accountError,
    } =
      await supabase
        .from('accounts')
        .select(
          `
            id,
            name,
            currency
          `
        )
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('is_default', {
          ascending: false,
        })
        .order('name', {
          ascending: true,
        });

    if (accountError) {
      console.error(
        'Failed to load accounts:',
        accountError
      );

      return;
    }

    setAccounts(
      (data ?? []) as AccountOption[]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Load Transactions
  |--------------------------------------------------------------------------
  */

  async function loadTransactions() {
    try {
      setLoading(true);
      setError(null);

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
          'You must be signed in to view your transactions.'
        );
      }

      await loadAccounts(
        user.id
      );

      const {
        data,
        error: transactionError,
      } =
        await supabase
          .from('transactions')
          .select(
            `
              id,
              user_id,
              type,
              amount,
              amount_base,
              currency,
              category,
              description,
              date,
              created_at,
              status,
              is_deleted,
              account_id,
              reference,
              notes
            `
          )
          .eq(
            'user_id',
            user.id
          )
          .eq(
            'is_deleted',
            false
          )
          .eq(
            'status',
            'completed'
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

      if (transactionError) {
        throw transactionError;
      }

      const normalized =
        (
          (data ??
            []) as TransactionRow[]
        ).map(
          normalizeTransaction
        );

      setTransactions(
        normalized
      );
    } catch (err) {
      console.error(
        'Failed to load transactions:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your transactions.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [supabase]);

  /*
  |--------------------------------------------------------------------------
  | Add Transaction Form
  |--------------------------------------------------------------------------
  */

  function resetTransactionForm() {
    setTransactionType(
      'income'
    );
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(
      getTodayInputValue()
    );
    setCurrency('NGN');
    setAccountId('');
    setReference('');
    setNotes('');
    setTransactionError(null);
  }

  function openAddTransaction() {
    resetTransactionForm();

    if (accounts.length > 0) {
      setAccountId(
        accounts[0].id
      );

      setCurrency(
        accounts[0].currency ||
          'NGN'
      );
    }

    setAddTransactionOpen(true);
  }

  function closeAddTransaction() {
    if (savingTransaction) {
      return;
    }

    setAddTransactionOpen(false);
    resetTransactionForm();
  }

  async function handleAddTransaction(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setTransactionError(null);

    const parsedAmount =
      Number(amount);

    if (
      !Number.isFinite(
        parsedAmount
      ) ||
      parsedAmount <= 0
    ) {
      setTransactionError(
        'Enter an amount greater than zero.'
      );

      return;
    }

    if (!category.trim()) {
      setTransactionError(
        'Please choose or enter a category.'
      );

      return;
    }

    if (!date) {
      setTransactionError(
        'Please select a date.'
      );

      return;
    }

    setSavingTransaction(true);

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
          'You must be signed in to add a transaction.'
        );
      }

      const selectedAccount =
        accounts.find(
          (account) =>
            account.id ===
            accountId
        );

      const {
        error: insertError,
      } =
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: transactionType,
            amount:
              parsedAmount,
            amount_base:
              parsedAmount,
            currency:
              currency ||
              selectedAccount?.currency ||
              'NGN',
            exchange_rate: 1,
            category:
              category.trim(),
            description:
              description.trim() ||
              category.trim(),
            date,
            account_id:
              accountId || null,
            status:
              'completed',
            reference:
              reference.trim() ||
              null,
            notes:
              notes.trim() ||
              null,
            is_deleted:
              false,
            source:
              'manual',
          });

      if (insertError) {
        throw insertError;
      }

      setAddTransactionOpen(
        false
      );

      resetTransactionForm();

      await loadTransactions();
    } catch (err) {
      console.error(
        'Failed to add transaction:',
        err
      );

      setTransactionError(
        err instanceof Error
          ? err.message
          : 'Unable to add this transaction.'
      );
    } finally {
      setSavingTransaction(
        false
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Period
  |--------------------------------------------------------------------------
  */

  const periodLabel =
    periods.find(
      (period) =>
        period.key ===
        selectedPeriod
    )?.label ??
    'This month';

  /*
  |--------------------------------------------------------------------------
  | Filter Options
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const uniqueCategories =
      Array.from(
        new Set(
          transactions
            .map(
              (transaction) =>
                transaction.category
            )
            .filter(Boolean)
        )
      ).sort();

    return [
      'All categories',
      ...uniqueCategories,
    ];
  }, [transactions]);

  const accountFilterOptions =
    useMemo(() => {
      const uniqueAccounts =
        Array.from(
          new Set(
            transactions.map(
              (transaction) =>
                transaction.accountLabel
            )
          )
        ).sort();

      return [
        'All accounts',
        ...uniqueAccounts,
      ];
    }, [transactions]);

  /*
  |--------------------------------------------------------------------------
  | Filtered Transactions
  |--------------------------------------------------------------------------
  */

  const filteredTransactions =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();

      const {
        start,
        end,
      } =
        getPeriodRange(
          selectedPeriod
        );

      return transactions.filter(
        (transaction) => {
          /*
          |------------------------------------------------------------------
          | Date filter
          |------------------------------------------------------------------
          | Compare YYYY-MM-DD strings directly.
          | This avoids browser timezone / UTC shifting.
          */

          const matchesPeriod =
            transaction.date >=
              start &&
            transaction.date <=
              end;

          const matchesSearch =
            !query ||
            transaction.description
              .toLowerCase()
              .includes(query) ||
            transaction.category
              .toLowerCase()
              .includes(query) ||
            transaction.reference
              .toLowerCase()
              .includes(query) ||
            transaction.accountLabel
              .toLowerCase()
              .includes(query) ||
            transaction.id
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            selectedCategory ===
              'All categories' ||
            transaction.category ===
              selectedCategory;

          const matchesAccount =
            selectedAccount ===
              'All accounts' ||
            transaction.accountLabel ===
              selectedAccount;

          return (
            matchesPeriod &&
            matchesSearch &&
            matchesCategory &&
            matchesAccount
          );
        }
      );
    }, [
      transactions,
      search,
      selectedCategory,
      selectedAccount,
      selectedPeriod,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Chart
  |--------------------------------------------------------------------------
  */

  const chartPoints =
    useMemo(
      () =>
        getPeriodChartPoints(
          selectedPeriod,
          filteredTransactions
        ),
      [
        selectedPeriod,
        filteredTransactions,
      ]
    );

  const chartMax = useMemo(
    () =>
      Math.max(
        1,
        ...chartPoints.flatMap(
          (point) => [
            point.moneyIn,
            point.moneyOut,
          ]
        )
      ),
    [chartPoints]
  );

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const totalMoneyIn =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          'income'
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          transaction.amount,
        0
      );

  const totalMoneyOut =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          'expense'
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          transaction.amount,
        0
      );

  const netMovement =
    totalMoneyIn -
    totalMoneyOut;

  const transactionCount =
    filteredTransactions.length;

  /*
  |--------------------------------------------------------------------------
  | Selection
  |--------------------------------------------------------------------------
  */

  const allVisibleSelected =
    filteredTransactions.length >
      0 &&
    filteredTransactions.every(
      (transaction) =>
        selectedTransactions.includes(
          transaction.id
        )
    );

  function toggleTransaction(
    id: string
  ) {
    setSelectedTransactions(
      (current) =>
        current.includes(id)
          ? current.filter(
              (
                transactionId
              ) =>
                transactionId !==
                id
            )
          : [
              ...current,
              id,
            ]
    );
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedTransactions(
        (current) =>
          current.filter(
            (id) =>
              !filteredTransactions.some(
                (
                  transaction
                ) =>
                  transaction.id ===
                  id
              )
          )
      );

      return;
    }

    setSelectedTransactions(
      (current) => [
        ...new Set([
          ...current,
          ...filteredTransactions.map(
            (
              transaction
            ) =>
              transaction.id
          ),
        ]),
      ]
    );
  }

  function clearFilters() {
    setSearch('');
    setSelectedCategory(
      'All categories'
    );
    setSelectedAccount(
      'All accounts'
    );
  }

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !==
      'All categories' ||
    selectedAccount !==
      'All accounts';

  /*
  |--------------------------------------------------------------------------
  | Export
  |--------------------------------------------------------------------------
  */

  function handleExport() {
    if (!canExport) {
      return;
    }

    downloadCsv(
      filteredTransactions
    );
  }

  function handleExportSelected() {
    if (!canExport) {
      return;
    }

    const selected =
      transactions.filter(
        (transaction) =>
          selectedTransactions.includes(
            transaction.id
          )
      );

    downloadCsv(selected);
  }

  /*
  |--------------------------------------------------------------------------
  | Insight
  |--------------------------------------------------------------------------
  */

  const categoryTotals =
    useMemo(() => {
      const totals =
        new Map<
          string,
          number
        >();

      filteredTransactions
        .filter(
          (transaction) =>
            transaction.type ===
            'expense'
        )
        .forEach(
          (transaction) => {
            totals.set(
              transaction.category,
              (totals.get(
                transaction.category
              ) ?? 0) +
                transaction.amount
            );
          }
        );

      return Array.from(
        totals.entries()
      ).sort(
        (a, b) => b[1] - a[1]
      );
    }, [
      filteredTransactions,
    ]);

  const largestExpenseCategory =
    categoryTotals[0];

  const incomeCategories =
    useMemo(() => {
      const totals =
        new Map<
          string,
          number
        >();

      filteredTransactions
        .filter(
          (transaction) =>
            transaction.type ===
            'income'
        )
        .forEach(
          (transaction) => {
            totals.set(
              transaction.category,
              (totals.get(
                transaction.category
              ) ?? 0) +
                transaction.amount
            );
          }
        );

      return Array.from(
        totals.entries()
      ).sort(
        (a, b) => b[1] - a[1]
      );
    }, [
      filteredTransactions,
    ]);

  const largestIncomeCategory =
    incomeCategories[0];

  const insightHeadline =
    transactionCount === 0
      ? 'No money activity yet for this period.'
      : netMovement > 0
        ? 'More money came in than went out.'
        : netMovement < 0
          ? 'More money went out than came in.'
          : 'The money in and money out are equal.';

  const insightDescription =
    transactionCount === 0
      ? 'Once you record some transactions, Monietar will show useful patterns from your business activity here.'
      : largestIncomeCategory
        ? `${largestIncomeCategory[0]} brought in the most money during this period.`
        : 'Monietar is looking at your recorded money activity.';

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-full bg-[#f1f1f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Money activity
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Transactions
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              See all the money coming
              into and going out of your
              business.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Add Transaction */}

            <button
              type="button"
              onClick={
                openAddTransaction
              }
              className="
                flex h-10 items-center gap-2
                bg-emerald-900
                px-4
                text-sm font-medium
                text-white
                transition-colors
                hover:bg-emerald-800
              "
            >
              <Plus
                size={15}
                strokeWidth={1.8}
              />

              Add transaction
            </button>

            {/* Period */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setPeriodOpen(
                    (open) =>
                      !open
                  )
                }
                className="
                  flex h-10 items-center gap-2
                  border border-gray-200
                  bg-white
                  px-3
                  text-sm text-gray-700
                  transition-colors
                  hover:bg-gray-50
                "
              >
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />

                <span>
                  {periodLabel}
                </span>

                <ChevronDown
                  size={14}
                  strokeWidth={1.7}
                  className={
                    periodOpen
                      ? 'rotate-180 text-gray-400'
                      : 'text-gray-400'
                  }
                />
              </button>

              {periodOpen && (
                <div className="absolute right-0 z-30 mt-2 w-40 border border-gray-200 bg-white py-1 shadow-sm">
                  {periods.map(
                    (period) => (
                      <button
                        key={
                          period.key
                        }
                        type="button"
                        onClick={() => {
                          setSelectedPeriod(
                            period.key
                          );

                          setPeriodOpen(
                            false
                          );
                        }}
                        className={`
                          flex w-full items-center
                          px-3 py-2.5
                          text-left text-sm
                          transition-colors
                          ${
                            selectedPeriod ===
                            period.key
                              ? 'bg-emerald-50 text-emerald-900'
                              : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {
                          period.label
                        }
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Export */}

            <button
              type="button"
              onClick={
                handleExport
              }
              disabled={
                !canExport ||
                filteredTransactions.length ===
                  0
              }
              title={
                canExport
                  ? 'Export transactions'
                  : 'Exports are available on Borderless Pro'
              }
              className="
                flex h-10 items-center gap-2
                border border-gray-200
                bg-white
                px-3
                text-sm font-medium
                text-gray-500
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {!canExport ? (
                <Lock
                  size={14}
                  strokeWidth={1.7}
                />
              ) : (
                <Download
                  size={15}
                  strokeWidth={1.7}
                />
              )}

              Export
            </button>
          </div>
        </section>

        {/* Error */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-800">
              We couldn't load your
              transactions
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Summary */}

        <section className="grid grid-cols-1 gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-4">
          <TransactionMetric
            label="Money in"
            value={
              loading
                ? '—'
                : formatCurrency(
                    totalMoneyIn
                  )
            }
            description="Money recorded as coming in"
            icon={
              ArrowDownRight
            }
            positive
          />

          <TransactionMetric
            label="Money out"
            value={
              loading
                ? '—'
                : formatCurrency(
                    totalMoneyOut
                  )
            }
            description="Money recorded as going out"
            icon={ArrowUpRight}
          />

          <TransactionMetric
            label="Money left"
            value={
              loading
                ? '—'
                : formatCurrency(
                    Math.abs(
                      netMovement
                    )
                  )
            }
            description={
              netMovement >=
              0
                ? 'Money in minus money out'
                : 'More money went out than came in'
            }
            icon={
              netMovement >=
              0
                ? TrendingUp
                : TrendingDown
            }
            positive={
              netMovement >=
              0
            }
          />

          <TransactionMetric
            label="Transactions"
            value={
              loading
                ? '—'
                : transactionCount.toString()
            }
            description="Money records for this period"
            icon={Receipt}
            neutral
          />
        </section>

        {/* Money Chart */}

        <section className="mt-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3
                    size={16}
                    strokeWidth={1.7}
                    className="text-emerald-900"
                  />

                  <p className="text-sm font-semibold text-gray-900">
                    Money In & Out
                  </p>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  See how your money moved
                  during {periodLabel.toLowerCase()}.
                </p>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-emerald-900" />
                  Money in
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-gray-300" />
                  Money out
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-900" />

                  <p className="mt-3 text-xs text-gray-400">
                    Loading money activity...
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto pb-2">
                <div
                  className={`flex h-64 min-w-[${Math.max(
                    640,
                    chartPoints.length * 55
                  )}px] items-end gap-2`}
                >
                  {chartPoints.map(
                    (point) => {
                      const moneyInHeight =
                        point.moneyIn >
                        0
                          ? Math.max(
                              5,
                              (point.moneyIn /
                                chartMax) *
                                100
                            )
                          : 0;

                      const moneyOutHeight =
                        point.moneyOut >
                        0
                          ? Math.max(
                              5,
                              (point.moneyOut /
                                chartMax) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={
                            point.key
                          }
                          className="flex min-w-[42px] flex-1 flex-col items-center justify-end"
                        >
                          <div className="mb-2 flex h-[205px] w-full items-end justify-center gap-1">
                            <div className="flex h-full w-3 items-end justify-center">
                              <div
                                className="w-full bg-emerald-900 transition-all duration-300"
                                style={{
                                  height: `${moneyInHeight}%`,
                                }}
                                title={`Money in: ${formatCurrency(
                                  point.moneyIn
                                )}`}
                              />
                            </div>

                            <div className="flex h-full w-3 items-end justify-center">
                              <div
                                className="w-full bg-gray-300 transition-all duration-300"
                                style={{
                                  height: `${moneyOutHeight}%`,
                                }}
                                title={`Money out: ${formatCurrency(
                                  point.moneyOut
                                )}`}
                              />
                            </div>
                          </div>

                          <p className="whitespace-nowrap text-[9px] text-gray-400">
                            {
                              point.label
                            }
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {!loading &&
              chartPoints.every(
                (point) =>
                  point.moneyIn ===
                    0 &&
                  point.moneyOut ===
                    0
              ) && (
                <div className="pointer-events-none -mt-44 flex h-40 items-center justify-center">
                  <p className="text-xs text-gray-400">
                    No money activity
                    recorded for this
                    period.
                  </p>
                </div>
              )}
          </div>
        </section>

        {/* Main Content */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.7fr)]">
          {/* Transaction Ledger */}

          <section className="min-w-0 border border-gray-200 bg-white">
            {/* Table Header */}

            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Your transactions
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    See and manage the money
                    you've recorded.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen(
                      (open) =>
                        !open
                    )
                  }
                  className={`
                    flex h-9 w-fit items-center gap-2
                    border px-3
                    text-xs font-medium
                    transition-colors
                    ${
                      filterOpen ||
                      hasActiveFilters
                        ? 'border-emerald-900 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <SlidersHorizontal
                    size={14}
                    strokeWidth={1.7}
                  />

                  Filters

                  {hasActiveFilters && (
                    <span className="flex h-4 min-w-4 items-center justify-center bg-emerald-900 px-1 text-[9px] text-white">
                      {
                        [
                          search !==
                            '',
                          selectedCategory !==
                            'All categories',
                          selectedAccount !==
                            'All accounts',
                        ].filter(
                          Boolean
                        ).length
                      }
                    </span>
                  )}
                </button>
              </div>

              {/* Search */}

              <div className="relative mt-5">
                <Search
                  size={15}
                  strokeWidth={1.7}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search transactions..."
                  className="
                    h-10 w-full
                    border border-gray-200
                    bg-[#f9f9f9]
                    pl-9 pr-9
                    text-sm text-gray-900
                    outline-none
                    transition-colors
                    placeholder:text-gray-400
                    focus:border-emerald-900
                    focus:bg-white
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch('')
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <X
                      size={14}
                      strokeWidth={1.7}
                    />
                  </button>
                )}
              </div>

              {/* Filters */}

              {filterOpen && (
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                  <FilterSelect
                    label="Category"
                    value={
                      selectedCategory
                    }
                    options={
                      categories
                    }
                    onChange={
                      setSelectedCategory
                    }
                  />

                  <FilterSelect
                    label="Account"
                    value={
                      selectedAccount
                    }
                    options={
                      accountFilterOptions
                    }
                    onChange={
                      setSelectedAccount
                    }
                  />
                </div>
              )}

              {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-[10px] text-gray-400">
                    Some filters are
                    active.
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="text-[10px] font-medium text-emerald-900 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Actions */}

            {selectedTransactions.length >
              0 && (
              <div className="flex items-center justify-between border-b border-gray-200 bg-emerald-50 px-5 py-3 sm:px-6">
                <p className="text-xs font-medium text-emerald-900">
                  {
                    selectedTransactions.length
                  }{' '}
                  selected
                </p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={
                      handleExportSelected
                    }
                    disabled={
                      !canExport
                    }
                    title={
                      canExport
                        ? 'Export selected transactions'
                        : 'Exports are available on Borderless Pro'
                    }
                    className="
                      flex items-center gap-1.5
                      text-[10px] font-medium
                      text-emerald-900
                      hover:underline
                      disabled:cursor-not-allowed
                      disabled:no-underline
                      disabled:opacity-50
                    "
                  >
                    {!canExport && (
                      <Lock
                        size={11}
                        strokeWidth={
                          1.7
                        }
                      />
                    )}

                    Export selected
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTransactions(
                        []
                      )
                    }
                    className="text-[10px] text-gray-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}

            {loading ? (
              <div className="px-6 py-20 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-900" />

                <p className="mt-4 text-sm font-medium text-gray-900">
                  Loading transactions
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Getting your latest money
                  records.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#fafafa]">
                        <th className="w-10 px-5 py-3 text-left sm:px-6">
                          <input
                            type="checkbox"
                            checked={
                              allVisibleSelected
                            }
                            onChange={
                              toggleAllVisible
                            }
                            className="h-3.5 w-3.5 accent-emerald-900"
                            aria-label="Select all transactions"
                          />
                        </th>

                        <th className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                          Transaction
                        </th>

                        <th className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                          Category
                        </th>

                        <th className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                          Account
                        </th>

                        <th className="px-3 py-3 text-right text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredTransactions.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan={
                              5
                            }
                            className="px-6 py-16 text-center"
                          >
                            <EmptyTransactions
                              onAdd={
                                openAddTransaction
                              }
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map(
                          (
                            transaction
                          ) => (
                            <tr
                              key={
                                transaction.id
                              }
                              className="transition-colors hover:bg-gray-50/70"
                            >
                              <td className="px-5 py-4 sm:px-6">
                                <input
                                  type="checkbox"
                                  checked={selectedTransactions.includes(
                                    transaction.id
                                  )}
                                  onChange={() =>
                                    toggleTransaction(
                                      transaction.id
                                    )
                                  }
                                  className="h-3.5 w-3.5 accent-emerald-900"
                                  aria-label={`Select ${transaction.description}`}
                                />
                              </td>

                              <td className="px-3 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                                      transaction.type ===
                                      'income'
                                        ? 'bg-emerald-50 text-emerald-900'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {transaction.type ===
                                    'income' ? (
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
                                      {
                                        transaction.description
                                      }
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                      {
                                        transaction.reference
                                      }{' '}
                                      ·{' '}
                                      {formatTransactionDate(
                                        transaction.date
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 py-4">
                                <p className="text-xs text-gray-700">
                                  {
                                    transaction.category
                                  }
                                </p>

                                <p className="mt-1 text-[10px] text-gray-400">
                                  {transaction.type ===
                                  'income'
                                    ? 'Money in'
                                    : 'Money out'}
                                </p>
                              </td>

                              <td className="px-3 py-4">
                                <p className="max-w-[150px] truncate text-xs text-gray-700">
                                  {
                                    transaction.accountLabel
                                  }
                                </p>
                              </td>

                              <td className="px-3 py-4 text-right">
                                <p
                                  className={`text-sm font-semibold ${
                                    transaction.type ===
                                    'income'
                                      ? 'text-emerald-900'
                                      : 'text-gray-900'
                                  }`}
                                >
                                  {transaction.type ===
                                  'income'
                                    ? '+'
                                    : '-'}
                                  {formatCurrency(
                                    transaction.amount,
                                    transaction.currency
                                  )}
                                </p>
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Transactions */}

                <div className="divide-y divide-gray-100 md:hidden">
                  {filteredTransactions.length ===
                  0 ? (
                    <div className="px-5 py-16 text-center">
                      <EmptyTransactions
                        onAdd={
                          openAddTransaction
                        }
                      />
                    </div>
                  ) : (
                    filteredTransactions.map(
                      (
                        transaction
                      ) => (
                        <div
                          key={
                            transaction.id
                          }
                          className="px-5 py-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedTransactions.includes(
                                  transaction.id
                                )}
                                onChange={() =>
                                  toggleTransaction(
                                    transaction.id
                                  )
                                }
                                className="h-3.5 w-3.5 shrink-0 accent-emerald-900"
                                aria-label={`Select ${transaction.description}`}
                              />

                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                                  transaction.type ===
                                  'income'
                                    ? 'bg-emerald-50 text-emerald-900'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {transaction.type ===
                                'income' ? (
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
                                  {
                                    transaction.description
                                  }
                                </p>

                                <p className="mt-1 text-[10px] text-gray-400">
                                  {
                                    transaction.category
                                  }{' '}
                                  ·{' '}
                                  {
                                    transaction.accountLabel
                                  }
                                </p>
                              </div>
                            </div>

                            <p
                              className={`shrink-0 text-sm font-semibold ${
                                transaction.type ===
                                'income'
                                  ? 'text-emerald-900'
                                  : 'text-gray-900'
                              }`}
                            >
                              {transaction.type ===
                              'income'
                                ? '+'
                                : '-'}
                              {formatCurrency(
                                transaction.amount,
                                transaction.currency
                              )}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between pl-[84px]">
                            <span className="text-[10px] text-gray-400">
                              {
                                transaction.reference
                              }
                            </span>

                            <span className="text-[10px] text-gray-400">
                              {formatTransactionDate(
                                transaction.date
                              )}
                            </span>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </>
            )}

            {/* Footer */}

            <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[10px] text-gray-400">
                Showing{' '}
                {
                  filteredTransactions.length
                }{' '}
                of{' '}
                {transactions.length}{' '}
                transactions
              </p>

              <div className="flex items-center gap-4 text-[10px]">
                <span className="text-gray-400">
                  Money left
                </span>

                <span
                  className={`font-semibold ${
                    netMovement >=
                    0
                      ? 'text-emerald-900'
                      : 'text-red-600'
                  }`}
                >
                  {netMovement >=
                  0
                    ? '+'
                    : '-'}
                  {formatCurrency(
                    Math.abs(
                      netMovement
                    )
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* Right Column */}

          <div className="space-y-6">
            {/* Monietar Insight */}

            <section className="border border-gray-200 bg-emerald-900 text-white">
              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Monietar Insight
                    </p>

                    <p className="mt-1 text-xs text-emerald-200">
                      Based on your money
                      activity
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

              <div className="p-5">
                <p className="text-lg font-medium leading-7">
                  {
                    insightHeadline
                  }
                </p>

                <p className="mt-4 text-sm leading-6 text-emerald-100">
                  {
                    insightDescription
                  }

                  {largestExpenseCategory &&
                    ` ${largestExpenseCategory[0]} is where you spent the most during this period, at ${formatCurrency(
                      largestExpenseCategory[1]
                    )}.`}
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-200">
                      Money left
                    </span>

                    <span className="text-sm font-semibold">
                      {netMovement >=
                      0
                        ? '+'
                        : '-'}
                      {formatCurrency(
                        Math.abs(
                          netMovement
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Money Movement */}

            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">
                  Money In & Out
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  See how much money came
                  in and went out.
                </p>
              </div>

              <div className="p-5">
                <MovementRow
                  icon={
                    ArrowDownRight
                  }
                  label="Money in"
                  value={formatCurrency(
                    totalMoneyIn
                  )}
                  percentage={100}
                  positive
                />

                <MovementRow
                  icon={
                    ArrowUpRight
                  }
                  label="Money out"
                  value={formatCurrency(
                    totalMoneyOut
                  )}
                  percentage={
                    totalMoneyIn >
                    0
                      ? Math.round(
                          (totalMoneyOut /
                            totalMoneyIn) *
                            100
                        )
                      : 0
                  }
                />

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Money left
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        Math.abs(
                          netMovement
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}

            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">
                  Quick actions
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Do common tasks quickly.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  type="button"
                  onClick={
                    openAddTransaction
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-gray-50 text-gray-500">
                      <Receipt
                        size={15}
                        strokeWidth={
                          1.7
                        }
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Add transaction
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Add money in or
                        money out
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    strokeWidth={1.7}
                    className="text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-gray-50 text-gray-500">
                      <Wallet
                        size={15}
                        strokeWidth={
                          1.7
                        }
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Manage accounts
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        View your connected
                        accounts
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    strokeWidth={1.7}
                    className="text-gray-400"
                  />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}

      {addTransactionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddTransaction();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto border border-gray-200 bg-white shadow-xl">
            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Add transaction
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Record money coming in or
                  going out of your business.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeAddTransaction
                }
                disabled={
                  savingTransaction
                }
                className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X
                  size={17}
                  strokeWidth={
                    1.7
                  }
                />
              </button>
            </div>

            <form
              onSubmit={
                handleAddTransaction
              }
            >
              <div className="space-y-5 px-5 py-6 sm:px-6">
                {/* Type */}

                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Transaction type
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTransactionType(
                          'income'
                        )
                      }
                      className={`flex h-11 items-center justify-center gap-2 border text-sm font-medium transition-colors ${
                        transactionType ===
                        'income'
                          ? 'border-emerald-900 bg-emerald-50 text-emerald-900'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ArrowDownRight
                        size={16}
                        strokeWidth={
                          1.7
                        }
                      />

                      Money in
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTransactionType(
                          'expense'
                        )
                      }
                      className={`flex h-11 items-center justify-center gap-2 border text-sm font-medium transition-colors ${
                        transactionType ===
                        'expense'
                          ? 'border-gray-800 bg-gray-100 text-gray-900'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ArrowUpRight
                        size={16}
                        strokeWidth={
                          1.7
                        }
                      />

                      Money out
                    </button>
                  </div>
                </div>

                {/* Amount */}

                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Amount
                  </label>

                  <div className="flex border border-gray-200 bg-white focus-within:border-emerald-900">
                    <div className="flex w-16 items-center justify-center border-r border-gray-200 text-sm text-gray-500">
                      {currency ===
                      'NGN'
                        ? '₦'
                        : currency ===
                            'USD'
                          ? '$'
                          : currency ===
                              'EUR'
                            ? '€'
                            : currency ===
                                'XOF'
                              ? 'CFA'
                              : currency}
                    </div>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={
                        amount
                      }
                      onChange={(
                        event
                      ) =>
                        setAmount(
                          event.target
                            .value
                        )
                      }
                      placeholder="0.00"
                      required
                      className="h-12 min-w-0 flex-1 bg-transparent px-3 text-lg font-semibold text-gray-900 outline-none placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Category + Date */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                      Category
                    </span>

                    <input
                      list="transaction-categories"
                      value={
                        category
                      }
                      onChange={(
                        event
                      ) =>
                        setCategory(
                          event.target
                            .value
                        )
                      }
                      placeholder={
                        transactionType ===
                        'income'
                          ? 'e.g. Sales'
                          : 'e.g. Inventory'
                      }
                      required
                      className="h-10 w-full border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-900"
                    />

                    <datalist id="transaction-categories">
                      {DEFAULT_CATEGORIES.map(
                        (item) => (
                          <option
                            key={
                              item
                            }
                            value={
                              item
                            }
                          />
                        )
                      )}
                    </datalist>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                      Date
                    </span>

                    <input
                      type="date"
                      value={date}
                      onChange={(
                        event
                      ) =>
                        setDate(
                          event.target
                            .value
                        )
                      }
                      required
                      className="h-10 w-full border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                    />
                  </label>
                </div>

                {/* Currency + Account */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                      Currency
                    </span>

                    <div className="relative">
                      <select
                        value={
                          currency
                        }
                        onChange={(
                          event
                        ) =>
                          setCurrency(
                            event.target
                              .value
                          )
                        }
                        className="h-10 w-full appearance-none border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-900 outline-none focus:border-emerald-900"
                      >
                        <option value="NGN">
                          NGN — Nigerian Naira
                        </option>

                        <option value="USD">
                          USD — US Dollar
                        </option>

                        <option value="EUR">
                          EUR — Euro
                        </option>

                        <option value="XOF">
                          XOF — CFA Franc
                        </option>
                      </select>

                      <ChevronDown
                        size={13}
                        strokeWidth={
                          1.7
                        }
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                      Account
                    </span>

                    <div className="relative">
                      <select
                        value={
                          accountId
                        }
                        onChange={(
                          event
                        ) => {
                          const nextId =
                            event
                              .target
                              .value;

                          setAccountId(
                            nextId
                          );

                          const selected =
                            accounts.find(
                              (
                                account
                              ) =>
                                account.id ===
                                nextId
                            );

                          if (
                            selected?.currency
                          ) {
                            setCurrency(
                              selected.currency
                            );
                          }
                        }}
                        className="h-10 w-full appearance-none border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-900 outline-none focus:border-emerald-900"
                      >
                        <option value="">
                          No account
                        </option>

                        {accounts.map(
                          (
                            account
                          ) => (
                            <option
                              key={
                                account.id
                              }
                              value={
                                account.id
                              }
                            >
                              {
                                account.name
                              }{' '}
                              ·{' '}
                              {
                                account.currency
                              }
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={13}
                        strokeWidth={
                          1.7
                        }
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </label>
                </div>

                {/* Description */}

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Description
                  </span>

                  <input
                    type="text"
                    value={
                      description
                    }
                    onChange={(
                      event
                    ) =>
                      setDescription(
                        event.target
                          .value
                      )
                    }
                    placeholder={
                      transactionType ===
                      'income'
                        ? 'e.g. Customer payment'
                        : 'e.g. Stock purchase'
                    }
                    className="h-10 w-full border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-900"
                  />
                </label>

                {/* Reference */}

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Reference
                    <span className="ml-1 normal-case tracking-normal text-gray-300">
                      (optional)
                    </span>
                  </span>

                  <input
                    type="text"
                    value={
                      reference
                    }
                    onChange={(
                      event
                    ) =>
                      setReference(
                        event.target
                          .value
                      )
                    }
                    placeholder="e.g. INV-1024"
                    className="h-10 w-full border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-900"
                  />
                </label>

                {/* Notes */}

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Notes
                    <span className="ml-1 normal-case tracking-normal text-gray-300">
                      (optional)
                    </span>
                  </span>

                  <textarea
                    value={
                      notes
                    }
                    onChange={(
                      event
                    ) =>
                      setNotes(
                        event.target
                          .value
                      )
                    }
                    placeholder="Add any extra details..."
                    rows={3}
                    className="w-full resize-none border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-900"
                  />
                </label>

                {transactionError && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs leading-5 text-red-700">
                      {
                        transactionError
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}

              <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-[#fafafa] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={
                    closeAddTransaction
                  }
                  disabled={
                    savingTransaction
                  }
                  className="h-10 border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    savingTransaction
                  }
                  className="flex h-10 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingTransaction ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={15}
                        strokeWidth={
                          1.8
                        }
                      />

                      Add transaction
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Empty Transactions
|--------------------------------------------------------------------------
*/

function EmptyTransactions({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <>
      <div className="mx-auto flex h-10 w-10 items-center justify-center bg-gray-50 text-gray-400">
        <Search
          size={17}
          strokeWidth={1.7}
        />
      </div>

      <p className="mt-3 text-sm font-medium text-gray-900">
        No transactions found
      </p>

      <p className="mt-1 text-xs text-gray-400">
        Try changing your search,
        period, or filters.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mx-auto mt-4 flex h-9 items-center gap-2 bg-emerald-900 px-3 text-xs font-medium text-white transition-colors hover:bg-emerald-800"
      >
        <Plus
          size={13}
          strokeWidth={1.8}
        />

        Add transaction
      </button>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Transaction Metric
|--------------------------------------------------------------------------
*/

function TransactionMetric({
  label,
  value,
  description,
  icon: Icon,
  positive = false,
  neutral = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  positive?: boolean;
  neutral?: boolean;
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

        <div
          className={`flex h-9 w-9 items-center justify-center ${
            positive
              ? 'bg-emerald-50 text-emerald-900'
              : neutral
                ? 'bg-gray-50 text-gray-500'
                : 'bg-gray-100 text-gray-500'
          }`}
        >
          <Icon
            size={17}
            strokeWidth={1.7}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filter Select
|--------------------------------------------------------------------------
*/

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            h-9 w-full
            appearance-none
            border border-gray-200
            bg-white
            px-3 pr-8
            text-xs text-gray-700
            outline-none
            focus:border-emerald-900
          "
        >
          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={13}
          strokeWidth={1.7}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Movement Row
|--------------------------------------------------------------------------
*/

function MovementRow({
  icon: Icon,
  label,
  value,
  percentage,
  positive = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  percentage: number;
  positive?: boolean;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            size={14}
            strokeWidth={1.7}
            className={
              positive
                ? 'text-emerald-900'
                : 'text-gray-500'
            }
          />

          <span className="text-xs text-gray-500">
            {label}
          </span>
        </div>

        <span className="text-xs font-semibold text-gray-900">
          {value}
        </span>
      </div>

      <div className="h-1.5 w-full bg-gray-100">
        <div
          className={
            positive
              ? 'h-full bg-emerald-900'
              : 'h-full bg-gray-300'
          }
          style={{
            width: `${Math.min(
              100,
              Math.max(
                0,
                percentage
              )
            )}%`,
          }}
        />
      </div>
    </div>
  );
}