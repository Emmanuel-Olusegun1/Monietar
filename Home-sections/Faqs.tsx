'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';

export default function Pricing() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
      };
    


  return (

          <section id="faq" className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-4xl">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Everything you need to know about fintar</p>
              </motion.div>
              
              <div className="space-y-4">
                {[
                  {
                        question: "What is Fintic?",
                        answer: "Fintic is an AI-powered platform designed to help SMes/SMBs and Startups in Afria manage their cash flow, track income and expenses, create budgets, and gain insights into their financial health."
                  },
                  {
                    question: "Is Fintic really free to use?",
                    answer: "Yes! Our core features are completely free forever. We believe every African business should have access to powerful financial tools. The Free tier includes income/expense tracking, Multi-language Support, AI-powered insights, email support and lot more. We'll offer Pro and Premium features in the future, but the core functionality will always remain free."
                  },
                  {
                    question: "Is my financial data secure on the platform",
                    answer: "Yes, we prioritize data security. The platform uses end-to-end encryption, complies with GDPR and local regulations, and undergoes regular security audits to protect your financial information."
                  },
                  {
                    question: "Can I access the system on mobile devices?",
                    answer: "Absolutely! Fintic Cash Flow Management System is designed to be mobile-friendly, allowing you to track your finances and access insights anytime, anywhere."
                  },
                  {
                    question: "When will the Pro tier be available?",
                    answer: "The Pro tier is currently in development and is expected to launch in mid-2026."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <button
                      className="flex justify-between items-center w-full p-6 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

  );
}