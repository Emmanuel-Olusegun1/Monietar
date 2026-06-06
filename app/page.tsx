
'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/Home-sections/Hero';
import Trustbar from '@/Home-sections/Trustbar';
import Feature from '@/Home-sections/Feature';
import Premuim from '@/Home-sections/Premium';
import Pricing from '@/Home-sections/Pricing';
import Faqs from '@/Home-sections/Faqs';
import Contacts from '@/Home-sections/Contacts';
import FinalCTA from '@/Home-sections/final-cta';
// import Benefits from '@/Home-sections/Benefits';
import Testimonials from '@/Home-sections/Testimonial';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative z-10">
          <Hero />
        </section>

        {/* Trust Bar */}
        <section className="relative z-10">
          <Trustbar />
        </section>

        {/* Features Section */}
        <section className="relative z-10 ">
          <Feature />
        </section>

        {/* Benefits Section */}
        {/* <section className="relative z-10 py-12 md:py-20 bg-white/60 backdrop-blur-md border-t border-gray-100">
          <Benefits />
        </section> */}

        {/* Premium Section */}
        {/* <section className="relative z-10">
          <Premuim />
        </section> */}

        {/* Testimonials Section */}
        {/* <section className="relative z-10 py-12 md:py-20 bg-gray-50 border-t border-b border-gray-100">
          <Testimonials />
        </section> */}

        {/* FAQ Section */}
        <section className="relative z-10 bg-white/60 backdrop-blur-md border-t border-b border-gray-100">
          <Faqs />
        </section>

        {/* Pricing Section */}
        <section className="relative z-10">
          <Pricing />
        </section>

        {/* Contact Section */}
        {/* <section className="relative z-10 py-12 md:py-20 bg-white/60 backdrop-blur-md border-t border-gray-100">
          <Contacts />
        </section> */}

        {/* Final CTA section */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}


export default Home;
