'use client';

import { ArrowUpRight, Users2 } from 'lucide-react';

export default function CareersOpenings() {
  return (
    <section id="open-positions" className="py-24 bg-slate-50/40 scroll-mt-20">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            Join Algoritic Inc Ecosystem
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Open Opportunities
          </h2>
        </div>

        {/* Dynamic Empty State Callout Card */}
        <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-sm text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users2 className="w-5 h-5 text-slate-400" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
            We are currently running a lean, focused ship.
          </h3>
          
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
            While we don't have any specific open seats at this exact moment, we are always built to scale. If you are an exceptional engineer, designer, or product strategist who operates with high autonomy, we'd love to know who you are.
          </p>

          {/* Core Action Button */}
          <div className="inline-block">
            <a 
              href="mailto:careers@algoritic.com" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
             Drop us a message <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
