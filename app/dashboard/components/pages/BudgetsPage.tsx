'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Plus,
  Search,
  Calendar,
  Clock,
  Target,
  BarChart3,
  Download
} from 'lucide-react';
import { EnhancedBudget } from '@/app/dashboard/types/budget';
import { Budget } from '@/app/dashboard/types';
import { Dispatch, SetStateAction } from 'react';

// Define EnhancedBudget locally since it doesn't exist in types
// interface EnhancedBudget {
//   id: string;
//   category: string;
//   budget_limit: number;
//   spent: number;
//   percentage: number;
//   period: 'daily' | 'weekly' | 'monthly' | 'yearly';
//   created_at: string;
// }

export interface BudgetsPageProps {
  budgetsWithRealTimeTracking: EnhancedBudget[];
  formatCurrency: (amount: number) => string;
  setShowBudgetForm: () => void;
  startEditBudget: (budget: EnhancedBudget) => void;
  setDeleteBudgetId: Dispatch<SetStateAction<string | null>>;
  editingBudget: Budget | null;
  deleteBudgetId: string | null;
  themeClasses: any;
  darkMode: boolean;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({
  budgetsWithRealTimeTracking,
  formatCurrency,
  setShowBudgetForm,
  startEditBudget,
  setDeleteBudgetId,
  darkMode,
  themeClasses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-track' | 'warning' | 'exceeded'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'percentage' | 'date'>('date');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Filter and search budgets - now uses period directly for filtering
  const filteredBudgets = useMemo(() => {
    return budgetsWithRealTimeTracking
      .filter(budget => {
        const matchesSearch = budget.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDuration = durationFilter === 'all' || budget.period === durationFilter;
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'on-track' && budget.percentage < 80) ||
          (statusFilter === 'warning' && budget.percentage >= 80 && budget.percentage < 100) ||
          (statusFilter === 'exceeded' && budget.percentage >= 100);
        
        return matchesSearch && matchesDuration && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.category.localeCompare(b.category);
          case 'amount':
            return b.budget_limit - a.budget_limit;
          case 'percentage':
            return b.percentage - a.percentage;
          case 'date':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return 0;
        }
      });
  }, [budgetsWithRealTimeTracking, searchQuery, durationFilter, statusFilter, sortBy]);

  // Get status color based on percentage
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 80) return 'text-amber-500';
    if (percentage >= 50) return 'text-emerald-500';
    return 'text-blue-500';
  };

  // Get status background color
  const getStatusBgColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    if (percentage >= 50) return 'bg-emerald-500';
    return 'bg-blue-500';
  };

  // Get status icon
  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (percentage >= 80) return <TrendingUp className="w-4 h-4 text-amber-500" />;
    return <TrendingDown className="w-4 h-4 text-emerald-500" />;
  };

  // Get status text
  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 80) return 'Warning';
    if (percentage >= 50) return 'On Track';
    return 'Good';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get period icon
  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <BarChart3 className="w-4 h-4" />;
      case 'yearly': return <Target className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalBudgets = filteredBudgets.length;
    const totalBudget = filteredBudgets.reduce((sum, b) => sum + b.budget_limit, 0);
    const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
    const exceededBudgets = filteredBudgets.filter(b => b.percentage >= 100).length;
    const warningBudgets = filteredBudgets.filter(b => b.percentage >= 80 && b.percentage < 100).length;

    return {
      totalBudgets,
      totalBudget,
      totalSpent,
      exceededBudgets,
      warningBudgets
    };
  }, [filteredBudgets]);

  if (!budgetsWithRealTimeTracking || budgetsWithRealTimeTracking.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              Budget Management
            </h2>
            <p className={`mt-2 ${themeClasses.text.secondary}`}>
              Track your spending against budget limits and get alerts when approaching limits
            </p>
          </div>
        </div>

        {/* Empty State - Exactly like AccountsPage */}
        <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${themeClasses.border}`}>
          <PieChart className={`w-16 h-16 mx-auto mb-4 ${themeClasses.text.muted}`} />
          <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
            No budgets created
          </h3>
          <p className={`mb-6 max-w-sm mx-auto ${themeClasses.text.secondary}`}>
            Create budgets to track your spending, set limits, and get smart alerts when you're approaching your limits.
          </p>
          <button
          onClick={() => setShowBudgetForm()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Budget</span>
          </button>
        </div>

        {/* Features Section - Exactly like AccountsPage */}
        <div className={`mt-8 p-6 rounded-2xl ${themeClasses.card}`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Why Create Budgets?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Spending Control</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Set limits for different categories and avoid overspending
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Smart Alerts</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Get notified when you're approaching budget limits
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Progress Tracking</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Monitor your budget usage with visual progress bars
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              Budget Management
            </h2>
            <p className={`mt-2 ${themeClasses.text.secondary}`}>
              Track your spending against budget limits and get alerts when approaching limits
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBudgetForm()}
            className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm font-medium hover:cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Budget</span>
          </motion.button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Total Budgets</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {summaryStats.totalBudgets}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Total Budget</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(summaryStats.totalBudget)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Total Spent</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(summaryStats.totalSpent)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Alerts</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {summaryStats.warningBudgets + summaryStats.exceededBudgets}
                </p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search budgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Periods</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="on-track">On Track</option>
                <option value="warning">Warning</option>
                <option value="exceeded">Exceeded</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="amount">Sort by Amount</option>
                <option value="percentage">Sort by Usage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budgets Grid */}
        <div className="grid gap-6">
          {filteredBudgets.map((budget, index) => (
            <motion.div
              key={budget.id || budget.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>
                          {budget.category}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center space-x-1">
                            {getPeriodIcon(budget.period)}
                            <span className={`text-sm capitalize ${themeClasses.text.secondary}`}>
                              {budget.period}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${themeClasses.text.secondary}`}>
                              Created {formatDate(budget.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(budget.percentage)}
                            <span className={`text-sm font-medium ${getStatusColor(budget.percentage)}`}>
                              {getStatusText(budget.percentage)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEditBudget(budget)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteBudgetId(budget.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.budget_limit)}
                      </span>
                      <span className={`text-sm font-semibold ${getStatusColor(budget.percentage)}`}>
                        {Math.round(budget.percentage)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getStatusBgColor(budget.percentage)}`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>

                    {/* Remaining Amount */}
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${themeClasses.text.secondary}`}>
                        Remaining: {formatCurrency(Math.max(0, budget.budget_limit - budget.spent))}
                      </span>
                      {budget.percentage >= 100 && (
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Over budget by {formatCurrency(budget.spent - budget.budget_limit)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Alert */}
                  {budget.percentage >= 80 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mt-4 p-3 rounded-lg border ${
                        budget.percentage >= 100
                          ? 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800'
                          : 'bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          budget.percentage >= 100 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          budget.percentage >= 100 ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'
                        }`}>
                          {budget.percentage >= 100 
                            ? 'Budget limit exceeded! Consider adjusting your budget.'
                            : 'Budget limit approaching! Monitor your spending closely.'
                          }
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredBudgets.length === 0 && budgetsWithRealTimeTracking.length > 0 && (
          <div className={`text-center py-12 rounded-2xl border-2 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-white/50 border-gray-200'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              No budgets found
            </h3>
            <p className={`mb-4 ${themeClasses.text.secondary}`}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDurationFilter('all');
                setStatusFilter('all');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};