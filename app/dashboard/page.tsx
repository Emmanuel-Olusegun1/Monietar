'use client';

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import * as Toast from '@radix-ui/react-toast';
import Image from 'next/image';
import {
  TrendingUp, TrendingDown, Wallet, PieChart, Bell, BarChart3,
  Lightbulb, Mail, Users, Globe, ChevronDown, Search, Settings,
  User, Home, CreditCard, FileText, AreaChart, HelpCircle, LogOut,
  Menu, X, Plus, MessageCircle, Send, Bot, XCircle, AlertTriangle,
  Calendar, DollarSign, Euro, Currency, Filter, Download, MoreHorizontal,
  Languages, Edit, Trash2, Save, Key, ChevronRight, Eye, EyeOff,
  Sun, Moon, Sparkles, Zap, Target, Shield, Database, Cloud,
  ArrowUpRight, ArrowDownRight, RefreshCw, Crown
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Legend
} from 'recharts';

// ──────────────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────────────
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
  Transaction, Budget, UserSettings, PasswordData, FinancialData,
  Alert, UserInfo, CategoryData, ChatMessage, NavigationItem,
  LanguageOption, CurrencyOption
} from './types';

import { RuleBasedFinancialAdvisor } from './utils/FinancialAdvisor';
import { getWeekOfMonth, getWeekRange } from './utils/dateHelpers';

// ──────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────
export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface EnhancedBudget {
  id: string;
  user_id: string;
  category: string;
  budget_limit: number;
  spent: number;
  percentage: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  created_at?: string;
}

interface CustomSession {
  user: {
    id: string;
    email: string;
    name?: string;
    businessName?: string;
    avatar?: string;
    plan?: string;
    joinedDate?: string;
  };
  accessToken: string;
}

interface ApiService {
  verifyToken(): Promise<any>;
  fetchTransactions(userId: string): Promise<any>;
  fetchBudgets(userId: string): Promise<any>;
  fetchProfile(userId: string): Promise<any>;
  addTransaction(transactionData: any): Promise<any>;
  updateTransaction(transactionId: string, transactionData: any): Promise<any>;
  deleteTransaction(transactionId: string): Promise<any>;
  addBudget(budgetData: any): Promise<any>;
  updateBudget(budgetId: string, budgetData: any): Promise<any>;
  deleteBudget(budgetId: string): Promise<any>;
  saveSettings(userId: string, settings: any): Promise<any>;
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
// API Service – verifyToken calls /api/verify-session
// ──────────────────────────────────────────────────────────────────────
const apiService: ApiService = {
  async verifyToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    if (!isValidToken(token)) throw new Error('Invalid token format');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/api/verify-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ← REQUIRED HEADER
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) throw new Error('Unauthorized – invalid or expired token');
        if (response.status === 403) throw new Error('Forbidden');
        throw new Error(`Session verification failed: ${response.status} – ${errorText}`);
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
    const response = await fetch('/user/registeractions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const data = await response.json();
    return { transactions: data.transactions || [] };
  },

  async fetchBudgets(userId: string) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/user/register?action=budgets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Failed to fetch budgets');
    const data = await response.json();
    return { budgets: data.budgets || [] };
  },

  async fetchProfile(userId: string) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/user/register', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    const data = await response.json();
    return { profile: data.user || {} };
  },

  // Placeholder CRUD methods
  addTransaction: async () => ({ transaction: {} }),
  updateTransaction: async () => ({ transaction: {} }),
  deleteTransaction: async () => ({ success: true }),
  addBudget: async () => ({ budget: {} }),
  updateBudget: async () => ({ budget: {} }),
  deleteBudget: async () => ({ success: true }),
  saveSettings: async () => ({ success: true })
};

// ──────────────────────────────────────────────────────────────────────
// Dashboard Component
// ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // ──────── State (all at top) ────────
  const [session, setSession] = useState<CustomSession | null>(null);
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

  const connectionIssuesRef = useRef<number>(0);
  const lastConnectionAttemptRef = useRef<number>(Date.now());
  const autoReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

        const userData = await apiService.verifyToken(); // calls /api/verify-session

        const customSession: CustomSession = {
          user: userData,
          accessToken: token
        };

        setSession(customSession);
        setAuthLoaded(true);
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
      <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Image
          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
          alt="Monietar"
          width={220}
          height={50}
          className="mb-8 animate-pulse"
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

  // ──────── Helpers ────────
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

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  // ──────── fetchData ────────
  async function fetchData(session: CustomSession) {
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

      setUserSettings({
        fullName: profileData?.profile?.full_name || user.name,
        email: session.user.email,
        businessName: profileData?.profile?.business_name || user.businessName,
        phoneNumber: profileData?.profile?.phone_number || '',
        currency: profileData?.profile?.currency || 'NGN',
        language: profileData?.profile?.language || 'en',
        dateFormat: profileData?.profile?.date_format || 'MM/DD/YYYY',
        timezone: profileData?.profile?.timezone || 'UTC',
        notifications: profileData?.profile?.notification_settings || {
          budgetAlerts: true, weeklyReports: true, transactionAlerts: true, aiRecommendations: true
        }
      });
    } catch (error: any) {
      showToast('Failed to load data');
    } finally {
      setLoading(false);
    }
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
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'} flex`}>
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
                setTimeFilter={setTimeFilter}
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
                themeClasses={themeClasses}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetsPage
                budgetsWithRealTimeTracking={financialData.budgets.map(b => ({
                  ...b,
                  spent: financialData.transactions
                    .filter(t => t.category === b.category && t.type === 'expense')
                    .reduce((s, t) => s + t.amount, 0)
                })) as EnhancedBudget[]}
                formatCurrency={formatCurrency}
                setShowBudgetForm={() => {}}
                startEditBudget={(budget: EnhancedBudget) => setEditingBudget(budget as unknown as Budget)}
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
                handleClearData={() => {}}
                handleChangePassword={() => {}}
                handleDeleteAccount={() => {}}
                themeClasses={themeClasses}
                darkMode={darkMode}
                currency={currency}
                setCurrency={setCurrency}
                language={language}
                setLanguage={setLanguage}
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
            themeClasses={themeClasses}
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