'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Terminal, Code2, AlertCircle } from 'lucide-react';

export default function PureApiComingSoonPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between relative">
      
      {/* Platform Brand Header Navigation */}
      <Header />

      {/* Main Content Stage */}
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 relative overflow-hidden">
        
        {/* Premium organic background ambient blurs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-200/40 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Passive Status Context */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5 stroke-[2.5]" /> API Reference
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Platform protocols <br />are provisioning.
                </h1>
              </div>
              
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
                We are actively designing and engineering the core multi-currency ledger structures. Public REST nodes, automated endpoint mappings, and integration documentation modules will deploy here once the foundation goes live.
              </p>

              {/* Passive Indicator Notice Bar */}
              <div className="inline-flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Documentation manifests scheduled for deployment in a future release.</span>
              </div>
            </div>

            {/* Right Column: Clean Code Window Blueprint */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-[11px] sm:text-xs w-full select-none">
              
              {/* Terminal Window Top Title Panel */}
              <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>api-docs — build</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Terminal Logs View */}
              <div className="p-6 space-y-4 text-slate-500 leading-relaxed">
                <div>
                  <span className="text-slate-700">➜</span> <span className="text-slate-400 font-bold">~</span> initialize monietar-api-service
                </div>
                <div className="text-slate-600 font-normal">
                  // Core ledger modules building... <br />
                  // Setting up multi-currency sync hooks...
                </div>
                
                <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-xl font-mono text-slate-400">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Build Pipeline</div>
                  <span className="text-slate-600">status:</span> <span className="text-slate-300 font-semibold">Under Construction</span> <br />
                  <span className="text-slate-600">version:</span> <span className="text-slate-500">v0.1-alpha</span>
                </div>
                
                <div className="text-[10px] text-slate-600">
                  // Gateway access structures are offline. No endpoints exposed.
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Corporate Ecosystem Footer */}
      <Footer />
      
    </div>
  );
}
