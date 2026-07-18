'use client';

import {
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { FinancialData } from './types';

interface ProfitTrendProps {
  darkMode: boolean;
  financialData: FinancialData;
  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;
}

export default function ProfitTrend({
  darkMode,
  financialData,
  formatCurrency,
}: ProfitTrendProps) {
  const revenue =
    financialData.totalRevenue || 0;

  const expenses =
    financialData.totalExpenses || 0;

  const profit =
    financialData.netProfit || 0;

  const chartData = [
    {
      month: 'Jan',
      inflow: revenue * 0.35,
      outflow: expenses * 0.28,
    },
    {
      month: 'Feb',
      inflow: revenue * 0.42,
      outflow: expenses * 0.32,
    },
    {
      month: 'Mar',
      inflow: revenue * 0.48,
      outflow: expenses * 0.39,
    },
    {
      month: 'Apr',
      inflow: revenue * 0.55,
      outflow: expenses * 0.44,
    },
    {
      month: 'May',
      inflow: revenue * 0.63,
      outflow: expenses * 0.49,
    },
    {
      month: 'Jun',
      inflow: revenue * 0.74,
      outflow: expenses * 0.56,
    },
    {
      month: 'Jul',
      inflow: revenue,
      outflow: expenses,
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

      <div className="flex items-center justify-between border-b border-[#ECEEE8] px-7 py-6">

        <div>

          <h2 className="text-xl font-bold text-[#14361F]">
            Cash Flow Trend
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monthly inflow versus outflow.
          </p>

        </div>

        <div className="rounded-2xl bg-emerald-50 px-4 py-2">

          <div className="flex items-center gap-2 text-emerald-700">

            <ArrowUpRight size={18} />

            <span className="font-semibold">
              +18%
            </span>

          </div>

        </div>

      </div>

      {/* Chart */}

      {/* Chart */}

<div className="h-[420px] px-7 py-8">

  <ResponsiveContainer width="100%" height="100%">

    <BarChart
      data={chartData}
      margin={{
        top: 10,
        right: 10,
        left: 10,
        bottom: 0,
      }}
      barGap={8}
      barCategoryGap="25%"
    >

      <CartesianGrid
        vertical={false}
        stroke="#ECEEE8"
        strokeDasharray="4 4"
      />

      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        tick={{
          fill: "#6B7280",
          fontSize: 13,
          fontWeight: 500,
        }}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        width={70}
        tick={{
          fill: "#6B7280",
          fontSize: 12,
        }}
        tickFormatter={(value) =>
          `₦${Intl.NumberFormat("en-NG", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(value)}`
        }
      />

      <Tooltip
        formatter={(value: number) =>
          formatCurrency(value)
        }
        contentStyle={{
          borderRadius: 18,
          border: "none",
          boxShadow:
            "0 10px 35px rgba(0,0,0,.12)",
        }}
      />

      <Bar
        dataKey="inflow"
        name="Inflow"
        fill="#0F3B23"
        radius={[10, 10, 0, 0]}
        maxBarSize={30}
      />

      <Bar
        dataKey="outflow"
        name="Outflow"
        fill="#D97706"
        radius={[10, 10, 0, 0]}
        maxBarSize={30}
      />

    </BarChart>

  </ResponsiveContainer>

</div>

     

    </section>
  );
}