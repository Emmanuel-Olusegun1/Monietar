'use client';

import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Receipt,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

import type { FinancialData } from './types';

interface TodaysPerformanceProps {
  darkMode: boolean;
  financialData: FinancialData;
  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;
}

export default function TodaysPerformance({
  darkMode,
  financialData,
  formatCurrency,
}: TodaysPerformanceProps) {
  const revenue =
    financialData.totalRevenue || 0;

  const expenses =
    financialData.totalExpenses || 0;

  const profit =
    financialData.netProfit || 0;

  const transactions =
    financialData.transactions?.length || 0;

  const cards = [
    {
      title: 'Revenue',
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      trend: '+12%',
      positive: true,
    },
    {
      title: 'Expenses',
      value: formatCurrency(expenses),
      icon: Receipt,
      color: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: '-3%',
      positive: false,
    },
    {
      title: 'Transactions',
      value: transactions.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: '+8%',
      positive: true,
    },
  ];

  return (
    <section
      className={`rounded-[28px] border ${
        darkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-[#E8ECE6] bg-white'
      }`}
    >
      {/* Header */}

      <div className="border-b border-[#ECEEE8] px-7 py-6">
        <h2 className="text-xl font-bold text-[#14361F]">
          Today's Performance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Live business activity.
        </p>
      </div>

      {/* Profit Card */}

      <div className="p-7">
        <div className="rounded-3xl bg-gradient-to-br from-[#0F3B23] to-[#1B5A37] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">
                Net Profit
              </p>

              <h1 className="mt-3 text-4xl font-bold">
                {formatCurrency(profit)}
              </h1>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <TrendingUp size={30} />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-emerald-100">
            <ArrowUpRight size={18} />
            18% higher than yesterday
          </div>
        </div>
      </div>

      {/* Metrics */}

      <div className="space-y-4 px-7 pb-7">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl border border-[#ECEEE8] p-5 transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon
                    size={22}
                    className={item.iconColor}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[#14361F]">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Today's value
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h3 className="text-lg font-bold text-[#14361F]">
                  {item.value}
                </h3>

                <div
                  className={`mt-2 flex items-center justify-end gap-1 text-sm font-semibold ${
                    item.positive
                      ? 'text-emerald-600'
                      : 'text-red-500'
                  }`}
                >
                  {item.positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}

                  {item.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
