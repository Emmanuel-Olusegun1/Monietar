'use client'

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';

export default function Pricing() {

    const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');


  return (

<section id="pricing" className="py-16 px-4 bg-gray-50">
  <div className="container mx-auto max-w-7xl">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the plan that works for your business needs.</p>
      
      {/* Currency Toggle */}
      <div className="flex justify-center mt-8">
        <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setCurrency('NGN')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              currency === 'NGN' 
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nigeria (₦)
          </button>
          <button
            onClick={() => setCurrency('XOF')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              currency === 'XOF' 
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Benin Republic (CFA)
          </button>
        </div>
      </div>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Free Plan */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Forever</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {currency === 'NGN' ? '₦0' : '0 CFA'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-gray-600 mt-2">Perfect for getting started</p>
        </div>
        <ul className="space-y-4 mb-8">
          {['Real-time tracking of income and expenses.', 'Create and manage budgets for specific categories or periods', 'Alerts for overspending or nearing budget limits', 'AI-generated reports on cash flow trends, forecasts, and anomalies', 'AI recommendations for cost-saving and revenue optimization', 'Multi-language support(English, French, Swahili, Yoruba,etc.)', 'Email support', '1 business account'].map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors">
          Get Started Free
        </button>
      </motion.div>
      
      {/* Pro Plan - Coming Soon */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-500 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg">
          COMING SOON
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {currency === 'NGN' ? '₦5,000' : '8,000 CFA'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-gray-600 mt-2">For growing businesses</p>
          {currency === 'XOF' && (
            <p className="text-sm text-emerald-600 mt-1">≈ ₦5,000</p>
          )}
        </div>
        <ul className="space-y-4 mb-8">
          {['Everything in Free', 'Advanced AI analytics & reports','Seamless integration with accounting software', 'Customizable Dashboards', 'Multi-business management', 'Priority support', 'Custom financial goals', 'Export capabilities'].map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-gray-300 text-gray-600 font-medium py-3 rounded-lg cursor-not-allowed">
          Coming Soon
        </button>
      </motion.div>
      
      {/* Business Plan - Coming Soon */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg">
          COMING SOON
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {currency === 'NGN' ? '₦12,000' : '19,200 CFA'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-gray-600 mt-2">For established Enterprises</p>
          {currency === 'XOF' && (
            <p className="text-sm text-emerald-600 mt-1">≈ ₦12,000</p>
          )}
        </div>
        <ul className="space-y-4 mb-8">
          {['Everything in Pro', 'Unlimited business accounts', 'Real-time currency conversion.', 'Bank API integration', 'Team collaboration', 'White-label reports'].map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-gray-300 text-gray-600 font-medium py-3 rounded-lg cursor-not-allowed">
          Coming Soon
        </button>
      </motion.div>
    </div>
    
    {/* Currency Note */}
    <div className="text-center mt-12">
      <p className="text-gray-600 text-sm">
        * Prices in CFA Francs are approximate. Actual charges will be processed in your local currency.
        {currency === 'XOF' && ' 1 CFA ≈ 0.625 NGN'}
      </p>
    </div>
  </div>
</section>

  );
}