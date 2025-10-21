import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Plus,
  ChevronRight,
  Sparkles,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  Search,
  CreditCard,
  Building,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Heart,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  DollarSign,
  BarChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Area, AreaChart } from 'recharts';

interface OverviewPageProps {
  darkMode: boolean;
  themeClasses: any;
  setShowIncomeForm: (show: boolean) => void;
  setShowExpenseForm: (show: boolean) => void;
  setShowBudgetForm: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
}

interface FinancialData {
  income: number;
  expenses: number;
  profit: number;
  aiRecommendations?: string[];
}

interface Budget {
  id: string;
  category: string;
  budget_limit: number;
  spent: number;
  percentage: number;
}

interface Alert {
  message: string;
  priority: 'critical' | 'high' | 'medium';
}

interface CategoryBreakdown {
  income: Array<{
    name: string;
    value: number;
  }>;
}

interface TrendData {
  period: string;
  income: number;
  expenses: number;
}

const categoryColors: { [key: string]: string } = {
  'Salary': '#10b981',
  'Business': '#3b82f6',
  'Shopping': '#8b5cf6',
  'Food': '#f59e0b',
  'Transport': '#ef4444',
  'Housing': '#06b6d4',
  'Healthcare': '#ec4899',
  'Entertainment': '#84cc16',
  'default': '#6b7280'
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export const OverviewPage: React.FC<OverviewPageProps> = ({
  darkMode,
  themeClasses,
  setShowIncomeForm,
  setShowExpenseForm,
  setShowBudgetForm,
  setActiveTab
}) => {
  const [showProfitOnChart, setShowProfitOnChart] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(timeFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0,
    expenses: 0,
    profit: 0,
    aiRecommendations: []
  });
  const [budgetsWithRealTimeTracking, setBudgetsWithRealTimeTracking] = useState<Budget[]>([]);
  const [realTimeAlerts, setRealTimeAlerts] = useState<Alert[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown>({ income: [] });
  const [currentTrendData, setCurrentTrendData] = useState<TrendData[]>([]);

  const timeFilters = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // API Calls
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        financialResponse,
        budgetsResponse,
        alertsResponse,
        categoriesResponse,
        trendsResponse
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/financial/overview?timeFilter=${timeFilter}`),
        fetch(`${API_BASE_URL}/budgets?timeFilter=${timeFilter}`),
        fetch(`${API_BASE_URL}/alerts`),
        fetch(`${API_BASE_URL}/categories/breakdown?type=income&timeFilter=${timeFilter}`),
        fetch(`${API_BASE_URL}/trends?timeFilter=${timeFilter}`)
      ]);

      if (!financialResponse.ok || !budgetsResponse.ok || !alertsResponse.ok || 
          !categoriesResponse.ok || !trendsResponse.ok) {
        throw new Error('Failed to fetch financial data');
      }

      const [
        financialData,
        budgetsData,
        alertsData,
        categoriesData,
        trendsData
      ] = await Promise.all([
        financialResponse.json(),
        budgetsResponse.json(),
        alertsResponse.json(),
        categoriesResponse.json(),
        trendsResponse.json()
      ]);

      setFinancialData(financialData);
      setBudgetsWithRealTimeTracking(budgetsData.budgets || []);
      setRealTimeAlerts(alertsData.alerts || []);
      setCategoryBreakdown(categoriesData);
      setCurrentTrendData(trendsData.trends || []);

    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      // Refresh data after adding transaction
      await fetchFinancialData();
      return await response.json();
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      // Refresh data after deleting budget
      await fetchFinancialData();
    } catch (err) {
      console.error('Error deleting budget:', err);
      throw err;
    }
  };

  // Effects
  useEffect(() => {
    fetchFinancialData();
  }, [timeFilter]);

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasTransactionData = financialData.income > 0 || financialData.expenses > 0;

  const getDataKey = () => {
    switch (timeFilter) {
      case 'daily': return 'period';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'yearly': return 'year';
      default: return 'period';
    }
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg border backdrop-blur-sm ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-lg`}>
          <p className={`font-medium ${themeClasses.text.primary}`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Empty State Component
  const EmptyState = () => (
    <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${themeClasses.border}`}>
      <BarChart className={`w-16 h-16 mx-auto mb-4 ${themeClasses.text.muted}`} />
      <h3 className={`text-2xl font-bold mb-3 ${themeClasses.text.primary}`}>
        No Financial Data Yet
      </h3>
      <p className={`text-lg mb-8 max-w-md mx-auto ${themeClasses.text.secondary}`}>
        Start tracking your income and expenses to unlock powerful insights, charts, and financial recommendations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowIncomeForm(true)}
          className="inline-flex hover:cursor-pointer items-center space-x-3 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus className="w-6 h-6" />
          <span>Add Your First Income</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowExpenseForm(true)}
          className="inline-flex hover:cursor-pointer items-center space-x-3 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
        >
          <TrendingDown className="w-5 h-5" />
          <span>Add Expense</span>
        </motion.button>
      </div>
    </div>
  );

  // Enhanced Empty State for New Users
  const renderEmptyState = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${themeClasses.text.primary} mb-4`}>
          Welcome to Your Financial Dashboard
        </h1>
        <p className={`text-xl max-w-2xl mx-auto ${themeClasses.text.secondary}`}>
          Start tracking your finances, set budgets, and get AI-powered insights to grow your business
        </p>
      </div>

      {/* Enhanced Empty State */}
      <EmptyState />

      {/* Features Section */}
      <div className={`mt-12 p-8 rounded-2xl ${themeClasses.card}`}>
        <h3 className={`text-2xl font-bold text-center mb-8 ${themeClasses.text.primary}`}>
          Why Track Your Finances?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Income Tracking",
              description: "Monitor all revenue streams with detailed categorization and trends",
              color: "emerald"
            },
            {
              icon: TrendingDown,
              title: "Expense Management",
              description: "Track spending patterns and identify cost-saving opportunities",
              color: "emerald"
            },
            {
              icon: PieChart,
              title: "Budget Control",
              description: "Set spending limits and get alerts when approaching budgets",
              color: "emerald"
            },
            {
              icon: Sparkles,
              title: "AI Insights",
              description: "Get personalized financial recommendations and predictions",
              color: "emerald"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <h4 className={`font-bold text-lg mb-3 ${themeClasses.text.primary}`}>
                {feature.title}
              </h4>
              <p className={`text-sm leading-relaxed ${themeClasses.text.secondary}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={themeClasses.text.primary}>Loading financial data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className={`text-xl font-bold mb-2 ${themeClasses.text.primary}`}>Error Loading Data</h3>
          <p className={`mb-4 ${themeClasses.text.secondary}`}>{error}</p>
          <button
            onClick={fetchFinancialData}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Enhanced Financial Health Section
  const renderFinancialHealth = () => {
    if (!hasTransactionData) return null;

    // Calculate financial health metrics
    const profitMargin = financialData.income > 0 ? (financialData.profit / financialData.income) * 100 : 0;
    const expenseRatio = financialData.income > 0 ? (financialData.expenses / financialData.income) * 100 : 0;
    const budgetAdherence = budgetsWithRealTimeTracking.length > 0 
      ? budgetsWithRealTimeTracking.filter(b => b.percentage <= 80).length / budgetsWithRealTimeTracking.length * 100 
      : 100;

    // Overall health score (0-100)
    const healthScore = Math.max(0, Math.min(100, 
      (profitMargin * 0.4) + // 40% weight to profit margin
      (Math.max(0, 100 - expenseRatio) * 0.3) + // 30% weight to expense control
      (budgetAdherence * 0.3) // 30% weight to budget adherence
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
              <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                Financial Health
              </h3>
              <p className={`text-sm ${themeClasses.text.muted}`}>
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
              {/* Background circle */}
              <div className={`absolute inset-0 rounded-full bg-${healthStatus.color}-500/10`}></div>
              
              {/* Progress circle */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className={`text-${healthStatus.color}-500/20`}
                />
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
              
              {/* Score */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold text-${healthStatus.color}-500`}>
                  {Math.round(healthScore)}
                </span>
                <span className={`text-xs ${themeClasses.text.muted}`}>Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Profit Margin',
              value: `${profitMargin.toFixed(1)}%`,
              description: 'Net profit as percentage of revenue',
              status: profitMargin >= 20 ? 'excellent' : profitMargin >= 10 ? 'good' : profitMargin >= 0 ? 'fair' : 'poor',
              icon: TrendingUp
            },
            {
              label: 'Expense Ratio',
              value: `${expenseRatio.toFixed(1)}%`,
              description: 'Expenses as percentage of revenue',
              status: expenseRatio <= 60 ? 'excellent' : expenseRatio <= 80 ? 'good' : expenseRatio <= 100 ? 'fair' : 'poor',
              icon: TrendingDown
            },
            {
              label: 'Budget Adherence',
              value: `${budgetAdherence.toFixed(0)}%`,
              description: 'Budgets within safe limits',
              status: budgetAdherence >= 80 ? 'excellent' : budgetAdherence >= 60 ? 'good' : budgetAdherence >= 40 ? 'fair' : 'poor',
              icon: PieChart
            }
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
                <h4 className={`font-bold text-lg mb-1 ${themeClasses.text.primary}`}>
                  {metric.value}
                </h4>
                <p className={`text-sm font-medium ${themeClasses.text.primary} mb-1`}>
                  {metric.label}
                </p>
                <p className={`text-xs ${themeClasses.text.muted}`}>
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Health Recommendations */}
        <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${themeClasses.text.primary} mb-1`}>
                Health Tips
              </p>
              <p className={`text-xs ${themeClasses.text.muted}`}>
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

  // Enhanced Financial Summary Cards
  const renderFinancialSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Income Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-sm border-l border-gray-700 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 sm:p-3 rounded-xl bg-emerald-500/10 shadow-inner`}>
            <TrendingUp className="w-5 sm:w-7 h-5 sm:h-7 text-emerald-500" />
          </div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent`}>
          {formatCurrency(financialData.income)}
        </h3>
        <p className={`text-sm font-medium ${themeClasses.text.muted}`}>Total Income</p>
      </motion.div>

      {/* Expenses Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-sm border-red-500 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 sm:p-3 rounded-xl bg-red-500/10 shadow-inner`}>
            <TrendingDown className="w-5 sm:w-7 h-5 sm:h-7 text-red-500" />
          </div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent`}>
          {formatCurrency(financialData.expenses)}
        </h3>
        <p className={`text-sm font-medium ${themeClasses.text.muted}`}>Total Expenses</p>
      </motion.div>

      {/* Profit Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-sm border-l border-gray-700 ${
          financialData.profit >= 0 ? 'border-blue-500' : 'border-red-500'
        } ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 sm:p-3 rounded-xl ${
            financialData.profit >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10'
          } shadow-inner`}>
            <Wallet className={`w-5 sm:w-7 h-5 sm:h-7 ${
              financialData.profit >= 0 ? 'text-blue-500' : 'text-red-500'
            }`} />
          </div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${
          financialData.profit >= 0 ? 'from-blue-600 to-blue-500' : 'from-red-600 to-red-500'
        } bg-clip-text text-transparent`}>
          {formatCurrency(Math.abs(financialData.profit))}
        </h3>
        <p className={`text-sm font-medium ${themeClasses.text.muted}`}>
          {financialData.profit >= 0 ? 'Net Profit' : 'Net Loss'}
        </p>
      </motion.div>
    </div>
  );

  // Enhanced Quick Actions
  const renderQuickActions = () => (
    <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
      darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Quick Actions</h3>
          <p className={`text-sm ${themeClasses.text.muted}`}>Manage your finances in one click</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: TrendingUp,
            label: "Add Income",
            description: "Record new revenue",
            color: "emerald",
            action: () => setShowIncomeForm(true)
          },
          {
            icon: TrendingDown,
            label: "Add Expense",
            description: "Track spending",
            color: "red",
            action: () => setShowExpenseForm(true)
          },
          {
            icon: PieChart,
            label: "Create Budget",
            description: "Set spending limits",
            color: "blue",
            action: () => setShowBudgetForm(true)
          }
        ].map((action, index) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className={`flex hover:cursor-pointer items-center space-x-4 p-4 rounded-xl text-left transition-all duration-300 border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } shadow-sm hover:shadow-md`}
          >
            <div className={`p-3 rounded-lg bg-${action.color}-500/10`}>
              <action.icon className={`w-6 h-6 text-${action.color}-500`} />
            </div>
            <div>
              <p className={`font-semibold text-sm ${themeClasses.text.primary}`}>{action.label}</p>
              <p className={`text-xs ${themeClasses.text.muted}`}>{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Enhanced Chart Controls
  const renderChartControls = () => (
    <div className="flex flex-wrap items-center gap-3">
      {/* Time Filter */}
      <div className="flex items-center space-x-1 p-1 rounded-xl bg-gray-500/10 backdrop-blur-sm">
        {timeFilters.map((filter) => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTimeFilter(filter.value);
              setSelectedTimeFilter(filter.value);
            }}
            className={`px-3 py-2 rounded-lg hover:cursor-pointer text-sm font-medium transition-all duration-200 ${
              selectedTimeFilter === filter.value
                ? darkMode 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'bg-black/5 text-gray-900 shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
            }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Chart Type Toggle */}
      <div className="flex items-center  space-x-1 p-1 rounded-xl bg-gray-500/10 backdrop-blur-sm">
        {[
          { value: 'area', label: 'Area', icon: BarChart3 },
          { value: 'line', label: 'Line', icon: TrendingUp }
        ].map((type) => (
          <motion.button
            key={type.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setChartType(type.value as any)}
            className={`px-3 py-2 rounded-lg text-sm hover:cursor-pointer font-medium transition-all duration-200 ${
              chartType === type.value
                ? darkMode 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'bg-black/5 text-gray-900 shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
            }`}
          >
            {type.label}
          </motion.button>
        ))}
      </div>

      {/* Profit Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowProfitOnChart(!showProfitOnChart)}
        className={`flex items-center hover:cursor-pointer space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
          showProfitOnChart
            ? darkMode 
              ? 'bg-blue-500/20 text-blue-400 shadow-sm' 
              : 'bg-blue-500/10 text-blue-600 shadow-sm'
            : darkMode
              ? 'bg-gray-500/10 text-gray-400 hover:text-white hover:bg-white/5'
              : 'bg-gray-500/5 text-gray-600 hover:text-gray-900 hover:bg-black/5'
        }`}
      >
        {showProfitOnChart ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        <span>Profit</span>
      </motion.button>
    </div>
  );

  // Enhanced Chart with Profit
  const renderTrendChart = () => {
    if (!hasTransactionData) {
      return null;
    }

    const formatChartData = (data: any[]) => {
      if (timeFilter !== 'daily') return data.map(item => ({
        ...item,
        profit: item.income - item.expenses
      }));
      
      return data.map(item => ({
        ...item,
        period: new Date(item.period).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        profit: item.income - item.expenses
      }));
    };

    const chartData = formatChartData(currentTrendData);
    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                Financial Performance
              </h3>
              <p className={`text-sm ${themeClasses.text.muted}`}>
                Track your income, expenses, and profit over time
              </p>
            </div>
          </div>
          {renderChartControls()}
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={darkMode ? '#374151' : '#e5e7eb'} 
                opacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey={getDataKey()} 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value).replace(/[^\d.-]/g, '')}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Income */}
              {chartType === 'area' ? (
                <Area 
                  type="monotone"
                  dataKey="income" 
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#incomeGradient)"
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              ) : (
                <Line 
                  type="monotone"
                  dataKey="income" 
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              )}
              
              {/* Expenses */}
              {chartType === 'area' ? (
                <Area 
                  type="monotone"
                  dataKey="expenses" 
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#expenseGradient)"
                  activeDot={{ r: 6, fill: '#ef4444' }}
                />
              ) : (
                <Line 
                  type="monotone"
                  dataKey="expenses" 
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#ef4444' }}
                />
              )}
              
              {/* Profit */}
              {showProfitOnChart && (
                chartType === 'area' ? (
                  <Area 
                    type="monotone"
                    dataKey="profit" 
                    name="Profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#profitGradient)"
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                    strokeDasharray="5 5"
                  />
                ) : (
                  <Line 
                    type="monotone"
                    dataKey="profit" 
                    name="Profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                    strokeDasharray="5 5"
                  />
                )
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Enhanced Budget Tracking Section
  const renderBudgetTracking = () => {
    if (budgetsWithRealTimeTracking.length === 0 || !hasTransactionData) {
      return null;
    }

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                Budget Tracking
              </h3>
              <p className={`text-sm ${themeClasses.text.muted}`}>
                Monitor your spending against limits
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('budgets')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid gap-4">
          {budgetsWithRealTimeTracking.slice(0, 3).map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } ${
                budget.percentage >= 100 
                  ? darkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
                  : budget.percentage >= 80
                  ? darkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
                  : darkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'
              } shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    budget.percentage >= 100 ? 'bg-red-500' :
                    budget.percentage >= 80 ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className={`font-semibold ${themeClasses.text.primary}`}>
                    {budget.category}
                  </span>
                </div>
                <div className={`text-lg font-bold ${
                  budget.percentage >= 100 ? 'text-red-500' :
                  budget.percentage >= 80 ? 'text-amber-500' :
                  'text-blue-500'
                }`}>
                  {Math.round(budget.percentage)}%
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className={themeClasses.text.muted}>
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.budget_limit)}
                  </span>
                  <span className={themeClasses.text.muted}>
                    {formatCurrency(Math.max(0, budget.budget_limit - budget.spent))} left
                  </span>
                </div>
                
                <div className={`w-full rounded-full h-3 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      budget.percentage >= 100 
                        ? 'bg-gradient-to-r from-red-500 to-red-400'
                        : budget.percentage >= 80
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400'
                    }`}
                    style={{ width: `${Math.min(100, budget.percentage)}%` }}
                  />
                </div>

                {budget.percentage >= 80 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center space-x-2 p-3 rounded-lg ${
                      budget.percentage >= 100
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-amber-500/10 border border-amber-500/20'
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 ${
                      budget.percentage >= 100 ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      budget.percentage >= 100 ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'
                    }`}>
                      {budget.percentage >= 100 
                        ? `Budget exceeded by ${formatCurrency(budget.spent - budget.budget_limit)}`
                        : 'Approaching budget limit'
                      }
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced Alerts Section
  const renderAlerts = () => {
    if (realTimeAlerts.length === 0 || !hasTransactionData) {
      return null;
    }

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div>
            <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
              Budget Alerts
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              Action required for your budgets
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {realTimeAlerts.slice(0, 3).map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                alert.priority === 'critical'
                  ? darkMode 
                    ? 'bg-red-500/10 border-red-500/20 hover:border-red-500/30' 
                    : 'bg-red-50 border-red-200 hover:border-red-300'
                  : alert.priority === 'high'
                  ? darkMode 
                    ? 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/30' 
                    : 'bg-amber-50 border-amber-200 hover:border-amber-300'
                  : darkMode 
                    ? 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/30' 
                    : 'bg-blue-50 border-blue-200 hover:border-blue-300'
              } shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.priority === 'critical' ? 'text-red-500' :
                  alert.priority === 'high' ? 'text-amber-500' :
                  'text-blue-500'
                }`} />
                <span className={`font-medium ${themeClasses.text.primary}`}>
                  {alert.message}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced AI Recommendations
  const renderAIRecommendations = () => (
    <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
      darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
              AI Insights
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              Personalized financial recommendations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {financialData.aiRecommendations?.map((recommendation: string, index: number) => (
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
              <div className={`p-2 rounded-lg ${
                index === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                index === 1 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                'bg-purple-500/10 text-purple-600 dark:text-purple-400'
              }`}>
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className={`text-sm leading-relaxed ${themeClasses.text.primary}`}>
                  {recommendation}
                </p>
                <div className={`text-xs mt-2 ${themeClasses.text.muted} flex items-center space-x-2`}>
                  <Sparkles className="w-3 h-3" />
                  <span>AI Analysis • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {(!financialData.aiRecommendations || financialData.aiRecommendations.length === 0) && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <Lightbulb className={`w-8 h-8 ${themeClasses.text.muted}`} />
          </div>
          <p className={`text-sm ${themeClasses.text.muted}`}>
            Add transactions to get AI-powered insights
          </p>
        </div>
      )}
    </div>
  );

  // Enhanced Category Breakdown
  const renderCategoryBreakdown = () => {
    if (categoryBreakdown.income.length === 0 || !hasTransactionData) {
      return null;
    }

    return (
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div>
            <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
              Income Sources
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              Top revenue categories
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {categoryBreakdown.income
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5)
            .map((category: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20"
              >
                <span className={`font-medium text-sm ${themeClasses.text.primary}`}>
                  {category.name}
                </span>
                <span className={`text-sm font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent`}>
                  {formatCurrency(category.value)}
                </span>
              </motion.div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Unified Empty State or Main Content */}
        {!hasTransactionData ? (
          renderEmptyState()
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  Financial Overview
                </h1>
                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Monitor your business performance and financial health
                </p>
              </div>
            </div>

            {/* All Sections Stacked Vertically */}
            <div className="space-y-6">
              {/* Financial Summary Cards */}
              {renderFinancialSummary()}

              {/* Quick Actions */}
              {renderQuickActions()}

              {/* Financial Health */}
              {renderFinancialHealth()}

              {/* Income vs Expenses Chart with Profit */}
              {renderTrendChart()}

              {/* Budget Tracking */}
              {renderBudgetTracking()}

              {/* Alerts */}
              {renderAlerts()}

              {/* AI Recommendations and Category Breakdown Side by Side on larger screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderAIRecommendations()}
                {renderCategoryBreakdown()}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};