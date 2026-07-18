import type { LucideIcon } from 'lucide-react';

import {
  Home,
  Wallet,
  Landmark,
  Package,
  ShoppingBag,
  FileText,
  Settings,
  CircleHelp,
  BarChart3,
  Globe2,
  BrainCircuit,
  Boxes,
} from 'lucide-react';

export type Plan =
  | 'retail-starter'
  | 'growing-merchant'
  | 'borderless-pro';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  plans: Plan[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const sidebarNavigation: NavigationGroup[] = [
  {
    title: 'MAIN',

    items: [
      {
        name: 'Overview',
        href: '/dashboard/overview',
        icon: Home,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },
    ],
  },

  {
    title: 'FINANCE',

    items: [
      {
        name: 'Transactions',
        href: '/dashboard/transactions',
        icon: Wallet,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'Cash Vault',
        href: '/dashboard/cash-vault',
        icon: Landmark,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'Reports',
        href: '/dashboard/reports',
        icon: FileText,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'Dual Currency',
        href: '/dashboard/dual-currency',
        icon: Globe2,
        plans: [
          'borderless-pro',
        ],
      },
    ],
  },

  {
    title: 'BUSINESS',

    items: [
      {
        name: 'Products',
        href: '/dashboard/products',
        icon: Package,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'Sales',
        href: '/dashboard/sales',
        icon: ShoppingBag,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'Inventory',
        href: '/dashboard/inventory',
        icon: Boxes,
        plans: [
          'growing-merchant',
          'borderless-pro',
        ],
      },
    ],
  },

  {
    title: 'INSIGHTS',

    items: [
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        plans: [
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'AI CFO',
        href: '/dashboard/ai',
        icon: BrainCircuit,
        plans: [
          'borderless-pro',
        ],
      },
    ],
  },

  {
    title: 'ACCOUNT',

    items: [
      {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },

      {
        name: 'Help',
        href: '/dashboard/help',
        icon: CircleHelp,
        plans: [
          'retail-starter',
          'growing-merchant',
          'borderless-pro',
        ],
      },
    ],
  },
];

export const CURRENT_PLAN: Plan = 'retail-starter';