'use client'

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Languages, Edit, Trash2, Save, Key, ChevronRight, Eye, EyeOff,
  Sun, Moon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

// Import modals
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddBudgetModal } from './components/modals/AddBudgetModal';
import { EditTransactionModal } from './components/modals/EditTransactionModal';
import { EditBudgetModal } from './components/modals/EditBudgetModal';
import { DeleteConfirmationModal } from './components/modals/DeleteConfirmationModal';
import { ChangePasswordModal } from './components/modals/ChangePasswordModal';
import { ClearDataModal } from './components/modals/ClearDataModal';
import { DeleteAccountModal } from './components/modals/DeleteAccountModal';
import { RestoreBackupModal } from './components/modals/RestoreBackupModal';
import { AIChatModal } from './components/modals/AIChatModal';

// Import components
import { Sidebar } from './Sidebar';

// Import types
import { 
  Transaction, 
  Budget, 
  UserSettings, 
  PasswordData,
  FinancialData,
  Alert,
  UserInfo,
  CategoryData,
  ChatMessage,
  NavigationItem,
  LanguageOption,
  CurrencyOption,
  TimeFilter
} from './types';

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://coihzyskjxedccjpzjzd.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaWh6eXNranhlZGNjanB6anpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDQ5ODMsImV4cCI6MjA3MjQyMDk4M30.KbvQ6wfBmjov2ZhdF1_t7PX0JLRnfHGUOMbDHtZABLE"
);

// Import your classes
import { RuleBasedFinancialAdvisor } from './utils/FinancialAdvisor';
import { AdvancedFinancialNLP } from './utils/FinancialNLP';

// Import helper functions
import { getWeekOfMonth, getWeekRange } from './utils/dateHelpers';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserInfo>({
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
      'Add your transactions to get personalized financial insights',
      'Create budgets to track your spending limits',
      'Monitor your income and expense patterns regularly'
    ],
    cashFlowForecast: [
      { month: 'Apr', forecast: 4500, actual: null },
      { month: 'May', forecast: 5200, actual: null },
      { month: 'Jun', forecast: 4800, actual: null },
      { month: 'Jul', forecast: 5500, actual: null }
    ]
  });
  const [loading, setLoading] = useState(true);
  
  // State variables
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
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [availableBackups, setAvailableBackups] = useState<any[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<string>('');
  const [showBalance, setShowBalance] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Transaction management states
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  
  // Budget management states
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  
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

  // Settings states
  const [userSettings, setUserSettings] = useState<UserSettings>({
    fullName: '',
    email: '',
    businessName: '',
    phoneNumber: '',
    currency: 'NGN',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
    notifications: {
      budgetAlerts: true,
      weeklyReports: true,
      transactionAlerts: true,
      aiRecommendations: true
    }
  });

  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Theme classes based on dark mode
  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    cardHover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500'
    },
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    sidebar: darkMode ? 'bg-gray-900 border-gray-800' : 'bg-emerald-900 border-emerald-800',
    sidebarText: darkMode ? 'text-gray-300' : 'text-emerald-100',
    sidebarHover: darkMode ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-emerald-800 hover:text-white',
    sidebarActive: darkMode ? 'bg-gray-800 text-white' : 'bg-emerald-800 text-white'
  };

  // Helper data arrays
  const categories = [
    'Selling Products', 'Service Work', 'Consulting Work', 'Monthly Subscriptions', 'Shop Sales',
    'Online Sales', 'Big Project Work', 'Regular Customer Payments', 'Commission Money', 'Renting Things Out',
    'Bank Interest', 'Investment Money', 'Teaching/Training', 'Repair Work', 'Installation Work',
    'Support Services', 'Digital Products', 'Advertising Money', 'Referral Commissions', 'Software Subscriptions',
    'Online Courses', 'Government Help', 'Business Grants', 'Partnership Money', 'Franchise Fees',
    'Event Services', 'Delivery Services', 'Cleaning Services', 'Security Services', 'Construction Work',
    'Farming Products', 'Transport Services', 'Health Services', 'Beauty Services', 'Food Sales', 'Others'
  ];

  const expenseCategories = [
    'Worker Pay', 'Generator Fuel', 'Shop Rent', 'Electricity Bills', 'Water Bills', 'Office Supplies',
    'Software Programs', 'Marketing Costs', 'Professional Help', 'Insurance Payments', 'Bank Charges',
    'Raw Materials', 'Stock Purchases', 'Making Products', 'Packaging', 'Quality Testing', 'Machine Repair',
    'Vehicle Costs', 'Property Taxes', 'Security Services', 'Cleaning Services', 'Travel Costs', 'Training Costs',
    'Meeting Expenses', 'Customer Meals', 'Membership Fees', 'Computer Help', 'Website Costs', 'Online Storage',
    'Phone Bills', 'Internet Bills', 'Gas Bills', 'Waste Removal', 'Equipment Purchase', 'Building Maintenance',
    'Vehicle Purchase', 'Loan Payments', 'Tax Payments', 'Legal Fees', 'Accounting Fees', 'Others'
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
    if (!showBalance && amount !== 0) {
      return '••••••';
    }
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

  // Enhanced AI Chat Function
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const userMessage: ChatMessage = { 
      id: Date.now(), 
      text: newMessage, 
      sender: 'user' 
    };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  
    // Show typing indicator
    const typingMessage: ChatMessage = { 
      id: Date.now() + 0.5, 
      text: "Analyzing your financial data...", 
      sender: 'ai' 
    };
    setChatMessages(prev => [...prev, typingMessage]);
  
    try {
      // Use the enhanced AI processor
      const aiResponse = AdvancedFinancialNLP.processQuery(
        newMessage,
        financialData.transactions,
        financialData.budgets,
        (amount: number) => new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2
        }).format(amount)
      );
  
      // Remove typing indicator and add actual response
      setChatMessages(prev => 
        prev.filter(msg => msg.id !== typingMessage.id).concat({
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'ai'
        })
      );
  
    } catch (error) {
      console.error('AI response error:', error);
      setChatMessages(prev => 
        prev.filter(msg => msg.id !== typingMessage.id).concat({
          id: Date.now() + 1,
          text: "I'm having trouble analyzing your data right now. Please try again later or ask something else about your finances.",
          sender: 'ai'
        })
      );
    }
  };

  // Settings Functions
  const handleSaveSettings = async () => {
    if (!session) {
      showToast('Please log in to save settings');
      return;
    }

    try {
      // Update user profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: userSettings.fullName,
          business_name: userSettings.businessName,
          phone_number: userSettings.phoneNumber,
          currency: userSettings.currency,
          language: userSettings.language,
          date_format: userSettings.dateFormat,
          timezone: userSettings.timezone,
          notification_settings: userSettings.notifications,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update user state
      setUser({
        ...user,
        name: userSettings.fullName,
        businessName: userSettings.businessName
      });

      // Update global currency and language
      setCurrency(userSettings.currency);
      setLanguage(userSettings.language);

      showToast('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings');
    }
  };

  const handleChangePassword = async () => {
    if (!session) {
      showToast('Please log in to change password');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      showToast('Password updated successfully!');
      setShowChangePasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Error changing password');
    }
  };

  const handleExportData = async () => {
    if (!session) {
      showToast('Please log in to export data');
      return;
    }

    try {
      // Fetch all user data
      const [transactionsData, budgetsData] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', session.user.id),
        supabase.from('budgets').select('*').eq('user_id', session.user.id)
      ]);

      if (transactionsData.error) throw transactionsData.error;
      if (budgetsData.error) throw budgetsData.error;

      // Create CSV content
      const transactionsCSV = convertToCSV(transactionsData.data || []);
      const budgetsCSV = convertToCSV(budgetsData.data || []);

      // Create and download files
      downloadCSV(transactionsCSV, 'transactions.csv');
      downloadCSV(budgetsCSV, 'budgets.csv');

      showToast('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast('Error exporting data');
    }
  };

  const handleBackupData = async () => {
    if (!session) {
      showToast('Please log in to backup data');
      return;
    }
  
    try {
      // Fetch all user data
      const [transactionsData, budgetsData, profileData] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', session.user.id),
        supabase.from('budgets').select('*').eq('user_id', session.user.id),
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
      ]);
  
      if (transactionsData.error) throw transactionsData.error;
      if (budgetsData.error) throw budgetsData.error;
  
      // Create backup data object
      const backupData = {
        transactions: transactionsData.data || [],
        budgets: budgetsData.data || [],
        profile: profileData.data || {},
        backup_date: new Date().toISOString(),
        version: '1.0'
      };
  
      // Store in backups table
      const { error } = await supabase
        .from('backups')
        .insert({
          user_id: session.user.id,
          backup_data: backupData,
          backup_type: 'full',
          file_size: JSON.stringify(backupData).length
        });
  
      if (error) throw error;
  
      showToast('Backup created successfully!');
    } catch (error) {
      console.error('Error creating backup:', error);
      showToast('Error creating backup');
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!session) {
      showToast('Please log in to restore backup');
      return;
    }
  
    try {
      // Get the backup data
      const { data: backup, error: fetchError } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .eq('user_id', session.user.id)
        .single();
  
      if (fetchError) throw fetchError;
      if (!backup?.backup_data) throw new Error('No backup data found');
  
      const backupData = backup.backup_data;
  
      // Start restore process - delete existing data first
      const [deleteTransactions, deleteBudgets] = await Promise.all([
        supabase.from('transactions').delete().eq('user_id', session.user.id),
        supabase.from('budgets').delete().eq('user_id', session.user.id)
      ]);
  
      if (deleteTransactions.error) throw deleteTransactions.error;
      if (deleteBudgets.error) throw deleteBudgets.error;
  
      // Restore transactions - preserve original IDs if they exist
      if (backupData.transactions && backupData.transactions.length > 0) {
        const transactionsToInsert = backupData.transactions.map((t: any) => ({
          ...t,
          user_id: session.user.id,
          id: t.id || undefined
        })).filter((t: any) => t.id !== undefined);
  
        if (transactionsToInsert.length > 0) {
          const { error: transactionsError } = await supabase
            .from('transactions')
            .insert(transactionsToInsert);
  
          if (transactionsError) throw transactionsError;
        }
      }
  
      // Restore budgets - preserve original IDs if they exist
      if (backupData.budgets && backupData.budgets.length > 0) {
        const budgetsToInsert = backupData.budgets.map((b: any) => ({
          ...b,
          user_id: session.user.id,
          id: b.id || undefined
        })).filter((b: any) => b.id !== undefined);
  
        if (budgetsToInsert.length > 0) {
          const { error: budgetsError } = await supabase
            .from('budgets')
            .insert(budgetsToInsert);
  
          if (budgetsError) throw budgetsError;
        }
      }
  
      // Restore profile settings if available
      if (backupData.profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            ...backupData.profile,
            updated_at: new Date().toISOString()
          });
  
        if (profileError) console.warn('Could not restore profile:', profileError);
      }
  
      // Refresh the dashboard data
      await fetchData(session);
  
      showToast('Backup restored successfully!');
      setShowRestoreDialog(false);
    } catch (error) {
      console.error('Error restoring backup:', error);
      showToast('Error restoring backup');
    }
  };

  const handleClearData = async () => {
    if (!session) {
      showToast('Please log in to clear data');
      return;
    }

    try {
      // Delete all user data
      const [transactionsResult, budgetsResult] = await Promise.all([
        supabase.from('transactions').delete().eq('user_id', session.user.id),
        supabase.from('budgets').delete().eq('user_id', session.user.id)
      ]);

      if (transactionsResult.error) throw transactionsResult.error;
      if (budgetsResult.error) throw budgetsResult.error;

      // Refresh data
      await fetchData(session);

      setShowClearDataDialog(false);
      showToast('All data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error);
      showToast('Error clearing data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!session) {
      showToast('Please log in to delete account');
      return;
    }

    try {
      // First delete all user data
      await handleClearData();

      // Then delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      // Finally delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(session.user.id);
      
      if (authError) throw authError;

      showToast('Account deleted successfully!');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Error deleting account');
    }
  };

  // Helper functions for CSV export
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Load available backups
  useEffect(() => {
    if (showRestoreDialog && session) {
      loadAvailableBackups();
    }
  }, [showRestoreDialog, session]);

  // Update AI recommendations when data changes
  useEffect(() => {
    if (financialData.transactions.length > 0) {
      const recommendations = RuleBasedFinancialAdvisor.analyzeSpendingPatterns(
        financialData.transactions,
        financialData.budgets,
        formatCurrency
      );
      
      setFinancialData(prev => ({
        ...prev,
        aiRecommendations: recommendations.slice(0, 4)
      }));
    }
  }, [financialData.transactions, financialData.budgets]);

  const loadAvailableBackups = async () => {
    if (!session) return;
    
    const { data: backups, error } = await supabase
      .from('backups')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && backups) {
      setAvailableBackups(backups);
    }
  };

  // Calculate category breakdown from actual transactions
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

  // Calculate trend data based on actual transactions and time filter
  const currentTrendData = useMemo(() => {
    if (financialData.transactions.length === 0) {
      return [];
    }

    const now = new Date();
    let data: { period: string; income: number; expenses: number }[] = [];

    switch (timeFilter) {
      case 'daily':
        // Last 7 days
        data = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          const period = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          const dayTransactions = financialData.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.toDateString() === date.toDateString();
          });

          const income = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
          const expenses = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return { period, income, expenses };
        });
        break;

      case 'weekly':
        // Last 4 weeks from current date
        data = Array.from({ length: 4 }, (_, i) => {
          const targetDate = new Date(now);
          targetDate.setDate(now.getDate() - (3 - i) * 7);
          const weekNumber = getWeekOfMonth(targetDate);
          const period = `Week ${weekNumber}`;
          
          const { start, end } = getWeekRange(targetDate);
          
          const weekTransactions = financialData.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= start && transactionDate <= end;
          });

          const income = weekTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
          const expenses = weekTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return { period, income, expenses };
        });
        break;

      case 'monthly':
        // Last 6 months
        data = Array.from({ length: 6 }, (_, i) => {
          const month = new Date(now);
          month.setMonth(now.getMonth() - (5 - i));
          const period = month.toLocaleDateString('en-US', { month: 'short' });
          
          const monthTransactions = financialData.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === month.getMonth() && 
                   transactionDate.getFullYear() === month.getFullYear();
          });

          const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
          const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return { period, income, expenses };
        });
        break;

      case 'yearly':
        // Last 3 years
        data = Array.from({ length: 3 }, (_, i) => {
          const year = now.getFullYear() - (2 - i);
          const period = year.toString();
          
          const yearTransactions = financialData.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === year;
          });

          const income = yearTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
          const expenses = yearTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return { period, income, expenses };
        });
        break;
    }

    return data;
  }, [financialData.transactions, timeFilter]);

  // Check if user has any transaction data
  const hasTransactionData = useMemo(() => {
    return financialData.transactions.length > 0;
  }, [financialData.transactions]);

  // Real-time budget tracking calculation
  const budgetsWithRealTimeTracking = useMemo(() => {
    return financialData.budgets.map(budget => {
      // Calculate spent amount from transactions for this budget category
      const spent = financialData.transactions
        .filter(transaction => 
          transaction.type === 'expense' && 
          transaction.category === budget.category
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      const percentage = budget.budget_limit > 0 ? (spent / budget.budget_limit) * 100 : 0;
      
      return {
        ...budget,
        spent,
        percentage
      };
    });
  }, [financialData.budgets, financialData.transactions]);

  // Real-time alerts based on actual spending
  const realTimeAlerts = useMemo(() => {
    const alerts: Alert[] = [];
    
    budgetsWithRealTimeTracking.forEach(budget => {
      if (budget.percentage > 100) {
        alerts.push({
          type: 'alert',
          message: `${budget.category} spending exceeded limit by ${formatCurrency(budget.spent - budget.budget_limit)}!`,
          category: budget.category,
          priority: 'critical'
        });
      } else if (budget.percentage >= 80) {
        alerts.push({
          type: 'warning',
          message: `${budget.category} budget nearing limit (${Math.round(budget.percentage)}%)`,
          category: budget.category,
          priority: 'high'
        });
      } else if (budget.percentage >= 50) {
        alerts.push({
          type: 'info',
          message: `${budget.category} budget halfway used (${Math.round(budget.percentage)}%)`,
          category: budget.category,
          priority: 'low'
        });
      }
    });
    
    return alerts;
  }, [budgetsWithRealTimeTracking]);

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

      // Generate AI recommendations based on actual data
      const aiRecommendations = transactions && transactions.length > 0 
        ? RuleBasedFinancialAdvisor.analyzeSpendingPatterns(transactions, budgets || [], formatCurrency).slice(0, 4)
        : [
            'Add your transactions to get personalized financial insights',
            'Create budgets to track your spending limits',
            'Monitor your income and expense patterns regularly'
          ];

      setFinancialData(prev => ({
        ...prev,
        income,
        expenses,
        profit,
        transactions: transactions || [],
        budgets: budgets || [],
        alerts: realTimeAlerts,
        aiRecommendations
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

      // Set user settings
      setUserSettings({
        fullName: profile?.full_name || userData.name,
        email: userData.email,
        businessName: profile?.business_name || userData.businessName,
        phoneNumber: profile?.phone_number || '',
        currency: profile?.currency || 'NGN',
        language: profile?.language || 'en',
        dateFormat: profile?.date_format || 'MM/DD/YYYY',
        timezone: profile?.timezone || 'UTC',
        notifications: profile?.notification_settings || {
          budgetAlerts: true,
          weeklyReports: true,
          transactionAlerts: true,
          aiRecommendations: true
        }
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error fetching data');
    } finally {
      setLoading(false);
    }
  }

  // Transaction Management Functions
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

  const handleEditTransaction = async () => {
    if (!editingTransaction || !session) {
      showToast('Please log in to edit transactions');
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date
        })
        .eq('id', editingTransaction.id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      showToast('Transaction updated successfully!');
      setEditingTransaction(null);
      setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      
      // Refresh data
      await fetchData(session);
    } catch (error) {
      console.error('Error updating transaction:', error);
      showToast('Error updating transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!session) {
      showToast('Please log in to delete transactions');
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      showToast('Transaction deleted successfully!');
      setDeleteTransactionId(null);
      
      // Refresh data
      await fetchData(session);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showToast('Error deleting transaction');
    }
  };

  // Budget Management Functions
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

  const handleEditBudget = async () => {
    if (!editingBudget || !session) {
      showToast('Please log in to edit budgets');
      return;
    }

    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          category: budgetFormData.category,
          budget_limit: parseFloat(budgetFormData.budget_limit),
          period: budgetFormData.period
        })
        .eq('id', editingBudget.id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      showToast('Budget updated successfully!');
      setEditingBudget(null);
      setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
      
      // Refresh data
      await fetchData(session);
    } catch (error) {
      console.error('Error updating budget:', error);
      showToast('Error updating budget');
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!session) {
      showToast('Please log in to delete budgets');
      return;
    }

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      showToast('Budget deleted successfully!');
      setDeleteBudgetId(null);
      
      // Refresh data
      await fetchData(session);
    } catch (error) {
      console.error('Error deleting budget:', error);
      showToast('Error deleting budget');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  // Get data key for chart based on time filter
  const getDataKey = () => {
    return 'period';
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-lg shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
          <p className="font-semibold">{label}</p>
          <p className="text-emerald-600">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-600">Expenses: {formatCurrency(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Empty state component
  const EmptyState = ({ 
    title, 
    description, 
    icon: Icon, 
    action 
  }: { 
    title: string; 
    description: string; 
    icon: React.ComponentType<any>;
    action?: React.ReactNode;
  }) => (
    <div className="text-center sm:py-2">
      <div className={`w-16 h-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`mb-6 max-w-sm mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      {action}
    </div>
  );

  // Start editing a transaction
  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date
    });
  };

  // Start editing a budget
  const startEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetFormData({
      category: budget.category,
      budget_limit: budget.budget_limit.toString(),
      period: budget.period
    });
  };

  // Reset forms when dialogs close
  const handleBudgetDialogClose = () => {
    setShowBudgetForm(false);
    setEditingBudget(null);
    setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
  };

  const handleTransactionDialogClose = () => {
    setShowIncomeForm(false);
    setShowExpenseForm(false);
    setEditingTransaction(null);
    setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleEditTransactionDialogClose = () => {
    setEditingTransaction(null);
    setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleEditBudgetDialogClose = () => {
    setEditingBudget(null);
    setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`text-center py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Please log in to access the dashboard. <Link href="/auth/signin" className="text-emerald-600 hover:underline">Signin</Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          <Toast.Title className="font-semibold"></Toast.Title>
          <Toast.Description className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{toastMessage}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed top-4 right-4 z-50" />

        {/* Sidebar Component */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          darkMode={darkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={handleLogout}
        />

        {/* Main Content with sidebar offset */}
        <div className="flex-1 flex flex-col lg:ml-64">
          <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm sticky top-0 z-30`}>
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className={`p-2 rounded-xl ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                    title={showBalance ? 'Hide balance' : 'Show balance'}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <Select.Root value={language} onValueChange={setLanguage}>
                    <Select.Trigger className={`flex items-center space-x-2 px-3 py-2 rounded-xl hover:cursor-pointer border ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700 border-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300'}`}>
                      <Languages className="w-4 h-4" />
                      <Select.Value placeholder="Language" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className={`rounded-xl shadow-lg border z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <Select.Viewport className="p-2">
                          {languagesList.map((lang) => (
                            <Select.Item
                              key={lang.value}
                              value={lang.value}
                              className={`flex items-center px-3 py-2 rounded-lg hover:cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
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
                    <Select.Trigger className={`flex items-center space-x-2 px-3 py-2 rounded-xl hover:cursor-pointer border ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700 border-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300'}`}>
                      <Select.Value placeholder="Currency" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className={`rounded-xl shadow-lg border z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <Select.Viewport className="p-2">
                          {currencies.map((curr) => {
                            return (
                              <Select.Item
                                key={curr.value}
                                value={curr.value}
                                className={`flex items-center px-3 py-2 rounded-lg hover:cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
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

                  <button className={`p-2 rounded-xl relative hover:cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {realTimeAlerts.length}
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className={`p-2 rounded-xl lg:hidden hover:cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={handleLogout}
                    className={`hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl hover:cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold capitalize ${themeClasses.text.primary}`}>
                  {activeTab}
                </h1>
                <p className={`mt-1 sm:mt-2 text-sm sm:text-base ${themeClasses.text.secondary}`}>
                  {activeTab === 'overview' && 'Monitor your business finances and performance'}
                  {activeTab === 'transactions' && 'View and manage all transactions'}
                  {activeTab === 'budgets' && 'Create and track your budgets'}
                  {activeTab === 'reports' && 'Generate financial reports'}
                  {activeTab === 'analytics' && 'Analyze your financial data'}
                  {activeTab === 'settings' && 'Configure your account settings'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 w-auto lg:w-auto">
                <button 
                  onClick={() => setShowIncomeForm(true)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer text-sm sm:text-base border border-emerald-500">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add Income</span>
                </button>

                <button
                  onClick={() => setShowExpenseForm(true)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:cursor-pointer text-sm sm:text-base border transition-colors shadow-sm ${
                    darkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add Expense</span>
                </button>
                            
                <button
                 onClick={handleExportData}
                 className={`flex hover:cursor-pointer items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-colors shadow-sm text-sm sm:text-base border ${
                  darkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                 }`}>
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
                      className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Total Income</p>
                          <p className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{formatCurrency(financialData.income)}</p>
                        </div>
                        <div className={`p-2 sm:p-3 rounded-xl border ${darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-100 border-emerald-200'}`}>
                          <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                      </div>
                    </motion.div>
                            
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Total Expenses</p>
                          <p className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{formatCurrency(financialData.expenses)}</p>
                        </div>
                        <div className={`p-2 sm:p-3 rounded-xl border ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-100 border-red-200'}`}>
                          <TrendingDown className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                        </div>
                      </div>
                    </motion.div>
                            
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Net Profit</p>
                          <p className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{formatCurrency(financialData.profit)}</p>
                        </div>
                        <div className={`p-2 sm:p-3 rounded-xl border ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-100 border-blue-200'}`}>
                          <Wallet className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                            
                  {/* Income vs Expenses Bar Chart with Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }
                    }
                    transition={{ delay: 0.3 }}
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card} mt-4 sm:mt-6`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                      <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Income vs Expenses</h3>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className={`flex rounded-lg p-1 flex-wrap gap-1 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                          {timeFilters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                              <button
                                key={filter.value}
                                onClick={() => setTimeFilter(filter.value)}
                                className={`flex items-center px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                  timeFilter === filter.value
                                    ? `${darkMode ? 'bg-gray-700 text-emerald-400' : 'bg-white text-emerald-600'} shadow-sm`
                                    : `${themeClasses.text.secondary} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`
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
                      {!hasTransactionData ? (
                        <EmptyState
                          title="No Transaction Data"
                          description="Start adding income and expenses to see your financial trends visualized here."
                          icon={BarChart3}
                          action={
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => setShowIncomeForm(true)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 border border-emerald-500"
                              >
                                Add Income
                              </button>
                              <button 
                                onClick={() => setShowExpenseForm(true)}
                                className={`px-4 py-2 rounded-lg border ${
                                  darkMode 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                              >
                                Add Expense
                              </button>
                            </div>
                          }
                        />
                      ) : currentTrendData.every(d => d.income === 0 && d.expenses === 0) ? (
                        <div className={`flex items-center justify-center h-full ${themeClasses.text.muted}`}>
                          No data available for selected time period
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={currentTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                            <XAxis 
                              dataKey={getDataKey()}
                              tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                            />
                            <YAxis 
                              tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                              tickFormatter={(value) => `${formatCurrency(value)}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
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
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card} mt-4 sm:mt-6`}
                  >
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4 sm:mb-6`}>Category Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className={`text-sm font-medium text-emerald-600 mb-3 sm:mb-4 text-center ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Income Sources</h4>
                        <div className="h-56 sm:h-64">
                          {categoryBreakdown.income.reduce((sum, item) => sum + item.value, 0) === 0 ? (
                            <EmptyState
                              title="No Income Data"
                              description="Add income transactions to see your income sources breakdown."
                              icon={TrendingUp}
                              action={
                                <button 
                                  onClick={() => setShowIncomeForm(true)}
                                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 border border-emerald-500"
                                >
                                  Add Income
                                </button>
                              }
                            />
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
                                <Tooltip 
                                  formatter={(value) => formatCurrency(value as number)}
                                  contentStyle={{ 
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', 
                                    border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb', 
                                    color: darkMode ? 'white' : '#1F2937',
                                    borderRadius: '8px'
                                  }}
                                />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium text-red-600 mb-3 sm:mb-4 text-center ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Expense Categories</h4>
                        <div className="h-56 sm:h-64">
                          {categoryBreakdown.expenses.reduce((sum, item) => sum + item.value, 0) === 0 ? (
                            <EmptyState
                              title="No Expense Data"
                              description="Add expense transactions to see your spending categories breakdown."
                              icon={TrendingDown}
                              action={
                                <button 
                                  onClick={() => setShowExpenseForm(true)}
                                  className={`px-4 py-2 rounded-lg border ${
                                    darkMode 
                                      ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                  }`}
                                >
                                  Add Expense
                                </button>
                              }
                            />
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
                                    const total = categoryBreakdown.expenses.reduce((sum, item) => sum + item.value, 0);
                                    const percentage = total > 0 ? ((value as number / total) * 100).toFixed(0) : "0";
                                    return `${name} (${percentage}%)`;
                                  }}
                                  labelLine={false}
                                >
                                  {categoryBreakdown.expenses.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'][index % 6]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => formatCurrency(value as number)}
                                  contentStyle={{ 
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', 
                                    border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb', 
                                    color: darkMode ? 'white' : '#1F2937',
                                    borderRadius: '8px'
                                  }}
                                />
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
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Budget Management</h3>
                      <button onClick={() => setShowBudgetForm(true)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {budgetsWithRealTimeTracking.length === 0 ? (
                        <EmptyState
                          title="No Budgets Set"
                          description="Create budgets to track your spending and get alerts when you're nearing your limits."
                          icon={PieChart}
                          action={
                            <button 
                              onClick={() => setShowBudgetForm(true)}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 border border-emerald-500"
                            >
                              Create Budget
                            </button>
                          }
                        />
                      ) : (
                        budgetsWithRealTimeTracking.map((budget, index) => (
                          <div key={budget.id} className={`p-3 sm:p-4 rounded-xl group relative border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <span className={`text-sm font-medium ${themeClasses.text.primary}`}>{budget.category}</span>
                                <span className={`text-xs ml-2 ${themeClasses.text.muted}`}>({budget.period})</span>
                              </div>
                              <span className={`text-sm ${themeClasses.text.secondary}`}>
                                {formatCurrency(budget.spent)} / {formatCurrency(budget.budget_limit)}
                              </span>
                            </div>
                            <div className={`w-full rounded-full h-2 mb-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  budget.percentage >= 90
                                    ? 'bg-red-500'
                                    : budget.percentage >= 75
                                    ? 'bg-yellow-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-xs ${themeClasses.text.muted}`}>{Math.round(budget.percentage)}% spent</span>
                              <span className={`text-xs ${themeClasses.text.muted}`}>{formatCurrency(budget.budget_limit - budget.spent)} remaining</span>
                            </div>
                            
                            {/* Edit/Delete buttons */}
                            <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditBudget(budget)}
                                className={`p-1 rounded transition-colors ${darkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-100'}`}
                                title="Edit budget"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setDeleteBudgetId(budget.id)}
                                className={`p-1 rounded transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-100'}`}
                                title="Delete budget"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
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
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Budget Alerts</h3>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      {realTimeAlerts.length === 0 ? (
                        <div className={`text-center py-8 ${themeClasses.text.muted}`}>No alerts</div>
                      ) : (
                        realTimeAlerts.map((alert, index) => (
                          <div
                            key={index}
                            className={`p-3 sm:p-4 rounded-xl border ${
                              alert.priority === 'critical'
                                ? `${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`
                                : alert.priority === 'high'
                                ? `${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`
                                : `${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`rounded-full p-2 mr-3 ${
                                alert.priority === 'critical'
                                  ? `${darkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600'}`
                                  : alert.priority === 'high'
                                  ? `${darkMode ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`
                                  : `${darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`
                              }`}>
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${
                                  alert.priority === 'critical'
                                    ? `${darkMode ? 'text-red-300' : 'text-red-700'}`
                                    : alert.priority === 'high'
                                    ? `${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`
                                    : `${darkMode ? 'text-blue-300' : 'text-blue-700'}`
                                }`}>
                                  {alert.message}
                                </p>
                                <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>{alert.category}</p>
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
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>AI Recommendations</h3>
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      {financialData.aiRecommendations.map((recommendation, index) => (
                        <div key={index} className={`p-3 sm:p-4 rounded-xl border ${darkMode ? 'bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border-emerald-800' : 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'}`}>
                          <div className="flex items-start">
                            <div className={`rounded-full p-2 mr-3 ${darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'}`}>
                              <Lightbulb className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{recommendation}</p>
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
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Recent Transactions</h3>
                      <button 
                        onClick={() => setActiveTab('transactions')}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {financialData.transactions.length === 0 ? (
                        <EmptyState
                          title="No Transactions"
                          description="Start by adding your first income or expense transaction to track your finances."
                          icon={CreditCard}
                          action={
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => setShowIncomeForm(true)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 border border-emerald-500"
                              >
                                Add Income
                              </button>
                              <button 
                                onClick={() => setShowExpenseForm(true)}
                                className={`px-4 py-2 rounded-lg border ${
                                  darkMode 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                              >
                                Add Expense
                              </button>
                            </div>
                          }
                        />
                      ) : (
                        financialData.transactions.slice(0, 5).map((transaction) => (
                          <div key={transaction.id} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition-colors group border ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg mr-3 border ${
                                transaction.type === 'income' 
                                  ? `${darkMode ? 'bg-emerald-900/40 border-emerald-800' : 'bg-emerald-100 border-emerald-200'}`
                                  : `${darkMode ? 'bg-red-900/40 border-red-800' : 'bg-red-100 border-red-200'}`
                              }`}>
                                {transaction.type === 'income' ? (
                                  <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                ) : (
                                  <TrendingDown className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className={`font-medium truncate ${themeClasses.text.primary}`}>{transaction.category}</p>
                                <p className={`text-sm truncate ${themeClasses.text.secondary}`}>{transaction.description}</p>
                                <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                                  {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className={`font-semibold text-sm sm:text-base ${
                              transaction.type === 'income' 
                                ? `${darkMode ? 'text-emerald-400' : 'text-emerald-600'}` 
                                : `${darkMode ? 'text-red-400' : 'text-red-600'}`
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
                    className={`p-4 sm:p-6 rounded-2xl shadow-sm border ${themeClasses.card}`}
                  >
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Your Account</h3>
                    <div className="space-y-3">
                      <div className={`flex justify-between items-center p-3 sm:p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <span className={`text-sm ${themeClasses.text.secondary}`}>Plan</span>
                        <span className="text-sm font-medium text-emerald-600">{user.plan}</span>
                      </div>
                      <div className={`flex justify-between items-center p-3 sm:p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <span className={`text-sm ${themeClasses.text.secondary}`}>Member since</span>
                        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={`flex justify-between items-center p-3 sm:p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <span className={`text-sm ${themeClasses.text.secondary}`}>Transactions</span>
                        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                          {financialData.transactions.length} total
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
                            
            {/* Transactions Tab Content */}
            {activeTab === 'transactions' && (
              <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border ${themeClasses.card}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>All Transactions</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowIncomeForm(true)}
                      className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm border border-emerald-500"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Income</span>
                    </button>
                    <button 
                      onClick={() => setShowExpenseForm(true)}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-colors text-sm border ${
                        darkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Expense</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {financialData.transactions.length === 0 ? (
                    <EmptyState
                      title="No Transactions"
                      description="Start by adding your first income or expense transaction to track your finances."
                      icon={CreditCard}
                      action={
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => setShowIncomeForm(true)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 border border-emerald-500"
                          >
                            Add Income
                          </button>
                          <button 
                            onClick={() => setShowExpenseForm(true)}
                            className={`px-4 py-2 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                          >
                            Add Expense
                          </button>
                        </div>
                      }
                    />
                  ) : (
                    financialData.transactions.map((transaction) => (
                      <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-xl transition-colors group border ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`p-3 rounded-lg border ${
                            transaction.type === 'income' 
                              ? `${darkMode ? 'bg-emerald-900/40 border-emerald-800' : 'bg-emerald-100 border-emerald-200'}`
                              : `${darkMode ? 'bg-red-900/40 border-red-800' : 'bg-red-100 border-red-200'}`
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            ) : (
                              <TrendingDown className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className={`font-medium truncate ${themeClasses.text.primary}`}>{transaction.category}</p>
                              <span className={`px-2 py-1 text-xs rounded-full border ${
                                transaction.type === 'income' 
                                  ? `${darkMode ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}` 
                                  : `${darkMode ? 'bg-red-900/40 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200'}`
                              }`}>
                                {transaction.type}
                              </span>
                            </div>
                            <p className={`text-sm truncate mt-1 ${themeClasses.text.secondary}`}>
                              {transaction.description || 'No description'}
                            </p>
                            <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <p className={`text-lg font-semibold ${
                            transaction.type === 'income' 
                              ? `${darkMode ? 'text-emerald-400' : 'text-emerald-600'}` 
                              : `${darkMode ? 'text-red-400' : 'text-red-600'}`
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditTransaction(transaction)}
                              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-100'}`}
                              title="Edit transaction"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTransactionId(transaction.id)}
                              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-100'}`}
                              title="Delete transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
                            
            {/* Budgets Tab Content */}
            {activeTab === 'budgets' && (
              <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border ${themeClasses.card}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Budget Management</h3>
                  <button 
                    onClick={() => setShowBudgetForm(true)}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm border border-emerald-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Budget</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {budgetsWithRealTimeTracking.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState
                        title="No Budgets Set"
                        description="Create budgets to track your spending and get alerts when you're nearing your limits."
                        icon={PieChart}
                        action={
                          <button 
                            onClick={() => setShowBudgetForm(true)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 border border-emerald-500"
                          >
                            Create Budget
                          </button>
                        }
                      />
                    </div>
                  ) : (
                    budgetsWithRealTimeTracking.map((budget) => (
                      <div key={budget.id} className={`p-4 sm:p-6 rounded-xl border group relative ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>{budget.category}</h4>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>{budget.period} Budget</p>
                          </div>
                          <div className={`p-2 rounded-lg border ${
                            budget.percentage >= 90
                              ? `${darkMode ? 'bg-red-900/40 text-red-400 border-red-800' : 'bg-red-100 text-red-600 border-red-200'}`
                              : budget.percentage >= 75
                              ? `${darkMode ? 'bg-yellow-900/40 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-600 border-yellow-200'}`
                              : `${darkMode ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`
                          }`}>
                            {Math.round(budget.percentage)}%
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className={`flex justify-between text-sm mb-1 ${themeClasses.text.secondary}`}>
                            <span>Spent</span>
                            <span>Limit</span>
                          </div>
                          <div className={`w-full rounded-full h-3 mb-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                budget.percentage >= 90
                                  ? 'bg-red-500'
                                  : budget.percentage >= 75
                                  ? 'bg-yellow-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm font-medium">
                            <span className={themeClasses.text.primary}>{formatCurrency(budget.spent)}</span>
                            <span className={themeClasses.text.primary}>{formatCurrency(budget.budget_limit)}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className={themeClasses.text.secondary}>
                            {formatCurrency(budget.budget_limit - budget.spent)} remaining
                          </span>
                          <span className={`font-medium ${
                            budget.percentage >= 90
                              ? `${darkMode ? 'text-red-400' : 'text-red-600'}`
                              : budget.percentage >= 75
                              ? `${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`
                              : `${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`
                          }`}>
                            {budget.percentage >= 90 ? 'Over Budget' : 
                             budget.percentage >= 75 ? 'Almost There' : 'On Track'}
                          </span>
                        </div>
                        
                        {/* Edit/Delete buttons */}
                        <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditBudget(budget)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-100'}`}
                            title="Edit budget"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteBudgetId(budget.id)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-100'}`}
                            title="Delete budget"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab Content */}
            {activeTab === 'settings' && (
              <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border ${themeClasses.card}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Settings</h3>
                  <button 
                    onClick={handleSaveSettings}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm border border-emerald-500"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Profile Settings */}
                  <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Profile Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Full Name</label>
                        <input
                          type="text"
                          value={userSettings.fullName}
                          onChange={(e) => setUserSettings({...userSettings, fullName: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Email</label>
                        <input
                          type="email"
                          value={userSettings.email}
                          onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Business Name</label>
                        <input
                          type="text"
                          value={userSettings.businessName}
                          onChange={(e) => setUserSettings({...userSettings, businessName: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                          placeholder="Enter your business name"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Phone Number</label>
                        <input
                          type="tel"
                          value={userSettings.phoneNumber}
                          onChange={(e) => setUserSettings({...userSettings, phoneNumber: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Currency</label>
                        <select 
                          value={userSettings.currency}
                          onChange={(e) => setUserSettings({...userSettings, currency: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                        >
                          {currencies.map((curr) => (
                            <option key={curr.value} value={curr.value} className={darkMode ? 'bg-gray-700' : 'bg-white'}>{curr.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Language</label>
                        <select 
                          value={userSettings.language}
                          onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                        >
                          {languagesList.map((lang) => (
                            <option key={lang.value} value={lang.value} className={darkMode ? 'bg-gray-700' : 'bg-white'}>{lang.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Date Format</label>
                        <select 
                          value={userSettings.dateFormat}
                          onChange={(e) => setUserSettings({...userSettings, dateFormat: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                        >
                          <option value="MM/DD/YYYY" className={darkMode ? 'bg-gray-700' : 'bg-white'}>MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY" className={darkMode ? 'bg-gray-700' : 'bg-white'}>DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD" className={darkMode ? 'bg-gray-700' : 'bg-white'}>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>Time Zone</label>
                        <select 
                          value={userSettings.timezone}
                          onChange={(e) => setUserSettings({...userSettings, timezone: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${themeClasses.input}`}
                        >
                          <option value="UTC" className={darkMode ? 'bg-gray-700' : 'bg-white'}>UTC</option>
                          <option value="Africa/Lagos" className={darkMode ? 'bg-gray-700' : 'bg-white'}>West Africa Time (WAT)</option>
                          <option value="America/New_York" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Eastern Time (ET)</option>
                          <option value="Europe/London" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Greenwich Mean Time (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Notification Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>Budget Alerts</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Get notified when you're close to budget limits</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={userSettings.notifications.budgetAlerts}
                            onChange={(e) => setUserSettings({
                              ...userSettings, 
                              notifications: {...userSettings.notifications, budgetAlerts: e.target.checked}
                            })}
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-focus:ring-emerald-800 peer-checked:bg-emerald-600' 
                              : 'bg-gray-200 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600'
                          }`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>Weekly Reports</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Receive weekly financial summary emails</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={userSettings.notifications.weeklyReports}
                            onChange={(e) => setUserSettings({
                              ...userSettings, 
                              notifications: {...userSettings.notifications, weeklyReports: e.target.checked}
                            })}
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-focus:ring-emerald-800 peer-checked:bg-emerald-600' 
                              : 'bg-gray-200 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600'
                          }`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>Transaction Alerts</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Get notified for large transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={userSettings.notifications.transactionAlerts}
                            onChange={(e) => setUserSettings({
                              ...userSettings, 
                              notifications: {...userSettings.notifications, transactionAlerts: e.target.checked}
                            })}
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-focus:ring-emerald-800 peer-checked:bg-emerald-600' 
                              : 'bg-gray-200 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600'
                          }`}></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>AI Recommendations</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Receive AI-powered financial insights</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={userSettings.notifications.aiRecommendations}
                            onChange={(e) => setUserSettings({
                              ...userSettings, 
                              notifications: {...userSettings.notifications, aiRecommendations: e.target.checked}
                            })}
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-focus:ring-emerald-800 peer-checked:bg-emerald-600' 
                              : 'bg-gray-200 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600'
                          }`}></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Data Management</h4>
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'}`}>
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>Export Data</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Download your financial data as CSV</p>
                        </div>
                        <button 
                          onClick={handleExportData}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm border border-blue-500"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export</span>
                        </button>
                      </div>
                    
                      
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-red-800' : 'bg-white border-red-200'}`}>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Clear All Data</p>
                          <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Permanently delete all your financial data</p>
                        </div>
                        <button 
                          onClick={() => setShowClearDataDialog(true)}
                          className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm border border-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backup Management */}
                  <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Backup Management</h4>
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'}`}>
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>Create Backup</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Save your current data as a backup</p>
                        </div>
                        <button 
                          onClick={handleBackupData}
                          className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm border border-emerald-500"
                        >
                          <Save className="w-4 h-4" />
                          <span>Backup</span>
                        </button>
                      </div>
                      
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'}`}>
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>Restore Backup</p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>Restore from a previous backup</p>
                        </div>
                        <button 
                          onClick={() => setShowRestoreDialog(true)}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm border border-blue-500"
                        >
                          <Download className="w-4 h-4" />
                          <span>Restore</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Account Settings</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowChangePasswordDialog(true)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors group ${
                          darkMode ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg border ${darkMode ? 'bg-blue-900/40 border-blue-800' : 'bg-blue-100 border-blue-200'}`}>
                            <Key className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <p className={`font-medium ${themeClasses.text.primary}`}>Change Password</p>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>Update your account password</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 group-hover:${darkMode ? 'text-gray-300' : 'text-gray-600'} ${themeClasses.text.muted}`} />
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors group ${
                          darkMode ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg border ${darkMode ? 'bg-purple-900/40 border-purple-800' : 'bg-purple-100 border-purple-200'}`}>
                            <Bell className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          </div>
                          <div>
                            <p className={`font-medium ${themeClasses.text.primary}`}>Notification Settings</p>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>Manage how you receive notifications</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 group-hover:${darkMode ? 'text-gray-300' : 'text-gray-600'} ${themeClasses.text.muted}`} />
                      </button>
                      
                      <button 
                        onClick={() => setShowDeleteAccountDialog(true)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors group ${
                          darkMode ? 'bg-gray-600 border-red-800 hover:bg-red-900/20' : 'bg-white border-red-200 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg border ${darkMode ? 'bg-red-900/40 border-red-800' : 'bg-red-100 border-red-200'}`}>
                            <LogOut className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Delete Account</p>
                            <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Permanently delete your account</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-red-400 group-hover:text-red-300' : 'text-red-500 group-hover:text-red-600'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'transactions' && activeTab !== 'budgets' && activeTab !== 'settings' && (
              <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border ${themeClasses.card}`}>
                <div className="text-center py-8 sm:py-12">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                    darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-100 border-emerald-200'
                  }`}>
                    {activeTab === 'reports' && <FileText className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                    {activeTab === 'analytics' && <BarChart3  className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 capitalize ${themeClasses.text.primary}`}>{activeTab}</h3>
                  <p className={`text-sm sm:text-base ${themeClasses.text.secondary}`}>This section is coming soon. Stay tuned!!!</p>
                </div>
              </div>
            )}
          </main>
                            
          {/* AI Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center z-40 hover:cursor-pointer border border-emerald-500"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* MODALS SECTION - All modals imported and used here */}
          
          {/* Add Income Modal */}
          <AddTransactionModal
            isOpen={showIncomeForm}
            onClose={() => setShowIncomeForm(false)}
            type="income"
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={() => handleAddTransaction('income')}
            categories={categories}
            darkMode={darkMode}
          />

          {/* Add Expense Modal */}
          <AddTransactionModal
            isOpen={showExpenseForm}
            onClose={() => setShowExpenseForm(false)}
            type="expense"
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={() => handleAddTransaction('expense')}
            categories={expenseCategories}
            darkMode={darkMode}
          />

          {/* Add Budget Modal */}
          <AddBudgetModal
            isOpen={showBudgetForm}
            onClose={() => setShowBudgetForm(false)}
            formData={budgetFormData}
            onFormDataChange={setBudgetFormData}
            onSubmit={handleAddBudget}
            categories={expenseCategories}
            darkMode={darkMode}
          />

          {/* Edit Transaction Modal */}
          <EditTransactionModal
            isOpen={!!editingTransaction}
            onClose={() => setEditingTransaction(null)}
            transaction={editingTransaction}
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleEditTransaction}
            categories={editingTransaction?.type === 'income' ? categories : expenseCategories}
            darkMode={darkMode}
          />

          {/* Edit Budget Modal */}
          <EditBudgetModal
            isOpen={!!editingBudget}
            onClose={() => setEditingBudget(null)}
            budget={editingBudget}
            formData={budgetFormData}
            onFormDataChange={setBudgetFormData}
            onSubmit={handleEditBudget}
            categories={expenseCategories}
            darkMode={darkMode}
          />

          {/* Delete Transaction Confirmation */}
          <DeleteConfirmationModal
            isOpen={!!deleteTransactionId}
            onClose={() => setDeleteTransactionId(null)}
            onConfirm={() => deleteTransactionId && handleDeleteTransaction(deleteTransactionId)}
            title="Delete Transaction"
            description="Are you sure you want to delete this transaction? This action cannot be undone."
            darkMode={darkMode}
          />

          {/* Delete Budget Confirmation */}
          <DeleteConfirmationModal
            isOpen={!!deleteBudgetId}
            onClose={() => setDeleteBudgetId(null)}
            onConfirm={() => deleteBudgetId && handleDeleteBudget(deleteBudgetId)}
            title="Delete Budget"
            description="Are you sure you want to delete this budget? This action cannot be undone."
            darkMode={darkMode}
          />

          {/* Change Password Modal */}
          <ChangePasswordModal
            isOpen={showChangePasswordDialog}
            onClose={() => setShowChangePasswordDialog(false)}
            passwordData={passwordData}
            onPasswordDataChange={setPasswordData}
            onSubmit={handleChangePassword}
            darkMode={darkMode}
          />

          {/* Clear Data Modal */}
          <ClearDataModal
            isOpen={showClearDataDialog}
            onClose={() => setShowClearDataDialog(false)}
            onConfirm={handleClearData}
            darkMode={darkMode}
          />

          {/* Delete Account Modal */}
          <DeleteAccountModal
            isOpen={showDeleteAccountDialog}
            onClose={() => setShowDeleteAccountDialog(false)}
            onConfirm={handleDeleteAccount}
            darkMode={darkMode}
          />

          {/* Restore Backup Modal */}
          <RestoreBackupModal
            isOpen={showRestoreDialog}
            onClose={() => setShowRestoreDialog(false)}
            availableBackups={availableBackups}
            selectedBackup={selectedBackup}
            onSelectedBackupChange={setSelectedBackup}
            onRestore={handleRestoreBackup}
            darkMode={darkMode}
          />

          {/* AI Chat Modal */}
          <AIChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={sendMessage}
            darkMode={darkMode}
          />
        </div>
      </Toast.Provider>
    </div>
  );
}