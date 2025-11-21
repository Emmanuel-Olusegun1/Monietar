'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as Toast from '@radix-ui/react-toast';
import Image from 'next/image';
import {
  Sun, Moon, MessageCircle
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────────────
import { AIChatModal } from './components/modals/AIChatModal';
import { TokenModal } from './components/modals/TokenModal';

import { OverviewPage } from './components/pages/OverviewPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { BudgetsPage } from './components/pages/BudgetsPage';
import { ComingSoonPage } from './components/pages/ComingSoonPage';
import { SettingsPage } from './components/pages/SettingsPage';
import AccountsPage from './components/pages/AccountsPage';

import { Sidebar } from './Sidebar';
import { TokenStatus } from './components/TokenStatus';

import {
  Transaction, Budget, UserSettings, FinancialData,
  UserInfo, ChatMessage, Alert
} from './types';

import { RuleBasedFinancialAdvisor } from './utils/FinancialAdvisor';

// ──────────────────────────────────────────────────────────────────────
// Add these helper components / defaults at the top of the file
// ──────────────────────────────────────────────────────────────────────


const defaultCurrentTrendData: any = [];
const defaultCategoryBreakdown: any= [];
const defaultRealTimeAlerts: any[] = [];
const setShowIncomeForm = () => {};
const setShowExpenseForm = () => {};
const setShowBudgetForm = () => {};
const startEditBudget = (budget: EnhancedBudget) => {};
const setDeleteBudgetId = (id: string | null) => {};
const startEditTransaction = (tx: Transaction | null) => {};
const setDeleteTransactionId = (id: string | null) => {};
const setShowChangePasswordDialog = () => {};
const setShowClearDataDialog = () => {};
const setShowDeleteAccountDialog = () => {};
const setShowRestoreDialog = () => {};
const setShowExportDialog = () => {};
const setShowImportDialog = () => {};
const setShowLanguageDialog = () => {};
const setShowCurrencyDialog = () => {};

// Language & currency lists
const languagesList = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

const getDataKey = (): string => 'value'; // No param needed

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value;
    function formatCurrency(value: any): import("react").ReactNode {
      throw new Error('Function not implemented.');
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {value !== undefined ? formatCurrency(value) : '—'}
        </p>
      </div>
    );
  }
  return null;
};

const EmptyState = () => (
  <div className="text-center py-12">
    <p className="text-gray-500 dark:text-gray-400">No data available</p>
  </div>
);


const defaultTransactions: Transaction[] = [];
const defaultBudgets: Budget[] = [];

// ──────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ──────────────────────────────────────────────────────────────────────
// Shared Types (Critical for type consistency)
// ──────────────────────────────────────────────────────────────────────
export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface EnhancedBudget {
  id: string;
  user_id: string;
  category: string;
  budget_limit: number;
  spent: number;
  percentage: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at: string; // ← REQUIRED
}

// ── Prop interfaces (must match component expectations) ──
interface OverviewPageProps {
  financialData: FinancialData;
  formatCurrency: (amount: number) => string;
  timeFilter: TimeFilter;
  setTimeFilter: (filter: string) => void;
  timeFilters: TimeFilter[];
  hasTransactionData: boolean;
  themeClasses: any;
  showBalance: boolean;
  darkMode: boolean;
  currency: string;
  language: string;
  user: UserInfo;
  aiRecommendations: string[];
  cashFlowForecast: any[];
  alerts: Alert[];
}

interface TransactionsPageProps {
  financialData: FinancialData;
  formatCurrency: (amount: number) => string;
  setShowIncomeForm: () => void;
  setShowExpenseForm: () => void;
  startEditTransaction: Dispatch<SetStateAction<Transaction | null>>;
  setDeleteTransactionId: Dispatch<SetStateAction<string | null>>;
  editingTransaction: Transaction | null;
  deleteTransactionId: string | null;
  darkMode: boolean;
}

interface BudgetsPageProps {
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

interface SettingsPageProps {
  userSettings: UserSettings;
  setUserSettings: Dispatch<SetStateAction<UserSettings>>;
  handleSaveSettings: () => Promise<void>;
  handleExportData: () => void;
  handleChangePassword: () => void;
  handleDeleteAccount: () => void;
  themeClasses: any;
  darkMode: boolean;
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}

type AIStatus = 'aws' | 'standard' | 'checking';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  newMessage: string;
  onNewMessageChange: Dispatch<SetStateAction<string>>;
  onSendMessage: () => void;
  darkMode: boolean;
  suggestedQuestions: string[];
  aiStatus: AIStatus;
  usePremium: boolean;
  onTogglePremium: () => void;
  tokensRemaining: number;
}

// ──────────────────────────────────────────────────────────────────────
// Token Validation
// ──────────────────────────────────────────────────────────────────────
const isValidToken = (token: string): boolean => {
  try {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    if (token.length < 10) return false;
    return true;
  } catch {
    return false;
  }
};

// ──────────────────────────────────────────────────────────────────────
// API Service
// ──────────────────────────────────────────────────────────────────────
const apiService = {
  async verifyToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    if (!isValidToken(token)) throw new Error('Invalid token format');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        if (response.status === 403) throw new Error('Forbidden');
        throw new Error(`Session verification failed: ${response.status}`);
      }

      const data = await response.json();
      return data.user;
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error('Session check timed out');
      throw err;
    }
  },

  async fetchTransactions(userId: string) {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/transactions/fetch/:userId`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        if (response.status === 404) return { transactions: [] };
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      return { transactions: data.transactions || [] };
    } catch {
      console.warn('Transactions endpoint not available');
      return { transactions: [] };
    }
  },

  async fetchBudgets(userId: string) {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${SUPABASE_URL}/api/budgets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        if (response.status === 404) return { budgets: [] };
        throw new Error('Failed to fetch budgets');
      }
      const data = await response.json();
      return { budgets: data.budgets || [] };
    } catch {
      console.warn('Budgets endpoint not available');
      return { budgets: [] };
    }
  },

  async fetchProfile(userId: string) {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profiles/fetch/:userId`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        if (response.status === 404) return { profile: {} };
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return { profile: data.user || {} };
    } catch {
      console.warn('Profile endpoint not available');
      return { profile: {} };
    }
  }
};

// ──────────────────────────────────────────────────────────────────────
// Dashboard Component
// ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // ──────── State ────────
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<UserInfo>({
    name: 'Loading...', email: 'Loading...', businessName: 'Loading...',
    avatar: '/api/placeholder/40/40', plan: 'Free Plan',
    joinedDate: new Date().toISOString().split('T')[0]
  });
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0, expenses: 0, profit: 0,
    transactions: [], budgets: [], alerts: [],
    aiRecommendations: ['Add transactions to get insights'],
    cashFlowForecast: []
  });

  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState('NGN');
  const [language, setLanguage] = useState('en');
  const [showBalance, setShowBalance] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [tokenStatus, setTokenStatus] = useState({
    tokensRemaining: 5, totalTokens: 5, resetTime: new Date(), percentage: 100
  });
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Edit/Delete states
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);

  // Settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    fullName: '', email: '', businessName: '', phoneNumber: '',
    currency: 'NGN', language: 'en', dateFormat: 'MM/DD/YYYY', timezone: 'UTC',
    notifications: { budgetAlerts: true, weeklyReports: true, transactionAlerts: true, aiRecommendations: true }
  });

  const suggestedQuestions = [
    "How can I reduce my expenses?",
    "What's my spending pattern?",
    "Any budget recommendations?",
    "How can I increase my savings?"
  ];

  // ──────── Helpers ────────
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const formatCurrency = (amount: number): string => {
    if (!showBalance && amount !== 0) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency, minimumFractionDigits: 2
    }).format(amount);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setSession(null);
    window.location.href = '/auth/signin';
  };

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter as TimeFilter);
  };

  const handleStartEditBudget = (budget: EnhancedBudget) => {
    setEditingBudget(budget as any);
  };

  // ──────── fetchData ────────
  const fetchData = async (session: any) => {
    setLoading(true);
    try {
      const [transactionsData, budgetsData, profileData] = await Promise.all([
        apiService.fetchTransactions(session.user.id),
        apiService.fetchBudgets(session.user.id),
        apiService.fetchProfile(session.user.id)
      ]);

      const income = transactionsData.transactions
        ?.filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
      const expenses = transactionsData.transactions
        ?.filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;

      const enhancedBudgets: EnhancedBudget[] = (budgetsData.budgets || []).map((b: any) => {
        const spent = financialData.transactions
          .filter(t => t.category === b.category && t.type === 'expense')
          .reduce((s: number, t: Transaction) => s + t.amount, 0);
        return {
          ...b,
          user_id: session.user.id,
          spent,
          percentage: b.budget_limit > 0 ? Math.min(100, (spent / b.budget_limit) * 100) : 0,
          period: (['daily', 'weekly', 'monthly', 'yearly'].includes(b.period) ? b.period : 'monthly') as EnhancedBudget['period'],
          created_at: b.created_at ?? new Date().toISOString() // ← fallback ensures string
        };
      });

      setFinancialData(prev => ({
        ...prev,
        income, expenses, profit: income - expenses,
        transactions: transactionsData.transactions as Transaction[] || [],
        budgets: budgetsData.budgets as Budget[] || [],
        aiRecommendations: transactionsData.transactions?.length > 0
          ? RuleBasedFinancialAdvisor.analyzeSpendingPatterns(
              transactionsData.transactions as Transaction[],
              budgetsData.budgets || [],
              formatCurrency
            ).slice(0, 4)
          : prev.aiRecommendations
      }));

      setUser({
        name: profileData?.profile?.full_name || session.user.name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || 'No email',
        businessName: profileData?.profile?.business_name || session.user.businessName || 'My Business',
        avatar: profileData?.profile?.avatar_url || session.user.avatar || '/api/placeholder/40/40',
        plan: profileData?.profile?.plan || session.user.plan || 'Free Plan',
        joinedDate: new Date(profileData?.profile?.created_at || session.user.joinedDate || new Date())
          .toISOString().split('T')[0]
      });

      setUserSettings(prev => ({
        ...prev,
        fullName: profileData?.profile?.full_name || user.name,
        email: session.user.email,
        businessName: profileData?.profile?.business_name || user.businessName,
        phoneNumber: profileData?.profile?.phone_number || '',
        currency: profileData?.profile?.currency || 'NGN',
        language: profileData?.profile?.language || 'en',
        dateFormat: profileData?.profile?.date_format || 'MM/DD/YYYY',
        timezone: profileData?.profile?.timezone || 'UTC',
        notifications: profileData?.profile?.notification_settings || prev.notifications
      }));
    } catch (error: any) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  // ──────── Auth Effect ────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const verifyAndLoadSession = async () => {
      try {
        setLoading(true);
        setAuthChecked(false);

        const token = localStorage.getItem('auth_token');
        if (!token || !isValidToken(token)) {
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/signin';
          return;
        }

        const userData = await apiService.verifyToken();
        const customSession = { user: userData, accessToken: token };

        setSession(customSession);
        setAuthChecked(true);
        await fetchData(customSession);
      } catch (error: any) {
        console.error('Session invalid:', error.message);
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/signin';
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoadSession();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue) {
        window.location.href = '/auth/signin';
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // ──────── Loading Screen ────────
  if (loading || !authChecked) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} suppressHydrationWarning>
        <Image
          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
          alt="Monietar"
          width={220}
          height={50}
          style={{ width: 'auto', height: 'auto' }}
          className="mb-8 animate-pulse"
          priority
        />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-200' : 'text-gray-600'}>
            {loading ? 'Authenticating...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/auth/signin';
    return null;
  }

  // ──────── Theme Classes ────────
  const themeClasses = {
    container: darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900',
    card: darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/90 border-gray-200',
    text: darkMode ? 'text-gray-200' : 'text-gray-800',
    muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    accent: darkMode ? 'text-emerald-400' : 'text-emerald-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    button: darkMode
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
  };

  // ──────── Render ────────
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'} flex`} suppressHydrationWarning>
      <Toast.Provider>
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`rounded-xl p-4 shadow-lg backdrop-blur-lg border ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
        >
          <Toast.Description className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
            {toastMessage}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed top-4 right-4 z-50" />

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          darkMode={darkMode}
          isMobileMenuOpen={false}
          setIsMobileMenuOpen={() => {}}
          onLogout={handleLogout}
          setDarkMode={setDarkMode}
          currency={currency}
          setCurrency={setCurrency}
          language={language}
          setLanguage={setLanguage}
          showBalance={showBalance}
          setShowBalance={setShowBalance}
          currencies={[]}
          languagesList={[]}
          realTimeAlerts={[]}
        />

        <div className="flex-1 flex flex-col lg:ml-64">
          <header className={`${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} border-b backdrop-blur-xl sticky top-0 z-30`}>
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              <div className="flex items-center space-x-4">
                <TokenStatus tokenStatus={tokenStatus} darkMode={darkMode} onUpgradeClick={() => setShowTokenModal(true)} />
                <button onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'overview' && (
              <OverviewPage
                financialData={financialData}
                formatCurrency={formatCurrency}
                timeFilter={timeFilter}
                setTimeFilter={handleTimeFilterChange}
                timeFilters={['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as TimeFilter[]}
                hasTransactionData={financialData.transactions.length > 0}
                themeClasses={themeClasses}
                showBalance={showBalance}
                darkMode={darkMode}
                currency={currency}
                language={language}
                user={user}
                aiRecommendations={financialData.aiRecommendations}
                cashFlowForecast={financialData.cashFlowForecast}
                alerts={financialData.alerts}
                currentTrendData={defaultCurrentTrendData}
                categoryBreakdown={defaultCategoryBreakdown}
                budgetsWithRealTimeTracking={financialData.budgets.map((b: any) => ({
                  ...b,
                  user_id: session?.user?.id || '',
                  spent: 0,
                  percentage: 0,
                  period: (b.period || 'monthly') as EnhancedBudget['period'],
                  created_at: b.created_at ?? new Date().toISOString()
                })) as EnhancedBudget[]}
                realTimeAlerts={defaultRealTimeAlerts}
                transactions={financialData.transactions}
                income={financialData.income}
                expenses={financialData.expenses}
                profit={financialData.profit}
                totalTransactions={financialData.transactions.length}
                averageTransaction={financialData.transactions.length > 0
                  ? financialData.transactions.reduce((s, t) => s + t.amount, 0) / financialData.transactions.length
                  : 0}
                topCategory={(() => {
                  const categoryMap = financialData.transactions.reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.amount;
                    return acc;
                  }, {} as Record<string, number>);
                  return Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
                })()}
                recentActivity={financialData.transactions.slice(0, 5)}
                monthlyComparison={{
                  current: financialData.profit,
                  previous: financialData.profit * 0.9
                }}
                setShowIncomeForm={setShowIncomeForm}
    setShowExpenseForm={setShowExpenseForm}
    setShowBudgetForm={setShowBudgetForm}
    startEditBudget={startEditBudget}
    setDeleteBudgetId={setDeleteBudgetId}
    startEditTransaction={startEditTransaction}
    setDeleteTransactionId={setDeleteTransactionId}
    setShowChangePasswordDialog={setShowChangePasswordDialog}
    setShowClearDataDialog={setShowClearDataDialog}
    setShowDeleteAccountDialog={setShowDeleteAccountDialog}
    setShowRestoreDialog={setShowRestoreDialog}
    setShowExportDialog={setShowExportDialog}
    setShowImportDialog={setShowImportDialog}
    setShowLanguageDialog={setShowLanguageDialog}
    setShowCurrencyDialog={setShowCurrencyDialog}
    setActiveTab={setActiveTab} // ← real state setter
    getDataKey={getDataKey}
    CustomTooltip={CustomTooltip}
    EmptyState={EmptyState}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsPage
                financialData={financialData}
                formatCurrency={formatCurrency}
                setShowIncomeForm={() => {}}
                setShowExpenseForm={() => {}}
                startEditTransaction={setEditingTransaction}
                setDeleteTransactionId={setDeleteTransactionId}
                editingTransaction={editingTransaction}
                deleteTransactionId={deleteTransactionId}
                darkMode={darkMode}
                themeClasses={themeClasses}
                EmptyState={EmptyState}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetsPage
                budgetsWithRealTimeTracking={financialData.budgets.map((b: any) => {
                  const spent = financialData.transactions
                    .filter(t => t.category === b.category && t.type === 'expense')
                    .reduce((s: number, t: Transaction) => s + t.amount, 0);
                  const percentage = b.budget_limit > 0 ? Math.min(100, (spent / b.budget_limit) * 100) : 0;
                  return {
                    ...b,
                    user_id: session.user.id,
                    spent,
                    percentage,
                    period: (['daily', 'weekly', 'monthly', 'yearly'].includes(b.period) ? b.period : 'monthly') as EnhancedBudget['period'],
                    created_at: b.created_at ?? new Date().toISOString()
                  } as EnhancedBudget;
                })}
                formatCurrency={formatCurrency}
                setShowBudgetForm={() => {}}
                startEditBudget={handleStartEditBudget}
                setDeleteBudgetId={setDeleteBudgetId}
                editingBudget={editingBudget}
                deleteBudgetId={deleteBudgetId}
                themeClasses={themeClasses}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'connect account' && (
              <AccountsPage
                session={session}
                darkMode={darkMode}
                showToast={showToast}
                themeClasses={themeClasses}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                userSettings={userSettings}
                setUserSettings={setUserSettings}
                handleSaveSettings={async () => {}}
                handleExportData={() => {}}
                handleChangePassword={() => {}}
                handleDeleteAccount={() => {}}
                themeClasses={themeClasses}
                darkMode={darkMode}
                currency={currency}
                setCurrency={setCurrency}
                language={language}
                setLanguage={setLanguage}
                setShowChangePasswordDialog={() => {}}
                setShowClearDataDialog={() => {}}
                setShowDeleteAccountDialog={() => {}}
                setShowRestoreDialog={() => {}}
                setShowExportDialog={() => {}}
                setShowImportDialog={() => {}}
                setShowLanguageDialog={() => {}}
                setShowCurrencyDialog={() => {}}
                handleBackupData={() => {
                  showToast('Backup started...');
                }}
                setActiveTab={setActiveTab}
                languagesList={languagesList}
                currencies={currencies}
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

          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7" />
          </button>

          <AIChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={() => {}}
            darkMode={darkMode}
            suggestedQuestions={suggestedQuestions}
            aiStatus={'standard' as AIStatus}
            usePremium={false}
            onTogglePremium={() => setShowTokenModal(true)}
            tokensRemaining={tokenStatus.tokensRemaining}
          />

          <TokenModal
            isOpen={showTokenModal}
            onClose={() => setShowTokenModal(false)}
            tokenStatus={tokenStatus}
            darkMode={darkMode}
          />
        </div>
      </Toast.Provider>
    </div>
  );
}