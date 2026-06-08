'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function CareersHero() {
  const scrollToPositions = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
     <div className="bg-[#FCFCFD] text-slate-900 min-h-[50vh] font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">
      <main className="relative flex-grow flex items-center justify-center pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background depth blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
         
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl my-20 font-black text-slate-900 tracking-tight leading-[1.05] mt-12"
          >
            Build software that moves 
            <span className="text-emerald-600"> real economic capital.</span>
          </motion.h1>
        </div>
      </div>
    </main>
    </div>
  );
}