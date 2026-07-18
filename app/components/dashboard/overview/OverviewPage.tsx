'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
} from 'lucide-react';

import ExecutiveKPIs from './ExecutiveKPIs';
import BusinessHealth from './BusinessHealth';
import CashPosition from './CashPosition';
import ProfitTrend from './ProfitTrend';
import TodaysPerformance from './TodaysPerformance';
import AIExecutiveSummary from './AIExecutiveSummary';
import InventorySnapshot from './InventorySnapshot';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import AIAlerts from './AIAlerts';
import FinancialRatios from './FinancialRatios';
import SystemStatus from './SystemStatus';

import type {
  FinancialData,
  Transaction,
  Recommendation,
  BankSyncStatus,
} from './types';

interface DashboardData {
  financialData: FinancialData;
  transactions: Transaction[];
  recommendations: Recommendation[];

  summary: {
    income: number;
    expenses: number;
    profit: number;
    cashVaultBalance: number;
  };

  system: {
    inventoryAlerts: number;
    activeCurrencies: string[];
    bankSyncStatus: BankSyncStatus;
  };
}

interface OverviewPageProps {
  darkMode: boolean;
  dashboard: DashboardData;
  hasTransactionData: boolean;
}

const formatCurrency = (
  amount: number,
  currency = 'NGN'
) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export default function OverviewPage({
  darkMode,
  dashboard,
  hasTransactionData,
}: OverviewPageProps) {
  if (!hasTransactionData) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="max-w-xl rounded-[32px] border border-[#E8ECE6] bg-white p-14 text-center">

          <h1 className="mb-4 text-4xl font-bold text-[#14361F]">
            Welcome to Monietar
          </h1>

          <p className="text-lg leading-8 text-gray-500">
            Start recording income,
            expenses and inventory to
            unlock your AI business
            dashboard.
          </p>

        </div>

      </div>
    );
  }

  const today = new Date().toLocaleDateString(
    'en-NG',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <div className="w-full min-h-screen bg-[#F6F8F4]">

      <div className="mx-auto w-full max-w-[1700px] space-y-8">

        {/* Hero */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: .45,
          }}
          className="rounded-[30px] border border-[#E8ECE6] bg-white p-8"
        >

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-4xl font-bold text-[#14361F]">
                Good Morning 👋
              </h1>

              <p className="mt-2 text-lg text-gray-500">
                Here's your business
                performance for today.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-4">

              <div className="flex items-center gap-3 rounded-2xl border border-[#E8ECE6] bg-[#F8FAF7] px-5 py-4">

                <CalendarDays
                  className="text-[#14361F]"
                  size={20}
                />

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Today
                  </p>

                  <p className="font-semibold text-[#14361F]">
                    {today}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#14361F] px-5 py-4 text-white">

                <div>

                  <p className="text-xs opacity-70">
                    Monietar AI
                  </p>

                  <p className="font-semibold">
                    Business Healthy
                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.section>

        {/* Executive KPI */}

        <ExecutiveKPIs
          darkMode={darkMode}
          income={dashboard.summary.income}
          expenses={dashboard.summary.expenses}
          profit={dashboard.summary.profit}
          cashVaultBalance={
            dashboard.summary.cashVaultBalance
          }
          activeCurrencies={
            dashboard.system.activeCurrencies
          }
          formatCurrency={formatCurrency}
        />


          <div>
            <TodaysPerformance
              darkMode={darkMode}
              financialData={
                dashboard.financialData
              }
              formatCurrency={formatCurrency}
            />

          </div>

        {/* Business Health + Cash */}

        <section>

          <div className='mb-6'>

            <BusinessHealth
              darkMode={darkMode}
              financialData={{
                revenueHealth:
                  dashboard.summary.income > 0
                    ? 92
                    : 42,

                profitHealth:
                  dashboard.summary.profit > 0
                    ? 88
                    : 40,

                inventoryHealth:
                  dashboard.financialData.inventory
                    ? 85
                    : 100,

                cashFlowHealth:
                  dashboard.summary
                    .cashVaultBalance > 0
                    ? 90
                    : 50,

                aiConfidence: 98,

                bankConnected:
                  dashboard.system
                    .bankSyncStatus ===
                  'connected',
              }}
            />

          </div>

          <div>

            {/* <CashPosition
              darkMode={darkMode}
              cashVaultBalance={
                dashboard.summary.cashVaultBalance
              }
              income={
                dashboard.summary.income
              }
              formatCurrency={formatCurrency}
            /> */}

          </div>

        </section>
                {/* Profit Trend */}

        <section>
          <div className='mb-6'>

            <ProfitTrend
              darkMode={darkMode}
              financialData={
                dashboard.financialData
              }
              formatCurrency={formatCurrency}
            />

          </div>

        

        </section>

        {/* AI Summary */}

        <section className="grid grid-cols-12 gap-6">

          <div className="col-span-12 xl:col-span-8">

            <AIExecutiveSummary
              darkMode={darkMode}
              recommendations={dashboard.recommendations.map(
                (item) => item.title
              )}
            />

          </div>

          <div className="col-span-12 xl:col-span-4">

            <InventorySnapshot
              darkMode={darkMode}
              financialData={
                dashboard.financialData
              }
              formatCurrency={formatCurrency}
            />

          </div>

        </section>

        {/* Transactions */}

        <section>

          <div className='mb-6'>

            <RecentTransactions
              darkMode={darkMode}
              transactions={
                dashboard.transactions
              }
              formatCurrency={formatCurrency}
            />

          </div>

          <div>

            <AIAlerts
              darkMode={darkMode}
              inventoryAlerts={
                dashboard.system.inventoryAlerts
              }
              bankSyncStatus={
                dashboard.system.bankSyncStatus
              }
            />

          </div>

        </section>

        {/* Quick Actions */}

        <section>

          <QuickActions
            darkMode={darkMode}
          />

        </section>

        {/* Footer */}

        <section>

          <div className='mb-6'>

            <FinancialRatios
              darkMode={darkMode}
              financialData={
                dashboard.financialData
              }
            />

          </div>

          <div>

            <SystemStatus
              darkMode={darkMode}
              bankSyncStatus={
                dashboard.system.bankSyncStatus
              }
              activeCurrencies={
                dashboard.system.activeCurrencies
              }
            />

          </div>

        </section>

      </div>

    </div>

  );
}