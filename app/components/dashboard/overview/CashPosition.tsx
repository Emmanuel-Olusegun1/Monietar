'use client';

import {
  Wallet,
  ArrowUpRight,
  Coins,
  Landmark,
} from 'lucide-react';

interface CashPositionProps {
  darkMode: boolean;
  cashVaultBalance: number;
  income: number;
  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;
}

export default function CashPosition({
  darkMode,
  cashVaultBalance,
  income,
  formatCurrency,
}: CashPositionProps) {
  const bankBalance = income * 0.72;

  const totalCash =
    cashVaultBalance + bankBalance;

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
          Cash Position
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Available business liquidity.
        </p>

      </div>

      {/* Total */}

      <div className="px-7 pt-8">

        <div className="rounded-3xl bg-gradient-to-br from-[#0F3B23] to-[#185A36] p-7 text-white">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-emerald-100">
                Total Cash Available
              </p>

              <h1 className="mt-3 text-4xl font-bold">
                {formatCurrency(totalCash)}
              </h1>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">

              <Wallet size={30} />

            </div>

          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-emerald-100">

            <ArrowUpRight size={18} />

            +14% compared to last month

          </div>

        </div>

      </div>

      {/* Breakdown */}

      <div className="space-y-5 p-7">

        <div className="flex items-center justify-between rounded-2xl border border-[#ECEEE8] p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">

              <Coins
                size={22}
                className="text-amber-600"
              />

            </div>

            <div>

              <h4 className="font-semibold text-[#14361F]">
                Physical Cash
              </h4>

              <p className="text-sm text-gray-500">
                Cash Vault
              </p>

            </div>

          </div>

          <h3 className="text-lg font-bold text-[#14361F]">
            {formatCurrency(cashVaultBalance)}
          </h3>

        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#ECEEE8] p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">

              <Landmark
                size={22}
                className="text-emerald-700"
              />

            </div>

            <div>

              <h4 className="font-semibold text-[#14361F]">
                Bank Balance
              </h4>

              <p className="text-sm text-gray-500">
                Connected Accounts
              </p>

            </div>

          </div>

          <h3 className="text-lg font-bold text-[#14361F]">
            {formatCurrency(bankBalance)}
          </h3>

        </div>

      </div>
    </section>
  );
}