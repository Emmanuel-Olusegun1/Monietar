'use client';

import {
  TrendingUp,
  Wallet,
  Percent,
  PieChart,
} from 'lucide-react';

import type { FinancialData } from './types';

interface FinancialRatiosProps {
  darkMode: boolean;
  financialData: FinancialData;
}

export default function FinancialRatios({
  darkMode,
  financialData,
}: FinancialRatiosProps) {
  const revenue =
    financialData.totalRevenue || 0;

  const expenses =
    financialData.totalExpenses || 0;

  const profit =
    financialData.netProfit || 0;

  const cash =
    financialData.cashBalance || 0;

  const margin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  const expenseRatio =
    revenue > 0
      ? (expenses / revenue) * 100
      : 0;

  const cashRatio =
    revenue > 0
      ? (cash / revenue) * 100
      : 0;

  const metrics = [
    {
      title: 'Profit Margin',
      value: `${margin.toFixed(1)}%`,
      score: margin,
      icon: Percent,
      color: 'bg-emerald-500',
    },
    {
      title: 'Expense Ratio',
      value: `${expenseRatio.toFixed(1)}%`,
      score: expenseRatio,
      icon: PieChart,
      color: 'bg-red-500',
    },
    {
      title: 'Cash Coverage',
      value: `${cashRatio.toFixed(1)}%`,
      score: cashRatio,
      icon: Wallet,
      color: 'bg-blue-500',
    },
    {
      title: 'Business Growth',
      value:
        profit > 0
          ? 'Growing'
          : 'Stable',
      score:
        profit > 0
          ? 82
          : 48,
      icon: TrendingUp,
      color: 'bg-purple-500',
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
      <div className="border-b border-[#ECEEE8] px-7 py-6">

        <h2 className="text-xl font-bold text-[#14361F]">
          Financial Ratios
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Key indicators of business performance.
        </p>

      </div>

      <div className="grid gap-6 p-7 md:grid-cols-2">

        {metrics.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="rounded-2xl border border-[#ECEEE8] p-5 transition hover:shadow-lg"
            >

              <div className="mb-5 flex items-center justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon
                    className="text-white"
                    size={22}
                  />
                </div>

                <span className="text-2xl font-bold text-[#14361F]">
                  {item.value}
                </span>

              </div>

              <h3 className="font-semibold text-[#14361F]">
                {item.title}
              </h3>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EDF1EB]">

                <div
                  className="h-full rounded-full bg-[#0F3B23]"
                  style={{
                    width: `${Math.min(
                      item.score,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Performance
                </span>

                <span className="text-sm font-semibold text-[#0F3B23]">
                  {Math.round(item.score)}%
                </span>

              </div>

            </div>

          );

        })}

      </div>
    </section>
  );
}