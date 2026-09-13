'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  BriefcaseBusiness,
  Users,
  Lightbulb,
  Globe2,
} from 'lucide-react';

export default function CareersPage() {
  const principles = [
    {
      number: '01',
      icon: Lightbulb,
      title: 'Solve real problems',
      description:
        'We care about problems that exist outside the screen. We build around how businesses actually operate, not how we imagine they should.',
    },
    {
      number: '02',
      icon: Users,
      title: 'Think beyond your role',
      description:
        'Great products are not built in silos. We expect people to understand the wider problem, contribute ideas, and take ownership beyond a job description.',
    },
    {
      number: '03',
      icon: Globe2,
      title: 'Build for where we are',
      description:
        'Infrastructure, connectivity, pricing, and context matter. We build products that make sense for the markets and people we serve.',
    },
  ];

  const opportunities = [
    {
      number: '01',
      title: 'Engineering',
      description:
        'Build reliable systems and products that turn complex business problems into simple experiences.',
    },
    {
      number: '02',
      title: 'Product & Design',
      description:
        'Shape how businesses interact with financial infrastructure, from the smallest interaction to the entire product experience.',
    },
    {
      number: '03',
      title: 'Growth & Operations',
      description:
        'Help take products from something we built to something businesses actually use, trust, and recommend.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
         <div className="pt-10 sm:pt-14 lg:pt-16">
           <h1 className="max-w-6xl text-[clamp(3rem,7.5vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                Build things
                <br />
                that make
                <br />
                <span className="text-emerald-900">business better.</span>
              </h1>

              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Join the team
                  </span>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  We are building financial infrastructure for businesses that
                  deserve better tools. If you care about solving difficult
                  problems, building useful products, and doing meaningful
                  work, there may be a place for you here.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 border-y border-gray-300 sm:grid-cols-2">
                <div className="flex items-center gap-3 py-5 sm:border-r sm:border-gray-300 sm:pr-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    01
                  </span>

                  <span className="text-xs font-medium text-gray-700">
                    Build with purpose
                  </span>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-300 py-5 sm:border-t-0 sm:pl-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    02
                  </span>

                  <span className="text-xs font-medium text-gray-700">
                    Work on real problems
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY MONIETAR */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
              <div>
               <h2 className="max-w-2xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  The problems are real. So is the opportunity.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-base font-light leading-8 text-gray-600 sm:text-lg">
                  Millions of businesses operate with fragmented records,
                  limited visibility, and financial tools that were never
                  designed around their reality.
                </p>

                <p className="mt-6 text-sm font-light leading-7 text-gray-500 sm:text-base sm:leading-8">
                  We believe technology can make that better. Not by adding
                  complexity, but by making the right information easier to
                  capture, understand, and act on.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
         <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
              <div>
              <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  How we approach the work matters.
                </h2>
              </div>

              <div className="border-t border-gray-300">
                {principles.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.number}
                      className="grid grid-cols-[auto_1fr] gap-5 border-b border-gray-300 py-7 sm:grid-cols-[60px_1fr_auto] sm:gap-8 sm:py-8"
                    >
                      <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                        {item.number}
                      </span>

                      <div>
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-emerald-900 stroke-[1.7]" />

                          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                            {item.title}
                          </h3>
                        </div>

                        <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <ArrowRight className="mt-1 hidden h-4 w-4 text-gray-300 sm:block" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* OPPORTUNITIES */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
        <div className="pt-14 lg:pt-20">
              <div className="max-w-3xl">
               <h2 className="text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Bring your craft. Help shape the product.
                </h2>

                <p className="mt-7 max-w-2xl text-sm font-light leading-7 text-gray-500 sm:text-base sm:leading-8">
                  We are building across disciplines. The role matters, but
                  what matters more is the problem you can help us solve.
                </p>
              </div>

              <div className="mt-14 border-t border-gray-200 lg:mt-20">
                {opportunities.map((item) => (
                  <div
                    key={item.number}
                    className="group grid grid-cols-[auto_1fr] gap-5 border-b border-gray-200 py-7 sm:grid-cols-[60px_1fr_auto] sm:gap-8 sm:py-9"
                  >
                    <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                      {item.number}
                    </span>

                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
                        {item.title}
                      </h3>

                      <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight className="mt-1 hidden h-4 w-4 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-900 sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
        

            <div className="grid grid-cols-1 gap-10 pt-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20 lg:pt-20">
              <div>
                <h2 className="max-w-5xl text-[clamp(2.8rem,6.5vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                  The next chapter of financial infrastructure needs{' '}
                  <span className="text-emerald-900">people who care.</span>
                </h2>
              </div>

              <div className="flex items-end">
                <div className="max-w-md">
                  <div className="mb-6 h-px w-10 bg-emerald-900" />

                  <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                    We may not have every role open today. But if you believe
                    you can make Monietar better, we would like to hear from
                    you.
                  </p>

                  <a
                    href="mailto:hello@monietat.com.ng"
                    className="group mt-8 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
                  >
                    Start a conversation
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 border-y border-gray-300 sm:grid-cols-3">
              <div className="border-r border-gray-300 py-5 sm:pr-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Environment
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Problem-led
                </p>
              </div>

              <div className="border-r border-gray-300 py-5 pl-5 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Approach
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Ownership
                </p>
              </div>

              <div className="col-span-2 border-t border-gray-300 py-5 pl-5 sm:col-span-1 sm:border-t-0 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Focus
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Real impact
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