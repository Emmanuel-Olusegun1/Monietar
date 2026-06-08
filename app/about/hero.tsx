'use client';

import { motion } from 'framer-motion';


export default function AboutHeroPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-[50vh] font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">

      {/* Main High-Impact Moniepoint-Style Hero Section */}
      <main className="relative flex-grow flex items-center justify-center pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Subtle organic ambient background blurs for depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[100px]" />
        </div>

        <div className="container py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Subtle Accent Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Our Identity & Mission
            </motion.div>
            
            {/* Bold Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8"
            >
              Financial happiness <br className="hidden sm:inline" />
              for every enterprise, <span className="text-emerald-600">everywhere.</span>
            </motion.h1>
            
          </div>
        </div>
      </main>
    </div>
  );
}