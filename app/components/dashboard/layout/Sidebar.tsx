'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { sidebarNavigation } from '@/config/sidebar.config';
import { useSidebar } from '@/context/SidebarContext';
import { createClient } from '@/lib/supabase/client';

type Plan =
  | 'RETAIL_STARTER'
  | 'GROWING_MERCHANT'
  | 'BORDERLESS_PRO';

type PlanConfig = {
  name: string;
  transactionLimit: number | null;
};

const PLAN_CONFIG: Record<Plan, PlanConfig> = {
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
    transactionLimit: null,
  },
};

const normalizePlan = (
  value: unknown
): Plan => {
  if (typeof value !== 'string') {
    return 'RETAIL_STARTER';
  }

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  switch (normalized) {
    case 'GROWING_MERCHANT':
      return 'GROWING_MERCHANT';

    case 'BORDERLESS_PRO':
      return 'BORDERLESS_PRO';

    case 'RETAIL_STARTER':
    default:
      return 'RETAIL_STARTER';
  }
};

const getUserName = (
  user: {
    user_metadata?: Record<string, unknown>;
    email?: string;
  } | null
) => {
  if (!user) {
    return 'Account';
  }

  const metadata =
    user.user_metadata || {};

  const possibleNames = [
    metadata.full_name,
    metadata.name,
    metadata.display_name,
    metadata.first_name,
  ];

  for (const value of possibleNames) {
    if (
      typeof value === 'string' &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  if (user.email) {
    const emailName =
      user.email.split('@')[0];

    if (emailName) {
      return emailName
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        );
    }
  }

  return 'Account';
};

const getInitials = (
  name: string
) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'AC';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
};

export default function Sidebar() {
  const pathname = usePathname();

  const {
    collapsed,
    mobileOpen,
    setMobileOpen,
  } = useSidebar();

  const [userName, setUserName] =
    useState('Account');

  const [plan, setPlan] =
    useState<Plan>('RETAIL_STARTER');

  const [loadingUser, setLoadingUser] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (error || !user) {
        setUserName('Account');
        setPlan('RETAIL_STARTER');
        setLoadingUser(false);
        return;
      }

      const metadata =
        user.user_metadata || {};

      /*
       * Plan is currently read from Supabase Auth metadata.
       *
       * Supported values:
       * - RETAIL_STARTER
       * - GROWING_MERCHANT
       * - BORDERLESS_PRO
       *
       * We support both `subscription_plan`
       * and `plan` so the sidebar remains compatible
       * with either metadata key.
       */
      const userPlan = normalizePlan(
        metadata.subscription_plan ??
          metadata.plan
      );

      setUserName(
        getUserName(user)
      );

      setPlan(userPlan);
      setLoadingUser(false);
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const planConfig =
    PLAN_CONFIG[plan];

  const initials =
    getInitials(userName);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() =>
            setMobileOpen(false)
          }
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-gray-200
          bg-[#f1f1f1]
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[76px]' : 'w-[270px]'}
          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
          lg:translate-x-0
        `}
      >
        {/* Mobile Close */}
        <button
          type="button"
          onClick={() =>
            setMobileOpen(false)
          }
          aria-label="Close navigation"
          className="
            absolute right-4 top-4 z-10
            rounded-md p-2
            text-gray-500
            transition-colors
            hover:bg-white hover:text-gray-900
            lg:hidden
          "
        >
          <X
            size={19}
            strokeWidth={1.8}
          />
        </button>

        {/* Logo */}
        <div
          className={`
            border-b border-gray-200
            transition-all duration-300
            ${
              collapsed
                ? 'px-3 py-5'
                : 'px-5 py-5'
            }
          `}
        >
          <Link
            href="/dashboard/overview"
            onClick={() =>
              setMobileOpen(false)
            }
            className="flex items-center justify-center"
          >
            <Image
              src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
              alt="Monietar"
              width={122}
              height={42}
              priority
              className="shrink-0"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav
          className={`
            flex-1 overflow-y-auto
            py-6
            transition-all
            ${
              collapsed
                ? 'px-2'
                : 'px-4'
            }
          `}
        >
          {sidebarNavigation.map(
            (section) => (
              <div
                key={section.title}
                className="mb-7 last:mb-0"
              >
                {/* Section Label */}
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    {section.title}
                  </p>
                )}

                <div className="space-y-0.5">
                  {section.items.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      const active =
                        pathname ===
                          item.href ||
                        pathname.startsWith(
                          `${item.href}/`
                        );

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          title={
                            collapsed
                              ? item.name
                              : undefined
                          }
                          onClick={() =>
                            setMobileOpen(
                              false
                            )
                          }
                          className={`
                            group flex min-h-[42px] items-center
                            border
                            transition-colors duration-150
                            ${
                              collapsed
                                ? 'justify-center px-0'
                                : 'justify-between px-3'
                            }
                            ${
                              active
                                ? 'border-emerald-900 bg-emerald-900 text-white'
                                : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900'
                            }
                          `}
                        >
                          <div
                            className={`
                              flex items-center
                              ${
                                collapsed
                                  ? ''
                                  : 'gap-3'
                              }
                            `}
                          >
                            <Icon
                              size={18}
                              strokeWidth={
                                active
                                  ? 2
                                  : 1.7
                              }
                              className="shrink-0"
                            />

                            {!collapsed && (
                              <span
                                className={`
                                  text-[13px]
                                  ${
                                    active
                                      ? 'font-medium'
                                      : 'font-normal'
                                  }
                                `}
                              >
                                {
                                  item.name
                                }
                              </span>
                            )}
                          </div>

                          {!collapsed &&
                            item.badge && (
                              <span
                                className={`
                                  rounded-full px-2 py-0.5
                                  text-[9px] font-semibold
                                  ${
                                    active
                                      ? 'bg-white/15 text-white'
                                      : 'bg-emerald-50 text-emerald-800'
                                  }
                                `}
                              >
                                {
                                  item.badge
                                }
                              </span>
                            )}
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>
            )
          )}
        </nav>

        {/* User / Plan */}
        <div
          className={`
            border-t border-gray-200
            transition-all
            ${
              collapsed
                ? 'p-3'
                : 'p-4'
            }
          `}
        >
          <button
            type="button"
            className={`
              flex w-full items-center
              transition-colors
              hover:bg-white
              ${
                collapsed
                  ? 'justify-center p-2'
                  : 'justify-between px-2 py-2'
              }
            `}
          >
            <div
              className={`
                flex items-center
                ${
                  collapsed
                    ? ''
                    : 'gap-3'
                }
              `}
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-xs font-semibold text-white">
                {loadingUser
                  ? '...'
                  : initials}
              </div>

              {!collapsed && (
                <div className="min-w-0 text-left">
                  <h4 className="truncate text-[13px] font-medium text-gray-900">
                    {loadingUser
                      ? 'Loading...'
                      : userName}
                  </h4>

                  <p className="mt-0.5 truncate text-[11px] text-gray-400">
                    {planConfig.name}
                  </p>
                </div>
              )}
            </div>

            {!collapsed && (
              <ChevronDown
                size={16}
                strokeWidth={1.7}
                className="shrink-0 text-gray-400"
              />
            )}
          </button>

          {/* Plan limit */}
          {!collapsed &&
            planConfig.transactionLimit !==
              null && (
              <div className="mt-3 px-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    Transaction limit
                  </span>

                  <span className="text-[10px] font-medium text-gray-500">
                    {planConfig.transactionLimit.toLocaleString(
                      'en-NG'
                    )}
                  </span>
                </div>
              </div>
            )}

          {!collapsed &&
            planConfig.transactionLimit ===
              null && (
              <div className="mt-3 px-2">
                <span className="text-[10px] text-gray-400">
                  Unlimited transactions
                </span>
              </div>
            )}
        </div>
      </aside>
    </>
  );
}