'use client';

import { motion } from 'framer-motion';
import { Target, ShieldCheck, Zap } from 'lucide-react';

export default function AboutWhoWeAre() {
  return (
    <section className="py-20 bg-white border-b border-slate-200/60">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Title Grid Anchor */}
          <div className="lg:col-span-4 sticky top-24">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-3">
              Corporate Overview
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Who We Are
            </h2>
             
          </div>

          {/* Right Text Block Content */}
          <div className="lg:col-span-8 space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
           <p>
              <strong className="text-slate-950 font-bold">Monietar</strong> is a digital financial intelligence and automated ledger platform serving cross-border merchants, small and medium-sized enterprises (SMEs), and growing businesses. Our solutions power modern commercial operations with real-time multi-currency transaction tracking, automated ledgering, and unified cash flow management tools.
            </p>
            
            <p>
              Monietar introduced its automated framework to help businesses eliminate manual bookkeeping tracking overhead, streamline cross-border payment reconciliations, and establish direct visibility into their fragmented cash flows.
            </p>

            <p>
              By integrating AI-native context parsing with secure read-only pipelines, we support scale-stage merchants by giving their administrative teams, operational partners, and managers a single, reliable point of command. Through this unified core architecture, expanding businesses can effortlessly manage multi-currency records, verify real-time settlements, and make capital decisions with absolute precision.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}