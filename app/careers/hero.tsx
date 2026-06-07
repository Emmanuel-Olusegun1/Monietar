'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function CareersHero() {
  const scrollToPositions = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[50vh] py-20 overflow-hidden bg-[#FCFCFD]">
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
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.05] mt-12"
          >
            Build software that moves 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> real economic capital.</span>
          </motion.h1>
        </div>
      </div>
    </section>
  );
}