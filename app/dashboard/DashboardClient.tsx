'use client';

import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Bot } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
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
import { RestoreBackupModal } from './components/modals/RestoreBackupModal';
import { ClearDataModal } from './components/modals/ClearDataModal';
import { ChangePasswordModal } from './components/modals/ChangePasswordModal';
import { DeleteAccountModal } from './components/modals/DeleteAccountModal';

import type { EnhancedBudget, PasswordData } from '@/app/dashboard/types';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { SettingsProvider } from '@/contexts/SettingsContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type AllowedPeriodDisplay = 'Monthly' | 'Yearly' | 'Quarterly';

const toDisplayPeriod = (period: string): AllowedPeriodDisplay => {
  const map: Record<string, AllowedPeriodDisplay> = {
    monthly: 'Monthly',
    yearly: 'Yearly',
    quarterly: 'Quarterly',
  };
  return map[period.toLowerCase()] || 'Monthly';
};

const toDbPeriod = (
  period: AllowedPeriodDisplay
): 'monthly' | 'yearly' | 'quarterly' => {
  const map: Record<AllowedPeriodDisplay, 'monthly' | 'yearly' | 'quarterly'> = {
    Monthly: 'monthly',
    Yearly: 'yearly',
    Quarterly: 'quarterly',
  };
  return map[period];
};

interface UserInfo {
  id: string;
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

interface BackupRecord {
  id: string;
  created_at: string;
  file_size: number | null;
  backup_name?: string | null;
  backup_date?: string | null;
}

interface DashboardClientProps {
  initialSession?: any;
}

// ─── Dashboard content ────────────────────────────────────────────────────────

function DashboardContent({ initialSession }: DashboardClientProps = {}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // AI Chat States
  const [aiStatus, setAiStatus] = useState<'openrouter' | 'standard' | 'checking'>('checking');
  const [tokens, setTokens] = useState(100);
  const [openRouterAvailable, setOpenRouterAvailable] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('Checking...');
  const [modelIntelligence, setModelIntelligence] = useState<string>('Medium');
  const [estimatedCost, setEstimatedCost] = useState<string>('FREE 🎉');

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
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [availableBackups, setAvailableBackups] = useState<BackupRecord[]>([]);
  const [selectedBackup, setSelectedBackup] = useState('');
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const handleShowDeleteAccountDialog = (show: boolean) =>
    setShowDeleteAccountDialog(show);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Form data
  const [transactionFormData, setTransactionFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  const [budgetFormData, setBudgetFormData] = useState<{
    category: string;
    budget_limit: string;
    period: AllowedPeriodDisplay;
  }>({ category: '', budget_limit: '', period: 'Monthly' });

  const [editBudgetFormData, setEditBudgetFormData] = useState<{
    category: string;
    budget_limit: string;
    period: AllowedPeriodDisplay;
  }>({ category: '', budget_limit: '', period: 'Monthly' });

  const [editFormData, setEditFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  // Edit / delete state
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editingBudget, setEditingBudget] = useState<EnhancedBudget | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User state
  const [user, setUser] = useState<UserInfo>({
    id: '',
    name: 'User',
    email: '',
    businessName: 'My Business',
    avatar: '/api/placeholder/40/40',
    plan: 'Free Plan',
    joinedDate: new Date().toISOString().split('T')[0],
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
    cashFlowForecast: [],
  });

  const router = useRouter();

  // ── Category lists ────────────────────────────────────────────────────────

  const incomeCategories = [
    'Sales Money', 'Service Income', 'Bank Interest', 'Share Dividends',
    'Rent from Property', 'Consulting Fees', 'Subscription Money',
    'Commission Earned', 'Advertising Money', 'Sponsorship Funds',
    'Grants & Donations', 'Investment Profits', 'Royalty Payments',
    'Property Sale Profits', 'Crop Sales (Coffee/Cocoa)',
    'Crop Sales (Maize/Cassava)', 'Animal Sales', 'Fish Sales',
    'Government Salary', 'Market Trading Income', 'Small Import Business',
    'Export Raw Materials', 'Export Finished Goods', 'Online Freelance Work',
    'Taxi/Ride Income', 'Motorcycle Taxi Income', 'Truck Transport Income',
    'Bus/Minibus Income', 'Small Shop Sales', 'Handwork/Skills Income',
    'Professional Fees', 'Tech Business Income', 'House/Room Rent',
    'Shop/Office Rent', 'Equipment Rent', 'Farm Land Rent',
    'Money from Abroad', 'Mobile Money Fees', 'Airtime/Data Business',
    'Music/Events Income', 'Tourism Income', 'Small Mining Income',
    'Large Mining Income', 'Solar Energy Sales', 'Internet/Phone Services',
    'Franchise Fees', 'Brand License Fees', 'NGO/Government Grants',
    'Loan Interest Income', 'Crypto Trading', 'Clothing Business',
    'Handicraft Sales', 'Other Income',
  ];

  const expenseCategories = [
    'Food & Eating Out', 'Transport Costs', 'Bills (Water/Light)',
    'Rent Payment', 'Fun/Entertainment', 'Medical Costs', 'School Fees',
    'Shopping', 'Travel Costs', 'Miscellaneous', 'Generator Fuel',
    'Vehicle Fuel', 'Machine Fuel', 'Phone Credit/Data',
    'Money Transfer Fees', 'Market Daily Fees', 'Company Taxes',
    'Import Taxes', 'Market Stall Fees', 'Farm Supplies', 'Shop/Office Rent',
    'House Rent', 'Market Stall Rent', 'Generator Repairs',
    'Car/Truck Repairs', 'Motorcycle Repairs', 'Staff Transport',
    'Goods Transport', 'Port/Customs Fees', 'Electricity Bill',
    'Solar System Cost', 'Water Bill', 'Security Costs',
    'Daily Worker Pay', 'Staff Salaries', 'Family Support',
    'Local Materials', 'Imported Materials', 'Stock Purchase',
    'Packaging Materials', 'Refrigeration Costs', 'Union/Group Fees',
    'Business Permits', 'Medical Costs (Staff)', 'Community Contributions',
    'Radio/Newspaper Ads', 'Social Media Ads', 'Customer Phone Credit',
    'Staff Generator Fuel', 'Other Expenses',
  ];

  // ── Auth & data loading ───────────────────────────────────────────────────

  useEffect(() => {
    if (initialSession) {
      setUser({
        id: initialSession.id,
        name:
          initialSession.user_metadata?.full_name ||
          initialSession.email?.split('@')[0] ||
          'User',
        email: initialSession.email || '',
        businessName:
          initialSession.user_metadata?.business_name || 'My Business',
        avatar:
          initialSession.user_metadata?.avatar_url || '/api/placeholder/40/40',
        plan: 'Free Plan',
        joinedDate: new Date(
          initialSession.created_at || Date.now()
        )
          .toISOString()
          .split('T')[0],
      });
      loadData(initialSession.id);
      setLoading(false);
    } else {
      checkAuth();
    }
  }, [initialSession]);

  useEffect(() => {
    checkOpenRouterStatus();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        router.push('/auth/signin');
        return;
      }

      setUser({
        id: authUser.id,
        name:
          authUser.user_metadata?.full_name ||
          authUser.email?.split('@')[0] ||
          'User',
        email: authUser.email || '',
        businessName:
          authUser.user_metadata?.business_name || 'My Business',
        avatar:
          authUser.user_metadata?.avatar_url || '/api/placeholder/40/40',
        plan: 'Free Plan',
        joinedDate: new Date(authUser.created_at || Date.now())
          .toISOString()
          .split('T')[0],
      });

      await loadData(authUser.id);
    } catch {
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived budgets ───────────────────────────────────────────────────────

  const budgetsWithRealTimeTracking: EnhancedBudget[] = useMemo(() => {
    if (!financialData.budgets?.length) return [];

    return financialData.budgets.map((budget: any): EnhancedBudget => {
      const spent = financialData.transactions
        .filter(
          (t: any) => t.type === 'expense' && t.category === budget.category
        )
        .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

      const percentage =
        budget.budget_limit > 0 ? (spent / budget.budget_limit) * 100 : 0;
      const period = (
        budget.period || 'monthly'
      ).toLowerCase() as EnhancedBudget['period'];

      return {
        id: budget.id,
        category: budget.category,
        budget_limit: Number(budget.budget_limit),
        spent,
        percentage,
        period,
        created_at: budget.created_at,
        user_id: budget.user_id || user.id || '',
        type: 'expense',
      };
    });
  }, [financialData.budgets, financialData.transactions, user.id]);

  // ── Formatting helpers ────────────────────────────────────────────────────

  const formatCurrency = (amount: number): string => {
    if (!showBalance && amount !== 0) return '••••••';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatCurrencyForAI = (amount: number): string =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  // ── OpenRouter ────────────────────────────────────────────────────────────

  const checkOpenRouterStatus = async () => {
    try {
      setAiStatus('checking');
      setCurrentModel('Checking availability...');
      const response = await fetch('/api/chat', { method: 'GET' });
      if (!response.ok) throw new Error();
      const data = await response.json();

      if (data.status === 'ok') {
        setOpenRouterAvailable(true);
        setAiStatus('openrouter');
        setCurrentModel('Amazon Nova Lite');
        setModelIntelligence('Medium');
        toast.success('✅ OpenRouter AI Enabled: Amazon Nova Lite', {
          duration: 3000,
          icon: '🚀',
        });
      } else {
        setOpenRouterAvailable(false);
        setAiStatus('standard');
        setCurrentModel('Not Available');
        setModelIntelligence('Basic');
        toast.error('OpenRouter AI not available. Check API setup.', {
          duration: 4000,
        });
      }
    } catch {
      setAiStatus('standard');
      setOpenRouterAvailable(false);
      setCurrentModel('Offline');
      setModelIntelligence('Basic');
      toast.error('AI services offline. Using fallback mode.', {
        duration: 3000,
      });
    }
  };

  const handleSendMessage = async (
    message: string,
    files?: File[]
  ): Promise<string> => {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('style', 'balanced');
    files?.forEach((file) => formData.append('files', file));

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to get response');
    return data.response;
  };

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadData = async (userId: string) => {
    try {
      const [{ data: txs }, { data: budgets }] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', userId),
      ]);

      const transactions = txs || [];
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
        aiRecommendations: [],
        cashFlowForecast: [],
      });

      setAiInsightsLoading(true);
      try {
        const insightsResponse = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            currency: 'NGN',
            income,
            expenses,
            profit,
            transactions: transactions.slice(0, 50),
            budgets: budgetsArray,
          }),
        });
        const insightsData = await insightsResponse.json();
        if (insightsData?.success && Array.isArray(insightsData.insights)) {
          setFinancialData((prev) => ({
            ...prev,
            aiRecommendations: insightsData.insights,
          }));
        }
      } catch (insightsError) {
        console.error('AI insights error:', insightsError);
      } finally {
        setAiInsightsLoading(false);
      }

      setDataLoaded(true);
    } catch (err: any) {
      console.error('Error loading data:', err);
      toast.error('Failed to load your data');
      setDataLoaded(true);
    }
  };

  // ── Export & backup ───────────────────────────────────────────────────────

  const handleExportData = async () => {
    try {
      if (!user.id) return toast.error('Not authenticated');

      const [
        { data: transactions },
        { data: budgets },
        { data: accounts },
        { data: settings },
      ] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('budgets').select('*').eq('user_id', user.id),
        supabase.from('accounts').select('*').eq('user_id', user.id),
        supabase.from('user_settings').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          email: user.email,
          businessName: user.businessName,
          plan: user.plan,
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
          activeBudgets: financialData.budgets.length,
        },
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const url = URL.createObjectURL(
        new Blob([dataStr], { type: 'application/json' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `monietar-export-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch {
      toast.error('Failed to export data');
    }
  };

  const loadBackups = async () => {
    if (!user.id) return;
    try {
      const { data, error } = await supabase
        .from('backups')
        .select('id, created_at, file_size, backup_name, backup_date')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAvailableBackups(data || []);
    } catch {
      toast.error('Failed to load backups');
    }
  };

  useEffect(() => {
    if (showRestoreDialog) loadBackups();
  }, [showRestoreDialog, user.id]);

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      if (!user.id) return toast.error('Not authenticated');

      const backupPayload = {
        timestamp: new Date().toISOString(),
        userId: user.id,
        transactions: financialData.transactions,
        budgets: financialData.budgets,
        income: financialData.income,
        expenses: financialData.expenses,
        profit: financialData.profit,
      };

      const fileSize = new Blob([JSON.stringify(backupPayload)]).size;

      const { error } = await supabase.from('backups').insert({
        user_id: user.id,
        backup_data: backupPayload,
        backup_type: 'full',
        backup_name: `Backup ${new Date().toLocaleString()}`,
        backup_date: new Date().toISOString(),
        backup_size: fileSize,
        file_size: fileSize,
        user_email: user.email || null,
        metadata: {
          transactions: Array.isArray(backupPayload.transactions)
            ? backupPayload.transactions.length
            : 0,
          budgets: Array.isArray(backupPayload.budgets)
            ? backupPayload.budgets.length
            : 0,
        },
        data: {},
      });

      if (error) throw error;
      await loadBackups();
      toast.success('Backup created successfully!', {
        icon: '💾',
        duration: 3000,
      });
    } catch {
      toast.error('Failed to create backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!user.id || !backupId) return;
    try {
      setIsRestoringBackup(true);

      const { data, error } = await supabase
        .from('backups')
        .select('id, backup_data')
        .eq('id', backupId)
        .eq('user_id', user.id)
        .single();

      if (error || !data?.backup_data) throw error || new Error('Not found');

      const backupData = data.backup_data as any;

      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('budgets').delete().eq('user_id', user.id);

      const txToInsert = Array.isArray(backupData.transactions)
        ? backupData.transactions.map((tx: any) => ({ ...tx, user_id: user.id }))
        : [];
      const budgetsToInsert = Array.isArray(backupData.budgets)
        ? backupData.budgets.map((b: any) => ({ ...b, user_id: user.id }))
        : [];

      if (txToInsert.length > 0) {
        const { error: txErr } = await supabase
          .from('transactions')
          .insert(txToInsert);
        if (txErr) throw txErr;
      }
      if (budgetsToInsert.length > 0) {
        const { error: bErr } = await supabase
          .from('budgets')
          .insert(budgetsToInsert);
        if (bErr) throw bErr;
      }

      await loadData(user.id);
      setSelectedBackup('');
      setShowRestoreDialog(false);
      toast.success('Backup restored successfully!');
    } catch {
      toast.error('Failed to restore backup');
    } finally {
      setIsRestoringBackup(false);
    }
  };

  const handleRenameBackup = async (backupId: string, newName: string) => {
    if (!user.id || !backupId || !newName.trim()) return;
    try {
      const { error } = await supabase
        .from('backups')
        .update({
          backup_name: newName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', backupId)
        .eq('user_id', user.id);
      if (error) throw error;
      await loadBackups();
      toast.success('Backup renamed');
    } catch {
      toast.error('Failed to rename backup');
    }
  };

  // ── Settings actions ──────────────────────────────────────────────────────

  const handleChangePasswordSubmit = async () => {
    if (!user?.email) return toast.error('User email not found');
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error('Please fill in all password fields');
    if (newPassword !== confirmPassword)
      return toast.error('New passwords do not match');

    try {
      setIsSubmitting(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) return toast.error('Current password is incorrect');

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePasswordDialog(false);
      toast.success('Password updated successfully');
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user.id) return toast.error('Not authenticated');
    try {
      setIsSubmitting(true);
      const results = await Promise.all([
        supabase.from('transactions').delete().eq('user_id', user.id),
        supabase.from('budgets').delete().eq('user_id', user.id),
        supabase.from('backups').delete().eq('user_id', user.id),
        supabase.from('user_settings').delete().eq('user_id', user.id),
        supabase.from('user_accounts').delete().eq('user_id', user.id),
        supabase.from('feedback').delete().eq('user_id', user.id),
        supabase.from('user_ai_tokens').delete().eq('user_id', user.id),
        supabase.from('users').delete().eq('id', user.id),
      ]);
      const firstErr = results.find((r) => r.error)?.error;
      if (firstErr) throw firstErr;

      await supabase.auth.signOut();
      setShowDeleteAccountDialog(false);
      toast.success('Account deleted successfully');
      router.push('/auth/signin');
    } catch {
      toast.error('Failed to delete account');
      setShowDeleteAccountDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearData = async () => {
    if (!user.id) return toast.error('Not authenticated');
    try {
      setIsSubmitting(true);
      const [txResult, budgetsResult, backupsResult] = await Promise.all([
        supabase.from('transactions').delete().eq('user_id', user.id),
        supabase.from('budgets').delete().eq('user_id', user.id),
        supabase.from('backups').delete().eq('user_id', user.id),
      ]);
      if (txResult.error || budgetsResult.error || backupsResult.error)
        throw txResult.error || budgetsResult.error || backupsResult.error;

      setFinancialData({
        income: 0,
        expenses: 0,
        profit: 0,
        transactions: [],
        budgets: [],
        alerts: [],
        aiRecommendations: [],
        cashFlowForecast: [],
      });
      setAvailableBackups([]);
      setSelectedBackup('');
      setShowClearDataDialog(false);
      toast.success('All data cleared successfully.');
    } catch {
      toast.error('Failed to clear data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Transaction handlers ──────────────────────────────────────────────────

  const handleSubmitTransaction = async () => {
    if (!user.id) return toast.error('Please sign in');
    setIsSubmitting(true);
    try {
      const type = showIncomeForm ? 'income' : 'expense';
      const amount = parseFloat(transactionFormData.amount);
      if (isNaN(amount)) return toast.error('Please enter a valid amount');

      const { error } = await supabase.from('transactions').insert([
        {
          amount,
          category: transactionFormData.category,
          description: transactionFormData.description,
          date:
            transactionFormData.date ||
            new Date().toISOString().split('T')[0],
          type,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;

      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added!`);
      setTransactionFormData({ amount: '', category: '', description: '', date: '' });
      setShowIncomeForm(false);
      setShowExpenseForm(false);
      await loadData(user.id);
    } catch (error: any) {
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
      date: transaction.date,
    });
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: parseFloat(editFormData.amount),
          category: editFormData.category,
          description: editFormData.description,
          date: editFormData.date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingTransaction.id);
      if (error) throw error;
      toast.success('Transaction updated!');
      setShowEditModal(false);
      setEditingTransaction(null);
      await loadData(user.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
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
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', deleteTransactionId);
      if (error) throw error;
      toast.success('Transaction deleted!');
      setShowDeleteModal(false);
      setDeleteTransactionId(null);
      await loadData(user.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Budget handlers ───────────────────────────────────────────────────────

  const handleSubmitBudget = async () => {
    if (!user.id) return toast.error('Not authenticated');
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('budgets').insert({
        category: budgetFormData.category,
        budget_limit: parseFloat(budgetFormData.budget_limit) || 0,
        period: toDbPeriod(budgetFormData.period),
        user_id: user.id,
      });
      if (error) throw error;
      toast.success('Budget created!');
      setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
      setShowBudgetForm(false);
      await loadData(user.id);
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
      period: toDisplayPeriod(budget.period),
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingBudget.id);
      if (error) throw error;
      toast.success('Budget updated!');
      setShowEditBudgetModal(false);
      setEditingBudget(null);
      await loadData(user.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDeleteBudget: Dispatch<SetStateAction<string | null>> = (
    value
  ) => {
    const id = typeof value === 'function' ? value(deleteBudgetId) : value;
    setDeleteBudgetId(id);
    if (id) setShowDeleteBudgetModal(true);
  };

  const handleDeleteBudget = async () => {
    if (!deleteBudgetId) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', deleteBudgetId);
      if (error) throw error;
      toast.success('Budget deleted!');
      setShowDeleteBudgetModal(false);
      setDeleteBudgetId(null);
      await loadData(user.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/signin';
  };

  // ── Theme ─────────────────────────────────────────────────────────────────

  const themeClasses = {
    container: darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-gray-200' : 'text-gray-800',
      secondary: darkMode ? 'text-gray-400' : 'text-gray-500',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    input: darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  };

  // ── Loading screen ────────────────────────────────────────────────────────

  if (loading || !user.id || !dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
            alt="Monietar"
            width={220}
            height={50}
            className="animate-ping"
            priority
          />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      <Toaster position="top-right" />

      {/* ── Sidebar (owns its own mobile drawer + hamburger trigger) ── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* ── Main area: offset by sidebar width on desktop ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">

        {/* ── Header ── */}
        <Header
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showBalance={showBalance}
          setShowBalance={setShowBalance}
        />

        {/* ── Page content: push down by header height ── */}
        <main className="flex-1 overflow-y-auto pt-16 px-4 sm:px-6 pb-6">

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
              aiInsightsLoading={aiInsightsLoading}
              transactions={financialData.transactions}
              income={financialData.income}
              expenses={financialData.expenses}
              profit={financialData.profit}
              totalTransactions={financialData.transactions.length}
              setShowIncomeForm={setShowIncomeForm}
              setShowExpenseForm={setShowExpenseForm}
              setShowBudgetForm={() => setShowBudgetForm(true)}
              CustomTooltip={() => null}
              budgets={budgetsWithRealTimeTracking.map((b) => ({
                id: b.id,
                category: b.category,
                budget_limit: b.budget_limit,
                spent: b.spent,
                period: b.period,
              }))}
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
              EmptyState={() => (
                <div className="text-center py-12 text-gray-500">
                  No transactions yet
                </div>
              )}
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
            <AccountsPage
              user={user as any}
              darkMode={darkMode}
              showToast={toast}
              themeClasses={themeClasses}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              handleExportData={handleExportData}
              setShowChangePasswordDialog={setShowChangePasswordDialog}
              setShowClearDataDialog={setShowClearDataDialog}
              setShowDeleteAccountDialog={handleShowDeleteAccountDialog}
              setShowRestoreDialog={setShowRestoreDialog}
              handleBackupData={handleBackup}
              darkMode={darkMode}
              themeClasses={themeClasses}
              user={user}
            />
          )}

          {(activeTab === 'reports' || activeTab === 'analytics') && (
            <ComingSoonPage
              activeTab={activeTab}
              darkMode={darkMode}
              themeClasses={themeClasses}
            />
          )}
        </main>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

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
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        formData={editFormData}
        onFormDataChange={setEditFormData}
        onSubmit={handleUpdateTransaction}
        categories={
          editingTransaction?.type === 'income'
            ? incomeCategories
            : expenseCategories
        }
        darkMode={darkMode}
        isLoading={isSubmitting}
      />

      <EditBudgetModal
        isOpen={showEditBudgetModal}
        onClose={() => {
          setShowEditBudgetModal(false);
          setEditingBudget(null);
        }}
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
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTransactionId(null);
        }}
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
        onClose={() => {
          setShowDeleteBudgetModal(false);
          setDeleteBudgetId(null);
        }}
        onConfirm={handleDeleteBudget}
        title="Delete Budget"
        description="Are you sure you want to delete this budget?"
        confirmText="Delete Budget"
        darkMode={darkMode}
        isLoading={isSubmitting}
        type="delete"
      />

      <RestoreBackupModal
        isOpen={showRestoreDialog}
        onClose={() => {
          setShowRestoreDialog(false);
          setSelectedBackup('');
        }}
        availableBackups={availableBackups}
        selectedBackup={selectedBackup}
        onSelectedBackupChange={setSelectedBackup}
        onRestore={handleRestoreBackup}
        onRename={handleRenameBackup}
        darkMode={darkMode}
      />

      <ClearDataModal
        isOpen={showClearDataDialog}
        onClose={() => setShowClearDataDialog(false)}
        onConfirm={handleClearData}
        darkMode={darkMode}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordDialog}
        onClose={() => {
          setShowChangePasswordDialog(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }}
        passwordData={passwordData}
        onPasswordDataChange={setPasswordData}
        onSubmit={handleChangePasswordSubmit}
        isLoading={isSubmitting}
        darkMode={darkMode}
      />

      <DeleteAccountModal
        isOpen={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
        darkMode={darkMode}
        isLoading={isSubmitting}
      />

      {/* ── Floating AI chat button ─────────────────────────────────────────── */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-green-500 rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center"
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
          responseTime: 1200,
        }}
      />

      <TokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        tokenStatus={{
          tokensRemaining: tokens,
          totalTokens: 100,
          resetTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }}
        darkMode={darkMode}
      />
    </div>
  );
}

// ─── Export with SettingsProvider ─────────────────────────────────────────────

export default function DashboardClient({
  initialSession,
}: DashboardClientProps = {}) {
  return (
    <SettingsProvider userId={initialSession?.id}>
      <DashboardContent initialSession={initialSession} />
    </SettingsProvider>
  );
}