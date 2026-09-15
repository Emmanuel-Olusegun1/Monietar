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
import { useState } from 'react';

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

/*
|--------------------------------------------------------------------------
| Period
|--------------------------------------------------------------------------
*/

type PeriodKey =
  | 'today'
  | 'this-week'
  | 'this-month'
  | 'last-month';

const PERIODS: Record<
  PeriodKey,
  {
    label: string;
    revenueMultiplier: number;
    profitMultiplier: number;
    cashMultiplier: number;
  }
> = {
  today: {
    label: 'Today',
    revenueMultiplier: 0.12,
    profitMultiplier: 0.1,
    cashMultiplier: 1,
  },

  'this-week': {
    label: 'This week',
    revenueMultiplier: 0.38,
    profitMultiplier: 0.36,
    cashMultiplier: 1,
  },

  'this-month': {
    label: 'This month',
    revenueMultiplier: 1,
    profitMultiplier: 1,
    cashMultiplier: 1,
  },

  'last-month': {
    label: 'Last month',
    revenueMultiplier: 0.91,
    profitMultiplier: 0.88,
    cashMultiplier: 0.94,
  },
};

/*
|--------------------------------------------------------------------------
| Temporary Overview Data
|--------------------------------------------------------------------------
|
| These values are temporary UI data and should eventually be replaced
| with real Supabase-backed dashboard data.
|
*/

const overviewData = {
  revenue: 482500,
  revenueChange: 12.4,

  profit: 126400,
  profitChange: 8.7,

  cashPosition: 238700,
  cashChange: 5.2,

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  | This is a MONTHLY usage figure.
  |
  | It must NOT change when the user switches between:
  | Today / This week / This month / Last month.
  |--------------------------------------------------------------------------
  */
  automaticTransactions: 327,

  cashFlow: [
    {
      label: 'Mon',
      income: 32000,
      expenses: 18000,
    },
    {
      label: 'Tue',
      income: 46000,
      expenses: 22000,
    },
    {
      label: 'Wed',
      income: 38000,
      expenses: 25000,
    },
    {
      label: 'Thu',
      income: 61000,
      expenses: 29000,
    },
    {
      label: 'Fri',
      income: 52000,
      expenses: 31000,
    },
    {
      label: 'Sat',
      income: 72000,
      expenses: 42000,
    },
    {
      label: 'Sun',
      income: 48000,
      expenses: 27000,
    },
  ],

  transactions: [
    {
      id: 'TXN-001',
      description: 'Customer payment',
      category: 'Sales',
      source: 'Bank transfer',
      amount: 85000,
      type: 'income',
      date: 'Today, 10:42 AM',
    },
    {
      id: 'TXN-002',
      description: 'Inventory purchase',
      category: 'Inventory',
      source: 'Bank transfer',
      amount: 42000,
      type: 'expense',
      date: 'Today, 9:18 AM',
    },
    {
      id: 'TXN-003',
      description: 'Customer payment',
      category: 'Sales',
      source: 'Cash',
      amount: 27500,
      type: 'income',
      date: 'Yesterday, 4:32 PM',
    },
    {
      id: 'TXN-004',
      description: 'Shop supplies',
      category: 'Operations',
      source: 'Bank transfer',
      amount: 12500,
      type: 'expense',
      date: 'Yesterday, 1:06 PM',
    },
  ],

  products: {
    total: 47,
    lowStock: 4,
  },

  sales: {
    total: 86,
    change: 14.2,
  },

  cashVault: {
    balance: 68500,
  },
};

const plan = PLAN_CONFIG[CURRENT_PLAN];

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

export default function OverviewPage() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodKey>('this-month');

  const [periodOpen, setPeriodOpen] =
    useState(false);

  const [hoveredDay, setHoveredDay] = useState<
    string | null
  >(null);

  const period = PERIODS[selectedPeriod];

  /*
  |--------------------------------------------------------------------------
  | Period-specific financial figures
  |--------------------------------------------------------------------------
  */

  const revenue = Math.round(
    overviewData.revenue *
      period.revenueMultiplier
  );

  const profit = Math.round(
    overviewData.profit *
      period.profitMultiplier
  );

  const cashPosition = Math.round(
    overviewData.cashPosition *
      period.cashMultiplier
  );

  /*
  |--------------------------------------------------------------------------
  | Monthly automatic transaction usage
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | This value intentionally does NOT use the selected period.
  |
  | The transaction allowance is monthly-rated, so:
  |
  | Today       → 327 / 500
  | This week   → 327 / 500
  | This month  → 327 / 500
  | Last month  → 327 / 500
  |
  |--------------------------------------------------------------------------
  */

  const automaticTransactions =
    overviewData.automaticTransactions;

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
  | Cash Flow Summary
  |--------------------------------------------------------------------------
  */

  const moneyIn = overviewData.cashFlow.reduce(
    (total, day) => total + day.income,
    0
  );

  const moneyOut = overviewData.cashFlow.reduce(
    (total, day) => total + day.expenses,
    0
  );

  const netMovement = moneyIn - moneyOut;

  const chartMax = Math.max(
    ...overviewData.cashFlow.flatMap((item) => [
      item.income,
      item.expenses,
    ])
  );

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
              Good morning, Emmanuel.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Here&apos;s what&apos;s happening with
              your business.
            </p>
          </div>

          {/* Functional date selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setPeriodOpen((open) => !open)
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

              <span>{period.label}</span>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className={`
                  text-gray-400
                  transition-transform
                  ${
                    periodOpen
                      ? 'rotate-180'
                      : ''
                  }
                `}
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
                ).map(([key, option]) => (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={
                      selectedPeriod === key
                    }
                    onClick={() => {
                      setSelectedPeriod(key);
                      setPeriodOpen(false);
                    }}
                    className={`
                      flex w-full items-center
                      justify-between
                      px-3 py-2.5
                      text-left text-sm
                      transition-colors
                      ${
                        selectedPeriod === key
                          ? 'bg-emerald-50 text-emerald-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span>{option.label}</span>

                    {selectedPeriod === key && (
                      <span className="h-1.5 w-1.5 bg-emerald-900" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Financial Snapshot */}
        {/* -------------------------------------------------------------- */}

        <section className="grid grid-cols-1 gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Revenue"
            value={formatCurrency(revenue)}
            change={overviewData.revenueChange}
            description="Total money received"
            icon={ArrowDownRight}
          />

          <MetricCard
            label="Profit"
            value={formatCurrency(profit)}
            change={overviewData.profitChange}
            description="After recorded expenses"
            icon={BarChart3}
          />

          <MetricCard
            label="Cash Position"
            value={formatCurrency(cashPosition)}
            change={overviewData.cashChange}
            description="Available across tracked cash"
            icon={Wallet}
          />

          {/* Monthly Bank Activity */}
          <div className="bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                  Bank Activity
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
                  {automaticTransactions}

                  <span className="text-base font-normal text-gray-400">
                    {' '}
                    /{' '}
                    {plan.transactionLimit === Infinity
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
              Automatic transactions logged this month
            </p>

            {transactionUsage !== null && (
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
                    {remainingTransactions} remaining
                  </span>

                  <span>
                    {transactionUsage}% used
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

              <button
                type="button"
                className="
                  flex items-center gap-1.5
                  text-xs font-medium
                  text-emerald-900
                  hover:underline
                "
              >
                View report
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Summary */}
              <div className="mb-7 grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Money in
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(moneyIn)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Money out
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(moneyOut)}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Net movement
                  </p>

                  <p className="mt-1 text-lg font-semibold text-emerald-900">
                    {netMovement >= 0 ? '+' : ''}
                    {formatCurrency(netMovement)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-[230px]">
                {/* Grid */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-gray-100"
                    />
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-x-0 bottom-6 top-2 flex items-end justify-between gap-2">
                  {overviewData.cashFlow.map(
                    (day) => {
                      const incomeHeight =
                        (day.income / chartMax) *
                        100;

                      const expenseHeight =
                        (day.expenses / chartMax) *
                        100;

                      const isHovered =
                        hoveredDay === day.label;

                      return (
                        <div
                          key={day.label}
                          className="relative flex h-full flex-1 items-end justify-center gap-1"
                          onMouseEnter={() =>
                            setHoveredDay(day.label)
                          }
                          onMouseLeave={() =>
                            setHoveredDay(null)
                          }
                        >
                          {/* Tooltip */}
                          {isHovered && (
                            <div
                              className="
                                absolute bottom-[calc(100%-10px)]
                                left-1/2 z-20
                                w-40
                                -translate-x-1/2
                                border border-gray-200
                                bg-white
                                p-3
                                shadow-lg
                              "
                            >
                              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                {day.label}
                              </p>

                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-emerald-900" />

                                    <span className="text-[10px] text-gray-500">
                                      Money in
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
                                      Money out
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
                                      className={`
                                        text-[10px]
                                        font-semibold
                                        ${
                                          day.income -
                                            day.expenses >=
                                          0
                                            ? 'text-emerald-900'
                                            : 'text-red-600'
                                        }
                                      `}
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
                              height: `${incomeHeight}%`,
                              opacity:
                                hoveredDay &&
                                hoveredDay !==
                                  day.label
                                  ? 0.45
                                  : 1,
                            }}
                          />

                          <div
                            className="w-2.5 bg-gray-200 transition-opacity sm:w-3"
                            style={{
                              height: `${expenseHeight}%`,
                              opacity:
                                hoveredDay &&
                                hoveredDay !==
                                  day.label
                                  ? 0.65
                                  : 1,
                            }}
                          />
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Labels */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2">
                  {overviewData.cashFlow.map(
                    (day) => (
                      <span
                        key={day.label}
                        className={`
                          flex-1 text-center text-[10px]
                          ${
                            hoveredDay === day.label
                              ? 'font-medium text-emerald-900'
                              : 'text-gray-400'
                          }
                        `}
                      >
                        {day.label}
                      </span>
                    )
                  )}
                </div>
              </div>

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
              <p className="text-lg font-medium leading-7">
                Your business recorded more money
                coming in than going out this week.
              </p>

              <p className="mt-4 text-sm leading-6 text-emerald-100">
                Your recorded inflows are currently
                ahead of your outflows. Keep watching
                inventory purchases and operating
                expenses as the month progresses.
              </p>

              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200">
                    Net cash movement
                  </span>

                  <span className="text-sm font-semibold">
                    +{formatCurrency(netMovement)}
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
                className="
                  flex items-center gap-1.5
                  text-xs font-medium
                  text-emerald-900
                  hover:underline
                "
              >
                View all
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {overviewData.transactions.map(
                (transaction) => (
                  <div
                    key={transaction.id}
                    className="
                      flex items-center justify-between
                      gap-4 px-5 py-4 sm:px-6
                    "
                  >
                    <div className="flex min-w-0 items-center gap-3">
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
                          {transaction.description}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">
                            {transaction.category}
                          </span>

                          <span className="h-0.5 w-0.5 rounded-full bg-gray-300" />

                          <span className="text-[10px] text-gray-400">
                            {transaction.source}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
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

                      <p className="mt-1 text-[10px] text-gray-400">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
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
                label="Sales"
                value={`${overviewData.sales.total} recorded`}
                detail={`+${overviewData.sales.change}%`}
              />

              <SnapshotRow
                icon={Package}
                label="Products"
                value={`${overviewData.products.total} products`}
                detail={
                  overviewData.products.lowStock > 0
                    ? `${overviewData.products.lowStock} low stock`
                    : 'Stock healthy'
                }
                warning={
                  overviewData.products.lowStock >
                  0
                }
              />

              <SnapshotRow
                icon={Wallet}
                label="Cash Vault"
                value={formatCurrency(
                  overviewData.cashVault.balance
                )}
                detail="Physical cash"
              />
            </div>

            <div className="border-t border-gray-200 p-4">
              <button
                type="button"
                className="
                  flex w-full items-center
                  justify-center gap-2
                  border border-gray-200
                  bg-white
                  px-4 py-2.5
                  text-xs font-medium
                  text-gray-700
                  transition-colors
                  hover:bg-gray-50
                "
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

        {CURRENT_PLAN !== 'BORDERLESS_PRO' && (
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
                    {automaticTransactions}

                    <span className="text-sm font-normal text-gray-400">
                      {' '}
                      /{' '}
                      {plan.transactionLimit}
                    </span>
                  </p>

                  <p className="text-[10px] text-gray-400">
                    used this month
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    flex items-center gap-2
                    bg-emerald-900
                    px-4 py-2.5
                    text-xs font-medium
                    text-white
                    transition-colors
                    hover:bg-emerald-800
                  "
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
  change: number;
  description: string;
  icon: typeof ArrowDownRight;
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

        <span
          className={`
            inline-flex items-center gap-1
            text-[10px] font-medium
            ${
              change >= 0
                ? 'text-emerald-800'
                : 'text-red-600'
            }
          `}
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

          {formatPercentage(change)}
        </span>
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
  icon: typeof Receipt;
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
        className={`
          flex shrink-0 items-center gap-1
          text-[10px]
          ${
            warning
              ? 'text-amber-600'
              : 'text-gray-400'
          }
        `}
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