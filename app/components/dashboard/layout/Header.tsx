'use client';

import {
  Bell,
  Search,
  ChevronDown,
} from 'lucide-react';

import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/dashboard/overview': 'Overview',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
};

export default function Header() {
  const pathname = usePathname();

  const title =
    titles[pathname] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8ECE6] bg-[#F7F9F5]/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-8">
        {/* Left */}

        <div>
          {/* <h1 className="text-xl font-bold text-[#14361F]">
            {title}
          </h1>

          <p className="text-sm text-[#6B7280]">
            Welcome back. Here's today's summary.
          </p> */}

           {/* User */}

          <button className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14361F] font-semibold text-white">
              EO
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-[#14361F]">
                Emmanuel
              </p>

              <p className="text-xs text-gray-500">
                Free Plan
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-gray-500"
            />
          </button>
        </div>

        {/* Right */}

        <div className="flex items-center gap-4">
          {/* Search */}

          <div className="hidden lg:flex">
            <div className="flex h-11 w-[340px] items-center rounded-2xl border border-[#E5E7EB] bg-white px-4">
              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                placeholder="Search transactions, reports..."
                className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

      
          {/* Notifications */}

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white">
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

              {/* AI */}

          <button className="flex h-11 items-center gap-2 rounded-2xl bg-[#14361F] px-5 text-sm font-medium text-white transition hover:bg-[#0F2B19]">
            Ask AI
          </button>


         
        </div>
      </div>
    </header>
  );
}