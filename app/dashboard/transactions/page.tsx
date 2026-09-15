'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  Zap,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  description: string;
  category: string;
  source: string;
  amount: number;
  type: TransactionType;
  date: string;
  account: string;
  reference: string;
};

/*
|--------------------------------------------------------------------------
| Temporary Transaction Data
|--------------------------------------------------------------------------
|
| Temporary UI data only.
| Replace with Supabase transaction data later.
|
*/

const transactions: Transaction[] = [
  {
    id: 'TXN-001',
    description: 'Customer payment',
    category: 'Sales',
    source: 'Bank transfer',
    amount: 85000,
    type: 'income',
    date: 'Today, 10:42 AM',
    account: 'GTBank',
    reference: 'GTB-829104',
  },
  {
    id: 'TXN-002',
    description: 'Inventory purchase',
    category: 'Inventory',
    source: 'Bank transfer',
    amount: 42000,
    type: 'expense',
    date: 'Today, 9:18 AM',
    account: 'GTBank',
    reference: 'GTB-829031',
  },
  {
    id: 'TXN-003',
    description: 'Customer payment',
    category: 'Sales',
    source: 'Cash',
    amount: 27500,
    type: 'income',
    date: 'Yesterday, 4:32 PM',
    account: 'Cash Vault',
    reference: 'CASH-00182',
  },
  {
    id: 'TXN-004',
    description: 'Shop supplies',
    category: 'Operations',
    source: 'Bank transfer',
    amount: 12500,
    type: 'expense',
    date: 'Yesterday, 1:06 PM',
    account: 'GTBank',
    reference: 'GTB-828721',
  },
  {
    id: 'TXN-005',
    description: 'Customer payment',
    category: 'Sales',
    source: 'Bank transfer',
    amount: 120000,
    type: 'income',
    date: 'Sep 13, 3:24 PM',
    account: 'GTBank',
    reference: 'GTB-828401',
  },
  {
    id: 'TXN-006',
    description: 'Stock purchase',
    category: 'Inventory',
    source: 'Bank transfer',
    amount: 67500,
    type: 'expense',
    date: 'Sep 13, 11:42 AM',
    account: 'GTBank',
    reference: 'GTB-828112',
  },
  {
    id: 'TXN-007',
    description: 'Customer payment',
    category: 'Sales',
    source: 'Cash',
    amount: 45000,
    type: 'income',
    date: 'Sep 12, 5:18 PM',
    account: 'Cash Vault',
    reference: 'CASH-00177',
  },
  {
    id: 'TXN-008',
    description: 'Transport expense',
    category: 'Operations',
    source: 'Cash',
    amount: 8500,
    type: 'expense',
    date: 'Sep 12, 2:15 PM',
    account: 'Cash Vault',
    reference: 'CASH-00175',
  },
  {
    id: 'TXN-009',
    description: 'Customer payment',
    category: 'Sales',
    source: 'Bank transfer',
    amount: 93500,
    type: 'income',
    date: 'Sep 11, 1:08 PM',
    account: 'GTBank',
    reference: 'GTB-827540',
  },
  {
    id: 'TXN-010',
    description: 'Packaging materials',
    category: 'Operations',
    source: 'Bank transfer',
    amount: 18000,
    type: 'expense',
    date: 'Sep 11, 10:24 AM',
    account: 'GTBank',
    reference: 'GTB-827421',
  },
];

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const categories = [
  'All categories',
  'Sales',
  'Inventory',
  'Operations',
];

const sources = [
  'All sources',
  'Bank transfer',
  'Cash',
];

const accounts = [
  'All accounts',
  'GTBank',
  'Cash Vault',
];

const periods = [
  'This month',
  'Today',
  'This week',
  'Last month',
];

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

function formatPercentage(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function TransactionsPage() {
  const [search, setSearch] = useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('All categories');

  const [selectedSource, setSelectedSource] =
    useState('All sources');

  const [selectedAccount, setSelectedAccount] =
    useState('All accounts');

  const [selectedPeriod, setSelectedPeriod] =
    useState('This month');

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [selectedTransactions, setSelectedTransactions] =
    useState<string[]>([]);

  /*
  |--------------------------------------------------------------------------
  | Filtered Transactions
  |--------------------------------------------------------------------------
  */

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
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
          .includes(query);

      const matchesCategory =
        selectedCategory === 'All categories' ||
        transaction.category === selectedCategory;

      const matchesSource =
        selectedSource === 'All sources' ||
        transaction.source === selectedSource;

      const matchesAccount =
        selectedAccount === 'All accounts' ||
        transaction.account === selectedAccount;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSource &&
        matchesAccount
      );
    });
  }, [
    search,
    selectedCategory,
    selectedSource,
    selectedAccount,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const totalMoneyIn = filteredTransactions
    .filter(
      (transaction) => transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const totalMoneyOut = filteredTransactions
    .filter(
      (transaction) => transaction.type === 'expense'
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
    filteredTransactions.every((transaction) =>
      selectedTransactions.includes(transaction.id)
    );

  function toggleTransaction(id: string) {
    setSelectedTransactions((current) =>
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
      setSelectedTransactions((current) =>
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

    setSelectedTransactions((current) => [
      ...new Set([
        ...current,
        ...filteredTransactions.map(
          (transaction) => transaction.id
        ),
      ]),
    ]);
  }

  function clearFilters() {
    setSearch('');
    setSelectedCategory('All categories');
    setSelectedSource('All sources');
    setSelectedAccount('All accounts');
  }

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'All categories' ||
    selectedSource !== 'All sources' ||
    selectedAccount !== 'All accounts';

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
              Every movement of money, recorded in
              one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setPeriodOpen((open) => !open)
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

                <span>{selectedPeriod}</span>

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
                  {periods.map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(period);
                        setPeriodOpen(false);
                      }}
                      className={`
                        flex w-full items-center
                        px-3 py-2.5
                        text-left text-sm
                        transition-colors
                        ${
                          selectedPeriod === period
                            ? 'bg-emerald-50 text-emerald-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="
                flex h-10 items-center gap-2
                border border-gray-200
                bg-white
                px-3
                text-sm font-medium
                text-gray-700
                transition-colors
                hover:bg-gray-50
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
        {/* Summary */}
        {/* -------------------------------------------------------------- */}

        <section className="grid grid-cols-1 gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-4">
          <TransactionMetric
            label="Money in"
            value={formatCurrency(totalMoneyIn)}
            description="Recorded inflows"
            icon={ArrowDownRight}
            positive
          />

          <TransactionMetric
            label="Money out"
            value={formatCurrency(totalMoneyOut)}
            description="Recorded outflows"
            icon={ArrowUpRight}
          />

          <TransactionMetric
            label="Net movement"
            value={formatCurrency(
              Math.abs(netMovement)
            )}
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
            positive={netMovement >= 0}
          />

          <TransactionMetric
            label="Transactions"
            value={transactionCount.toString()}
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
                    Review and manage recorded money
                    movement.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen((open) => !open)
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
                      1
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
                    setSearch(event.target.value)
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
                    onClick={() => setSearch('')}
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
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                  <FilterSelect
                    label="Category"
                    value={selectedCategory}
                    options={categories}
                    onChange={setSelectedCategory}
                  />

                  <FilterSelect
                    label="Source"
                    value={selectedSource}
                    options={sources}
                    onChange={setSelectedSource}
                  />

                  <FilterSelect
                    label="Account"
                    value={selectedAccount}
                    options={accounts}
                    onChange={setSelectedAccount}
                  />
                </div>
              )}

              {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-[10px] text-gray-400">
                    Filters are currently active.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[10px] font-medium text-emerald-900 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedTransactions.length > 0 && (
              <div className="flex items-center justify-between border-b border-gray-200 bg-emerald-50 px-5 py-3 sm:px-6">
                <p className="text-xs font-medium text-emerald-900">
                  {selectedTransactions.length}{' '}
                  selected
                </p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="text-[10px] font-medium text-emerald-900 hover:underline"
                  >
                    Export selected
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTransactions([])
                    }
                    className="text-[10px] text-gray-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#fafafa]">
                    <th className="w-10 px-5 py-3 text-left sm:px-6">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
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
                          Try changing your search or
                          filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(
                      (transaction) => (
                        <tr
                          key={transaction.id}
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
                                    size={16}
                                    strokeWidth={1.7}
                                  />
                                ) : (
                                  <ArrowUpRight
                                    size={16}
                                    strokeWidth={1.7}
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
                                  {transaction.date}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <div>
                              <p className="text-xs text-gray-700">
                                {
                                  transaction.category
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-gray-400">
                                {transaction.source}
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <p className="text-xs text-gray-700">
                              {transaction.account}
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
                                transaction.amount
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
                    Try changing your search or
                    filters.
                  </p>
                </div>
              ) : (
                filteredTransactions.map(
                  (transaction) => (
                    <div
                      key={transaction.id}
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
                                size={16}
                                strokeWidth={1.7}
                              />
                            ) : (
                              <ArrowUpRight
                                size={16}
                                strokeWidth={1.7}
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
                              {transaction.source}
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
                            transaction.amount
                          )}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pl-[84px]">
                        <span className="text-[10px] text-gray-400">
                          {transaction.account}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          {transaction.date}
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
                Showing {filteredTransactions.length}{' '}
                of {transactions.length} transactions
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
                  {netMovement >= 0 ? '+' : '-'}
                  {formatCurrency(
                    Math.abs(netMovement)
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
                      From your transaction activity
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
                  Sales are currently driving most
                  of your recorded inflows.
                </p>

                <p className="mt-4 text-sm leading-6 text-emerald-100">
                  Inventory purchases remain your
                  largest recurring outflow category.
                  Keep an eye on purchase timing so
                  inventory spending does not put
                  unnecessary pressure on available
                  cash.
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-200">
                      Net movement
                    </span>

                    <span className="text-sm font-semibold">
                      {netMovement >= 0 ? '+' : '-'}
                      {formatCurrency(
                        Math.abs(netMovement)
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
                  Where your recorded money is moving.
                </p>
              </div>

              <div className="p-5">
                <MovementRow
                  icon={ArrowDownRight}
                  label="Money in"
                  value={formatCurrency(totalMoneyIn)}
                  percentage={100}
                  positive
                />

                <MovementRow
                  icon={ArrowUpRight}
                  label="Money out"
                  value={formatCurrency(totalMoneyOut)}
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
                      Balance after movement
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        Math.abs(netMovement)
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
                  Keep your books up to date.
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
                        Record transaction
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Add a manual entry
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
                        Manage accounts
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        View connected accounts
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
  icon: typeof ArrowDownRight;
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
            onChange(event.target.value)
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
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
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
  icon: typeof ArrowDownRight;
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
              Math.max(0, percentage)
            )}%`,
          }}
        />
      </div>
    </div>
  );
}
