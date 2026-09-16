'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  ChevronDown,
  Clock3,
  LockKeyhole,
  Plus,
  Receipt,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  user_id: string;
  business_id: string | null;
  account_id: string | null;
  type: TransactionType;
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

type PeriodKey =
  | 'This month'
  | 'Today'
  | 'This week'
  | 'Last month'
  | 'This year'
  | 'All time';

const periods: PeriodKey[] = [
  'This month',
  'Today',
  'This week',
  'Last month',
  'This year',
  'All time',
];

const formatCurrency = (
  amount: number,
  currency = 'NGN'
) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);

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

  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);

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

function getPeriodRange(period: PeriodKey) {
  const now = new Date();

  switch (period) {
    case 'Today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };

    case 'This week':
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };

    case 'This month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };

    case 'Last month': {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      );

      return { start, end };
    }

    case 'This year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };

    case 'All time':
      return {
        start: null,
        end: null,
      };
  }
}

function transactionDate(transaction: Transaction) {
  return new Date(`${transaction.date}T00:00:00`);
}

function isCompletedTransaction(
  transaction: Transaction
) {
  return (
    transaction.status === 'completed' &&
    transaction.is_deleted !== true
  );
}

function getIncome(transactions: Transaction[]) {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total +
        toNumber(
          transaction.amount_base ??
            transaction.amount
        ),
      0
    );
}

function getExpenses(transactions: Transaction[]) {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense'
    )
    .reduce(
      (total, transaction) =>
        total +
        toNumber(
          transaction.amount_base ??
            transaction.amount
        ),
      0
    );
}

function formatTransactionDate(
  transaction: Transaction
) {
  const date = transactionDate(transaction);

  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTransactionTime(
  transaction: Transaction
) {
  const date = new Date(
    transaction.created_at ??
      `${transaction.date}T00:00:00`
  );

  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function VaultMetric({
  label,
  value,
  detail,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Wallet;
  positive?: boolean;
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

        {positive !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              positive
                ? 'text-emerald-800'
                : 'text-red-700'
            }`}
          >
            {positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}

            {positive ? 'Inflow' : 'Outflow'}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {detail}
      </p>
    </div>
  );
}

function MovementRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const isIncome = transaction.type === 'income';

  const amount = toNumber(
    transaction.amount_base ??
      transaction.amount
  );

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
            isIncome
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          {isIncome ? (
            <ArrowDownRight
              size={16}
              className="text-emerald-800"
            />
          ) : (
            <ArrowUpRight
              size={16}
              className="text-red-700"
            />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {transaction.description ||
              transaction.category}
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span>{transaction.category}</span>

            <span>•</span>

            <span>
              {formatTransactionDate(
                transaction
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-semibold ${
            isIncome
              ? 'text-emerald-800'
              : 'text-red-700'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(
            amount,
            transaction.currency || 'NGN'
          )}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {formatTransactionTime(transaction)}
        </p>
      </div>
    </div>
  );
}

export default function CashVaultPage() {
  const supabase = createClient();

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodKey>('This month');

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  /*
   * ------------------------------------------------------------
   * Load real transaction data
   * ------------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadTransactions() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        if (mounted) {
          setError(
            'We could not verify your account.'
          );
          setLoading(false);
        }

        return;
      }

      if (!user) {
        if (mounted) {
          setError(
            'You need to be signed in to view your transactions.'
          );
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
          .order('date', {
            ascending: false,
          })
          .order('created_at', {
            ascending: false,
          });

      if (transactionError) {
        console.error(
          'Cash Vault transaction error:',
          transactionError
        );

        if (mounted) {
          setError(
            'We could not load your transaction activity.'
          );
          setLoading(false);
        }

        return;
      }

      if (mounted) {
        setTransactions(
          (data ?? []) as Transaction[]
        );
        setLoading(false);
      }
    }

    loadTransactions();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /*
   * ------------------------------------------------------------
   * Selected period
   * ------------------------------------------------------------
   */

  const periodTransactions = useMemo(() => {
    const { start, end } =
      getPeriodRange(selectedPeriod);

    return transactions.filter((transaction) => {
      const date = transactionDate(transaction);

      if (start && date < start) {
        return false;
      }

      if (end && date > end) {
        return false;
      }

      return true;
    });
  }, [transactions, selectedPeriod]);

  /*
   * ------------------------------------------------------------
   * Cash calculations
   *
   * NOTE:
   * The current transactions schema does not identify
   * physical cash separately from bank transactions.
   *
   * Until the account mapping is available, we do NOT
   * pretend that every transaction belongs to Cash Vault.
   * ------------------------------------------------------------
   */

  const totalMoneyIn = useMemo(
    () => getIncome(periodTransactions),
    [periodTransactions]
  );

  const totalMoneyOut = useMemo(
    () => getExpenses(periodTransactions),
    [periodTransactions]
  );

  const netMovement =
    totalMoneyIn - totalMoneyOut;

  const recentTransactions = useMemo(
    () => transactions.slice(0, 8),
    [transactions]
  );

  const lastActivity =
    recentTransactions[0] ?? null;

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-emerald-900">
              <Wallet size={14} />
              Finance
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Cash Vault
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Track physical cash separately from
              your bank accounts and keep every cash
              movement accounted for.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setPeriodOpen((open) => !open)
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
                <div className="absolute right-0 top-12 z-30 w-full min-w-[160px] border border-gray-200 bg-white py-1 shadow-lg sm:w-[180px]">
                  {periods.map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(period);
                        setPeriodOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedPeriod === period
                          ? 'bg-emerald-900 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
            >
              <Plus size={17} />
              Record cash
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Vault Balance */}
        <section className="mb-6 border border-emerald-900 bg-emerald-900 text-white">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
            <div className="border-b border-emerald-800 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center border border-emerald-700 bg-emerald-800">
                    <Banknote size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-emerald-100">
                      Independent Physical Cash Vault
                    </p>

                    <p className="mt-0.5 text-xs text-emerald-300">
                      Available cash balance
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-200">
                  <ShieldCheck size={14} />
                  Awaiting account connection
                </span>
              </div>

              <p className="text-sm text-emerald-200">
                Current vault balance
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                —
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-200">
                Your physical cash balance will appear
                here once a Cash Vault account is
                connected to your transaction records.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1">
              <div className="border-r border-emerald-800 p-6 sm:p-8 lg:border-r-0 lg:border-b">
                <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                  {selectedPeriod}
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {loading
                    ? '—'
                    : formatCurrency(netMovement)}
                </p>

                <p className="mt-1 text-xs text-emerald-300">
                  Recorded net movement
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                  Last activity
                </p>

                {lastActivity ? (
                  <>
                    <p className="mt-2 text-lg font-semibold">
                      {formatTransactionDate(
                        lastActivity
                      )}
                    </p>

                    <p className="mt-1 text-xs text-emerald-300">
                      {lastActivity.description ||
                        lastActivity.category}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-lg font-semibold">
                      —
                    </p>

                    <p className="mt-1 text-xs text-emerald-300">
                      No recorded activity yet
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <VaultMetric
            label="Cash balance"
            value="—"
            detail="Connect a Cash Vault account"
            icon={Wallet}
          />

          <VaultMetric
            label="Money received"
            value={
              loading
                ? '—'
                : formatCurrency(totalMoneyIn)
            }
            detail={`Recorded inflows · ${selectedPeriod.toLowerCase()}`}
            icon={TrendingUp}
            positive
          />

          <VaultMetric
            label="Money spent"
            value={
              loading
                ? '—'
                : formatCurrency(totalMoneyOut)
            }
            detail={`Recorded outflows · ${selectedPeriod.toLowerCase()}`}
            icon={TrendingDown}
            positive={false}
          />

          <VaultMetric
            label="Transactions"
            value={
              loading
                ? '—'
                : String(periodTransactions.length)
            }
            detail={`Recorded · ${selectedPeriod.toLowerCase()}`}
            icon={Receipt}
          />
        </section>

        {/* Main Content */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Recent Activity */}
          <section className="border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Recent cash activity
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Recorded transaction activity for
                  your account.
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-medium text-emerald-900 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="px-5">
              {loading ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-gray-500">
                    Loading transaction activity...
                  </p>
                </div>
              ) : recentTransactions.length ===
                0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center bg-gray-50 text-gray-400">
                    <Receipt
                      size={17}
                      strokeWidth={1.7}
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-900">
                    No transactions yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Your recorded transaction activity
                    will appear here.
                  </p>
                </div>
              ) : (
                recentTransactions.map(
                  (transaction) => (
                    <MovementRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  )
                )
              )}
            </div>
          </section>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Vault Status */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
                  <LockKeyhole
                    size={17}
                    className="text-emerald-900"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Vault status
                  </h2>

                  <p className="text-xs text-gray-500">
                    Your physical cash position
                  </p>
                </div>
              </div>

              <div className="border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />

                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Cash account not connected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Monietar needs an account mapping
                      to distinguish physical cash from
                      other transaction activity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Opening balance
                  </span>

                  <span className="font-medium text-gray-900">
                    —
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Net movement
                  </span>

                  <span className="font-medium text-emerald-800">
                    {formatCurrency(netMovement)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      Current balance
                    </span>

                    <span className="text-sm font-semibold text-gray-950">
                      —
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Cash Insight */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-emerald-900 text-white">
                  <TrendingUp size={15} />
                </div>

                <p className="text-sm font-semibold text-gray-950">
                  Monietar insight
                </p>
              </div>

              <p className="text-sm leading-6 text-gray-600">
                {netMovement > 0
                  ? `Recorded inflows are currently ahead of recorded outflows by ${formatCurrency(
                      netMovement
                    )}.`
                  : netMovement < 0
                    ? `Recorded outflows are currently ahead of recorded inflows by ${formatCurrency(
                        Math.abs(netMovement)
                      )}.`
                    : 'Recorded inflows and outflows are currently balanced.'}
              </p>

              <p className="mt-3 text-xs leading-5 text-gray-400">
                This insight reflects recorded
                transactions, not your physical cash
                balance.
              </p>
            </section>

            {/* Quick Actions */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-950">
                  Quick actions
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Plus
                      size={16}
                      className="text-emerald-900"
                    />

                    <span className="text-sm text-gray-700">
                      Record cash received
                    </span>
                  </span>

                  <ChevronDown
                    size={15}
                    className="-rotate-90 text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <ArrowUpRight
                      size={16}
                      className="text-emerald-900"
                    />

                    <span className="text-sm text-gray-700">
                      Record cash spent
                    </span>
                  </span>

                  <ChevronDown
                    size={15}
                    className="-rotate-90 text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Clock3
                      size={16}
                      className="text-emerald-900"
                    />

                    <span className="text-sm text-gray-700">
                      Review cash history
                    </span>
                  </span>

                  <ChevronDown
                    size={15}
                    className="-rotate-90 text-gray-400"
                  />
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 border-t border-gray-200 pt-5">
          <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Physical cash is tracked independently
              from your connected bank accounts.
            </p>

            <p className="text-gray-400">
              Powered by your transaction records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}