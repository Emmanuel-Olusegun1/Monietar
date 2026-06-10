'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Pricing() {
  const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Retail Starter',
      description: 'Perfect for everyday retail store owners replacing their paper notebooks with a clean digital ledger.',
      price: { NGN: 0, XOF: 0 },
      yearlyPrice: { NGN: 0, XOF: 0 },
      features: [
        'Manual bookkeeping record entries (Unlimited rows)',
        'Basic Profit & Loss (P&L) manual dashboard views',
        '1 Independent Physical Cash Vault tracking profile',
        'Basic local product catalog & sales summary views',
        'Standard customer care email channels',
      ],
      cta: 'Join Waitlist - Get Free Access',
      popular: false,
      discounted: false,
      originalPrice: null,
      url: '#waitlist-section', // Anchor link scrolling to your final waitlist CTA form
    },
    pro: {
      name: 'Growing Merchant',
      description: 'Built for established merchants managing multiple store assistants and high daily alert counts.',
      price: { NGN: 7500, XOF: 2800 }, // Localized approximate CFA conversion included
      yearlyPrice: { NGN: 75000, XOF: 28000 },
      originalPrice: { NGN: 15000, XOF: 5600 },
      features: [
        'Auto-log up to 2,500 bank transfers or cash sales monthly via API listeners',
        'Unlimited Connected Core Merchant Bank Accounts',
        'Multi-Device Alert Syncing for shop floor assistants',
        'Live, instant Profit & Loss (P&L) automated dashboard views',
        'Automated Inventory Sourcing & running low-stock alerts',
        'Priority email & developer team chat support',
      ],
      cta: 'Lock In 50% Discount',
      popular: true,
      discounted: true,
      url: '#waitlist-section',
    },
    premium: {
      name: 'Borderless Pro',
      description: 'Engineered specifically for merchants sourcing or selling goods simultaneously across regions.',
      price: { NGN: 22500, XOF: 8500 },
      yearlyPrice: { NGN: 225000, XOF: 85000 },
      originalPrice: { NGN: 45000, XOF: 17000 },
      features: [
        'Unlimited Monthly Transactions across all background API tracking channels',
        'Dual-Currency Ledger Engine (Naira ⇄ CFA Franc)',
        'Automated Parallel Market Rate Auto-Indexing API synchronization',
        '1-Tap Audit-Ready Financial Statement Exports (PDF/Excel)',
        'Custom AI Accounting Chatbot assistance & hands-free parsing analytics',
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
    const amount = billingPeriod === 'yearly' ? plan.yearlyPrice[currency] : plan.price[currency];
    const originalAmount = plan.originalPrice ? (billingPeriod === 'yearly' ? plan.originalPrice[currency] * 10 : plan.originalPrice[currency]) : null;

    return {
      amount,
      originalAmount,
      symbol: currency === 'NGN' ? '₦' : '',
      suffix: currency === 'XOF' ? ' CFA' : '',
      period: billingPeriod === 'yearly' ? '/year' : '/month',
    };
  };

  return (
    <section id="pricing" className="py-10 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-300">Pioneer Cohort Access</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Premium Financial Tools.
            <span className="text-emerald-400 block mt-2">Free &amp; 50% Waitlist Tiers</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Monietar scales directly alongside your real business growth. Join the waitlist today to lock in your foundational early-bird pricing tokens.
          </motion.p>

          {/* Controls */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Billing Toggle */}
            <div className="bg-gray-900 rounded-2xl p-1.5 shadow-xl border border-gray-800 inline-flex">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-emerald-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-emerald-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                Yearly <span className="text-emerald-950 ml-1 font-bold bg-emerald-300/60 px-1.5 py-0.5 rounded text-xs">Save 17%</span>
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="bg-gray-900 rounded-2xl p-1.5 shadow-xl border border-gray-800 inline-flex">
              <button
                type="button"
                onClick={() => setCurrency('NGN')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currency === 'NGN' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                ₦ NGN
              </button>
              <button
                type="button"
                onClick={() => setCurrency('XOF')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currency === 'XOF' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                CFA XOF
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {Object.entries(plans).map(([key, plan], index) => {
            const price = getPrice(key as keyof typeof plans);
            return (
              <motion.div
                key={key}
                className={`group relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Popular Plan Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-black text-xs font-black px-6 py-1.5 rounded-full shadow-lg tracking-wider">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* 50% Off Waitlist Identifier Badge */}
                {plan.discounted && !plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                    <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                      50% WAITLIST OFF
                    </div>
                  </div>
                )}

                <div
                  className={`relative rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                    plan.popular
                      ? 'border-emerald-500 bg-gradient-to-b from-gray-900 via-zinc-950 to-black shadow-2xl shadow-emerald-500/5'
                      : 'border-gray-800 bg-gradient-to-b from-gray-900 to-black hover:border-emerald-500/40'
                  }`}
                >
                  {/* Hover Shine Background Accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className={`text-2xl font-bold mb-3 ${plan.popular ? 'text-emerald-400' : 'text-white'}`}>
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm min-h-[40px] leading-relaxed px-2">{plan.description}</p>

                      {/* Price Display */}
                      <div className="mt-8">
                        <div className="flex flex-col items-center justify-center">
                          {/* Strike-through original price context for verification */}
                          {price.originalAmount !== null && price.originalAmount > 0 && (
                            <span className="text-gray-500 text-lg line-through font-medium tracking-tight mb-1">
                              {price.symbol}{price.originalAmount.toLocaleString()}{price.suffix}
                            </span>
                          )}
                          <div className="flex items-baseline justify-center">
                            <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? 'text-emerald-400' : 'text-white'}`}>
                              {price.symbol}{price.amount.toLocaleString()}{price.suffix}
                            </span>
                            <span className="text-gray-400 ml-2 text-sm font-medium">{price.period}</span>
                          </div>
                        </div>

                        {/* Savings Badge */}
                        {billingPeriod === 'yearly' && price.amount > 0 && (
                          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/20">
                            <span>💰</span> Includes 2 Months Free Sourcing
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4 mb-8 min-h-[260px]">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.05 + index * 0.1 }}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              plan.popular ? 'bg-emerald-500' : 'bg-emerald-500/20'
                            }`}
                          >
                            <svg className={`w-3 h-3 ${plan.popular ? 'text-black' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed text-left">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Action Form Directing To Waitlist Anchor Link */}
                    <motion.a
                      href={plan.url}
                      className={`block text-center w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                        plan.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/15 hover:scale-[1.02]'
                          : 'bg-gray-800 hover:bg-emerald-500 text-white hover:text-black border border-gray-700 hover:border-emerald-500 hover:scale-[1.02]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.cta}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Unified Bottom Info Card */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 max-w-2xl mx-auto">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">All infrastructure accounts include:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                Bank-level read-only security
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                Zero transaction manipulation architecture
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                Offline transaction listener syncing
              </div>
            </div>
          </div>

          {/* Local Exchange Operational Margin Note */}
          <p className="text-gray-500 text-xs mt-8">
            * Subscriptions are processed in local currency. Parallel currency index pricing maps onto exact banking api conversion intervals.
            {currency === 'XOF' && ' Current corridor reference rate: 1 XOF ≈ 2.61 NGN.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
