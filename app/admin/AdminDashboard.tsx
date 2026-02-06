'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Activity, CreditCard, BarChart3, RefreshCw, Shield, MessageSquareText, Database, Flag, ListChecks } from 'lucide-react';

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

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    const response = await fetch('/api/admin/metrics', {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load metrics');
    setMetrics(data);
  };

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('limit', '20');
    params.set('offset', '0');

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
    if (response.ok) setHealth(data);
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

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await fetchUsers();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Algoritic Admin</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monietar platform overview and user management.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-4 text-sm text-gray-500">
            Loading admin dashboard...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-3">{card.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Health</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Core activity signals from user data.
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Transactions per user</span>
                    <span className="font-medium text-gray-900 dark:text-white">{derived.transactionsPerUser}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Budgets per user</span>
                    <span className="font-medium text-gray-900 dark:text-white">{derived.budgetsPerUser}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Growth (7d)</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-300">
                      +{metrics?.newUsers7d || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {users.length} of {totalUsers}
                    </p>
                  </div>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search name, email, business"
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
                    <thead className="text-left text-gray-500 dark:text-gray-400">
                      <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Business</th>
                        <th className="py-2">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-100">
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-gray-100 dark:border-gray-700/60">
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
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Feedback Queue</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {feedback.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-lg border border-gray-100 dark:border-gray-700/60 p-3">
                      <p className="text-gray-800 dark:text-gray-100">{item.feedback_text}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {item.category || 'general'} · {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {feedback.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No feedback yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Backups</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {backups.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-lg border border-gray-100 dark:border-gray-700/60 p-3">
                      <p className="text-gray-800 dark:text-gray-100">{item.backup_name || 'Backup'}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(item.created_at).toLocaleString()} · {(item.file_size || 0)} bytes
                      </div>
                    </div>
                  ))}
                  {backups.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No backups found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plan Mix</h2>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {Object.keys(planCounts).length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No plan data available.</p>
                  )}
                  {Object.entries(planCounts).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{plan}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Flags</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {flags.map((flag) => (
                    <div key={flag.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 dark:text-gray-100">{flag.key}</p>
                        {flag.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{flag.description}</p>
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
                        <div className="w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-5 w-5 rounded-full bg-white translate-y-0.5 transition-transform ${
                              flag.enabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                  {flags.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No feature flags found.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Log</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {auditEvents.slice(0, 6).map((event) => (
                    <div key={event.id} className="rounded-lg border border-gray-100 dark:border-gray-700/60 p-3">
                      <p className="text-gray-800 dark:text-gray-100">{event.action || 'Event'}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {event.actor_email || 'system'} · {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {auditEvents.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No audit events.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h2>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                {health ? (
                  <pre className="whitespace-pre-wrap text-xs bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                    {JSON.stringify(health, null, 2)}
                  </pre>
                ) : (
                  <p>No health data available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
