'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  ChevronDown,
  Sparkles,
  Mic,
} from 'lucide-react';

import { sidebarNavigation } from '@/config/sidebar.config';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[300px] flex-col border-r border-[#E8ECE6] bg-[#FBFCFA]">

      {/* Logo */}

      <div className="border-b border-[#E8ECE6] px-7 py-6">
        <Link
          href="/dashboard/overview"
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.svg"
            alt="Monietar"
            width={42}
            height={42}
            priority
          />

          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#0F3B23]">
              Monietar
            </h1>

            <p className="text-xs text-[#7A847C]">
              AI Financial Operating System
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-5 py-6">

        {sidebarNavigation.map((section) => (

          <div
            key={section.title}
            className="mb-8"
          >
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9AA39B]">
              {section.title}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => {

                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname.startsWith(
                    `${item.href}/`
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 ${
                      active
                        ? 'bg-[#0F3B23] text-white shadow-lg'
                        : 'text-[#38443B] hover:bg-[#F2F5F1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />

                      <span className="text-[15px] font-medium">
                        {item.name}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-[#E8F5ED] text-[#0F7A42]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

            </div>
          </div>

        ))}

      </div>

      {/* AI Card */}

      {/* <div className="mx-5 mb-5 rounded-3xl border border-[#E8ECE6] bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center gap-2">

          <Sparkles
            size={18}
            className="text-[#0F3B23]"
          />

          <h3 className="font-semibold text-[#0F3B23]">
            Monietar AI
          </h3>

        </div>

        <div className="mb-4 rounded-xl border border-[#EEF1EC] bg-[#F7FAF7] px-4 py-3 text-sm text-[#6F776F]">
          Ask about profit, cashflow or inventory...
        </div>

        <div className="grid grid-cols-2 gap-2">

          <button className="rounded-xl bg-[#F2F5F1] py-2 text-sm font-medium transition hover:bg-[#E8ECE6]">

            <Mic
              size={15}
              className="mr-2 inline"
            />

            Voice

          </button>

          <button className="rounded-xl bg-[#0F3B23] py-2 text-sm font-medium text-white transition hover:bg-[#184C2E]">
            Audit
          </button>

        </div>

      </div> */}

      {/* User */}

      <div className="border-t border-[#E8ECE6] p-5">

        <button className="flex w-full items-center justify-between rounded-2xl p-2 transition hover:bg-[#F6F8F5]">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F3B23] font-semibold text-white">
              EO
            </div>

            <div className="text-left">

              <h4 className="font-semibold text-[#213126]">
                Emmanuel
              </h4>

              <p className="text-xs text-[#7A847C]">
                Free Plan
              </p>

            </div>

          </div>

          <ChevronDown
            size={18}
            className="text-[#7A847C]"
          />

        </button>

      </div>

    </aside>
  );
}