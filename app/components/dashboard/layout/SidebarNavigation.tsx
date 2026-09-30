'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  sidebarNavigation,
  type Plan,
} from '../../../../config/sidebar.config';

import { createClient } from '@/lib/supabase/client';

const normalizePlan = (value: unknown): Plan => {
  if (typeof value !== 'string') {
    return 'retail-starter';
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');

  switch (normalized) {
    case 'growing-merchant':
      return 'growing-merchant';

    case 'borderless-pro':
      return 'borderless-pro';

    case 'retail-starter':
    default:
      return 'retail-starter';
  }
};

export default function SidebarNavigation() {
  const pathname = usePathname();

  const [currentPlan, setCurrentPlan] =
    useState<Plan>('retail-starter');

  const [loadingPlan, setLoadingPlan] =
    useState(true);

  const [supabase] = useState(() =>
    createClient()
  );

  useEffect(() => {
    let mounted = true;

    const loadPlan = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (error || !user) {
          setCurrentPlan('retail-starter');
          return;
        }

        const metadata = user.user_metadata || {};

        const userPlan = normalizePlan(
          metadata.subscription_plan ??
            metadata.plan
        );

        setCurrentPlan(userPlan);
      } catch (error) {
        console.error(
          'Failed to load subscription plan:',
          error
        );

        if (mounted) {
          setCurrentPlan('retail-starter');
        }
      } finally {
        if (mounted) {
          setLoadingPlan(false);
        }
      }
    };

    loadPlan();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-6">
      {sidebarNavigation.map((group) => (
        <div
          key={group.title}
          className="mb-7 last:mb-0"
        >
          {/* Section Label */}
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            {group.title}
          </p>

          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              const enabled =
                item.plans.includes(currentPlan);

              /*
               * Only show locked navigation after
               * the user's plan has actually been checked.
               */
              if (!loadingPlan && !enabled) {
                return (
                  <div
                    key={item.href}
                    aria-disabled="true"
                    title={`${item.name} is not available on your current plan`}
                    className="
                      flex min-h-[42px]
                      cursor-not-allowed
                      items-center justify-between
                      border border-transparent
                      px-3
                      text-gray-400
                      opacity-60
                    "
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        className="shrink-0"
                      />

                      <span className="text-[13px] font-normal">
                        {item.name}
                      </span>
                    </div>

                    <Lock
                      size={14}
                      strokeWidth={1.7}
                      className="shrink-0 text-gray-400"
                    />
                  </div>
                );
              }

              /*
               * During plan loading, keep normal links
               * clickable. The user's actual plan will
               * determine the locked state once loaded.
               */
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex min-h-[42px]
                    items-center gap-3
                    border px-3
                    text-[13px]
                    transition-colors duration-150
                    ${
                      active
                        ? 'border-emerald-900 bg-emerald-900 font-medium text-white'
                        : 'border-transparent font-normal text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={
                      active ? 2 : 1.7
                    }
                    className="shrink-0"
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}