'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import Header from '@/components/dashboard/layout/Header';
import { useSidebar } from '@/context/SidebarContext';

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <Sidebar />

      <div
        className={`
          min-h-screen
          transition-[margin-left]
          duration-300
          ease-in-out
          ${collapsed ? 'lg:ml-[76px]' : 'lg:ml-[270px]'}
        `}
      >
        <Header />

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}