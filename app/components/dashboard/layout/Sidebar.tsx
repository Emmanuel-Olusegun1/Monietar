'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  ChevronDown,
  X,
} from 'lucide-react';

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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          border-r
          border-[#E8ECE6]
          bg-[#FBFCFA]
          transition-all
          duration-300
          ease-in-out

          ${
            collapsed
              ? 'w-[88px]'
              : 'w-[300px]'
          }

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
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-4 rounded-xl p-2 hover:bg-gray-100 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo */}

        <div
          className={`border-b border-[#E8ECE6] transition-all duration-300 ${
            collapsed
              ? 'px-4 py-6'
              : 'px-7 py-6'
          }`}
        >
          <Link
            href="/dashboard/overview"
            className={`flex items-center ${
              collapsed
                ? 'justify-center'
                : 'gap-3'
            }`}
          >
            <Image
              src="/logo.svg"
              alt="Monietar"
              width={42}
              height={42}
              priority
            />

            {!collapsed && (
              <div>
                <h1 className="text-[28px] font-bold tracking-tight text-[#0F3B23]">
                  Monietar
                </h1>

                <p className="text-xs text-[#7A847C]">
                  AI Financial Operating System
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}

        <div
          className={`flex-1 overflow-y-auto py-6 transition-all ${
            collapsed
              ? 'px-2'
              : 'px-5'
          }`}
        >          {sidebarNavigation.map((section) => (
            <div
              key={section.title}
              className="mb-8"
            >
              {!collapsed && (
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9AA39B]">
                  {section.title}
                </p>
              )}

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
                      title={item.name}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className={`
                        group
                        flex
                        items-center
                        rounded-2xl
                        transition-all
                        duration-200

                        ${
                          collapsed
                            ? 'justify-center px-0 py-3'
                            : 'justify-between px-4 py-3'
                        }

                        ${
                          active
                            ? 'bg-[#0F3B23] text-white shadow-lg'
                            : 'text-[#38443B] hover:bg-[#F2F5F1]'
                        }
                      `}
                    >
                      <div
                        className={`flex items-center ${
                          collapsed
                            ? ''
                            : 'gap-3'
                        }`}
                      >
                        <Icon
                          size={20}
                          className="shrink-0"
                        />

                        {!collapsed && (
                          <span className="text-[15px] font-medium">
                            {item.name}
                          </span>
                        )}
                      </div>

                      {!collapsed &&
                        item.badge && (
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
              {/* User */}

      <div
        className={`border-t border-[#E8ECE6] transition-all ${
          collapsed ? 'p-3' : 'p-5'
        }`}
      >
        <button
          className={`flex w-full items-center rounded-2xl transition hover:bg-[#F6F8F5] ${
            collapsed
              ? 'justify-center p-2'
              : 'justify-between p-2'
          }`}
        >
          <div
            className={`flex items-center ${
              collapsed ? '' : 'gap-3'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F3B23] font-semibold text-white">
              EO
            </div>

            {!collapsed && (
              <div className="text-left">
                <h4 className="font-semibold text-[#213126]">
                  Emmanuel
                </h4>

                <p className="text-xs text-[#7A847C]">
                  Free Plan
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <ChevronDown
              size={18}
              className="text-[#7A847C]"
            />
          )}
        </button>
      </div>
    </aside>
    </>
  );
}