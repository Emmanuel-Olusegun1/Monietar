// app/dashboard/components/pages/OverviewPage.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, PieChart, Lightbulb,
  Plus, Sparkles, BarChart3, Eye, EyeOff, ArrowUpRight, 
  ArrowDownRight, DollarSign, Receipt, Target,
  CheckCircle, XCircle, AlertCircle, Zap,
  BarChart, AlertTriangle, ChevronRight, Calendar,
  Filter, Search, CreditCard, Building, ShoppingCart,
  Home, Car, Utensils, Heart, Download, RefreshCw,
  Bell, Clock, X, AlertOctagon
} from 'lucide-react';

interface OverviewPageProps {
  financialData: any;
  formatCurrency: (amount: number) => string;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  timeFilters: string[];
  hasTransactionData: boolean;
  themeClasses: any;
  darkMode: boolean;
  showBalance: boolean;
  currency: string;
  language: string;
  user: any;
  aiRecommendations: string[];
  transactions: any[];
  income: number;
  expenses: number;
  profit: number;
  totalTransactions: number;
  setShowIncomeForm: (show: boolean) => void;
  setShowExpenseForm: (show: boolean) => void;
  setShowBudgetForm: (show: boolean) => void;
  CustomTooltip: any;
  onRefresh?: () => void;
  budgets?: Array<{
    id: string;
    category: string;
    budget_limit: number;
    spent: number;
    period: string;
  }>;
  encryptionEnabled?: boolean;
}

// Professional Empty State (unchanged)
const NewUserWelcome = ({ 
  setShowIncomeForm, 
  setShowExpenseForm, 
  darkMode 
}: { 
  setShowIncomeForm: (v: boolean) => void;
  setShowExpenseForm: (v: boolean) => void;
  darkMode: boolean;
}) => (
  <div className="space-y-8">
    {/* Main Empty State */}
    <div className={`text-center py-16 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
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
        <h3 className={`text-2xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome to Monietar
        </h3>
        <p className={`text-lg mb-8 max-w-md mx-auto leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Start tracking your income and expenses to get a complete view of your financial health.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowIncomeForm(true)}
            className={`px-8 py-4 ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-medium rounded-xl mx-12 md:mx-0 transition-colors flex items-center justify-center gap-3`}
          >
            <Plus className="w-5 h-5" />
            Add First Income
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExpenseForm(true)}
            className={`px-8 py-4 border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-700'} mx-12 md:mx-0 font-medium rounded-xl transition-colors flex items-center justify-center gap-3`}
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </motion.button>
        </div>
      </motion.div>
    </div>

    {/* Features Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}
    >
      <div className="text-center mb-10">
        <h3 className={`text-2xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Why Track Your Finances?
        </h3>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Gain powerful insights into your financial health
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: TrendingUp,
            title: "Income Tracking",
            description: "Monitor all your income sources and understand your earning patterns over time",
            color: "emerald"
          },
          {
            icon: TrendingDown,
            title: "Expense Management",
            description: "Categorize and track expenses to identify spending patterns and save money",
            color: "emerald"
          },
          {
            icon: PieChart,
            title: "Financial Insights",
            description: "Get detailed analytics and AI-powered insights to make informed financial decisions",
            color: "emerald"
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={`p-6 rounded-2xl border text-center group hover:shadow-md transition-all duration-300 ${darkMode ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className={`w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl flex items-center justify-center mx-auto mb-4 border ${darkMode ? 'border-gray-600' : 'border-gray-200'} group-hover:scale-105 transition-transform duration-300`}>
              <feature.icon className={`w-7 h-7 text-emerald-600`} />
            </div>
            <h4 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {feature.title}
            </h4>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
    timeFilter,
    setTimeFilter,
    timeFilters = ['daily', 'weekly', 'monthly'],
    hasTransactionData,
    darkMode,
    setShowIncomeForm,
    setShowExpenseForm,
    setShowBudgetForm,
    aiRecommendations = [],
    transactions = [],
    income = 0,
    expenses = 0,
    profit = 0,
    budgets = [],
    CustomTooltip,
    onRefresh,
  } = props;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Enhanced Financial Health Section (unchanged)
  const renderFinancialHealth = () => {
    if (!hasTransactionData) return null;

    const profitMargin = income > 0 ? (profit / income) * 100 : 0;
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;
    const budgetAdherence = 85;

    const healthScore = Math.max(0, Math.min(100, 
      (profitMargin * 0.4) + 
      (Math.max(0, 100 - expenseRatio) * 0.3) + 
      (budgetAdherence * 0.3)
    ));

    const getHealthStatus = (score: number) => {
      if (score >= 80) return { status: 'Excellent', color: 'emerald', icon: CheckCircle };
      if (score >= 60) return { status: 'Good', color: 'blue', icon: CheckCircle };
      if (score >= 40) return { status: 'Fair', color: 'amber', icon: AlertCircle };
      return { status: 'Needs Attention', color: 'red', icon: XCircle };
    };

    const healthStatus = getHealthStatus(healthScore);
    const StatusIcon = healthStatus.icon;

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Financial Health
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Overall business financial wellness
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full bg-${healthStatus.color}-500/10 text-${healthStatus.color}-600 dark:text-${healthStatus.color}-400 text-sm font-medium`}>
            {healthStatus.status}
          </div>
        </div>

        {/* Health Score */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full flex items-center justify-center relative">
              <div className={`absolute inset-0 rounded-full bg-${healthStatus.color}-500/10`}></div>
              
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className={`text-${healthStatus.color}-500/20`} />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${healthScore * 3.51} 351`}
                  className={`text-${healthStatus.color}-500 transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold text-${healthStatus.color}-500`}>
                  {Math.round(healthScore)}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, status: profitMargin >= 20 ? 'excellent' : profitMargin >= 10 ? 'good' : profitMargin >= 0 ? 'fair' : 'poor', icon: TrendingUp },
            { label: 'Expense Ratio', value: `${expenseRatio.toFixed(1)}%`, status: expenseRatio <= 60 ? 'excellent' : expenseRatio <= 80 ? 'good' : expenseRatio <= 100 ? 'fair' : 'poor', icon: TrendingDown },
            { label: 'Budget Adherence', value: `${budgetAdherence.toFixed(0)}%`, status: budgetAdherence >= 80 ? 'excellent' : budgetAdherence >= 60 ? 'good' : budgetAdherence >= 40 ? 'fair' : 'poor', icon: PieChart }
          ].map((metric, index) => {
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'excellent': return 'emerald';
                case 'good': return 'blue';
                case 'fair': return 'amber';
                case 'poor': return 'red';
                default: return 'gray';
              }
            };
            
            const color = getStatusColor(metric.status);
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } bg-gradient-to-br ${
                  darkMode 
                    ? `from-${color}-500/5 to-${color}-500/10` 
                    : `from-${color}-50 to-${color}-100/50`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                    <Icon className={`w-4 h-4 text-${color}-500`} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`}>
                    {metric.status}
                  </span>
                </div>
                <h4 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </h4>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {metric.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Health Recommendations */}
        <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-start space-x-3">
            <Lightbulb className={`w-5 h-5 text-blue-500 mt-0.5`} />
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Health Tips
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {healthScore >= 80 
                  ? "Your finances are in excellent shape! Consider investing surplus funds for growth."
                  : healthScore >= 60
                  ? "You're doing well. Focus on optimizing expenses and increasing profit margins."
                  : healthScore >= 40
                  ? "Monitor your spending closely and review budgets to improve financial health."
                  : "Take immediate action to reduce expenses and increase revenue streams."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Financial Summary Cards (unchanged)
  const renderFinancialSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <motion.div whileHover={{ y: -4, scale: 1.02 }} className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 sm:p-3 rounded-xl bg-emerald-500/10 shadow-inner`}>
            <TrendingUp className="w-5 sm:w-7 h-5 sm:h-7 text-emerald-500" />
          </div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent`}>
          {formatCurrency(income)}
        </h3>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Income</p>
      </motion.div>

      <motion.div whileHover={{ y: -4, scale: 1.02 }} className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 sm:p-3 rounded-xl bg-red-500/10 shadow-inner`}>
            <TrendingDown className="w-5 sm:w-7 h-5 sm:h-7 text-red-500" />
          </div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent`}>
          {formatCurrency(expenses)}
        </h3>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Expenses</p>
      </motion.div>

      <motion.div whileHover={{ y: -4, scale: 1.02 }} className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 sm:p-3 rounded-xl ${profit >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10'} shadow-inner`}>
            <Wallet className={`w-5 sm:w-7 h-5 sm:h-7 ${profit >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
          </div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${profit >= 0 ? 'from-blue-600 to-blue-500' : 'from-red-600 to-red-500'} bg-clip-text text-transparent`}>
          {formatCurrency(Math.abs(profit))}
        </h3>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {profit >= 0 ? 'Net Profit' : 'Net Loss'}
        </p>
      </motion.div>
    </div>
  );

  // Quick Actions (unchanged)
  const renderQuickActions = () => (
    <div className={`rounded-2xl p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your finances in one click</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: "Add Income", description: "Record new revenue", color: "emerald", action: () => setShowIncomeForm(true) },
          { icon: TrendingDown, label: "Add Expense", description: "Track spending", color: "red", action: () => setShowExpenseForm(true) },
          { icon: PieChart, label: "Create Budget", description: "Set spending limits", color: "blue", action: () => setShowBudgetForm(true) }
        ].map((action, index) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className={`flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-300 border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } shadow-sm hover:shadow-md`}
          >
            <div className={`p-3 rounded-lg bg-${action.color}-500/10`}>
              <action.icon className={`w-6 h-6 text-${action.color}-500`} />
            </div>
            <div>
              <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{action.label}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // NEW: Real-time Budget Overview
  const renderBudgetOverview = () => {
    if (budgets.length === 0) return null;

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Budget Overview</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {budgets.length} active budget{budgets.length !== 1 && 's'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBudgetForm(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Budget
          </motion.button>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = budget.budget_limit > 0 ? (budget.spent / budget.budget_limit) * 100 : 0;
            const isExceeded = percentage >= 100;
            const isWarning = percentage >= 80;

            return (
              <div key={budget.id} className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {budget.category}
                  </h4>
                  <span className={`text-sm font-medium ${isExceeded ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      isExceeded ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.budget_limit)}
                  </span>
                  {isExceeded && (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Over budget
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // NEW: Live Alerts
  const renderLiveAlerts = () => {
    const exceeded = budgets.filter(b => b.spent > b.budget_limit);
    const nearLimit = budgets.filter(b => b.spent >= b.budget_limit * 0.8 && b.spent <= b.budget_limit);

    if (exceeded.length === 0 && nearLimit.length === 0) return null;

    return (
      <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-red-500" />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Budget Alerts</h3>
        </div>
        <div className="space-y-3">
          {exceeded.map(b => (
            <div key={b.id} className="flex items-center gap-3 text-red-500">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">{b.category} budget exceeded!</span>
            </div>
          ))}
          {nearLimit.map(b => (
            <div key={b.id} className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{b.category} is almost at limit</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // NEW: Recent Transactions
  const renderRecentTransactions = () => {
    const recent = transactions
      .sort((a: any, b: any) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())
      .slice(0, 6);

    if (recent.length === 0) return null;

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
        <div className="space-y-3">
          {recent.map((tx: any) => (
            <div key={tx.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <DollarSign className={`w-5 h-5 ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tx.category}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tx.description || 'No description'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {new Date(tx.created_at || tx.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // AI Recommendations (unchanged)
  const renderAIRecommendations = () => (
    <div className={`rounded-2xl p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Insights
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Personalized financial recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {aiRecommendations.map((recommendation: string, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-blue-500/30' 
                : 'bg-gradient-to-r from-white to-gray-50/50 border-gray-200 hover:border-blue-500/30'
            } shadow-sm hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              <Lightbulb className={`w-5 h-5 text-blue-500 mt-0.5`} />
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {recommendation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {aiRecommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <Lightbulb className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Add transactions to get AI-powered insights
          </p>
        </div>
      )}
    </div>
  );

  if (!hasTransactionData || transactions.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your financial overview and insights
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowIncomeForm(true)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Income</span>
                <span className="sm:hidden">Income</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExpenseForm(true)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-xl transition-colors border ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'} shadow-sm`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Expense</span>
              </motion.button>
            </div>
          </div>

          <NewUserWelcome setShowIncomeForm={setShowIncomeForm} setShowExpenseForm={setShowExpenseForm} darkMode={darkMode} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Overview
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Monitor your business performance and financial health
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              darkMode 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
            } ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </motion.button>
        </div>

        {/* All Sections Stacked Vertically */}
        <div className="space-y-6">
          {renderFinancialSummary()}
          {renderQuickActions()}
          {renderFinancialHealth()}
          
          {/* NEW FEATURES */}
          {renderLiveAlerts()}
          {renderBudgetOverview()}
          {renderRecentTransactions()}
          {renderAIRecommendations()}
        </div>
      </motion.div>
    </div>
  );
};