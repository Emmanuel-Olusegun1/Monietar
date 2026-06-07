'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiHero from './api-hero';
import ApiSnippets from './api-snippets';

export default function ApiDocsPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main className="pb-24">
        {/* Core Header and Live System Health Infrastructure */}
        <ApiHero />

        {/* Dynamic Code Playground Container */}
        <ApiSnippets />
      </main>

      <Footer />
    </div>
  );
}