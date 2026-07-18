'use client';

import {
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
} from 'lucide-react';

import type { Transaction } from './types';

interface RecentTransactionsProps {
  darkMode: boolean;
  transactions: Transaction[];
  formatCurrency: (
    amount: number,
    currency?: string
  ) => string;
}

export default function RecentTransactions({
  darkMode,
  transactions,
  formatCurrency,
}: RecentTransactionsProps) {
  const recent =
    transactions.slice(0, 8);

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
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest financial activities
          </p>

        </div>

        <button className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium transition hover:bg-[#F7F9F5]">
          View All
        </button>

      </div>

      {/* Empty */}

      {recent.length === 0 && (

        <div className="py-20 text-center">

          <h3 className="text-lg font-semibold text-[#14361F]">
            No Transactions Yet
          </h3>

          <p className="mt-2 text-gray-500">
            Your recent transactions will appear here.
          </p>

        </div>

      )}

      {/* Table */}

      {recent.length > 0 && (

        <div>

          {recent.map((transaction) => {

            const income =
              transaction.type === 'income';

            return (

              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-[#F2F4F1] px-7 py-5 transition hover:bg-[#FAFBF9] last:border-0"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      income
                        ? 'bg-emerald-100'
                        : 'bg-red-100'
                    }`}
                  >

                    {income ? (

                      <ArrowDownLeft
                        size={20}
                        className="text-emerald-700"
                      />

                    ) : (

                      <ArrowUpRight
                        size={20}
                        className="text-red-600"
                      />

                    )}

                  </div>

                  <div>

                    <h4 className="font-semibold text-[#14361F]">
                      {transaction.description}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      {transaction.category}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <h4
                    className={`font-bold ${
                      income
                        ? 'text-emerald-600'
                        : 'text-red-500'
                    }`}
                  >
                    {income ? '+' : '-'}
                    {formatCurrency(
                      transaction.amount
                    )}
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(
                      transaction.date
                    ).toLocaleDateString()}
                  </p>

                </div>

                <button className="rounded-xl p-2 transition hover:bg-[#F2F4F1]">

                  <MoreHorizontal
                    size={18}
                    className="text-gray-500"
                  />

                </button>

              </div>

            );
          })}

        </div>

      )}
    </section>
  );
}