'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Smartphone, ShieldCheck, Cpu, Zap, Wifi, Radio, Eye } from 'lucide-react';

export default function MonietarTapPage() {
  const specs = [
    { label: "Display Module", value: "5.5-inch HD Touchscreen Interface (Corning Gorilla Glass)" },
    { label: "Operating System", value: "Monietar SecureOS (Isolated Ledger Environment)" },
    { label: "Data Pipelines", value: "Native 4G LTE Connectivity, Dual SIM Architecture & High-Speed Wi-Fi" },
    { label: "Security Layer", value: "PCI-PTS 6.x Certified, End-to-End Cryptographic Ledger Verification" },
    { label: "Power Battery", value: "5200mAh Lithium-Ion Core (Built to handle up to 18 operational hours)" },
    { label: "Weight Metric", value: "340g — Formed for daily micro-handling convenience" }
  ];

  const features = [
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

  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        {/* --- DEVICE HERO SECTION --- */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-[#FCFCFD]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-50% -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/[0.02] rounded-full blur-[140px]" />
          </div>

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
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

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                    <Cpu className="w-4 h-4 text-slate-400" /> Custom Secure OS
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> PCI-PTS 6.x Compliant
                  </span>
                </div>
              </div>

              {/* Smartphone Mock Frame Vector */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-64 h-[500px] sm:w-72 sm:h-[560px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-900 relative ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden select-none">
                  <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-800/80 absolute left-3" />
                  </div>

                  <div className="w-full h-full bg-[#FCFCFD] rounded-[36px] overflow-hidden relative flex flex-col justify-between p-5 pt-8 text-slate-900 font-sans z-10 border border-slate-900/5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">MONIETAR TAP</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="my-auto text-center space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">READY TO CHARGE</span>
                      <div className="text-3xl font-black text-slate-950 tracking-tight">₦75,000.00</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">USD Conversion Available</span>
                    </div>

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

        {/* --- CORE FEATURES SECTION --- */}
        <section className="py-20 bg-slate-50/40 border-t border-slate-200/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Integrated Ecosystem
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Hardware engineered cleanly <br />for high-intensity commerce.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feat, index) => (
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

        {/* --- TECHNICAL SPECIFICATIONS --- */}
        <section className="py-20 bg-white border-t border-slate-200/60">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Technical Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hardware Parameters
              </h2>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {specs.map((item, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 gap-2 sm:gap-6 items-start text-xs sm:text-sm"
                  >
                    <div className="sm:col-span-4 font-bold text-slate-900 tracking-tight">
                      {item.label}
                    </div>
                    <div className="sm:col-span-8 text-slate-500 font-normal leading-relaxed">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
