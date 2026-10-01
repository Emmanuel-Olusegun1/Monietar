'use client';

import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Loader2,
  Package,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';

type Plan =
  | 'retail-starter'
  | 'growing-merchant'
  | 'borderless-pro';

type Period =
  | 'Today'
  | 'This week'
  | 'This month'
  | 'Last month';

interface PeriodData {
  revenue: number;
  expenses: number;
  netCashFlow: number;
  grossProfit: number;
  revenueChange: number;
  expenseChange: number;
  cashFlowChange: number;
  profitChange: number;
  sales: number;
  unitsSold: number;
  averageSale: number;
  cashIn: number;
  cashOut: number;
}

const periodData: Record<Period, PeriodData> = {
  Today: {
    revenue: 185000,
    expenses: 68000,
    netCashFlow: 117000,
    grossProfit: 92000,
    revenueChange: 12.4,
    expenseChange: 5.8,
    cashFlowChange: 18.2,
    profitChange: 14.6,
    sales: 8,
    unitsSold: 15,
    averageSale: 23125,
    cashIn: 185000,
    cashOut: 68000,
  },

  'This week': {
    revenue: 964000,
    expenses: 352000,
    netCashFlow: 612000,
    grossProfit: 481000,
    revenueChange: 9.7,
    expenseChange: 3.2,
    cashFlowChange: 14.8,
    profitChange: 11.9,
    sales: 47,
    unitsSold: 86,
    averageSale: 20511,
    cashIn: 964000,
    cashOut: 352000,
  },

  'This month': {
    revenue: 3847000,
    expenses: 1428000,
    netCashFlow: 2419000,
    grossProfit: 1923000,
    revenueChange: 16.3,
    expenseChange: 7.4,
    cashFlowChange: 21.6,
    profitChange: 18.1,
    sales: 183,
    unitsSold: 347,
    averageSale: 21022,
    cashIn: 3847000,
    cashOut: 1428000,
  },

  'Last month': {
    revenue: 3308000,
    expenses: 1330000,
    netCashFlow: 1978000,
    grossProfit: 1629000,
    revenueChange: 8.1,
    expenseChange: 4.9,
    cashFlowChange: 12.3,
    profitChange: 10.4,
    sales: 161,
    unitsSold: 301,
    averageSale: 20547,
    cashIn: 3308000,
    cashOut: 1330000,
  },
};

const revenueTrend = [
  {
    label: 'Jan',
    revenue: 2180000,
    expenses: 940000,
  },
  {
    label: 'Feb',
    revenue: 2460000,
    expenses: 1020000,
  },
  {
    label: 'Mar',
    revenue: 2710000,
    expenses: 1110000,
  },
  {
    label: 'Apr',
    revenue: 2940000,
    expenses: 1180000,
  },
  {
    label: 'May',
    revenue: 3308000,
    expenses: 1330000,
  },
  {
    label: 'Jun',
    revenue: 3847000,
    expenses: 1428000,
  },
];

const categoryPerformance = [
  {
    name: 'Electronics',
    revenue: 2184000,
    units: 162,
    percentage: 57,
  },
  {
    name: 'Accessories',
    revenue: 1097000,
    units: 131,
    percentage: 29,
  },
  {
    name: 'Computing',
    revenue: 566000,
    units: 54,
    percentage: 14,
  },
];

const expenseBreakdown = [
  {
    name: 'Inventory purchases',
    amount: 692000,
    percentage: 48,
  },
  {
    name: 'Operations',
    amount: 321000,
    percentage: 22,
  },
  {
    name: 'Logistics',
    amount: 214000,
    percentage: 15,
  },
  {
    name: 'Other expenses',
    amount: 201000,
    percentage: 15,
  },
];

const topProducts = [
  {
    name: 'Anker Power Bank 20,000mAh',
    units: 42,
    revenue: 1197000,
    growth: 18.4,
  },
  {
    name: 'Wireless Bluetooth Earbuds',
    units: 27,
    revenue: 499500,
    growth: 11.7,
  },
  {
    name: 'USB-C Fast Charger',
    units: 31,
    revenue: 387500,
    growth: 8.2,
  },
  {
    name: 'Mechanical Keyboard',
    units: 9,
    revenue: 378000,
    growth: 5.4,
  },
];

function normalizePlan(value: unknown): Plan {
  if (
    value === 'growing-merchant' ||
    value === 'borderless-pro'
  ) {
    return value;
  }

  return 'retail-starter';
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export default function AnalyticsPage() {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [currentPlan, setCurrentPlan] =
    useState<Plan>('retail-starter');

  const [planLoading, setPlanLoading] =
    useState(true);

  const [period, setPeriod] =
    useState<Period>('This month');

  const loadPlan = useCallback(
    async () => {
      setPlanLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setCurrentPlan('retail-starter');
          return;
        }

        const metadataPlan =
          user.user_metadata
            ?.subscription_plan ??
          user.user_metadata?.plan;

        setCurrentPlan(
          normalizePlan(metadataPlan),
        );
      } catch {
        setCurrentPlan('retail-starter');
      } finally {
        setPlanLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    void loadPlan();
  }, [loadPlan]);

  const hasAnalyticsAccess =
    currentPlan === 'growing-merchant' ||
    currentPlan === 'borderless-pro';

  const data = periodData[period];

  const profitMargin =
    data.revenue > 0
      ? (data.grossProfit / data.revenue) *
        100
      : 0;

  const expenseRatio =
    data.revenue > 0
      ? (data.expenses / data.revenue) *
        100
      : 0;

  const revenueToExpenseRatio =
    data.expenses > 0
      ? data.revenue / data.expenses
      : 0;

  const highestRevenue = useMemo(
    () =>
      Math.max(
        ...revenueTrend.map(
          (item) => item.revenue,
        ),
      ),
    [],
  );

  if (planLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f6] text-gray-900">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2
              size={17}
              className="animate-spin"
            />

            Loading your plan...
          </div>
        </div>
      </main>
    );
  }

  if (!hasAnalyticsAccess) {
    return (
      <main className="min-h-screen bg-[#f7f8f6] text-gray-900">
        <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-10 sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-600">
                  <BarChart3 size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                    Analytics
                  </p>

                  <h1 className="mt-1 text-lg font-semibold text-gray-950">
                    Understand your business
                    performance
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex min-h-[420px] items-center justify-center px-6 py-16">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gray-100 text-gray-500">
                  <BarChart3 size={21} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Growing Merchant feature
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-950">
                  Turn your business data into
                  insight
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Analytics brings your sales,
                  revenue, expenses, cash flow,
                  profitability, and product
                  performance together so you can
                  understand what is happening
                  across your business.
                </p>

                <div className="mt-6 border border-gray-200 bg-gray-50 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        Analytics is not included
                        in Retail Starter
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Upgrade to Growing Merchant
                        or Borderless Pro to access
                        business analytics.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex h-10 items-center justify-center bg-gray-900 px-5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  View Growing Merchant
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Insight
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Understand how your money,
              sales, expenses, and inventory
              are moving together.
            </p>
          </div>

          <div className="relative">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value as Period,
                )
              }
              className="appearance-none border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-700 outline-none focus:border-emerald-900"
            >
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
              <option>Last month</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Core metrics */}
        <div className="mb-8 grid grid-cols-1 border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsMetric
            label="Revenue"
            value={formatCurrency(data.revenue)}
            change={data.revenueChange}
            icon={
              <CircleDollarSign size={18} />
            }
            description={period.toLowerCase()}
          />

          <AnalyticsMetric
            label="Gross profit"
            value={formatCurrency(
              data.grossProfit,
            )}
            change={data.profitChange}
            icon={<TrendingUp size={18} />}
            description={`${profitMargin.toFixed(
              1,
            )}% margin`}
          />

          <AnalyticsMetric
            label="Net cash flow"
            value={formatCurrency(
              data.netCashFlow,
            )}
            change={data.cashFlowChange}
            icon={<Wallet size={18} />}
            description="Cash in less cash out"
          />

          <AnalyticsMetric
            label="Expenses"
            value={formatCurrency(data.expenses)}
            change={data.expenseChange}
            icon={<TrendingDown size={18} />}
            description={`${expenseRatio.toFixed(
              1,
            )}% of revenue`}
            expense
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          {/* Left column */}
          <div className="min-w-0 space-y-6">
            {/* Revenue vs expenses */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Revenue vs expenses
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Six-month financial movement
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-emerald-900" />
                    Revenue
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-gray-300" />
                    Expenses
                  </span>
                </div>
              </div>

              <div className="flex h-[280px] items-end gap-2 border-b border-gray-200 pb-0 sm:gap-5">
                {revenueTrend.map((item) => {
                  const revenueHeight =
                    (item.revenue /
                      highestRevenue) *
                    100;

                  const expenseHeight =
                    (item.expenses /
                      highestRevenue) *
                    100;

                  return (
                    <div
                      key={item.label}
                      className="relative flex h-full flex-1 items-end justify-center gap-1"
                    >
                      <div className="flex h-full max-w-[34px] flex-1 flex-col justify-end">
                        <div
                          className="w-full bg-emerald-900"
                          style={{
                            height: `${revenueHeight}%`,
                          }}
                          title={`${item.label} revenue: ${formatCurrency(
                            item.revenue,
                          )}`}
                        />
                      </div>

                      <div className="flex h-full max-w-[34px] flex-1 flex-col justify-end">
                        <div
                          className="w-full bg-gray-300"
                          style={{
                            height: `${expenseHeight}%`,
                          }}
                          title={`${item.label} expenses: ${formatCurrency(
                            item.expenses,
                          )}`}
                        />
                      </div>

                      <span className="absolute translate-y-[145px] text-[11px] text-gray-500">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Business performance */}
            <section className="grid grid-cols-1 border border-gray-200 bg-white md:grid-cols-3">
              <PerformanceCard
                label="Sales"
                value={data.sales.toLocaleString()}
                description={`${data.unitsSold} units sold`}
                icon={<ShoppingBagIcon />}
              />

              <PerformanceCard
                label="Average sale"
                value={formatCurrency(
                  data.averageSale,
                )}
                description="Average revenue per sale"
                icon={
                  <CircleDollarSign size={18} />
                }
              />

              <PerformanceCard
                label="Revenue / expense"
                value={`${revenueToExpenseRatio.toFixed(
                  2,
                )}×`}
                description="Revenue generated per ₦1 spent"
                icon={<BarChart3 size={18} />}
              />
            </section>

            {/* Category performance */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Category performance
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Revenue contribution by product
                  category
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {categoryPerformance.map(
                  (category) => (
                    <div
                      key={category.name}
                      className="p-5"
                    >
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {category.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {category.units} units
                            sold
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              category.revenue,
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {category.percentage}%
                            of revenue
                          </p>
                        </div>
                      </div>

                      <div className="h-1.5 bg-gray-100">
                        <div
                          className="h-full bg-emerald-900"
                          style={{
                            width: `${category.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Expense breakdown */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Expense breakdown
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Where business spending is going
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {expenseBreakdown.map(
                  (expense) => (
                    <div
                      key={expense.name}
                      className="flex items-center gap-4 p-5"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-700">
                            {expense.name}
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(
                              expense.amount,
                            )}
                          </span>
                        </div>

                        <div className="h-1.5 bg-gray-100">
                          <div
                            className="h-full bg-gray-700"
                            style={{
                              width: `${expense.percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      <span className="w-10 text-right text-xs text-gray-500">
                        {expense.percentage}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="min-w-0 space-y-6 self-start">
            {/* Key signals */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Key signals
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  What stands out in your numbers
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <Signal
                  title="Revenue is growing"
                  description={`Revenue is up ${data.revenueChange.toFixed(
                    1,
                  )}% compared with the previous period.`}
                  positive
                />

                <Signal
                  title="Cash flow is positive"
                  description={`${formatCurrency(
                    data.netCashFlow,
                  )} remains after recorded cash outflows.`}
                  positive
                />

                <Signal
                  title="Expenses are rising"
                  description={`Expenses increased ${data.expenseChange.toFixed(
                    1,
                  )}% compared with the previous period.`}
                  positive={false}
                />
              </div>
            </section>

            {/* Top products */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900">
                  Top products
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Revenue contribution
                </p>
              </div>

              <div className="space-y-5">
                {topProducts.map(
                  (product, index) => (
                    <div
                      key={product.name}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-200 text-xs font-semibold text-gray-500">
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.name}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {product.units} units
                          </span>

                          <span className="text-gray-300">
                            ·
                          </span>

                          <span className="text-xs font-medium text-emerald-700">
                            +{product.growth}%
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-gray-700">
                        {formatCurrency(
                          product.revenue,
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Cash flow */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Cash movement
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {period}
                  </p>
                </div>

                <Wallet
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <div className="space-y-5">
                <CashMovement
                  label="Money in"
                  amount={data.cashIn}
                  positive
                />

                <CashMovement
                  label="Money out"
                  amount={data.cashOut}
                  positive={false}
                />

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Net movement
                    </span>

                    <span className="text-sm font-semibold text-emerald-900">
                      {formatCurrency(
                        data.netCashFlow,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Monietar insight */}
            <section className="border border-emerald-900 bg-emerald-900 p-5 text-white">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={17} />

                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Monietar Insight
                </span>
              </div>

              <p className="text-sm leading-6 text-emerald-50">
                Your revenue is currently growing
                faster than your expenses. That is
                keeping your cash flow positive, but
                inventory purchases remain the largest
                expense category. Watch replenishment
                closely so growing sales do not
                unnecessarily tighten available cash.
              </p>
            </section>
          </aside>
        </div>

        {/* Temporary data notice */}
        <div className="mt-6 border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs leading-5 text-gray-500">
            <span className="font-medium text-gray-700">
              Temporary dashboard data.
            </span>{' '}
            Analytics shown here are placeholders and
            are not connected to your live Monietar
            financial, sales, or inventory data yet.
          </p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsMetric({
  label,
  value,
  change,
  icon,
  description,
  expense = false,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  description: string;
  expense?: boolean;
}) {
  return (
    <div className="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {label}
        </span>

        <span className="text-gray-400">
          {icon}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-gray-950">
          {value}
        </span>

        <span
          className={`mb-1 inline-flex items-center gap-0.5 text-xs font-medium ${
            expense
              ? 'text-amber-700'
              : 'text-emerald-700'
          }`}
        >
          <ArrowUpRight size={13} />

          {formatPercentage(change)}
        </span>
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function PerformanceCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 p-5 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {label}
        </span>

        <span className="text-gray-400">
          {icon}
        </span>
      </div>

      <p className="text-xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Signal({
  title,
  description,
  positive,
}: {
  title: string;
  description: string;
  positive: boolean;
}) {
  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center ${
            positive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {positive ? (
            <ArrowUpRight size={15} />
          ) : (
            <TrendingDown size={15} />
          )}
        </span>

        <div>
          <p className="text-sm font-medium text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function CashMovement({
  label,
  amount,
  positive,
}: {
  label: string;
  amount: number;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={
            positive
              ? 'text-emerald-700'
              : 'text-gray-500'
          }
        >
          {positive ? (
            <ArrowUpRight size={15} />
          ) : (
            <ArrowDownRight size={15} />
          )}
        </span>

        <span className="text-sm text-gray-600">
          {label}
        </span>
      </div>

      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

function ShoppingBagIcon() {
  return <Package size={18} />;
}