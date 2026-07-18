'use client';

import {
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import type { FinancialData } from './types';

interface InventorySnapshotProps {
  darkMode: boolean;
  financialData: FinancialData;
  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;
}

export default function InventorySnapshot({
  darkMode,
  financialData,
  formatCurrency,
}: InventorySnapshotProps) {
  const inventory = financialData.inventory;

  const totalItems =
    inventory?.totalItems ?? 0;

  const inventoryValue =
    inventory?.inventoryValue ?? 0;

  const lowStock =
    inventory?.lowStock ?? 0;

  const turnover =
    inventory?.turnover ?? 0;

  const cards = [
    {
      title: 'Products',
      value: totalItems,
      icon: Package,
      bg: 'bg-emerald-100',
      color: 'text-emerald-700',
    },
    {
      title: 'Low Stock',
      value: lowStock,
      icon: AlertTriangle,
      bg: 'bg-amber-100',
      color: 'text-amber-700',
    },
    {
      title: 'Turnover',
      value: `${turnover}%`,
      icon: TrendingUp,
      bg: 'bg-blue-100',
      color: 'text-blue-700',
    },
  ];

  return (
    <section
      className={`rounded-[28px] border overflow-hidden ${
        darkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-[#E8ECE6] bg-white'
      }`}
    >
      {/* Header */}

      <div className="border-b border-[#ECEEE8] px-7 py-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-[#14361F]">
              Inventory Snapshot
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current stock position.
            </p>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F3B23]">

            <Boxes
              size={22}
              className="text-white"
            />

          </div>

        </div>

      </div>

      {/* Inventory Value */}

      <div className="p-7">

        <div className="rounded-3xl bg-gradient-to-br from-[#0F3B23] to-[#1A5A37] p-6 text-white">

          <p className="text-sm text-emerald-100">
            Total Inventory Value
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {formatCurrency(inventoryValue)}
          </h1>

          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">

            <TrendingUp size={18} />

            Stock value increasing steadily

          </div>

        </div>

      </div>

      {/* Stats */}

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
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}
                >

                  <Icon
                    size={22}
                    className={item.color}
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-[#14361F]">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>

                </div>

              </div>

              <h3 className="text-xl font-bold text-[#14361F]">
                {item.value}
              </h3>

            </div>

          );

        })}

      </div>

      {/* Footer */}

      <div className="border-t border-[#ECEEE8] bg-[#FAFBF9] px-7 py-5">

        <button className="flex items-center gap-2 font-semibold text-[#0F3B23] transition hover:gap-3">

          Open Inventory

          <ArrowRight size={18} />

        </button>

      </div>

    </section>
  );
}