'use client';

import { CheckCircle2, Cpu, Terminal, ShieldAlert } from 'lucide-react';

export default function ApiHero() {
  return (
    <section className="relative pt-28 pb-12 overflow-hidden bg-[#FCFCFD]">
      {/* Background ambient depth blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/[0.015] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Content */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            Developer Framework
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Build on top of the Monietar ledger engine.
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Connect external cash points, query multi-currency logs, and push transactional metadata programmatically via our secure, RESTful API nodes.
          </p>
        </div>

        {/* Real-time System Health Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Core Engine</div>
              <div className="text-xs font-bold text-slate-800">Operational — 99.98%</div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-x border-slate-100 pt-3 sm:pt-0 sm:px-4">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sync Latency</div>
              <div className="text-xs font-bold text-slate-800">~140ms Global Delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-2">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Sandbox</div>
              <div className="text-xs font-bold text-slate-800">v1.1 Core Active</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
