'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Sparkles,
  CreditCard,
  Coins,
  Globe,
  RefreshCw,
  Banknote,
  AlertCircle
} from 'lucide-react';

interface OverviewPageProps {
  financialData?: any;
  formatCurrency: (amount: number, currency?: string) => string;
  timeFilter?: string;
  setTimeFilter?: (filter: string) => void;
  timeFilters?: string[];
  hasTransactionData: boolean;
  themeClasses?: any;
  darkMode: boolean;
  showBalance?: boolean;
  currency?: string;
  language?: string;
  user?: any;
  aiRecommendations?: any[];
  aiInsightsLoading?: boolean;
  transactions?: any[];
  income?: number;
  expenses?: number;
  profit?: number;
  totalTransactions?: number;
  setShowIncomeForm: (show: boolean) => void;
  setShowExpenseForm: (show: boolean) => void;
  setShowBudgetForm?: (show: boolean) => void;
  CustomTooltip?: any;
  onRefresh?: () => void;
  budgets?: Array<{
    id: string;
    category: string;
    budget_limit: number;
    spent: number;
    period: string;
  }>;
  encryptionEnabled?: boolean;
  bankSyncStatus?: 'connected' | 'syncing' | 'error';
  cashVaultBalance?: number;
  inventoryAlerts?: number;
  activeCurrencies?: string[];
}

// Professional Empty State
const NewUserWelcome = ({
  setShowIncomeForm,
  setShowExpenseForm,
  darkMode
}: {
  setShowIncomeForm: (v: boolean) => void;
  setShowExpenseForm: (v: boolean) => void;
  darkMode: boolean;
}) => (
  <div className="space-y-8 w-full px-4 sm:px-6 lg:px-8">
    <div
      className={`text-center py-16 rounded-2xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}
    >
      <div className="flex items-center justify-center flex-shrink-0 px-6 pb-8">
        <div className="w-[180px] flex items-center justify-center relative">
          <Image
            src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
            alt="Monietar Logo"
            width={260}
            height={60}
            className="object-contain"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3
          className={`text-2xl font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Welcome to Monietar
        </h3>
        <p
          className={`text-lg mb-8 max-w-md mx-auto leading-relaxed ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Connect your bank accounts, cash vault, and multi-currency flows for
          automatic, hands-free financial intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowIncomeForm(true)}
            className={`px-8 py-4 ${
              darkMode
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            } text-white font-medium rounded-xl mx-12 md:mx-0 transition-colors flex items-center justify-center gap-3`}
          >
            <Plus className="w-5 h-5" />
            Log First Transaction
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExpenseForm(true)}
            className={`px-8 py-4 border ${
              darkMode
                ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            } mx-12 md:mx-0 font-medium rounded-xl transition-colors flex items-center justify-center gap-3`}
          >
            <Plus className="w-5 h-5" />
            Record Cash Sale
          </motion.button>
        </div>
      </motion.div>
    </div>

    {/* Features Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`p-8 rounded-2xl ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border shadow-sm`}
    >
      <div className="text-center mb-10">
        <h3
          className={`text-2xl font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          The MONIETAR Matrix
        </h3>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          One unified ledger for bank transfers, physical cash &amp; cross-border
          flows
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: CreditCard,
            title: 'Bank Sync',
            description:
              'Automatic midnight imports from your merchant bank accounts',
            color: 'text-emerald-600'
          },
          {
            icon: Coins,
            title: 'Physical Cash Vault',
            description: 'Track daily cash sales and payouts in real time',
            color: 'text-amber-600'
          },
          {
            icon: Globe,
            title: 'Dual Currency',
            description: 'Naira ↔ CFA with parallel market rate automation',
            color: 'text-blue-600'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={`p-6 rounded-2xl border text-center group hover:shadow-md transition-all duration-300 ${
              darkMode
                ? 'bg-gray-750 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div
              className={`w-16 h-16 ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              } rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              } group-hover:scale-105 transition-transform duration-300`}
            >
              <feature.icon className={`w-7 h-7 ${feature.color}`} />
            </div>
            <h4
              className={`font-semibold text-lg mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {feature.title}
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export const OverviewPage: React.FC<OverviewPageProps> = (props) => {
  const {
    formatCurrency,
    hasTransactionData,
    darkMode,
    setShowIncomeForm,
    setShowExpenseForm,
    aiRecommendations = [],
    transactions = [],
    income = 0,
    expenses = 0,
    profit = 0,
    cashVaultBalance = 25600000
  } = props;

  const recentTransactions = transactions.slice(0, 5);
  const crossBorderEquivalent = 1500000;

  // Mathematically accurate total calculation
  const totalCombined = income + cashVaultBalance + crossBorderEquivalent;

  // Breakdown array with figures summing exactly to 215,500
  const spendingBreakdown = [
    { label: 'Inventory Restock', amount: 68960, percent: '32%', color: 'bg-emerald-600' },
    { label: 'Operating Costs', amount: 43100, percent: '20%', color: 'bg-emerald-500' },
    { label: 'Staff Payouts', amount: 38790, percent: '18%', color: 'bg-amber-500' },
    { label: 'Logistics', amount: 30170, percent: '14%', color: 'bg-teal-500' },
    { label: 'Marketing', amount: 8620, percent: '4%', color: 'bg-amber-600' },
    { label: 'Minor Payouts', amount: 25860, percent: '12%', color: 'bg-gray-400' }
  ];

  const totalSpent = spendingBreakdown.reduce((acc, curr) => acc + curr.amount, 0); // 215,500

  const formatTransactionDate = (value?: string) => {
    if (!value) return 'Just now';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Just now';

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderFinancialSummary = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5 w-full">
        {/* Physical Cash Vault Card */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            darkMode
              ? 'bg-gray-800/60 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Coins className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Physical Cash Vault
            </span>
          </div>
          <h3
            className={`text-[1.35rem] xl:text-2xl font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-gray-950'
            } break-words`}
          >
            {formatCurrency(cashVaultBalance)}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-500 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.3% vs. last week</span>
          </div>
        </div>

        {/* Bank Transfer Ledger */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            darkMode
              ? 'bg-gray-800/60 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CreditCard className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Bank Transfer Ledger
            </span>
          </div>
          <h3
            className={`text-[1.35rem] xl:text-2xl font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-gray-950'
            } break-words`}
          >
            {formatCurrency(income)}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-500 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.7% vs. last week</span>
          </div>
        </div>

        {/* Cross-Border Reserves */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            darkMode
              ? 'bg-gray-800/60 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Globe className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Cross-Border Reserves
            </span>
          </div>
          <h3
            className={`text-[1.35rem] xl:text-2xl font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-gray-950'
            } break-words`}
          >
            CFA 3,250,000
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatCurrency(crossBorderEquivalent)} equiv.
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-500 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+15.5% vs. last week</span>
          </div>
        </div>

        {/* Highlighted Total Combined Balance Block */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-950 to-teal-900 border border-emerald-800 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[13rem]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins className="w-32 h-32 transform translate-x-8 translate-y-8" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-medium mb-1">
              <span>Total Combined Balance</span>
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400/70" />
            </div>
            <h2 className="text-[1.9rem] xl:text-3xl font-extrabold tracking-tight break-words leading-none">
              {formatCurrency(totalCombined)}
            </h2>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300">
              +10.1%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderMiddleAnalytics = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,0.95fr)] gap-4 xl:gap-5 w-full">
        {/* Spending & Inventory Doughnut / Category Breakdown */}
        <div
          className={`rounded-2xl p-5 xl:p-6 border flex flex-col justify-between ${
            darkMode
              ? 'bg-gray-800/40 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h3
                className={`font-bold text-lg xl:text-xl ${
                  darkMode ? 'text-white' : 'text-gray-950'
                }`}
              >
                Spending &amp; Inventory Overview
              </h3>
              <p className="text-xs mt-1 text-gray-500">
                Total spent:{' '}
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(totalSpent)}
                </span>
              </p>
            </div>
            <select
              className={`text-xs rounded-lg px-2.5 py-1.5 border shadow-sm ${
                darkMode
                  ? 'bg-gray-750 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <option>The Week</option>
              <option>The Month</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Visual Donut Simulation */}
            <div className="md:col-span-2 flex flex-col items-center justify-center relative">
              <div className="w-40 h-40 rounded-full border-8 border-emerald-600/25 border-t-emerald-500 border-r-amber-500 border-l-teal-600 flex flex-col items-center justify-center bg-white/40 dark:bg-transparent">
                <span className="text-[10px] text-gray-500 uppercase font-medium tracking-wide">
                  Top Category
                </span>
                <span
                  className={`text-[11px] font-bold text-center px-4 truncate max-w-full ${
                    darkMode ? 'text-white' : 'text-gray-950'
                  }`}
                >
                  Inventory Restock
                </span>
              </div>
            </div>

            {/* List breakdown */}
            <div className="md:col-span-3 space-y-2">
              {spendingBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span
                      className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-semibold">
                    <span
                      className={darkMode ? 'text-white' : 'text-gray-950'}
                    >
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-gray-400">{item.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side segment: Immediate P&L and Quick Actions */}
        <div className="flex flex-col gap-4 xl:gap-5">
          {/* Automated P&L Tracker */}
          <div className="rounded-2xl p-5 xl:p-6 bg-gradient-to-br from-[#0c1a0d] to-[#102716] border border-emerald-950/40 text-white shadow-lg flex flex-col justify-between min-h-[13rem]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                <span>AUTOMATED PROFIT &amp; LOSS</span>
              </div>
              <p className="text-xs text-gray-400">Immediate net profit</p>
              <h3 className="text-[2rem] xl:text-[2.2rem] font-extrabold text-white mt-1 leading-none">
                {formatCurrency(profit || income - (expenses || totalSpent))}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-800">
              <span>
                Margin: <strong className="text-emerald-400">35.7%</strong>
              </span>
              <span>Updated 2m ago</span>
            </div>
          </div>

          {/* Quick Actions Tray */}
          <div
            className={`rounded-2xl p-5 border ${
              darkMode
                ? 'bg-gray-800/40 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <h4
              className={`text-sm font-bold mb-4 uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Register Sales',
                  action: () => setShowIncomeForm(true),
                  icon: Banknote
                },
                {
                  label: 'Update Inventory',
                  action: () => {},
                  icon: RefreshCw
                },
                {
                  label: 'Log Payouts',
                  action: () => setShowExpenseForm(true),
                  icon: ArrowDownRight
                },
                {
                  label: 'Generate Report',
                  action: () => {},
                  icon: Receipt
                }
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                    darkMode
                      ? 'bg-gray-800/30 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 text-white'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white text-gray-900'
                  }`}
                >
                  <btn.icon className="w-5 h-5 text-emerald-500 mb-1.5" />
                  <span className="text-xs font-semibold">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBorderlessInsights = () => {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] gap-4 xl:gap-5 w-full">
        <div
          className={`rounded-2xl p-5 xl:p-6 border ${
            darkMode
              ? 'bg-gray-800/30 border-gray-700'
              : 'bg-white border-gray-200'
          } w-full`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Borderless Insights
              </span>
              <h3
                className={`font-bold text-lg flex items-center gap-1.5 mt-0.5 ${
                  darkMode ? 'text-white' : 'text-gray-950'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                AI Recommendations
              </h3>
            </div>
            <button className="text-xs text-emerald-600 font-semibold hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  } flex items-start gap-3`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Optimization Step
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{rec}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div
                  className={`p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  } flex items-start gap-3`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Optimize FX (USD rate)
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Automated parallel matching can increase margins by 2.4%
                    </p>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  } flex items-start gap-3`}
                >
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Low-Stock Alert
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Inventory levels are running low on top sellers
                    </p>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  } flex items-start gap-3`}
                >
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Audit-Ready Statement
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Generated summary matches standard sub-Saharan audit templates
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className={`rounded-2xl p-5 xl:p-6 border ${
            darkMode
              ? 'bg-white/5 border-gray-700'
              : 'bg-white border-gray-200'
          } w-full`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Recent Transactions
              </span>
              <h3
                className={`font-bold text-lg mt-0.5 ${
                  darkMode ? 'text-white' : 'text-gray-950'
                }`}
              >
                Latest activity
              </h3>
            </div>
            <button className="text-xs text-emerald-600 font-semibold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => {
                const rawAmount = Number(
                  transaction?.amount ??
                    transaction?.total ??
                    transaction?.value ??
                    0
                );
                const isIncome =
                  rawAmount >= 0 || transaction?.type === 'income';
                const displayAmount = formatCurrency(Math.abs(rawAmount));

                return (
                  <div
                    key={transaction?.id ?? index}
                    className={`flex items-center justify-between rounded-xl border px-3 py-3 ${
                      darkMode
                        ? 'bg-gray-800/40 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-700 border border-gray-200'
                        }`}
                      >
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            darkMode ? 'text-white' : 'text-gray-950'
                          }`}
                        >
                          {transaction?.description ||
                            transaction?.category ||
                            'Transaction'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {transaction?.category || 'General'} ·{' '}
                          {formatTransactionDate(
                            transaction?.date || transaction?.created_at
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {displayAmount}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={`rounded-xl border px-4 py-10 text-center ${
                  darkMode
                    ? 'bg-gray-800/40 border-gray-700 text-gray-300'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!hasTransactionData || transactions.length === 0) {
    return (
      <div className="min-h-screen pb-20 w-full">
        <NewUserWelcome
          setShowIncomeForm={setShowIncomeForm}
          setShowExpenseForm={setShowExpenseForm}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-20 w-full px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-transparent' : 'bg-[#F3F5EF]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 w-full pt-4"
      >
        {/* Content Modules */}
        <div className="space-y-6 w-full">
          {renderFinancialSummary()}
          {renderMiddleAnalytics()}
          {renderBorderlessInsights()}
        </div>
      </motion.div>
    </div>
  );
};