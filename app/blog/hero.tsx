'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

export default function BlogHero() {
  return (
    <section className="relative pt-24 pb-3 overflow-hidden bg-[#FCFCFD]">
      {/* Background ambient depth blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mt-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            The Monietar Journal
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
           <span className="text-emerald-600">Perspectives </span> on automation, ledgers, and scale.
          </h1>
        </div>
       
      </div>
    </section>
  );
}
