'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, X } from 'lucide-react';

import { sidebarNavigation } from '@/config/sidebar.config';
import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();

  const {
    collapsed,
    mobileOpen,
    setMobileOpen,
  } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
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
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Mobile Close */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
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
          <X size={19} strokeWidth={1.8} />
        </button>

        {/* Logo */}
        <div
          className={`
            border-b border-gray-200
            transition-all duration-300
            ${collapsed ? 'px-3 py-5' : 'px-5 py-5'}
          `}
        >
          <Link
            href="/dashboard/overview"
            onClick={() => setMobileOpen(false)}
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
            ${collapsed ? 'px-2' : 'px-4'}
          `}
        >
          {sidebarNavigation.map((section) => (
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
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      onClick={() => setMobileOpen(false)}
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
                          ${collapsed ? '' : 'gap-3'}
                        `}
                      >
                        <Icon
                          size={18}
                          strokeWidth={active ? 2 : 1.7}
                          className="shrink-0"
                        />

                        {!collapsed && (
                          <span
                            className={`
                              text-[13px]
                              ${active ? 'font-medium' : 'font-normal'}
                            `}
                          >
                            {item.name}
                          </span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
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
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Plan */}
        <div
          className={`
            border-t border-gray-200
            transition-all
            ${collapsed ? 'p-3' : 'p-4'}
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
                ${collapsed ? '' : 'gap-3'}
              `}
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-xs font-semibold text-white">
                EO
              </div>

              {!collapsed && (
                <div className="min-w-0 text-left">
                  <h4 className="truncate text-[13px] font-medium text-gray-900">
                    Emmanuel
                  </h4>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Retail Starter
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
        </div>
      </aside>
    </>
  );
}
