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
  FileText,
  Upload,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { LucideIcon } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type TransactionType = 'income' | 'expense';

type Currency = 'NGN' | 'XOF';

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

type TransactionSource =
  | 'manual'
  | 'bank_sync'
  | 'statement_import'
  | string;

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
  source: string | null;
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
  currency: Currency;
  source: TransactionSource;
};

type AccountOption = {
  id: string;
  name: string;
  currency: Currency;
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

const SUPPORTED_CURRENCIES: Currency[] = ['NGN', 'XOF'];

const STARTER_AUTOMATIC_TRANSACTION_LIMIT = 30;

const STATEMENT_IMPORT_ENDPOINT =
  '/api/transactions/import-statement';

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
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);

  const year = Number(
    parts.find((part) => part.type === 'year')?.value
  );

  const month = Number(
    parts.find((part) => part.type === 'month')?.value
  );

  const day = Number(
    parts.find((part) => part.type === 'day')?.value
  );

  return {
    year,
    month,
    day,
  };
}

function getLagosHour(date = new Date()) {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: BUSINESS_TIME_ZONE,
      hour: 'numeric',
      hour12: false,
    }).format(date)
  );
}

function getLagosDateString(date = new Date()) {
  const { year, month, day } = getLagosDateParts(date);

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
}

function parseDateOnly(value: string) {
  const [year, month, day] = value
    .split('-')
    .map(Number);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);

  next.setUTCDate(
    next.getUTCDate() + days
  );

  return next;
}

function getTodayInputValue() {
  return getLagosDateString();
}

function getPeriodRange(period: PeriodKey) {
  const today = parseDateOnly(
    getLagosDateString()
  );

  const dayOfWeek = today.getUTCDay();

  switch (period) {
    case 'today':
      return {
        start: formatDateOnly(today),
        end: formatDateOnly(today),
      };

    case 'this-week': {
      const mondayOffset =
        dayOfWeek === 0
          ? -6
          : 1 - dayOfWeek;

      const start = addDays(
        today,
        mondayOffset
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(today),
      };
    }

    case 'this-month': {
      const start = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          1
        )
      );

      const end = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          0
        )
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(end),
      };
    }

    case 'last-month': {
      const start = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth() - 1,
          1
        )
      );

      const end = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          0
        )
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(end),
      };
    }

    case 'this-year': {
      const start = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          0,
          1
        )
      );

      const end = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          11,
          31
        )
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(end),
      };
    }

    default:
      return {
        start: formatDateOnly(today),
        end: formatDateOnly(today),
      };
  }
}

function formatTransactionDate(
  value: string
) {
  const date = parseDateOnly(value);

  return new Intl.DateTimeFormat(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }
  ).format(date);
}

function formatShortDate(
  value: string
) {
  const date = parseDateOnly(value);

  return new Intl.DateTimeFormat(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }
  ).format(date);
}

/*
|--------------------------------------------------------------------------
| General Helpers
|--------------------------------------------------------------------------
*/

function normalizePlan(
  value: unknown
): Plan {
  if (
    value === 'growing-merchant' ||
    value === 'borderless-pro' ||
    value === 'retail-starter'
  ) {
    return value;
  }

  return 'retail-starter';
}

function getPlanName(
  plan: Plan
) {
  switch (plan) {
    case 'growing-merchant':
      return 'Growing Merchant';

    case 'borderless-pro':
      return 'Borderless Pro';

    default:
      return 'Retail Starter';
  }
}

function formatCurrency(
  amount: number,
  currency: Currency = 'NGN'
) {
  if (currency === 'XOF') {
    return `CFA ${amount.toLocaleString(
      'fr-FR',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    )}`;
  }

  return `₦${amount.toLocaleString(
    'en-NG',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function toNumber(
  value: unknown
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function normalizeCurrency(
  value: unknown
): Currency | null {
  const currency = String(
    value ?? ''
  ).toUpperCase();

  if (
    currency === 'NGN' ||
    currency === 'XOF'
  ) {
    return currency;
  }

  return null;
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

  return `Account ${accountId.slice(
    0,
    8
  )}`;
}

function getTransactionReference(
  transaction: TransactionRow
) {
  return (
    transaction.reference ||
    transaction.id.slice(0, 8)
  );
}

function normalizeTransaction(
  transaction: TransactionRow
): Transaction | null {
  const currency =
    normalizeCurrency(
      transaction.currency
    );

  if (!currency) {
    return null;
  }

  return {
    id: transaction.id,
    description:
      transaction.description?.trim() ||
      transaction.category ||
      'Transaction',
    category:
      transaction.category ||
      'Other',
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
    currency,
    source:
      transaction.source ||
      'manual',
  };
}

function getDateValue(
  transaction: Transaction
) {
  return transaction.date;
}

function getPeriodChartPoints(
  period: PeriodKey,
  transactions: Transaction[]
): ChartPoint[] {
  const range =
    getPeriodRange(period);

  const start =
    parseDateOnly(range.start);

  const end =
    parseDateOnly(range.end);

  const points: ChartPoint[] = [];

  if (period === 'today') {
    for (
      let hour = 0;
      hour < 24;
      hour += 4
    ) {
      const key = `${hour}`;

      points.push({
        key,
        label: `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}${hour < 12 ? 'am' : 'pm'}`,
        moneyIn: 0,
        moneyOut: 0,
      });
    }

    transactions.forEach(
      (transaction) => {
        const createdDate =
          transaction.createdAt
            ? new Date(
                transaction.createdAt
              )
            : parseDateOnly(
                transaction.date
              );

        const hour =
          getLagosHour(
            createdDate
          );

        const bucket =
          Math.min(
            20,
            Math.floor(hour / 4) * 4
          );

        const point =
          points.find(
            (item) =>
              item.key ===
              String(bucket)
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

  if (
    period === 'this-year'
  ) {
    for (
      let month = 0;
      month < 12;
      month += 1
    ) {
      const date = new Date(
        Date.UTC(
          start.getUTCFullYear(),
          month,
          1
        )
      );

      points.push({
        key: `${date.getUTCFullYear()}-${month}`,
        label:
          new Intl.DateTimeFormat(
            'en-NG',
            {
              month: 'short',
              timeZone: 'UTC',
            }
          ).format(date),
        moneyIn: 0,
        moneyOut: 0,
      });
    }

    transactions.forEach(
      (transaction) => {
        const date =
          parseDateOnly(
            transaction.date
          );

        const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

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

  const totalDays =
    Math.floor(
      (end.getTime() -
        start.getTime()) /
        86400000
    ) + 1;

  for (
    let index = 0;
    index < totalDays;
    index += 1
  ) {
    const date =
      addDays(start, index);

    const value =
      formatDateOnly(date);

    points.push({
      key: value,
      label:
        formatShortDate(value),
      moneyIn: 0,
      moneyOut: 0,
    });
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

function downloadCsv(
  transactions: Transaction[]
) {
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
    'Source',
  ];

  const rows =
    transactions.map(
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
        transaction.source,
      ]
    );

  const csv = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((value) =>
          `"${String(
            value ?? ''
          ).replace(
            /"/g,
            '""'
          )}"`
        )
        .join(',')
    )
    .join('\n');

  const blob =
    new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = url;
  anchor.download = `monietar-transactions-${getLagosDateString()}.csv`;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  document.body.removeChild(
    anchor
  );

  URL.revokeObjectURL(url);
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function TransactionsPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Main State
  |--------------------------------------------------------------------------
  */

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>(
    []
  );

  const [
    accounts,
    setAccounts,
  ] = useState<AccountOption[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    'All categories'
  );

  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState(
    'All accounts'
  );

  const [
    selectedPeriod,
    setSelectedPeriod,
  ] = useState<PeriodKey>(
    'this-month'
  );

  const [
    selectedCurrency,
    setSelectedCurrency,
  ] = useState<Currency>(
    'NGN'
  );

  const [
    filterOpen,
    setFilterOpen,
  ] = useState(false);

  const [
    periodOpen,
    setPeriodOpen,
  ] = useState(false);

  const [
    selectedTransactions,
    setSelectedTransactions,
  ] = useState<string[]>(
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Plan
  |--------------------------------------------------------------------------
  */

  const [
    plan,
    setPlan,
  ] = useState<Plan>(
    'retail-starter'
  );

  const [
    canExport,
    setCanExport,
  ] = useState(false);

  const [
    automaticTransactionCount,
    setAutomaticTransactionCount,
  ] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Manual Transaction Modal
  |--------------------------------------------------------------------------
  */

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
  ] = useState<string | null>(
    null
  );

  const [
    transactionType,
    setTransactionType,
  ] = useState<TransactionType>(
    'income'
  );

  const [
    amount,
    setAmount,
  ] = useState('');

  const [
    category,
    setCategory,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    date,
    setDate,
  ] = useState(
    getTodayInputValue()
  );

  const [
    currency,
    setCurrency,
  ] = useState<Currency>(
    'NGN'
  );

  const [
    accountId,
    setAccountId,
  ] = useState('');

  const [
    reference,
    setReference,
  ] = useState('');

  const [
    notes,
    setNotes,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Bank Statement Modal
  |--------------------------------------------------------------------------
  */

  const [
    statementModalOpen,
    setStatementModalOpen,
  ] = useState(false);

  const [
    statementFile,
    setStatementFile,
  ] = useState<File | null>(
    null
  );

  const [
    statementCurrency,
    setStatementCurrency,
  ] = useState<Currency>(
    'NGN'
  );

  const [
    statementAccountId,
    setStatementAccountId,
  ] = useState('');

  const [
    statementError,
    setStatementError,
  ] = useState<string | null>(
    null
  );

  const [
    uploadingStatement,
    setUploadingStatement,
  ] = useState(false);

  const canSubmitStatement =
    Boolean(statementFile);

  /*
  |--------------------------------------------------------------------------
  | Load Accounts
  |--------------------------------------------------------------------------
  */

  const loadAccounts =
    useCallback(
      async (userId: string) => {
        const {
          data,
          error: accountError,
        } = await supabase
          .from('accounts')
          .select(
            `
              id,
              name,
              currency
            `
          )
          .eq(
            'user_id',
            userId
          )
          .eq(
            'is_active',
            true
          )
          .in(
            'currency',
            SUPPORTED_CURRENCIES
          )
          .order(
            'is_default',
            {
              ascending: false,
            }
          )
          .order(
            'name',
            {
              ascending: true,
            }
          );

        if (accountError) {
          console.error(
            'Failed to load accounts:',
            accountError
          );

          return;
        }

        const normalized =
          (data ?? [])
            .map(
              (account) => {
                const accountCurrency =
                  normalizeCurrency(
                    account.currency
                  );

                if (
                  !accountCurrency
                ) {
                  return null;
                }

                return {
                  id: account.id,
                  name: account.name,
                  currency:
                    accountCurrency,
                };
              }
            )
            .filter(
              (
                account
              ): account is AccountOption =>
                account !== null
            );

        setAccounts(
          normalized
        );
      },
      [supabase]
    );

  /*
  |--------------------------------------------------------------------------
  | Load Transactions
  |--------------------------------------------------------------------------
  */

  const loadTransactions =
    useCallback(
      async () => {
        setLoading(true);
        setError(null);

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setError(
            'Your session has expired. Please sign in again.'
          );
          setLoading(false);
          return;
        }

        await loadAccounts(
          user.id
        );

        const {
          data,
          error: transactionError,
        } = await supabase
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
              notes,
              source
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
          .order(
            'date',
            {
              ascending: false,
            }
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          );

        if (
          transactionError
        ) {
          console.error(
            'Failed to load transactions:',
            transactionError
          );

          setError(
            transactionError.message ||
              'Unable to load transactions.'
          );

          setTransactions(
            []
          );
          setLoading(false);
          return;
        }

        const normalized =
          (data ?? [])
            .map(
              (transaction) =>
                normalizeTransaction(
                  transaction as TransactionRow
                )
            )
            .filter(
              (
                transaction
              ): transaction is Transaction =>
                transaction !== null
            );

        setTransactions(
          normalized
        );

        setLoading(false);
      },
      [
        loadAccounts,
        supabase,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | Load Plan + Automatic Usage
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      const nextPlan =
        normalizePlan(
          user?.user_metadata
            ?.subscription_plan ??
            user?.user_metadata
              ?.plan
        );

      setPlan(
        nextPlan
      );

      setCanExport(
        nextPlan ===
          'borderless-pro'
      );

      if (!user) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Retail Starter Automatic Transactions
      |--------------------------------------------------------------------------
      |
      | Only bank-sync transactions are counted here.
      |
      | Manual transactions:
      | source = manual
      |
      | Statement imports:
      | source = statement_import
      |
      | Automatic bank transactions:
      | source = bank_sync
      |
      */

      const monthRange =
        getPeriodRange(
          'this-month'
        );

      const {
        count,
        error: usageError,
      } =
        await supabase
          .from('transactions')
          .select(
            'id',
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
          .eq(
            'source',
            'bank_sync'
          )
          .gte(
            'date',
            monthRange.start
          )
          .lte(
            'date',
            monthRange.end
          );

      if (
        usageError
      ) {
        console.error(
          'Failed to load automatic transaction usage:',
          usageError
        );

        if (mounted) {
          setAutomaticTransactionCount(
            0
          );
        }

        return;
      }

      if (mounted) {
        setAutomaticTransactionCount(
          count ?? 0
        );
      }
    }

    loadPlan();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /*
  |--------------------------------------------------------------------------
  | Initial Transactions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  /*
  |--------------------------------------------------------------------------
  | Derived Plan Usage
  |--------------------------------------------------------------------------
  */

  const transactionUsage =
    Math.min(
      100,
      Math.round(
        (automaticTransactionCount /
          STARTER_AUTOMATIC_TRANSACTION_LIMIT) *
          100
      )
    );

  const remainingAutomaticTransactions =
    Math.max(
      0,
      STARTER_AUTOMATIC_TRANSACTION_LIMIT -
        automaticTransactionCount
    );

  /*
  |--------------------------------------------------------------------------
  | Current Period
  |--------------------------------------------------------------------------
  */

  const period = periods.find(
    (item) =>
      item.key ===
      selectedPeriod
  ) ?? periods[2];

  const periodRange =
    useMemo(
      () =>
        getPeriodRange(
          selectedPeriod
        ),
      [selectedPeriod]
    );

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categoryOptions =
    useMemo(() => {
      const values =
        transactions
          .filter(
            (transaction) =>
              transaction.currency ===
              selectedCurrency
          )
          .map(
            (transaction) =>
              transaction.category
          )
          .filter(Boolean);

      return [
        'All categories',
        ...Array.from(
          new Set(values)
        ).sort(),
      ];
    }, [
      selectedCurrency,
      transactions,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Accounts
  |--------------------------------------------------------------------------
  */

  const accountOptions =
    useMemo(() => {
      return [
        'All accounts',
        ...accounts
          .filter(
            (account) =>
              account.currency ===
              selectedCurrency
          )
          .map(
            (account) =>
              account.name
          ),
      ];
    }, [
      accounts,
      selectedCurrency,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Filtered Transactions
  |--------------------------------------------------------------------------
  */

  const filteredTransactions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return transactions.filter(
        (transaction) => {
          if (
            transaction.currency !==
            selectedCurrency
          ) {
            return false;
          }

          if (
            transaction.date <
              periodRange.start ||
            transaction.date >
              periodRange.end
          ) {
            return false;
          }

          if (
            selectedCategory !==
              'All categories' &&
            transaction.category !==
              selectedCategory
          ) {
            return false;
          }

          if (
            selectedAccount !==
              'All accounts' &&
            transaction.accountLabel !==
              selectedAccount
          ) {
            return false;
          }

          if (
            normalizedSearch
          ) {
            const searchable =
              [
                transaction.description,
                transaction.category,
                transaction.reference,
                transaction.accountLabel,
                transaction.id,
                transaction.source,
              ]
                .join(' ')
                .toLowerCase();

            if (
              !searchable.includes(
                normalizedSearch
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      periodRange.end,
      periodRange.start,
      search,
      selectedAccount,
      selectedCategory,
      selectedCurrency,
      transactions,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const totalMoneyIn =
    useMemo(
      () =>
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
          ),
      [filteredTransactions]
    );

  const totalMoneyOut =
    useMemo(
      () =>
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
          ),
      [filteredTransactions]
    );

  const netMovement =
    totalMoneyIn -
    totalMoneyOut;

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
        filteredTransactions,
        selectedPeriod,
      ]
    );

  const chartMax =
    Math.max(
      1,
      ...chartPoints.flatMap(
        (point) => [
          point.moneyIn,
          point.moneyOut,
        ]
      )
    );

  /*
  |--------------------------------------------------------------------------
  | Insights
  |--------------------------------------------------------------------------
  */

  const largestExpenseCategory =
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

      return (
        Array.from(
          totals.entries()
        ).sort(
          (a, b) =>
            b[1] - a[1]
        )[0] ?? null
      );
    }, [
      filteredTransactions,
    ]);

  const largestIncomeCategory =
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

      return (
        Array.from(
          totals.entries()
        ).sort(
          (a, b) =>
            b[1] - a[1]
        )[0] ?? null
      );
    }, [
      filteredTransactions,
    ]);

  let insightHeadline =
    'Start recording your business activity to see useful money insights.';

  let insightDescription =
    'As you record sales, expenses and other money movements, Monietar will help you understand what is happening with your money.';

  if (
    !loading &&
    filteredTransactions.length >
      0
  ) {
    if (
      netMovement > 0
    ) {
      insightHeadline =
        'More money came in than went out this period.';

      insightDescription =
        'You received more money than you spent during this period. Keep an eye on your spending as the period continues.';
    } else if (
      netMovement < 0
    ) {
      insightHeadline =
        'More money went out than came in this period.';

      insightDescription =
        'Take a look at your recent spending to see what is taking the most money out of your business.';
    } else {
      insightHeadline =
        'The money coming in and going out is about the same.';

      insightDescription =
        'Keep recording your business activity so Monietar can give you a clearer picture of your money.';
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Manual Transaction
  |--------------------------------------------------------------------------
  */

  function openAddTransaction() {
    setTransactionError(
      null
    );

    setTransactionType(
      'income'
    );

    setAmount('');
    setCategory('');
    setDescription('');
    setDate(
      getTodayInputValue()
    );
    setReference('');
    setNotes('');

    const defaultAccount =
      accounts.find(
        (account) =>
          account.currency ===
          selectedCurrency
      );

    if (defaultAccount) {
      setAccountId(
        defaultAccount.id
      );
      setCurrency(
        defaultAccount.currency
      );
    } else {
      setAccountId('');
      setCurrency(
        selectedCurrency
      );
    }

    setAddTransactionOpen(
      true
    );
  }

  function closeAddTransaction() {
    if (
      savingTransaction
    ) {
      return;
    }

    setAddTransactionOpen(
      false
    );

    setTransactionError(
      null
    );
  }

  async function handleAddTransaction(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setTransactionError(
      null
    );

    const parsedAmount =
      Number(amount);

    const trimmedCategory =
      category.trim();

    const trimmedDescription =
      description.trim();

    if (
      !Number.isFinite(
        parsedAmount
      ) ||
      parsedAmount <= 0
    ) {
      setTransactionError(
        'Please enter a valid transaction amount.'
      );
      return;
    }

    if (
      !trimmedCategory
    ) {
      setTransactionError(
        'Please select or enter a category.'
      );
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Description is mandatory
    |--------------------------------------------------------------------------
    */

    if (
      !trimmedDescription
    ) {
      setTransactionError(
        'Please enter a description for this transaction.'
      );
      return;
    }

    if (
      !date
    ) {
      setTransactionError(
        'Please select a transaction date.'
      );
      return;
    }

    if (
      !SUPPORTED_CURRENCIES.includes(
        currency
      )
    ) {
      setTransactionError(
        'Only NGN and XOF transactions are supported on Retail Starter.'
      );
      return;
    }

    const selectedAccount =
      accounts.find(
        (account) =>
          account.id ===
          accountId
      );

    if (
      selectedAccount &&
      selectedAccount.currency !==
        currency
    ) {
      setTransactionError(
        `The selected account uses ${selectedAccount.currency}. Please use the same currency for this transaction.`
      );
      return;
    }

    setSavingTransaction(
      true
    );

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setSavingTransaction(
        false
      );

      setTransactionError(
        'Your session has expired. Please sign in again.'
      );

      return;
    }

    const {
      error: insertError,
    } =
      await supabase
        .from('transactions')
        .insert({
          user_id:
            user.id,
          type:
            transactionType,
          amount:
            parsedAmount,
          amount_base:
            parsedAmount,
          currency:
            currency,
          exchange_rate:
            1,
          category:
            trimmedCategory,
          description:
            trimmedDescription,
          date,
          account_id:
            accountId ||
            null,
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

          /*
          |--------------------------------------------------------------------------
          | Manual entries are unlimited on Retail Starter.
          |--------------------------------------------------------------------------
          */

          source:
            'manual',
        });

    if (
      insertError
    ) {
      console.error(
        'Failed to add transaction:',
        insertError
      );

      setSavingTransaction(
        false
      );

      setTransactionError(
        insertError.message ||
          'Unable to add this transaction.'
      );

      return;
    }

    setSavingTransaction(
      false
    );

    setAddTransactionOpen(
      false
    );

    await loadTransactions();
  }

  /*
  |--------------------------------------------------------------------------
  | Bank Statement Modal
  |--------------------------------------------------------------------------
  */

  function openStatementModal() {
    setStatementError(
      null
    );
    setStatementFile(
      null
    );

    setStatementCurrency(
      selectedCurrency
    );
    setStatementAccountId(
      ''
    );

    setStatementModalOpen(
      true
    );
  }

  function closeStatementModal() {
    if (
      uploadingStatement
    ) {
      return;
    }

    setStatementModalOpen(
      false
    );

    setStatementFile(
      null
    );

    setStatementError(
      null
    );
  }

  async function handleStatementUpload() {
    setStatementError(
      null
    );

    if (!statementFile) {
      setStatementError(
        'Please choose a PDF or CSV bank statement.'
      );
      return;
    }

    const isPdf =
      statementFile.type ===
        'application/pdf' ||
      statementFile.name
        .toLowerCase()
        .endsWith('.pdf');

    const isCsv =
      statementFile.type ===
        'text/csv' ||
      statementFile.name
        .toLowerCase()
        .endsWith('.csv');

    if (!isPdf && !isCsv) {
      setStatementError(
        'Only PDF and CSV bank statements are supported.'
      );
      return;
    }

    setUploadingStatement(
      true
    );

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          'Your session has expired. Please sign in again.'
        );
      }

      const formData =
        new FormData();

      formData.append(
        'file',
        statementFile
      );

      formData.append(
        'account_id',
        statementAccountId
      );

      formData.append(
        'currency',
        statementCurrency
      );

      formData.append(
        'user_id',
        user.id
      );

      /*
      |--------------------------------------------------------------------------
      | Statement imports must be stored as:
      | source = statement_import
      |
      | They should NOT consume the Starter automatic bank-sync allowance.
      |--------------------------------------------------------------------------
      */

      formData.append(
        'source',
        'statement_import'
      );

      const response =
        await fetch(
          STATEMENT_IMPORT_ENDPOINT,
          {
            method: 'POST',
            body: formData,
          }
        );

      const result =
        await response
          .json()
          .catch(
            () => null
          );

      if (
        !response.ok
      ) {
        throw new Error(
          result?.error ||
            'Unable to import this bank statement.'
        );
      }

      setStatementModalOpen(
        false
      );

      setStatementFile(
        null
      );

      await loadTransactions();
    } catch (uploadError) {
      console.error(
        'Bank statement import failed:',
        uploadError
      );

      setStatementError(
        uploadError instanceof
          Error
          ? uploadError.message
          : 'Unable to import this bank statement.'
      );
    } finally {
      setUploadingStatement(
        false
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Currency
  |--------------------------------------------------------------------------
  */

  function handleCurrencyChange(
    nextCurrency: Currency
  ) {
    setSelectedCurrency(
      nextCurrency
    );

    setSelectedAccount(
      'All accounts'
    );

    setSelectedCategory(
      'All categories'
    );

    setSelectedTransactions(
      []
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Selection
  |--------------------------------------------------------------------------
  */

  function toggleTransaction(
    id: string
  ) {
    setSelectedTransactions(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [
              ...current,
              id,
            ]
    );
  }

  function toggleSelectAll() {
    const ids =
      filteredTransactions.map(
        (transaction) =>
          transaction.id
      );

    const allSelected =
      ids.length > 0 &&
      ids.every((id) =>
        selectedTransactions.includes(
          id
        )
      );

    if (allSelected) {
      setSelectedTransactions(
        (current) =>
          current.filter(
            (id) =>
              !ids.includes(id)
          )
      );
    } else {
      setSelectedTransactions(
        (current) =>
          Array.from(
            new Set([
              ...current,
              ...ids,
            ])
          )
      );
    }
  }

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
      filteredTransactions.filter(
        (transaction) =>
          selectedTransactions.includes(
            transaction.id
          )
      );

    if (
      selected.length === 0
    ) {
      return;
    }

    downloadCsv(selected);
  }

  const allVisibleSelected =
    filteredTransactions.length >
      0 &&
    filteredTransactions.every(
      (transaction) =>
        selectedTransactions.includes(
          transaction.id
        )
    );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-full bg-[#f1f1f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Page Header */}

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Money activity
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Transactions
              </h2>

              <span className="border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-emerald-900">
                {getPlanName(plan)}
              </span>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              See all the money coming into and going out of your business.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {/* Currency */}

            <div className="flex h-10 border border-gray-200 bg-white">
              {SUPPORTED_CURRENCIES.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      handleCurrencyChange(
                        item
                      )
                    }
                    className={`px-3 text-xs font-semibold transition-colors ${
                      selectedCurrency ===
                      item
                        ? 'bg-emerald-900 text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* Bank Statement */}

            <button
              type="button"
              onClick={
                openStatementModal
              }
              className="flex h-10 items-center gap-2 border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Upload
                size={15}
                strokeWidth={1.7}
              />
              <span className="hidden sm:inline">
                Add bank statement
              </span>
              <span className="sm:hidden">
                Statement
              </span>
            </button>

            {/* Add Transaction */}

            <button
              type="button"
              onClick={
                openAddTransaction
              }
              className="flex h-10 items-center gap-2 bg-emerald-900 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
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
                className="flex h-10 items-center gap-2 border border-gray-200 bg-white px-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                aria-expanded={
                  periodOpen
                }
                aria-haspopup="listbox"
              >
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />

                <span>
                  {period.label}
                </span>

                <ChevronDown
                  size={14}
                  strokeWidth={1.7}
                  className={`text-gray-400 transition-transform ${
                    periodOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              {periodOpen && (
                <div className="absolute right-0 z-30 mt-2 w-44 border border-gray-200 bg-white py-1 shadow-sm">
                  {periods.map(
                    (item) => (
                      <button
                        key={
                          item.key
                        }
                        type="button"
                        onClick={() => {
                          setSelectedPeriod(
                            item.key
                          );
                          setPeriodOpen(
                            false
                          );
                        }}
                        className={`flex w-full px-3 py-2.5 text-left text-xs transition-colors ${
                          selectedPeriod ===
                          item.key
                            ? 'bg-emerald-50 font-medium text-emerald-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {
                          item.label
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
                !canExport
              }
              className="flex h-10 items-center gap-2 border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              title={
                canExport
                  ? 'Export transactions'
                  : 'Available on Borderless Pro'
              }
            >
              {canExport ? (
                <Download
                  size={15}
                  strokeWidth={1.7}
                />
              ) : (
                <Lock
                  size={14}
                  strokeWidth={1.7}
                />
              )}

              <span className="hidden sm:inline">
                Export
              </span>
            </button>
          </div>
        </section>

        {/* Error */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs leading-5 text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Starter Usage */}

        {plan ===
          'retail-starter' && (
          <section className="mb-6 border border-gray-200 bg-white">
            <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-emerald-50 text-emerald-900">
                    <Wallet
                      size={15}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Starter bank activity
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Automatic bank transactions this month
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {automaticTransactionCount} of{' '}
                    {
                      STARTER_AUTOMATIC_TRANSACTION_LIMIT
                    }{' '}
                    used
                  </span>

                  <span className="text-xs font-medium text-emerald-900">
                    {
                      remainingAutomaticTransactions
                    }{' '}
                    left
                  </span>
                </div>

                <div className="h-1.5 w-full bg-gray-100">
                  <div
                    className="h-full bg-emerald-900 transition-all"
                    style={{
                      width: `${transactionUsage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] leading-4 text-gray-400">
                  Manual entries are unlimited. Bank statement imports do not use this allowance.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Summary */}

        <section className="mb-6 grid grid-cols-1 gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-4">
          <TransactionMetric
            label="Money in"
            value={
              loading
                ? '—'
                : formatCurrency(
                    totalMoneyIn,
                    selectedCurrency
                  )
            }
            description={`Total money received in ${selectedCurrency} during ${period.label.toLowerCase()}.`}
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
                    totalMoneyOut,
                    selectedCurrency
                  )
            }
            description={`Total money spent in ${selectedCurrency} during ${period.label.toLowerCase()}.`}
            icon={
              ArrowUpRight
            }
          />

          <TransactionMetric
            label="Money left"
            value={
              loading
                ? '—'
                : formatCurrency(
                    Math.abs(
                      netMovement
                    ),
                    selectedCurrency
                  )
            }
            description={
              netMovement >=
              0
                ? 'More money came in than went out.'
                : 'More money went out than came in.'
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
                : filteredTransactions.length.toLocaleString()
            }
            description={`Showing ${selectedCurrency} activity for ${period.label.toLowerCase()}.`}
            icon={
              BarChart3
            }
            neutral
          />
        </section>

        {/* Main Layout */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">

          {/* Left */}

          <div className="space-y-6">

            {/* Chart */}

            <section className="border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Money In &amp; Out
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedCurrency} movement for{' '}
                    {period.label.toLowerCase()}.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-emerald-900" />
                    Money in
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-gray-300" />
                    Money out
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {loading ? (
                  <div className="flex h-64 items-end gap-3">
                    {Array.from(
                      {
                        length: 8,
                      }
                    ).map(
                      (_, index) => (
                        <div
                          key={
                            index
                          }
                          className="flex-1 animate-pulse bg-gray-100"
                          style={{
                            height: `${30 + (index % 4) * 15}%`,
                          }}
                        />
                      )
                    )}
                  </div>
                ) : chartPoints.length ===
                  0 ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        No activity yet
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Add a transaction or import a bank statement.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 items-end gap-2 overflow-x-auto sm:gap-3">
                    {chartPoints.map(
                      (
                        point
                      ) => (
                        <div
                          key={
                            point.key
                          }
                          className="flex min-w-[42px] flex-1 flex-col items-center justify-end gap-2"
                        >
                          <div className="flex h-52 w-full items-end justify-center gap-1">
                            <div
                              className="w-1/2 max-w-5 bg-emerald-900 transition-all"
                              style={{
                                height: `${
                                  point.moneyIn /
                                  chartMax *
                                  100
                                }%`,
                                minHeight:
                                  point.moneyIn >
                                  0
                                    ? '3px'
                                    : '0',
                              }}
                              title={`Money in: ${formatCurrency(
                                point.moneyIn,
                                selectedCurrency
                              )}`}
                            />

                            <div
                              className="w-1/2 max-w-5 bg-gray-300 transition-all"
                              style={{
                                height: `${
                                  point.moneyOut /
                                  chartMax *
                                  100
                                }%`,
                                minHeight:
                                  point.moneyOut >
                                  0
                                    ? '3px'
                                    : '0',
                              }}
                              title={`Money out: ${formatCurrency(
                                point.moneyOut,
                                selectedCurrency
                              )}`}
                            />
                          </div>

                          <span className="whitespace-nowrap text-[9px] text-gray-400">
                            {
                              point.label
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Transactions */}

            <section className="border border-gray-200 bg-white">

              {/* Toolbar */}

              <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Transaction ledger
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {selectedCurrency} transactions for{' '}
                      {period.label.toLowerCase()}.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setFilterOpen(
                          (open) =>
                            !open
                        )
                      }
                      className={`flex h-9 items-center gap-2 border px-3 text-xs font-medium transition-colors ${
                        filterOpen
                          ? 'border-emerald-900 bg-emerald-50 text-emerald-900'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <SlidersHorizontal
                        size={14}
                        strokeWidth={
                          1.7
                        }
                      />
                      Filters
                    </button>

                    <div className="relative">
                      <Search
                        size={14}
                        strokeWidth={
                          1.7
                        }
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="search"
                        value={
                          search
                        }
                        onChange={(
                          event
                        ) =>
                          setSearch(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Search transactions..."
                        className="h-9 w-full border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-900 sm:w-64"
                      />
                    </div>
                  </div>
                </div>

                {filterOpen && (
                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">

                    <FilterSelect
                      label="Category"
                      value={
                        selectedCategory
                      }
                      options={
                        categoryOptions
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
                        accountOptions
                      }
                      onChange={
                        setSelectedAccount
                      }
                    />

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch(
                            ''
                          );
                          setSelectedCategory(
                            'All categories'
                          );
                          setSelectedAccount(
                            'All accounts'
                          );
                        }}
                        className="h-9 w-full border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}

                {selectedTransactions.length >
                  0 && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-500">
                      {
                        selectedTransactions.length
                      }{' '}
                      selected
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleExportSelected
                      }
                      disabled={
                        !canExport
                      }
                      className="flex h-8 items-center justify-center gap-2 border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {canExport ? (
                        <Download
                          size={
                            13
                          }
                        />
                      ) : (
                        <Lock
                          size={
                            13
                          }
                        />
                      )}
                      Export selected
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="w-12 px-5 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            allVisibleSelected
                          }
                          onChange={
                            toggleSelectAll
                          }
                          className="h-3.5 w-3.5 accent-emerald-900"
                          aria-label="Select all visible transactions"
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
                    {loading ? (
                      Array.from(
                        {
                          length: 6,
                        }
                      ).map(
                        (
                          _,
                          index
                        ) => (
                          <tr
                            key={
                              index
                            }
                          >
                            <td className="px-5 py-4">
                              <div className="h-3 w-3 animate-pulse bg-gray-100" />
                            </td>

                            <td className="px-3 py-4">
                              <div className="h-4 w-40 animate-pulse bg-gray-100" />
                              <div className="mt-2 h-2.5 w-24 animate-pulse bg-gray-100" />
                            </td>

                            <td className="px-3 py-4">
                              <div className="h-4 w-20 animate-pulse bg-gray-100" />
                            </td>

                            <td className="px-3 py-4">
                              <div className="h-4 w-24 animate-pulse bg-gray-100" />
                            </td>

                            <td className="px-3 py-4 text-right">
                              <div className="ml-auto h-4 w-24 animate-pulse bg-gray-100" />
                            </td>
                          </tr>
                        )
                      )
                    ) : filteredTransactions.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={
                            5
                          }
                        >
                          <div className="px-5 py-16 text-center">
                            <EmptyTransactions
                              onAdd={
                                openAddTransaction
                              }
                              onImport={
                                openStatementModal
                              }
                            />
                          </div>
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
                            <td className="px-5 py-4">
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
                                  <p className="max-w-[260px] truncate text-sm font-medium text-gray-900">
                                    {
                                      transaction.description
                                    }
                                  </p>

                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] text-gray-400">
                                      {
                                        transaction.reference
                                      }
                                    </span>

                                    <span className="text-[10px] text-gray-300">
                                      •
                                    </span>

                                    <span className="text-[10px] text-gray-400">
                                      {
                                        transaction.source ===
                                        'manual'
                                          ? 'Manual'
                                          : transaction.source ===
                                              'statement_import'
                                            ? 'Statement import'
                                            : transaction.source ===
                                                'bank_sync'
                                              ? 'Bank sync'
                                              : transaction.source
                                      }
                                    </span>

                                    <span className="text-[10px] text-gray-300">
                                      •
                                    </span>

                                    <span className="text-[10px] text-gray-400">
                                      {formatTransactionDate(
                                        transaction.date
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-4">
                              <span className="inline-flex bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600">
                                {
                                  transaction.category
                                }
                              </span>
                            </td>

                            <td className="px-3 py-4">
                              <span className="text-xs text-gray-500">
                                {
                                  transaction.accountLabel
                                }
                              </span>
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
                                {
                                  formatCurrency(
                                    transaction.amount,
                                    transaction.currency
                                  )
                                }
                              </p>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}

              <div className="divide-y divide-gray-100 md:hidden">
                {loading ? (
                  Array.from(
                    {
                      length: 5,
                    }
                  ).map(
                    (
                      _,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="px-5 py-5"
                      >
                        <div className="h-4 w-44 animate-pulse bg-gray-100" />
                        <div className="mt-3 h-3 w-28 animate-pulse bg-gray-100" />
                      </div>
                    )
                  )
                ) : filteredTransactions.length ===
                  0 ? (
                  <div className="px-5 py-16 text-center">
                    <EmptyTransactions
                      onAdd={
                        openAddTransaction
                      }
                      onImport={
                        openStatementModal
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
                            {
                              formatCurrency(
                                transaction.amount,
                                transaction.currency
                              )
                            }
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between pl-[84px]">
                          <span className="truncate text-[10px] text-gray-400">
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

              {/* Footer */}

              <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-[10px] text-gray-400">
                  Showing{' '}
                  {
                    filteredTransactions.length
                  }{' '}
                  of{' '}
                  {
                    transactions.filter(
                      (
                        transaction
                      ) =>
                        transaction.currency ===
                        selectedCurrency
                    ).length
                  }{' '}
                  {selectedCurrency}{' '}
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
                    {
                      formatCurrency(
                        Math.abs(
                          netMovement
                        ),
                        selectedCurrency
                      )
                    }
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}

          <div className="space-y-6">

            {/* Insight */}

            <section className="border border-gray-200 bg-emerald-900 text-white">
              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Monietar Insight
                    </p>

                    <p className="mt-1 text-xs text-emerald-200">
                      Based on your money activity
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                    <Zap
                      size={17}
                      strokeWidth={
                        1.7
                      }
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
                      largestExpenseCategory[1],
                      selectedCurrency
                    )}.`}

                  {!largestExpenseCategory &&
                    largestIncomeCategory &&
                    ` ${largestIncomeCategory[0]} brought in the most money during this period, at ${formatCurrency(
                      largestIncomeCategory[1],
                      selectedCurrency
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
                      {
                        formatCurrency(
                          Math.abs(
                            netMovement
                          ),
                          selectedCurrency
                        )
                      }
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Money Movement */}

            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">
                  Money In &amp; Out
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  See how much money came in and went out.
                </p>
              </div>

              <div className="p-5">
                <MovementRow
                  icon={
                    ArrowDownRight
                  }
                  label="Money in"
                  value={formatCurrency(
                    totalMoneyIn,
                    selectedCurrency
                  )}
                  percentage={
                    totalMoneyIn >
                    0
                      ? 100
                      : 0
                  }
                  positive
                />

                <MovementRow
                  icon={
                    ArrowUpRight
                  }
                  label="Money out"
                  value={formatCurrency(
                    totalMoneyOut,
                    selectedCurrency
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

                    <span
                      className={`text-sm font-semibold ${
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
                      {
                        formatCurrency(
                          Math.abs(
                            netMovement
                          ),
                          selectedCurrency
                        )
                      }
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
                        Add money in or money out
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    strokeWidth={
                      1.7
                    }
                    className="text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  onClick={
                    openStatementModal
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-gray-50 text-gray-500">
                      <FileText
                        size={15}
                        strokeWidth={
                          1.7
                        }
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Add bank statement
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Import a PDF or CSV statement
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    strokeWidth={
                      1.7
                    }
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
                        View your connected accounts
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    strokeWidth={
                      1.7
                    }
                    className="text-gray-400"
                  />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Add Transaction Modal */}
      {/* ================================================================== */}

      {addTransactionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              !savingTransaction
            ) {
              closeAddTransaction();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto border border-gray-200 bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Add transaction
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Record money coming in or going out of your business.
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
                        : 'CFA'}
                    </div>

                    <input
                      type="number"
                      min="0"
                      step={
                        currency ===
                        'XOF'
                          ? '1'
                          : '0.01'
                      }
                      inputMode="decimal"
                      value={
                        amount
                      }
                      onChange={(
                        event
                      ) =>
                        setAmount(
                          event
                            .target
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
                      <span className="ml-1 text-red-500">
                        *
                      </span>
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
                          event
                            .target
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
                        (
                          item
                        ) => (
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
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </span>

                    <input
                      type="date"
                      value={
                        date
                      }
                      onChange={(
                        event
                      ) =>
                        setDate(
                          event
                            .target
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
                        ) => {
                          const nextCurrency =
                            event
                              .target
                              .value as Currency;

                          setCurrency(
                            nextCurrency
                          );

                          const matchingAccount =
                            accounts.find(
                              (
                                account
                              ) =>
                                account.currency ===
                                nextCurrency
                            );

                          if (
                            matchingAccount
                          ) {
                            setAccountId(
                              matchingAccount.id
                            );
                          } else {
                            setAccountId(
                              ''
                            );
                          }
                        }}
                        className="h-10 w-full appearance-none border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-900 outline-none focus:border-emerald-900"
                      >
                        <option value="NGN">
                          NGN — Nigerian Naira
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

                        {accounts
                          .filter(
                            (
                              account
                            ) =>
                              account.currency ===
                              currency
                          )
                          .map(
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

                {/* Description - REQUIRED */}

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Description
                    <span className="ml-1 text-red-500">
                      *
                    </span>
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
                        event
                          .target
                          .value
                      )
                    }
                    placeholder={
                      transactionType ===
                      'income'
                        ? 'e.g. Customer payment'
                        : 'e.g. Stock purchase'
                    }
                    required
                    className="h-10 w-full border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-900"
                  />

                  <p className="mt-1.5 text-[10px] text-gray-400">
                    A clear description helps you understand this transaction later.
                  </p>
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
                        event
                          .target
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
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Add any extra details..."
                    rows={
                      3
                    }
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

              {/* Footer */}

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
                        size={
                          15
                        }
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={
                          15
                        }
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

      {/* ================================================================== */}
      {/* Bank Statement Modal */}
      {/* ================================================================== */}

      {statementModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              !uploadingStatement
            ) {
              closeStatementModal();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto border border-gray-200 bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-emerald-50 text-emerald-900">
                    <FileText
                      size={16}
                      strokeWidth={
                        1.7
                      }
                    />
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    Add bank statement
                  </p>
                </div>

                <p className="mt-2 max-w-md text-xs leading-5 text-gray-400">
                  Upload a PDF or CSV bank statement and Monietar will prepare the transactions for your records.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeStatementModal
                }
                disabled={
                  uploadingStatement
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

            <div className="space-y-5 px-5 py-6 sm:px-6">

              {/* File Upload */}

              <div>
                <label
                  htmlFor="bank-statement-file"
                  className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    statementFile
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center bg-white text-emerald-900 shadow-sm">
                    <Upload
                      size={19}
                      strokeWidth={
                        1.7
                      }
                    />
                  </div>

                  {statementFile ? (
                    <>
                      <p className="mt-4 max-w-full truncate text-sm font-medium text-gray-900">
                        {
                          statementFile.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {(
                          statementFile.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )}{' '}
                        MB
                      </p>

                      <span className="mt-3 text-xs font-medium text-emerald-900">
                        Choose another file
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="mt-4 text-sm font-medium text-gray-900">
                        Upload your bank statement
                      </p>

                      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                        Select a PDF or CSV statement from your bank.
                      </p>

                      <span className="mt-4 bg-emerald-900 px-4 py-2 text-xs font-medium text-white">
                        Choose file
                      </span>
                    </>
                  )}
                </label>

                <input
                  id="bank-statement-file"
                  type="file"
                  accept=".pdf,.csv,application/pdf,text/csv"
                  className="sr-only"
                  onChange={(
                    event
                  ) => {
                    const file =
                      event
                        .target
                        .files?.[0] ??
                      null;

                    setStatementError(
                      null
                    );

                    if (
                      !file
                    ) {
                      setStatementFile(
                        null
                      );
                      return;
                    }

                    const isPdf =
                      file.type ===
                        'application/pdf' ||
                      file.name
                        .toLowerCase()
                        .endsWith(
                          '.pdf'
                        );

                    const isCsv =
                      file.type ===
                        'text/csv' ||
                      file.name
                        .toLowerCase()
                        .endsWith(
                          '.csv'
                        );

                    if (
                      !isPdf &&
                      !isCsv
                    ) {
                      setStatementFile(
                        null
                      );

                      setStatementError(
                        'Please upload a PDF or CSV bank statement.'
                      );

                      return;
                    }

                    setStatementFile(
                      file
                    );
                  }}
                />

                <p className="mt-2 text-[10px] text-gray-400">
                  Supported formats: PDF and CSV.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                    Statement currency
                  </span>

                  <div className="relative">
                    <select
                      value={
                        statementCurrency
                      }
                      onChange={(
                        event
                      ) => {
                        const nextCurrency =
                          event
                            .target
                            .value as Currency;

                        setStatementCurrency(
                          nextCurrency
                        );
                        setStatementAccountId(
                          ''
                        );
                      }}
                      className="h-10 w-full appearance-none border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-900 outline-none focus:border-emerald-900"
                    >
                      <option value="NGN">
                        NGN — Nigerian Naira
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
              </div>

              {/* Starter Information */}

              <div className="border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <FileText
                    size={15}
                    strokeWidth={
                      1.7
                    }
                    className="mt-0.5 shrink-0 text-emerald-900"
                  />

                  <div>
                    <p className="text-xs font-medium text-emerald-900">
                      Retail Starter
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-800">
                      Bank statement imports are included in your Starter plan. They do not use your 30 automatically logged bank transaction allowance.
                    </p>
                  </div>
                </div>
              </div>

              {statementError && (
                <div className="border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs leading-5 text-red-700">
                    {
                      statementError
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-[#fafafa] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={
                  closeStatementModal
                }
                disabled={
                  uploadingStatement
                }
                className="h-10 border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleStatementUpload
                }
                disabled={
                  uploadingStatement ||
                  !canSubmitStatement
                }
                className="flex h-10 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingStatement ? (
                  <>
                    <Loader2
                      size={
                        15
                      }
                      className="animate-spin"
                    />
                    Preparing statement...
                  </>
                ) : (
                  <>
                    <Upload
                      size={
                        15
                      }
                      strokeWidth={
                        1.8
                      }
                    />
                    Add statement
                  </>
                )}
              </button>
            </div>
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
  onImport,
}: {
  onAdd: () => void;
  onImport: () => void;
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
        Try changing your search, period, currency, or filters.
      </p>

      <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={
            onAdd
          }
          className="mx-auto flex h-9 items-center gap-2 bg-emerald-900 px-3 text-xs font-medium text-white transition-colors hover:bg-emerald-800"
        >
          <Plus
            size={13}
            strokeWidth={
              1.8
            }
          />
          Add transaction
        </button>

        <button
          type="button"
          onClick={
            onImport
          }
          className="mx-auto flex h-9 items-center gap-2 border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Upload
            size={13}
            strokeWidth={
              1.8
            }
          />
          Add bank statement
        </button>
      </div>
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
            strokeWidth={
              1.7
            }
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
          value={
            value
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          className="h-9 w-full appearance-none border border-gray-200 bg-white px-3 pr-8 text-xs text-gray-700 outline-none focus:border-emerald-900"
        >
          {options.map(
            (
              option
            ) => (
              <option
                key={
                  option
                }
                value={
                  option
                }
              >
                {
                  option
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
            strokeWidth={
              1.7
            }
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