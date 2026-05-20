'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users,
  Activity,
  CreditCard,
  BarChart3,
  RefreshCw,
  Shield,
  MessageSquareText,
  Database,
  Flag,
  ListChecks,
  Menu,
  X
} from 'lucide-react';

interface Metrics {
  users: number;
  transactions: number;
  budgets: number;
  newUsers7d: number;
  newUsers30d: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string | null;
}

interface FeedbackItem {
  id: string;
  user_id: string | null;
  feedback_text: string;
  category: string | null;
  created_at: string;
}

interface BackupItem {
  id: string;
  user_id: string;
  backup_name: string | null;
  backup_date: string | null;
  file_size: number | null;
  created_at: string;
  user_name?: string | null;
  user_business?: string | null;
  user_email?: string | null;
}

interface AuditEvent {
  id: string;
  actor_email: string | null;
  action: string | null;
  metadata: any;
  created_at: string;
}

interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string | null;
  updated_at?: string | null;
}

type AdminSection = 'overview' | 'users' | 'support' | 'flags' | 'audit' | 'health';

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [query, setQuery] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const usersPageSize = 20;
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [healthHistory, setHealthHistory] = useState<
    { timestamp: string; status: 'healthy' | 'unhealthy' | 'checking' }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState<AdminSection>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchMetrics = async () => {
    const response = await fetch('/api/admin/metrics', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load metrics');
    setMetrics(data);
  };

  const fetchUsers = async (page = usersPage) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('limit', String(usersPageSize));
    params.set('offset', String((page - 1) * usersPageSize));

    const response = await fetch(`/api/admin/users?${params.toString()}`, {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load users');
    setUsers(data.users || []);
    setTotalUsers(data.total || 0);
  };

  const fetchFeedback = async () => {
    const response = await fetch('/api/admin/feedback', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load feedback');
    setFeedback(data.feedback || []);
  };

  const fetchBackups = async () => {
    const response = await fetch('/api/admin/backups', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load backups');
    setBackups(data.backups || []);
  };

  const fetchPlans = async () => {
    const response = await fetch('/api/admin/plans', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load plans');
    setPlanCounts(data.plans || {});
  };

  const fetchFlags = async () => {
    const response = await fetch('/api/admin/feature-flags', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load feature flags');
    setFlags(data.flags || []);
  };

  const fetchAudit = async () => {
    const response = await fetch('/api/admin/audit', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load audit log');
    setAuditEvents(data.events || []);
  };

  const fetchHealth = async () => {
    const response = await fetch('/api/health');
    const data = await response.json();
    if (response.ok) {
      setHealth(data);
      setHealthHistory((prev) => {
        const next = [
          ...prev,
          {
            timestamp: data.timestamp || new Date().toISOString(),
            status: data.status || 'checking'
          }
        ];
        return next.slice(-24);
      });
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchMetrics(),
          fetchUsers(),
          fetchFeedback(),
          fetchBackups(),
          fetchPlans(),
          fetchFlags(),
          fetchAudit(),
          fetchHealth()
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchHealth();
    }, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setUsersPage(1);
      await fetchUsers(1);
    } catch (err: any) {
      setError(err.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const cards = useMemo(() => {
    if (!metrics) return [];
    return [
      { label: 'Total Users', value: metrics.users, icon: Users },
      { label: 'New Users (7d)', value: metrics.newUsers7d, icon: Activity },
      { label: 'New Users (30d)', value: metrics.newUsers30d, icon: BarChart3 },
      { label: 'Transactions', value: metrics.transactions, icon: CreditCard },
      { label: 'Budgets', value: metrics.budgets, icon: Shield }
    ];
  }, [metrics]);

  const derived = useMemo(() => {
    if (!metrics || metrics.users === 0) {
      return { transactionsPerUser: 0, budgetsPerUser: 0 };
    }
    return {
      transactionsPerUser: Math.round(metrics.transactions / metrics.users),
      budgetsPerUser: Math.round(metrics.budgets / metrics.users)
    };
  }, [metrics]);

  const totalUserPages = Math.max(1, Math.ceil(totalUsers / usersPageSize));
  const healthPoints = useMemo(() => {
    if (healthHistory.length === 0) return '';
    const width = 240;
    const height = 60;
    const step = width / Math.max(1, healthHistory.length - 1);
    const valueForStatus = (status: 'healthy' | 'unhealthy' | 'checking') => {
      if (status === 'healthy') return 1;
      if (status === 'checking') return 0.5;
      return 0;
    };
    return healthHistory
      .map((entry, index) => {
        const value = valueForStatus(entry.status);
        const x = index * step;
        const y = height - value * (height - 8) - 4;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [healthHistory]);

  const navItems = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'support', label: 'Support', icon: MessageSquareText },
    { key: 'flags', label: 'Plans & Flags', icon: Flag },
    { key: 'audit', label: 'Audit Log', icon: ListChecks },
    { key: 'health', label: 'System Health', icon: Database }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
        <div className="fixed top-0 left-0 right-0 h-16 border-b border-gray-800 bg-gray-900 shadow-sm z-40 lg:left-64">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg lg:hidden text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Algoritic Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-200">
                {adminEmail}
              </span>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await Promise.all([fetchMetrics(), fetchUsers()]);
                  } catch (err: any) {
                    setError(err.message || 'Failed to refresh');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
          <div className="flex flex-col flex-grow bg-gray-950 text-gray-200 pt-6 pb-6 border-r border-gray-800">
            <div className="px-6 pb-6">
              <h2 className="text-lg font-semibold text-white">Algoritic Admin</h2>
              <p className="text-xs text-gray-400 mt-1">Monietar ops console</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = section === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setSection(item.key as AdminSection)}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl w-full transition-all ${
                      active
                        ? 'bg-emerald-900/30 text-white border-l-4 border-emerald-400'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </nav>
            <div className="px-4 pt-4">
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-900/20 p-3 text-xs text-emerald-200">
                Live admin access enabled. Activity tracked in audit logs.
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 30 }}
                className="fixed inset-y-0 left-0 w-72 bg-gray-900 text-white z-50 lg:hidden border-r border-gray-800"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                  <div>
                    <p className="text-sm font-semibold">Algoritic Admin</p>
                    <p className="text-xs text-gray-400">Monietar ops</p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = section === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setSection(item.key as AdminSection);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl w-full transition-all ${
                          active
                            ? 'bg-emerald-900/30 text-white border border-emerald-700'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="pt-20 lg:pl-64 px-4 lg:px-6 pb-12">
          <div className="max-w-6xl mx-auto space-y-6">
            {loading && (
              <div className="rounded-xl border border-gray-800 dark:border-gray-700 bg-gray-900/80 dark:bg-gray-900/80 p-4 text-sm text-gray-400 dark:text-gray-300">
                Loading admin dashboard...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-800 bg-red-900/40 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {section === 'overview' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {cards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <div
                              key={card.label}
                              className="rounded-xl border border-gray-800/80 bg-gray-900/90 p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{card.label}</p>
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200 flex items-center justify-center">
                                  <Icon className="w-4 h-4" />
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-white mt-3">{card.value}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                          <h2 className="text-lg font-semibold text-white">Platform Health</h2>
                          <p className="text-xs text-gray-400 mt-1">Core activity signals from user data.</p>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Transactions per user</span>
                              <span className="font-medium text-white">{derived.transactionsPerUser}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Budgets per user</span>
                              <span className="font-medium text-white">{derived.budgetsPerUser}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Growth (7d)</span>
                              <span className="font-medium text-emerald-300">+{metrics?.newUsers7d || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2 rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-lg font-semibold text-white">Plan Mix</h2>
                          </div>
                          <div className="mt-4 space-y-2 text-sm">
                            {Object.keys(planCounts).length === 0 && (
                              <p className="text-sm text-gray-400">No plan data available.</p>
                            )}
                            {Object.entries(planCounts).map(([plan, count]) => (
                              <div key={plan} className="flex items-center justify-between">
                                <span className="text-gray-400">{plan}</span>
                                <span className="font-medium text-white">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {section === 'users' && (
                    <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-white">Users</h2>
                          <p className="text-xs text-gray-400">
                            Showing {users.length} of {totalUsers}
                          </p>
                        </div>
                        <form onSubmit={handleSearch} className="flex gap-2">
                          <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search name, email, business"
                            className="px-3 py-2 border border-gray-800 rounded-lg text-sm w-64 bg-gray-900 text-white"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                          >
                            Search
                          </button>
                        </form>
                      </div>

                      <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-left text-gray-400">
                            <tr>
                              <th className="py-2">Name</th>
                              <th className="py-2">Email</th>
                              <th className="py-2">Business</th>
                              <th className="py-2">Joined</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-100">
                            {users.map((user) => (
                              <tr key={user.id} className="border-t border-gray-800">
                                <td className="py-3">{user.name || '-'}</td>
                                <td className="py-3">{user.email || '-'}</td>
                                <td className="py-3">{user.business_name || '-'}</td>
                                <td className="py-3">
                                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                </td>
                              </tr>
                            ))}
                            {users.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-6 text-center text-gray-400">
                                  No users found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-300">
                        <span>
                          Page {usersPage} of {totalUserPages}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={usersPage === 1 || loading}
                            onClick={async () => {
                              if (usersPage === 1) return;
                              try {
                                setLoading(true);
                                const nextPage = Math.max(1, usersPage - 1);
                                setUsersPage(nextPage);
                                await fetchUsers(nextPage);
                              } catch (err: any) {
                                setError(err.message || 'Failed to load users');
                              } finally {
                                setLoading(false);
                              }
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-800 text-gray-200 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            disabled={usersPage >= totalUserPages || loading}
                            onClick={async () => {
                              if (usersPage >= totalUserPages) return;
                              try {
                                setLoading(true);
                                const nextPage = Math.min(totalUserPages, usersPage + 1);
                                setUsersPage(nextPage);
                                await fetchUsers(nextPage);
                              } catch (err: any) {
                                setError(err.message || 'Failed to load users');
                              } finally {
                                setLoading(false);
                              }
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-800 text-gray-200 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {section === 'support' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2">
                          <MessageSquareText className="w-5 h-5 text-emerald-400" />
                          <h2 className="text-lg font-semibold text-white">Feedback Queue</h2>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                          {feedback.slice(0, 6).map((item) => (
                            <div key={item.id} className="rounded-lg border border-gray-800 p-3">
                              <p className="text-gray-100">{item.feedback_text}</p>
                              <div className="text-xs text-gray-400 mt-2">
                                {item.category || 'general'} - {new Date(item.created_at).toLocaleString()}
                              </div>
                            </div>
                          ))}
                          {feedback.length === 0 && (
                            <p className="text-sm text-gray-400">No feedback yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-emerald-400" />
                          <h2 className="text-lg font-semibold text-white">Recent Backups</h2>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                          {backups.slice(0, 6).map((item) => (
                            <div key={item.id} className="rounded-lg border border-gray-800 p-3">
                              <p className="text-gray-100">{item.backup_name || 'Backup'}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {item.user_name || item.user_business || item.user_email || 'Unknown user'}
                              </p>
                              <div className="text-xs text-gray-400 mt-2">
                                {new Date(item.created_at).toLocaleString()} - {(item.file_size || 0)} bytes
                              </div>
                            </div>
                          ))}
                          {backups.length === 0 && (
                            <p className="text-sm text-gray-400">No backups found.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {section === 'flags' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-emerald-400" />
                          <h2 className="text-lg font-semibold text-white">Plan Mix</h2>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                          {Object.keys(planCounts).length === 0 && (
                            <p className="text-sm text-gray-400">No plan data available.</p>
                          )}
                          {Object.entries(planCounts).map(([plan, count]) => (
                            <div key={plan} className="flex items-center justify-between">
                              <span className="text-gray-400">{plan}</span>
                              <span className="font-medium text-white">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2">
                          <Flag className="w-5 h-5 text-emerald-400" />
                          <h2 className="text-lg font-semibold text-white">Feature Flags</h2>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                          {flags.map((flag) => (
                            <div key={flag.key} className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-100">{flag.key}</p>
                                {flag.description && (
                                  <p className="text-xs text-gray-400">{flag.description}</p>
                                )}
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={!!flag.enabled}
                                  onChange={async (e) => {
                                    const enabled = e.target.checked;
                                    await fetch('/api/admin/feature-flags', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json', 'x-admin-email': adminEmail },
                                      body: JSON.stringify({ key: flag.key, enabled })
                                    });
                                    setFlags((prev) =>
                                      prev.map((item) => (item.key === flag.key ? { ...item, enabled } : item))
                                    );
                                  }}
                                />
                                <div className="w-11 h-6 rounded-full bg-gray-700">
                                  <div
                                    className={`h-5 w-5 rounded-full bg-gray-900 translate-y-0.5 transition-transform ${
                                      flag.enabled ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </div>
                              </label>
                            </div>
                          ))}
                          {flags.length === 0 && (
                            <p className="text-sm text-gray-400">No feature flags found.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {section === 'audit' && (
                    <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-semibold text-white">Audit Log</h2>
                      </div>
                      <div className="mt-4 space-y-3 text-sm">
                        {auditEvents.slice(0, 10).map((event) => (
                          <div key={event.id} className="rounded-lg border border-gray-800 p-3">
                            <p className="text-gray-100">{event.action || 'Event'}</p>
                            <div className="text-xs text-gray-400 mt-2">
                              {event.actor_email || 'system'} - {new Date(event.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                        {auditEvents.length === 0 && (
                          <p className="text-sm text-gray-400">No audit events.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {section === 'health' && (
                    <div className="rounded-2xl border border-gray-800/80 bg-gray-900/90 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-semibold text-white">System Health</h2>
                      </div>
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
                        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 shadow-sm">
                          <p className="text-xs text-gray-400">Trend (last {healthHistory.length} checks)</p>
                          <svg viewBox="0 0 240 60" className="mt-3 w-full h-16">
                            <polyline
                              points={healthPoints}
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                            <span>Unhealthy</span>
                            <span>Healthy</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 shadow-sm">
                            <p className="text-xs text-gray-400">Status</p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {health?.status ? health.status.toUpperCase() : 'UNKNOWN'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Region: {health?.region || 'N/A'}</p>
                          </div>
                          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 shadow-sm">
                            <p className="text-xs text-gray-400">AWS Config</p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {health?.awsConfigured ? 'Configured' : 'Not Configured'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Credentials: {health?.hasCredentials ? 'Present' : 'Missing'}
                            </p>
                          </div>
                          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 shadow-sm">
                            <p className="text-xs text-gray-400">Issues</p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {Array.isArray(health?.issues) ? health.issues.length : 0}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Open alerts</p>
                          </div>
                          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 shadow-sm">
                            <p className="text-xs text-gray-400">Free Models</p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {Array.isArray(health?.freeModels) ? health.freeModels.length : 0}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Available tiers</p>
                          </div>
                        </div>
                      </div>
                      {Array.isArray(health?.issues) && health.issues.length > 0 && (
                        <div className="mt-4 rounded-xl border border-amber-800/60 bg-amber-900/30 text-amber-200 p-4 text-sm">
                          <p className="font-medium">Issues detected</p>
                          <ul className="mt-2 space-y-1">
                            {health.issues.map((issue: string, index: number) => (
                              <li key={`${issue}-${index}`}>- {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
    </div>
  );
}
