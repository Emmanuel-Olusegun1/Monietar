'use client';

import Link from 'next/link';
import { ArrowUpRight, Sparkles, Check } from 'lucide-react';

interface UpgradeCardProps {
  plan: 'retail-starter' | 'growing-merchant' | 'borderless-pro';
}

const planContent = {
  'retail-starter': {
    title: 'Upgrade to Growing Merchant',
    description:
      'Unlock inventory management, analytics and smarter business tools.',
    button: 'Upgrade Plan',
    features: [
      'Inventory Tracking',
      'Advanced Analytics',
      'Unlimited Reports',
    ],
  },

  'growing-merchant': {
    title: 'Go Borderless Pro',
    description:
      'Unlock AI CFO, multi-currency accounting and automation.',
    button: 'Upgrade to Pro',
    features: [
      'AI CFO',
      'Dual Currency',
      'Business Automation',
    ],
  },

  'borderless-pro': {
    title: 'Borderless Pro',
    description:
      'You already have access to every Monietar feature.',
    button: 'Manage Subscription',
    features: [
      'Everything Unlocked',
      'Priority Support',
      'Early Access Features',
    ],
  },
};

export default function UpgradeCard({
  plan,
}: UpgradeCardProps) {
  const data = planContent[plan];

  return (
    <div className="mx-5 mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3B23] via-[#14532D] to-[#1D7A45] p-6 text-white shadow-lg">

      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#A7F3D0]" />

        <span className="text-sm font-semibold uppercase tracking-wide text-[#A7F3D0]">
          Monietar Growth
        </span>
      </div>

      <h3 className="text-xl font-bold leading-tight">
        {data.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-green-100">
        {data.description}
      </p>

      <div className="mt-6 space-y-3">
        {data.features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400/20">
              <Check className="h-3.5 w-3.5 text-green-300" />
            </div>

            <span className="text-sm text-green-50">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/pricing"
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-semibold text-[#0F3B23] transition-all duration-200 hover:scale-[1.02] hover:bg-[#F5F5F5]"
      >
        {data.button}

        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}