'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import * as Toast from '@radix-ui/react-toast'
import * as Select from '@radix-ui/react-select'
import Image from 'next/image'
import { 
  TrendingUp, TrendingDown, Wallet, PieChart, Bell, BarChart3,
  Lightbulb, Mail, Users, Globe, ChevronDown, Search, Settings,
  User, Home, CreditCard, FileText, AreaChart, HelpCircle, LogOut,
  Menu, X, Plus, MessageCircle, Send, Bot, XCircle, AlertTriangle,
  Calendar, DollarSign, Euro, Currency, Filter, Download, MoreHorizontal
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts'

interface CategoryData {
  name: string;
  value: number;
}

interface PieChartProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [language, setLanguage] = useState('English')
  const [currency, setCurrency] = useState('USD')
  const [timeFilter, setTimeFilter] = useState('monthly')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your AI financial assistant. How can I help you today?", sender: 'ai' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // User state with more details
  const [user, setUser] = useState({
    name: 'Emmnauel Olusegun',
    email: 'admin@algoritic.com.ng',
    businessName: 'Algoritic Inc.',
    avatar: '/api/placeholder/40/40',
    plan:'Free Plan',
    joinedDate: '2025-09-19'
  })

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const currencies = [
    { value: 'USD', symbol: '$', label: 'US Dollar', icon: DollarSign },
    { value: 'EUR', symbol: '€', label: 'Euro', icon: Euro },
    { value: 'NGN', symbol: '₦', label: 'Naira', icon: Currency },
    { value: 'XAF', symbol: 'CFA', label: 'CFA Franc', icon: Currency }
  ]

  const timeFilters = [
    { value: 'daily', label: 'Daily', icon: Calendar },
    { value: 'weekly', label: 'Weekly', icon: BarChart3 },
    { value: 'monthly', label: 'Monthly', icon: TrendingUp },
    { value: 'yearly', label: 'Yearly', icon: Globe }
  ]

  const currentCurrency = currencies.find(c => c.value === currency) || currencies[0]

  const [financialData, setFinancialData] = useState({
    income:0.00,
    expenses: 0.00,
    profit: 0.00,
    transactions: [
      { id: 1, type: 'income', amount: 0, category: 'Sales', description: 'Product sales', date: new Date().toISOString().split('T')[0] },
      { id: 2, type: 'expense', amount: 0, category: 'Marketing', description: 'Google Ads', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
      { id: 3, type: 'income', amount: 0, category: 'Services', description: 'Consulting', date: new Date(Date.now() - 172800000).toISOString().split('T')[0] },
      { id: 4, type: 'expense', amount: 0, category: 'Operations', description: 'Office supplies', date: new Date(Date.now() - 259200000).toISOString().split('T')[0] },
      { id: 5, type: 'income', amount: 0, category: 'Sales', description: 'New client project', date: new Date(Date.now() - 345600000).toISOString().split('T')[0] }
    ],
    budgets: [
      { category: 'Marketing', spent: 1600, limit: 2000, percentage: 80, period: 'Monthly' },
      { category: 'Operations', spent: 3200, limit: 4000, percentage: 80, period: 'Monthly' },
      { category: 'Development', spent: 2800, limit: 3500, percentage: 80, period: 'Quarterly' },
      { category: 'Miscellaneous', spent: 1250, limit: 1500, percentage: 83, period: 'Monthly' }
    ],
    alerts: [
      { type: 'warning', message: 'Marketing budget nearing limit (80%)', category: 'Marketing', priority: 'high' },
      { type: 'alert', message: 'Operations spending exceeded limit!', category: 'Operations', priority: 'critical' },
      { type: 'info', message: 'Development budget on track', category: 'Development', priority: 'low' }
    ],
    aiRecommendations: [
      'Reduce operational costs by 15% through vendor negotiation',
      'Increase marketing budget to capitalize on Q2 opportunities',
      'Consider diversifying revenue streams with new service offerings',
      'Optimize tax strategy based on current profit margins'
    ],
    cashFlowForecast: [
      { month: 'Apr', forecast: 4500, actual: null },
      { month: 'May', forecast: 5200, actual: null },
      { month: 'Jun', forecast: 4800, actual: null },
      { month: 'Jul', forecast: 5500, actual: null }
    ]
  })

  const languages = ['English', 'French', 'Swahili', 'Yoruba', 'Igbo', 'Hausa']
  const categories = ['Sales', 'Services', 'Marketing', 'Operations', 'Development', 'Miscellaneous']
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: AreaChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  // Function to process transactions into time-based data
  const processTrendData = useMemo(() => {
    const now = new Date();
    const dailyData = [];
    const weeklyData = [];
    const monthlyData = [];
    const yearlyData = [];
    
    // Process daily data (last 7 days)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = financialData.transactions.filter(t => t.date === dateStr);
      const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const dayExpenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      dailyData.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        date: dateStr,
        income: dayIncome,
        expenses: dayExpenses
      });
    }
    
    // Process weekly data (last 4 weeks)
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (i + 1) * 7);
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - i * 7);
      
      const weekTransactions = financialData.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate < endDate;
      });
      
      const weekIncome = weekTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const weekExpenses = weekTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      weeklyData.push({
        week: `Week ${4-i}`,
        income: weekIncome,
        expenses: weekExpenses
      });
    }
    
    // Process monthly data (last 6 months)
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now);
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toLocaleString('default', { month: 'short' });
      
      const monthTransactions = financialData.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month.getMonth() && 
               transactionDate.getFullYear() === month.getFullYear();
      });
      
      const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        month: monthStr,
        income: monthIncome,
        expenses: monthExpenses
      });
    }
    
    // Process yearly data (last 3 years)
    const currentYear = new Date().getFullYear();
    for (let i = 2; i >= 0; i--) {
      const year = currentYear - i;
      
      const yearTransactions = financialData.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === year;
      });
      
      const yearIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const yearExpenses = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      yearlyData.push({
        year: year.toString(),
        income: yearIncome,
        expenses: yearExpenses
      });
    }
    
    return {
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
      yearly: yearlyData
    };
  }, [financialData.transactions]);

  const currentTrendData = processTrendData[timeFilter as keyof typeof processTrendData];

  // Update the categoryBreakdown calculation to be properly typed
  const categoryBreakdown = useMemo(() => {
    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};
    
    financialData.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
      } else {
        expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
      }
    });
    
    // Convert to simple array format
    const incomeData = Object.entries(incomeByCategory).map(([name, value]) => ({ 
      name, 
      value 
    }));
    
    const expensesData = Object.entries(expensesByCategory).map(([name, value]) => ({ 
      name, 
      value 
    }));
    
    return {
      income: incomeData,
      expenses: expensesData
    };
  }, [financialData.transactions]);

  const formatCurrency = (amount: number) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      NGN: '₦',
      XAF: 'CFA'
    }
    return `${symbols[currency]}${amount.toLocaleString()}`
  }

  const handleLogout = () => {
    console.log('User logged out')
  }

  const handleAddTransaction = (type: 'income' | 'expense') => {
    if (!formData.amount || !formData.category) {
      showToast('Please fill all required fields')
      return
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    }

    setFinancialData(prev => {
      const updatedIncome = type === 'income' ? prev.income + newTransaction.amount : prev.income;
      const updatedExpenses = type === 'expense' ? prev.expenses + newTransaction.amount : prev.expenses;
      const updatedProfit = updatedIncome - updatedExpenses;
      
      return {
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
        income: updatedIncome,
        expenses: updatedExpenses,
        profit: updatedProfit
      }
    });

    showToast(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`)
    setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
    type === 'income' ? setShowIncomeForm(false) : setShowExpenseForm(false)
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastOpen(true)
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = { id: Date.now(), text: newMessage, sender: 'user' }
    setChatMessages(prev => [...prev, userMessage])
    setNewMessage('')

    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        text: "I'm analyzing your financial data. Based on your current trends, I recommend reviewing your marketing budget as it's nearing its limit. Would you like me to generate a detailed report?", 
        sender: 'ai' 
      }
      setChatMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  // Get data key for chart based on time filter
  const getDataKey = () => {
    switch(timeFilter) {
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'yearly': return 'year';
      default: return 'day';
    }
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-emerald-600">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-600">Expenses: {formatCurrency(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
          <Toast.Title className="font-semibold text-gray-900">Success</Toast.Title>
          <Toast.Description className="text-gray-600">{toastMessage}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed top-4 right-4 z-50" />

        {/* Sidebar - Fixed height */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-6 pb-4 overflow-hidden">
            {/* Logo with Image */}
            <div className="flex items-center flex-shrink-0 px-6 pb-6">
              <div className="w-10 h-10 flex items-center justify-center relative overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758280453/Monietar_Logo_1_kgmjsj.png"
                  alt="Monietar Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-[#056996]">Monietar</h1>
            </div>

            {/* Navigation - No scroll */}
            <nav className="flex-1 px-4 space-y-1 overflow-visible">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-sm border border-emerald-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* User Section - Fixed at bottom */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-6">
              <div className="flex items-center w-full">
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.businessName}</p>
                  <p className="text-xs text-emerald-600">{user.plan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with sidebar offset */}
        <div className="flex-1 flex flex-col lg:ml-80">
          <header className="bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 h-16">
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search transactions, reports..."
                    className="w-lg pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Select.Root value={currency} onValueChange={setCurrency}>
                  <Select.Trigger className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:cursor-pointer border border-gray-300">
                    <Select.Value placeholder="Currency" />
                    <Select.Icon>
                      <ChevronDown className="w-4 h-4" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                      <Select.Viewport className="p-2">
                        {currencies.map((currency) => {
                          const IconComponent = currency.icon
                          return (
                            <Select.Item
                              key={currency.value}
                              value={currency.value}
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                              <Select.ItemText>
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="w-4 h-4" />
                                  <span>{currency.label}</span>
                                </div>
                              </Select.ItemText>
                            </Select.Item>
                          )
                        })}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <button className="p-2 rounded-xl hover:bg-gray-100 relative hover:cursor-pointer">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {financialData.alerts.length}
                  </span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black /50 z-40 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 30 }}
                  className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden"
                >
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                        <Image
                          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758280453/Monietar_Logo_1_kgmjsj.png"
                          alt="Monietar Logo"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <h1 className="ml-3 text-xl font-bold text-gray-900">Monietar</h1>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="mt-8 px-4 space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id)
                            setIsMobileMenuOpen(false)
                          }}
                          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all ${
                            activeTab === item.id
                              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-sm border border-emerald-200'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:cursor-pointer'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {activeTab}
                </h1>
                <p className="text-gray-600 mt-2">
                  {activeTab === 'overview' && 'Monitor your business finances and performance'}
                  {activeTab === 'transactions' && 'View and manage all transactions'}
                  {activeTab === 'budgets' && 'Create and track your budgets'}
                  {activeTab === 'reports' && 'Generate financial reports'}
                  {activeTab === 'analytics' && 'Analyze your financial data'}
                  {activeTab === 'settings' && 'Configure your account settings'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Dialog.Root open={showIncomeForm} onOpenChange={setShowIncomeForm}>
                  <Dialog.Trigger asChild>
                    <button className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer">
                      <Plus className="w-5 h-5" />
                      <span>Add Income</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
                    <Dialog.Content className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                      <Dialog.Title className="text-lg font-semibold mb-4">Add Income</Dialog.Title>
                      <div className="space-y-4">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAddTransaction('income')}
                            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700"
                          >
                            Add Income
                          </button>
                          <Dialog.Close asChild>
                            <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
                              Cancel
                            </button>
                          </Dialog.Close>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

                <Dialog.Root open={showExpenseForm} onOpenChange={setShowExpenseForm}>
                  <Dialog.Trigger asChild>
                    <button className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm hover:cursor-pointer">
                      <Plus className="w-5 h-5" />
                      <span>Add Expense</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
                    <Dialog.Content className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                      <Dialog.Title className="text-lg font-semibold mb-4">Add Expense</Dialog.Title>
                      <div className="space-y-4">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAddTransaction('expense')}
                            className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
                          >
                            Add Expense
                          </button>
                          <Dialog.Close asChild>
                            <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
                              Cancel
                            </button>
                          </Dialog.Close>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

                <button className="flex hover:cursor-pointer items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {/* Financial Summary */}
                <div className="xl:col-span-2 2xl:col-span-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Income</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.income)}</p>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                      <p className="text-sm text-emerald-600 mt-2">+12% from last month</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Expenses</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.expenses)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-xl">
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                      <p className="text-sm text-red-600 mt-2">+8% from last month</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Net Profit</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.profit)}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Wallet className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">+15% from last month</p>
                    </motion.div>
                  </div>

                  {/* Income vs Expenses Bar Chart with Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          {timeFilters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                              <button
                                key={filter.value}
                                onClick={() => setTimeFilter(filter.value as any)}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                  timeFilter === filter.value
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                <Icon className="w-4 h-4 mr-1" />
                                {filter.label}
                              </button>
                            );
                          })}
                        </div>
                        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey={getDataKey()}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${formatCurrency(value)}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="income" fill="#059669" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Category Breakdown */}
{/* Category Breakdown */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6"
>
  <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="text-sm font-medium text-emerald-700 mb-4 text-center">Income Sources</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={categoryBreakdown.income}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => {
                const total = categoryBreakdown.income.reduce((sum: number, item: any) => sum + item.value, 0);
                const percentage = total > 0 ? ((value as number / total) * 100).toFixed(0) : "0";
                return `${name} (${percentage}%)`;
              }}
              labelLine={false}
            >
              {categoryBreakdown.income.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'][index % 6]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div>
      <h4 className="text-sm font-medium text-red-700 mb-4 text-center">Expense Categories</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={categoryBreakdown.expenses}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => {
                const total = categoryBreakdown.expenses.reduce((sum: number, item: any) => sum + item.value, 0);
                const percentage = total > 0 ? ((value as number / total) * 100).toFixed(0) : "0";
                return `${name} (${percentage}%)`;
              }}
              labelLine={false}
            >
              {categoryBreakdown.expenses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'][index % 6]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</motion.div>
                </div>

                {/* Middle Column - Budgets & Alerts */}
                <div className="space-y-6">
                  {/* Budget Management */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {financialData.budgets.map((budget, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                              <span className="text-xs text-gray-500 ml-2">({budget.period})</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                budget.percentage >= 90
                                  ? 'bg-red-500'
                                  : budget.percentage >= 75
                                  ? 'bg-yellow-500'
                                  : 'bg-emerald-600'
                              }`}
                              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{Math.round(budget.percentage)}% spent</span>
                            <span className="text-xs text-gray-500">{formatCurrency(budget.limit - budget.spent)} remaining</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Alerts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Budget Alerts</h3>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      {financialData.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border ${
                            alert.priority === 'critical'
                              ? 'bg-red-50 border-red-200'
                              : alert.priority === 'high'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`rounded-full p-2 mr-3 ${
                              alert.priority === 'critical'
                                ? 'bg-red-100 text-red-600'
                                : alert.priority === 'high'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${
                                alert.priority === 'critical'
                                  ? 'text-red-700'
                                  : alert.priority === 'high'
                                  ? 'text-yellow-700'
                                  : 'text-blue-700'
                              }`}>
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{alert.category}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - AI Insights & Recent Transactions */}
                <div className="space-y-6">
                  {/* AI Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      {financialData.aiRecommendations.map((recommendation, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                          <div className="flex items-start">
                            <div className="bg-emerald-100 rounded-full p-2 mr-3">
                              <Lightbulb className="w-4 h-4 text-emerald-600" />
                            </div>
                            <p className="text-sm text-emerald-700">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent Transactions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                      <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {financialData.transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${
                              transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                            }`}>
                              {transaction.type === 'income' ? (
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.category}</p>
                              <p className="text-sm text-gray-600">{transaction.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className={`font-semibold ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* User Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Plan</span>
                        <span className="text-sm font-medium text-emerald-600">{user.plan}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Member since</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Transactions</span>
                        <span className="text-sm font-medium text-gray-900">
                          {financialData.transactions.length} this month
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Other tabs content */}
            {activeTab !== 'overview' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'transactions' && <CreditCard className="w-8 h-8 text-emerald-600" />}
                    {activeTab === 'budgets' && <PieChart className="w-8 h-8 text-emerald-600" />}
                    {activeTab === 'reports' && <FileText className="w-8 h-8 text-emerald-600" />}
                    {activeTab === 'analytics' && <LineChart className="w-8 h-8 text-emerald-600" />}
                    {activeTab === 'settings' && <Settings className="w-8 h-8 text-emerald-600" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{activeTab}</h3>
                  <p className="text-gray-600">This section is coming soon. Stay tuned!</p>
                </div>
              </div>
            )}
          </main>

          {/* AI Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center z-40 hover:cursor-pointer"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Chat Modal */}
          <AnimatePresence>
            {isChatOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 z-50"
                  onClick={() => setIsChatOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-xl z-50"
                >
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5" />
                        <h3 className="font-semibold">AI Financial Assistant</h3>
                      </div>
                      <button
                        onClick={() => setIsChatOpen(false)}
                        className="p-1 hover:bg-emerald-700 rounded"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about your finances..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </Toast.Provider>
    </div>
  )
}