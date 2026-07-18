'use client';

import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  BanknoteArrowUp,
  Package,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

interface BusinessHealthProps {
  darkMode: boolean;

  financialData?: {
    revenueHealth?: number;
    profitHealth?: number;
    inventoryHealth?: number;
    cashFlowHealth?: number;
    aiConfidence?: number;
    bankConnected?: boolean;
  };
}
export default function BusinessHealth({
  darkMode,
  financialData,
}: BusinessHealthProps) {
  const revenue =
    financialData?.revenueHealth ?? 92;

  const profit =
    financialData?.profitHealth ?? 88;

  const inventory =
    financialData?.inventoryHealth ?? 84;

  const cashFlow =
    financialData?.cashFlowHealth ?? 90;

  const aiConfidence =
    financialData?.aiConfidence ?? 97;

  const overall = Math.round(
    (
      revenue +
      profit +
      inventory +
      cashFlow +
      aiConfidence
    ) / 5
  );

  const health =
    overall >= 90
      ? 'Excellent'
      : overall >= 75
      ? 'Good'
      : 'Needs Attention';

  const metrics = [
    {
      title: 'Inflow',
      value: revenue,
      icon: BanknoteArrowUp,
      color: 'bg-emerald-500',
    },
    {
      title: 'Profitability',
      value: profit,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Cash Flow',
      value: cashFlow,
      icon: Activity,
      color: 'bg-purple-500',
    },
    {
      title: 'Inventory',
      value: inventory,
      icon: Package,
      color: 'bg-amber-500',
    },
  ];

  return (
    <section
      className={`rounded-3xl border p-8 ${
        darkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-[#E8ECE6] bg-white'
      }`}
    >
      {/* Score */}

<div className="grid gap-8 lg:grid-cols-[340px_1fr]">

  {/* Gauge */}

  <div className="rounded-3xl bg-[#F6F8F4] p-8">

  <div className="relative h-[260px]">

    <ResponsiveContainer width="100%" height="100%">

      <RadialBarChart
        innerRadius="72%"
        outerRadius="100%"
        startAngle={225}
        endAngle={-45}
        data={[
          {
            name: 'Health',
            value: overall,
            fill: '#0F3B23',
          },
        ]}
      >

        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />

        <RadialBar
          background={{
            fill: '#E5E7EB',
          }}
          cornerRadius={18}
          dataKey="value"
        />

      </RadialBarChart>

    </ResponsiveContainer>

    <div className="absolute inset-0 flex flex-col items-center justify-center">

      <span className="text-sm font-medium text-gray-500">
        Overall Score
      </span>

      <h2 className="mt-2 text-5xl font-bold text-[#14361F]">
        {overall}
      </h2>

      <span className="mt-2 text-sm text-emerald-600 font-semibold">
        {health}
      </span>

    </div>

  </div>

</div>

  {/* Right */}

  <div>

    <div className="grid gap-5 md:grid-cols-2">
    {metrics.map((metric) => {
  const Icon = metric.icon;

  return (
    <div
      key={metric.title}
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        darkMode
          ? 'border-gray-800 bg-gray-950'
          : 'border-[#ECEEE8] bg-white'
      }`}
    >
      <div className="mb-5 flex items-center justify-between">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        <div className="text-right">

          <p className="text-3xl font-bold text-[#14361F]">
            {metric.value}%
          </p>

          <span className="text-xs text-emerald-600 font-medium">
            Healthy
          </span>

        </div>

      </div>

      <h4
        className={`font-semibold ${
          darkMode
            ? 'text-white'
            : 'text-[#14361F]'
        }`}
      >
        {metric.title}
      </h4>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">

        <div
          className={`h-full rounded-full ${metric.color}`}
          style={{
            width: `${metric.value}%`,
          }}
        />

      </div>

    </div>
  );
})}

</div>
{/* AI Insight */}

<div
  className={`mt-6 overflow-hidden rounded-3xl ${
    darkMode
      ? 'bg-gradient-to-r from-gray-950 to-gray-900'
      : 'bg-gradient-to-r from-[#0F3B23] to-[#1C5A38]'
  }`}
>

  <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-center">

    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

      <BrainCircuit className="h-8 w-8 text-white" />

    </div>

    <div className="flex-1">

      <div className="mb-3 flex flex-wrap items-center gap-3">

        <h3 className="text-xl font-bold text-white">
          AI Executive Insight
        </h3>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">

          <ShieldCheck size={14} />

          {aiConfidence}% Confidence

        </div>

      </div>

      <p className="max-w-3xl leading-8 text-emerald-50">

        Revenue continues to outperform operating
        expenses, resulting in a healthy positive
        cash position. Inventory turnover remains
        the only area requiring improvement.
        Increasing stock movement by just
        <strong> 8–12%</strong> could improve your
        working capital and overall profitability
        during the next reporting cycle.

      </p>

    </div>

  </div>

</div>

</div>

</div>

    </section>
  );
}