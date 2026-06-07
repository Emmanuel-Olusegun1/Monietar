'use client';

import { Smartphone, ShieldCheck, Cpu } from 'lucide-react';

export default function TapHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#FCFCFD]">
      {/* Background radial soft light gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/[0.02] rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text: Hardware Positioning */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase mx-auto lg:mx-0">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" /> Introducing Monietar TAP
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
              The smart terminal <br className="hidden sm:inline" />built for standalone <br className="hidden sm:inline" />ledger power.
            </h1>
            
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A premium, smartphone-class hardware terminal crafted for modern African commerce. Accept card payments, instantly log multi-currency variables, and stream synchronized transactions straight to your core cloud ledger over native cellular networks.
            </p>

            {/* Quick Micro Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                <Cpu className="w-4 h-4 text-slate-400" /> Custom Secure OS
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> PCI-PTS 6.x Compliant
              </span>
            </div>
          </div>

          {/* Right Column: Premium High-Fidelity Smartphone Mock Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-64 h-[500px] sm:w-72 sm:h-[560px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-900 relative ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden group select-none">
              
              {/* Phone Speaker Dynamic Island Notch */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800/80 absolute left-3" />
              </div>

              {/* Dynamic OS UI Content Container */}
              <div className="w-full h-full bg-[#FCFCFD] rounded-[36px] overflow-hidden relative flex flex-col justify-between p-5 pt-8 text-slate-900 font-sans z-10 border border-slate-900/5">
                
                {/* Simulated In-Device UI App Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">MONIETAR TAP</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Simulated Core UI Numerical Layout */}
                <div className="my-auto text-center space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">READY TO CHARGE</span>
                  <div className="text-3xl font-black text-slate-950 tracking-tight">₦75,000.00</div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">USD Conversion Available</span>
                </div>

                {/* Simulated Physical NFC Sensor Vector */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-slate-400">
                    <Smartphone className="w-4 h-4 stroke-[2]" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 leading-tight">
                    Tap Card or Device to Sync Ledger
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
