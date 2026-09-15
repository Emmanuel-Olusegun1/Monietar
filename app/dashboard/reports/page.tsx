'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Landmark,
  PieChart,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type ReportPeriod =
  | 'This month'
  | 'Today'
  | 'This week'
  | 'Last month';

const periods: ReportPeriod[] = [
  'This month',
  'Today',
  'This week',
  'Last month',
];

const reportData = {
  'This month': {
    revenue: 371000,
    expenses: 154500,
    grossProfit: 216500,
    cashFlow: 23000,
    previousRevenue: 328000,
    previousExpenses: 142000,
    transactions: 38,
  },
  Today: {
    revenue: 112500,
    expenses: 21000,
    grossProfit: 91500,
    cashFlow: 48500,
    previousRevenue: 98000,
    previousExpenses: 27500,
    transactions: 9,
  },
  'This week': {
    revenue: 248500,
    expenses: 89500,
    grossProfit: 159000,
    cashFlow: 32000,
    previousRevenue: 219000,
    previousExpenses: 97000,
    transactions: 24,
  },
  'Last month': {
    revenue: 328000,
    expenses: 142000,
    grossProfit: 186000,
    cashFlow: 41000,
    previousRevenue: 301500,
    previousExpenses: 135000,
    transactions: 34,
  },
};

const expenseBreakdown = [
  {
    category: 'Inventory',
    amount: 67500,
    percentage: 44,
  },
  {
    category: 'Operations',
    amount: 42000,
    percentage: 27,
  },
  {
    category: 'Transport',
    amount: 25000,
    percentage: 16,
  },
  {
    category: 'Packaging',
    amount: 20000,
    percentage: 13,
  },
];

const monthlyTrend = [
  {
    month: 'Apr',
    revenue: 245000,
    expenses: 128000,
  },
  {
    month: 'May',
    revenue: 279000,
    expenses: 139000,
  },
  {
    month: 'Jun',
    revenue: 301000,
    expenses: 151000,
  },
  {
    month: 'Jul',
    revenue: 294000,
    expenses: 146000,
  },
  {
    month: 'Aug',
    revenue: 328000,
    expenses: 142000,
  },
  {
    month: 'Sep',
    revenue: 371000,
    expenses: 154500,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const formatCompactCurrency = (amount: number) => {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}m`;
  }

  if (amount >= 1_000) {
    return `₦${Math.round(amount / 1_000)}k`;
  }

  return `₦${amount}`;
};

function ReportMetric({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  trendPositive,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Wallet;
  trend?: string;
  trendPositive?: boolean;
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

        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              trendPositive ? 'text-emerald-800' : 'text-red-700'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}
            {trend}
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

function ReportAction({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 border border-gray-200 bg-white p-4 text-left transition-colors hover:border-emerald-900 hover:bg-gray-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
        <Icon size={17} className="text-emerald-900" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <Download
        size={15}
        className="shrink-0 text-gray-400"
      />
    </button>
  );
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<ReportPeriod>('This month');

  const [periodOpen, setPeriodOpen] = useState(false);

  const data = reportData[selectedPeriod];

  const revenueChange = useMemo(() => {
    if (!data.previousRevenue) return 0;

    return Math.round(
      ((data.revenue - data.previousRevenue) /
        data.previousRevenue) *
        100
    );
  }, [data]);

  const expenseChange = useMemo(() => {
    if (!data.previousExpenses) return 0;

    return Math.round(
      ((data.expenses - data.previousExpenses) /
        data.previousExpenses) *
        100
    );
  }, [data]);

  const maxTrendValue = Math.max(
    ...monthlyTrend.flatMap((item) => [
      item.revenue,
      item.expenses,
    ])
  );

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-emerald-900">
              <BarChart3 size={14} />
              Finance
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Reports
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Turn your recorded financial activity into clear reports for
              understanding performance, cash flow, and profitability.
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
                <div className="absolute right-0 top-12 z-30 w-full min-w-[170px] border border-gray-200 bg-white py-1 shadow-lg sm:w-[180px]">
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
              <Download size={16} />
              Export report
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportMetric
            label="Revenue"
            value={formatCurrency(data.revenue)}
            detail={`${data.transactions} recorded transactions`}
            icon={TrendingUp}
            trend={`${Math.abs(revenueChange)}%`}
            trendPositive={revenueChange >= 0}
          />

          <ReportMetric
            label="Expenses"
            value={formatCurrency(data.expenses)}
            detail="Total recorded business expenses"
            icon={TrendingDown}
            trend={`${Math.abs(expenseChange)}%`}
            trendPositive={expenseChange <= 0}
          />

          <ReportMetric
            label="Gross profit"
            value={formatCurrency(data.grossProfit)}
            detail="Revenue less recorded expenses"
            icon={PieChart}
            trend="Healthy"
            trendPositive
          />

          <ReportMetric
            label="Net cash movement"
            value={formatCurrency(data.cashFlow)}
            detail="Bank and physical cash movement"
            icon={Wallet}
            trend={data.cashFlow >= 0 ? 'Positive' : 'Negative'}
            trendPositive={data.cashFlow >= 0}
          />
        </section>

        {/* Main Reports */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* P&L */}
          <section className="border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Profit & Loss
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Financial performance for {selectedPeriod.toLowerCase()}.
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-emerald-900 hover:underline"
              >
                <FileText size={15} />
                View detailed report
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-0">
                <div className="flex items-center justify-between border-b border-gray-100 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Revenue
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Total income recorded
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-950">
                    {formatCurrency(data.revenue)}
                  </p>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Cost of business activity
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Recorded operating expenses
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-red-700">
                    -{formatCurrency(data.expenses)}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-[#f8f8f8] px-4 py-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      Gross profit
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Current period result
                    </p>
                  </div>

                  <p className="text-lg font-semibold text-emerald-900">
                    {formatCurrency(data.grossProfit)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Expense Breakdown */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-950">
                Expense breakdown
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Where your recorded expenses are going.
              </p>
            </div>

            <div className="p-5">
              <div className="space-y-5">
                {expenseBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-700">
                        {item.category}
                      </span>

                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-100">
                      <div
                        className="h-full bg-emerald-900"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-[11px] text-gray-400">
                      {item.percentage}% of expenses
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Trend + Cash Flow */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Performance Trend */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    Revenue vs expenses
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Six-month view of your financial performance.
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
            </div>

            <div className="p-5">
              <div className="flex h-[280px] items-end gap-3 sm:gap-5">
                {monthlyTrend.map((item) => (
                  <div
                    key={item.month}
                    className="flex h-full min-w-0 flex-1 flex-col justify-end"
                  >
                    <div className="relative flex h-[220px] items-end justify-center gap-1 sm:gap-2">
                      <div
                        className="w-1/2 bg-emerald-900"
                        style={{
                          height: `${Math.max(
                            (item.revenue / maxTrendValue) * 100,
                            3
                          )}%`,
                        }}
                        title={`Revenue: ${formatCurrency(
                          item.revenue
                        )}`}
                      />

                      <div
                        className="w-1/2 bg-gray-300"
                        style={{
                          height: `${Math.max(
                            (item.expenses / maxTrendValue) * 100,
                            3
                          )}%`,
                        }}
                        title={`Expenses: ${formatCurrency(
                          item.expenses
                        )}`}
                      />
                    </div>

                    <p className="mt-3 text-center text-xs text-gray-500">
                      {item.month}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Highest revenue
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-950">
                      ₦371k
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Highest expenses
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-950">
                      ₦154.5k
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Current margin
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-900">
                      58.4%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cash Flow */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-950">
                Cash flow
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Movement across your financial channels.
              </p>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-emerald-200 bg-emerald-50">
                      <ArrowDownRight
                        size={16}
                        className="text-emerald-800"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Money in
                      </p>
                      <p className="text-xs text-gray-500">
                        Sales and other income
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-emerald-800">
                    +₦371,000
                  </p>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-red-200 bg-red-50">
                      <ArrowUpRight
                        size={16}
                        className="text-red-700"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Money out
                      </p>
                      <p className="text-xs text-gray-500">
                        Expenses and purchases
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-red-700">
                    -₦154,500
                  </p>
                </div>

                <div className="bg-[#f8f8f8] p-4">
                  <p className="text-xs text-gray-500">
                    Net cash movement
                  </p>

                  <p className="mt-1 text-xl font-semibold text-gray-950">
                    {formatCurrency(data.cashFlow)}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Across bank activity and physical cash.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Exportable Reports */}
        <section className="mt-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-950">
              Financial reports
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Generate reports from the financial activity recorded in
              Monietar.
            </p>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
            <ReportAction
              icon={FileText}
              title="Profit & Loss"
              description="Revenue, expenses and profit"
            />

            <ReportAction
              icon={Wallet}
              title="Cash Flow Statement"
              description="Money in, money out and movement"
            />

            <ReportAction
              icon={Receipt}
              title="Transaction Report"
              description="Detailed transaction activity"
            />

            <ReportAction
              icon={FileSpreadsheet}
              title="Financial Statement"
              description="Export-ready business statement"
            />
          </div>
        </section>

        {/* Bottom Note */}
        <div className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Landmark size={14} />
            Reports are generated from your recorded financial activity.
          </div>

          <p className="text-gray-400">
            Temporary dashboard data
          </p>
        </div>
      </div>
    </div>
  );
}