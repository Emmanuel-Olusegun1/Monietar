'use client';

import React from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  Package,
  FileText,
  CreditCard,
  BarChart3,
  BrainCircuit,
  ChevronRight,
} from 'lucide-react';

interface QuickActionsProps {
  darkMode: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  darkMode,
}) => {
  const comingSoon = (feature: string) => {
    alert(`${feature} will be available soon.`);
  };

  const actions = [
    {
      title: 'Record Income',
      description: 'Add a new sales transaction',
      icon: ArrowUpCircle,
      color: 'bg-emerald-500',
      action: () => comingSoon('Record Income'),
    },
    {
      title: 'Record Expense',
      description: 'Log a business expense',
      icon: ArrowDownCircle,
      color: 'bg-red-500',
      action: () => comingSoon('Record Expense'),
    },
    {
      title: 'Bank Transfer',
      description: 'Move funds between accounts',
      icon: Landmark,
      color: 'bg-blue-500',
      action: () => comingSoon('Bank Transfer'),
    },
    {
      title: 'Inventory',
      description: 'Manage products & stock',
      icon: Package,
      color: 'bg-amber-500',
      action: () => comingSoon('Inventory'),
    },
    {
      title: 'Generate Report',
      description: 'Download financial reports',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => comingSoon('Generate Report'),
    },
    {
      title: 'Pay Bills',
      description: 'Supplier & utility payments',
      icon: CreditCard,
      color: 'bg-pink-500',
      action: () => comingSoon('Pay Bills'),
    },
    {
      title: 'Analytics',
      description: 'View detailed insights',
      icon: BarChart3,
      color: 'bg-cyan-500',
      action: () => comingSoon('Analytics'),
    },
    {
      title: 'Ask AI',
      description: 'Consult your AI CFO',
      icon: BrainCircuit,
      color: 'bg-indigo-500',
      action: () => comingSoon('AI Assistant'),
    },
  ];

  return (
    <section
      className={`rounded-2xl border p-6 ${
        darkMode
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="mb-6">
        <h2
          className={`text-xl font-bold ${
            darkMode
              ? 'text-white'
              : 'text-gray-900'
          }`}
        >
          Quick Actions
        </h2>

        <p
          className={`mt-1 text-sm ${
            darkMode
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}
        >
          Frequently used business operations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={item.action}
              className={`group rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                darkMode
                  ? 'bg-gray-950 border-gray-800 hover:border-emerald-600'
                  : 'bg-gray-50 border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              <h3
                className={`font-semibold ${
                  darkMode
                    ? 'text-white'
                    : 'text-gray-900'
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                {item.description}
              </p>

              <div className="mt-6 flex justify-end">
                <ChevronRight className="h-5 w-5 text-emerald-500 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;