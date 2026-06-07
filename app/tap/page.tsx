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
        <section className="relative pt-32 pb-20 overflow-hidden bg-[#FCFCFD]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-50% -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/[0.015] rounded-full blur-[140px]" />
          </div>

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Dedicated Hardware Positioning */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold tracking-wider uppercase mx-auto lg:mx-0">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Dedicated Workspace Hardware
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
                  Every business <br className="hidden sm:inline" />deserves powerful <br className="hidden sm:inline" />ledger visibility.
                </h1>
                
                <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Monietar TAP is a dedicated, ultra-affordable hardware terminal engineered specifically for merchants who need robust ledger software without the heavy financial burden of purchasing a consumer smartphone. 
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Dedicated Interface
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Fraction of Smartphone Cost
                  </span>
                </div>
              </div>

              {/* Right Column: Premium Smartphone-Class Utility Container View */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-64 h-[490px] sm:w-70 sm:h-[540px] bg-slate-900 rounded-[44px] p-3.5 shadow-xl border-2 border-slate-800 relative flex flex-col justify-between overflow-hidden select-none">
                  
                  {/* Subtle Cameraless Top Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-950 rounded-full z-20" />

                  {/* Internal Operational Software Screen View */}
                  <div className="w-full h-full bg-[#FCFCFD] rounded-[32px] overflow-hidden relative flex flex-col justify-between p-5 pt-8 text-slate-900 font-sans z-10 border border-slate-950/10">
                    
                    {/* Software Top Brand Strip */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">MONIETAR LIGHTOS</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold font-mono">STANDALONE</span>
                    </div>

                    {/* Simulated Clean Dashboard View */}
                    <div className="my-auto space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tracked Revenue</span>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">₦420,500.00</div>
                      </div>
                      
                      {/* Micro Analytical Simulation Matrix */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Cash Flow In</span>
                          <span className="text-xs font-bold text-emerald-600">₦310K</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Sync Status</span>
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Utility Notification Grid */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                      <p className="text-[10px] font-bold text-slate-500 leading-normal">
                        Monietar Software Active &bull; Secure Storage Locked
                      </p>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- VALUES / WHY IT EXISTS SECTION --- */}
        <section className="py-20 bg-slate-50/40 border-t border-slate-200/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Accessible Inclusions
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Designed to bridge infrastructure <br />and commercial pricing gaps.
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
