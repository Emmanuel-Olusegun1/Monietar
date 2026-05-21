'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronDown, Mail, Users, Lightbulb, Lock } from 'lucide-react';

export default function FAQ() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqData = [
        {
            question: "What is Monietar?",
            answer: "Monietar is an AI-driven financial intelligence platform for SMEs and startups in Africa. It links bank transfers, on-site cash, and multi-currency balances to surface real-time sales, profit, and cash flow insights, automatically.",
        },
        {
            question: "Is joining the waitlist free?",
            answer: "Yes. Joining the waitlist is free and early members get access perks when their cohort token unlocks.",
        },
        {
            question: "Are my connected accounts safe with Monietar?",
            answer: "Yes. We use read-only Open Banking tokens and industry-standard encryption. Monietar never moves your money, we only read transaction data to generate insights.",
        },
        {
            question: "What happens if my store goes offline?",
            answer: "Events are cached securely on-device while offline and automatically sync once connectivity returns, no data lost.",
        },
        {
            question: "How is my data protected?",
            answer: "Your data is encrypted at rest and in transit, access-controlled, and never sold. You can remove your account and data anytime.",
        }
    ];

    const filteredFaqs = faqData;

    useEffect(() => {
        // placeholder for any future mount logic
    }, []);

    return (
        <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <motion.div 
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="flex space-x-1">
                            {[1, 2, 3].map((dot) => (
                                <motion.div
                                    key={dot}
                                    className="w-1.5 h-1.5 bg-gray-600 rounded-lg"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: dot * 0.2 }}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">FAQ</span>
                    </motion.div>
                    
                    <motion.h2 
                        className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    
                    <motion.p 
                        className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                    Everything you need to know about Monietar
                    </motion.p>
                    {/* layout grid: left text, right search+faqs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left column: descriptive text */}
                        <div className="order-1 lg:order-1">
                            <p className="text-gray-700 mb-6">Monietar turns transaction data into clear, real-time insights for your business, sales, profit, and cash flow, automatically and securely. Explore the most common questions below.</p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-md bg-gray-900 text-white flex items-center justify-center">
                                        <Lightbulb className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Seamless integration</h4>
                                        <p className="text-gray-600">Connect banks, cash boxes, and currency pools without manual work.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-md bg-gray-900 text-white flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Privacy first</h4>
                                        <p className="text-gray-600">Read-only tokens and end-to-end encryption keep your data safe.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column: illustration + contact CTA */}
                        <div className="order-2 lg:order-2 flex items-center justify-center">
                            <motion.div
                                className="w-full flex flex-col items-center text-center"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div className="w-28 h-28 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                                    <Users className="w-12 h-12 text-gray-700" />
                                </div>
                                <p className="text-gray-600 mb-3">Browse common questions or reach out to our team for anything specific.</p>
                                <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800 text-white hover:bg-emerald-700 transition">
                                    <Mail className="w-4 h-4" />
                                    Contact Support
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count removed (search UI disabled) */}
                
                {/* FAQ Grid */}
                <div className="grid gap-4">
                    {filteredFaqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                            layout
                        >
                            <button
                                className="flex justify-between items-center w-full p-6 text-left group"
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="flex items-start space-x-4 flex-1">
                                    <motion.div 
                                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-900 text-white flex items-center justify-center text-sm font-semibold mt-1 group-hover:bg-emerald-800 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {index + 1}
                                    </motion.div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-lg font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors duration-200 mb-1">
                                            {faq.question}
                                        </h3>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 ml-4 cursor-pointer"
                                >
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </motion.div>
                            </button>
                            
                            <AnimatePresence>
                                {activeFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6">
                                            <div className="w-full h-px bg-emerald-100 mb-4"></div>
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* No-results UI removed (search disabled) */}

              
            </div>
        </section>
    );
}