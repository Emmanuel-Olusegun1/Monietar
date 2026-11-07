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
  FileText,
  BookOpen,
  Plus,
  Save,
  Trash2,
  Menu,
  X
} from 'lucide-react';

interface Metrics {
  users: number;
  businesses: number;
  activeBusinesses: number;
  transactions: number;
  budgets: number;
  accounts: number;
  bankConnections: number;
  activeBankConnections: number;
  sales: number;
  products: number;
  cashVaults: number;
  contactMessages: number;
  waitlist: number;
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

interface JournalPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

type AdminSection =
  | 'overview'
  | 'users'
  | 'usage'
  | 'banking'
  | 'journal'
  | 'support'
  | 'flags'
  | 'audit'
  | 'health';

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
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  const [journalForm, setJournalForm] = useState({
    title: '',
    slug: '',
    category: 'Business finance',
    excerpt: '',
    content: '',
    published: false,
  });
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
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

  const fetchJournalPosts = async () => {
    const response = await fetch('/api/admin/journal', {
      headers: { 'x-admin-email': adminEmail },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load journal posts');
    setJournalPosts(data.posts || []);
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
          fetchJournalPosts(),
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
      { label: 'Users', value: metrics.users, icon: Users },
      { label: 'Active businesses', value: metrics.activeBusinesses, icon: Activity },
      { label: 'Transactions', value: metrics.transactions, icon: CreditCard },
      { label: 'Connected banks', value: metrics.activeBankConnections, icon: Shield }
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
    { key: 'usage', label: 'Product usage', icon: BarChart3 },
    { key: 'banking', label: 'Banking operations', icon: CreditCard },
    { key: 'journal', label: 'Journal', icon: FileText },
    { key: 'support', label: 'Support', icon: MessageSquareText },
    { key: 'flags', label: 'Plans & Flags', icon: Flag },
    { key: 'audit', label: 'Audit Log', icon: ListChecks },
    { key: 'health', label: 'System Health', icon: Database }
  ] as const;

  const resetJournalForm = () => {
    setEditingJournalId(null);
    setJournalForm({
      title: '',
      slug: '',
      category: 'Business finance',
      excerpt: '',
      content: '',
      published: false,
    });
  };

  const saveJournalPost = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/admin/journal', {
        method: editingJournalId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({
          ...journalForm,
          id: editingJournalId || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save journal post');
      await fetchJournalPosts();
      resetJournalForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save journal post');
    } finally {
      setLoading(false);
    }
  };

  const editJournalPost = (post: JournalPost) => {
    setEditingJournalId(post.id);
    setJournalForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
    });
  };

  const deleteJournalPost = async (id: string) => {
    if (!window.confirm('Delete this journal post?')) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/journal?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': adminEmail },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete journal post');
      setJournalPosts((posts) => posts.filter((post) => post.id !== id));
      if (editingJournalId === id) resetJournalForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete journal post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900">
        <div className="fixed left-0 right-0 top-0 z-40 h-[72px] border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur lg:left-64">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden lg:block">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Monietar / Admin
                </p>
                <h1 className="mt-1 text-lg font-bold tracking-[-0.03em] text-gray-900">
                  {navItems.find((item) => item.key === section)?.label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden border border-gray-200 bg-gray-50 px-3 py-2 text-[10px] font-medium text-gray-500 sm:inline-block">
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
                className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-emerald-900"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
          <div className="flex flex-grow flex-col border-r border-gray-200 bg-white pb-6 pt-7 text-gray-700">
            <div className="border-b border-gray-200 px-6 pb-7">
              <p className="text-xl font-bold tracking-[-0.05em] text-gray-900">monietar</p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">Admin workspace</p>
            </div>
            <nav className="flex-1 space-y-1 px-3 pt-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = section === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setSection(item.key as AdminSection)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? 'border-l-2 border-emerald-900 bg-emerald-50 text-emerald-950'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </nav>
            <div className="px-4 pt-4">
              <div className="border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
                <span className="font-semibold">Live workspace.</span> Activity is tracked in audit logs.
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
                className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white text-gray-900 lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                  <div>
                    <p className="text-lg font-bold tracking-[-0.04em]">monietar</p>
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">Admin workspace</p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="mt-6 space-y-1 px-4">
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
                        className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                          active
                            ? 'border-l-2 border-emerald-900 bg-emerald-50 text-emerald-950'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3 h-4 w-4" />
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

        <main className="px-4 pb-16 pt-28 sm:px-8 lg:pl-72 lg:pt-32">
          <div className="mx-auto max-w-[1320px] space-y-10">
            {loading && (
              <div className="border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm">
                Loading admin dashboard...
              </div>
            )}

            {!loading && error && (
              <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
                  className="space-y-10"
                >
                  {section === 'overview' && (
                    <>
                      <div className="border-b border-gray-200 pb-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                          Platform pulse
                        </p>
                        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                          <div>
                            <h2 className="text-3xl font-bold leading-none tracking-[-0.05em] text-gray-900 sm:text-4xl">
                              Your business at a glance.
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                              A live view of the people, businesses, financial activity, and product systems using Monietar.
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                            <span className="h-2 w-2 bg-emerald-600" />
                            Live data
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <div
                              key={card.label}
                              className="border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{card.label}</p>
                                <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-emerald-900">
                                  <Icon className="h-4 w-4" />
                                </div>
                              </div>
                              <p className="mt-3 text-2xl font-semibold text-gray-900">{card.value}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                          <h2 className="text-lg font-semibold text-gray-900">Platform Health</h2>
                          <p className="mt-1 text-xs text-gray-400">Core activity signals from user data.</p>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Transactions per user</span>
                              <span className="font-medium text-gray-900">{derived.transactionsPerUser}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Budgets per user</span>
                              <span className="font-medium text-gray-900">{derived.budgetsPerUser}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Growth (7d)</span>
                              <span className="font-medium text-emerald-900">+{metrics?.newUsers7d || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Businesses / user</span>
                              <span className="font-medium text-gray-900">
                                {metrics && metrics.users > 0
                                  ? (metrics.businesses / metrics.users).toFixed(1)
                                  : '0.0'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-emerald-900" />
                            <h2 className="text-lg font-semibold text-gray-900">Business activity</h2>
                          </div>
                          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 text-sm sm:grid-cols-4">
                            {[
                              ['Accounts', metrics?.accounts || 0],
                              ['Sales', metrics?.sales || 0],
                              ['Products', metrics?.products || 0],
                              ['Cash vaults', metrics?.cashVaults || 0],
                              ['Bank links', metrics?.bankConnections || 0],
                              ['Active links', metrics?.activeBankConnections || 0],
                              ['Contact messages', metrics?.contactMessages || 0],
                              ['Waitlist', metrics?.waitlist || 0],
                            ].map(([label, value]) => (
                              <div key={label as string} className="border-l border-gray-200 pl-3">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">{label}</p>
                                <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="border border-gray-200 bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">Audience growth</p>
                              <h2 className="mt-2 text-xl font-semibold text-gray-900">New users</h2>
                            </div>
                            <Users className="h-5 w-5 text-emerald-900" />
                          </div>
                          <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="bg-[#f7f7f7] p-4">
                              <p className="text-xs text-gray-400">Last 7 days</p>
                              <p className="mt-2 text-2xl font-semibold text-gray-900">{metrics?.newUsers7d || 0}</p>
                            </div>
                            <div className="bg-[#f7f7f7] p-4">
                              <p className="text-xs text-gray-400">Last 30 days</p>
                              <p className="mt-2 text-2xl font-semibold text-gray-900">{metrics?.newUsers30d || 0}</p>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">Plans</p>
                              <h2 className="mt-2 text-xl font-semibold text-gray-900">Plan mix</h2>
                            </div>
                            <Shield className="h-5 w-5 text-emerald-900" />
                          </div>
                          <div className="mt-5 space-y-3 text-sm">
                            {Object.keys(planCounts).length === 0 && (
                              <p className="text-gray-400">No plan data available.</p>
                            )}
                            {Object.entries(planCounts).map(([plan, count]) => (
                              <div key={plan} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                <span className="text-gray-500">{plan}</span>
                                <span className="font-medium text-gray-900">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {section === 'users' && (
                    <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                          <p className="text-xs text-gray-400">
                            Showing {users.length} of {totalUsers}
                          </p>
                        </div>
                        <form onSubmit={handleSearch} className="flex gap-2">
                          <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search name, email, business"
                            className="w-64 border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-700"
                          />
                          <button
                            type="submit"
                            className="bg-gray-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-emerald-900"
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
                              <tr key={user.id} className="border-t border-gray-200">
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
                            className="border border-gray-300 px-3 py-2 text-gray-600 disabled:opacity-50"
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
                            className="border border-gray-300 px-3 py-2 text-gray-600 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {section === 'usage' && (
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                          Product usage
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-gray-900">
                          Is Monietar helping businesses do more?
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                          Track the core workflows merchants use across finance,
                          sales, inventory, and cash management.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          ['Transactions recorded', metrics?.transactions || 0, 'Financial activity'],
                          ['Sales recorded', metrics?.sales || 0, 'Commerce activity'],
                          ['Products catalogued', metrics?.products || 0, 'Inventory activity'],
                          ['Accounts created', metrics?.accounts || 0, 'Financial accounts'],
                          ['Budgets created', metrics?.budgets || 0, 'Planning activity'],
                          ['Cash vaults', metrics?.cashVaults || 0, 'Cash management'],
                        ].map(([label, value, description]) => (
                          <div key={label as string} className="border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">{description}</p>
                            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gray-900">{value}</p>
                            <p className="mt-2 text-sm text-gray-500">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section === 'banking' && (
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                          Banking operations
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-gray-900">
                          Connected finance, at a glance.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                          Monitor bank adoption and the financial infrastructure
                          merchants have connected to Monietar.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                          ['Active connections', metrics?.activeBankConnections || 0],
                          ['All connections', metrics?.bankConnections || 0],
                          ['Accounts', metrics?.accounts || 0],
                        ].map(([label, value]) => (
                          <div key={label as string} className="border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">{label}</p>
                            <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-emerald-900" />
                          <h3 className="text-lg font-semibold text-gray-900">Connection health</h3>
                        </div>
                        <div className="mt-5 h-3 overflow-hidden bg-gray-100">
                          <div
                            className="h-full bg-emerald-700"
                            style={{
                              width: `${metrics && metrics.bankConnections > 0
                                ? Math.min(100, (metrics.activeBankConnections / metrics.bankConnections) * 100)
                                : 0}%`,
                            }}
                          />
                        </div>
                        <p className="mt-3 text-sm text-gray-500">
                          {metrics && metrics.bankConnections > 0
                            ? `${Math.round((metrics.activeBankConnections / metrics.bankConnections) * 100)}% of saved connections are active.`
                            : 'No bank connections have been recorded yet.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {section === 'journal' && (
                    <div className="space-y-8">
                      <div className="border-b border-gray-200 pb-7">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                          Content studio
                        </p>
                        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                          <div>
                            <h2 className="text-3xl font-bold tracking-[-0.05em] text-gray-900 sm:text-4xl">
                              Write for the Journal.
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                              Create useful, practical stories for the businesses
                              using Monietar. Save drafts while you work or publish
                              when the article is ready.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={resetJournalForm}
                            className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            New post
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                        <form onSubmit={saveJournalPost} className="border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                          <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
                            <FileText className="h-5 w-5 text-emerald-900" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {editingJournalId ? 'Edit journal post' : 'New journal post'}
                              </h3>
                              <p className="mt-1 text-xs text-gray-400">
                                Markdown-style plain text is supported in the article body.
                              </p>
                            </div>
                          </div>

                          <div className="mt-7 space-y-5">
                            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                              Title
                              <input
                                value={journalForm.title}
                                onChange={(event) => setJournalForm((form) => ({ ...form, title: event.target.value }))}
                                placeholder="Stop guessing where your money is going."
                                className="mt-2 w-full border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-700"
                                required
                              />
                            </label>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                                URL slug
                                <input
                                  value={journalForm.slug}
                                  onChange={(event) => setJournalForm((form) => ({ ...form, slug: event.target.value }))}
                                  placeholder="financial-visibility"
                                  className="mt-2 w-full border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-700"
                                  required
                                />
                              </label>
                              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                                Category
                                <input
                                  value={journalForm.category}
                                  onChange={(event) => setJournalForm((form) => ({ ...form, category: event.target.value }))}
                                  className="mt-2 w-full border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-700"
                                />
                              </label>
                            </div>

                            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                              Excerpt
                              <textarea
                                value={journalForm.excerpt}
                                onChange={(event) => setJournalForm((form) => ({ ...form, excerpt: event.target.value }))}
                                placeholder="A short introduction for the journal listing."
                                rows={3}
                                className="mt-2 w-full resize-y border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm leading-6 text-gray-900 outline-none focus:border-emerald-700"
                              />
                            </label>

                            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                              Article body
                              <textarea
                                value={journalForm.content}
                                onChange={(event) => setJournalForm((form) => ({ ...form, content: event.target.value }))}
                                placeholder="Write the full journal article here..."
                                rows={16}
                                className="mt-2 w-full resize-y border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm leading-7 text-gray-900 outline-none focus:border-emerald-700"
                                required
                              />
                            </label>

                            <label className="flex cursor-pointer items-center gap-3 border border-gray-200 bg-[#fafafa] p-4 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={journalForm.published}
                                onChange={(event) => setJournalForm((form) => ({ ...form, published: event.target.checked }))}
                                className="h-4 w-4 accent-emerald-700"
                              />
                              Publish this post on the public Journal page
                            </label>

                            <div className="flex flex-wrap gap-3 pt-2">
                              <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-emerald-900"
                              >
                                <Save className="h-3.5 w-3.5" />
                                {editingJournalId ? 'Save changes' : 'Save post'}
                              </button>
                              {editingJournalId && (
                                <button
                                  type="button"
                                  onClick={resetJournalForm}
                                  className="border border-gray-300 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600 hover:border-gray-900 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </form>

                        <aside className="border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                          <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">Library</p>
                              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                                {journalPosts.length} {journalPosts.length === 1 ? 'post' : 'posts'}
                              </h3>
                            </div>
                            <BookOpen className="h-5 w-5 text-emerald-900" />
                          </div>
                          <div className="mt-5 space-y-3">
                            {journalPosts.map((post) => (
                              <div key={post.id} className="border border-gray-200 bg-[#fafafa] p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold leading-5 text-gray-900">{post.title}</p>
                                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">{post.category}</p>
                                  </div>
                                  <span className={`shrink-0 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${post.published ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-200 text-gray-600'}`}>
                                    {post.published ? 'Live' : 'Draft'}
                                  </span>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                  <button type="button" onClick={() => editJournalPost(post)} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-900 hover:text-gray-900">
                                    Edit
                                  </button>
                                  <button type="button" onClick={() => deleteJournalPost(post.id)} className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-600 hover:text-red-800">
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                            {journalPosts.length === 0 && (
                              <div className="border border-dashed border-gray-300 p-6 text-center">
                                <p className="text-sm text-gray-500">No journal posts yet.</p>
                                <p className="mt-2 text-xs leading-5 text-gray-400">Your first post will appear here after you save it.</p>
                              </div>
                            )}
                          </div>
                        </aside>
                      </div>
                    </div>
                  )}

                  {section === 'support' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <MessageSquareText className="h-5 w-5 text-emerald-900" />
                          <h2 className="text-lg font-semibold text-gray-900">Feedback Queue</h2>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                          {feedback.slice(0, 6).map((item) => (
                            <div key={item.id} className="border border-gray-200 bg-[#fafafa] p-3">
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

                      <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-emerald-900" />
                          <h2 className="text-lg font-semibold text-gray-900">Recent Backups</h2>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                          {backups.slice(0, 6).map((item) => (
                            <div key={item.id} className="border border-gray-200 bg-[#fafafa] p-3">
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
                      <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-emerald-900" />
                          <h2 className="text-lg font-semibold text-gray-900">Plan Mix</h2>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                          {Object.keys(planCounts).length === 0 && (
                            <p className="text-sm text-gray-400">No plan data available.</p>
                          )}
                          {Object.entries(planCounts).map(([plan, count]) => (
                            <div key={plan} className="flex items-center justify-between">
                              <span className="text-gray-400">{plan}</span>
                              <span className="font-medium text-gray-900">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <Flag className="h-5 w-5 text-emerald-900" />
                          <h2 className="text-lg font-semibold text-gray-900">Feature Flags</h2>
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
                                <div className={`h-6 w-11 rounded-full transition-colors ${flag.enabled ? 'bg-emerald-700' : 'bg-gray-300'}`}>
                                  <div
                                  className={`h-5 w-5 rounded-full bg-white translate-y-0.5 shadow-sm transition-transform ${
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
                    <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-emerald-900" />
                        <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
                      </div>
                      <div className="mt-4 space-y-3 text-sm">
                        {auditEvents.slice(0, 10).map((event) => (
                          <div key={event.id} className="border border-gray-200 bg-[#fafafa] p-3">
                            <p className="text-gray-900">{event.action || 'Event'}</p>
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
                    <div className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-900" />
                        <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
                      </div>
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
                        <div className="border border-gray-200 bg-[#fafafa] p-4 shadow-sm">
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
                          <div className="border border-gray-200 bg-[#fafafa] p-4 shadow-sm">
                            <p className="text-xs text-gray-400">Status</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                              {health?.status ? health.status.toUpperCase() : 'UNKNOWN'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Region: {health?.region || 'N/A'}</p>
                          </div>
                          <div className="border border-gray-200 bg-[#fafafa] p-4 shadow-sm">
                            <p className="text-xs text-gray-400">AWS Config</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                              {health?.awsConfigured ? 'Configured' : 'Not Configured'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Credentials: {health?.hasCredentials ? 'Present' : 'Missing'}
                            </p>
                          </div>
                          <div className="border border-gray-200 bg-[#fafafa] p-4 shadow-sm">
                            <p className="text-xs text-gray-400">Issues</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                              {Array.isArray(health?.issues) ? health.issues.length : 0}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Open alerts</p>
                          </div>
                          <div className="border border-gray-200 bg-[#fafafa] p-4 shadow-sm">
                            <p className="text-xs text-gray-400">Free Models</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                              {Array.isArray(health?.freeModels) ? health.freeModels.length : 0}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Available tiers</p>
                          </div>
                        </div>
                      </div>
                      {Array.isArray(health?.issues) && health.issues.length > 0 && (
                        <div className="mt-4 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
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
