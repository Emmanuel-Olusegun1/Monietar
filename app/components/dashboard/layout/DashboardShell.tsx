'use client';

import React from 'react';

import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F8F4]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        <Header />

        <main
          className="
            flex-1
            overflow-y-auto
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-8
            xl:px-10
          "
        >
          <div className="mx-auto w-full max-w-[1800px]">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}