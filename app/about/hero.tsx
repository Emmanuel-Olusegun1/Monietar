'use client';

import { motion } from 'framer-motion';

export default function AboutHeroPage() {
  return (
    <main className="bg-[#f1f1f1] text-gray-900">
      <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-[1440px]">

          {/* Hero */}
          <div className="grid grid-cols-1 gap-6 pt-6">

            {/* Side label */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className=""
            >
            </motion.div>

            {/* Main statement */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="max-w-6xl text-[clamp(3rem,7.5vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900"
              >
                Financial happiness
                <br />
                for every enterprise,
                <br />
                <span className="text-emerald-900">
                  everywhere.
                </span>
              </motion.h1>

              {/* Supporting statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16"
              >
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    What we believe
                  </span>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Financial clarity should not be reserved for businesses
                  with accountants, spreadsheets, or complex systems.
                  Monietar exists to make the financial side of running
                  a business simpler, clearer, and easier to understand.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}