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
  X,
  Loader2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type TransactionType = 'income' | 'expense';

type Currency = 'NGN' | 'XOF';

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
  source: string | null;
};

type CashVault = {
  id: string;
  user_id: string;
  name: string;
  currency: string;
  balance: number | string;
  created_at: string | null;
  updated_at?: string | null;
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

const BUSINESS_TIME_ZONE = 'Africa/Lagos';

const SUPPORTED_CURRENCIES: Currency[] = ['NGN', 'XOF'];

const STARTER_CASH_VAULT_LIMIT = 1;

function isSupportedCurrency(value: string | null | undefined): value is Currency {
  return (
    typeof value === 'string' &&
    SUPPORTED_CURRENCIES.includes(value.toUpperCase() as Currency)
  );
}

function formatCurrency(
  amount: number,
  currency: string = 'NGN'
) {
  const normalized = currency.toUpperCase();

  if (normalized === 'XOF') {
    return `CFA ${Math.round(amount).toLocaleString('en-US')}`;
  }

  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return 0;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getLagosDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-NG', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(
      parts.find((part) => part.type === 'year')?.value
    ),
    month: Number(
      parts.find((part) => part.type === 'month')?.value
    ),
    day: Number(
      parts.find((part) => part.type === 'day')?.value
    ),
  };
}

function getLagosDateString(date = new Date()) {
  const { year, month, day } = getLagosDateParts(date);

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getLagosCalendarDate() {
  const { year, month, day } = getLagosDateParts();

  return new Date(year, month - 1, day);
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);

  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getPeriodRange(period: PeriodKey): {
  start: string | null;
  end: string | null;
} {
  const now = getLagosCalendarDate();
  const today = formatDateOnly(now);

  switch (period) {
    case 'Today':
      return {
        start: today,
        end: today,
      };

    case 'This week':
      return {
        start: formatDateOnly(startOfWeek(now)),
        end: today,
      };

    case 'This month':
      return {
        start: formatDateOnly(startOfMonth(now)),
        end: today,
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
        0
      );

      return {
        start: formatDateOnly(start),
        end: formatDateOnly(end),
      };
    }

    case 'This year':
      return {
        start: `${now.getFullYear()}-01-01`,
        end: today,
      };

    case 'All time':
      return {
        start: null,
        end: null,
      };
  }
}

function transactionDate(transaction: Transaction) {
  return parseDateOnly(transaction.date);
}

function isCompletedTransaction(transaction: Transaction) {
  return (
    transaction.status === 'completed' &&
    transaction.is_deleted !== true &&
    isSupportedCurrency(transaction.currency)
  );
}

function getIncome(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce(
      (total, transaction) =>
        total +
        toNumber(
          transaction.amount_base ?? transaction.amount
        ),
      0
    );
}

function getExpenses(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce(
      (total, transaction) =>
        total +
        toNumber(
          transaction.amount_base ?? transaction.amount
        ),
      0
    );
}

function formatTransactionDate(transaction: Transaction) {
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(transactionDate(transaction));
}

function formatTransactionTime(transaction: Transaction) {
  if (!transaction.created_at) {
    return 'Recorded manually';
  }

  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: BUSINESS_TIME_ZONE,
  }).format(new Date(transaction.created_at));
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

            {positive ? 'Money in' : 'Money out'}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">{label}</p>

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
  const amount = toNumber(transaction.amount);

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
              {formatTransactionDate(transaction)}
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
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [vaults, setVaults] =
    useState<CashVault[]>([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodKey>('This month');

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [cashModalOpen, setCashModalOpen] =
    useState(false);

  const [cashType, setCashType] =
    useState<TransactionType>('income');

  const [cashAmount, setCashAmount] =
    useState('');

  const [cashDescription, setCashDescription] =
    useState('');

  const [cashDate, setCashDate] =
    useState(getLagosDateString());

  const [vaultCurrency, setVaultCurrency] =
    useState<Currency>('NGN');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (mounted) {
          setError(
            authError
              ? 'We could not verify your account.'
              : 'You need to be signed in to view your Cash Vault.'
          );

          setLoading(false);
        }

        return;
      }

      const [
        transactionResult,
        vaultResult,
      ] = await Promise.all([
        supabase
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
            is_deleted,
            source
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .eq('is_deleted', false)
          .eq('category', 'Cash Vault')
          .eq('source', 'manual')
          .in('currency', SUPPORTED_CURRENCIES)
          .order('date', {
            ascending: false,
          })
          .order('created_at', {
            ascending: false,
          }),

        supabase
          .from('cash_vaults')
          .select(
            'id, user_id, name, currency, balance, created_at, updated_at'
          )
          .eq('user_id', user.id)
          .in('currency', SUPPORTED_CURRENCIES)
          .order('created_at', {
            ascending: true,
          }),
      ]);

      if (
        transactionResult.error ||
        vaultResult.error
      ) {
        console.error(
          'Cash Vault load error:',
          transactionResult.error ??
            vaultResult.error
        );

        if (mounted) {
          setError(
            'We could not load your Cash Vault activity.'
          );

          setLoading(false);
        }

        return;
      }

      if (mounted) {
        setTransactions(
          (transactionResult.data ??
            []) as Transaction[]
        );

        setVaults(
          (vaultResult.data ??
            []) as CashVault[]
        );

        setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const activeVault = vaults[0] ?? null;

  const activeCurrency: Currency =
    isSupportedCurrency(activeVault?.currency)
      ? activeVault.currency
      : 'NGN';

  const periodTransactions = useMemo(() => {
    const { start, end } =
      getPeriodRange(selectedPeriod);

    return transactions.filter(
      (transaction) => {
        if (
          !isCompletedTransaction(transaction)
        ) {
          return false;
        }

        if (
          transaction.currency?.toUpperCase() !==
          activeCurrency
        ) {
          return false;
        }

        if (
          start &&
          transaction.date < start
        ) {
          return false;
        }

        if (
          end &&
          transaction.date > end
        ) {
          return false;
        }

        return true;
      }
    );
  }, [
    transactions,
    selectedPeriod,
    activeCurrency,
  ]);

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
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.currency?.toUpperCase() ===
            activeCurrency
        )
        .slice(0, 8),
    [transactions, activeCurrency]
  );

  const lastActivity =
    recentTransactions[0] ?? null;

  function openCashModal(
    type: TransactionType
  ) {
    setCashType(type);
    setCashAmount('');
    setCashDescription('');
    setCashDate(getLagosDateString());
    setError(null);
    setCashModalOpen(true);
  }

  async function recordCash() {
    const amount = Number(cashAmount);
    const description =
      cashDescription.trim();

    if (!activeVault) {
      setError(
        'Create a Cash Vault before recording a cash movement.'
      );
      return;
    }

    if (
      !isSupportedCurrency(
        activeVault.currency
      )
    ) {
      setError(
        'This Cash Vault uses an unsupported currency. Only NGN and XOF are currently supported.'
      );
      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        'Enter a valid amount.'
      );
      return;
    }

    if (!description) {
      setError(
        'Description is required.'
      );
      return;
    }

    if (!cashDate) {
      setError(
        'Select a date for this cash movement.'
      );
      return;
    }

    const currentBalance =
      toNumber(activeVault.balance);

    if (
      cashType === 'expense' &&
      amount > currentBalance
    ) {
      setError(
        'You cannot spend more cash than you currently have.'
      );
      return;
    }

    setSaving(true);
    setError(null);

    const nextBalance =
      cashType === 'income'
        ? currentBalance + amount
        : currentBalance - amount;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        'You need to be signed in to record this.'
      );

      setSaving(false);
      return;
    }

    const { data: insertedTransaction, error: transactionError } =
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: cashType,
          amount,
          amount_base: amount,
          currency: activeCurrency,
          exchange_rate: 1,
          category: 'Cash Vault',
          description,
          date: cashDate,
          status: 'completed',
          notes:
            cashType === 'income'
              ? 'Cash received'
              : 'Cash spent',
          is_deleted: false,

          // Cash Vault entries are manual.
          // They do not consume the automatic bank-sync allowance.
          source: 'manual',
        })
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
          is_deleted,
          source
        `)
        .single();

    if (
      transactionError ||
      !insertedTransaction
    ) {
      console.error(
        'Cash Vault transaction insert error:',
        transactionError
      );

      setError(
        'We could not save this cash movement.'
      );

      setSaving(false);
      return;
    }

    const {
      data: updatedVault,
      error: vaultError,
    } = await supabase
      .from('cash_vaults')
      .update({
        balance: nextBalance,
      })
      .eq('id', activeVault.id)
      .eq('user_id', user.id)
      .select(
        'id, user_id, name, currency, balance, created_at, updated_at'
      )
      .single();

    if (
      vaultError ||
      !updatedVault
    ) {
      console.error(
        'Cash Vault balance update error:',
        vaultError
      );

      await supabase
        .from('transactions')
        .update({
          is_deleted: true,
        })
        .eq(
          'id',
          insertedTransaction.id
        )
        .eq(
          'user_id',
          user.id
        );

      setError(
        'We could not update your cash balance.'
      );

      setSaving(false);
      return;
    }

    setTransactions(
      (current) => [
        insertedTransaction as Transaction,
        ...current,
      ]
    );

    setVaults(
      (current) =>
        current.map((vault) =>
          vault.id === activeVault.id
            ? (updatedVault as CashVault)
            : vault
        )
    );

    setCashModalOpen(false);
    setCashAmount('');
    setCashDescription('');
    setSaving(false);
  }

  async function createVault() {
    if (
      vaults.length >=
      STARTER_CASH_VAULT_LIMIT
    ) {
      setError(
        'You already have a Cash Vault.'
      );
      return;
    }

    if (
      !SUPPORTED_CURRENCIES.includes(
        vaultCurrency
      )
    ) {
      setError(
        'Only NGN and XOF Cash Vaults are currently supported.'
      );
      return;
    }

    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        'You need to be signed in to create a Cash Vault.'
      );

      setSaving(false);
      return;
    }

    const {
      data,
      error: vaultError,
    } = await supabase
      .from('cash_vaults')
      .insert({
        user_id: user.id,
        name: 'Main Cash Vault',
        currency: vaultCurrency,
        balance: 0,
      })
      .select(
        'id, user_id, name, currency, balance, created_at, updated_at'
      )
      .single();

    if (
      vaultError ||
      !data
    ) {
      console.error(
        'Cash Vault creation error:',
        vaultError
      );

      setError(
        'We could not create your Cash Vault.'
      );

      setSaving(false);
      return;
    }

    setVaults([
      data as CashVault,
    ]);

    setSaving(false);
  }

  function viewAll() {
    window.location.href =
      '/dashboard/transactions';
  }

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
              Keep track of the cash you have on hand, separate from your bank
              accounts.
            </p>
          </div>

          {activeVault && (
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
                  <div className="absolute right-0 top-12 z-30 w-full min-w-[160px] border border-gray-200 bg-white py-1 shadow-lg sm:w-[180px]">
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
                onClick={() =>
                  openCashModal('income')
                }
                disabled={
                  loading ||
                  !activeVault
                }
                className="flex h-11 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Plus size={17} />
                Cash received
              </button>

              <button
                type="button"
                onClick={() =>
                  openCashModal('expense')
                }
                disabled={
                  loading ||
                  !activeVault
                }
                className="flex h-11 items-center justify-center gap-2 border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <ArrowUpRight size={17} />
                Cash spent
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="shrink-0"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {activeVault ? (
          <>
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
                          {activeVault.name}
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-300">
                          Cash you currently have
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-200">
                      <ShieldCheck size={14} />
                      Active
                    </span>
                  </div>

                  <p className="text-sm text-emerald-200">
                    Current cash balance
                  </p>

                  <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {loading
                      ? '—'
                      : formatCurrency(
                          toNumber(
                            activeVault.balance
                          ),
                          activeCurrency
                        )}
                  </p>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-200">
                    Your balance changes whenever you record cash received or
                    cash spent.
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
                        : formatCurrency(
                            netMovement,
                            activeCurrency
                          )}
                    </p>

                    <p className="mt-1 text-xs text-emerald-300">
                      Money in minus money out
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
                          No cash activity yet
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
                value={
                  loading
                    ? '—'
                    : formatCurrency(
                        toNumber(
                          activeVault.balance
                        ),
                        activeCurrency
                      )
                }
                detail={`${activeVault.name} · cash on hand`}
                icon={Wallet}
              />

              <VaultMetric
                label="Cash received"
                value={
                  loading
                    ? '—'
                    : formatCurrency(
                        totalMoneyIn,
                        activeCurrency
                      )
                }
                detail={`Money received · ${selectedPeriod.toLowerCase()}`}
                icon={TrendingUp}
                positive
              />

              <VaultMetric
                label="Cash spent"
                value={
                  loading
                    ? '—'
                    : formatCurrency(
                        totalMoneyOut,
                        activeCurrency
                      )
                }
                detail={`Money spent · ${selectedPeriod.toLowerCase()}`}
                icon={TrendingDown}
                positive={false}
              />

              <VaultMetric
                label="Cash movements"
                value={
                  loading
                    ? '—'
                    : String(
                        periodTransactions.length
                      )
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
                      A record of the cash you've received and spent.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={viewAll}
                    className="text-sm font-medium text-emerald-900 hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="px-5">
                  {loading ? (
                    <div className="py-16 text-center">
                      <p className="text-sm text-gray-500">
                        Loading cash activity...
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
                        No cash movements yet
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Record cash received or cash spent to start keeping
                        track of your cash.
                      </p>
                    </div>
                  ) : (
                    recentTransactions.map(
                      (transaction) => (
                        <MovementRow
                          key={
                            transaction.id
                          }
                          transaction={
                            transaction
                          }
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
                        Cash tracking
                      </h2>

                      <p className="text-xs text-gray-500">
                        Your cash on hand
                      </p>
                    </div>
                  </div>

                  <div className="border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-700"
                      />

                      <div>
                        <p className="text-sm font-medium text-emerald-900">
                          Your cash is being tracked
                        </p>

                        <p className="mt-1 text-xs leading-5 text-emerald-800">
                          {activeVault.name} is kept separate from your bank
                          accounts, so you can see exactly how much physical
                          cash you have.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Starting balance
                      </span>

                      <span className="font-medium text-gray-900">
                        {formatCurrency(
                          0,
                          activeCurrency
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Money in / out
                      </span>

                      <span className="font-medium text-emerald-800">
                        {formatCurrency(
                          netMovement,
                          activeCurrency
                        )}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Current balance
                        </span>

                        <span className="text-sm font-semibold text-gray-950">
                          {formatCurrency(
                            toNumber(
                              activeVault.balance
                            ),
                            activeCurrency
                          )}
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
                      ? `You've received more cash than you've spent by ${formatCurrency(
                          netMovement,
                          activeCurrency
                        )} during this period.`
                      : netMovement < 0
                        ? `You've spent more cash than you've received by ${formatCurrency(
                            Math.abs(
                              netMovement
                            ),
                            activeCurrency
                          )} during this period.`
                        : 'The cash you received and spent is currently balanced for this period.'}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    This is based on the cash movements you've recorded.
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
                      onClick={() =>
                        openCashModal(
                          'income'
                        )
                      }
                      disabled={
                        !activeVault ||
                        saving
                      }
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex items-center gap-3">
                        <Plus
                          size={16}
                          className="text-emerald-900"
                        />

                        <span className="text-sm text-gray-700">
                          Cash received
                        </span>
                      </span>

                      <ChevronDown
                        size={15}
                        className="-rotate-90 text-gray-400"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openCashModal(
                          'expense'
                        )
                      }
                      disabled={
                        !activeVault ||
                        saving
                      }
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex items-center gap-3">
                        <ArrowUpRight
                          size={16}
                          className="text-emerald-900"
                        />

                        <span className="text-sm text-gray-700">
                          Cash spent
                        </span>
                      </span>

                      <ChevronDown
                        size={15}
                        className="-rotate-90 text-gray-400"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={viewAll}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-3">
                        <Clock3
                          size={16}
                          className="text-emerald-900"
                        />

                        <span className="text-sm text-gray-700">
                          View cash history
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
                  Your cash on hand is tracked separately from your bank
                  accounts.
                </p>

                <p className="text-gray-400">
                  Based on the cash you've recorded
                </p>
              </div>
            </div>
          </>
        ) : !loading ? (
          <section className="border border-gray-200 bg-white">
            <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
              <div className="flex h-16 w-16 items-center justify-center border border-emerald-100 bg-emerald-50 text-emerald-900">
                <Banknote
                  size={28}
                  strokeWidth={1.6}
                />
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-emerald-900">
                Cash Vault
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                Start tracking your cash
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                You don’t have a Cash Vault yet. Create one to keep track of
                the cash you have on hand, separate from your bank accounts.
              </p>

              {/* Currency Selection */}
              <div className="mt-6 w-full max-w-sm text-left">
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Cash Vault currency
                </label>

                <div className="flex h-11 overflow-hidden border border-gray-300 bg-white">
                  {SUPPORTED_CURRENCIES.map(
                    (currency) => (
                      <button
                        key={currency}
                        type="button"
                        onClick={() =>
                          setVaultCurrency(
                            currency
                          )
                        }
                        className={`flex-1 text-sm font-medium transition-colors ${
                          vaultCurrency ===
                          currency
                            ? 'bg-emerald-900 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {currency ===
                        'XOF'
                          ? 'XOF · CFA'
                          : 'NGN · Naira'}
                      </button>
                    )
                  )}
                </div>

                <p className="mt-2 text-[11px] text-gray-400">
                  Your Cash Vault can only hold one currency. Create a
                  separate vault later if your plan supports additional vaults.
                </p>
              </div>

              <button
                type="button"
                onClick={createVault}
                disabled={saving}
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Create Cash Vault
              </button>
            </div>
          </section>
        ) : null}
      </div>

      {/* Record Cash Modal */}
      {cashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5">
          <div className="w-full max-w-md border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  {cashType ===
                  'income'
                    ? 'Cash received'
                    : 'Cash spent'}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {activeVault?.name ||
                    'Cash Vault'}
                  {' · '}
                  {activeCurrency}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCashModalOpen(false)
                }
                disabled={saving}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Amount
                </label>

                <div className="flex h-11 items-center border border-gray-300 bg-white px-3">
                  <span className="mr-2 text-sm text-gray-400">
                    {activeCurrency}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cashAmount}
                    onChange={(event) =>
                      setCashAmount(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full bg-transparent text-sm text-gray-900 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Category
                </label>

                <div className="flex h-11 items-center border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
                  {cashType ===
                  'income'
                    ? 'Cash received'
                    : 'Cash spent'}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  required
                  value={cashDescription}
                  onChange={(event) =>
                    setCashDescription(
                      event.target.value
                    )
                  }
                  className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  placeholder={
                    cashType ===
                    'income'
                      ? 'What did you receive the cash for?'
                      : 'What did you spend the cash on?'
                  }
                />

                <p className="mt-1.5 text-[11px] text-gray-400">
                  A short description helps you understand this movement later.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Date
                </label>

                <input
                  type="date"
                  value={cashDate}
                  onChange={(event) =>
                    setCashDate(
                      event.target.value
                    )
                  }
                  className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                />
              </div>

              {cashType ===
                'expense' &&
                activeVault && (
                  <p className="text-xs text-gray-500">
                    You have{' '}
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        toNumber(
                          activeVault.balance
                        ),
                        activeCurrency
                      )}
                    </span>{' '}
                    available.
                  </p>
                )}

              <div className="border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                <p className="text-[11px] leading-5 text-emerald-800">
                  This cash movement is recorded manually and does not use your
                  automatic bank transaction allowance.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setCashModalOpen(false)
                }
                disabled={saving}
                className="h-10 border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={recordCash}
                disabled={saving}
                className="flex h-10 items-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                )}

                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
