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
import { useMemo, useState } from 'react';

type CashTransactionType = 'deposit' | 'withdrawal';

type CashTransaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: CashTransactionType;
  date: string;
  time: string;
  reference: string;
};

const cashTransactions: CashTransaction[] = [
  {
    id: 'CV-001',
    description: 'Cash sales',
    category: 'Sales',
    amount: 27500,
    type: 'deposit',
    date: 'Sep 15, 2026',
    time: '09:42 AM',
    reference: 'CASH-001',
  },
  {
    id: 'CV-002',
    description: 'Transport expense',
    category: 'Operations',
    amount: 8500,
    type: 'withdrawal',
    date: 'Sep 15, 2026',
    time: '08:17 AM',
    reference: 'CASH-002',
  },
  {
    id: 'CV-003',
    description: 'Cash sales',
    category: 'Sales',
    amount: 45000,
    type: 'deposit',
    date: 'Sep 14, 2026',
    time: '05:31 PM',
    reference: 'CASH-003',
  },
  {
    id: 'CV-004',
    description: 'Petty cash',
    category: 'Operations',
    amount: 5000,
    type: 'withdrawal',
    date: 'Sep 14, 2026',
    time: '02:05 PM',
    reference: 'CASH-004',
  },
  {
    id: 'CV-005',
    description: 'Cash sales',
    category: 'Sales',
    amount: 32000,
    type: 'deposit',
    date: 'Sep 13, 2026',
    time: '06:24 PM',
    reference: 'CASH-005',
  },
  {
    id: 'CV-006',
    description: 'Supplier payment',
    category: 'Inventory',
    amount: 18000,
    type: 'withdrawal',
    date: 'Sep 13, 2026',
    time: '01:18 PM',
    reference: 'CASH-006',
  },
  {
    id: 'CV-007',
    description: 'Cash sales',
    category: 'Sales',
    amount: 21500,
    type: 'deposit',
    date: 'Sep 12, 2026',
    time: '04:47 PM',
    reference: 'CASH-007',
  },
  {
    id: 'CV-008',
    description: 'Packaging materials',
    category: 'Operations',
    amount: 7500,
    type: 'withdrawal',
    date: 'Sep 12, 2026',
    time: '11:36 AM',
    reference: 'CASH-008',
  },
];

const periods = ['This month', 'Today', 'This week', 'Last month'];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

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
          <Icon size={18} strokeWidth={1.7} className="text-emerald-900" />
        </div>

        {positive !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              positive ? 'text-emerald-800' : 'text-red-700'
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

      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function MovementRow({
  transaction,
}: {
  transaction: CashTransaction;
}) {
  const isDeposit = transaction.type === 'deposit';

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
            isDeposit
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          {isDeposit ? (
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
            {transaction.description}
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span>{transaction.category}</span>
            <span>•</span>
            <span>{transaction.date}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-semibold ${
            isDeposit ? 'text-emerald-800' : 'text-red-700'
          }`}
        >
          {isDeposit ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {transaction.time}
        </p>
      </div>
    </div>
  );
}

export default function CashVaultPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This month');
  const [periodOpen, setPeriodOpen] = useState(false);

  const vaultBalance = 96500;

  const totalDeposits = useMemo(
    () =>
      cashTransactions
        .filter((transaction) => transaction.type === 'deposit')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    []
  );

  const totalWithdrawals = useMemo(
    () =>
      cashTransactions
        .filter((transaction) => transaction.type === 'withdrawal')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    []
  );

  const netMovement = totalDeposits - totalWithdrawals;

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
              Track physical cash separately from your bank accounts and keep
              every cash movement accounted for.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <button
                type="button"
                onClick={() => setPeriodOpen((open) => !open)}
                className="flex h-11 w-full items-center justify-between gap-8 border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {selectedPeriod}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    periodOpen ? 'rotate-180' : ''
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
                  Active
                </span>
              </div>

              <p className="text-sm text-emerald-200">
                Current vault balance
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                {formatCurrency(vaultBalance)}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-200">
                Cash recorded here is kept separate from your connected bank
                accounts, so your physical cash position remains visible in
                your overall financial picture.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1">
              <div className="border-r border-emerald-800 p-6 sm:p-8 lg:border-r-0 lg:border-b">
                <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                  This month
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(netMovement)}
                </p>

                <p className="mt-1 text-xs text-emerald-300">
                  Net cash movement
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                  Last activity
                </p>

                <p className="mt-2 text-lg font-semibold">
                  Sep 15, 09:42 AM
                </p>

                <p className="mt-1 text-xs text-emerald-300">
                  Cash sales · +₦27,500
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <VaultMetric
            label="Cash balance"
            value={formatCurrency(vaultBalance)}
            detail="Available in physical cash"
            icon={Wallet}
          />

          <VaultMetric
            label="Cash received"
            value={formatCurrency(totalDeposits)}
            detail="Recorded inflows this period"
            icon={TrendingUp}
            positive
          />

          <VaultMetric
            label="Cash spent"
            value={formatCurrency(totalWithdrawals)}
            detail="Recorded outflows this period"
            icon={TrendingDown}
            positive={false}
          />

          <VaultMetric
            label="Cash movements"
            value={String(cashTransactions.length)}
            detail="Recorded transactions this period"
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
                  Every recorded movement in your physical cash vault.
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
              {cashTransactions.map((transaction) => (
                <MovementRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
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

              <div className="border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-800"
                  />

                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      Vault is balanced
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-800">
                      Your recorded cash movements are currently reflected in
                      the vault balance.
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
                    ₦73,500
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Net movement
                  </span>
                  <span className="font-medium text-emerald-800">
                    +₦23,000
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      Current balance
                    </span>
                    <span className="text-sm font-semibold text-gray-950">
                      ₦96,500
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
                Cash sales are currently contributing more to the vault than
                operational withdrawals. Keeping these movements recorded
                helps separate physical cash from money held in your bank
                accounts.
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
                    <Plus size={16} className="text-emerald-900" />
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
                    <Clock3 size={16} className="text-emerald-900" />
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
              Physical cash is tracked independently from your connected bank
              accounts.
            </p>

            <p className="text-gray-400">
              Temporary dashboard data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}