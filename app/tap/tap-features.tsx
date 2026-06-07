'use client';

import { Wifi, Eye, Radio, Zap } from 'lucide-react';

const FEATURE_SET = [
  {
    icon: <Zap className="w-5 h-5 text-emerald-600" />,
    title: 'Instant Reconciliation',
    description: 'Every point-of-sale interaction triggers an automated transaction parsing pipeline, eliminating standard end-of-day bookkeeping tasks.'
  },
  {
    icon: <Wifi className="w-5 h-5 text-slate-600" />,
    title: 'Cellular & Offline Sync',
    description: 'Equipped with dual-SIM arrays and isolated internal caches. Transactions route seamlessly over cellular pools and log natively even when offline.'
  },
  {
    icon: <Radio className="w-5 h-5 text-slate-600" />,
    title: 'Unified Tap-to-Pay',
    description: 'Processes contactless cards, virtual digital tokens, and standard local banking transaction nodes natively through highly sensitive internal antennas.'
  },
  {
    icon: <Eye className="w-5 h-5 text-slate-600" />,
    title: 'Crystal Clear Display',
    description: 'A brilliant 5.5-inch smartphone screen engineered for robust interaction, delivering legible font sizing even in bright, direct operational sunlight.'
  }
];

export default function TapFeatures() {
  return (
    <section className="py-20 bg-slate-50/40 border-t border-slate-200/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            Integrated Ecosystem
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Hardware engineered cleanly <br />for high-intensity commerce.
          </h2>
        </div>

        {/* Feature Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURE_SET.map((feat, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
