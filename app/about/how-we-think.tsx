'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
} from 'lucide-react';

const flow = [
  {
    number: '01',
    title: 'Money moves',
    text: 'Sales, transfers, cash, and currencies move through the business every day.',
  },
  {
    number: '02',
    title: 'Movement becomes data',
    text: 'Those financial movements become structured records instead of disconnected events.',
  },
  {
    number: '03',
    title: 'Data becomes context',
    text: 'The numbers begin to show what is actually happening across the business.',
  },
  {
    number: '04',
    title: 'Context informs decisions',
    text: 'Clear financial visibility gives business owners better information to act on.',
  },
];

export default function AboutHowWeThink() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* Top rule */}
        <div className="" />

        <div className="py-16 sm:py-20 lg:py-24">

          {/* Header */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.8fr] lg:gap-24">

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                  How Monietar Thinks
                </span>
              </div>

              <div className="mt-8 hidden border-t border-gray-200 pt-4 lg:block">
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
                  Monietar
                </span>
              </div>
            </motion.div>

            {/* Main heading */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-5xl text-[clamp(2.7rem,6vw,6rem)] font-bold leading-[0.92] tracking-[-0.055em] text-gray-900"
              >
                One business.
                <br />
                <span className="text-emerald-900">
                  One financial picture.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-8 max-w-2xl text-base font-light leading-7 text-gray-600 sm:text-lg sm:leading-8"
              >
                We believe financial information becomes more useful
                when it is connected. Monietar is designed around the
                movement of money, not around isolated records.
              </motion.p>
            </div>
          </div>

          {/* Financial flow */}
          <div className="mt-16 sm:mt-20 lg:mt-28">

            {/* Desktop flow */}
            <div className="hidden border-y border-gray-300 lg:block">
              <div className="grid grid-cols-4">

                {flow.map((item, index) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    className={`relative min-h-[250px] px-8 py-8 ${
                      index !== flow.length - 1
                        ? 'border-r border-gray-300'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.18em] text-emerald-800">
                        {item.number}
                      </span>

                      {index !== flow.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                      )}
                    </div>

                    <div className="mt-16">
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-3 max-w-[220px] text-sm leading-6 text-gray-500">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}

              </div>
            </div>

            {/* Mobile / tablet flow */}
            <div className="border-y border-gray-300 lg:hidden">
              {flow.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="border-b border-gray-300 py-8 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-emerald-800">
                      {item.number}
                    </span>

                    {index !== flow.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-gray-300" />
                    )}
                  </div>

                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Closing principle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 max-w-4xl sm:mt-20 lg:mt-24"
          >
            <div className="pt-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:text-[10px]">
                The Monietar principle
              </span>

              <p className="mt-5 text-[clamp(1.8rem,3.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-gray-900">
                When the financial picture is clear,
                <br className="hidden sm:block" />
                <span className="text-emerald-900">
                  better decisions become possible.
                </span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
