'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import MonoConnect from '../MonoConnect';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Account {
  id: string;
  mono_account_id: string;
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
  session: any;
  showToast: (message: string) => void;
}

export default function AccountsPage({ darkMode, themeClasses, session, showToast }: AccountsPageProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);
  const [showMonoConnect, setShowMonoConnect] = useState(false);
  const [syncingAccounts, setSyncingAccounts] = useState<string[]>([]);

  // Fetch connected accounts
  const fetchConnectedAccounts = async () => {
    if (!session) {
      setConnectedAccounts([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('user_id', session.user.id)
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
    if (session) {
      fetchConnectedAccounts();
    } else {
      setConnectedAccounts([]);
    }
  }, [session]);

  // Handle Mono connection success
  const handleMonoSuccess = async (authCode: string) => {
    if (!session) return;

    try {
      const response = await fetch('/api/mono/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode,
          userId: session.user.id,
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
          userId: session.user.id,
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
          userId: session.user.id 
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

  return (
    <div className="space-y-6">
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
        
        <button
          onClick={() => setShowMonoConnect(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer border border-emerald-500"
        >
          <CreditCard className="w-5 h-5" />
          <span>Connect Bank Account</span>
        </button>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {connectedAccounts.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${themeClasses.border}`}>
            <CreditCard className={`w-16 h-16 mx-auto mb-4 ${themeClasses.text.muted}`} />
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              No bank accounts connected
            </h3>
            <p className={`mb-6 max-w-sm mx-auto ${themeClasses.text.secondary}`}>
              Connect your bank account to automatically import transactions and track your finances in real-time.
            </p>
            <button
              onClick={() => setShowMonoConnect(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:cursor-pointer"
            >
              <CreditCard className="w-5 h-5" />
              <span>Connect Your First Account</span>
            </button>
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

      {/* Features Section */}
      {connectedAccounts.length === 0 && (
        <div className={`mt-8 p-6 rounded-2xl ${themeClasses.card}`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Why Connect Your Bank Account?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Real-time Sync</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Automatically import transactions as they happen
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Accurate Tracking</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Never miss a transaction with automatic categorization
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Smart Alerts</h4>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                Get notified about unusual spending and budget limits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mono Connect Widget */}
      {showMonoConnect && (
        <MonoConnect
          onSuccess={handleMonoSuccess}
          onClose={() => setShowMonoConnect(false)}
          onEvent={(event: any) => {
            console.log('Mono event:', event);
            if (event.type === 'OPENED') {
              showToast('Connecting to your bank...');
            }
          }}
        />
      )}
    </div>
  );
}