'use client';

import {
  CheckCircle2,
  RefreshCw,
  Globe2,
  ShieldCheck,
  Database,
} from 'lucide-react';

import type { BankSyncStatus } from './types';

interface SystemStatusProps {
  darkMode: boolean;
  bankSyncStatus: BankSyncStatus;
  activeCurrencies: string[];
}

export default function SystemStatus({
  darkMode,
  bankSyncStatus,
  activeCurrencies,
}: SystemStatusProps) {
  const systems = [
    {
      title: 'Bank Connection',
      value:
        bankSyncStatus === 'connected'
          ? 'Connected'
          : 'Disconnected',
      icon: CheckCircle2,
      color:
        bankSyncStatus === 'connected'
          ? 'bg-emerald-100 text-emerald-600'
          : 'bg-red-100 text-red-600',
    },
    {
      title: 'Database',
      value: 'Operational',
      icon: Database,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'AI Engine',
      value: 'Online',
      icon: ShieldCheck,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Currencies',
      value: `${activeCurrencies.length} Active`,
      icon: Globe2,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <section
      className={`rounded-[28px] border ${
        darkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-[#E8ECE6] bg-white'
      }`}
    >
      {/* Header */}

      <div className="border-b border-[#ECEEE8] px-7 py-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-[#14361F]">
              System Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Real-time health of your Monietar workspace.
            </p>

          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] transition hover:bg-[#F7F9F5]">

            <RefreshCw
              size={18}
              className="text-[#14361F]"
            />

          </button>

        </div>

      </div>

      {/* Status Cards */}

      <div className="space-y-5 p-7">

        {systems.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl border border-[#ECEEE8] p-5 transition hover:shadow-md"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >

                  <Icon size={22} />

                </div>

                <div>

                  <h3 className="font-semibold text-[#14361F]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.value}
                  </p>

                </div>

              </div>

              <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
                Healthy
              </span>

            </div>

          );

        })}

      </div>

      {/* Footer */}

      <div className="border-t border-[#ECEEE8] bg-[#FAFBF9] px-7 py-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-semibold text-[#14361F]">
              Last System Check
            </p>

            <p className="text-xs text-gray-500">
              Less than one minute ago
            </p>

          </div>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            All Systems Operational
          </span>

        </div>

      </div>

    </section>
  );
}