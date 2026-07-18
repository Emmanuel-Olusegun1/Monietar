'use client';

import {
  AlertTriangle,
  Bell,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import type { BankSyncStatus } from './types';

interface AIAlertsProps {
  darkMode: boolean;
  inventoryAlerts: number;
  bankSyncStatus: BankSyncStatus;
}

export default function AIAlerts({
  darkMode,
  inventoryAlerts,
  bankSyncStatus,
}: AIAlertsProps) {
  const alerts = [
    {
      title: 'Inventory Monitoring',
      description:
        inventoryAlerts > 0
          ? `${inventoryAlerts} products are running low.`
          : 'Inventory levels look healthy.',
      icon:
        inventoryAlerts > 0
          ? AlertTriangle
          : CheckCircle2,
      color:
        inventoryAlerts > 0
          ? 'bg-amber-100 text-amber-600'
          : 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Bank Synchronization',
      description:
        bankSyncStatus === 'connected'
          ? 'Your bank account is connected.'
          : 'Reconnect your bank account.',
      icon:
        bankSyncStatus === 'connected'
          ? CheckCircle2
          : ShieldAlert,
      color:
        bankSyncStatus === 'connected'
          ? 'bg-emerald-100 text-emerald-600'
          : 'bg-red-100 text-red-600',
    },
    {
      title: 'AI Insight',
      description:
        'Revenue is improving compared to the previous period.',
      icon: Bell,
      color:
        'bg-blue-100 text-blue-600',
    },
  ];

  return (
    <section
      className={`rounded-[28px] border p-7 ${
        darkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-[#E8ECE6] bg-white'
      }`}
    >
      <div className="mb-7">

        <h2 className="text-xl font-bold text-[#14361F]">
          AI Alerts
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Important events requiring your attention.
        </p>

      </div>

      <div className="space-y-5">

        {alerts.map((alert) => {

          const Icon = alert.icon;

          return (

            <div
              key={alert.title}
              className="rounded-2xl border border-[#ECEEE8] p-5 transition hover:shadow-md"
            >

              <div className="flex items-start gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${alert.color}`}
                >
                  <Icon size={22} />
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold text-[#14361F]">
                    {alert.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {alert.description}
                  </p>

                  <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0F3B23] hover:text-emerald-700">

                    View Details

                    <ArrowRight size={16} />

                  </button>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </section>
  );
}