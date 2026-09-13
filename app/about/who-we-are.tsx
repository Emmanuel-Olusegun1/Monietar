'use client';

import { motion } from 'framer-motion';

export default function AboutWhoWeAre() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* Top rule */}
        <div className="" />

        <div className="grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-[0.7fr_1.8fr] lg:gap-24 lg:py-24">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                Who We Are
              </span>
            </div>

            <div className="mt-8 hidden border-t border-gray-200 pt-4 lg:block">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
                Monietar
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <div className="max-w-4xl">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl text-[clamp(2.3rem,5vw,5rem)] font-bold leading-[0.96] tracking-[-0.05em] text-gray-900"
            >
              The financial side of
              <br />
              business should feel
              <span className="text-emerald-900"> simple.</span>
            </motion.h2>

            <div className="mt-12 space-y-8 border-t border-gray-300 pt-8 sm:mt-16 sm:pt-10">

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="max-w-3xl text-base leading-7 text-gray-700 sm:text-lg sm:leading-8"
              >
                <strong className="font-semibold text-gray-950">
                  Monietar
                </strong>{' '}
                is a digital financial intelligence and automated ledger
                platform built for cross-border merchants, SMEs, and
                growing businesses. We bring sales, transactions, cash,
                and currencies into one clearer financial picture.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8"
              >
                Businesses should not have to reconstruct their financial
                position from notebooks, scattered transfers, separate
                currency balances, and disconnected records. Monietar was
                created to reduce that operational friction and make the
                movement of money easier to see.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8"
              >
                Through secure read-only connections, automated ledgering,
                multi-currency tracking, and financial intelligence,
                Monietar gives business owners and their teams a more
                reliable view of what is happening across their operations.
                Less reconstruction. Less guesswork. More clarity.
              </motion.p>

            </div>

            {/* Closing statement */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 border-t border-gray-300 pt-6 sm:mt-16"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:text-[10px]">
                  Our approach
                </span>

                <span className="text-sm font-medium text-emerald-900">
                  Make the numbers make sense.
                </span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom rule */}
        <div className="border-t border-gray-300" />

      </div>
    </section>
  );
}
