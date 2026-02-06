'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import MonoConnect from '../MonoConnect';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Account {
  id: string;
  mono_account_id: string;
  mono_display_id?: string | null;
  institution: string;
  status: 'active' | 'error' | 'reconnecting';
  connected_at: string;
  last_sync: string | null;
  account_name: string | null;
  account_number: string | null;
  balance: number | null;
}

interface AccountsPageProps {
  darkMode: boolean;
  themeClasses: any;
  user: any;
  showToast: (message: string) => void;
}

export default function AccountsPage({ darkMode, themeClasses, user, showToast }: AccountsPageProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);
  const [showMonoConnect, setShowMonoConnect] = useState(false);
  const [syncingAccounts, setSyncingAccounts] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  // Fetch connected accounts
  const fetchConnectedAccounts = async () => {
    if (!user?.id) {
      setConnectedAccounts([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false });

      if (error) throw error;
      setConnectedAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showToast('Error loading connected accounts');
      setConnectedAccounts([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnectedAccounts();
    } else {
      setConnectedAccounts([]);
    }
  }, [user]);

  // Handle Mono connection success
  const handleMonoSuccess = async (authCode: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/mono/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode,
          userId: user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast('Bank account connected successfully!');
        setShowMonoConnect(false);
        await fetchConnectedAccounts();
        
        // Trigger initial sync
        if (result.accountId) {
          await syncAccountTransactions(result.accountId);
        }
      } else {
        showToast(result.error || 'Failed to connect bank account');
      }
    } catch (error) {
      console.error('Mono connection error:', error);
      showToast('Error connecting bank account');
    }
  };

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const cols = line.split(',').map(c => c.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = cols[i] || ''; });
      return row;
    });
  };

  const normalizeAmount = (value: string) => {
    const num = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  const mapToTransaction = (row: Record<string, any>) => {
    const amount = normalizeAmount(row.amount || row.amt || row.value || '');
    const type = (row.type || row.transaction_type || row.kind || '').toLowerCase() === 'income' || amount > 0 ? 'income' : 'expense';
    const date = row.date || row.transaction_date || row.created_at || new Date().toISOString().split('T')[0];
    const description = row.description || row.narration || row.memo || 'Imported transaction';
    const category = row.category || 'Imported';

    return {
      amount: Math.abs(amount),
      category,
      description,
      date,
      type
    };
  };

  const handleImportFile = async (file: File) => {
    if (!user?.id) {
      showToast('Please sign in to import');
      return;
    }

    setImportError('');
    setIsImporting(true);

    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        showToast('PDF import is coming soon. Please use CSV or JSON for now.');
        setIsImporting(false);
        return;
      }

      const text = await file.text();
      let rows: Record<string, any>[] = [];

      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        rows = Array.isArray(parsed) ? parsed : parsed?.transactions || [];
      } else {
        rows = parseCsv(text);
      }

      if (rows.length === 0) {
        showToast('No transactions found in file');
        setIsImporting(false);
        return;
      }

      const transactions = rows.map(mapToTransaction).map((tx) => ({
        ...tx,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase.from('transactions').insert(transactions);
      if (error) throw error;

      showToast(`Imported ${transactions.length} transactions`);
    } catch (error: any) {
      console.error('Import error:', error);
      setImportError(error?.message || 'Failed to import file');
      showToast('Failed to import file');
    } finally {
      setIsImporting(false);
    }
  };

  // Sync account transactions
  const syncAccountTransactions = async (accountId: string) => {
    setSyncingAccounts(prev => [...prev, accountId]);
    
    try {
      const response = await fetch('/api/mono/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          userId: user.id,
        }),
      });

      if (response.ok) {
        showToast('Account synced successfully!');
        await fetchConnectedAccounts();
      } else {
        showToast('Failed to sync account');
      }
    } catch (error) {
      console.error('Sync error:', error);
      showToast('Error syncing account');
    } finally {
      setSyncingAccounts(prev => prev.filter(id => id !== accountId));
    }
  };

  // Disconnect account
  const handleDisconnectAccount = async (accountId: string, monoAccountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account? This will stop automatic transaction updates.')) {
      return;
    }

    try {
      const response = await fetch('/api/mono/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          accountId,
          monoAccountId,
          userId: user.id 
        }),
      });

      if (response.ok) {
        showToast('Account disconnected successfully');
        setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
      } else {
        showToast('Failed to disconnect account');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      showToast('Error disconnecting account');
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case 'reconnecting':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'reconnecting':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const UploadButton = (
    <label
      className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
        isImporting
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
      }`}
    >
      {isImporting ? 'Importing…' : 'Upload File'}
      <input
        type="file"
        accept=".csv,.json,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
        }}
        className="hidden"
        disabled={isImporting}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border-2 p-4 ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
        <p className={`${themeClasses.text.primary} text-sm font-medium`}>
          Manual mode active — connect bank coming soon. Import transactions via CSV/JSON below.
        </p>
      </div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
            Bank Accounts
          </h1>
          <p className={`mt-2 ${themeClasses.text.secondary}`}>
            Connect your bank accounts to automatically track transactions
          </p>
        </div>
        {UploadButton}
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {connectedAccounts.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${themeClasses.border}`}>
            <CreditCard className={`w-16 h-16 mx-auto mb-4 ${themeClasses.text.muted}`} />
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              No transactions imported yet
            </h3>
            <p className={`mb-6 max-w-sm mx-auto ${themeClasses.text.secondary}`}>
              Upload a CSV/JSON/PDF to add your transactions.
            </p>
            {UploadButton}
          </div>
        ) : (
          <div className="grid gap-4">
            {connectedAccounts.map((account) => (
              <div
                key={account.id}
                className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.cardHover}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    
                    <div>
                      <h3 className={`font-semibold ${themeClasses.text.primary}`}>
                        {account.account_name || account.institution || 'Bank Account'}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(account.status)}
                          <span className={getStatusBadge(account.status)}>
                            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                          </span>
                        </div>
                        
                        {account.account_number && (
                          <span className={`text-sm ${themeClasses.text.muted}`}>
                            ••••{account.account_number.slice(-4)}
                          </span>
                        )}
                        
                        {account.balance !== null && (
                          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                            Balance: {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN'
                            }).format(account.balance)}
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm ${themeClasses.text.muted} mt-1`}>
                        Connected {new Date(account.connected_at).toLocaleDateString()}
                        {account.last_sync && ` • Last synced ${new Date(account.last_sync).toLocaleDateString()}`}
                      </p>
                      {account.mono_display_id && (
                        <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                          Mono ID: {account.mono_display_id}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => syncAccountTransactions(account.mono_account_id)}
                      disabled={syncingAccounts.includes(account.mono_account_id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 ${syncingAccounts.includes(account.mono_account_id) ? 'animate-spin' : ''}`} />
                      <span>Sync</span>
                    </button>

                    <button
                      onClick={() => handleDisconnectAccount(account.id, account.mono_account_id)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>

                {/* Sync Progress */}
                {syncingAccounts.includes(account.mono_account_id) && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Syncing transactions...</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Mode Details */}
      {connectedAccounts.length === 0 && (
        <div className={`mt-8 p-6 rounded-2xl ${themeClasses.card}`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Manual Import (Active)
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>CSV / JSON / PDF</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Import transactions from files you already have.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Quick Setup</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                No bank linking required to get started.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Bank Sync Pro</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Auto-connect is a Pro feature (coming soon).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mono Connect Widget */}
      {showMonoConnect && null}
    </div>
  );
}
