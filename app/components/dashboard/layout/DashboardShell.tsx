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
    <div className="flex h-screen bg-[#F6F8F4]">
      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>

      </div>
    </div>
  );
}