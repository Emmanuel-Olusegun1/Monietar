'use client';

import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  Globe2,
  Landmark,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Period = 'This month' | 'This week' | 'Today' | 'Last month';

const periods: Period[] = [
  'This month',
  'This week',
  'Today',
  'Last month',
];

const NGN_TO_XOF = 0.429281;
const XOF_TO_NGN = 1 / NGN_TO_XOF;

const ledgerEntries = [
  {
    id: 'FX-001',
    description: 'CFA supplier payment',
    type: 'outflow',
    sourceAmount: 850000,
    sourceCurrency: 'NGN',
    convertedAmount: 365889,
    convertedCurrency: 'XOF',
    rate: NGN_TO_XOF,
    date: 'Sep 15, 2026',
    category: 'Sourcing',
  },
  {
    id: 'FX-002',
    description: 'CFA sales receipt',
    type: 'inflow',
    sourceAmount: 1250000,
    sourceCurrency: 'XOF',
    convertedAmount: 2912036,
    convertedCurrency: 'NGN',
    rate: XOF_TO_NGN,
    date: 'Sep 14, 2026',
    category: 'Sales',
  },
  {
    id: 'FX-003',
    description: 'Supplier payment',
    type: 'outflow',
    sourceAmount: 420000,
    sourceCurrency: 'NGN',
    convertedAmount: 180298,
    convertedCurrency: 'XOF',
    rate: NGN_TO_XOF,
    date: 'Sep 13, 2026',
    category: 'Inventory',
  },
  {
    id: 'FX-004',
    description: 'CFA customer payment',
    type: 'inflow',
    sourceAmount: 650000,
    sourceCurrency: 'XOF',
    convertedAmount: 1514186,
    convertedCurrency: 'NGN',
    rate: XOF_TO_NGN,
    date: 'Sep 12, 2026',
    category: 'Sales',
  },
  {
    id: 'FX-005',
    description: 'Cross-border inventory',
    type: 'outflow',
    sourceAmount: 975000,
    sourceCurrency: 'NGN',
    convertedAmount: 418550,
    convertedCurrency: 'XOF',
    rate: NGN_TO_XOF,
    date: 'Sep 11, 2026',
    category: 'Sourcing',
  },
];

const rateHistory = [
  { date: 'Sep 9', rate: 0.4312 },
  { date: 'Sep 10', rate: 0.4308 },
  { date: 'Sep 11', rate: 0.4301 },
  { date: 'Sep 12', rate: 0.4298 },
  { date: 'Sep 13', rate: 0.4296 },
  { date: 'Sep 14', rate: 0.4294 },
  { date: 'Sep 15', rate: NGN_TO_XOF },
];

const periodData: Record<
  Period,
  {
    ngnVolume: number;
    xofVolume: number;
    conversions: number;
    sourcingSpend: number;
  }
> = {
  'This month': {
    ngnVolume: 2245000,
    xofVolume: 2012000,
    conversions: 18,
    sourcingSpend: 1325000,
  },
  'This week': {
    ngnVolume: 1385000,
    xofVolume: 1250000,
    conversions: 9,
    sourcingSpend: 785000,
  },
  Today: {
    ngnVolume: 850000,
    xofVolume: 365889,
    conversions: 3,
    sourcingSpend: 850000,
  },
  'Last month': {
    ngnVolume: 3185000,
    xofVolume: 2945000,
    conversions: 27,
    sourcingSpend: 1915000,
  },
};

const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const formatCfa = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount) + ' XOF';

const formatRate = (rate: number) =>
  rate.toFixed(6);

function CurrencyCard({
  currency,
  balance,
  label,
  flag,
}: {
  currency: string;
  balance: string;
  label: string;
  flag: string;
}) {
  return (
    <div className="border border-gray-200 bg-white p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#f8f8f8] text-lg">
            {flag}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-950">
              {currency}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {label}
            </p>
          </div>
        </div>

        <Globe2
          size={17}
          className="text-gray-400"
        />
      </div>

      <p className="text-2xl font-semibold tracking-tight text-gray-950">
        {balance}
      </p>
    </div>
  );
}

function Metric({
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
            {positive ? 'Active' : 'Watch'}
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

export default function DualCurrencyPage() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<Period>('This month');

  const [periodOpen, setPeriodOpen] = useState(false);

  const data = periodData[selectedPeriod];

  const rateChange = useMemo(() => {
    const first = rateHistory[0].rate;
    const current = rateHistory[rateHistory.length - 1].rate;

    return ((current - first) / first) * 100;
  }, []);

  const chartMin = Math.min(
    ...rateHistory.map((item) => item.rate)
  );

  const chartMax = Math.max(
    ...rateHistory.map((item) => item.rate)
  );

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-emerald-900">
              <ArrowLeftRight size={14} />
              Finance
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Dual Currency
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Track your Naira and CFA Franc activity together, understand
              currency movement, and see how cross-border transactions affect
              your business.
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
              className="flex h-11 items-center justify-center gap-2 border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download size={16} />
              Export ledger
            </button>
          </div>
        </div>

        {/* Current Rate */}
        <section className="mb-6 border border-emerald-900 bg-emerald-900 text-white">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="border-b border-emerald-800 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-emerald-700 bg-emerald-800">
                  <ArrowLeftRight size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-emerald-100">
                    Current Naira ⇄ CFA corridor
                  </p>

                  <p className="mt-0.5 text-xs text-emerald-300">
                    Latest indexed exchange rate
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                    1 NGN
                  </p>

                  <p className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {formatRate(NGN_TO_XOF)}
                  </p>

                  <p className="mt-1 text-sm text-emerald-200">
                    XOF
                  </p>
                </div>

                <div className="pb-1 text-emerald-400">
                  <ArrowLeftRight size={25} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                    1 XOF
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    ₦{XOF_TO_NGN.toFixed(2)}
                  </p>

                  <p className="mt-1 text-sm text-emerald-200">
                    NGN
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} />
                  Updated Sep 15, 2026
                </span>

                <span className="flex items-center gap-1.5">
                  <RefreshCw size={13} />
                  Automated rate index
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.12em] text-emerald-300">
                30-day movement
              </p>

              <div className="mt-3 flex items-end gap-3">
                <p className="text-3xl font-semibold">
                  {rateChange >= 0 ? '+' : ''}
                  {rateChange.toFixed(2)}%
                </p>

                <span className="mb-1 flex items-center gap-1 text-xs text-emerald-200">
                  {rateChange >= 0 ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}
                  NGN / XOF
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-emerald-200">
                Monietar uses the indexed corridor rate to give your
                cross-border transactions a consistent currency reference.
              </p>

              <div className="mt-6 border-t border-emerald-800 pt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300">
                    Current rate
                  </span>

                  <span className="font-medium text-white">
                    {formatRate(NGN_TO_XOF)} XOF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Currency Balances */}
        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <CurrencyCard
            currency="Nigerian Naira"
            balance="₦2,450,000"
            label="Primary currency balance"
            flag="🇳🇬"
          />

          <CurrencyCard
            currency="CFA Franc"
            balance="1,845,000 XOF"
            label="Cross-border currency balance"
            flag="🇨🇲"
          />
        </section>

        {/* Metrics */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="NGN activity"
            value={formatNaira(data.ngnVolume)}
            detail={`${data.conversions} currency movements`}
            icon={Wallet}
            positive
          />

          <Metric
            label="XOF activity"
            value={formatCfa(data.xofVolume)}
            detail="Recorded CFA activity"
            icon={CircleDollarSign}
            positive
          />

          <Metric
            label="Currency movements"
            value={String(data.conversions)}
            detail={`Recorded ${selectedPeriod.toLowerCase()}`}
            icon={ArrowLeftRight}
            positive
          />

          <Metric
            label="Cross-border sourcing"
            value={formatNaira(data.sourcingSpend)}
            detail="Recorded sourcing spend"
            icon={Landmark}
            positive
          />
        </section>

        {/* Main Content */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Rate Movement */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    Naira / CFA rate movement
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Recent movement in the indexed exchange corridor.
                  </p>
                </div>

                <span className="text-xs text-gray-500">
                  7-day view
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="relative h-[260px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-gray-200"
                    />
                  ))}
                </div>

                <div className="absolute inset-x-0 bottom-0 top-4 flex items-end gap-3 sm:gap-5">
                  {rateHistory.map((item) => {
                    const range = chartMax - chartMin || 1;

                    const height =
                      ((item.rate - chartMin) / range) *
                        70 +
                      20;

                    return (
                      <div
                        key={item.date}
                        className="flex h-full min-w-0 flex-1 flex-col justify-end"
                      >
                        <div className="group relative flex h-full items-end justify-center">
                          <div
                            className="w-full max-w-[42px] bg-emerald-900 transition-all group-hover:bg-emerald-800"
                            style={{
                              height: `${height}%`,
                            }}
                            title={`${item.date}: ${formatRate(
                              item.rate
                            )}`}
                          />
                        </div>

                        <p className="mt-3 text-center text-[11px] text-gray-400">
                          {item.date}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Period low
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-950">
                    {formatRate(chartMin)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Period high
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-950">
                    {formatRate(chartMax)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Current
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-900">
                    {formatRate(NGN_TO_XOF)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Conversion Snapshot */}
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-950">
                Conversion snapshot
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                What the current corridor means for your money.
              </p>
            </div>

            <div className="p-5">
              <div className="border border-gray-200 bg-[#f8f8f8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    ₦100,000
                  </span>

                  <ArrowLeftRight
                    size={16}
                    className="text-emerald-900"
                  />

                  <span className="text-sm font-semibold text-gray-950">
                    {formatCfa(100000 * NGN_TO_XOF)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500">
                    ₦500,000
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {formatCfa(500000 * NGN_TO_XOF)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500">
                    ₦1,000,000
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {formatCfa(1000000 * NGN_TO_XOF)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ₦2,500,000
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {formatCfa(2500000 * NGN_TO_XOF)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Ledger */}
        <section className="mt-6 border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950">
                Dual-currency ledger
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Recent transactions involving Naira and CFA Franc.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-emerald-900 hover:underline"
            >
              View full ledger
              <ArrowLeftRight size={15} />
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f8f8f8] text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Transaction
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Source amount
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Converted
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Rate
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {ledgerEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center border ${
                            entry.type === 'inflow'
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          {entry.type === 'inflow' ? (
                            <ArrowDownRight
                              size={15}
                              className="text-emerald-800"
                            />
                          ) : (
                            <ArrowUpRight
                              size={15}
                              className="text-red-700"
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.description}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {entry.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {entry.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {entry.sourceCurrency === 'NGN'
                        ? formatNaira(entry.sourceAmount)
                        : formatCfa(entry.sourceAmount)}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {entry.convertedCurrency === 'NGN'
                        ? formatNaira(entry.convertedAmount)
                        : formatCfa(entry.convertedAmount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      1 {entry.sourceCurrency} ={' '}
                      {entry.sourceCurrency === 'NGN'
                        ? formatRate(entry.rate)
                        : `₦${entry.rate.toFixed(2)}`}
                    </td>

                    <td className="px-5 py-4 text-right text-xs text-gray-500">
                      {entry.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-gray-100 md:hidden">
            {ledgerEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
                        entry.type === 'inflow'
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      {entry.type === 'inflow' ? (
                        <ArrowDownRight
                          size={15}
                          className="text-emerald-800"
                        />
                      ) : (
                        <ArrowUpRight
                          size={15}
                          className="text-red-700"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {entry.description}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {entry.category}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-semibold ${
                      entry.type === 'inflow'
                        ? 'text-emerald-800'
                        : 'text-red-700'
                    }`}
                  >
                    {entry.sourceCurrency === 'NGN'
                      ? formatNaira(entry.sourceAmount)
                      : formatCfa(entry.sourceAmount)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Converted
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {entry.convertedCurrency === 'NGN'
                        ? formatNaira(entry.convertedAmount)
                        : formatCfa(entry.convertedAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Rate
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {entry.sourceCurrency === 'NGN'
                        ? `${formatRate(entry.rate)} XOF`
                        : `₦${entry.rate.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  {entry.date}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Insight */}
        <section className="mt-6 border border-gray-200 bg-white">
          <div className="grid lg:grid-cols-[auto_1fr]">
            <div className="flex items-start gap-3 border-b border-gray-200 p-5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-900 text-white">
                <BarChart3 size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-950">
                  Monietar insight
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Currency and cash-flow context
                </p>
              </div>
            </div>

            <div className="p-5 lg:p-6">
              <p className="max-w-4xl text-sm leading-6 text-gray-600">
                Your dual-currency activity gives you a clearer view of what
                cross-border transactions actually cost in Naira. Tracking
                the exchange rate alongside sourcing and sales activity helps
                connect currency movement to your margins and cash flow rather
                than treating FX as a separate number.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Exchange rates shown on this page are indexed reference rates.
          </p>

          <p className="text-gray-400">
            Temporary dashboard data
          </p>
        </div>
      </div>
    </div>
  );
}