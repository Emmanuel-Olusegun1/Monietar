// components/pages/TransactionsPage.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  TrendingUp, 
  CreditCard, 
  TrendingDown, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Heart,
  BarChart3,
  Receipt
} from 'lucide-react';
import { Transaction } from '@/app/dashboard/types';

interface TransactionsPageProps {
  financialData: any;
  formatCurrency: (amount: number) => string;
  setShowIncomeForm: (show: boolean) => void;
  setShowExpenseForm: (show: boolean) => void;
  editingTransaction: Transaction | null;
  deleteTransactionId: string | null;
  startEditTransaction: (transaction: any) => void;
  setDeleteTransactionId: (id: string) => void;
  darkMode: boolean;
  themeClasses: any;
  EmptyState: any;
}

const categoryIcons: { [key: string]: any } = {
  'Salary': TrendingUp,
  'Business': Building,
  'Shopping': ShoppingCart,
  'Food': Utensils,
  'Transport': Car,
  'Housing': Home,
  'Healthcare': Heart,
  'Entertainment': CreditCard,
  'default': CreditCard
};

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  financialData,
  formatCurrency,
  setShowIncomeForm,
  setShowExpenseForm,
  startEditTransaction,
  setDeleteTransactionId,
  darkMode,
  themeClasses,
  EmptyState
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Filter and sort transactions - UPDATED FOR SUPABASE
  const filteredTransactions = useMemo(() => {
    if (!financialData?.transactions) return [];
    
    let transactions = financialData.transactions.filter((transaction: any) => {
      const matchesSearch = 
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    });

    // Sort transactions - UPDATED FOR SUPABASE DATE FIELD
    transactions.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'date':
        default:
          // Handle both date and created_at fields from Supabase
          aValue = new Date(a.date || a.created_at || Date.now()).getTime();
          bValue = new Date(b.date || b.created_at || Date.now()).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return transactions;
  }, [financialData.transactions, searchTerm, filterType, sortBy, sortOrder]);

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || categoryIcons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  const toggleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // UPDATED FOR SUPABASE - Added null checks
  const stats = useMemo(() => {
    if (!filteredTransactions) return { totalIncome: 0, totalExpenses: 0, net: 0 };
    
    const totalIncome = filteredTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    
    const totalExpenses = filteredTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
  }, [filteredTransactions]);

  // ADDED: Helper function to format date from Supabase
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // ADDED: Helper function to get display description
  const getDisplayDescription = (transaction: any) => {
    return transaction.description || transaction.notes || 'No description';
  };

  return (
    <div className="min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              Transactions
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and track all your financial activities
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Add Income Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowIncomeForm(true)}
              className="flex items-center hover:cursor-pointer space-x-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg border border-emerald-500"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Income</span>
              <span className="sm:hidden">Income</span>
            </motion.button>

            {/* Add Expense Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExpenseForm(true)}
              className={`flex items-center hover:cursor-pointer space-x-2 px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 border ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Expense</span>
            </motion.button>
          </div>
        </div>

        {/* Show empty state when no transactions exist - UPDATED FOR SUPABASE */}
        {!financialData?.transactions || financialData.transactions.length === 0 ? (
          <div className="space-y-6">
            {/* Empty State - Exactly like AccountsPage */}
            <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${themeClasses.border}`}>
              <Receipt className={`w-16 h-16 mx-auto mb-4 ${themeClasses.text.muted}`} />
              <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
                No transactions recorded
              </h3>
              <p className={`mb-6 max-w-sm mx-auto ${themeClasses.text.secondary}`}>
                Start tracking your income and expenses to get a complete view of your financial health.
              </p>
              <button
                onClick={() => setShowIncomeForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Record Your First Transaction</span>
              </button>
            </div>

            {/* Features Section - Exactly like AccountsPage */}
            <div className={`mt-8 p-6 rounded-2xl ${themeClasses.card}`}>
              <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
                Why Track Transactions?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Income Tracking</h4>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    Monitor all your income sources and understand your earning patterns
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingDown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Expense Management</h4>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    Categorize and track expenses to identify spending patterns
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Financial Insights</h4>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    Get detailed analytics to make informed financial decisions
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Income</p>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {formatCurrency(stats.totalIncome)}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-emerald-500/10">
                    <ArrowUpRight className="w-4 sm:w-6 h-4 sm:h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Expenses</p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-red-500/10">
                    <ArrowDownRight className="w-4 sm:w-6 h-4 sm:h-6 text-red-500" />
                  </div>
                </div>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Net Flow</p>
                    <p className={`text-lg sm:text-2xl font-bold mt-1 ${
                      stats.net >= 0 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl ${
                    stats.net >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}>
                    {stats.net >= 0 ? (
                      <ArrowUpRight className="w-4 sm:w-6 h-4 sm:h-6 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 sm:w-6 h-4 sm:h-6 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all duration-200 text-sm sm:text-base ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expenses</option>
                  </select>

                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field as any);
                      setSortOrder(order as any);
                    }}
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all duration-200 text-sm sm:text-base ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Amount (High to Low)</option>
                    <option value="amount-asc">Amount (Low to High)</option>
                    <option value="category-asc">Category (A-Z)</option>
                    <option value="category-desc">Category (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className={`rounded-2xl border overflow-hidden backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              {/* Table Header - Hidden on mobile */}
              <div className={`hidden md:grid md:grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="col-span-5">
                  <button 
                    onClick={() => toggleSort('category')}
                    className={`flex items-center space-x-2 font-medium text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <span>Transaction</span>
                    <span>{getSortIcon('category')}</span>
                  </button>
                </div>
                <div className="col-span-3">
                  <button 
                    onClick={() => toggleSort('date')}
                    className={`flex items-center space-x-2 font-medium text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <span>Date</span>
                    <span>{getSortIcon('date')}</span>
                  </button>
                </div>
                <div className="col-span-3 text-right">
                  <button 
                    onClick={() => toggleSort('amount')}
                    className={`flex items-center space-x-2 justify-end font-medium text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <span>Amount</span>
                    <span>{getSortIcon('amount')}</span>
                  </button>
                </div>
                <div className="col-span-1"></div>
              </div>

              {/* Transactions */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.length === 0 ? (
                  <div className="py-8 sm:py-12 text-center">
                    <Search className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 ${
                      darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      No transactions found
                    </h3>
                    <p className={`mb-6 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm || filterType !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Start by adding your first transaction'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                      <button 
                        onClick={() => setShowIncomeForm(true)}
                        className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                      >
                        Add Income
                      </button>
                      <button 
                        onClick={() => setShowExpenseForm(true)}
                        className={`px-4 sm:px-6 py-2 rounded-xl border transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredTransactions.map((transaction: any) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-3 sm:p-4 md:p-6 transition-all duration-200 group ${
                          selectedTransaction === transaction.id 
                            ? (darkMode ? 'bg-blue-900/20' : 'bg-blue-50') 
                            : (darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')
                        }`}
                      >
                        {/* Mobile Layout */}
                        <div className="md:hidden">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className={`p-2 rounded-xl border ${
                                transaction.type === 'income'
                                  ? (darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200')
                                  : (darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200')
                              }`}>
                                {getCategoryIcon(transaction.category)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`font-medium truncate ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {transaction.category}
                                </p>
                                <p className={`text-xs truncate mt-1 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {getDisplayDescription(transaction)}
                                </p>
                              </div>
                            </div>
                            
                            {/* Amount and Actions - Always visible on mobile */}
                            <div className="flex items-center space-x-2 ml-2">
                              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${
                                transaction.type === 'income'
                                  ? (darkMode 
                                      ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' 
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                                  : (darkMode 
                                      ? 'bg-red-900/20 text-red-400 border-red-800' 
                                      : 'bg-red-50 text-red-700 border-red-200')
                              }`}>
                                {transaction.type === 'income' ? (
                                  <ArrowUpRight className="w-3 h-3" />
                                ) : (
                                  <ArrowDownRight className="w-3 h-3" />
                                )}
                                <span className="font-medium">
                                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </span>
                              </div>
                              
                              {/* Action Buttons - Always visible */}
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => startEditTransaction(transaction)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    darkMode 
                                      ? 'text-blue-400 hover:bg-blue-900/20' 
                                      : 'text-blue-600 hover:bg-blue-50'
                                  }`}
                                  title="Edit transaction"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteTransactionId(transaction.id)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    darkMode 
                                      ? 'text-red-400 hover:bg-red-900/20' 
                                      : 'text-red-600 hover:bg-red-50'
                                  }`}
                                  title="Delete transaction"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Date Row - UPDATED FOR SUPABASE */}
                          <div className="flex items-center space-x-2 text-xs">
                            <Calendar className={`w-3 h-3 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {formatDisplayDate(transaction.date || transaction.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                          <div className="col-span-5 flex items-center space-x-4">
                            <div className={`p-3 rounded-xl border ${
                              transaction.type === 'income'
                                ? (darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200')
                                : (darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200')
                            }`}>
                              {getCategoryIcon(transaction.category)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`font-medium truncate ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {transaction.category}
                              </p>
                              <p className={`text-sm truncate mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {getDisplayDescription(transaction)}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-3 flex items-center">
                            <div className="flex items-center space-x-2">
                              <Calendar className={`w-4 h-4 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                              <span className={`text-sm ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {formatDisplayDate(transaction.date || transaction.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-3 flex items-center justify-end">
                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border ${
                              transaction.type === 'income'
                                ? (darkMode 
                                    ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                                : (darkMode 
                                    ? 'bg-red-900/20 text-red-400 border-red-800' 
                                    : 'bg-red-50 text-red-700 border-red-200')
                            }`}>
                              {transaction.type === 'income' ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              <span className="text-sm font-medium">
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-1 flex items-center justify-end">
                            {/* Action Buttons - Always visible on desktop */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => startEditTransaction(transaction)}
                                className={`p-2 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'text-blue-400 hover:bg-blue-900/20' 
                                    : 'text-blue-600 hover:bg-blue-50'
                                }`}
                                title="Edit transaction"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTransactionId(transaction.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'text-red-400 hover:bg-red-900/20' 
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title="Delete transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Summary Footer */}
            {filteredTransactions.length > 0 && (
              <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showing {filteredTransactions.length} of {financialData.transactions.length} transactions
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                    <div className="text-right">
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Income</p>
                      <p className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(stats.totalIncome)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Expenses</p>
                      <p className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
                        -{formatCurrency(stats.totalExpenses)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Net</p>
                      <p className={`text-base sm:text-lg font-semibold ${
                        stats.net >= 0 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};