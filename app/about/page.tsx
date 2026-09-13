'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import your modular section files from the local about directory
import AboutHero from './hero'; 
import AboutWhoWeAre from './who-we-are'
import AboutProblem from './about-problem';
import AboutHowWeThink from './how-we-think';
import FinalCTA from '@/Home-sections/final-cta';

export default function AboutPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      {/* Global Navigation Header */}
      <Header />

      {/* Main Structural Content Stack */}
      <main>
        {/* Moniepoint-Style Bold Hero Header */}
        <AboutHero />

        {/* Who we are */}
        <AboutWhoWeAre />

        {/* About Problem*/}
        <AboutProblem />

        {/* How we think */}
        <AboutHowWeThink />

       {/* Final CTA section */}
         <FinalCTA />

        {/* Framework & Recognition Trust Ribbon */}
        {/* <AboutTrustStrip /> */}

        {/* Premium Production Waitlist Form Call-to-Action */}
        {/* <AboutCTA /> */}
      </main>

      {/* Global Navigation Footer */}
      <Footer />
    </div>
  );
}