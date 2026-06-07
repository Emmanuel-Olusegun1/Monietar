'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Modular section imports from the local careers directory
import CareersHero from './hero';
import CareersCulture from './culture';
import CareersOpenings from './openings';

export default function CareersPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* Moniepoint-Style Impact Hero */}
        <CareersHero />

        {/* Culture & Engineering Core Values Matrix */}
        <CareersCulture />

        {/* Dynamic, Interactive Live Openings Board */}
        <CareersOpenings />
      </main>

      <Footer />
    </div>
  );
}