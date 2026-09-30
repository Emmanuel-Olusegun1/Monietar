'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

type Currency = 'NGN' | 'XOF';
type BillingPeriod = 'monthly' | 'yearly';

type Plan = {
  name: string;
  description: string;
  price: Record<Currency, number>;
  yearlyPrice: Record<Currency, number>;
  originalPrice: Record<Currency, number> | null;
  features: string[];
  cta: string;
  popular: boolean;
  discounted: boolean;
  url: string;
};

const plans: Record<'free' | 'pro' | 'premium', Plan> = {
  free: {
    name: 'Retail Starter',
    description:
      'The essential Monietar experience for everyday merchants who want to move beyond notebooks and start understanding their money.',
    price: {
      NGN: 0,
      XOF: 0,
    },
    yearlyPrice: {
      NGN: 0,
      XOF: 0,
    },
    originalPrice: null,
    features: [
      '1 connected merchant bank account',
      '30 automatically logged transactions per month',
      'Unlimited Bank Statement (PDF/CSV) auto-parsing',
      'Unlimited manual bookkeeping entries',
      'Basic Profit & Loss (P&L) dashboard views',
      '1 Independent Physical Cash Vault',
      'Basic local product catalog & sales summaries',
      'Standard customer care email support',
    ],
    cta: 'Join Waitlist',
    popular: false,
    discounted: false,
    url: '#waitlist-section',
  },

  pro: {
    name: 'Growing Merchant',
    description:
      'For established merchants who need more automation, more connected accounts, and a clearer view of a growing business.',
    price: {
      NGN: 7500,
      XOF: 2800,
    },
    yearlyPrice: {
      NGN: 75000,
      XOF: 28000,
    },
    originalPrice: {
      NGN: 15000,
      XOF: 5600,
    },
    features: [
      'Up to 2,500 automatically logged bank transactions monthly',
      '3 connected merchant bank accounts',
      'Multi-device alert syncing for shop assistants',
      'Live, instant Profit & Loss (P&L) dashboard views',
      'Automated inventory tracking & running-low stock alerts',
      'Deeper cash-flow visibility for daily operations',
      'Priority email & developer team chat support',
    ],
    cta: 'Lock In 50% Discount',
    popular: true,
    discounted: true,
    url: '#waitlist-section',
  },

  premium: {
    name: 'Borderless Pro',
    description:
      'For merchants operating across regions who need deeper financial visibility, multi-currency tracking, and intelligent reporting.',
    price: {
      NGN: 22500,
      XOF: 8500,
    },
    yearlyPrice: {
      NGN: 225000,
      XOF: 85000,
    },
    originalPrice: {
      NGN: 45000,
      XOF: 17000,
    },
    features: [
      'Unlimited monthly transactions across all channels',
      'Dual-Currency Ledger Engine (Naira ⇄ CFA Franc)',
      'Automated Parallel Market Rate Auto-Indexing',
      '1-Tap audit-ready financial statement exports (PDF/Excel)',
      'Custom AI Accounting Chatbot assistance',
      'Weekly AI Voice Report Card summaries (Pidgin or English)',
      'Dedicated account priority channels',
    ],
    cta: 'Lock In 50% Discount',
    popular: false,
    discounted: true,
    url: '#waitlist-section',
  },
};

const comparisonRows: Array<{
  feature: string;
  free: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
}> = [
  {
    feature: 'Automatic bank transaction logging',
    free: '30 free transactions / month',
    pro: 'Up to 2,500 / month',
    premium: 'Unlimited',
  },
  {
    feature: 'Bank Statement auto-parsing',
    free: 'Unlimited PDF / CSV',
    pro: 'Unlimited',
    premium: 'Unlimited',
  },
  {
    feature: 'Connected bank accounts',
    free: '1 account',
    pro: '3 accounts',
    premium: 'Unlimited',
  },
  {
    feature: 'Manual bookkeeping',
    free: 'Unlimited',
    pro: 'Unlimited',
    premium: 'Unlimited',
  },
  {
    feature: 'Physical Cash Vault',
    free: '1 profile',
    pro: 'Multiple',
    premium: 'Multiple',
  },
  {
    feature: 'Profit & Loss dashboard',
    free: 'Basic',
    pro: 'Live & instant',
    premium: 'Advanced',
  },
  {
    feature: 'Cash-flow visibility',
    free: 'Basic',
    pro: 'Detailed',
    premium: 'Advanced',
  },
  {
    feature: 'Product catalog & sales summaries',
    free: 'Basic',
    pro: 'Advanced',
    premium: 'Advanced',
  },
  {
    feature: 'Multi-device alert syncing',
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: 'Automated inventory tracking',
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: 'Running-low stock alerts',
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: 'Financial statement exports',
    free: false,
    pro: false,
    premium: 'PDF / Excel',
  },
  {
    feature: 'Dual-Currency Ledger',
    free: false,
    pro: false,
    premium: 'Naira ⇄ CFA Franc',
  },
  {
    feature: 'Parallel Market Rate Indexing',
    free: false,
    pro: false,
    premium: true,
  },
  {
    feature: 'AI Accounting Assistant',
    free: false,
    pro: false,
    premium: true,
  },
  {
    feature: 'AI Voice Reports',
    free: false,
    pro: false,
    premium: 'Pidgin / English',
  },
  {
    feature: 'Support',
    free: 'Standard email',
    pro: 'Priority email & chat',
    premium: 'Dedicated priority',
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriod>('monthly');

  const getPrice = (plan: Plan) => {
    const amount =
      billingPeriod === 'yearly'
        ? plan.yearlyPrice[currency]
        : plan.price[currency];

    const originalAmount =
      plan.originalPrice === null
        ? null
        : billingPeriod === 'yearly'
          ? plan.originalPrice[currency] * 10
          : plan.originalPrice[currency];

    return {
      amount,
      originalAmount,
      symbol: currency === 'NGN' ? '₦' : '',
      suffix: currency === 'XOF' ? ' CFA' : '',
      period: billingPeriod === 'yearly' ? '/year' : '/month',
    };
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] font-sans text-gray-900 antialiased selection:bg-emerald-900/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* Hero */}
        <section
          id="pricing"
          className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-24 lg:pt-36"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="pt-10 sm:pt-14 lg:pt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Pricing
                </span>

                <h1 className="mt-5 max-w-6xl text-[clamp(3.2rem,8vw,8rem)] font-bold leading-[0.88] tracking-[-0.065em] text-gray-950">
                  Financial intelligence
                  <br />
                  <span className="text-emerald-900">
                    that grows with you.
                  </span>
                </h1>
              </motion.div>

              <motion.div
                className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                }}
              >
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Pioneer cohort
                  </span>

                  <p className="mt-3 text-sm font-medium text-gray-900">
                    Early access pricing
                  </p>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Start with the core Monietar experience for free. As your
                  business grows, move into higher limits, deeper automation,
                  and more financial intelligence without changing how you
                  work.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-[1440px]">
            {/* Controls */}
            <motion.div
              className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-300 py-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Billing */}
              <div className="flex items-center gap-1">
                <span className="mr-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Billing
                </span>

                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    billingPeriod === 'monthly'
                      ? 'bg-emerald-900 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    billingPeriod === 'yearly'
                      ? 'bg-emerald-900 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Yearly
                </button>

                <span className="ml-2 text-[10px] font-medium text-emerald-900">
                  Save 17%
                </span>
              </div>

              {/* Currency */}
              <div className="flex items-center gap-1">
                <span className="mr-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Currency
                </span>

                <button
                  type="button"
                  onClick={() => setCurrency('NGN')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    currency === 'NGN'
                      ? 'bg-emerald-900 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  ₦ NGN
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency('XOF')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    currency === 'XOF'
                      ? 'bg-emerald-900 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  CFA XOF
                </button>
              </div>
            </motion.div>

            {/* Plan Cards */}
            <div className="mt-10 grid grid-cols-1 border-t border-gray-300 lg:grid-cols-3">
              {Object.entries(plans).map(([key, plan], index) => {
                const price = getPrice(plan);

                return (
                  <motion.div
                    key={key}
                    className={`flex h-full flex-col border-b border-gray-300 py-8 lg:min-h-[690px] lg:border-r lg:px-8 lg:py-10 ${
                      index === 2 ? 'lg:border-r-0' : ''
                    } ${
                      plan.popular
                        ? 'bg-[#f8faf9]'
                        : 'bg-white'
                    }`}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                    }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-gray-400">
                        0{index + 1}
                      </span>

                      {plan.popular && (
                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-900">
                          Most Popular
                        </span>
                      )}

                      {plan.discounted && !plan.popular && (
                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-900">
                          50% Waitlist
                        </span>
                      )}
                    </div>

                    {/* Plan Details */}
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold tracking-[-0.025em] text-gray-950">
                        {plan.name}
                      </h2>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mt-8 border-y border-gray-200 py-6">
                      {price.originalAmount !== null &&
                        price.originalAmount > 0 && (
                          <span className="block text-sm text-gray-400 line-through">
                            {price.symbol}
                            {price.originalAmount.toLocaleString()}
                            {price.suffix}
                          </span>
                        )}

                      <div className="mt-1 flex items-baseline">
                        <span className="text-4xl font-semibold tracking-[-0.04em] text-gray-950">
                          {price.symbol}
                          {price.amount.toLocaleString()}
                          {price.suffix}
                        </span>

                        <span className="ml-2 text-xs text-gray-400">
                          {price.period}
                        </span>
                      </div>

                      {billingPeriod === 'yearly' &&
                        price.amount > 0 && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-emerald-900">
                            Includes 2 months free
                          </p>
                        )}

                      {key === 'free' && (
                        <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                          No credit card required
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="mt-7 flex-1 space-y-3.5">
                      {plan.features.map(
                        (feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-start gap-3"
                            initial={{
                              opacity: 0,
                              x: -8,
                            }}
                            whileInView={{
                              opacity: 1,
                              x: 0,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              duration: 0.35,
                              delay:
                                featureIndex * 0.03,
                            }}
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-900" />

                            <span className="text-xs leading-5 text-gray-600">
                              {feature}
                            </span>
                          </motion.li>
                        ),
                      )}
                    </ul>

                    {/* CTA */}
                    <motion.a
                      href={plan.url}
                      whileHover={{
                        x: 3,
                      }}
                      className={`mt-8 flex w-full items-center justify-between border-t pt-4 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                        plan.popular
                          ? 'border-emerald-900 text-emerald-900'
                          : 'border-gray-300 text-gray-600 hover:border-emerald-900 hover:text-emerald-900'
                      }`}
                    >
                      <span>{plan.cta}</span>

                      <ArrowUpRight className="h-4 w-4" />
                    </motion.a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-[#f1f1f1] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]"
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  Compare plans
                </span>

                <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-950 sm:text-5xl">
                  Start with the core.
                  <br />
                  <span className="text-emerald-900">
                    Scale when you need more.
                  </span>
                </h2>
              </div>

              <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                Retail Starter gives you the core Monietar workflow from day
                one. Growing Merchant increases your automation and operating
                capacity, while Borderless Pro adds the tools needed for
                multi-currency and cross-region operations.
              </p>
            </motion.div>

            {/* Comparison Table */}
            <div className="mt-14 overflow-x-auto border-y border-gray-300">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:px-6">
                      Capability
                    </th>

                    <th className="px-4 py-5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:px-6">
                      Retail Starter
                    </th>

                    <th className="bg-emerald-900/[0.025] px-4 py-5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-900 sm:px-6">
                      Growing Merchant
                    </th>

                    <th className="px-4 py-5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:px-6">
                      Borderless Pro
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {comparisonRows.map((row, index) => (
                    <motion.tr
                      key={row.feature}
                      className="group transition-colors hover:bg-white/60"
                      initial={{
                        opacity: 0,
                      }}
                      whileInView={{
                        opacity: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.025,
                      }}
                    >
                      <td className="px-4 py-5 text-xs font-semibold text-gray-900 sm:px-6">
                        {row.feature}
                      </td>

                      <td className="px-4 py-5 text-center text-xs text-gray-500 sm:px-6">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-900" />
                          ) : (
                            <span className="text-gray-300">
                              —
                            </span>
                          )
                        ) : (
                          row.free
                        )}
                      </td>

                      <td className="bg-emerald-900/[0.025] px-4 py-5 text-center text-xs font-medium text-gray-700 sm:px-6">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-900" />
                          ) : (
                            <span className="text-gray-300">
                              —
                            </span>
                          )
                        ) : (
                          row.pro
                        )}
                      </td>

                      <td className="px-4 py-5 text-center text-xs text-gray-500 sm:px-6">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-900" />
                          ) : (
                            <span className="text-gray-300">
                              —
                            </span>
                          )
                        ) : (
                          row.premium
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Plan Progression */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              className="border-t border-gray-300 pt-8"
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                How the plans grow
              </span>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3">
                {/* Step 01 */}
                <div className="border-b border-gray-300 py-6 md:border-b-0 md:border-r md:pr-8">
                  <span className="font-mono text-[10px] tracking-widest text-gray-400">
                    01
                  </span>

                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-gray-950">
                    Experience Monietar
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Connect one bank account, automatically capture everyday
                    transactions, track cash, and start understanding your
                    business.
                  </p>
                </div>

                {/* Step 02 */}
                <div className="border-b border-gray-300 py-6 md:border-b-0 md:border-r md:px-8">
                  <span className="font-mono text-[10px] tracking-widest text-emerald-900">
                    02
                  </span>

                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-gray-950">
                    Automate more
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Connect more accounts, handle higher transaction volume,
                    sync shop assistants, and get deeper visibility into daily
                    operations.
                  </p>
                </div>

                {/* Step 03 */}
                <div className="py-6 md:pl-8">
                  <span className="font-mono text-[10px] tracking-widest text-gray-400">
                    03
                  </span>

                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-gray-950">
                    Go borderless
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Manage multiple currencies, monitor market rates, generate
                    financial reports, and use deeper AI-powered intelligence.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom Note */}
        <section className="bg-[#f1f1f1] px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-6 border-t border-gray-300 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                  Read-only security
                </span>

                <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                  No transaction manipulation
                </span>

                <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                  Offline transaction syncing
                </span>
              </div>

              <p className="max-w-md text-[10px] leading-5 text-gray-400 md:text-right">
                * Subscriptions are processed in local currency.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}