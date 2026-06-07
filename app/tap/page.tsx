'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TapHero from './tap-hero';
import TapFeatures from './tap-features';
import TapSpecs from './tap-specs';

export default function MonietarTapPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* Device Announcement & Main Visual Intro */}
        <TapHero />

        {/* Core Hardware & Software Interlocking Capabilities */}
        <TapFeatures />

        {/* Technical Hardware Blueprint Specifications */}
        <TapSpecs />
      </main>

      <Footer />
    </div>
  );
}
