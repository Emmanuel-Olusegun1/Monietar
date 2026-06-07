'use client';

import { Newspaper, Bell } from 'lucide-react';

export default function BlogPostsGrid() {
  return (
    <section className="py-24 bg-slate-50/40 border-t border-slate-200/60">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Simple Centered Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            The Monietar Editorial Room
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Latest Articles & Insights
          </h2>
        </div>

        {/* Premium Coming Soon Placeholder Card */}
        <div className="bg-white border border-slate-200 p-8 sm:p-16 rounded-xl text-center max-w-2xl mx-auto">
          {/* Accent Graphical Emblem */}
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Newspaper className="w-6 h-6 stroke-[1.75]" />
          </div>
          
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">
            Our editorial framework is warming up.
          </h3>
          
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
            We are busy engineering the core ledger systems right now. Deep-dive technical documentation, building-in-public breakdowns, and platform changelogs will start streaming here soon.
          </p>

          {/* Inline Micro Banner / Notice */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-600 tracking-tight">
            <Bell className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Keep an eye on our primary waitlist for immediate updates.
          </div>
        </div>

      </div>
    </section>
  );
}
