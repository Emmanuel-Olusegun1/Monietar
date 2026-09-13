'use client';

import { motion } from 'framer-motion';

const problems = [
  {
    number: '01',
    title: 'Money moves everywhere.',
    text: 'Bank transfers, physical cash, payment channels, and different currencies can all become separate financial records.',
  },
  {
    number: '02',
    title: 'The records fall behind.',
    text: 'When transactions are tracked manually, the financial picture is often reconstructed after the money has already moved.',
  },
  {
    number: '03',
    title: 'The picture becomes fragmented.',
    text: 'Sales may say one thing, the bank says another, and the cash box tells a different story.',
  },
  {
    number: '04',
    title: 'Decisions become harder.',
    text: 'Without a clear view of what has happened, knowing what the business can afford, where it is growing, or where money is leaking becomes guesswork.',
  },
];

export default function AboutProblem() {
  return (
    <section className="bg-[#f1f1f1]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* Top rule */}
        <div className="" />

        <div className="py-16 sm:py-20 lg:py-24">

          {/* Intro */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.8fr] lg:gap-24">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                  The Problem We Saw
                </span>
              </div>

              <div className="mt-8 hidden border-t border-gray-300 pt-4 lg:block">
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
                  Monietar
                </span>
              </div>
            </motion.div>

            {/* Main statement */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-5xl text-[clamp(2.6rem,6vw,6rem)] font-bold leading-[0.92] tracking-[-0.055em] text-gray-900"
              >
                Business moves fast.
                <br />
                <span className="text-emerald-900">
                  Financial visibility doesn't.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-8 max-w-2xl text-base font-light leading-7 text-gray-600 sm:text-lg sm:leading-8"
              >
                Businesses generate financial information every day.
                But that information does not always move together.
                Money can pass through different channels while the
                records remain scattered across notebooks, bank
                accounts, spreadsheets, and memory.
              </motion.p>
            </div>
          </div>

          {/* Problem list */}
          <div className="mt-16 border-t border-gray-300 sm:mt-20 lg:mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {problems.map((problem, index) => (
                <motion.article
                  key={problem.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className={`border-b border-gray-300 py-8 sm:py-10 lg:px-8 ${
                    index % 2 === 0
                      ? 'lg:border-r lg:pl-0'
                      : 'lg:pr-0'
                  }`}
                >
                  <div className="flex gap-6 sm:gap-8">

                    <span className="pt-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-800">
                      {problem.number}
                    </span>

                    <div className="max-w-lg">
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-gray-900 sm:text-2xl">
                        {problem.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
                        {problem.text}
                      </p>
                    </div>

                  </div>
                </motion.article>
              ))}

            </div>
          </div>

          {/* Closing statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 max-w-4xl sm:mt-20 lg:mt-24"
          >
            <div className="pt-4">
              <p className="text-[clamp(1.7rem,3.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-gray-900">
                The problem isn't a lack of financial data.
                <br className="hidden sm:block" />
                <span className="text-emerald-900">
                  It's that the data doesn't move together.
                </span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
