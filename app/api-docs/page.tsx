'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Terminal,
  Code2,
  AlertCircle,
  ArrowRight,
  Braces,
  GitBranch,
} from 'lucide-react';

export default function PureApiComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main className="relative overflow-hidden px-5 pb-10 pt-20 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="mx-auto max-w-[1440px]">
          {/* MAIN */}
          <div className="grid grid-cols-1 gap-14 pt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:pt-20">
            {/* LEFT */}
            <div className="flex flex-col justify-center">
              <h1 className="max-w-3xl text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                Build on
                <br />
                Monietar's
                <br />
                <span className="text-emerald-900">financial layer.</span>
              </h1>

              <div className="mt-10 max-w-xl border-t border-gray-300 pt-7">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  The Monietar API will give developers programmatic access to
                  the financial infrastructure powering the platform,
                  including business records, transactions, ledgers, and
                  multi-currency operations.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                <span>Developer access</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-900" />
                <span>Coming soon</span>
              </div>
            </div>

            {/* RIGHT — CODE WINDOW */}
            <div className="flex items-center">
              <div className="w-full overflow-hidden border border-gray-800 bg-[#111315] font-mono shadow-2xl">
                {/* WINDOW HEADER */}
                <div className="flex items-center justify-between border-b border-gray-800 bg-[#17191b] px-4 py-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-gray-500">
                    <Terminal className="h-3.5 w-3.5" />
                    api.monietar
                  </div>

                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-700" />
                    <span className="h-2 w-2 rounded-full bg-gray-700" />
                    <span className="h-2 w-2 rounded-full bg-gray-700" />
                  </div>
                </div>

                {/* CODE */}
                <div className="p-6 sm:p-8">
                  <div className="space-y-6 text-[11px] leading-6 sm:text-xs">
                    <div>
                      <span className="text-gray-700">$</span>{' '}
                      <span className="text-gray-400">
                        initialize monietar-api
                      </span>
                    </div>

                    <div className="border-l border-gray-800 pl-4 text-gray-600">
                      <p>// Initializing financial infrastructure...</p>
                      <p>// Loading ledger services...</p>
                      <p>// Preparing developer gateway...</p>
                    </div>

                    <div className="border border-gray-800 bg-[#17191b] p-5">
                      <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                          API Status
                        </span>

                        <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                          Preparing
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between gap-6">
                          <span className="text-gray-600">gateway</span>
                          <span className="text-gray-400">initializing</span>
                        </div>

                        <div className="flex justify-between gap-6">
                          <span className="text-gray-600">ledger</span>
                          <span className="text-gray-400">building</span>
                        </div>

                        <div className="flex justify-between gap-6">
                          <span className="text-gray-600">endpoints</span>
                          <span className="text-gray-400">not exposed</span>
                        </div>

                        <div className="flex justify-between gap-6">
                          <span className="text-gray-600">version</span>
                          <span className="text-gray-500">v0.1-alpha</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-gray-700">
                      <span className="text-emerald-800">→</span>{' '}
                      <span>
                        Public documentation will become available when the
                        developer gateway is ready.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WHAT THE API WILL PROVIDE */}
          <section className="mt-24 border-t border-gray-300 pt-6 lg:mt-32">
           <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-10">
              <div>
              <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Financial infrastructure developers can build with.
                </h2>
              </div>

              <div className="border-t border-gray-300">
                {[
                  {
                    number: '01',
                    icon: Braces,
                    title: 'Ledger access',
                    description:
                      'Programmatic access to the financial records and structures that power Monietar.',
                  },
                  {
                    number: '02',
                    icon: GitBranch,
                    title: 'Business integrations',
                    description:
                      'Connect external products, services, and workflows to the financial layer of a business.',
                  },
                  {
                    number: '03',
                    icon: Code2,
                    title: 'Developer-first tooling',
                    description:
                      'Clear endpoint references, authentication guides, examples, and integration documentation.',
                  },
                ].map((item) => {
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
          </section>

          {/* STATUS */}
          <section className="mt-20 border-y border-gray-300 py-7 sm:mt-24">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-center">
              <div className="flex items-center gap-3">
               <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Current status
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    Under development
                  </p>
                </div>
              </div>

              <div className="sm:border-l sm:border-gray-300 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Access
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  Not publicly available
                </p>
              </div>

              <div className="sm:border-l sm:border-gray-300 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Documentation
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  Coming with the API
                </p>
              </div>
            </div>
          </section>

          {/* CLOSING */}
          <section className="pt-20 sm:pt-24 lg:pt-28">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <div>
                <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.06em]">
                  Build on the financial layer your business{' '}
                  <span className="text-emerald-900">already needs.</span>
                </h2>
              </div>

              <div className="flex items-end">
                <div className="max-w-md">
                  <div className="mb-6 h-px w-10 bg-emerald-900" />

                  <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                    The Monietar API is being built to make financial
                    infrastructure easier to connect, extend, and build on.
                  </p>

                  <div className="mt-8 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    <span>Developer infrastructure</span>
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-900" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
