'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Store, 
  Globe2,
  Users, 
  Check,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';

export default function UseCasesPage() {
  const useCases = [
    {
      id: 'retail-merchants',
      icon: Store,
      badge: 'Local Retail',
      title: 'Ditching the Paper Ledger for Real-Time Automation',
      description: 'For busy retail shop owners who manually record every customer bank transfer and cash payment into a physical notebook.',
      painPoint: 'Missed credit alerts, fake transfer scams, and hours spent calculating daily sales at closing time.',
      solution: 'Monietar listens to incoming notifications securely and auto-logs daily sales up to 150 transactions for free, keeping an independent vault track for physical cash balances.',
      benefits: ['Eliminates manual bookkeeping errors', 'Instant notification verification', 'Zero-friction daily closing math']
    },
    {
      id: 'growing-shops',
      icon: Users,
      badge: 'Multi-Attendant Outlets',
      title: 'Managing Multiple Store Assistants without Alert Chaos',
      description: 'For scaling merchants with physical storefronts or warehouses managed by hired shop assistants and sales reps.',
      painPoint: 'The business owner receives the bank alerts on their main phone, forcing assistants to constantly call or wait to confirm customer payments before releasing goods.',
      solution: 'Multi-Device Alert Syncing instantly routes payment confirmations to your store assistants’ devices in real-time, without giving them access to your actual bank account balances.',
      benefits: ['Faster customer checkouts', 'Prevents internal fraud and inventory leakages', 'Owners can monitor shop performance remotely']
    },
    {
      id: 'cross-border',
      icon: Globe2,
      badge: 'Borderless Trade',
      title: 'Navigating Cross-Border Commerce (Naira ⇄ CFA Franc)',
      description: 'For merchants sourcing inventory or selling goods simultaneously across Nigeria and Francophone West Africa.',
      painPoint: 'Fluctuating parallel market foreign exchange rates make accurate pricing, cost tracking, and cross-border profit calculations a nightmare.',
      solution: 'Monietar’s Dual-Currency Ledger Engine auto-indexes parallel market currency fluctuations, allowing you to run a unified accounting book matching Naira and CFA Franc smoothly.',
      benefits: ['Real-time FX margin protection', 'Unified multi-currency profit analytics', '1-Tap localized compliance exports']
    }
  ];

  const operationalSectors = [
    { title: 'FMCG & Groceries', detail: 'Track high-volume daily cash flows and monitor fast-moving stock levels instantly.' },
    { title: 'Fashion & Apparel', detail: 'Manage regional supplier payments across borders while matching multi-device sales logs.' },
    { title: 'Electronics & Gadgets', detail: 'Protect high-ticket transfer confirmations from fake alert exploits using secure listeners.' },
    { title: 'Wholesale Distributors', detail: 'Export audit-ready P&L statements directly to stakeholders or logistics partners.' },
  ];

  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-700 flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        
        {/* --- HERO SECTION --- */}
        <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-45">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(226,232,240,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.8)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,white,transparent)]"></div>
            </div>
          </div>

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Financial Intelligence in Action</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">
              How African SMEs Scale with 
              <span className="text-emerald-600 block mt-2">Monietar's Ledger Engine</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              From local retail shops to borderless cross-border enterprises, discover how our automation replaces chaotic manual accounting with clear financial clarity.
            </p>
          </div>
        </section>

        {/* --- DETAILED USE CASES MATRIX --- */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 container mx-auto max-w-6xl">
          <div className="space-y-24">
            {useCases.map((uc, index) => {
              const IconComponent = uc.icon;
              return (
                <div 
                  key={uc.id} 
                  className={`flex flex-col lg:flex-row gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left: Graphic Content Card */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl opacity-10 group-hover:opacity-20 blur-xl transition duration-500"></div>
                      <div className="relative bg-white border border-slate-200 rounded-3xl p-8">
                        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 border border-emerald-100">
                          <IconComponent className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-xs uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          {uc.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-4 mb-4 tracking-tight">
                          {uc.title}
                        </h3>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                          {uc.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Analytical Content Breakdown */}
                  <div className="w-full lg:w-1/2 space-y-6 text-left">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-rose-500 flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> The Core Friction
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium pl-3 border-l-2 border-slate-200">
                        {uc.painPoint}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-emerald-600 flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Monietar Engine Impact
                      </h4>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-semibold pl-3 border-l-2 border-emerald-500">
                        {uc.solution}
                      </p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3">Key Metrics Unlocked:</h4>
                      <ul className="space-y-2.5">
                        {uc.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-bold">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 stroke-[3]" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- SYSTEM-WIDE AI HIGHLIGHT GRID --- */}
        <section className="py-20 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Architected for Diverse Operations
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                No matter your inventory style or delivery frequency, Monietar automates background reconciliation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {operationalSectors.map((sector, index) => (
                <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-500/40 transition-colors group">
                  <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                    {sector.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                    {sector.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}