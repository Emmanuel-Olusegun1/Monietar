'use client'

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';
import * as Select from '@radix-ui/react-select';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TrendingUp, TrendingDown, Wallet, PieChart, Bell, BarChart3,
  Lightbulb, Mail, Users, Globe, ChevronDown, Search, Settings,
  User, Home, CreditCard, FileText, AreaChart, HelpCircle, LogOut,
  Menu, X, Plus, MessageCircle, Send, Bot, XCircle, AlertTriangle,
  Calendar, DollarSign, Euro, Currency, Filter, Download, MoreHorizontal,
  Languages
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://coihzyskjxedccjpzjzd.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaWh6eXNranhlZGNjanB6anpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDQ5ODMsImV4cCI6MjA3MjQyMDk4M30.KbvQ6wfBmjov2ZhdF1_t7PX0JLRnfHGUOMbDHtZABLE"
);

interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface Budget {
  id?: string;
  user_id: string;
  category: string;
  spent: number;
  budget_limit: number;
  percentage: number;
  period: 'Monthly' | 'Quarterly' | 'Yearly';
}

interface Alert {
  type: 'alert' | 'warning' | 'info';
  message: string;
  category: string;
  priority: 'critical' | 'high' | 'low';
}

interface FinancialData {
  income: number;
  expenses: number;
  profit: number;
  transactions: Transaction[];
  budgets: Budget[];
  alerts: Alert[];
  aiRecommendations: string[];
  cashFlowForecast: { month: string; forecast: number; actual: number | null }[];
}

interface User {
  name: string;
  email: string;
  businessName: string;
  avatar: string;
  plan: string;
  joinedDate: string;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface LanguageOption {
  value: string;
  label: string;
}

interface CurrencyOption {
  value: string;
  label: string;
}

interface TimeFilter {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>({
    name: 'Loading...',
    email: 'Loading...',
    businessName: 'Loading...',
    avatar: '/api/placeholder/40/40',
    plan: 'Free Plan',
    joinedDate: new Date().toISOString().split('T')[0]
  });
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0.00,
    expenses: 0.00,
    profit: 0.00,
    transactions: [],
    budgets: [],
    alerts: [],
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
  });
  const [loading, setLoading] = useState(true);
  
  // State variables that were missing
  const [activeTab, setActiveTab] = useState('overview');
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('NGN');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Form data states
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [budgetFormData, setBudgetFormData] = useState({
    category: '',
    budget_limit: '',
    period: 'Monthly' as 'Monthly' | 'Quarterly' | 'Yearly'
  });

  // Helper data arrays
  const categories = ['Sales', 'Services', 'Investments', 'Other Income'];
  const expenseCategories = ['Marketing', 'Operations', 'Salaries', 'Software', 'Office Supplies', 'Travel', 'Utilities', 'Other'];
  
  const navigationItems: NavigationItem[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  const languagesList: LanguageOption[] = [
    { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'sw', label: 'Swahili' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' },
  { value: 'ha', label: 'Hausa' }
  ];
  
  const currencies: CurrencyOption[] = [
    { value: 'NGN', label: 'NGN'},
    { value: 'XFA', label: 'XFA'},
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP'  }
  ];
  
  const timeFilters: TimeFilter[] = [
    { value: 'daily', label: 'Daily', icon: Calendar },
    { value: 'weekly', label: 'Weekly', icon: Calendar },
    { value: 'monthly', label: 'Monthly', icon: Calendar },
    { value: 'yearly', label: 'Yearly', icon: Calendar }
  ];

  // Helper functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Calculate category breakdown
  const categoryBreakdown = useMemo(() => {
    const incomeBreakdown: CategoryData[] = [];
    const expenseBreakdown: CategoryData[] = [];
    
    financialData.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        const existing = incomeBreakdown.find(item => item.name === transaction.category);
        if (existing) {
          existing.value += transaction.amount;
        } else {
          incomeBreakdown.push({ name: transaction.category, value: transaction.amount });
        }
      } else {
        const existing = expenseBreakdown.find(item => item.name === transaction.category);
        if (existing) {
          existing.value += transaction.amount;
        } else {
          expenseBreakdown.push({ name: transaction.category, value: transaction.amount });
        }
      }
    });
    
    return {
      income: incomeBreakdown,
      expenses: expenseBreakdown
    };
  }, [financialData.transactions]);

  // Calculate current trend data based on time filter
  const currentTrendData = useMemo(() => {
    // Simplified mock data - in a real app, you'd aggregate based on the actual time filter
    return [
      { day: 'Mon', income: 1200, expenses: 800 },
      { day: 'Tue', income: 1900, expenses: 1200 },
      { day: 'Wed', income: 1500, expenses: 900 },
      { day: 'Thu', income: 2100, expenses: 1100 },
      { day: 'Fri', income: 1800, expenses: 1000 },
      { day: 'Sat', income: 900, expenses: 600 },
      { day: 'Sun', income: 700, expenses: 500 }
    ];
  }, [timeFilter]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchData(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchData(session);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchData(session: Session) {
    if (!session) {
      showToast('No active session. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const userId = session.user.id;

    try {
      // Fetch transactions
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      // Fetch budgets
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      // Fetch user profile from a profiles table (you need to create this)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (transError) console.error('Transaction error:', transError);
      if (budgetsError) console.error('Budget error:', budgetsError);
      if (profileError) console.error('Profile error:', profileError);

      // Calculate financial data
      const income = (transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0);
      const expenses = (transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0);
      const profit = income - expenses;

      // Calculate alerts
      const computedAlerts: Alert[] = (budgets || []).map(b => {
        const perc = (b.spent / b.budget_limit) * 100;
        let type: 'alert' | 'warning' | 'info';
        let message: string;
        let priority: 'critical' | 'high' | 'low';
        
        if (perc > 100) {
          type = 'alert';
          message = `${b.category} spending exceeded limit!`;
          priority = 'critical';
        } else if (perc >= 80) {
          type = 'warning';
          message = `${b.category} budget nearing limit (${Math.round(perc)}%)`;
          priority = 'high';
        } else {
          type = 'info';
          message = `${b.category} budget on track`;
          priority = 'low';
        }
        return { type, message, category: b.category, priority };
      });

      setFinancialData(prev => ({
        ...prev,
        income,
        expenses,
        profit,
        transactions: transactions || [],
        budgets: budgets || [],
        alerts: computedAlerts
      }));

      // Set user data - fallback to session data if profile doesn't exist
      const userData = {
        name: profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || 'No email',
        businessName: profile?.business_name || session.user.user_metadata?.business_name || 'My Business',
        avatar: profile?.avatar || session.user.user_metadata?.avatar_url || '/api/placeholder/40/40',
        plan: profile?.plan || 'Free Plan',
        joinedDate: new Date(profile?.created_at || session.user.created_at).toISOString().split('T')[0]
      };

      setUser(userData);

    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error fetching data');
    } finally {
      setLoading(false);
    }
  }

  const handleAddTransaction = async (type: 'income' | 'expense') => {
    if (!formData.amount || !formData.category || !session) {
      showToast('Please fill all required fields or log in');
      return;
    }

    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: session.user.id,
        type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      });

      if (error) throw error;

      showToast(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      type === 'income' ? setShowIncomeForm(false) : setShowExpenseForm(false);
      
      // Refresh data
      if (session) await fetchData(session);
    } catch (error) {
      console.error('Error adding transaction:', error);
      showToast('Error adding transaction');
    }
  };

  const handleAddBudget = async () => {
    if (!budgetFormData.category || !budgetFormData.budget_limit || !session) {
      showToast('Please fill all required fields or log in');
      return;
    }

    try {
      const { error } = await supabase.from('budgets').insert({
        user_id: session.user.id,
        category: budgetFormData.category,
        spent: 0,
        budget_limit: parseFloat(budgetFormData.budget_limit),
        percentage: 0,
        period: budgetFormData.period
      });

      if (error) throw error;

      showToast('Budget added successfully!');
      setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
      setShowBudgetForm(false);
      
      // Refresh data
      if (session) await fetchData(session);
    } catch (error) {
      console.error('Error adding budget:', error);
      showToast('Error adding budget');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = { id: Date.now(), text: newMessage, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    setTimeout(() => {
      const aiResponse: ChatMessage = { 
        id: Date.now() + 1, 
        text: "I'm analyzing your financial data. Based on your current trends, I recommend reviewing your marketing budget as it's nearing its limit. Would you like me to generate a detailed report?", 
        sender: 'ai' 
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Get data key for chart based on time filter
  const getDataKey = () => {
    switch(timeFilter) {
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'yearly': return 'year';
      default: return 'day';
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        Please log in to access the dashboard. <Link href="/auth/signin" className="text-emerald-600 hover:underline">Signin</Link>
      </div>
    );
  }

  // Rest of your JSX remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
          <Toast.Title className="font-semibold text-gray-900">Success</Toast.Title>
          <Toast.Description className="text-gray-600">{toastMessage}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed top-4 right-4 z-50" />

        {/* Sidebar - Fixed height */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-gradient-to-b from-emerald-900 to-emerald-800 text-white pt-6 pb-4 overflow-hidden">
            {/* Logo with Image */}
            <div className="flex items-center justify-center flex-shrink-0 px-6 pb-8">
              <div className="w-[220px] flex items-center justify-center relative overflow-hidden bg-white rounded-sm">
                <Image
                  src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                  alt="Monietar Logo"
                  width={208}
                  height={8}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Navigation - No scroll */}
            <nav className="flex-1 px-4 space-y-2 overflow-visible">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all ${
                      activeTab === item.id
                        ? 'bg-emerald-700 text-white shadow-lg'
                        : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Section - Fixed at bottom */}
            <div className="flex-shrink-0 flex border-t border-emerald-700/50 p-6">
              <div className="flex items-center w-full">
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-emerald-200 truncate">{user.businessName}</p>
                  <p className="text-xs text-emerald-300">{user.plan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with sidebar offset */}
        <div className="flex-1 flex flex-col lg:ml-64">
          <header className="bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Select.Root value={language} onValueChange={setLanguage}>
                    <Select.Trigger className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:cursor-pointer border border-gray-300">
                      <Languages className="w-4 h-4" />
                      <Select.Value placeholder="Language" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                        <Select.Viewport className="p-2">
                          {languagesList.map((lang) => (
                            <Select.Item
                              key={lang.value}
                              value={lang.value}
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                              <Select.ItemText>
                                <div className="flex items-center space-x-2">
                                  <span>{lang.label}</span>
                                </div>
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

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
                          {currencies.map((curr) => {
                            
                            return (
                              <Select.Item
                                key={curr.value}
                                value={curr.value}
                                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                              >
                                <Select.ItemText>
                                  <div className="flex items-center space-x-2">
                                  
                                    <span>{curr.label}</span>
                                  </div>
                                </Select.ItemText>
                              </Select.Item>
                            );
                          })}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  <button className="p-2 rounded-xl hover:bg-gray-100 relative hover:cursor-pointer">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {financialData.alerts.length}
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:cursor-pointer lg:hidden"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* ... Rest of your JSX remains exactly the same ... */}
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 30 }}
                  className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white z-50 lg:hidden"
                >
                  <div className="flex items-center justify-between p-6 border-b border-emerald-700/50">
                    <div className="flex items-center">
                      <div className="w-[120px] h-10 bg-white rounded-xl flex items-center justify-center relative overflow-hidden p-2">
                        <Image
                          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                          alt="Monietar Logo"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <h1 className="ml-3 text-xl font-bold text-white">Monietar</h1>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-md text-emerald-100 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="mt-8 px-4 space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all ${
                            activeTab === item.id
                              ? 'bg-emerald-700 text-white shadow-lg'
                              : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white hover:cursor-pointer'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-emerald-700/50">
                    <div className="flex items-center">
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-emerald-200 truncate">{user.businessName}</p>
                        <p className="text-xs text-emerald-300">{user.plan}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content - The rest of your JSX remains exactly the same */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                  {activeTab}
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  {activeTab === 'overview' && 'Monitor your business finances and performance'}
                  {activeTab === 'transactions' && 'View and manage all transactions'}
                  {activeTab === 'budgets' && 'Create and track your budgets'}
                  {activeTab === 'reports' && 'Generate financial reports'}
                  {activeTab === 'analytics' && 'Analyze your financial data'}
                  {activeTab === 'settings' && 'Configure your account settings'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
                <Dialog.Root open={showIncomeForm} onOpenChange={setShowIncomeForm}>
                  <Dialog.Trigger asChild>
                    <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer text-sm sm:text-base">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add Income</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
                    <Dialog.Content className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
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
                    <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm hover:cursor-pointer text-sm sm:text-base">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add Expense</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
                    <Dialog.Content className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
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
                          {expenseCategories.map(cat => (
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
                            
                <button className="flex hover:cursor-pointer items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
                            
            {/* Overview Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Financial Summary */}
                <div className="xl:col-span-2 2xl:col-span-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Income</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(financialData.income)}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-emerald-100 rounded-xl">
                          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                        </div>
                      </div>
                    </motion.div>
                            
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Expenses</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(financialData.expenses)}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
                          <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                      </div>
                    </motion.div>
                            
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Net Profit</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(financialData.profit)}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                          <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                            
                  {/* Income vs Expenses Bar Chart with Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 mt-4 sm:mt-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap gap-1">
                          {timeFilters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                              <button
                                key={filter.value}
                                onClick={() => setTimeFilter(filter.value)}
                                className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                  timeFilter === filter.value
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">{filter.label}</span>
                                <span className="sm:hidden">{filter.label.slice(0, 1)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="h-64 sm:h-80">
                      {currentTrendData.every(d => d.income === 0 && d.expenses === 0) ? (
                        <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={currentTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                      )}
                    </div>
                  </motion.div>
                            
                  {/* Category Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 mt-4 sm:mt-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Category Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-emerald-700 mb-3 sm:mb-4 text-center">Income Sources</h4>
                        <div className="h-56 sm:h-64">
                          {categoryBreakdown.income.reduce((sum, item) => sum + item.value, 0) === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">No income data</div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={categoryBreakdown.income}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={70}
                                  dataKey="value"
                                  label={(props) => {
                                    const { name, value } = props;
                                    const total = categoryBreakdown.income.reduce((sum, item) => sum + item.value, 0);
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
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-700 mb-3 sm:mb-4 text-center">Expense Categories</h4>
                        <div className="h-56 sm:h-64">
                          {categoryBreakdown.expenses.reduce((sum, item) => sum + item.value, 0) === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">No expense data</div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={categoryBreakdown.expenses}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={70}
                                  dataKey="value"
                                  label={(props) => {
                                    const { name, value } = props;
                                    const total = categoryBreakdown.income.reduce((sum, item) => sum + item.value, 0);
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
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                            
                {/* Middle Column - Budgets & Alerts */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Budget Management */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
                      <button onClick={() => setActiveTab('budgets')} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {financialData.budgets.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No budgets set. Add one!</div>
                      ) : (
                        financialData.budgets.map((budget, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                                <span className="text-xs text-gray-500 ml-2">({budget.period})</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(budget.spent)} / {formatCurrency(budget.budget_limit)}
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
                              <span className="text-xs text-gray-500">{formatCurrency(budget.budget_limit - budget.spent)} remaining</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                            
                  {/* Alerts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Budget Alerts</h3>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      {financialData.alerts.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No alerts</div>
                      ) : (
                        financialData.alerts.map((alert, index) => (
                          <div
                            key={index}
                            className={`p-3 sm:p-4 rounded-xl border ${
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
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>
                            
                {/* Right Column - AI Insights & Recent Transactions */}
                <div className="space-y-4 sm:space-y-6">
                  {/* AI Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      {financialData.aiRecommendations.map((recommendation, index) => (
                        <div key={index} className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
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
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                      <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {financialData.transactions.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No transactions yet. Add some!</div>
                      ) : (
                        financialData.transactions.slice(0, 5).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
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
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{transaction.category}</p>
                                <p className="text-sm text-gray-600 truncate">{transaction.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className={`font-semibold text-sm sm:text-base ${
                              transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                            
                  {/* User Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Plan</span>
                        <span className="text-sm font-medium text-emerald-600">{user.plan}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Member since</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl">
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
            {activeTab === 'budgets' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Budgets</h3>
                  <button onClick={() => setShowBudgetForm(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {financialData.budgets.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No budgets set. Add one!</div>
                  ) : (
                    financialData.budgets.map((budget, index) => (
                      <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                            <span className="text-xs text-gray-500 ml-2">({budget.period})</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.budget_limit)}
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
                          <span className="text-xs text-gray-500">{formatCurrency(budget.budget_limit - budget.spent)} remaining</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'budgets' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="text-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'transactions' && <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />}
                    {activeTab === 'reports' && <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />}
                    {activeTab === 'analytics' && <LineChart className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />}
                    {activeTab === 'settings' && <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 capitalize">{activeTab}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">This section is coming soon. Stay tuned!</p>
                </div>
              </div>
            )}
          </main>
                            
          {/* AI Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center z-40 hover:cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
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
                  className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl z-50"
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
                                          
                  <div className="p-4 h-80 overflow-y-auto">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
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

          {/* Budget Form Dialog */}
          <Dialog.Root open={showBudgetForm} onOpenChange={setShowBudgetForm}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
              <Dialog.Content className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
                <Dialog.Title className="text-lg font-semibold mb-4">Add Budget</Dialog.Title>
                <div className="space-y-4">
                  <select
                    value={budgetFormData.category}
                    onChange={(e) => setBudgetFormData({...budgetFormData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Budget Limit"
                    value={budgetFormData.budget_limit}
                    onChange={(e) => setBudgetFormData({...budgetFormData, budget_limit: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={budgetFormData.period}
                    onChange={(e) => setBudgetFormData({...budgetFormData, period: e.target.value as 'Monthly' | 'Quarterly' | 'Yearly'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddBudget}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700"
                    >
                      Add Budget
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
        </div>
      </Toast.Provider>
    </div>
  );
}