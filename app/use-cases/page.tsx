'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Store,
  Globe2,
  Users,
  Check,
  ArrowUpRight,
} from 'lucide-react';

export default function UseCasesPage() {
  const useCases = [
    {
      id: 'retail-merchants',
      icon: Store,
      number: '01',
      badge: 'Local Retail',
      title: 'From daily transactions to a clearer picture of the business.',
      description:
        'For retail merchants who still rely on notebooks, screenshots, memory, or scattered records to keep track of daily sales and cash movement.',
      painPoint:
        'Manual records make it easy to miss transactions, lose track of cash, spend too much time reconciling at the end of the day, or fall for unverified payment claims.',
      solution:
        'Monietar brings transactions into one financial view, helping merchants track incoming payments, maintain an independent cash record, and understand what actually moved through the business.',
      benefits: [
        'Less manual bookkeeping',
        'Faster payment verification',
        'Clearer daily cash position',
      ],
    },
    {
      id: 'growing-shops',
      icon: Users,
      number: '02',
      badge: 'Multi-Attendant Outlets',
      title: 'Keep the shop moving without putting the owner in the middle.',
      description:
        'For growing merchants whose shops, outlets, or warehouses are increasingly managed by assistants, attendants, or sales representatives.',
      painPoint:
        'When payment confirmations stay on the owner’s phone, every transaction becomes another call, message, or interruption before an assistant can release an order.',
      solution:
        'Monietar helps synchronize payment visibility across the people who need it while keeping sensitive banking information protected, giving owners better oversight without becoming the payment bottleneck.',
      benefits: [
        'Faster customer checkout',
        'Better visibility across attendants',
        'Reduced payment and inventory leakage',
      ],
    },
    {
      id: 'cross-border',
      icon: Globe2,
      number: '03',
      badge: 'Cross-Border Trade',
      title: 'Know what cross-border transactions are really costing you.',
      description:
        'For merchants sourcing inventory or selling across Nigeria and Francophone West Africa who need their financial records to reflect more than one currency.',
      painPoint:
        'Currency movements, sourcing costs, and different exchange rates can make it difficult to know the real cost of inventory and the actual margin on a transaction.',
      solution:
        'Monietar connects cross-border sourcing and currency movements back to your financial records, with dual-currency tracking and market-rate intelligence that helps merchants make better pricing and purchasing decisions.',
      benefits: [
        'Better FX-aware margin visibility',
        'Unified multi-currency records',
        'Smarter sourcing decisions',
      ],
    },
  ];

  const operationalSectors = [
    {
      title: 'FMCG & Groceries',
      detail:
        'Track frequent daily transactions, cash movement, and fast-moving inventory without relying on scattered records.',
    },
    {
      title: 'Fashion & Apparel',
      detail:
        'Keep supplier payments, sales activity, and inventory costs connected as your business grows across locations.',
    },
    {
      title: 'Electronics & Gadgets',
      detail:
        'Maintain clearer payment records for higher-value transactions and reduce dependence on screenshots and verbal confirmation.',
    },
    {
      title: 'Wholesale & Distribution',
      detail:
        'Bring large transaction volumes, inventory movement, and financial reporting into one clearer operating picture.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1] font-sans text-gray-900 antialiased selection:bg-emerald-900/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* Hero */}
        <section className="px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mt-5 max-w-6xl text-[clamp(3.2rem,8vw,8rem)] font-bold leading-[0.88] tracking-[-0.065em] text-gray-950">
                Built around
                <br />
                <span className="text-emerald-900">
                  how businesses actually operate.
                </span>
              </h1>
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Financial intelligence
                </span>

                <p className="mt-3 text-sm font-medium text-gray-900">
                  Designed for growing SMEs
                </p>
              </div>

              <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                Monietar helps merchants make sense of the money already
                moving through their businesses — from everyday retail
                transactions to multi-attendant operations and cross-border
                sourcing.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-14 border-b border-gray-300 pb-6">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                Where Monietar fits
              </span>
            </div>

            <div className="divide-y divide-gray-300">
              {useCases.map((uc, index) => {
                const IconComponent = uc.icon;

                return (
                  <motion.article
                    key={uc.id}
                    className="grid grid-cols-1 gap-10 py-14 first:pt-0 last:pb-0 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.05,
                    }}
                  >
                    {/* Meta */}
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] tracking-widest text-gray-400">
                          {uc.number}
                        </span>

                        <IconComponent className="h-5 w-5 text-emerald-900" />
                      </div>

                      <div className="mt-10">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
                          {uc.badge}
                        </span>

                        <p className="mt-4 max-w-xs text-xs leading-5 text-gray-400">
                          A practical use case for merchants managing growing
                          transaction volumes and increasingly complex
                          operations.
                        </p>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div>
                      <h2 className="max-w-4xl text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-gray-950 sm:text-4xl lg:text-5xl">
                        {uc.title}
                      </h2>

                      <p className="mt-6 max-w-3xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                        {uc.description}
                      </p>

                      <div className="mt-10 grid grid-cols-1 gap-8 border-t border-gray-200 pt-8 md:grid-cols-2">
                        {/* Friction */}
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 bg-gray-400" />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                              The friction
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-gray-600">
                            {uc.painPoint}
                          </p>
                        </div>

                        {/* Impact */}
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 bg-emerald-900" />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
                              Monietar impact
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-gray-700">
                            {uc.solution}
                          </p>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mt-8 border-t border-gray-200 pt-6">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                          What changes
                        </span>

                        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                          {uc.benefits.map((benefit, benefitIndex) => (
                            <div
                              key={benefitIndex}
                              className="flex items-center gap-2"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-900" />

                              <span className="text-xs font-medium text-gray-700">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Operational Sectors */}
        <section className="bg-[#f1f1f1] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  Across industries
                </span>

                <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-950 sm:text-5xl">
                  Different businesses.
                  <br />
                  <span className="text-emerald-900">
                    Similar financial problems.
                  </span>
                </h2>
              </div>

              <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                Monietar is designed around the financial patterns that show
                up across growing businesses — regardless of what they sell,
                where they operate, or how their teams are structured.
              </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 border-t border-gray-300 md:grid-cols-2">
              {operationalSectors.map((sector, index) => (
                <motion.div
                  key={sector.title}
                  className={`group border-b border-gray-300 py-8 md:px-8 ${
                    index % 2 === 0
                      ? 'md:border-r md:pl-0'
                      : 'md:pr-0'
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-gray-400">
                        0{index + 1}
                      </span>

                      <h3 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-gray-950 transition-colors group-hover:text-emerald-900">
                        {sector.title}
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                        {sector.detail}
                      </p>
                    </div>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-900" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              className="border-t border-gray-300 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                The bigger picture
              </span>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
                <h2 className="max-w-5xl text-3xl font-bold leading-[0.98] tracking-[-0.05em] text-gray-950 sm:text-5xl lg:text-6xl">
                  Your business is already generating the data.
                  <span className="text-emerald-900">
                    {' '}
                    Monietar helps you make sense of it.
                  </span>
                </h2>

                <p className="max-w-md text-sm font-light leading-7 text-gray-500 lg:justify-self-end lg:text-right">
                  From everyday transactions to inventory, cash flow, sourcing,
                  and cross-border activity, the goal is simple: give business
                  owners a clearer financial picture without adding more
                  complexity to the way they work.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
