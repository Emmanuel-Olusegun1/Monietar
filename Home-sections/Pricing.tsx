'use client'

import { motion } from 'framer-motion';
import { url } from 'inspector';
import { useState } from 'react';

export default function Pricing() {
  const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Starter',
      description: 'Essential financial tools for small businesses',
      price: { NGN: 0, XOF: 0 },
      yearlyPrice: { NGN: 0, XOF: 0 },
      features: [
        'Real-time income & expense tracking',
        'Basic budget management',
        'Overspending alerts',
        'Cash flow trend reports',
        'Basic AI recommendations',
        'Email support',
        '1 business account',
      ],
      cta: 'Get Started Free',
      popular: true,
      comingSoon: false,
      url: '/auth/signin'
    },
    pro: {
      name: 'Professional',
      description: 'Advanced tools for growing businesses',
      price: { NGN: 5000, XOF: 5000 },
      yearlyPrice: { NGN: 50000, XOF: 50000 },
      features: [
        'Everything in Starter',
        'Advanced budget analytics',
        'Custom financial goals',
        'Predictive forecasting',
        'Revenue optimization',
        'Accounting software integration',
        'Export capabilities',
        'Customizable dashboards',
        'Priority email & chat support',
        'Up to 3 business accounts'
      ],
      cta: 'Coming Soon',
      popular: false,
      comingSoon: true,
      url: ''
    },
    premium: {
      name: 'Enterprise',
      description: 'Complete financial platform for established businesses',
      price: { NGN: 12000, XOF: 12000 },
      yearlyPrice: { NGN: 120000, XOF: 120000 },
      features: [
        'Everything in Professional',
        'Unlimited transaction history',
        'Advanced cash flow analysis',
        'Custom AI models',
        'Advanced scenario planning',
        'Real-time market insights',
        'Bank API integration',
        'Multiple accounting platforms',
        'Custom API access',
        'White-label reports',
        'Executive dashboards',
        'Team collaboration',
        'Dedicated account manager',
        '24/7 priority support',
        'Unlimited business accounts',
        'Real-time currency conversion',
        'Multi-currency accounts',
        'SOC 2 compliance'
      ],
      cta: 'Coming Soon',
      popular: false,
      comingSoon: true,
      url: ''
    }
  };

  const getPrice = (plan: keyof typeof plans) => {
    const priceData = plans[plan];
    const amount = billingPeriod === 'yearly' ? priceData.yearlyPrice[currency] : priceData.price[currency];
    return {
      amount,
      symbol: currency === 'NGN' ? '₦' : '',
      suffix: currency === 'XOF' ? ' CFA' : '',
      period: billingPeriod === 'yearly' ? '/year' : '/month'
    };
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Luxury Green Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-green-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-400/5 to-green-500/10 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
        </div>

        {/* Accent Lines */}
        <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-emerald-500/40 to-transparent"></div>
        <div className="absolute bottom-20 right-10 w-px h-32 bg-gradient-to-t from-emerald-500/30 to-transparent"></div>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-300">Transparent Pricing</span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose Your
            <span className="text-emerald-400 block">Financial Plan</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Scale your financial management with our flexible pricing plans
          </motion.p>

          {/* Controls */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Billing Toggle */}
            <div className="bg-gray-900 rounded-2xl p-2 shadow-xl border border-gray-800 inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-emerald-500 text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                  billingPeriod === 'yearly' 
                    ? 'bg-emerald-500 text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                Yearly <span className="text-emerald-400 ml-1">Save 17%</span>
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="bg-gray-900 rounded-2xl p-2 shadow-xl border border-gray-800 inline-flex">
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currency === 'NGN' 
                    ? 'bg-emerald-500 text-black' 
                    : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                ₦ NGN
              </button>
              <button
                onClick={() => setCurrency('XOF')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currency === 'XOF' 
                    ? 'bg-emerald-500 text-black' 
                    : 'text-gray-400 hover:text-white bg-transparent'
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
                className={`group relative ${
                  plan.popular ? 'lg:-mt-4 lg:mb-4' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Popular Plan Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-black text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Coming Soon Badge */}
                {plan.comingSoon && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gray-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                      COMING SOON
                    </div>
                  </div>
                )}

                <div className={`relative rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                  plan.popular 
                    ? 'border-emerald-500 bg-gradient-to-b from-gray-900 to-black shadow-2xl' 
                    : 'border-gray-800 bg-gradient-to-b from-gray-900 to-black hover:border-emerald-400/50'
                }`}>
                  {/* Green Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className={`text-2xl font-bold mb-3 ${
                        plan.popular ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                      
                      {/* Price Display */}
                      <div className="mt-8">
                        <div className="flex items-baseline justify-center">
                          <span className={`text-5xl font-bold ${
                            plan.popular ? 'text-emerald-400' : 'text-white'
                          }`}>
                            {price.symbol}{price.amount?.toLocaleString()}{price.suffix}
                          </span>
                          <span className="text-gray-400 ml-2 text-lg">{price.period}</span>
                        </div>
                        
                        {/* Savings Badge */}
                        {billingPeriod === 'yearly' && price.amount && price.amount > 0 && (
                          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm">
                            <span>💰</span>
                            Save 2 months free
                          </div>
                        )}
                        
                        {/* Currency Conversion
                        {currency === 'XOF' && price.amount && price.amount > 0 && (
                          <p className="text-gray-500 text-sm mt-2">
                            ≈ ₦{plan.price.NGN.toLocaleString()} monthly
                          </p>
                        )} */}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.05 + index * 0.1 }}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'bg-emerald-500' : 'bg-emerald-500/20'
                          }`}>
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        plan.comingSoon
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg hover:shadow-emerald-500/25 hover:scale-105'
                          : 'bg-gray-800 hover:bg-emerald-500 text-white hover:text-black border border-gray-700 hover:border-emerald-500'
                      }`}
                      whileHover={plan.comingSoon ? {} : { scale: 1.02 }}
                      whileTap={plan.comingSoon ? {} : { scale: 0.98 }}
                      disabled={plan.comingSoon}
                    >
                      <a href={plan.url}>
                      {plan.cta}
                      </a>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-white mb-4">All plans include:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Bank-level security
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                99.9% uptime SLA
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Regular updates
              </div>
            </div>
          </div>

          {/* Currency Note */}
          <p className="text-gray-500 text-sm mt-8">
            * Prices in CFA Francs are approximate. Actual charges will be processed in your local currency.
            {currency === 'XOF' && ' 1 CFA ≈ 2.61 NGN'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}