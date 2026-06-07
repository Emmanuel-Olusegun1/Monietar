'use client';

import { Code2, Compass, ShieldAlert, Cpu } from 'lucide-react';

const traits = [
  {
    icon: Code2,
    title: 'Extreme Technical Ownership',
    description: 'We don’t just assign tasks. Engineers and product leads own features end-to-end—from initial database schema planning down to frontend polish.'
  },
  {
    icon: Cpu,
    title: 'AI-Native Mindset',
    description: 'We move past outdated development paradigms. We actively leverage intelligence models and highly integrated automation routines to accelerate our internal workflow velocity.'
  },
  {
    icon: Compass,
    title: 'Building In Public',
    description: 'Transparency fuels our growth. We celebrate milestones, open-source core utilities, and ship features rapidly while gathering direct feedback from our business operators.'
  },
  {
    icon: ShieldAlert,
    title: 'Strict Quality Standards',
    description: 'When dealing with multi-currency ledgers and capital flows, "good enough" isn’t an option. We practice obsessive testing loops and rigorous edge-case tracking.'
  }
];

export default function CareersCulture() {
  return (
    <section className="py-24 bg-white border-y border-slate-200/80">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">How We Work</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">Our Operating DNA</h2>
          <p className="text-slate-500 text-base mt-4">We are a flat, execution-oriented team that values clear architecture and rapid software iteration cycles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {traits.map((trait) => {
            const Icon = trait.icon;
            return (
              <div key={trait.title} className="flex gap-5 items-start p-2 rounded-xl">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl shrink-0 text-slate-700">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">{trait.title}</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{trait.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}