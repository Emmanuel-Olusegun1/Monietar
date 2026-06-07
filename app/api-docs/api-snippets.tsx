'use client';

import { Terminal, Code2, KeyRound, ArrowRight } from 'lucide-react';

export default function ApiSnippets() {
  return (
    <section className="mt-4">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block Parameter */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Core Gateway Sandbox
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Developer sandbox registries are compiling.
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed font-normal">
              We are currently running private end-to-end testing cycles with our first cohort of cross-border merchants. Fully automated REST endpoints, Webhook listeners, and SDK documentation models will be exposed here soon.
            </p>

            <div className="pt-2">
              <a 
                href="mailto:api@algoritic.com?subject=Monietar API Early Access Request"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 transition-colors group"
              >
                Request private beta keys <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Right Simulated Terminal Window Placeholder */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-[11px] sm:text-xs">
            
            {/* Control Header Panel */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between text-slate-500 select-none">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>api.monietar.com — bash</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Terminal Content Box */}
            <div className="p-6 space-y-3 text-slate-400 leading-relaxed">
              <div>
                <span className="text-emerald-500">➜</span> <span className="text-slate-200 font-bold">~</span> curl -X POST https://api.monietar.com/v1/auth/token
              </div>
              <div className="text-slate-600">
                // Connecting to gateway infrastructure pools...
              </div>
              <div className="flex items-center gap-2 text-amber-400/90 bg-amber-500/[0.03] border border-amber-500/10 px-3 py-2 rounded-xl">
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>HTTP/1.1 403 Forbidden — Requires Verified Corporate Beta Signatures</span>
              </div>
              <div className="text-slate-600 pt-1">
                // Documentation manifests scheduled for deployment: Summer 2026
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
