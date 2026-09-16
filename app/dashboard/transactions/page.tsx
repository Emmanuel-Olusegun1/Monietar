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

type PeriodKey =
  | 'today'
  | 'this-week'
  | 'this-month'
  | 'last-month'
  | 'this-year'
  | 'all-time';

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
  accountId: string | null;
  accountLabel: string;
  reference: string;
  currency: string;
};

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

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
  {
    key: 'all-time',
    label: 'All time',
  },
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

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

function toNumber(value: number | string | null) {
  if (value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
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

  /*
   * Monday = first day of week.
   */
  const difference = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - difference);

  return result;
}

function endOfWeek(date: Date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);

  return endOfDay(result);
}

function startOfMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
}

function endOfMonth(date: Date) {
  return endOfDay(
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    )
  );
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return endOfDay(
    new Date(date.getFullYear(), 11, 31)
  );
}

function getPeriodRange(period: PeriodKey) {
  const now = new Date();

  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };

    case 'this-week':
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };

    case 'this-month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };

    case 'last-month': {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      );

      return {
        start,
        end: endOfDay(end),
      };
    }

    case 'this-year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };

    case 'all-time':
      return {
        start: null,
        end: null,
      };
  }
}

function formatTransactionDate(
  date: string
) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTransactionTime(
  createdAt: string | null
) {
  if (!createdAt) {
    return '';
  }

  const parsed = new Date(createdAt);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getTransactionAmount(
  transaction: TransactionRow
) {
  /*
   * amount is the original transaction amount.
   * amount_base is the converted/base amount where available.
   *
   * The transaction page displays the transaction's
   * actual currency amount.
   */
  return toNumber(transaction.amount);
}

function getAccountLabel(
  accountId: string | null
) {
  if (!accountId) {
    return 'Unassigned account';
  }

  /*
   * The current transaction schema only gives us
   * account_id. We don't assume an account name because
   * the accounts table/schema has not been provided yet.
   */
  return `Account ${accountId.slice(0, 8)}`;
}

function getTransactionReference(
  transaction: TransactionRow
) {
  if (transaction.reference) {
    return transaction.reference;
  }

  return transaction.id.slice(0, 8).toUpperCase();
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
      transaction.category || 'Uncategorized',
    amount: getTransactionAmount(transaction),
    type:
      transaction.type === 'expense'
        ? 'expense'
        : 'income',
    date: transaction.date,
    accountId: transaction.account_id,
    accountLabel: getAccountLabel(
      transaction.account_id
    ),
    reference: getTransactionReference(
      transaction
    ),
    currency: transaction.currency || 'NGN',
  };
}

function getDateValue(
  date: string
) {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.getTime();
}

function downloadCsv(
  transactions: Transaction[]
) {
  if (transactions.length === 0) {
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
          const stringValue = String(value ?? '');

          return `"${stringValue.replace(
            /"/g,
            '""'
          )}"`;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = `monietar-transactions-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

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
  const supabase = createClient();

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

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
  ] = useState<PeriodKey>('this-month');

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [
    selectedTransactions,
    setSelectedTransactions,
  ] = useState<string[]>([]);

  /*
  |--------------------------------------------------------------------------
  | Load Transactions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadTransactions() {
      try {
        setLoading(true);
        setError(null);

        const {
          data: {
            user,
          },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          throw new Error(
            'You must be signed in to view your transactions.'
          );
        }

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
              notes
            `
          )
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .eq('status', 'completed')
          .order('date', {
            ascending: false,
          })
          .order('created_at', {
            ascending: false,
          });

        if (transactionError) {
          throw transactionError;
        }

        if (!mounted) {
          return;
        }

        const normalized =
          ((data ?? []) as TransactionRow[]).map(
            normalizeTransaction
          );

        setTransactions(normalized);
      } catch (err) {
        console.error(
          'Failed to load transactions:',
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your transactions.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /*
  |--------------------------------------------------------------------------
  | Period
  |--------------------------------------------------------------------------
  */

  const periodLabel =
    periods.find(
      (period) =>
        period.key === selectedPeriod
    )?.label ?? 'This month';

  /*
  |--------------------------------------------------------------------------
  | Filter Options
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
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

  const accounts = useMemo(() => {
    const uniqueAccounts = Array.from(
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

  const filteredTransactions = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    const {
      start,
      end,
    } = getPeriodRange(selectedPeriod);

    return transactions.filter(
      (transaction) => {
        const transactionDate =
          getDateValue(transaction.date);

        const matchesPeriod =
          (!start ||
            transactionDate >=
              start.getTime()) &&
          (!end ||
            transactionDate <=
              end.getTime());

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
  | Summary
  |--------------------------------------------------------------------------
  */

  const totalMoneyIn =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === 'income'
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  const totalMoneyOut =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  const netMovement =
    totalMoneyIn - totalMoneyOut;

  const transactionCount =
    filteredTransactions.length;

  /*
  |--------------------------------------------------------------------------
  | Selection
  |--------------------------------------------------------------------------
  */

  const allVisibleSelected =
    filteredTransactions.length > 0 &&
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
              (transactionId) =>
                transactionId !== id
            )
          : [...current, id]
    );
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedTransactions(
        (current) =>
          current.filter(
            (id) =>
              !filteredTransactions.some(
                (transaction) =>
                  transaction.id === id
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
            (transaction) =>
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
    downloadCsv(filteredTransactions);
  }

  function handleExportSelected() {
    const selected = transactions.filter(
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

  const categoryTotals = useMemo(() => {
    const totals = new Map<
      string,
      number
    >();

    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .forEach((transaction) => {
        totals.set(
          transaction.category,
          (totals.get(
            transaction.category
          ) ?? 0) + transaction.amount
        );
      });

    return Array.from(
      totals.entries()
    ).sort(
      (a, b) => b[1] - a[1]
    );
  }, [filteredTransactions]);

  const largestExpenseCategory =
    categoryTotals[0];

  const incomeCategories = useMemo(() => {
    const totals = new Map<
      string,
      number
    >();

    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === 'income'
      )
      .forEach((transaction) => {
        totals.set(
          transaction.category,
          (totals.get(
            transaction.category
          ) ?? 0) + transaction.amount
        );
      });

    return Array.from(
      totals.entries()
    ).sort(
      (a, b) => b[1] - a[1]
    );
  }, [filteredTransactions]);

  const largestIncomeCategory =
    incomeCategories[0];

  const insightHeadline =
    transactionCount === 0
      ? 'No recorded activity for this period.'
      : netMovement > 0
        ? 'Recorded inflows are ahead of outflows.'
        : netMovement < 0
          ? 'Recorded outflows are ahead of inflows.'
          : 'Recorded inflows and outflows are balanced.';

  const insightDescription =
    transactionCount === 0
      ? 'Once transactions are recorded, Monietar will use them to surface useful financial patterns here.'
      : largestIncomeCategory
        ? `${largestIncomeCategory[0]} is your largest recorded inflow category for this period.`
        : 'Monietar is analyzing your recorded transaction activity.';

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-full bg-[#f1f1f1] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* -------------------------------------------------------------- */}
        {/* Header */}
        {/* -------------------------------------------------------------- */}

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Financial activity
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Transactions
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Every movement of money,
              recorded in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setPeriodOpen(
                    (open) => !open
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
                        {period.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={
                filteredTransactions.length ===
                0
              }
              className="
                flex h-10 items-center gap-2
                border border-gray-200
                bg-white
                px-3
                text-sm font-medium
                text-gray-700
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Download
                size={15}
                strokeWidth={1.7}
              />

              Export
            </button>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Error */}
        {/* -------------------------------------------------------------- */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-800">
              Unable to load transactions
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Summary */}
        {/* -------------------------------------------------------------- */}

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
            description="Recorded inflows"
            icon={ArrowDownRight}
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
            description="Recorded outflows"
            icon={ArrowUpRight}
          />

          <TransactionMetric
            label="Net movement"
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
              netMovement >= 0
                ? 'Positive cash movement'
                : 'Negative cash movement'
            }
            icon={
              netMovement >= 0
                ? TrendingUp
                : TrendingDown
            }
            positive={
              netMovement >= 0
            }
          />

          <TransactionMetric
            label="Transactions"
            value={
              loading
                ? '—'
                : transactionCount.toString()
            }
            description="Recorded this period"
            icon={Receipt}
            neutral
          />
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Main Content */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.7fr)]">
          {/* ------------------------------------------------------------ */}
          {/* Transaction Ledger */}
          {/* ------------------------------------------------------------ */}

          <section className="min-w-0 border border-gray-200 bg-white">
            {/* Table Header */}

            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Transaction ledger
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Review and manage
                    recorded money
                    movement.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen(
                      (open) => !open
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
                      {[
                        search !== '',
                        selectedCategory !==
                          'All categories',
                        selectedAccount !==
                          'All accounts',
                      ].filter(
                        Boolean
                      ).length}
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
                  onChange={(event) =>
                    setSearch(
                      event.target.value
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
                    options={categories}
                    onChange={
                      setSelectedCategory
                    }
                  />

                  <FilterSelect
                    label="Account"
                    value={
                      selectedAccount
                    }
                    options={accounts}
                    onChange={
                      setSelectedAccount
                    }
                  />
                </div>
              )}

              {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-[10px] text-gray-400">
                    Filters are
                    currently active.
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
                    className="text-[10px] font-medium text-emerald-900 hover:underline"
                  >
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
                  Fetching your recorded
                  financial activity.
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
                            colSpan={5}
                            className="px-6 py-16 text-center"
                          >
                            <EmptyTransactions />
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
                                    className={`
                                      flex h-9 w-9 shrink-0
                                      items-center justify-center
                                      ${
                                        transaction.type ===
                                        'income'
                                          ? 'bg-emerald-50 text-emerald-900'
                                          : 'bg-gray-100 text-gray-500'
                                      }
                                    `}
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
                                      {formatTransactionTime(
                                        null
                                      ) &&
                                        ` · ${formatTransactionTime(null)}`}
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
                                  Recorded
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
                                  className={`
                                    text-sm font-semibold
                                    ${
                                      transaction.type ===
                                      'income'
                                        ? 'text-emerald-900'
                                        : 'text-gray-900'
                                    }
                                  `}
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
                      <EmptyTransactions />
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
                                className={`
                                  flex h-9 w-9 shrink-0
                                  items-center justify-center
                                  ${
                                    transaction.type ===
                                    'income'
                                      ? 'bg-emerald-50 text-emerald-900'
                                      : 'bg-gray-100 text-gray-500'
                                  }
                                `}
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
                              className={`
                                shrink-0 text-sm font-semibold
                                ${
                                  transaction.type ===
                                  'income'
                                    ? 'text-emerald-900'
                                    : 'text-gray-900'
                                }
                              `}
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
                of {transactions.length}{' '}
                transactions
              </p>

              <div className="flex items-center gap-4 text-[10px]">
                <span className="text-gray-400">
                  Net movement
                </span>

                <span
                  className={`font-semibold ${
                    netMovement >= 0
                      ? 'text-emerald-900'
                      : 'text-red-600'
                  }`}
                >
                  {netMovement >= 0
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

          {/* ------------------------------------------------------------ */}
          {/* Right Column */}
          {/* ------------------------------------------------------------ */}

          <div className="space-y-6">
            {/* AI / Monietar Insight */}

            <section className="border border-gray-200 bg-emerald-900 text-white">
              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Monietar Insight
                    </p>

                    <p className="mt-1 text-xs text-emerald-200">
                      From your transaction
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
                  {insightHeadline}
                </p>

                <p className="mt-4 text-sm leading-6 text-emerald-100">
                  {insightDescription}
                  {largestExpenseCategory &&
                    ` ${largestExpenseCategory[0]} is currently your largest recorded outflow category at ${formatCurrency(
                      largestExpenseCategory[1]
                    )}.`}
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-200">
                      Net movement
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
                  Money Movement
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Where your recorded
                  money is moving.
                </p>
              </div>

              <div className="p-5">
                <MovementRow
                  icon={ArrowDownRight}
                  label="Money in"
                  value={formatCurrency(
                    totalMoneyIn
                  )}
                  percentage={100}
                  positive
                />

                <MovementRow
                  icon={ArrowUpRight}
                  label="Money out"
                  value={formatCurrency(
                    totalMoneyOut
                  )}
                  percentage={
                    totalMoneyIn > 0
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
                      Balance after
                      movement
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
                  Keep your books up to
                  date.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-gray-50 text-gray-500">
                      <Receipt
                        size={15}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Record
                        transaction
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Add a manual
                        entry
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
                        strokeWidth={1.7}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Manage
                        accounts
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        View connected
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
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Empty Transactions
|--------------------------------------------------------------------------
*/

function EmptyTransactions() {
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
          className={`
            flex h-9 w-9 items-center justify-center
            ${
              positive
                ? 'bg-emerald-50 text-emerald-900'
                : neutral
                  ? 'bg-gray-50 text-gray-500'
                  : 'bg-gray-100 text-gray-500'
            }
          `}
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
  onChange: (value: string) => void;
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