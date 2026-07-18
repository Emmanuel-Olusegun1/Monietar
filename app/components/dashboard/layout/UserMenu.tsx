'use client';

import { ChevronDown, Crown } from 'lucide-react';

interface UserMenuProps {
  name: string;
  business: string;
  role: string;
  plan: 'retail-starter' | 'growing-merchant' | 'borderless-pro';
}

const planColor = {
  'retail-starter':
    'bg-gray-100 text-gray-700',

  'growing-merchant':
    'bg-blue-100 text-blue-700',

  'borderless-pro':
    'bg-emerald-100 text-emerald-700',
};

const planLabel = {
  'retail-starter':
    'Retail Starter',

  'growing-merchant':
    'Growing Merchant',

  'borderless-pro':
    'Borderless Pro',
};

export default function UserMenu({
  name,
  business,
  role,
  plan,
}: UserMenuProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="border-t border-[#ECEEE8] p-5">

      <button className="flex w-full items-center justify-between rounded-2xl p-3 transition hover:bg-[#F5F7F4]">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3B23] text-lg font-bold text-white">
            {initials}
          </div>

          <div className="text-left">

            <h4 className="font-semibold text-[#1A1A1A]">
              {name}
            </h4>

            <p className="text-xs text-gray-500">
              {business}
            </p>

            <div
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${planColor[plan]}`}
            >
              <Crown className="h-3 w-3" />

              {planLabel[plan]}
            </div>

          </div>

        </div>

        <ChevronDown
          size={18}
          className="text-gray-500"
        />

      </button>

      <div className="mt-4 rounded-2xl border border-[#ECEEE8] bg-[#F8FAF7] p-4">

        <div className="flex justify-between">

          <span className="text-sm text-gray-500">
            Role
          </span>

          <span className="font-medium">
            {role}
          </span>

        </div>

        <div className="mt-3 flex justify-between">

          <span className="text-sm text-gray-500">
            Workspace
          </span>

          <span className="font-medium">
            Active
          </span>

        </div>

      </div>

    </div>
  );
}