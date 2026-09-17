'use client';

import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  Settings,
  HelpCircle,
  LogOut,
  User,
  ArrowRightLeft,
  Activity,
  Lock,
  X,
  Loader2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useSidebar } from '@/context/SidebarContext';
import { createClient } from '@/lib/supabase/client';

type Plan =
  | 'RETAIL_STARTER'
  | 'GROWING_MERCHANT'
  | 'BORDERLESS_PRO';

type Profile = {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

const PLAN_CONFIG = {
  RETAIL_STARTER: {
    name: 'Retail Starter',
    transactionLimit: 500,
  },
  GROWING_MERCHANT: {
    name: 'Growing Merchant',
    transactionLimit: 2500,
  },
  BORDERLESS_PRO: {
    name: 'Borderless Pro',
    transactionLimit: Infinity,
  },
};

const titles: Record<string, string> = {
  '/dashboard/overview': 'Overview',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/cash-vault': 'Cash Vault',
  '/dashboard/reports': 'Reports',
  '/dashboard/dual-currency': 'Dual Currency',
  '/dashboard/products': 'Products',
  '/dashboard/sales': 'Sales',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/ai-cfo': 'AI CFO',
  '/dashboard/settings': 'Settings',
  '/dashboard/help': 'Help',
};

const BUSINESS_TIME_ZONE = 'Africa/Lagos';

function normalizePlan(value: unknown): Plan {
  if (typeof value !== 'string') {
    return 'RETAIL_STARTER';
  }

  const normalized = value.toLowerCase().trim();

  switch (normalized) {
    case 'growing-merchant':
    case 'growing_merchant':
    case 'growing merchant':
    case 'growingmerchant':
      return 'GROWING_MERCHANT';

    case 'borderless-pro':
    case 'borderless_pro':
    case 'borderless pro':
    case 'borderlesspro':
      return 'BORDERLESS_PRO';

    case 'retail-starter':
    case 'retail_starter':
    case 'retail starter':
    case 'retailstarter':
    default:
      return 'RETAIL_STARTER';
  }
}

function getLagosDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-NG', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(
      parts.find((part) => part.type === 'year')?.value
    ),
    month: Number(
      parts.find((part) => part.type === 'month')?.value
    ),
    day: Number(
      parts.find((part) => part.type === 'day')?.value
    ),
  };
}

function getLagosDateString(date = new Date()) {
  const { year, month, day } = getLagosDateParts(date);

  return `${year}-${String(month).padStart(2, '0')}-${String(
    day
  ).padStart(2, '0')}`;
}

function getLagosMonthRange() {
  const { year, month } = getLagosDateParts();

  const start = `${year}-${String(month).padStart(2, '0')}-01`;

  const lastDay = new Date(
    year,
    month,
    0
  ).getDate();

  const end = `${year}-${String(month).padStart(2, '0')}-${String(
    lastDay
  ).padStart(2, '0')}`;

  return {
    start,
    end,
  };
}

function getDisplayName(profile: Profile | null, email: string | null) {
  if (profile?.display_name?.trim()) {
    return profile.display_name.trim();
  }

  const fullName = [
    profile?.first_name?.trim(),
    profile?.last_name?.trim(),
  ]
    .filter(Boolean)
    .join(' ');

  if (fullName) {
    return fullName;
  }

  if (email) {
    return email.split('@')[0];
  }

  return 'User';
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { setMobileOpen } = useSidebar();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] =
    useState<Plan>('RETAIL_STARTER');
  const [monthlyTransactions, setMonthlyTransactions] =
    useState(0);
  const [loadingHeaderData, setLoadingHeaderData] =
    useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const plan = PLAN_CONFIG[currentPlan];
  const title = titles[pathname] ?? 'Dashboard';

  const displayName = getDisplayName(profile, email);
  const initials = getInitials(displayName);

  useEffect(() => {
    let mounted = true;

    const loadHeaderData = async () => {
      setLoadingHeaderData(true);

      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (mounted) {
            setLoadingHeaderData(false);
          }

          return;
        }

        if (!mounted) return;

        setEmail(user.email ?? null);

        const metadataPlan = normalizePlan(
          user.user_metadata?.subscription_plan ??
            user.user_metadata?.plan
        );

        setCurrentPlan(metadataPlan);

        const [
          profileResult,
          transactionResult,
        ] = await Promise.all([
          supabase
            .from('profiles')
            .select(
              'first_name, last_name, display_name, email, avatar_url'
            )
            .eq('id', user.id)
            .maybeSingle(),

          (() => {
            const { start, end } = getLagosMonthRange();

            return supabase
              .from('transactions')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('is_deleted', false)
              .eq('status', 'completed')
              .neq('source', 'manual')
              .gte('date', start)
              .lte('date', end);
          })(),
        ]);

        if (!mounted) return;

        if (!profileResult.error && profileResult.data) {
          setProfile(profileResult.data);
        }

        if (!transactionResult.error) {
          setMonthlyTransactions(
            transactionResult.count ?? 0
          );
        } else {
          setMonthlyTransactions(0);
        }
      } catch (error) {
        console.error(
          'Failed to load header data:',
          error
        );
      } finally {
        if (mounted) {
          setLoadingHeaderData(false);
        }
      }
    };

    loadHeaderData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => {
        mobileSearchRef.current?.focus();
      });
    }
  }, [searchOpen]);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      router.replace('/auth/signin');
    } catch (error) {
      console.error(
        'Failed to sign out:',
        error
      );

      setSigningOut(false);
    }
  };

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-40
        w-full
        border-b
        border-gray-200
        bg-[#f1f1f1]/95
        backdrop-blur
      "
    >
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Sidebar */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              border border-gray-200
              bg-white
              text-gray-700
              transition-colors
              hover:bg-gray-50
              lg:hidden
            "
          >
            <Menu
              size={19}
              strokeWidth={1.8}
            />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              {title}
            </h1>

            <p className="hidden text-xs text-gray-400 sm:block">
              Your business at a glance.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <div className="hidden lg:flex">
            <div className="flex h-10 w-[280px] items-center border border-gray-200 bg-white px-3">
              <Search
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-gray-400"
              />

              <input
                type="search"
                placeholder="Search transactions, reports..."
                aria-label="Search"
                className="
                  ml-2.5 w-full
                  bg-transparent
                  text-sm text-gray-900
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() =>
              setSearchOpen((open) => !open)
            }
            aria-label={
              searchOpen
                ? 'Close search'
                : 'Open search'
            }
            aria-expanded={searchOpen}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              border border-gray-200
              bg-white
              text-gray-600
              transition-colors
              hover:bg-gray-50
              hover:text-gray-900
              lg:hidden
            "
          >
            {searchOpen ? (
              <X
                size={18}
                strokeWidth={1.7}
              />
            ) : (
              <Search
                size={18}
                strokeWidth={1.7}
              />
            )}
          </button>

          {/* Plan-aware Indicator */}
          {currentPlan === 'BORDERLESS_PRO' ? (
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/dashboard/dual-currency'
                )
              }
              className="
                hidden h-10 items-center gap-2
                border border-gray-200
                bg-white
                px-3
                transition-colors
                hover:bg-gray-50
                md:flex
              "
              title="Open Dual Currency"
            >
              <ArrowRightLeft
                size={16}
                strokeWidth={1.7}
                className="text-emerald-900"
              />

              <div className="text-left leading-none">
                <p className="text-[9px] uppercase tracking-[0.12em] text-gray-400">
                  FX Rate
                </p>

                <p className="mt-1 text-[11px] font-medium text-gray-900">
                  —
                </p>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                router.push('/dashboard/transactions')
              }
              className="
                hidden h-10 items-center gap-2
                border border-gray-200
                bg-white
                px-3
                transition-colors
                hover:bg-gray-50
                md:flex
              "
              title="View monthly activity"
            >
              <Activity
                size={16}
                strokeWidth={1.7}
                className="text-emerald-900"
              />

              <div className="text-left leading-none">
                <p className="text-[9px] uppercase tracking-[0.12em] text-gray-400">
                  Monthly Activity
                </p>

                <p className="mt-1 text-[11px] font-medium text-gray-900">
                  {loadingHeaderData ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <>
                      {monthlyTransactions}
                      {plan.transactionLimit !== Infinity
                        ? ` / ${plan.transactionLimit}`
                        : ' transactions'}
                    </>
                  )}
                </p>
              </div>
            </button>
          )}

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              relative flex h-10 w-10 shrink-0
              items-center justify-center
              border border-gray-200
              bg-white
              text-gray-600
              transition-colors
              hover:bg-gray-50
              hover:text-gray-900
            "
          >
            <Bell
              size={18}
              strokeWidth={1.7}
            />

            <span
              className="
                absolute right-2 top-2
                h-1.5 w-1.5
                rounded-full
                bg-red-500
              "
            />
          </button>

          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen((open) => !open)
              }
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="Open account menu"
              className="
                flex h-10 items-center gap-2
                border border-gray-200
                bg-white
                px-2 sm:px-3
                transition-colors
                hover:bg-gray-50
              "
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-900 text-[10px] font-semibold text-white">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="hidden min-w-0 text-left lg:block">
                <p className="max-w-[120px] truncate text-xs font-medium text-gray-900">
                  {loadingHeaderData
                    ? 'Loading...'
                    : displayName}
                </p>

                <p className="text-[10px] text-gray-400">
                  {plan.name}
                </p>
              </div>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className={`
                  hidden text-gray-400 transition-transform lg:block
                  ${profileOpen ? 'rotate-180' : ''}
                `}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                role="menu"
                className="
                  absolute right-0 top-[calc(100%+8px)]
                  z-50
                  w-[250px]
                  border border-gray-200
                  bg-white
                  shadow-[0_12px_35px_rgba(0,0,0,0.08)]
                "
              >
                <div className="border-b border-gray-200 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-900 text-xs font-semibold text-white">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {displayName}
                      </p>

                      <p className="truncate text-[11px] text-gray-400">
                        {email ?? 'No email available'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      router.push(
                        '/dashboard/settings'
                      )
                    }
                    className="
                      flex w-full items-center gap-3
                      px-3 py-2.5
                      text-left
                      text-[13px] text-gray-600
                      transition-colors
                      hover:bg-[#f1f1f1]
                      hover:text-gray-900
                    "
                  >
                    <User
                      size={16}
                      strokeWidth={1.7}
                    />

                    <span>Profile</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      router.push(
                        '/dashboard/settings'
                      )
                    }
                    className="
                      flex w-full items-center gap-3
                      px-3 py-2.5
                      text-left
                      text-[13px] text-gray-600
                      transition-colors
                      hover:bg-[#f1f1f1]
                      hover:text-gray-900
                    "
                  >
                    <Settings
                      size={16}
                      strokeWidth={1.7}
                    />

                    <span>Settings</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      router.push(
                        '/dashboard/help'
                      )
                    }
                    className="
                      flex w-full items-center gap-3
                      px-3 py-2.5
                      text-left
                      text-[13px] text-gray-600
                      transition-colors
                      hover:bg-[#f1f1f1]
                      hover:text-gray-900
                    "
                  >
                    <HelpCircle
                      size={16}
                      strokeWidth={1.7}
                    />

                    <span>Help & Support</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                        Current plan
                      </p>

                      <p className="mt-1 text-xs font-medium text-gray-900">
                        {plan.name}
                      </p>
                    </div>

                    {currentPlan !==
                      'BORDERLESS_PRO' && (
                      <Lock
                        size={13}
                        strokeWidth={1.7}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="
                      flex w-full items-center gap-3
                      px-3 py-2.5
                      text-left
                      text-[13px] text-red-600
                      transition-colors
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <LogOut
                      size={16}
                      strokeWidth={1.7}
                    />

                    <span>
                      {signingOut
                        ? 'Signing out...'
                        : 'Sign out'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Panel */}
      {searchOpen && (
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6 lg:hidden">
          <div className="flex h-11 items-center border border-gray-200 bg-white px-3">
            <Search
              size={17}
              strokeWidth={1.7}
              className="shrink-0 text-gray-400"
            />

            <input
              ref={mobileSearchRef}
              type="search"
              placeholder="Search transactions, reports..."
              aria-label="Search"
              className="
                ml-2.5 w-full
                bg-transparent
                text-sm text-gray-900
                outline-none
                placeholder:text-gray-400
              "
            />

            <kbd className="hidden border border-gray-200 px-1.5 py-0.5 text-[9px] text-gray-400 sm:block">
              ESC
            </kbd>
          </div>
        </div>
      )}
    </header>
  );
}