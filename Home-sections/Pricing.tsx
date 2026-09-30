'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';

export default function Pricing() {
  const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');
  const [billingPeriod, setBillingPeriod] =
    useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Retail Starter',
      description:
        'The essential Monietar experience for everyday merchants who want to move beyond notebooks and start understanding their money.',
      price: { NGN: 0, XOF: 0 },
      yearlyPrice: { NGN: 0, XOF: 0 },
      originalPrice: null,
      features: [
        '1 connected merchant bank account',
        '30 free auto-logged transactions',
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
      price: { NGN: 7500, XOF: 2800 },
      yearlyPrice: { NGN: 75000, XOF: 28000 },
      originalPrice: { NGN: 15000, XOF: 5600 },
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
      price: { NGN: 22500, XOF: 8500 },
      yearlyPrice: { NGN: 225000, XOF: 85000 },
      originalPrice: { NGN: 45000, XOF: 17000 },
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

  const getPrice = (planKey: keyof typeof plans) => {
    const plan = plans[planKey];

    const amount =
      billingPeriod === 'yearly'
        ? plan.yearlyPrice[currency]
        : plan.price[currency];

    const originalAmount = plan.originalPrice
      ? billingPeriod === 'yearly'
        ? plan.originalPrice[currency] * 10
        : plan.originalPrice[currency]
      : null;

    return {
      amount,
      originalAmount,
      symbol: currency === 'NGN' ? '₦' : '',
      suffix: currency === 'XOF' ? ' CFA' : '',
      period: billingPeriod === 'yearly' ? '/year' : '/month',
    };
  };

  return (
    <section
      id="pricing"
      className="bg-[#f1f1f1] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="pt-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Pricing
            </span>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl">
              Financial intelligence that
              <span className="text-emerald-900"> grows with you.</span>
            </h2>

            <p className="max-w-sm text-sm leading-6 text-gray-500 md:text-right">
              Start with the core Monietar experience and increase your
              automation, capacity, and financial intelligence as your
              business grows.
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-gray-300 py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Billing */}
          <div className="flex items-center gap-1">
            <span className="mr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
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
            <span className="mr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
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

        {/* Pricing Grid */}
        <div className="mt-10 grid grid-cols-1 border-t border-gray-300 lg:grid-cols-3">
          {Object.entries(plans).map(([key, plan], index) => {
            const price = getPrice(key as keyof typeof plans);

            return (
              <motion.div
                key={key}
                className={`flex h-full flex-col border-b border-gray-300 py-8 lg:min-h-[650px] lg:border-r lg:px-7 lg:py-9 ${
                  index === 2 ? 'lg:border-r-0' : ''
                } ${plan.popular ? 'bg-white/40' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
              >
                {/* Plan Meta */}
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

                {/* Plan Header */}
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.025em] text-gray-950">
                    {plan.name}
                  </h3>

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

                  {billingPeriod === 'yearly' && price.amount > 0 && (
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
                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: featureIndex * 0.03,
                      }}
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-900" />

                      <span className="text-xs leading-5 text-gray-600">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.a
                  href={plan.url}
                  whileHover={{ x: 3 }}
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

        {/* Plan Progression */}
        <motion.div
          className="mt-10 grid border-y border-gray-300 md:grid-cols-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="border-b border-gray-300 px-5 py-5 md:border-b-0 md:border-r md:px-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Start
            </span>

            <p className="mt-2 text-sm font-medium text-gray-900">
              Experience Monietar
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Connect your first account and start building a clearer picture
              of your business.
            </p>
          </div>

          <div className="border-b border-gray-300 px-5 py-5 md:border-b-0 md:border-r md:px-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-900">
              Grow
            </span>

            <p className="mt-2 text-sm font-medium text-gray-900">
              Automate more
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Connect more accounts, handle more activity, and get deeper
              operational visibility.
            </p>
          </div>

          <div className="px-5 py-5 md:px-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Expand
            </span>

            <p className="mt-2 text-sm font-medium text-gray-900">
              Go borderless
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Manage multi-currency activity, financial reporting, and
              cross-region business intelligence.
            </p>
          </div>
        </motion.div>

        {/* Infrastructure Note */}
        <motion.div
          className="mt-8 flex flex-col gap-4 border-t border-gray-300 pt-6 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
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

          <p className="text-[10px] leading-5 text-gray-400 md:text-right">
            * Subscriptions are processed in local currency.
            {currency === 'XOF' &&
              ' Current corridor reference rate: 1 XOF ≈ 2.61 NGN.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
