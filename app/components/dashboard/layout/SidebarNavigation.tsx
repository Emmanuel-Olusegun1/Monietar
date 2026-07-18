'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';

import {
  sidebarNavigation,
  CURRENT_PLAN,
} from '../../../../config/sidebar.config';

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">

      {sidebarNavigation.map((group) => (
        <div
          key={group.title}
          className="mb-8"
        >
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            {group.title}
          </p>

          <div className="space-y-1">

            {group.items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href;

              const enabled =
                item.plans.includes(
                  CURRENT_PLAN
                );

              if (!enabled) {
                return (
                  <div
                    key={item.href}
                    className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3 opacity-50"
                  >
                    <div className="flex items-center gap-3">

                      <Icon
                        size={19}
                        className="text-gray-400"
                      />

                      <span className="text-sm font-medium text-gray-500">
                        {item.name}
                      </span>

                    </div>

                    <Lock
                      size={15}
                      className="text-gray-400"
                    />
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#0F3B23] text-white shadow-md'
                      : 'text-gray-700 hover:bg-[#F3F5F2]'
                  }`}
                >
                  <Icon size={19} />

                  <span>{item.name}</span>
                </Link>
              );
            })}

          </div>
        </div>
      ))}

    </div>
  );
}