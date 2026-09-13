'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Repeat,
  Package as BoxIcon,
  Globe,
  FileText,
} from 'lucide-react';

type Feature = {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const features: Feature[] = [
  {
    number: '01',
    icon: <TrendingUp className="h-4 w-4" />,
    title: 'Instant Profit and Loss Tracking',
    desc: 'View your true net margin updated with every transaction.',
  },
  {
    number: '02',
    icon: <Repeat className="h-4 w-4" />,
    title: 'Hands-Free Transfer Logging',
    desc: 'Bank transfers sync automatically so no transaction gets missed.',
  },
  {
    number: '03',
    icon: <BoxIcon className="h-4 w-4" />,
    title: 'Independent Physical Cash Vault',
    desc: 'Track cash sales, daily payouts, and money awaiting deposit.',
  },
  {
    number: '04',
    icon: <BoxIcon className="h-4 w-4" />,
    title: 'Automated Inventory Tracking',
    desc: 'Monitor stock levels automatically as sales happen.',
  },
  {
    number: '05',
    icon: <Globe className="h-4 w-4" />,
    title: 'Dual-Currency Sourcing Corridors',
    desc: 'Keep multi-currency accounting stable with automated rates.',
  },
  {
    number: '06',
    icon: <FileText className="h-4 w-4" />,
    title: 'Pre-compiled Financial Statements',
    desc: 'Share verified financial records with banks and partners.',
  },
];

export default function Feature() {
  return (
    <section
      id="features"
      className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Intro */}
        <motion.div
          className="mb-10 flex flex-col gap-5 pt-6 md:mb-12 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                The Monietar System
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-gray-950 sm:text-4xl md:text-5xl">
              Everything your money needs to
              <span className="text-emerald-900"> stay accounted for.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-gray-500 md:text-right">
            Bank transfers, physical cash, inventory, currencies, and
            financial records, connected in the background.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 border-t border-gray-200 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              className="group border-b border-gray-200 px-1 py-7 sm:px-5 lg:min-h-[180px] lg:border-r lg:px-6 lg:py-8 lg:[&:nth-child(3n)]:border-r-0"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-gray-400">
                  {feature.number}
                </span>

                <div className="flex h-7 w-7 items-center justify-center border border-gray-200 text-gray-500 transition-colors duration-300 group-hover:border-emerald-900 group-hover:text-emerald-900">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-lg font-medium leading-snug tracking-[-0.015em] text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-5 text-gray-500">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
