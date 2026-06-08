'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Retail Starter',
      description: 'Perfect for everyday retail store owners replacing their paper notebooks with automation.',
      price: { NGN: 0, XOF: 0 },
      yearlyPrice: { NGN: 0, XOF: 0 },
      features: [
        'Auto-log up to 150 bank transfers or cash sales monthly',
        '1 Connected Core Bank Account',
        'Independent Physical Cash Vault tracking',
        'Weekly AI Voice Report Card (Pidgin or English)',
        'Email Support',
      ],
      cta: 'Join Waitlist - Get Free Access',
      popular: false,
      discounted: false,
      originalPrice: null,
      url: '#waitlist-section',
    },
    pro: {
      name: 'Growing Merchant',
      description: 'Built for established merchants managing multiple store assistants and high daily alert counts.',
      price: { NGN: 7500, XOF: 2800 },
      yearlyPrice: { NGN: 75000, XOF: 28000 },
      originalPrice: { NGN: 15000, XOF: 5600 },
      features: [
        'Auto-log up to 2,500 transactions monthly',
        'Unlimited Connected Bank Accounts',
        'Multi-Device Alert Syncing for shop assistants',
        'Live, instant Profit & Loss (P&L) dashboard views',
        'Automated Inventory Sourcing & stock alerts',
        'Priority email & chat support',
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
        'Unlimited Monthly Transactions across all channels',
        'Dual-Currency Ledger Engine (Naira ⇄ CFA Franc)',
        'Automated Parallel Market Rate Auto-Indexing',
        '1-Tap Audit-Ready Financial Statement Exports (PDF/Excel)',
        'Custom AI Accounting Chatbot assistance',
        'Dedicated account priority channels',
      ],
      cta: 'Lock In 50% Discount',
      popular: false,
      discounted: true,
      url: '#waitlist-section',
    },
  };

  const comparisonRows = [
    { feature: 'Monthly Transaction Limit', free: 'Up to 150', pro: 'Up to 2,500', premium: 'Unlimited' },
    { feature: 'Connected Bank Accounts', free: '1 Account', pro: 'Unlimited', premium: 'Unlimited' },
    { feature: 'Physical Cash Vault Tracking', free: true, pro: true, premium: true },
    { feature: 'AI Voice Report Card (Pidgin/Eng)', free: true, pro: true, premium: true },
    { feature: 'Shop Assistant Multi-Device Sync', free: false, pro: true, premium: true },
    { feature: 'Live Profit & Loss (P&L) View', free: true, pro: true, premium: true },
    { feature: 'Inventory Sourcing & Alerts', free: false, pro: true, premium: true },
    { feature: 'Dual-Currency Ledger Engine', free: false, pro: false, premium: 'Naira ⇄ CFA Franc' },
    { feature: 'Parallel Market Auto-Indexing', free: false, pro: false, premium: true },
    { feature: '1-Tap Financial Exports (PDF/Excel)', free: false, pro: true, premium: true },
    { feature: 'Custom AI Accounting Chatbot', free: false, pro: false, premium: true },
    { feature: 'Support Tier', free: 'Email Support', pro: 'Priority Email & Chat', premium: 'Dedicated Priority Channels' },
  ];

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
    <div className="bg-slate-50 text-slate-700 min-h-screen font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-700 flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        
        {/* --- HERO & PRICING SELECTION SECTION --- */}
        <section id="pricing" className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-45">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(226,232,240,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.8)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,white,transparent)]"></div>
            </div>
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-emerald-700">Pioneer Cohort Access</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                Premium Financial Tools.
                <span className="text-emerald-600 block mt-2">Free &amp; 50% Waitlist Tiers</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Monietar scales directly alongside your real business growth. Join the waitlist today to lock in your foundational early-bird pricing tokens.
              </p>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                {/* Billing Toggle */}
                <div className="bg-slate-100 rounded-2xl p-1.5 shadow-sm border border-slate-200 inline-flex">
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      billingPeriod === 'monthly'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-800 bg-transparent'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      billingPeriod === 'yearly'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-800 bg-transparent'
                    }`}
                  >
                    Yearly <span className="text-emerald-700 ml-1 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded text-xs">Save 17%</span>
                  </button>
                </div>

                {/* Currency Toggle */}
                <div className="bg-slate-100 rounded-2xl p-1.5 shadow-sm border border-slate-200 inline-flex">
                  <button
                    type="button"
                    onClick={() => setCurrency('NGN')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      currency === 'NGN' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800 bg-transparent'
                    }`}
                  >
                    ₦ NGN
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('XOF')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      currency === 'XOF' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800 bg-transparent'
                    }`}
                  >
                    CFA XOF
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {Object.entries(plans).map(([key, plan], index) => {
                const price = getPrice(key as keyof typeof plans);
                return (
                  <div
                    key={key}
                    className={`group relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                  >
                    {/* Popular Plan Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-black px-6 py-1.5 rounded-full shadow-md tracking-wider">
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {/* 50% Off Waitlist Identifier Badge */}
                    {plan.discounted && !plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-5 py-1.5 rounded-full shadow-sm bg-opacity-10">
                          50% WAITLIST OFF
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                        plan.popular
                          ? 'border-emerald-500 bg-white shadow-2xl shadow-emerald-900/5'
                          : 'border-slate-200 bg-slate-50/50 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-green-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative p-8">
                        {/* Plan Header */}
                        <div className="text-center mb-8">
                          <h3 className={`text-2xl font-black mb-3 ${plan.popular ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {plan.name}
                          </h3>
                          <p className="text-slate-500 text-sm min-h-[40px] leading-relaxed px-2">{plan.description}</p>

                          {/* Price Display */}
                          <div className="mt-8">
                            <div className="flex flex-col items-center justify-center">
                              {price.originalAmount !== null && price.originalAmount > 0 && (
                                <span className="text-slate-400 text-lg line-through font-medium tracking-tight mb-1">
                                  {price.symbol}{price.originalAmount.toLocaleString()}{price.suffix}
                                </span>
                              )}
                              <div className="flex items-baseline justify-center">
                                <span className={`text-5xl font-black tracking-tight ${plan.popular ? 'text-emerald-600' : 'text-slate-900'}`}>
                                  {price.symbol}{price.amount.toLocaleString()}{price.suffix}
                                </span>
                                <span className="text-slate-400 ml-2 text-sm font-medium">{price.period}</span>
                              </div>
                            </div>

                            {billingPeriod === 'yearly' && price.amount > 0 && (
                              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                                <span>💰</span> Includes 2 Months Free Sourcing
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-4 mb-8 min-h-[240px]">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  plan.popular ? 'bg-emerald-600' : 'bg-emerald-100'
                                }`}
                              >
                                <svg className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-slate-600 text-sm leading-relaxed text-left font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <a
                          href={plan.url}
                          className={`block text-center w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                            plan.popular
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/15 hover:scale-[1.02]'
                              : 'bg-slate-800 hover:bg-emerald-600 text-white border border-slate-700 hover:border-emerald-600 hover:scale-[1.02]'
                          }`}
                        >
                          {plan.cta}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- FEATURE COMPARISON MATRIX TABLE --- */}
        <section className="py-20 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Compare Plan Parameter Matrices
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Analyze operational boundaries, platform configurations, and architectural parameters across plans.
              </p>
            </div>

            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-5 min-w-[260px]">Plan Metrics</th>
                      <th className="p-5 text-center">Retail Starter</th>
                      <th className="p-5 text-center text-emerald-600">Growing Merchant</th>
                      <th className="p-5 text-center">Borderless Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-600">
                    {comparisonRows.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 font-bold text-slate-800 tracking-tight">
                          {row.feature}
                        </td>
                        
                        {/* Retail Starter Check/Value */}
                        <td className="p-5 text-center text-slate-500 font-medium">
                          {typeof row.free === 'boolean' ? (
                            row.free ? <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : row.free}
                        </td>
                        
                        {/* Growing Merchant Check/Value */}
                        <td className="p-5 text-center font-semibold bg-emerald-50/[0.15]">
                          {typeof row.pro === 'boolean' ? (
                            row.pro ? <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : row.pro}
                        </td>
                        
                        {/* Borderless Pro Check/Value */}
                        <td className="p-5 text-center font-medium">
                          {typeof row.premium === 'boolean' ? (
                            row.premium ? <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : row.premium}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* --- UNIFIED BOTTOM INFOCARD & NOTES --- */}
        <section className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="container mx-auto max-w-7xl text-center">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-3xl mx-auto shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 tracking-wider uppercase mb-4 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> All infrastructure accounts include:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Bank-level read-only security
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Zero transaction manipulation
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Offline transaction listener syncing
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs mt-8 max-w-2xl mx-auto font-medium">
              * Subscriptions are processed in local currency. Parallel currency index pricing maps onto exact banking api conversion intervals.
              {currency === 'XOF' && ' Current corridor reference rate: 1 XOF ≈ 2.61 NGN.'}
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}