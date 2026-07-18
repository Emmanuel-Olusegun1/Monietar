'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  BanknoteArrowUp,
BanknoteArrowDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

interface ExecutiveKPIsProps {
  darkMode: boolean;
  income: number;
  expenses: number;
  profit: number;
  cashVaultBalance: number;
  activeCurrencies?: string[];
  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;
}

export default function ExecutiveKPIs({
  darkMode,
  income,
  expenses,
  profit,
  cashVaultBalance,
  formatCurrency,
}: ExecutiveKPIsProps) {
  const cards = [
    {
      title: 'Inflow',
      value: formatCurrency(income),
      icon: BanknoteArrowUp,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
      trend: '+12%',
      positive: true,
    },

    {
      title:'Outflow',
      value: formatCurrency(expenses),
      icon: BanknoteArrowDown,
      bg: 'bg-red-50',
      color: 'text-red-600',
      trend: '-4%',
      positive: false,
    },

    {
      title: 'Net Profit',
      value: formatCurrency(profit),
      icon: TrendingUp,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
      trend:
        profit >= 0 ? '+18%' : '-18%',
      positive: profit >= 0,
    },

    {
      title: 'Cash Available',
      value: formatCurrency(
        cashVaultBalance
      ),
      icon: Wallet,
      bg: 'bg-[#EAF6EE]',
      color: 'text-[#0F3B23]',
      trend: 'Healthy',
      positive: true,
      featured: true,
    },
  ];

  return (
    <section>

      <div className="mb-6 flex items-end justify-between">

        <div>

          <h2
            className={`text-3xl font-bold ${
              darkMode
                ? 'text-white'
                : 'text-[#14361F]'
            }`}
          >
            Financial Overview
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            Your business at a glance.
          </p>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                card.featured
                  ? 'border-[#0F3B23] bg-[#0F3B23] text-white'
                  : darkMode
                  ? 'border-gray-800 bg-gray-900'
                  : 'border-[#E8ECE6] bg-white'
              } p-6`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className={`text-sm ${
                      card.featured
                        ? 'text-white/70'
                        : 'text-gray-500'
                    }`}
                  >
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    {card.value}
                  </h3>

                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    card.featured
                      ? 'bg-white/10'
                      : card.bg
                  }`}
                >
                  <Icon
                    className={`h-7 w-7 ${
                      card.featured
                        ? 'text-white'
                        : card.color
                    }`}
                  />
                </div>

              </div>

              <div className="mt-8 flex items-center justify-between">

                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    card.featured
                      ? 'text-emerald-300'
                      : card.positive
                      ? 'text-emerald-600'
                      : 'text-red-500'
                  }`}
                >

                  {card.positive ? (
                    <ArrowUpRight
                      size={16}
                    />
                  ) : (
                    <ArrowDownRight
                      size={16}
                    />
                  )}

                  {card.trend}

                </div>

                <span
                  className={`text-xs ${
                    card.featured
                      ? 'text-white/60'
                      : 'text-gray-400'
                  }`}
                >
                  this month
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}