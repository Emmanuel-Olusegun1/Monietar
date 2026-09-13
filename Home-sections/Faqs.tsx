'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: 'What is Monietar?',
      answer:
        'Monietar is an AI-driven financial intelligence platform for SMEs and startups in Africa. It links bank transfers, on-site cash, and multi-currency balances to surface real-time sales, profit, and cash flow insights, automatically.',
    },
    {
      question: 'Is joining the waitlist free?',
      answer:
        'Yes. Joining the waitlist is free and early members get access perks when their cohort token unlocks.',
    },
    {
      question: 'Are my connected accounts safe with Monietar?',
      answer:
        'Yes. We use read-only Open Banking tokens and industry-standard encryption. Monietar never moves your money; we only read transaction data to generate insights.',
    },
    {
      question: 'What happens if my store goes offline?',
      answer:
        'Events are cached securely on-device while offline and automatically sync once connectivity returns, with no data lost.',
    },
    {
      question: 'How is my data protected?',
      answer:
        'Your data is encrypted at rest and in transit, access-controlled, and never sold. You can remove your account and data anytime.',
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="bg-[#ffffff] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          className="mb-10 pt-6 md:mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Frequently Asked
            </span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.035em] text-gray-950 sm:text-4xl md:text-5xl">
              Questions before you
              <span className="text-emerald-900"> get started.</span>
            </h2>

            <p className="max-w-xs text-sm leading-6 text-gray-500 md:text-right">
              Everything you need to know about Monietar, your data, and
              connected financial accounts.
            </p>
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="border-t border-gray-300">
          {faqData.map((faq, index) => {
            const isActive = activeFaq === index;

            return (
              <motion.div
                key={faq.question}
                className="border-b border-gray-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.04,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center gap-4 py-5 text-left md:py-6"
                  aria-expanded={isActive}
                >
                  {/* Number */}
                  <span className="w-7 shrink-0 font-mono text-[10px] tracking-widest text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Question */}
                  <span className="flex-1 text-base font-medium tracking-[-0.01em] text-gray-900 sm:text-lg">
                    {faq.question}
                  </span>

                  {/* Icon */}
                  <motion.span
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-300 text-gray-500"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: 'easeOut' },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 pb-6 md:grid-cols-12">
                        <div className="md:col-span-7 md:col-start-2">
                          <p className="text-sm leading-6 text-gray-500 sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-900" />

          <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
            Built with privacy and security in mind
          </p>
        </motion.div>
      </div>
    </section>
  );
}
