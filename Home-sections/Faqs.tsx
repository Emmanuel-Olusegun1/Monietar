'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Mail, MessageCircle, Search, Clock, Users, Star } from 'lucide-react';

export default function FAQ() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqData = [
        {
            question: "What is Monietar?",
            answer: "Monietar is an AI-powered platform designed to help SMes/SMBs and Startups in Africa to safely link their shop’s bank transfers, physical cash box, and cross-border currency pools into one hands-free ledger. No manual math, No missing flow.",
        },
        {
            question: "Is joining the waitlist free?",
            answer: "Yes, Registration is entirely free, and waitlist entries get an exclusive 90-days zero-cost window when their cohort access token unlocks.",
        },
        {
            question: "Is my connnected bank accounts safe  with Monietar?",
            answer: "Completely. Monietar has read-only access via secure Open Banking tokens. We can never hold, touch, or move your money, we only read statements to automate your books",
        },
       
        {
            question: "What happens to my data if my store network drops?",
            answer: "The platform securely logs pending alerts locally on your device hits internet coverage again, it automatically syncs back up to your cloud database",
        },
        {
            question: "Is my data secure on the platform?",
            answer: "Your financial data is encrypted end-to-end and never shared or sold. You stay in full control, delete your data anytime, instantly.",
        }
    ];

    const filteredFaqs = faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Keyboard shortcut for search (Cmd+K / Ctrl+K)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
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
                            <p className="text-gray-700 mb-6">Monietar simplifies bookkeeping for SMEs and startups across Africa — connect accounts, sync offline sales, and reconcile automatically. Explore the most common questions below.</p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-md bg-gray-900 text-white flex items-center justify-center">💡</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Seamless integration</h4>
                                        <p className="text-gray-600">Connect banks, cash boxes, and currency pools without manual work.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-md bg-gray-900 text-white flex items-center justify-center">🔒</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Privacy first</h4>
                                        <p className="text-gray-600">Read-only tokens and end-to-end encryption keep your data safe.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column will contain search and faqs list */}
                        <div className="order-2 lg:order-2">
                            {/* Search Bar */}
                            <motion.div
                                className="relative w-full"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search questions... (Ctrl+K)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                />
                                {searchTerm && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                {searchTerm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6"
                    >
                        <p className="text-gray-600">
                            Found {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                        </p>
                    </motion.div>
                )}
                
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
                                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-semibold mt-1 group-hover:bg-gray-800 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {index + 1}
                                    </motion.div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200 mb-1">
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
                                            <div className="w-full h-px bg-gray-200 mb-4"></div>
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

                {/* No Results */}
                {searchTerm && filteredFaqs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600">Try different keywords or browse all questions above</p>
                    </motion.div>
                )}

              
            </div>
        </section>
    );
}