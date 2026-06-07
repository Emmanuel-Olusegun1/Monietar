'use client';

import { useState } from 'react';
import { ArrowUpRight, MapPin, Briefcase, DollarSign } from 'lucide-react';

const positionsData = [
  {
    id: 'frontend-eng',
    title: 'Intermediate Full-Stack Engineer (React / Next.js)',
    department: 'Engineering',
    location: 'Lagos, Nigeria / Hybrid',
    type: 'Full-time',
    link: '#'
  },
  {
    id: 'backend-ledger',
    title: 'Backend Infrastructure Engineer (Node.js / Prisma)',
    department: 'Engineering',
    location: 'Remote (GMT+1 / West Africa)',
    type: 'Full-time',
    link: '#'
  },
  {
    id: 'growth-lead',
    title: 'Product Growth Manager (SME Networks)',
    department: 'Growth & Operations',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    link: '#'
  }
];

export default function CareersOpenings() {
  const [activeTab, setActiveTab] = useState('All');
  
  const categories = ['All', 'Engineering', 'Growth & Operations'];

  const filteredPositions = activeTab === 'All' 
    ? positionsData 
    : positionsData.filter(pos => pos.department === activeTab);

  return (
    <section id="open-positions" className="py-24 bg-slate-50/40 scroll-mt-20">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">Join Algoritic Inc Ecosystem</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Open Opportunities</h2>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-slate-100 border border-slate-200/60 p-1.5 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all ${
                  activeTab === cat 
                    ? 'bg-white text-slate-950 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Positions List Wrapper */}
        <div className="space-y-4">
          {filteredPositions.length > 0 ? (
            filteredPositions.map((role) => (
              <a
                key={role.id}
                href={role.link}
                className="group block bg-white border border-slate-200 hover:border-slate-300 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-1">
                      {role.department}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
                      {role.title}
                    </h3>
                    
                    {/* Meta Tags Row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {role.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {role.type}</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center self-end sm:self-auto shrink-0 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center bg-white border border-slate-200 rounded-2xl py-12 px-4">
              <p className="text-slate-500 text-sm">No live roles listed under this department currently.</p>
            </div>
          )}
        </div>

        {/* General Application Footer note */}
        <div className="mt-12 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">Don't see your ideal engineering or design vector?</h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
            We are always listening for exceptional product creators, infrastructure hackers, and financial ledger specialists.
          </p>
          <a href="mailto:careers@algoritic.com" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
            Drop us a general portfolio ping <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
}