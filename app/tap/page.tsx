'use client';

import { motion } from 'framer-motion';
import {
  Smartphone,
  Cpu,
  Flame,
  Layers,
  BadgePercent,
  ArrowRight,
  Check,
  ShieldCheck,
  Wifi,
  BarChart3,
  WalletCards,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MonietarTapPage() {
  const valueProps = [
    {
      number: '01',
      icon: BadgePercent,
      title: 'Built for affordability',
      description:
        'TAP focuses on the functions a business actually needs, without the cost of hardware designed for entertainment, gaming, cameras, or other consumer features.',
    },
    {
      number: '02',
      icon: Layers,
      title: 'A workspace, not another distraction',
      description:
        'The experience is centered around Monietar, giving merchants a focused environment for recording transactions, understanding cash flow, and staying on top of their business.',
    },
    {
      number: '03',
      icon: Flame,
      title: 'Designed for everyday business',
      description:
        'TAP is designed around long periods of practical use, helping merchants spend less time worrying about charging, unnecessary background processes, or hardware overhead.',
    },
    {
      number: '04',
      icon: Cpu,
      title: 'Built with connectivity realities in mind',
      description:
        'Monietar TAP is designed to keep the core business experience lightweight and efficient, making it better suited to environments where connectivity cannot always be taken for granted.',
    },
  ];

  const specifications = [
    {
      label: 'Form factor',
      value:
        'Compact smartphone-class terminal designed around dedicated business use.',
    },
    {
      label: 'Primary experience',
      value:
        'A focused Monietar workspace for business records, transactions, and financial visibility.',
    },
    {
      label: 'Connectivity',
      value:
        'Designed for efficient operation across available cellular and Wi-Fi connections.',
    },
    {
      label: 'Display',
      value:
        'Clear transactional display optimized for everyday business interactions.',
    },
    {
      label: 'Power',
      value:
        'Power-efficient architecture designed to reduce unnecessary battery consumption.',
    },
    {
      label: 'Positioning',
      value:
        'Purpose-built hardware intended to cost significantly less than a conventional smartphone.',
    },
  ];

  const useCases = [
    {
      number: '01',
      icon: WalletCards,
      title: 'Record the business',
      description:
        'Capture transactions and keep business activity organized without relying on a personal device.',
    },
    {
      number: '02',
      icon: BarChart3,
      title: 'Understand the numbers',
      description:
        'Give merchants a clearer view of the money moving through their business and what it means.',
    },
    {
      number: '03',
      icon: Wifi,
      title: 'Stay connected',
      description:
        'Keep the essential business experience lightweight and practical in environments with inconsistent connectivity.',
    },
    {
      number: '04',
      icon: ShieldCheck,
      title: 'Separate work from personal life',
      description:
        'Give the business its own dedicated workspace instead of mixing financial operations with a personal smartphone.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900">
      <Header />

      <main>
        {/* HERO — intentionally preserved */}
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
          

            <div className="pt-10 sm:pt-14 lg:pt-16">
             <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="max-w-6xl text-[clamp(3rem,7.5vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900"
              >
                Every business 
                <br />
                deserves powerful {' '}
                <br />
                <span className="text-emerald-900">ledger visibility.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16"
              >
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Dedicated workspace hardware
                  </span>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Monietar TAP is a dedicated, ultra-affordable hardware
                  terminal engineered specifically for merchants who need
                  robust ledger software without the heavy financial burden
                  of purchasing a consumer smartphone.
                </p>
              </motion.div>

              <div className="mt-10 grid grid-cols-1 border-y border-gray-300 sm:grid-cols-2">
                <div className="flex items-center gap-3 py-5 sm:border-r sm:border-gray-300 sm:pr-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    01
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    100% Dedicated Interface
                  </span>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-300 py-5 sm:border-t-0 sm:pl-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    02
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    Fraction of Smartphone Cost
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="bg-white p-5">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
              <h2 className="max-w-2xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  A business device built around the numbers that matter.
                </h2>

              <div className="max-w-2xl">
                <p className="text-base font-light leading-8 text-gray-600 sm:text-lg">
                  A smartphone is designed to do almost everything. TAP is
                  designed to help a business do what matters.
                </p>

                <p className="mt-6 text-sm font-light leading-7 text-gray-500 sm:text-base sm:leading-8">
                  It brings Monietar into a dedicated physical workspace,
                  giving merchants a simpler way to interact with their
                  financial records without requiring an expensive personal
                  smartphone to become the center of their business.
                </p>

                <div className="mt-10 grid grid-cols-1 border-t border-gray-200 sm:grid-cols-3">
                  <div className="border-b border-gray-200 py-5 sm:border-b-0 sm:border-r sm:pr-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Device
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Dedicated
                    </p>
                  </div>

                  <div className="border-b border-gray-200 py-5 sm:border-b-0 sm:border-r sm:px-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Experience
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Focused
                    </p>
                  </div>

                  <div className="py-5 sm:pl-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Purpose
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Business
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY TAP EXISTS */}
        <section className="bg-[#f1f1f1] p-5">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
              <div>
                <h2 className="max-w-2xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Designed to close the gap between business needs and
                  technology access.
                </h2>

                <p className="mt-7 max-w-lg text-sm font-light leading-7 text-gray-500 sm:text-base sm:leading-8">
                  The goal is not to build another smartphone. The goal is to
                  make useful financial infrastructure easier for more
                  businesses to access.
                </p>
              </div>

              <div>
                <div className="border-t border-gray-300">
                  {valueProps.map((prop) => {
                    const Icon = prop.icon;

                    return (
                      <motion.div
                        key={prop.number}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="group grid grid-cols-[auto_1fr] gap-5 border-b border-gray-300 py-7 sm:grid-cols-[60px_1fr_auto] sm:gap-8 sm:py-8"
                      >
                        <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                          {prop.number}
                        </span>

                        <div>
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-emerald-900 stroke-[1.8]" />

                            <h3 className="text-sm font-semibold tracking-tight text-gray-900 sm:text-base">
                              {prop.title}
                            </h3>
                          </div>

                          <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                            {prop.description}
                          </p>
                        </div>

                        <ArrowRight className="mt-1 hidden h-4 w-4 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-900 sm:block" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT FITS INTO THE BUSINESS */}
        <section className="bg-white p-5">
          <div className="mx-auto max-w-[1440px]"> <div className="pt-14 lg:pt-20">
              <div className="max-w-3xl">
              <h2 className="text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  From recording a transaction to understanding the business.
                </h2>

                <p className="mt-7 max-w-2xl text-sm font-light leading-7 text-gray-500 sm:text-base sm:leading-8">
                  TAP gives the Monietar experience a physical home. The
                  hardware stays simple so the financial intelligence can stay
                  front and center.
                </p>
              </div>

              <div className="mt-14 border-t border-gray-200 lg:mt-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {useCases.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.number}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                        }}
                        className={`group border-b border-gray-200 py-8 sm:px-7 lg:border-b-0 lg:border-r lg:py-8 ${
                          index === 0 ? 'lg:pl-0' : ''
                        } ${
                          index === useCases.length - 1
                            ? 'lg:border-r-0 lg:pr-0'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-semibold tracking-[0.15em] text-gray-400">
                            {item.number}
                          </span>

                          <Icon className="h-4 w-4 text-emerald-900 stroke-[1.7]" />
                        </div>

                        <h3 className="mt-10 text-base font-semibold tracking-tight text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                          {item.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAP VS SMARTPHONE */}
        <section className="bg-[#f1f1f1] p-5">
          <div className="mx-auto max-w-[1440px]">
           <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
              <div>
               <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Your business does not need another smartphone.
                </h2>
              </div>

              <div>
                <div className="border-t border-gray-300">
                  {[
                    {
                      label: 'Less hardware overhead',
                      text: 'No need to pay for a long list of consumer features that your business may never use.',
                    },
                    {
                      label: 'More operational focus',
                      text: 'A dedicated environment keeps business activity separate from the distractions of a personal phone.',
                    },
                    {
                      label: 'Lower access barrier',
                      text: 'Purpose-built hardware creates room to make financial tools more accessible to businesses operating with tighter technology budgets.',
                    },
                    {
                      label: 'One connected experience',
                      text: 'TAP and Monietar are designed as one system rather than a business application installed onto an unrelated device.',
                    },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[auto_1fr] gap-5 border-b border-gray-300 py-7 sm:grid-cols-[60px_1fr] sm:gap-8 sm:py-8"
                    >
                      <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <div className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-emerald-900 stroke-[2]" />

                          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                            {item.label}
                          </h3>
                        </div>

                        <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL SPECIFICATIONS */}
        <section className="bg-white p-5">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-20">
             
              <div>
                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Built around the work, not the extras.
                </h2>

                <p className="mt-6 max-w-md text-sm font-light leading-7 text-gray-500">
                  TAP removes unnecessary layers of a conventional smartphone
                  and concentrates the hardware around a focused operational
                  purpose.
                </p>
              </div>
             
              <div>
                <div className="border-t border-gray-300">
                  {specifications.map((spec, index) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-1 gap-3 border-b border-gray-300 py-6 sm:grid-cols-[1fr_1.5fr] sm:gap-10 sm:py-7"
                    >
                      <div className="flex items-start gap-4">
                        <span className="pt-1 text-[9px] font-semibold tracking-[0.15em] text-gray-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="text-sm font-semibold tracking-tight text-gray-900">
                          {spec.label}
                        </span>
                      </div>

                      <p className="text-sm font-light leading-6 text-gray-500">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING STATEMENT */}
        <section className="bg-[#f1f1f1] px-5 py-10">
          <div className="mx-auto max-w-[1440px]">
        

            <div className="grid grid-cols-1 gap-10 pt-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20 lg:pt-20">
              <div>
                <h2 className="max-w-5xl text-[clamp(2.8rem,6.5vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                  Financial infrastructure should meet {' '}
                  <span className="text-emerald-900">businesses where they are.</span>
                </h2>
              </div>

              <div className="flex items-end">
                <div className="max-w-md">
                  <div className="mb-6 h-px w-10 bg-emerald-900" />

                  <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                    TAP is built around a simple idea: access to financial
                    intelligence should not depend on owning an expensive
                    smartphone.
                  </p>

                  <div className="mt-8 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    <span>Built for the African's reality</span>
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 border-t border-gray-300 sm:grid-cols-4">
              <div className="border-r border-gray-300 py-5 sm:pr-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Interface
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Dedicated
                </p>
              </div>

              <div className="border-r border-gray-300 py-5 pl-5 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Connectivity
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Efficient
                </p>
              </div>

              <div className="border-t border-gray-300 py-5 sm:border-t-0 sm:border-r sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Focus
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Ledger
                </p>
              </div>

              <div className="border-t border-gray-300 py-5 pl-5 sm:border-t-0 sm:pl-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Access
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  Affordable
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