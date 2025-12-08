'use client';

import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Sun, Moon, Bot } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { Sidebar } from './Sidebar';
import { TokenStatus } from './components/TokenStatus';
import { OverviewPage } from './components/pages/OverviewPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { BudgetsPage } from './components/pages/BudgetsPage';
import AccountsPage from './components/pages/AccountsPage';
import SettingsPage from './components/pages/SettingsPage';
import { ComingSoonPage } from './components/pages/ComingSoonPage';
import AIChatModal from './components/modals/AIChatModal';
import { TokenModal } from './components/modals/TokenModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { EditTransactionModal } from './components/modals/EditTransactionModal';
import { DeleteConfirmationModal } from './components/modals/DeleteConfirmationModal';
import { AddBudgetModal } from './components/modals/AddBudgetModal';
import { EditBudgetModal } from './components/modals/EditBudgetModal';

import type { EnhancedBudget } from '@/app/dashboard/types';
import { supabase } from '@/utils/supabase/client';
import { TransactionEncryption, type SensitiveTransactionData } from '@/utils/encryption';

type AllowedPeriodDisplay = 'Monthly' | 'Yearly' | 'Quarterly';

const toDisplayPeriod = (period: string): AllowedPeriodDisplay => {
  const map: Record<string, AllowedPeriodDisplay> = {
    monthly: 'Monthly',
    yearly: 'Yearly',
    quarterly: 'Quarterly'
  };
  return map[period.toLowerCase()] || 'Monthly';
};

const toDbPeriod = (period: AllowedPeriodDisplay): 'monthly' | 'yearly' | 'quarterly' => {
  const map: Record<AllowedPeriodDisplay, 'monthly' | 'yearly' | 'quarterly'> = {
    Monthly: 'monthly',
    Yearly: 'yearly',
    Quarterly: 'quarterly'
  };
  return map[period];
};

interface UserInfo {
  name: string;
  email: string;
  businessName: string;
  avatar: string;
  plan: string;
  joinedDate: string;
}

interface FinancialData {
  income: number;
  expenses: number;
  profit: number;
  transactions: any[];
  budgets: any[];
  alerts: any[];
  aiRecommendations: string[];
  cashFlowForecast: any[];
}

export default function DashboardClient({ initialSession }: { initialSession: any }) {
  const [session] = useState(initialSession);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Encryption states
  const [encryption, setEncryption] = useState<TransactionEncryption | null>(null);
  const [needsEncryptionSetup, setNeedsEncryptionSetup] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // AI Chat States
  const [aiStatus, setAiStatus] = useState<'openrouter' | 'standard' | 'checking'>('checking');
  const [tokens, setTokens] = useState(100);
  const [openRouterAvailable, setOpenRouterAvailable] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('Checking...');
  const [modelIntelligence, setModelIntelligence] = useState<string>('Medium');
  const [estimatedCost, setEstimatedCost] = useState<string>('FREE 🎉');

  // Currency and language states
  const [currency, setCurrency] = useState('NGN');
  const [language, setLanguage] = useState('en');

  // Modal states
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false);

  // Settings dialog states
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // Transaction form data
  const [transactionFormData, setTransactionFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  // Budget form data
  const [budgetFormData, setBudgetFormData] = useState<{
    category: string;
    budget_limit: string;
    period: AllowedPeriodDisplay;
  }>({
    category: '',
    budget_limit: '',
    period: 'Monthly'
  });

  // Edit budget form data
  const [editBudgetFormData, setEditBudgetFormData] = useState<{
    category: string;
    budget_limit: string;
    period: AllowedPeriodDisplay;
  }>({
    category: '',
    budget_limit: '',
    period: 'Monthly'
  });

  // Edit transaction form data
  const [editFormData, setEditFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  // User settings state
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    twoFactorAuth: false,
    autoBackup: true,
    emailReports: true,
    pushNotifications: true,
    currency: 'NGN',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeZone: 'Africa/Lagos',
    theme: 'dark'
  });

  // Editing and deletion states
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editingBudget, setEditingBudget] = useState<EnhancedBudget | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User info
  const [user, setUser] = useState<UserInfo>({
    name: 'User',
    email: '',
    businessName: 'My Business',
    avatar: '/api/placeholder/40/40',
    plan: 'Free Plan',
    joinedDate: new Date().toISOString().split('T')[0]
  });

  // Financial data
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0,
    expenses: 0,
    profit: 0,
    transactions: [],
    budgets: [],
    alerts: [],
    aiRecommendations: ['Add transactions to get insights'],
    cashFlowForecast: []
  });

  // Alias for delete account dialog to use existing delete modal
  const setShowDeleteAccountDialog = setShowDeleteModal;

  // Language and currency options
  const languagesList = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'sw', label: 'Swahili' },
    { value: 'yo', label: 'Yoruba' },
    { value: 'ig', label: 'Igbo' },
    { value: 'ha', label: 'Hausa' }
  ];

  const currencies = [
    { value: 'NGN', label: 'Naira' },
    { value: 'CFA', label: 'XFA' },
    { value: 'USD', label: 'Dollar' },
    { value: 'EUR', label: 'Euro' }
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [realTimeAlerts, setRealTimeAlerts] = useState<any[]>([]);

  // Income categories
  const incomeCategories = [
    'Sales Money', 'Service Income', 'Bank Interest', 'Share Dividends', 'Rent from Property',
    'Consulting Fees', 'Subscription Money', 'Commission Earned',
    'Advertising Money', 'Sponsorship Funds', 'Grants & Donations',
    'Investment Profits', 'Royalty Payments', 'Property Sale Profits',
    'Crop Sales (Coffee/Cocoa)', 'Crop Sales (Maize/Cassava)', 'Animal Sales',
    'Fish Sales', 'Government Salary', 'Market Trading Income',
    'Small Import Business', 'Export Raw Materials', 'Export Finished Goods',
    'Online Freelance Work', 'Taxi/Ride Income', 'Motorcycle Taxi Income',
    'Truck Transport Income', 'Bus/Minibus Income', 'Small Shop Sales',
    'Handwork/Skills Income', 'Professional Fees', 'Tech Business Income',
    'House/Room Rent', 'Shop/Office Rent', 'Equipment Rent',
    'Farm Land Rent', 'Money from Abroad', 'Mobile Money Fees',
    'Airtime/Data Business', 'Music/Events Income', 'Tourism Income',
    'Small Mining Income', 'Large Mining Income', 'Solar Energy Sales',
    'Internet/Phone Services', 'Franchise Fees', 'Brand License Fees',
    'NGO/Government Grants', 'Loan Interest Income', 'Crypto Trading',
    'Clothing Business', 'Handicraft Sales', 'Other Income'
  ];

  // Expense categories
  const expenseCategories = [
    'Food & Eating Out', 'Transport Costs', 'Bills (Water/Light)', 'Rent Payment', 'Fun/Entertainment',
    'Medical Costs', 'School Fees', 'Shopping', 'Travel Costs', 'Miscellaneous',
    'Generator Fuel', 'Vehicle Fuel', 'Machine Fuel', 'Phone Credit/Data',
    'Money Transfer Fees', 'Market Daily Fees', 'Company Taxes',
    'Import Taxes', 'Market Stall Fees', 'Farm Supplies',
    'Shop/Office Rent', 'House Rent', 'Market Stall Rent',
    'Generator Repairs', 'Car/Truck Repairs', 'Motorcycle Repairs',
    'Staff Transport', 'Goods Transport', 'Port/Customs Fees',
    'Electricity Bill', 'Solar System Cost', 'Water Bill',
    'Security Costs', 'Daily Worker Pay', 'Staff Salaries',
    'Family Support', 'Local Materials', 'Imported Materials',
    'Stock Purchase', 'Packaging Materials', 'Refrigeration Costs',
    'Union/Group Fees', 'Business Permits', 'Medical Costs (Staff)',
    'Community Contributions', 'Radio/Newspaper Ads', 'Social Media Ads',
    'Customer Phone Credit', 'Staff Generator Fuel', 'Other Expenses'
  ];

  // Check encryption status on component mount
  useEffect(() => {
    checkEncryptionStatus();
    checkOpenRouterStatus();
  }, []);

  // Check encryption status for the user
  const checkEncryptionStatus = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Check if user has any encrypted transactions
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('is_encrypted')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (error) throw error;
      
      const hasTransactions = transactions && transactions.length > 0;
      const hasEncrypted = transactions?.some(t => t.is_encrypted);
      
      // If user has transactions but none are encrypted, show setup
      if (hasTransactions && !hasEncrypted) {
        setNeedsEncryptionSetup(true);
      }
      
      // Check if user already has encryption setup in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('encryption_setup_at')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.encryption_setup_at && !hasEncrypted) {
        // User has encryption setup but needs to enter password
        setShowEncryptionModal(true);
      }
    } catch (error) {
      console.error('Error checking encryption status:', error);
    }
  };

  // Handle encryption setup
  const handleEncryptionSetup = async (): Promise<void> => {
    if (!encryptionPassword.trim() || !session?.user?.id) {
      toast.error('Password is required');
      return;
    }
    
    setIsEncrypting(true);
    try {
      const enc = new TransactionEncryption();
      await enc.initialize(session.user.id, encryptionPassword);
      setEncryption(enc);
      
      // Encrypt existing transactions
      await migrateTransactionsToEncryption(enc);
      
      // Mark encryption as setup in user profile
      await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          encryption_setup_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      setNeedsEncryptionSetup(false);
      setShowEncryptionModal(false);
      setEncryptionPassword('');
      
      toast.success('Encryption enabled! Your data is now secure.');
      
      // Reload data to show decrypted transactions
      await loadData();
      
    } catch (error: any) {
      console.error('Encryption setup failed:', error);
      toast.error(error.message || 'Failed to setup encryption');
    } finally {
      setIsEncrypting(false);
    }
  };

  // Migrate existing transactions to encrypted format
  const migrateTransactionsToEncryption = async (encryptionService: TransactionEncryption): Promise<void> => {
    if (!session?.user?.id) return;
    
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_encrypted', false)
        .not('amount', 'is', null);
      
      if (error) throw error;
      if (!transactions || transactions.length === 0) return;
      
      toast.loading(`Encrypting ${transactions.length} transactions...`, {
        duration: 3000
      });
      
      for (const tx of transactions) {
        try {
          const sensitiveData: SensitiveTransactionData = {
            amount: tx.amount || 0,
            description: tx.description || ''
          };
          
          const encryptedPayload = await encryptionService.encryptTransaction(sensitiveData);
          
          await supabase
            .from('transactions')
            .update({
              encrypted_payload: encryptedPayload,
              encryption_key: 'user-password-key',
              is_encrypted: true,
              amount: null,
              description: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', tx.id);
          
        } catch (txError) {
          console.error(`Failed to encrypt transaction ${tx.id}:`, txError);
        }
      }
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  };

  // Real-time enhanced budgets
  const budgetsWithRealTimeTracking: EnhancedBudget[] = useMemo(() => {
    if (!financialData.budgets || financialData.budgets.length === 0) {
      return [];
    }
    
    return financialData.budgets.map((budget: any): EnhancedBudget => {
      const spent = financialData.transactions
        .filter((t: any) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

      const percentage = budget.budget_limit > 0 ? (spent / budget.budget_limit) * 100 : 0;

      const period = (budget.period || 'monthly').toLowerCase() as EnhancedBudget['period'];

      return {
        id: budget.id,
        category: budget.category,
        budget_limit: Number(budget.budget_limit),
        spent,
        percentage,
        period,
        created_at: budget.created_at,
        user_id: budget.user_id || session?.user?.id || '',
        type: 'expense'
      };
    });
  }, [financialData.budgets, financialData.transactions, session?.user?.id]);

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    if (!showBalance && amount !== 0) return '••••••';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format currency for AI context
  const formatCurrencyForAI = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

<<<<<<< HEAD
  // Context generation for AI
=======
  // Generate financial context for AI
>>>>>>> f8343ef38d85349a0f3b5962d29afd30beee73d2
  const generateFinancialContext = (): string => {
    const hasTransactions = financialData.transactions && financialData.transactions.length > 0;
    const hasBudgets = financialData.budgets && financialData.budgets.length > 0;
    const hasData = hasTransactions || hasBudgets;
    
    if (!hasData) {
      return `NO FINANCIAL DATA: User has not added any transactions or budgets yet. They need to track finances first.`;
    }

    // Core metrics
    const keyMetrics = `FINANCIAL METRICS:
• Total Income: ${formatCurrencyForAI(financialData.income)}
• Total Expenses: ${formatCurrencyForAI(financialData.expenses)}
• Net ${financialData.profit >= 0 ? 'Profit' : 'Loss'}: ${formatCurrencyForAI(Math.abs(financialData.profit))}
• Profit Margin: ${financialData.income > 0 ? ((financialData.profit / financialData.income) * 100).toFixed(1) : 0}%
• Transaction Count: ${hasTransactions ? financialData.transactions.length : 0}
• Active Budgets: ${hasBudgets ? financialData.budgets.length : 0}`;

    // Expense breakdown
    let expenseBreakdown = '';
    const expenseTransactions = financialData.transactions.filter((t: any) => t.type === 'expense');
    
    if (expenseTransactions.length > 0) {
      const expenseByCategory = expenseTransactions.reduce((acc: Record<string, number>, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + (Number(t.amount) || 0);
        return acc;
      }, {});
      
      const sortedExpenses = Object.entries(expenseByCategory)
        .sort(([, a], [, b]) => b - a);
      
      if (sortedExpenses.length > 0) {
        expenseBreakdown = `EXPENSE BREAKDOWN (Top 5):\n${sortedExpenses.slice(0, 5).map(([cat, amt], i) => {
          const percentage = financialData.expenses > 0 ? ((amt / financialData.expenses) * 100).toFixed(1) : '0';
          return `${i+1}. ${cat}: ${formatCurrencyForAI(amt)} (${percentage}%)`;
        }).join('\n')}`;
      }
    }

    // Income breakdown
    let incomeBreakdown = '';
    const incomeTransactions = financialData.transactions.filter((t: any) => t.type === 'income');
    
    if (incomeTransactions.length > 0) {
      const incomeByCategory = incomeTransactions.reduce((acc: Record<string, number>, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + (Number(t.amount) || 0);
        return acc;
      }, {});
      
      const sortedIncome = Object.entries(incomeByCategory)
        .sort(([, a], [, b]) => b - a);
      
      if (sortedIncome.length > 0) {
        incomeBreakdown = `INCOME SOURCES:\n${sortedIncome.slice(0, 3).map(([cat, amt], i) => {
          const percentage = financialData.income > 0 ? ((amt / financialData.income) * 100).toFixed(1) : '0';
          return `${i+1}. ${cat}: ${formatCurrencyForAI(amt)} (${percentage}%)`;
        }).join('\n')}`;
      }
    }

    // Budget analysis
    let budgetAnalysis = '';
    if (hasBudgets && financialData.budgets.length > 0) {
      const budgetItems = financialData.budgets.map((b: any) => {
        const spent = financialData.transactions
          .filter((t: any) => t.type === 'expense' && t.category === b.category)
          .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
        const percentage = b.budget_limit > 0 ? (spent / b.budget_limit) * 100 : 0;
        const remaining = b.budget_limit - spent;
        const status = percentage > 100 ? '❌ OVER' : percentage > 90 ? '⚠️ NEAR LIMIT' : percentage > 70 ? '📊 WATCHING' : '✅ OK';
        return `• ${b.category}: ${status} - ${percentage.toFixed(1)}% used (${formatCurrencyForAI(spent)} / ${formatCurrencyForAI(b.budget_limit)}) - Remaining: ${formatCurrencyForAI(remaining > 0 ? remaining : 0)}`;
      });
      budgetAnalysis = `BUDGET ANALYSIS:\n${budgetItems.join('\n')}`;
    }

    // Recent activity
    let recentActivity = '';
    const recentTransactions = financialData.transactions.slice(0, 5);
    if (recentTransactions.length > 0) {
      recentActivity = `RECENT TRANSACTIONS:\n${recentTransactions.map((t: any, i: number) => 
        `${i+1}. ${t.date}: ${t.type === 'income' ? '📈 INCOME' : '📉 EXPENSE'} - ${t.category} - ${formatCurrencyForAI(t.amount)}${t.description ? ` (${t.description})` : ''}`
      ).join('\n')}`;
    }

    // Financial health indicators
    const savingsRate = financialData.income > 0 ? ((financialData.profit / financialData.income) * 100).toFixed(1) : '0';
    const emergencyFundMonths = financialData.expenses > 0 ? (0 / financialData.expenses).toFixed(1) : '0';
    
    const healthIndicators = `FINANCIAL HEALTH:
• Savings Rate: ${savingsRate}% ${Number(savingsRate) >= 20 ? '✅' : Number(savingsRate) >= 10 ? '⚠️' : '❌'}
• Emergency Fund: ${emergencyFundMonths} months coverage (Goal: 3-6 months)
• Expense-to-Income Ratio: ${financialData.income > 0 ? ((financialData.expenses / financialData.income) * 100).toFixed(1) : '0'}%`;

    return `${keyMetrics}\n\n${healthIndicators}\n\n${expenseBreakdown}\n\n${incomeBreakdown}\n\n${budgetAnalysis}\n\n${recentActivity}`.trim();
  };

<<<<<<< HEAD
  // OpenRouter status check
=======
  // Check OpenRouter status
>>>>>>> f8343ef38d85349a0f3b5962d29afd30beee73d2
  const checkOpenRouterStatus = async () => {
    try {
      console.log('🔄 Checking OpenRouter for AI models...');
      setAiStatus('checking');
      setCurrentModel('Checking availability...');
      
      const response = await fetch('/api/chat', { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 OpenRouter Status:', data);
      
      if (data.status === 'ok') {
        setOpenRouterAvailable(true);
        setAiStatus('openrouter');
        setCurrentModel('Amazon Nova Lite');
        setModelIntelligence('Medium');
        
        toast.success(`✅ OpenRouter AI Enabled: Amazon Nova Lite`, {
          duration: 3000,
          icon: '🚀'
        });
        
        console.log(`✅ OpenRouter ready. Free model: Amazon Nova Lite`);
      } else {
        setOpenRouterAvailable(false);
        setAiStatus('standard');
        setCurrentModel('Not Available');
        setModelIntelligence('Basic');
        
        console.warn('⚠️ OpenRouter not properly configured:', data.message);
        toast.error('OpenRouter AI not available. Check API setup.', {
          duration: 4000
        });
      }
      
    } catch (error: any) {
      console.error('❌ OpenRouter Health check failed:', error);
      setAiStatus('standard');
      setOpenRouterAvailable(false);
      setCurrentModel('Offline');
      setModelIntelligence('Basic');
      
      toast.error('AI services offline. Using fallback mode.', {
        duration: 3000
      });
    }
  };

<<<<<<< HEAD
  // Load data with decryption support
  const loadData = async (): Promise<void> => {
=======
  // AI Chat handler for OpenRouter
  const handleSendMessage = async (message: string, files?: File[]): Promise<string> => {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('style', 'balanced');
    
    if (files) {
      files.forEach(file => formData.append('files', file));
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.response;
  };

  // Load user data
  const loadData = async () => {
>>>>>>> f8343ef38d85349a0f3b5962d29afd30beee73d2
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Loading user data...');
      const [{ data: txs }, { data: budgets }] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', session.user.id)
      ]);

      let transactions = txs || [];
      
      // Decrypt encrypted transactions if we have encryption key
      if (encryption && encryption.isInitialized()) {
        setIsDecrypting(true);
        const decryptedTransactions = await Promise.all(
          transactions.map(async (tx: any) => {
            if (tx.is_encrypted && tx.encrypted_payload) {
              try {
                const decrypted = await encryption.decryptTransaction(tx.encrypted_payload);
                return {
                  ...tx,
                  amount: decrypted.amount,
                  description: decrypted.description
                };
              } catch (decryptError) {
                console.error(`Failed to decrypt transaction ${tx.id}:`, decryptError);
                // Return transaction with masked data
                return {
                  ...tx,
                  amount: null,
                  description: encryption ? '[Encrypted - Requires Password]' : '[Encrypted]'
                };
              }
            }
            return tx;
          })
        );
        
        transactions = decryptedTransactions;
        setIsDecrypting(false);
      }
      
      const budgetsArray = budgets || [];
      
      const income = transactions
        .filter((t: any) => t.type === 'income')
        .reduce((a: number, t: any) => a + (Number(t.amount) || 0), 0);
      
      const expenses = transactions
        .filter((t: any) => t.type === 'expense')
        .reduce((a: number, t: any) => a + (Number(t.amount) || 0), 0);
      
      const profit = income - expenses;

      setFinancialData({
        income,
        expenses,
        profit,
        transactions,
        budgets: budgetsArray,
        alerts: [],
        aiRecommendations: transactions.length > 3
          ? [
              profit >= 0 ? `Great! You're saving ${((profit / income) * 100).toFixed(1)}% of income` : `Reduce expenses by ${((Math.abs(profit) / expenses) * 100).toFixed(1)}%`,
              budgetsArray.length > 0 ? `${budgetsArray.length} active budgets tracking` : 'Set up budgets to control spending'
            ]
          : ['Add transactions to unlock smart AI insights'],
        cashFlowForecast: []
      });

      setUser({
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        businessName: session.user.user_metadata?.business_name || 'My Business',
        avatar: session.user.user_metadata?.avatar_url || '/api/placeholder/40/40',
        plan: 'Free Plan',
        joinedDate: new Date(session.user.created_at || Date.now()).toISOString().split('T')[0]
      });
      
      console.log('✅ Data loaded successfully');
      
    } catch (err: any) {
      console.error('❌ Error loading data:', err);
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [session?.user?.id, encryption]);

<<<<<<< HEAD
  // Transaction handlers with encryption support
  const handleSubmitTransaction = async (): Promise<void> => {
    if (!session?.user) {
      toast.error('Please sign in');
      return;
    }
    
=======
  // Handle saving user settings
  const handleSaveSettings = async () => {
    try {
      if (!session?.user?.id) {
        toast.error('Not authenticated');
        return;
      }

      setIsSubmitting(true);
      
      // Update user settings in Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          settings: userSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exporting data
  const handleExportData = async () => {
    try {
      if (!session?.user?.id) {
        toast.error('Not authenticated');
        return;
      }

      // Fetch all user data
      const [
        { data: transactions },
        { data: budgets },
        { data: accounts },
        { data: settings }
      ] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', session.user.id),
        supabase.from('budgets').select('*').eq('user_id', session.user.id),
        supabase.from('accounts').select('*').eq('user_id', session.user.id),
        supabase.from('user_settings').select('*').eq('user_id', session.user.id)
      ]);

      // Create export object
      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          email: user.email,
          businessName: user.businessName,
          plan: user.plan
        },
        transactions: transactions || [],
        budgets: budgets || [],
        accounts: accounts || [],
        settings: settings?.[0]?.settings || {},
        financialSummary: {
          totalIncome: financialData.income,
          totalExpenses: financialData.expenses,
          netProfit: financialData.profit,
          totalTransactions: financialData.transactions.length,
          activeBudgets: financialData.budgets.length
        }
      };

      // Convert to JSON string
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monietar-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Handle data backup
  const handleBackupData = async () => {
    try {
      if (!session?.user?.id) {
        toast.error('Not authenticated');
        return;
      }

      setIsSubmitting(true);
      
      // Create backup record
      const { error } = await supabase
        .from('backups')
        .insert({
          user_id: session.user.id,
          backup_data: {
            transactions: financialData.transactions,
            budgets: financialData.budgets,
            settings: userSettings,
            financialSummary: {
              income: financialData.income,
              expenses: financialData.expenses,
              profit: financialData.profit
            }
          },
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Backup created successfully!');
    } catch (error: any) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transaction handlers
  const handleSubmitTransaction = async () => {
    if (!session?.user) return toast.error('Please sign in');
>>>>>>> f8343ef38d85349a0f3b5962d29afd30beee73d2
    setIsSubmitting(true);
    
    try {
      const type = showIncomeForm ? 'income' : 'expense';
      const amount = parseFloat(transactionFormData.amount);
      
      if (isNaN(amount)) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      const transactionData: any = {
        amount,
        category: transactionFormData.category,
        description: transactionFormData.description,
        date: transactionFormData.date || new Date().toISOString().split('T')[0],
        type,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // If encryption is available, encrypt sensitive data
      if (encryption && encryption.isInitialized()) {
        try {
          const sensitiveData: SensitiveTransactionData = {
            amount,
            description: transactionFormData.description || ''
          };
          
          const encryptedPayload = await encryption.encryptTransaction(sensitiveData);
          
          // Add encrypted data
          transactionData.encrypted_payload = encryptedPayload;
          transactionData.encryption_key = 'user-password-key';
          transactionData.is_encrypted = true;
          
          // Clear plaintext sensitive fields
          transactionData.amount = null;
          transactionData.description = null;
          
        } catch (encryptError) {
          console.error('Encryption failed:', encryptError);
          toast.error('Failed to encrypt transaction. Using plaintext.');
        }
      }
      
      const { error } = await supabase
        .from('transactions')
        .insert([transactionData]);

      if (error) throw error;
      
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added!`);
      setTransactionFormData({ amount: '', category: '', description: '', date: '' });
      setShowIncomeForm(false);
      setShowExpenseForm(false);
      
      await loadData();
      
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setEditFormData({
      amount: transaction.amount?.toString() || '',
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date
    });
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction) return;
    setIsSubmitting(true);
    try {
      const amount = parseFloat(editFormData.amount);
      
      const updateData: any = {
        category: editFormData.category,
        description: editFormData.description,
        date: editFormData.date,
        updated_at: new Date().toISOString()
      };
      
      // If encryption is available and transaction is encrypted
      if (encryption && encryption.isInitialized() && editingTransaction.is_encrypted) {
        try {
          const sensitiveData: SensitiveTransactionData = {
            amount,
            description: editFormData.description || ''
          };
          
          const encryptedPayload = await encryption.encryptTransaction(sensitiveData);
          
          // Update encrypted data
          updateData.encrypted_payload = encryptedPayload;
          updateData.amount = null;
          updateData.description = null;
          
        } catch (encryptError) {
          console.error('Encryption failed:', encryptError);
          toast.error('Failed to encrypt update. Using plaintext.');
          updateData.amount = amount;
        }
      } else {
        updateData.amount = amount;
      }
      
      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', editingTransaction.id);

      if (error) throw error;
      toast.success('Transaction updated!');
      setShowEditModal(false);
      setEditingTransaction(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBudget = async () => {
    if (!session?.user?.id) {
      toast.error('Not authenticated');
      return;
    }

    const userId = session.user.id;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          category: budgetFormData.category,
          budget_limit: parseFloat(budgetFormData.budget_limit) || 0,
          period: toDbPeriod(budgetFormData.period),
          user_id: userId,
        })
        .select();

      if (error) throw error;

      toast.success('Budget created!');
      setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
      setShowBudgetForm(false);
      await loadData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditBudget = (budget: EnhancedBudget) => {
    setEditingBudget(budget);
    setEditBudgetFormData({
      category: budget.category,
      budget_limit: budget.budget_limit.toString(),
      period: toDisplayPeriod(budget.period)
    });
    setShowEditBudgetModal(true);
  };

  const handleUpdateBudget = async () => {
    if (!editingBudget) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          category: editBudgetFormData.category,
          budget_limit: parseFloat(editBudgetFormData.budget_limit),
          period: toDbPeriod(editBudgetFormData.period),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBudget.id);

      if (error) throw error;
      toast.success('Budget updated!');
      setShowEditBudgetModal(false);
      setEditingBudget(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDeleteBudget: Dispatch<SetStateAction<string | null>> = (value) => {
    const id = typeof value === 'function' ? value(deleteBudgetId) : value;
    setDeleteBudgetId(id);
    if (id) setShowDeleteBudgetModal(true);
  };

  const handleDeleteBudget = async () => {
    if (!deleteBudgetId) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('budgets').delete().eq('id', deleteBudgetId);
      if (error) throw error;
      toast.success('Budget deleted!');
      setShowDeleteBudgetModal(false);
      setDeleteBudgetId(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDeleteTransaction = (id: string) => {
    setDeleteTransactionId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTransactionId) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', deleteTransactionId);
      if (error) throw error;
      toast.success('Transaction deleted!');
      setShowDeleteModal(false);
      setDeleteTransactionId(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
  const handleLogout = async (): Promise<void> => {
    // Clear encryption keys
    if (encryption) {
      encryption.clear();
      setEncryption(null);
    }
    
=======
  // Logout handler
  const handleLogout = async () => {
>>>>>>> f8343ef38d85349a0f3b5962d29afd30beee73d2
    await supabase.auth.signOut();
    window.location.href = '/auth/signin';
  };

  // Theme classes
  const themeClasses = {
    container: darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-gray-200' : 'text-gray-800',
      secondary: darkMode ? 'text-gray-400' : 'text-gray-500',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500'
    },
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Image
          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
          alt="Monietar"
          width={220}
          height={50}
          className="mb-8 animate-ping"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      <Toaster position="top-right" />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        darkMode={darkMode}
        onLogout={handleLogout}
        setDarkMode={setDarkMode}
        showBalance={showBalance}
        setShowBalance={setShowBalance}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        currencies={currencies}
        languagesList={languagesList}
        realTimeAlerts={realTimeAlerts}
        isDecrypting={isDecrypting}
        encryptionEnabled={!!encryption}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-gray-900/90 backdrop-blur border-b border-gray-800 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-4">
              <TokenStatus
                tokenStatus={{ 
                  tokensRemaining: tokens, 
                  totalTokens: 100, 
                  resetTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  percentage: (tokens / 100) * 100 
                }}
                darkMode={darkMode}
                onUpgradeClick={() => setShowTokenModal(true)}
              />
              {encryption && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-700/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-300">
                    🔒 Encrypted
                  </span>
                </div>
              )}
              {openRouterAvailable && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700/50">
                  <div className={`w-2 h-2 rounded-full ${
                    modelIntelligence === 'High' || modelIntelligence === 'Highest' ? 'bg-purple-500' :
                    modelIntelligence.includes('Medium') ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <span className="text-xs font-medium text-purple-300">
                    {currentModel.replace('Claude 3 ', '').replace('Amazon ', '').replace('Gemini ', '')}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!encryption && needsEncryptionSetup && (
                <button
                  onClick={() => setShowEncryptionModal(true)}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Enable Encryption
                </button>
              )}
              <button onClick={() => setDarkMode(d => !d)} className="p-2 rounded-lg hover:bg-gray-800 transition">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {isDecrypting && (
            <div className="fixed top-20 right-6 z-40 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Decrypting data...
            </div>
          )}

          {activeTab === 'overview' && (
            <OverviewPage
              financialData={financialData}
              formatCurrency={formatCurrency}
              timeFilter="monthly"
              setTimeFilter={() => {}}
              timeFilters={['daily', 'weekly', 'monthly', 'quarterly', 'yearly']}
              hasTransactionData={financialData.transactions.length > 0}
              themeClasses={themeClasses}
              showBalance={showBalance}
              darkMode={darkMode}
              currency="NGN"
              language="en"
              user={user}
              aiRecommendations={financialData.aiRecommendations}
              transactions={financialData.transactions}
              income={financialData.income}
              expenses={financialData.expenses}
              profit={financialData.profit}
              totalTransactions={financialData.transactions.length}
              setShowIncomeForm={setShowIncomeForm}
              setShowExpenseForm={setShowExpenseForm}
              setShowBudgetForm={() => setShowBudgetForm(true)}
              CustomTooltip={() => null}
              encryptionEnabled={!!encryption}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage
              financialData={financialData}
              formatCurrency={formatCurrency}
              setShowIncomeForm={setShowIncomeForm}
              setShowExpenseForm={setShowExpenseForm}
              startEditTransaction={handleStartEditTransaction}
              setDeleteTransactionId={handleStartDeleteTransaction}
              editingTransaction={editingTransaction}
              deleteTransactionId={deleteTransactionId}
              darkMode={darkMode}
              themeClasses={themeClasses}
              EmptyState={() => <div className="text-center py-12 text-gray-500">No transactions yet</div>}
              encryptionEnabled={!!encryption}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsPage
              budgetsWithRealTimeTracking={budgetsWithRealTimeTracking}
              formatCurrency={formatCurrency}
              setShowBudgetForm={() => setShowBudgetForm(true)}
              startEditBudget={handleStartEditBudget}
              setDeleteBudgetId={handleStartDeleteBudget}
              editingBudget={editingBudget as any}
              deleteBudgetId={deleteBudgetId}
              themeClasses={themeClasses}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'connect account' && (
            <AccountsPage session={session} darkMode={darkMode} showToast={toast} themeClasses={themeClasses} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              userSettings={userSettings}
              setUserSettings={setUserSettings}
              handleSaveSettings={handleSaveSettings}
              handleExportData={handleExportData}
              setShowChangePasswordDialog={setShowChangePasswordDialog}
              setShowClearDataDialog={setShowClearDataDialog}
              setShowDeleteAccountDialog={setShowDeleteAccountDialog}
              setShowRestoreDialog={setShowRestoreDialog}
              handleBackupData={handleBackupData}
              darkMode={darkMode}
              themeClasses={themeClasses}
              languagesList={languagesList}
              currencies={currencies}
<<<<<<< HEAD
              onEnableEncryption={() => setShowEncryptionModal(true)}
=======
              currency={userSettings.currency}
              language={userSettings.language}
              setCurrency={setCurrency}
              setLanguage={setLanguage}
>>>>>>> f8343ef38d85349a0f3b5962d29afd30beee73d2
            />
          )}

          {(activeTab === 'reports' || activeTab === 'analytics') && (
            <ComingSoonPage activeTab={activeTab} darkMode={darkMode} themeClasses={themeClasses} />
          )}
        </main>
      </div>

      {/* All Modals */}
      <AddTransactionModal
        isOpen={showIncomeForm}
        onClose={() => setShowIncomeForm(false)}
        type="income"
        formData={transactionFormData}
        onFormDataChange={setTransactionFormData}
        onSubmit={handleSubmitTransaction}
        categories={incomeCategories}
        darkMode={darkMode}
        isLoading={isSubmitting}
      />

      <AddTransactionModal
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        type="expense"
        formData={transactionFormData}
        onFormDataChange={setTransactionFormData}
        onSubmit={handleSubmitTransaction}
        categories={expenseCategories}
        darkMode={darkMode}
        isLoading={isSubmitting}
      />

      <AddBudgetModal
        isOpen={showBudgetForm}
        onClose={() => setShowBudgetForm(false)}
        formData={budgetFormData}
        onFormDataChange={setBudgetFormData}
        onSubmit={handleSubmitBudget}
        categories={expenseCategories}
        darkMode={darkMode}
        isLoading={isSubmitting}
      />

      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingTransaction(null); }}
        transaction={editingTransaction}
        formData={editFormData}
        onFormDataChange={setEditFormData}
        onSubmit={handleUpdateTransaction}
        categories={editingTransaction?.type === 'income' ? incomeCategories : expenseCategories}
        darkMode={darkMode}
        isLoading={isSubmitting}
        encryptionEnabled={!!encryption}
      />

      <EditBudgetModal
        isOpen={showEditBudgetModal}
        onClose={() => { setShowEditBudgetModal(false); setEditingBudget(null); }}
        budget={editingBudget as any}
        formData={editBudgetFormData}
        onFormDataChange={setEditBudgetFormData}
        onSubmit={handleUpdateBudget}
        categories={expenseCategories}
        darkMode={darkMode}
        isLoading={isSubmitting}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteTransactionId(null); }}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        description="Are you sure? This cannot be undone."
        confirmText="Delete"
        darkMode={darkMode}
        isLoading={isSubmitting}
        type="delete"
      />

      <DeleteConfirmationModal
        isOpen={showDeleteBudgetModal}
        onClose={() => { setShowDeleteBudgetModal(false); setDeleteBudgetId(null); }}
        onConfirm={handleDeleteBudget}
        title="Delete Budget"
        description="Are you sure you want to delete this budget?"
        confirmText="Delete Budget"
        darkMode={darkMode}
        isLoading={isSubmitting}
        type="delete"
      />

      {/* Encryption Setup Modal */}
      {showEncryptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {encryption ? 'Enter Password' : 'Enable Data Encryption'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {encryption ? 'Decrypt your financial data' : 'Protect your financial data'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {encryption ? 'Enter your password to decrypt data' : 'Enter your account password'}
                </label>
                <input
                  type="password"
                  value={encryptionPassword}
                  onChange={(e) => setEncryptionPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {encryption 
                    ? 'This password is used to decrypt your encrypted transaction data.'
                    : 'This password will be used to encrypt your data. We don\'t store it.'
                  }
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Important:</strong> {encryption 
                      ? 'You need this password to access your encrypted transaction data.'
                      : 'You\'ll need this password to access your data. Make sure to remember it!'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEncryptionModal(false);
                    setEncryptionPassword('');
                  }}
                  disabled={isEncrypting}
                  className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition font-medium disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEncryptionSetup}
                  disabled={!encryptionPassword.trim() || isEncrypting}
                  className={`flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isEncrypting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {encryption ? 'Decrypting...' : 'Encrypting...'}
                    </>
                  ) : (
                    encryption ? 'Decrypt Data' : 'Enable Encryption'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encryption Banner (if needed) */}
      {needsEncryptionSetup && !showEncryptionModal && !encryption && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl p-4 shadow-2xl z-40 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Secure your data</p>
                <p className="text-sm opacity-90">Encrypt your transactions for privacy</p>
              </div>
            </div>
            <button
              onClick={() => setShowEncryptionModal(true)}
              className="px-4 py-2 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-green-500 rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center group"
        title="Smart AI Assistant"
      >
        <Bot className="w-7 h-7 text-white" />
        {openRouterAvailable && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
        )}
      </button>

      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        openRouterAvailable={openRouterAvailable}
        currentModel="amazon/nova-2-lite-v1:free"
        usageStats={{
          dailyRequests: 5,
          dailyLimit: 50,
          monthlyTokens: 15000,
          monthlyLimit: 1000000,
          responseTime: 1200
        }}
      />

      <TokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        tokenStatus={{ 
          tokensRemaining: tokens, 
          totalTokens: 100, 
          resetTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }}
        darkMode={darkMode}
      />
    </div>
  );
}