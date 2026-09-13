'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Mail,
} from 'lucide-react';

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
           <div className="pt-10 sm:pt-14 lg:pt-16">
             <h1 className="max-w-6xl text-[clamp(3rem,7.5vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                Ideas worth
                <br />
                knowing are
                <br />
                <span className="text-emerald-900">on the way.</span>
              </h1>

              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Coming soon
                  </span>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  We are putting together a collection of ideas, insights, and
                  practical thinking around business finance, cash flow,
                  operations, and building better businesses.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 border-y border-gray-300 sm:grid-cols-2">
                <div className="flex items-center gap-3 py-5 sm:border-r sm:border-gray-300 sm:pr-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    01
                  </span>

                  <span className="text-xs font-medium text-gray-700">
                    Practical thinking
                  </span>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-300 py-5 sm:border-t-0 sm:pl-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    02
                  </span>

                  <span className="text-xs font-medium text-gray-700">
                    Built for business
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
         <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
              <div>
               <h2 className="max-w-2xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Less noise. More useful thinking.
                </h2>
              </div>

              <div className="border-t border-gray-200">
                <div className="grid grid-cols-[60px_1fr] gap-5 border-b border-gray-200 py-8 sm:gap-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    01
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                      Business finance
                    </h3>

                    <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                      Practical perspectives on cash flow, financial visibility,
                      profitability, and the numbers behind everyday business
                      decisions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[60px_1fr] gap-5 border-b border-gray-200 py-8 sm:gap-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    02
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                      Running better businesses
                    </h3>

                    <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                      Ideas around operations, inventory, sourcing, and the
                      systems that help businesses work better.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[60px_1fr] gap-5 border-b border-gray-200 py-8 sm:gap-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    03
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                      Building for African businesses
                    </h3>

                    <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                      Thinking about the realities, constraints, opportunities,
                      and possibilities that shape businesses across African
                      markets.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[60px_1fr] gap-5 py-8 sm:gap-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    04
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                      Product & technology
                    </h3>

                    <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                      Lessons and perspectives from building technology for
                      businesses and the people behind them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
         <div className="grid grid-cols-1 gap-10 pt-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20 lg:pt-20">
              <div>
                 <h2 className="max-w-5xl text-[clamp(2.8rem,6.5vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                  We would rather publish something useful than{' '}
                  <span className="text-emerald-900">just publish.</span>
                </h2>
              </div>

              <div className="flex items-end">
                <div className="max-w-md">
                  <div className="mb-6 h-px w-10 bg-emerald-900" />

                  <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                    The journal is still being put together. When it launches,
                    the goal is simple: useful ideas you can take back to your
                    business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 pt-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20 lg:pt-20">
              <div>
                <h2 className="max-w-4xl text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Good ideas are better when they are shared.
                </h2>
              </div>

              <div className="flex items-end">
                <div className="max-w-md">
                  <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                    Want to stay close to what we are building and thinking
                    about? Reach out to us.
                  </p>

                  <a
                    href="mailto:hello@monietat.com.ng"
                    className="group mt-8 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
                  >
                    Get in touch
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 border-y border-gray-300 sm:grid-cols-3">
              <div className="border-r border-gray-300 py-5 sm:pr-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Status
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Coming soon
                </p>
              </div>

              <div className="border-r border-gray-300 py-5 pl-5 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Focus
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Useful ideas
                </p>
              </div>

              <div className="col-span-2 border-t border-gray-300 py-5 pl-5 sm:col-span-1 sm:border-t-0 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Direction
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Business better
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}