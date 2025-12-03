// app/dashboard/DashboardClient.tsx
'use client';

import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Sun, Moon, MessageCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { Sidebar } from './Sidebar';
import { TokenStatus } from './components/TokenStatus';
import { OverviewPage } from './components/pages/OverviewPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { BudgetsPage } from './components/pages/BudgetsPage';
import AccountsPage from './components/pages/AccountsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { ComingSoonPage } from './components/pages/ComingSoonPage';
import { AIChatModal } from './components/modals/AIChatModal';
import { TokenModal } from './components/modals/TokenModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { EditTransactionModal } from './components/modals/EditTransactionModal';
import { DeleteConfirmationModal } from './components/modals/DeleteConfirmationModal';
import { AddBudgetModal } from './components/modals/AddBudgetModal';
import { EditBudgetModal } from './components/modals/EditBudgetModal';

import type { EnhancedBudget } from '@/app/dashboard/types';
import { supabase } from '@/utils/supabase/client';

// Only allowed periods in your UI (as per AddBudgetModal & EditBudgetModal)
type AllowedPeriodDisplay = 'Monthly' | 'Yearly' | 'Quarterly';

// Convert DB lowercase → Display (Capitalized)
const toDisplayPeriod = (period: string): AllowedPeriodDisplay => {
  const map: Record<string, AllowedPeriodDisplay> = {
    monthly: 'Monthly',
    yearly: 'Yearly',
    quarterly: 'Quarterly'
  };
  return map[period.toLowerCase()] || 'Monthly';
};

// Convert Display → DB lowercase
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

  // Modal states
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false);

  const [transactionFormData, setTransactionFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  // Form data now matches EXACTLY what AddBudgetModal expects
  const [budgetFormData, setBudgetFormData] = useState<{
    category: string;
    budget_limit: string;
    period: AllowedPeriodDisplay;
  }>({
    category: '',
    budget_limit: '',
    period: 'Monthly'
  });

  const [editBudgetFormData, setEditBudgetFormData] = useState<{
    category: string;
    budget_limit: string;
    period: AllowedPeriodDisplay;
  }>({
    category: '',
    budget_limit: '',
    period: 'Monthly'
  });

  const [editFormData, setEditFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editingBudget, setEditingBudget] = useState<EnhancedBudget | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState<UserInfo>({
    name: 'User',
    email: '',
    businessName: 'My Business',
    avatar: '/api/placeholder/40/40',
    plan: 'Free Plan',
    joinedDate: new Date().toISOString().split('T')[0]
  });

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

  // Real-time enhanced budgets
  const budgetsWithRealTimeTracking: EnhancedBudget[] = useMemo(() => {
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
        user_id: budget.user_id || session.user.id || '',
        type: 'expense'
      };
    });
  }, [financialData.budgets, financialData.transactions, session?.user?.id]);

  const formatCurrency = (amount: number): string => {
    if (!showBalance && amount !== 0) return '••••••';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const loadData = async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      const [{ data: txs }, { data: budgets }] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', session.user.id)
      ]);

      const transactions = txs || [];
      const income = transactions.filter(t => t.type === 'income').reduce((a: number, t: any) => a + (Number(t.amount) || 0), 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((a: number, t: any) => a + (Number(t.amount) || 0), 0);

      setFinancialData({
        income,
        expenses,
        profit: income - expenses,
        transactions,
        budgets: budgets || [],
        alerts: [],
        aiRecommendations: transactions.length > 3
          ? ['Great saving this month!', 'Consider reducing food spending']
          : ['Start adding transactions to unlock AI insights'],
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
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  // Transaction handlers
  const handleSubmitTransaction = async () => {
    if (!session?.user) return toast.error('Please sign in');
    setIsSubmitting(true);
    try {
      const type = showIncomeForm ? 'income' : 'expense';
      const { error } = await supabase.from('transactions').insert([{
        amount: parseFloat(transactionFormData.amount),
        category: transactionFormData.category,
        description: transactionFormData.description,
        date: transactionFormData.date || new Date().toISOString().split('T')[0],
        type,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

      if (error) throw error;
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added!`);
      setTransactionFormData({ amount: '', category: '', description: '', date: '' });
      setShowIncomeForm(false);
      setShowExpenseForm(false);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setEditFormData({
      amount: transaction.amount.toString(),
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
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: parseFloat(editFormData.amount),
          category: editFormData.category,
          description: editFormData.description,
          date: editFormData.date,
          updated_at: new Date().toISOString()
        })
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

  // Budget handlers
 const handleSubmitBudget = async () => {
  if (!session?.user?.id) {
    toast.error('Not authenticated');
    return;
  }

  const userId = session.user.id;
  console.log('Inserting budget with user_id:', userId); // ← CHECK THIS IN CONSOLE

  setIsSubmitting(true);
  try {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        category: budgetFormData.category,
        budget_limit: parseFloat(budgetFormData.budget_limit) || 0,
        period: toDbPeriod(budgetFormData.period),
        user_id: userId, // ← this is the raw UUID, never modified
      })
      .select(); // ← add .select() to see what was inserted

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Budget created successfully:', data);
    toast.success('Budget created!');
    setBudgetFormData({ category: '', budget_limit: '', period: 'Monthly' });
    setShowBudgetForm(false);
    await loadData();
  } catch (error: any) {
    toast.error(
      error.message.includes('foreign key')
        ? 'Auth mismatch — log out and log in again'
        : error.message
    );
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
      toast.success('Budget updated successfully!');
      setShowEditBudgetModal(false);
      setEditingBudget(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fixed: Correct React.Dispatch type
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/signin';
  };

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
        isMobileMenuOpen={false}
        setIsMobileMenuOpen={() => {}}
        currency="NGN"
        setCurrency={() => {}}
        language="en"
        setLanguage={() => {}}
        currencies={[]}
        languagesList={[]}
        realTimeAlerts={[]}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-gray-900/90 backdrop-blur border-b border-gray-800 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 h-16">
            <TokenStatus
              tokenStatus={{ tokensRemaining: 5, totalTokens: 10, resetTime: new Date(), percentage: 50 }}
              darkMode={darkMode}
              onUpgradeClick={() => setShowTokenModal(true)}
            />
            <button onClick={() => setDarkMode(d => !d)} className="p-2 rounded-lg hover:bg-gray-800 transition">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
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
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsPage
              budgetsWithRealTimeTracking={budgetsWithRealTimeTracking}
              formatCurrency={formatCurrency}
              setShowBudgetForm={() => setShowBudgetForm(true)}
              startEditBudget={handleStartEditBudget}
              setDeleteBudgetId={handleStartDeleteBudget}
              editingBudget={editingBudget as any}  // Safe: EnhancedBudget has all Budget fields
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
              userSettings={{}}
              setUserSettings={() => {}}
              handleSaveSettings={async () => {}}
              handleExportData={() => {}}
              handleChangePassword={() => {}}
              handleDeleteAccount={() => {}}
              themeClasses={themeClasses}
              darkMode={darkMode}
              currency="NGN"
              setCurrency={() => {}}
              language="en"
              setLanguage={() => {}}
              setShowChangePasswordDialog={() => {}}
              setShowClearDataDialog={() => {}}
              setShowDeleteAccountDialog={() => {}}
              setShowRestoreDialog={() => {}}
              setShowExportDialog={() => {}}
              setShowImportDialog={() => {}}
              setShowLanguageDialog={() => {}}
              setShowCurrencyDialog={() => {}}
              handleBackupData={() => toast.success('Backup started')}
              setActiveTab={setActiveTab}
              languagesList={[]}
              currencies={[]}
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
      />

      <EditBudgetModal
        isOpen={showEditBudgetModal}
        onClose={() => { setShowEditBudgetModal(false); setEditingBudget(null); }}
        budget={editingBudget as any}  // Safe cast: has all required fields
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

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={[]}
        newMessage=""
        onNewMessageChange={() => {}}
        onSendMessage={() => {}}
        darkMode={darkMode}
        suggestedQuestions={[]}
        aiStatus="standard"
        usePremium={false}
        onTogglePremium={() => setShowTokenModal(true)}
        tokensRemaining={5}
      />

      <TokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        tokenStatus={{ tokensRemaining: 5, totalTokens: 10, resetTime: new Date() }}
        darkMode={darkMode}
      />
    </div>
  );
}