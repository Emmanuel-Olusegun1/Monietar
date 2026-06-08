'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, X, HelpCircle, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter Ledger',
      price: 'Free',
      description: 'Essential digital ledger architecture for micro-merchants tracking daily cash flows.',
      features: [
        'Single User Workspace',
        'Core Cash Flow Tracking',
        'Local Device Storage Sync',
        'Standard 24-Hour Sync Windows',
        'Basic Performance Reports'
      ],
      action: 'Get Started Free',
      accent: false
    },
    {
      name: 'Growth Platform',
      price: '₦7,500',
      period: '/mo',
      description: 'Advanced financial intelligence and multi-currency tools for scaling small businesses.',
      features: [
        'Up to 5 Team Workspaces',
        'Automated Cloud Syncing',
        'Multi-Currency Architecture',
        'AI-Driven Financial Intelligence',
        'Priority Technical Support'
      ],
      action: 'Start 14-Day Free Trial',
      accent: true
    },
    {
      name: 'TAP Hardware Layer',
      price: '₦35,000',
      period: ' one-time',
      description: 'Dedicated standalone utility hardware for operators running without smartphones.',
      features: [
        'Includes Monietar TAP Terminal',
        'Pre-installed Monietar LightOS',
        'Lifetime Workspace Licensing',
        'Low-Bandwidth Optimization',
        '12-Month Hardware Warranty'
      ],
      action: 'Order Hardware Terminal',
      accent: false
    }
  ];

  const comparisonRows = [
    { feature: 'Core Cloud Ledger Access', starter: true, growth: true, tap: true },
    { feature: 'Multi-Currency Support', starter: false, growth: true, tap: true },
    { feature: 'Realtime Cloud Backup', starter: 'Local Sync Only', growth: 'Instant Cloud', tap: 'Low-Bandwidth Mesh' },
    { feature: 'AI Financial Insights', starter: false, growth: true, tap: false },
    { feature: 'Team Management Matrix', starter: '1 User', growth: 'Up to 5 Users', tap: '1 Dedicated Terminal' },
    { feature: 'Hardware Utility Interfacing', starter: false, starterCross: true, growth: false, growthCross: true, tap: 'Dedicated Shell Included' },
    { feature: 'Customer Support Class', starter: 'Community', growth: 'Priority 24/7', tap: 'Dedicated Hardware Line' },
  ];

  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        
        {/* --- PRICING HERO --- */}
        <section className="relative pt-40 pb-16 bg-[#FCFCFD]">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
              Transparent Ecosystem Plans
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Predictable pricing for businesses <br />at any stage of infrastructure.
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
              Choose the digital tier that aligns with your operations—whether you need pure software optimization or dedicated offline-capable utility hardware.
            </p>
          </div>
        </section>

        {/* --- PRICING CARDS --- */}
        <section className="pb-20 bg-[#FCFCFD]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {tiers.map((tier, index) => (
                <div 
                  key={index}
                  className={`border rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-white shadow-sm transition-all relative ${
                    tier.accent 
                      ? 'border-emerald-500 ring-1 ring-emerald-500 md:scale-[1.03] z-10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tier.accent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                      Most Popular Plan
                    </span>
                  )}
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{tier.name}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-normal">{tier.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-2 border-y border-slate-100">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{tier.price}</span>
                      {tier.period && <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{tier.period}</span>}
                    </div>

                    <ul className="space-y-3.5">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm font-medium text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`mt-8 w-full font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all ${
                      tier.accent
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-[0.99]'
                        : 'bg-slate-900 hover:bg-slate-950 text-white shadow-sm active:scale-[0.99]'
                    }`}
                  >
                    {tier.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- DETAILED COMPARISON TABLE --- */}
        <section className="py-20 bg-slate-50/40 border-t border-slate-200/60">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Compare Plan Parameter Matrices
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-normal">
                Analyze operational boundaries, features, and infrastructural capacities across our stack.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm select-none">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <th className="p-4 sm:p-5 min-w-[220px]">Ecosystem Matrix</th>
                      <th className="p-4 sm:p-5 text-center">Starter</th>
                      <th className="p-4 sm:p-5 text-center">Growth</th>
                      <th className="p-4 sm:p-5 text-center">TAP Hardware</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {comparisonRows.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-slate-900 tracking-tight">
                          {row.feature}
                        </td>
                        
                        {/* Starter Value Column */}
                        <td className="p-4 sm:p-5 text-center text-slate-500">
                          {typeof row.starter === 'boolean' ? (
                            row.starter ? <Check className="w-4 h-4 text-emerald-500 mx-auto stroke-[3]" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : row.starter}
                        </td>
                        
                        {/* Growth Value Column */}
                        <td className="p-4 sm:p-5 text-center text-slate-600 font-medium">
                          {typeof row.growth === 'boolean' ? (
                            row.growth ? <Check className="w-4 h-4 text-emerald-500 mx-auto stroke-[3]" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : row.growth}
                        </td>
                        
                        {/* TAP Hardware Value Column */}
                        <td className="p-4 sm:p-5 text-center text-slate-600 font-medium bg-emerald-50/[0.01]">
                          {typeof row.tap === 'boolean' ? (
                            row.tap ? <Check className="w-4 h-4 text-emerald-500 mx-auto stroke-[3]" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                          ) : row.tap}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECURITY & INTEGRITY BANNER --- */}
        <section className="py-16 bg-white border-t border-slate-200/60 text-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Enterprise-Grade Ledger Guarantee
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
              Regardless of your operational configuration tier, all multi-currency accounts and business ledger records are fully encrypted and securely architecture-isolated to preserve extreme organizational privacy.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}