'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

export default function BlogHero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden bg-[#FCFCFD]">
      {/* Background ambient depth blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            The Algoritic Journal
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Perspectives on automation, ledgers, and scale.
          </h1>
        </div>

        {/* Moniepoint-Style Featured Story Block */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left text parameters */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Product Launches
              </span>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors leading-tight">
                Introducing Krilarr: Empowering modern software developers natively
              </h2>
              
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
                We are incredibly excited to share that Krilarr is officially live on the Peerlist Launchpad! Dive deep into how we built an elite, cloud-native utility layer designed for rapid product-led execution.
              </p>

              {/* Metadata strip */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> April 2026</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 4 min read</span>
                <span className="text-slate-900 font-semibold">By Emmanuel Olusegun</span>
              </div>
            </div>

            {/* Right Mock Graphic Anchor */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 rounded-2xl h-48 sm:h-64 flex flex-col items-center justify-center p-6 relative overflow-hidden shrink-0 group-hover:border-slate-300 transition-colors">
              <div className="text-center space-y-2 relative z-10">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Workspace Update</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">Krilarr 1.0 Core</div>
              </div>
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-950 group-hover:border-slate-950 transition-all">
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
