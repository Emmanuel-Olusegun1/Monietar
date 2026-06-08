'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Smartphone, Cpu, CheckCircle, Flame, Layers, BadgePercent } from 'lucide-react';

export default function MonietarTapPage() {
  const specs = [
    { label: "Hardware Form Factor", value: "Dedicated smartphone-class utility shell optimized for single-application performance" },
    { label: "Core Operating Layer", value: "Monietar LightOS (Stripped of heavy smartphone background processes to ensure speed)" },
    { label: "Connectivity Pool", value: "Optimized low-bandwidth 2G/3G/4G cellular configurations & Wi-Fi mesh routing" },
    { label: "Display Properties", value: "5.0-inch high-clarity transactional LCD matrix (Low power consumption profile)" },
    { label: "Battery Performance", value: "Extended lithium reservoir engineered to power up to 48 hours of constant passive tracking" },
    { label: "Ecosystem Pricing", value: "Positioned at a fraction of standard entry-level smartphone commercial costs" }
  ];

  const valueProps = [
    {
      icon: <BadgePercent className="w-5 h-5 text-emerald-600" />,
      title: 'Built for Absolute Affordability',
      description: 'By stripping out expensive camera lenses, high-end graphics chips, and heavy consumer smartphone components, we deliver dedicated hardware at a minimal cost boundary.'
    },
    {
      icon: <Layers className="w-5 h-5 text-slate-600" />,
      title: 'Pure Ledger Focus',
      description: 'Zero distractions, zero bloatware. The hardware boots directly into the Monietar ecosystem workspace, ensuring immediate operational readiness for your business management.'
    },
    {
      icon: <Flame className="w-5 h-5 text-slate-600" />,
      title: 'Extreme Thermal & Battery Lifespan',
      description: 'Optimized internal architectures draw minimal active power, allowing business operators in low-power infrastructure zones to track cash flows for days on a single charge.'
    },
    {
      icon: <Cpu className="w-5 h-5 text-slate-600" />,
      title: 'Low-Bandwidth Optimization',
      description: 'Engineered specifically to sync complex multi-currency ledgers smoothly even across highly congested, volatile, or weak rural cellular signals.'
    }
  ];

  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        
        {/* --- HARDWARE PURPOSE HERO SECTION --- */}
        <section className="relative pt-40 pb-24 bg-[#FCFCFD]">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold tracking-wider uppercase mx-auto">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Dedicated Workspace Hardware
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Every business deserves powerful ledger <span className="text-emerald-600">visibility.</span>
            </h1>
            
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              Monietar TAP is a dedicated, ultra-affordable hardware terminal engineered specifically for merchants who need robust ledger software without the heavy financial burden of purchasing a consumer smartphone.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-xl shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Dedicated Interface
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-xl shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Fraction of Smartphone Cost
              </span>
            </div>

          </div>
        </section>

        {/* --- VALUES / WHY IT EXISTS SECTION --- */}
        <section className="py-20 bg-slate-50/40 border-t border-slate-200/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-16 mx-auto text-center lg:text-left lg:mx-0">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Accessible Inclusions
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Designed to bridge infrastructure and commercial pricing gaps.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {valueProps.map((prop, index) => (
                <div 
                  key={index}
                  className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {prop.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {prop.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                      {prop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* --- TECHNICAL SPECIFICATIONS --- */}
        <section className="py-20 bg-white border-t border-slate-200/60">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Hardware Parameters
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Technical Specifications
              </h2>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {specs.map((item, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 gap-2 sm:gap-6 items-start text-xs sm:text-sm"
                  >
                    <div className="sm:col-span-4 font-bold text-slate-900 tracking-tight">
                      {item.label}
                    </div>
                    <div className="sm:col-span-8 text-slate-500 font-normal leading-relaxed">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
