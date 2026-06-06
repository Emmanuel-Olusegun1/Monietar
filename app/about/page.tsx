'use client';

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { 
  Target, Users, Shield, Cpu, ArrowRight, CheckCircle2, 
  Loader2, Landmark, LineChart, Layers, Calendar, Award 
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- DATA MODEL CONFIGURATIONS ---
const performanceMetrics = [
  { value: '99.9%', label: 'Ledger Accuracy Match', detail: 'Native LLM verification' },
  { value: '24/7', label: 'Continuous Automation', detail: 'Zero manual balancing intervals' },
  { value: 'Multi-FX', label: 'Currency Normalization', detail: 'Real-time cross-border pools' },
];

const pillars = [
  {
    icon: Target,
    title: 'Payments & Ledgers',
    description: 'We build underlying automated rails that democratize real-time transaction capturing for merchants everywhere.'
  },
  {
    icon: Landmark,
    title: 'Unified Accounting',
    description: 'Moving beyond clunky external tools. We offer integrated engine synchronization so business teams execute with control.'
  },
  {
    icon: Shield,
    title: 'Compliance Infrastructure',
    description: 'Engineered entirely around strict read-only parameters, preserving total security loops across local cross-border accounts.'
  }
];

const timelineData = [
  {
    year: '2025',
    title: 'The Foundations',
    description: 'Algoritic Inc founded the Monietar structural engine to tackle the profound accounting friction points facing African SMEs.'
  },
  {
    year: '2026',
    title: 'The Beta Framework',
    description: 'Deployed real-time context parsing models to automate fragmented ledger data natively for early-access cross-border cohorts.'
  },
  {
    year: 'Future Forward',
    title: 'Financial Happiness',
    description: 'Expanding automated cashflow intelligence systems to empower growth-stage merchants across emerging regional markets.'
  }
];

export default function AboutPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      {/* =========================================================================
          STAGE 1: THE MONIEPOINT-INSPIRED BOLD HERO HEADER
          ========================================================================= */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
              Financial happiness <br className="hidden sm:inline" />
              for every enterprise, <span className="text-emerald-600">everywhere.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-3xl mx-auto leading-relaxed">
              Monietar’s financial intelligence technology powers the commercial dreams of growing businesses by providing teams with simple, autonomous tools to track, sync, and control multi-currency capital flows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 2: BENTO STYLE HIGH-GROWTH PERFORMANCE METRICS
          ========================================================================= */}
      <section className="pb-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 bg-slate-100/50 border border-slate-200/60 p-4 rounded-3xl">
            {performanceMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 text-center md:text-left flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm font-bold text-slate-800 tracking-tight mb-1">
                    {metric.label}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 font-medium">{metric.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 3: STRATEGIC SOLUTION PILLARS BLOCK
          ========================================================================= */}
      <section className="py-24 bg-white border-y border-slate-200/80">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-4 sticky top-24">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-3">What We Provide</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                All-in-one ledgering tools designed for hyper-scale.
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed">
                Accessing unified visibility shouldn’t demand endless manual operations. Monietar evens the odds by deploying clean technical infrastructure right where fragmented data clusters happen.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div 
                    key={pillar.title} 
                    className="bg-[#FCFCFD] border border-slate-200 p-8 rounded-2xl flex flex-col sm:flex-row gap-6 items-start hover:border-slate-300 transition-colors"
                  >
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">{pillar.title}</h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 4: LINEAR CHRONOLOGICAL PIVOT TIMELINE
          ========================================================================= */}
      <section className="py-24 bg-slate-50/40">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">The Monietar Journey</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How we are making automation a reality</h2>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 md:mx-auto md:max-w-4xl space-y-12">
            {timelineData.map((item, idx) => (
              <div key={item.year} className="relative pl-8 sm:pl-10">
                {/* Timeline Node Point indicator */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full z-10" />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8">
                  <div className="md:col-span-3">
                    <span className="inline-block text-sm font-black bg-slate-900 text-white px-2.5 py-1 rounded-md tracking-tight">
                      {item.year}
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">{item.title}</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          STAGE 5: RECOGNITION AND BENCHMARKS TRUST STRIP
          ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Engineered to Elite Operational Frameworks
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center opacity-70 grayscale hover:grayscale-0 transition-all max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 font-bold text-slate-800 text-sm">
              <Award className="w-4 h-4 text-emerald-500" /> Algoritic Inc Ecosystem
            </div>
            <div className="flex items-center justify-center gap-2 font-bold text-slate-800 text-sm">
              <Layers className="w-4 h-4 text-emerald-500" /> AI-Native Ledgering
            </div>
            <div className="flex items-center justify-center gap-2 font-bold text-slate-800 text-sm">
              <LineChart className="w-4 h-4 text-emerald-500" /> SME Core Alignment
            </div>
            <div className="flex items-center justify-center gap-2 font-bold text-slate-800 text-sm">
              <Calendar className="w-4 h-4 text-emerald-500" /> 2026 Scale Target
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 6: PREMIUM PRODUCTION STANDARD CTA
          ========================================================================= */}
      <section id="waitlist-section" className="py-24 border-t border-slate-200 bg-slate-50/60 scroll-mt-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            
            {!isSubmitted ? (
              <>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  Take absolute command of your cashflows.
                </h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
                  Join our exclusive early-access cohort to eliminate manual ledger entry and experience modern transaction control natively.
                </p>

                <div className="max-w-md mx-auto">
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full">
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your professional email address"
                      className="w-full sm:flex-grow bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all active:scale-[0.99] whitespace-nowrap min-w-[130px]"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-4 w-4 text-white" />
                      ) : (
                        <>Get Access <ArrowRight className="w-4 h-4 stroke-[2.5]" /></>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <motion.div className="py-4 text-center" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-slate-900 text-xl font-bold mb-1">Queue Position Reserved</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">Thank you. Your email signature has been logged safely into the system dashboard.</p>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}