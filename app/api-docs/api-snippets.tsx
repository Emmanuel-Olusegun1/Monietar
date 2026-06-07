'use client';

import { useState, useEffect } from 'react';
import { Terminal, Code2, ShieldCheck, ArrowRight, Activity, Cpu } from 'lucide-react';

export default function ApiSnippets() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Real-time calculated remaining keys to drive high FOMO (anticipation factor)
  const [keysLeft, setKeysLeft] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setKeysLeft((prev) => (prev > 3 ? prev - 1 : prev));
    }, 45000); // Slowly decreases keys in real-time
    return () => clearInterval(interval);
  }, []);

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simulate API registration hook
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="mt-8">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block: High-Intent Form Catchment */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/[0.06] border border-emerald-500/20 text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 stroke-[2.5]" /> Gateway Ecosystem Sandbox
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Engine manifests are compiling.
              </h3>
            </div>
            
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
              We are finalizing our isolated testing routines with a selected group of cross-border payment aggregates. Secure API sandboxes, modular webhook delivery loops, and typed SDK packages will open automatically.
            </p>

            {/* Simulated Live Distribution Metric Counter */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 max-w-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Developer Cohort Alpha: Only <strong className="text-slate-900 font-extrabold font-mono">{keysLeft} / 150</strong> keys remaining.</span>
            </div>

            {/* Interactive Embedded Sign-up Field */}
            {!submitted ? (
              <form onSubmit={handleRequestAccess} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your engineering email"
                  required
                  className="flex-grow bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs sm:text-sm shadow-sm transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1 active:scale-[0.98]"
                >
                  Join Waitlist <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-xl flex items-start gap-3 max-w-md">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">Access vector registered.</h4>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Your spot in the developer waitlist is locked. We will dispatch technical manifests and verification protocols directly to your terminal.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Text Block: Simulated IDE / Live Deployment Streams */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-[11px] sm:text-xs">
            
            {/* Control Header Panel */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between text-slate-500 select-none">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>monietar-gateway-build — log</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Terminal Live Stream Feed */}
            <div className="p-6 space-y-3.5 text-slate-400 leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-slate-500 text-[10px] font-bold select-none">
                <span>SYSTEM CORE PARSING PIPELINES</span>
                <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> LIVE STREAM</span>
              </div>
              
              <div className="space-y-1">
                <div><span className="text-slate-600">[08:14:02]</span> <span className="text-slate-200">INF</span> Initializing core multi-currency synchronization pipelines...</div>
                <div><span className="text-slate-600">[08:14:05]</span> <span className="text-slate-200">INF</span> Ingesting global ledger context arrays: <span className="text-emerald-400">OK</span></div>
              </div>

              <div className="p-3 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl space-y-1.5">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" /> API Target: v1.2-beta-production
                </div>
                <div className="text-slate-400 pl-5 text-[10px] sm:text-xs leading-normal">
                  + POST /v1/ledger/synchronize (Validated schemas)<br />
                  + GET  /v1/wallets/reconciliation (Read-only security pass)<br />
                  + POST /v1/webhooks/delivery-worker (Retry loops initialized)
                </div>
              </div>

              <div className="text-slate-500 text-[10px] pt-1">
                // System operational readiness rating: <span className="text-slate-300 font-bold">99.98%</span>. Readying deployment matrix tags...
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
