'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
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
  Sun, Moon, Sparkles, Zap, Target, Shield, Database, Cloud,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';

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

// Import pages
import { OverviewPage } from './components/pages/OverviewPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { BudgetsPage } from './components/pages/BudgetsPage';
import { ComingSoonPage } from './components/pages/ComingSoonPage'
import { SettingsPage } from './components/pages/SettingsPage';
import AccountsPage from './components/pages/AccountsPage';

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
  TimeFilter,
  SidebarProps
} from './types';

// Import your classes
import { RuleBasedFinancialAdvisor } from './utils/FinancialAdvisor';
import { AdvancedFinancialNLP } from './utils/FinancialNLP';

// Import helper functions
import { getWeekOfMonth, getWeekRange } from './utils/dateHelpers';

// Enhanced Sidebar props interface to fix the TypeScript error
interface EnhancedSidebarProps extends Omit<SidebarProps, 'setDarkMode' | 'currency' | 'setCurrency' | 'language' | 'setLanguage'> {
  setDarkMode: (darkMode: boolean) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

// Define EnhancedBudget interface locally if not in types.ts
interface EnhancedBudget {
  id: string;
  category: string;
  budget_limit: number;
  spent: number;
  percentage: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at?: string;
}

// Create Supabase client
const supabase = createClientComponentClient();

// Fintech Chatbot Service
class FintechChatbotService {
  // Generate embeddings using OpenAI (you'll need an API key)
  static async generateEmbedding(text: string): Promise<number[] | null> {
    try {
      // For free tier, we can use a simple TF-IDF like approach or use Groq
      // Since OpenAI isn't free, we'll implement a keyword-based matching system
      return this.simpleTextToVector(text);
    } catch (error) {
      console.error('Error generating embedding:', error);
      return null;
    }
  }

  // Simple text vectorization for free tier (basic keyword matching)
  private static simpleTextToVector(text: string): number[] {
    // This is a simplified approach - in production you'd want proper embeddings
    const fintechKeywords = [
      'cash flow', 'budget', 'expense', 'income', 'revenue', 'profit',
      'burn rate', 'forecast', 'management', 'analysis', 'optimization',
      'working capital', 'liquidity', 'financial', 'money', 'cost',
      'savings', 'investment', 'cash', 'budgeting', 'tracking'
    ];
    
    const vector = new Array(fintechKeywords.length).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      const index = fintechKeywords.findIndex(keyword => 
        keyword.includes(word) || word.includes(keyword)
      );
      if (index !== -1) {
        vector[index] += 1;
      }
    });
    
    return vector;
  }

  // Semantic search in fintech knowledge base
  static async searchFintechKnowledge(query: string, limit: number = 3) {
    try {
      const queryVector = this.simpleTextToVector(query);
      
      // Convert to PostgreSQL vector format
      const vectorStr = `[${queryVector.join(',')}]`;
      
      const { data, error } = await supabase
        .rpc('match_fintech_documents', {
          query_embedding: vectorStr,
          match_count: limit
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching fintech knowledge:', error);
      
      // Fallback: keyword-based search
      const { data, error } = await supabase
        .from('fintech_knowledge_base')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;
      return data || [];
    }
  }

  // Save chat conversation
  static async saveConversation(userId: string, title: string) {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert([
        { user_id: userId, title }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Save chat message
  static async saveMessage(conversationId: string, role: string, content: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        { conversation_id: conversationId, role, content }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's chat history
  static async getChatHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

// MOCK_DATA for frontend development
const MOCK_DATA = {
  transactions: [
    {
      id: '1',
      user_id: 'user-001',
      type: 'income',
      amount: 50000,
      category: 'Selling Products',
      description: 'Monthly product sales',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'user-001',
      type: 'expense',
      amount: 15000,
      category: 'Worker Pay',
      description: 'Staff salaries',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      user_id: 'user-001',
      type: 'income',
      amount: 25000,
      category: 'Service Work',
      description: 'Consulting services',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  budgets: [
    {
      id: '1',
      user_id: 'user-001',
      category: 'Worker Pay',
      budget_limit: 20000,
      spent: 15000,
      percentage: 75,
      period: 'monthly',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'user-001',
      category: 'Marketing Costs',
      budget_limit: 5000,
      spent: 3000,
      percentage: 60,
      period: 'monthly',
      created_at: new Date().toISOString()
    }
  ],
  profile: {
    full_name: 'John Doe',
    business_name: 'Doe Enterprises',
    email: 'john@doe.com',
    phone_number: '+234 901 234 5678',
    currency: 'NGN',
    language: 'en',
    date_format: 'MM/DD/YYYY',
    timezone: 'UTC',
    notification_settings: {
      budgetAlerts: true,
      weeklyReports: true,
      transactionAlerts: true,
      aiRecommendations: true
    },
    plan: 'Free Plan',
    created_at: new Date().toISOString()
  }
};

// Mock API service using MOCK_DATA
const apiService = {
  async fetchTransactions(userId: string, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock transactions for the user
    return {
      transactions: MOCK_DATA.transactions.filter(t => t.user_id === userId)
    };
  },

  async fetchBudgets(userId: string, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock budgets for the user
    return {
      budgets: MOCK_DATA.budgets.filter(b => b.user_id === userId)
    };
  },

  async fetchProfile(userId: string, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock profile
    return {
      profile: MOCK_DATA.profile
    };
  },

  async addTransaction(transactionData: any, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create mock transaction
    const newTransaction = {
      id: `mock-${Date.now()}`,
      user_id: session.user.id,
      ...transactionData,
      created_at: new Date().toISOString()
    };
    
    // Add to mock data
    MOCK_DATA.transactions.push(newTransaction);
    
    return {
      transaction: newTransaction
    };
  },

  async updateTransaction(transactionId: string, transactionData: any, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock transaction
    const transactionIndex = MOCK_DATA.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex !== -1) {
      MOCK_DATA.transactions[transactionIndex] = {
        ...MOCK_DATA.transactions[transactionIndex],
        ...transactionData
      };
      
      return {
        transaction: MOCK_DATA.transactions[transactionIndex]
      };
    }
    
    throw new Error('Transaction not found');
  },

  async deleteTransaction(transactionId: string, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove from mock data
    const transactionIndex = MOCK_DATA.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex !== -1) {
      MOCK_DATA.transactions.splice(transactionIndex, 1);
      return { success: true };
    }
    
    throw new Error('Transaction not found');
  },

  async addBudget(budgetData: any, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create mock budget
    const newBudget = {
      id: `mock-budget-${Date.now()}`,
      user_id: session.user.id,
      ...budgetData,
      spent: 0,
      percentage: 0,
      created_at: new Date().toISOString()
    };
    
    // Add to mock data
    MOCK_DATA.budgets.push(newBudget);
    
    return {
      budget: newBudget
    };
  },

  async updateBudget(budgetId: string, budgetData: any, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock budget
    const budgetIndex = MOCK_DATA.budgets.findIndex(b => b.id === budgetId);
    if (budgetIndex !== -1) {
      MOCK_DATA.budgets[budgetIndex] = {
        ...MOCK_DATA.budgets[budgetIndex],
        ...budgetData
      };
      
      return {
        budget: MOCK_DATA.budgets[budgetIndex]
      };
    }
    
    throw new Error('Budget not found');
  },

  async deleteBudget(budgetId: string, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove from mock data
    const budgetIndex = MOCK_DATA.budgets.findIndex(b => b.id === budgetId);
    if (budgetIndex !== -1) {
      MOCK_DATA.budgets.splice(budgetIndex, 1);
      return { success: true };
    }
    
    throw new Error('Budget not found');
  },

  async saveSettings(settings: any, session: Session) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock profile
    MOCK_DATA.profile = {
      ...MOCK_DATA.profile,
      ...settings
    };
    
    return { success: true };
  }
};

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
  
  // Enhanced state variables for connection monitoring
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [databaseStatus, setDatabaseStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [showConnectionErrorModal, setShowConnectionErrorModal] = useState(false);
  const [showReLoginModal, setShowReLoginModal] = useState(false);
  const [connectionRetryCount, setConnectionRetryCount] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
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
  const [darkMode, setDarkMode] = useState(true);

  
  // Transaction management states
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  
  // Budget management states
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  
  // Form data states - Fixed period types to match modal expectations
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

  // Add missing state variables for the errors
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [isCancelSubscriptionOpen, setIsCancelSubscriptionOpen] = useState(false);

  // Refs for tracking connection issues - Fixed useRef initialization
  const connectionIssuesRef = useRef<number>(0);
  const lastConnectionAttemptRef = useRef<number>(Date.now());
  const autoReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced theme classes with modern colors
  const themeClasses = {
    background: darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950' 
      : 'bg-gradient-to-br from-gray-50 via-white to-blue-50',
    card: darkMode 
      ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-gray-700/50 shadow-2xl' 
      : 'bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-2xl',
    cardHover: darkMode 
      ? 'hover:from-gray-800 hover:to-gray-800/90 hover:border-gray-600/50 transition-all duration-300' 
      : 'hover:bg-gray-50/90 transition-all duration-300',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500',
      accent: darkMode ? 'text-blue-400' : 'text-blue-600',
      success: darkMode ? 'text-emerald-400' : 'text-emerald-600',
      warning: darkMode ? 'text-amber-400' : 'text-amber-600',
      danger: darkMode ? 'text-red-400' : 'text-red-600'
    },
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/50',
    input: darkMode 
      ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 backdrop-blur-sm' 
      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 backdrop-blur-sm',
    sidebar: darkMode 
      ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-gray-800/50' 
      : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800/50',
    sidebarText: darkMode ? 'text-gray-300' : 'text-slate-200',
    sidebarHover: darkMode 
      ? 'hover:bg-gray-800/50 hover:text-white backdrop-blur-sm' 
      : 'hover:bg-slate-800/50 hover:text-white backdrop-blur-sm',
    sidebarActive: darkMode 
      ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/20 border-r-2 border-blue-500 text-white' 
      : 'bg-gradient-to-r from-blue-500/20 to-blue-500/20 border-r-2 border-blue-500 text-white',
    gradient: {
      primary: darkMode 
        ? 'from-blue-500 to-blue-600' 
        : 'from-blue-600 to-blue-700',
      success: darkMode 
        ? 'from-emerald-500 to-emerald-600' 
        : 'from-emerald-600 to-emerald-700',
      danger: darkMode 
        ? 'from-red-500 to-red-600' 
        : 'from-red-600 to-red-700',
      premium: 'from-purple-500 via-blue-500 to-blue-600'
    }
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

  // Fintech suggested questions for the chatbot
  const fintechSuggestedQuestions = [
    "How can I improve my cash flow?",
    "What's the difference between profit and cash flow?",
    "How do I calculate my burn rate?",
    "Best practices for expense tracking?",
    "How to create a cash flow forecast?",
    "What is working capital management?"
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
    // Redirect to signin page after logout
    window.location.href = '/auth/signin';
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  // Enhanced AI response generator with fintech context
  const generateAIResponseWithContext = async (
    userQuestion: string, 
    relevantKnowledge: any[],
    financialData: FinancialData
  ): Promise<string> => {
    
    // Build context from relevant fintech knowledge
    const knowledgeContext = relevantKnowledge.length > 0 
      ? `Relevant Financial Knowledge:\n${relevantKnowledge.map(k => `- ${k.content}`).join('\n')}`
      : 'No specific financial knowledge found for this query.';

    // Build user data context
    const userDataContext = financialData.transactions.length > 0
      ? `User Financial Snapshot:\n- Income: ${formatCurrency(financialData.income)}\n- Expenses: ${formatCurrency(financialData.expenses)}\n- Profit: ${formatCurrency(financialData.profit)}\n- Total Transactions: ${financialData.transactions.length}`
      : 'No transaction data available yet.';

    const prompt = `
You are a specialized AI financial advisor focused on cash flow management and fintech. 
Your expertise includes budgeting, expense tracking, cash flow analysis, and financial optimization.

${knowledgeContext}

${userDataContext}

User Question: "${userQuestion}"

Guidelines for your response:
1. Focus on practical, actionable advice for cash flow management
2. Use financial terminology appropriately but explain complex concepts
3. Provide specific examples when helpful
4. Reference the user's financial data if relevant
5. Keep responses concise but comprehensive
6. If the question is outside cash flow management, politely redirect to financial topics
7. Suggest related financial concepts they might find helpful

Response:
`;

    // Use your existing AI processor with the enhanced prompt
    return AdvancedFinancialNLP.processQuery(
      prompt,
      financialData.transactions,
      financialData.budgets,
      (amount: number) => formatCurrency(amount)
    );
  };

  // Enhanced AI Chat Function with Supabase Integration
  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;

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
      text: "Analyzing your cash flow question...", 
      sender: 'ai' 
    };
    setChatMessages(prev => [...prev, typingMessage]);

    try {
      // Search for relevant fintech knowledge from Supabase
      const relevantKnowledge = await FintechChatbotService.searchFintechKnowledge(newMessage);
      
      // Get AI response with fintech context
      const aiResponse = await generateAIResponseWithContext(
        newMessage, 
        relevantKnowledge,
        financialData
      );

      // Remove typing indicator and add actual response
      setChatMessages(prev => 
        prev.filter(msg => msg.id !== typingMessage.id).concat({
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'ai'
        })
      );

      // Save to conversation history in Supabase
      try {
        if (chatMessages.length === 0) {
          // First message in conversation
          const conversation = await FintechChatbotService.saveConversation(
            session.user.id, 
            newMessage.substring(0, 50) + '...'
          );
          await FintechChatbotService.saveMessage(conversation.id, 'user', newMessage);
          await FintechChatbotService.saveMessage(conversation.id, 'assistant', aiResponse);
        } else {
          // For existing conversations, you might want to implement conversation tracking
          // This is a simplified version
        }
      } catch (saveError) {
        console.error('Error saving chat history:', saveError);
        // Don't show error to user for save failures
      }

    } catch (error) {
      console.error('AI response error:', error);
      setChatMessages(prev => 
        prev.filter(msg => msg.id !== typingMessage.id).concat({
          id: Date.now() + 1,
          text: "I'm having trouble accessing financial insights right now. Please try again later or ask about cash flow management, budgeting, or financial analysis.",
          sender: 'ai'
        })
      );
    }
  };

  // Enhanced session monitoring with connection persistence check
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        
        // Use Supabase directly to check session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Redirect to signin if there's an error getting session
          window.location.href = '/auth/signin';
          return;
        }
        
        if (!session) {
          // No session found, redirect to signin
          window.location.href = '/auth/signin';
          return;
        }
        
        // We have a valid session
        setSession(session);
        await fetchData(session);
        
      } catch (error) {
        console.error('Authentication error:', error);
        window.location.href = '/auth/signin';
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Redirect to signin on sign out
          window.location.href = '/auth/signin';
        } else if (event === 'SIGNED_IN' && session) {
          setSession(session);
          await fetchData(session);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setSession(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Enhanced connection monitoring with auto-reconnect
  useEffect(() => {
    // Network status monitoring
    const handleOnline = async () => {
      setNetworkStatus('online');
      showToast('Connection restored');
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
      setShowConnectionErrorModal(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (autoReconnectTimeoutRef.current) {
        clearTimeout(autoReconnectTimeoutRef.current);
      }
    };
  }, [session, networkStatus]);

  // Settings Functions with Mock API
  const handleSaveSettings = async () => {
    if (!session) {
      showToast('Please log in to save settings');
      return;
    }

    try {
      await apiService.saveSettings(userSettings, session);

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
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showToast(`Error saving settings: ${error.message || 'Please try again'}`);
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

      if (error) {
        throw new Error(error.message || 'Failed to change password');
      }

      showToast('Password updated successfully!');
      setShowChangePasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error changing password:', error);
      showToast(`Error changing password: ${error.message || 'Please try again'}`);
    }
  };

  const handleExportData = async () => {
    if (!session) {
      showToast('Please log in to export data');
      return;
    }

    try {
      // Simulate export with mock data
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Type,Amount,Category,Description,Date\n"
        + financialData.transactions.map(t => 
            `${t.type},${t.amount},${t.category},${t.description || ''},${t.date}`
          ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "financial-data-export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Data exported successfully!');
    } catch (error: any) {
      console.error('Error exporting data:', error);
      showToast(`Error exporting data: ${error.message || 'Please try again'}`);
    }
  };

  const handleBackupData = async () => {
    if (!session) {
      showToast('Please log in to backup data');
      return;
    }
  
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Backup created successfully!');
    } catch (error: any) {
      console.error('Error creating backup:', error);
      showToast(`Error creating backup: ${error.message || 'Please try again'}`);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!session) {
      showToast('Please log in to restore backup');
      return;
    }
  
    try {
      // Simulate backup restoration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the dashboard data
      await fetchData(session);

      showToast('Backup restored successfully!');
      setShowRestoreDialog(false);
    } catch (error: any) {
      console.error('Error restoring backup:', error);
      showToast(`Error restoring backup: ${error.message || 'Please try again'}`);
    }
  };

  const handleClearData = async () => {
    if (!session) {
      showToast('Please log in to clear data');
      return;
    }

    try {
      // Clear mock data for this user
      MOCK_DATA.transactions = MOCK_DATA.transactions.filter(t => t.user_id !== session.user.id);
      MOCK_DATA.budgets = MOCK_DATA.budgets.filter(b => b.user_id !== session.user.id);

      // Refresh data
      await fetchData(session);

      setShowClearDataDialog(false);
      showToast('All data cleared successfully!');
    } catch (error: any) {
      console.error('Error clearing data:', error);
      showToast(`Error clearing data: ${error.message || 'Please try again'}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session) {
      showToast('Please log in to delete account');
      return;
    }

    try {
      // Clear user data from mock data
      MOCK_DATA.transactions = MOCK_DATA.transactions.filter(t => t.user_id !== session.user.id);
      MOCK_DATA.budgets = MOCK_DATA.budgets.filter(b => b.user_id !== session.user.id);

      showToast('Account deleted successfully!');
      await supabase.auth.signOut();
      // Redirect to signin page after account deletion
      window.location.href = '/auth/signin';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showToast(`Error deleting account: ${error.message || 'Please try again'}`);
    }
  };

  // Add missing function for subscription cancellation
  const handleCancelSubscription = async () => {
    // This would typically call your subscription management API
    showToast('Subscription cancellation feature coming soon');
    setIsCancelSubscriptionOpen(false);
  };

  // Enhanced fetchData function with mock API
  async function fetchData(session: Session) {
    if (!session) {
      showToast('No active session. Please log in.');
      setLoading(false);
      setShowSessionExpiredModal(true);
      return;
    }

    setLoading(true);
    const userId = session.user.id;

    try {
      // Use mock API service to get data
      const [transactionsData, budgetsData, profileData] = await Promise.all([
        apiService.fetchTransactions(userId, session),
        apiService.fetchBudgets(userId, session),
        apiService.fetchProfile(userId, session)
      ]);

      // Calculate financial data
      const income = (transactionsData.transactions?.filter((t: Transaction) => t.type === 'income').reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0);
      const expenses = (transactionsData.transactions?.filter((t: Transaction) => t.type === 'expense').reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0);
      const profit = income - expenses;

      // Generate AI recommendations based on actual data
      const aiRecommendations = transactionsData.transactions && transactionsData.transactions.length > 0 
        ? RuleBasedFinancialAdvisor.analyzeSpendingPatterns(transactionsData.transactions, budgetsData.budgets || [], formatCurrency).slice(0, 4)
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
        transactions: transactionsData.transactions || [],
        budgets: budgetsData.budgets || [],
        alerts: realTimeAlerts,
        aiRecommendations
      }));

      // Set user data
      const userData = {
        name: profileData?.profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || 'No email',
        businessName: profileData?.profile?.business_name || session.user.user_metadata?.business_name || 'My Business',
        avatar: profileData?.profile?.avatar || session.user.user_metadata?.avatar_url || '/api/placeholder/40/40',
        plan: profileData?.profile?.plan || 'Free Plan',
        joinedDate: new Date(profileData?.profile?.created_at || session.user.created_at).toISOString().split('T')[0]
      };

      setUser(userData);

      // Set user settings
      setUserSettings({
        fullName: profileData?.profile?.full_name || userData.name,
        email: userData.email,
        businessName: profileData?.profile?.business_name || userData.businessName,
        phoneNumber: profileData?.profile?.phone_number || '',
        currency: profileData?.profile?.currency || 'NGN',
        language: profileData?.profile?.language || 'en',
        dateFormat: profileData?.profile?.date_format || 'MM/DD/YYYY',
        timezone: profileData?.profile?.timezone || 'UTC',
        notifications: profileData?.profile?.notification_settings || {
          budgetAlerts: true,
          weeklyReports: true,
          transactionAlerts: true,
          aiRecommendations: true
        }
      });

    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      
      // Handle different error types safely
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showToast('Connection timeout. Please check your internet connection.');
          setShowConnectionErrorModal(true);
        } else if (error.message?.includes('JWT')) {
          setShowSessionExpiredModal(true);
          showToast('Session expired. Please log in again.');
        } else {
          showToast('Unable to load data. Please try again.');
          setShowConnectionErrorModal(true);
        }
      } else {
        showToast('An unexpected error occurred. Please try again.');
        setShowConnectionErrorModal(true);
      }
    } finally {
      setLoading(false);
    }
  }

  // Transaction Management Functions with Mock API
  const handleAddTransaction = async (type: 'income' | 'expense') => {
    if (!formData.amount || !formData.category || !session) {
      showToast('Please fill all required fields or log in');
      return;
    }

    try {
      const data = await apiService.addTransaction({
        type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || '',
        date: formData.date,
      }, session);

      // Update local state immediately
      setFinancialData(prev => ({
        ...prev,
        transactions: [data.transaction, ...prev.transactions],
        income: type === 'income' ? prev.income + data.transaction.amount : prev.income,
        expenses: type === 'expense' ? prev.expenses + data.transaction.amount : prev.expenses,
        profit: type === 'income' ? prev.profit + data.transaction.amount : prev.profit - data.transaction.amount
      }));

      showToast(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      
      // Close the modal
      type === 'income' ? setShowIncomeForm(false) : setShowExpenseForm(false);
      
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      showToast(`Error adding transaction: ${error.message || 'Please try again'}`);
      throw error;
    }
  };

  const handleEditTransaction = async () => {
    if (!editingTransaction || !session) {
      showToast('Please log in to edit transactions');
      return;
    }

    try {
      const data = await apiService.updateTransaction(editingTransaction.id, {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || '',
        date: formData.date
      }, session);

      // Calculate differences for financial totals
      const amountDiff = data.transaction.amount - editingTransaction.amount;
      const typeChanged = data.transaction.type !== editingTransaction.type;

      // Update local state
      setFinancialData(prev => {
        const updatedTransactions = prev.transactions.map(t => 
          t.id === editingTransaction.id ? data.transaction : t
        );
        
        let newIncome = prev.income;
        let newExpenses = prev.expenses;
        
        if (typeChanged) {
          if (data.transaction.type === 'income') {
            newIncome += data.transaction.amount;
            newExpenses -= editingTransaction.amount;
          } else {
            newIncome -= editingTransaction.amount;
            newExpenses += data.transaction.amount;
          }
        } else {
          if (data.transaction.type === 'income') {
            newIncome += amountDiff;
          } else {
            newExpenses += amountDiff;
          }
        }
        
        const newProfit = newIncome - newExpenses;
        
        return {
          ...prev,
          transactions: updatedTransactions,
          income: newIncome,
          expenses: newExpenses,
          profit: newProfit
        };
      });

      showToast('Transaction updated successfully!');
      setEditingTransaction(null);
      setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      showToast(`Error updating transaction: ${error.message || 'Please try again'}`);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await apiService.deleteTransaction(transactionId, session);

      // Find the transaction to update financial totals
      const transactionToDelete = financialData.transactions.find(t => t.id === transactionId);
      
      if (transactionToDelete) {
        setFinancialData(prev => ({
          ...prev,
          transactions: prev.transactions.filter(t => t.id !== transactionId),
          income: transactionToDelete.type === 'income' ? prev.income - transactionToDelete.amount : prev.income,
          expenses: transactionToDelete.type === 'expense' ? prev.expenses - transactionToDelete.amount : prev.expenses,
          profit: transactionToDelete.type === 'income' ? prev.profit - transactionToDelete.amount : prev.profit + transactionToDelete.amount
        }));
      }

      setDeleteTransactionId(null);
      showToast('Transaction deleted successfully');
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      showToast(`Error deleting transaction: ${error.message || 'Please try again'}`);
    }
  };

  // Budget Management Functions with Mock API
  const handleAddBudget = async () => {
    if (!budgetFormData.category || !budgetFormData.budget_limit || !session) {
      showToast('Please fill all required fields or log in');
      return;
    }

    try {
      const data = await apiService.addBudget({
        category: budgetFormData.category,
        budget_limit: parseFloat(budgetFormData.budget_limit),
        period: budgetFormData.period,
      }, session);

      // Update local state immediately
      setFinancialData(prev => ({
        ...prev,
        budgets: [...prev.budgets, data.budget]
      }));

      showToast('Budget added successfully!');
      setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
      setShowBudgetForm(false);
      
    } catch (error: any) {
      console.error('Error adding budget:', error);
      showToast(`Error adding budget: ${error.message || 'Please try again'}`);
    }
  };

  const handleEditBudget = async () => {
    if (!editingBudget || !session) {
      showToast('Please log in to edit budgets');
      return;
    }

    try {
      const data = await apiService.updateBudget(editingBudget.id, {
        category: budgetFormData.category,
        budget_limit: parseFloat(budgetFormData.budget_limit),
        period: budgetFormData.period
      }, session);

      // Update local state
      setFinancialData(prev => ({
        ...prev,
        budgets: prev.budgets.map(b => 
          b.id === editingBudget.id ? data.budget : b
        )
      }));

      showToast('Budget updated successfully!');
      setEditingBudget(null);
      setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
      
    } catch (error: any) {
      console.error('Error updating budget:', error);
      showToast(`Error updating budget: ${error.message || 'Please try again'}`);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await apiService.deleteBudget(budgetId, session);

      setFinancialData(prev => ({
        ...prev,
        budgets: prev.budgets.filter(b => b.id !== budgetId)
      }));

      setDeleteBudgetId(null);
      showToast('Budget deleted successfully');
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      showToast(`Error deleting budget: ${error.message || 'Please try again'}`);
    }
  };

  // Enhanced manual re-login function
  const handleForceReLogin = () => {
    // Clear all local state
    setSession(null);
    setFinancialData({
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
    
    // Reset connection counters
    connectionIssuesRef.current = 0;
    setConnectionRetryCount(0);
    
    // Close modals and redirect to login
    setShowReLoginModal(false);
    setShowConnectionErrorModal(false);
    setShowSessionExpiredModal(false);
    window.location.href = '/auth/signin';
  };

  // Load available backups
  useEffect(() => {
    if (showRestoreDialog && session) {
      loadAvailableBackups();
    }
  }, [showRestoreDialog, session]);

  const loadAvailableBackups = async () => {
    if (!session) return;
    
    try {
      // Simulate loading backups
      await new Promise(resolve => setTimeout(resolve, 500));
      setAvailableBackups([
        { id: 'backup-1', name: 'Backup 1', date: new Date().toISOString() },
        { id: 'backup-2', name: 'Backup 2', date: new Date(Date.now() - 86400000).toISOString() }
      ]);
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  // Update AI recommendations when data changes
  useEffect(() => {
    if (financialData.transactions.length > 0) {
      const recommendations = RuleBasedFinancialAdvisor.analyzeSpendingPatterns(
        financialData.transactions,
        financialData.budgets,
        formatCurrency
      );
      
      // Only update if recommendations actually changed
      const newRecommendations = recommendations.slice(0, 4);
      const currentRecommendations = financialData.aiRecommendations;
      
      // Check if recommendations actually changed to avoid unnecessary updates
      const hasChanged = newRecommendations.length !== currentRecommendations.length ||
        newRecommendations.some((rec, index) => rec !== currentRecommendations[index]);
      
      if (hasChanged) {
        setFinancialData(prev => ({
          ...prev,
          aiRecommendations: newRecommendations
        }));
      }
    }
  }, [financialData.transactions, financialData.budgets]);

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
        // Last 7 days with actual dates
        data = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          const period = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          
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

  // Real-time budget tracking calculation with proper typing
  const budgetsWithRealTimeTracking = useMemo((): EnhancedBudget[] => {
    return financialData.budgets.map(budget => {
      // Calculate spent amount from transactions for this budget category
      const spent = financialData.transactions
        .filter(transaction => 
          transaction.type === 'expense' && 
          transaction.category === budget.category
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      const percentage = budget.budget_limit > 0 ? (spent / budget.budget_limit) * 100 : 0;
      
      // Convert to EnhancedBudget type with proper period conversion
      const enhancedBudget: EnhancedBudget = {
        id: budget.id,
        category: budget.category,
        budget_limit: budget.budget_limit,
        spent,
        percentage,
        period: budget.period as 'daily' | 'weekly' | 'monthly' | 'yearly',
        created_at: budget.created_at
      };
      
      return enhancedBudget;
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

  // Get data key for chart based on time filter
  const getDataKey = () => {
    return 'period';
  };

  // Custom tooltip for line charts with updated colors
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl shadow-lg border backdrop-blur-lg ${darkMode ? 'bg-gray-800/90 border-gray-600 text-white' : 'bg-white/90 border-gray-200 text-gray-900'}`}>
          <p className="font-semibold">{label}</p>
          <p className="text-emerald-500">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-500">Expenses: {formatCurrency(payload[1].value)}</p>
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
      <div className={`w-16 h-16 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <Icon className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
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

  // Start editing a budget - properly typed for EnhancedBudget
  const startEditBudget = (budget: EnhancedBudget) => {
    // Convert EnhancedBudget back to Budget for editing
    const budgetToEdit: Budget = {
      id: budget.id,
      user_id: '', // This will be set from session when saving
      category: budget.category,
      budget_limit: budget.budget_limit,
      spent: budget.spent,
      percentage: budget.percentage,
      period: budget.period,
      created_at: new Date().toISOString()
    };
    
    setEditingBudget(budgetToEdit);
    setBudgetFormData({
      category: budget.category,
      budget_limit: budget.budget_limit.toString(),
      period: budget.period as 'Monthly' | 'Quarterly' | 'Yearly'
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

  // Enhanced Connection Status Indicators in Header
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2">
      {/* Network status indicator */}
      <div className={`hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
        networkStatus === 'online' 
          ? (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
          : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${
          networkStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'
        }`}></div>
        <span>{networkStatus === 'online' ? 'Online' : 'Offline'}</span>
      </div>

      {/* Database status indicator */}
      <div className={`hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
        databaseStatus === 'connected' 
          ? (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
          : databaseStatus === 'checking' || isReconnecting
          ? (darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700')
          : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
      }`}>
        {isReconnecting ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full ${
            databaseStatus === 'connected' ? 'bg-emerald-500' : 
            databaseStatus === 'checking' ? 'bg-amber-500' : 'bg-red-500'
          }`}></div>
        )}
        <span>
          {isReconnecting ? 'Reconnecting...' :
           databaseStatus === 'connected' ? 'DB Connected' : 
           databaseStatus === 'checking' ? 'DB Checking' : 'DB Error'}
        </span>
      </div>
    </div>
  );

  // Enhanced Re-Login Modal
  const ReLoginModal = () => (
    <Dialog.Root open={showReLoginModal} onOpenChange={setShowReLoginModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl shadow-2xl z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <RefreshCw className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'} animate-spin`} />
            </div>
            
            <Dialog.Title className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Connection Issues Detected
            </Dialog.Title>
            
            <Dialog.Description className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We're having persistent connection issues. This might be due to:
            </Dialog.Description>
            
            <ul className={`text-sm mb-6 text-left space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <span>Expired authentication session</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <span>Network connectivity problems</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <span>Server maintenance or issues</span>
              </li>
            </ul>
            
            <div className={`text-sm mb-6 p-3 rounded-lg w-full ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <div className="flex items-center justify-between mb-2">
                <span>Connection Attempts:</span>
                <span className="font-semibold">{connectionRetryCount}/3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recommended Action:</span>
                <span className="font-semibold text-amber-500">Re-login</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-300 disabled:text-gray-500'
                }`}
              >
                <span>Try Again</span>
              </button>
              
              <button
                onClick={handleForceReLogin}
                className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Re-login Now
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  // Enhanced Connection Error Modal with auto-retry
  const ConnectionErrorModal = () => (
    <Dialog.Root open={showConnectionErrorModal} onOpenChange={setShowConnectionErrorModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl shadow-2xl z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <Globe className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
            </div>
            
            <Dialog.Title className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Connection Issues
            </Dialog.Title>
            
            <Dialog.Description className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {networkStatus === 'offline' 
                ? 'You appear to be offline. Please check your internet connection.'
                : 'We\'re having trouble connecting to our servers.'
              }
            </Dialog.Description>
            
            <div className={`text-sm mb-6 p-3 rounded-lg w-full ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <div className="flex items-center justify-between mb-2">
                <span>Network Status:</span>
                <span className={`flex items-center ${networkStatus === 'online' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {networkStatus === 'online' ? (
                    <>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      Online
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Offline
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database:</span>
                <span className={`flex items-center ${
                  databaseStatus === 'connected' ? 'text-emerald-500' : 
                  databaseStatus === 'checking' ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {databaseStatus === 'connected' ? (
                    <>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      Connected
                    </>
                  ) : databaseStatus === 'checking' ? (
                    <>
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Disconnected
                    </>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-300 disabled:text-gray-500'
                }`}
              >
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={handleForceReLogin}
                className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Re-login Now
              </button>
            </div>

            {connectionRetryCount > 0 && (
              <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>If problems persist, try <button onClick={handleForceReLogin} className="text-blue-400 hover:underline">re-logging in</button></p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  // Enhanced Loading Component with Logo Animation
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${themeClasses.background}`}>
        <div className="relative">
          {/* Logo Animation */}
            <Image
                  src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                  alt="Monietar Logo"
                  width={160}
                  height={40}
                  className="object-contain animate-pulse"
                />
        </div>
        <p className={`mt-4 ${themeClasses.text.secondary}`}>Loading your dashboard...</p>
      </div>
    );
  }

  // If no session found, redirect to signin page
  if (!session) {
    // This will trigger the redirect in useEffect, but we show a message meanwhile
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${themeClasses.background}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className={themeClasses.text.primary}>Redirecting to signin page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} flex`}>
      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} className={`rounded-xl p-4 shadow-lg backdrop-blur-lg border ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} border`}>
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
          setDarkMode={setDarkMode}
          currency={currency}
          setCurrency={setCurrency}
          language={language}
          setLanguage={setLanguage}
          showBalance={showBalance}
          setShowBalance={setShowBalance}
          currencies={currencies}
          languagesList={languagesList}
          realTimeAlerts={realTimeAlerts}
        />

        {/* Main Content with sidebar offset */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Enhanced Header with Connection Status */}
          <header className={`${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} border-b backdrop-blur-xl sticky top-0 z-30`}>
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`p-2 rounded-xl ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'} backdrop-blur-sm`}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Enhanced Connection Status */}
                  <ConnectionStatus />

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-xl backdrop-blur-sm ${darkMode ? 'hover:bg-gray-700/50 text-amber-400' : 'hover:bg-gray-100/50 text-gray-600'} transition-all duration-300`}
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className={`p-2 rounded-xl backdrop-blur-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'} transition-all duration-300`}
                    title={showBalance ? 'Hide balance' : 'Show balance'}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <Select.Root value={language} onValueChange={setLanguage}>
                    <Select.Trigger className={`flex items-center space-x-2 px-3 py-2 rounded-xl hover:cursor-pointer border backdrop-blur-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-gray-600/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border-gray-300/50'}`}>
                      <Languages className="w-4 h-4" />
                      <Select.Value placeholder="Language" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className={`rounded-xl shadow-2xl border z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'}`}>
                        <Select.Viewport className="p-2">
                          {languagesList.map((lang) => (
                            <Select.Item
                              key={lang.value}
                              value={lang.value}
                              className={`flex items-center px-3 py-2 rounded-lg hover:cursor-pointer ${darkMode ? 'hover:bg-gray-700/50 text-white' : 'hover:bg-gray-100/50 text-gray-900'}`}
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
                    <Select.Trigger className={`flex items-center space-x-2 px-3 py-2 rounded-xl hover:cursor-pointer border backdrop-blur-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-gray-600/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border-gray-300/50'}`}>
                      <Select.Value placeholder="Currency" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className={`rounded-xl shadow-2xl border z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'}`}>
                        <Select.Viewport className="p-2">
                          {currencies.map((curr) => {
                            return (
                              <Select.Item
                                key={curr.value}
                                value={curr.value}
                                className={`flex items-center px-3 py-2 rounded-lg hover:cursor-pointer ${darkMode ? 'hover:bg-gray-700/50 text-white' : 'hover:bg-gray-100/50 text-gray-900'}`}
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

                  <button className={`p-2 rounded-xl relative hover:cursor-pointer backdrop-blur-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                      {realTimeAlerts.length}
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className={`p-2 rounded-xl lg:hidden hover:cursor-pointer backdrop-blur-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={handleLogout}
                    className={`hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl hover:cursor-pointer backdrop-blur-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}
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

            {/* Page Content */}
            {activeTab === 'overview' && (
              <OverviewPage
                financialData={financialData}
                formatCurrency={formatCurrency}
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                timeFilters={timeFilters}
                hasTransactionData={hasTransactionData}
                currentTrendData={currentTrendData}
                categoryBreakdown={categoryBreakdown}
                budgetsWithRealTimeTracking={budgetsWithRealTimeTracking}
                realTimeAlerts={realTimeAlerts}
                setShowIncomeForm={setShowIncomeForm}
                setShowExpenseForm={setShowExpenseForm}
                setShowBudgetForm={setShowBudgetForm}
                startEditBudget={startEditBudget}
                setDeleteBudgetId={setDeleteBudgetId}
                setActiveTab={setActiveTab}
                darkMode={darkMode}
                themeClasses={themeClasses}
                getDataKey={getDataKey}
                CustomTooltip={CustomTooltip}
                EmptyState={EmptyState}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsPage
                financialData={financialData}
                formatCurrency={formatCurrency}
                setShowIncomeForm={setShowIncomeForm}
                setShowExpenseForm={setShowExpenseForm}
                startEditTransaction={startEditTransaction}
                setDeleteTransactionId={setDeleteTransactionId}
                darkMode={darkMode}
                themeClasses={themeClasses}
                EmptyState={EmptyState}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetsPage
                budgetsWithRealTimeTracking={budgetsWithRealTimeTracking}
                formatCurrency={formatCurrency}
                setShowBudgetForm={setShowBudgetForm}
                startEditBudget={startEditBudget}
                setDeleteBudgetId={setDeleteBudgetId}
                darkMode={darkMode}
                themeClasses={themeClasses}
                EmptyState={EmptyState}
              />

            )}
{/* Add the AccountsPage here */}
{activeTab === 'connect account' && (
  <AccountsPage
    darkMode={darkMode}
    themeClasses={themeClasses}
    session={session}
    showToast={showToast}
  />
)}

  {(activeTab === 'reports' || activeTab === 'analytics') && (
    <ComingSoonPage
      activeTab={activeTab}
      darkMode={darkMode}
      themeClasses={themeClasses}
    />
  )}

            {activeTab === 'settings' && (
              <SettingsPage
                userSettings={userSettings}
                setUserSettings={setUserSettings}
                currencies={currencies}
                languagesList={languagesList}
                darkMode={darkMode}
                themeClasses={themeClasses}
                handleSaveSettings={handleSaveSettings}
                handleExportData={handleExportData}
                handleBackupData={handleBackupData}
                setShowChangePasswordDialog={setShowChangePasswordDialog}
                setShowClearDataDialog={setShowClearDataDialog}
                setShowDeleteAccountDialog={setShowDeleteAccountDialog}
                setShowRestoreDialog={setShowRestoreDialog}
                setActiveTab={setActiveTab}
              />
            )}
          </main>
                            
          {/* Enhanced AI Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full shadow-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center z-40 hover:cursor-pointer border border-blue-500/30 backdrop-blur-sm hover:scale-110"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Enhanced Connection Modals */}
          <ReLoginModal />
          <ConnectionErrorModal />

          {/* MODALS SECTION */}
          
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
  confirmText="Delete Transaction"
  darkMode={darkMode}
  type="danger"
/>

{/* Delete Budget Confirmation Modal */}
<DeleteConfirmationModal
  isOpen={!!deleteBudgetId}
  onClose={() => setDeleteBudgetId(null)}
  onConfirm={() => deleteBudgetId && handleDeleteBudget(deleteBudgetId)}
  title="Delete Budget"
  description="Are you sure you want to delete this budget? This action cannot be undone."
  confirmText="Delete Budget"
  darkMode={darkMode}
  type="danger"
/>

{/* Clear Data Modal */}
<DeleteConfirmationModal
  isOpen={showClearDataDialog}
  onClose={() => setShowClearDataDialog(false)}
  onConfirm={handleClearData}
  title="Clear All Data"
  description="This will remove all transactions and budgets. This action cannot be undone and will reset your financial tracking completely."
  confirmText="Clear All Data"
  darkMode={darkMode}
  type="danger"
/>

{/* Delete Account Modal */}
<DeleteConfirmationModal
  isOpen={showDeleteAccountDialog}
  onClose={() => setShowDeleteAccountDialog(false)}
  onConfirm={handleDeleteAccount}
  title="Delete Account"
  description="This will permanently delete your account and all associated data. This action cannot be undone."
  confirmText="Delete Account"
  darkMode={darkMode}
  type="danger"
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

          {/* Enhanced AI Chat Modal with Fintech Suggestions */}
          <AIChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={sendMessage}
            darkMode={darkMode}
            suggestedQuestions={fintechSuggestedQuestions}
          />

          {/* Session Expired Modal */}
          <Dialog.Root open={showSessionExpiredModal} onOpenChange={setShowSessionExpiredModal}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
              <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl shadow-2xl z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                    <AlertTriangle className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </div>
                  
                  <Dialog.Title className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Session Expired
                  </Dialog.Title>
                  
                  <Dialog.Description className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your session has expired or is no longer valid. Please log in again to continue using Monietar.
                  </Dialog.Description>
                  
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowSessionExpiredModal(false)}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Cancel
                    </button>
                    
                    <Link 
                      href="/auth/signin" 
                      className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center"
                    >
                      Go to Sign In
                    </Link>
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