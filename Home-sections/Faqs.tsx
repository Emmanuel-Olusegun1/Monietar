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
                    className="text-center mb-16"
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
                        className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                    Everything you need to know about Monietar
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        className="relative max-w-md mx-auto"
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

                {/* Enhanced CTA Section */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl">
                        <motion.h3 
                            className="text-2xl font-bold mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            Ready to join the future of business finance?
                        </motion.h3>
                        <motion.p 
                            className="text-gray-300 mb-6 text-lg"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Join forward-thinking SMEs already benefiting from Monietar's AI-powered cash flow management.
                        </motion.p>
                        
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <motion.a
                                href="/auth/signup"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-gray-900 font-bold hover:bg-gray-50 transition-all duration-200 group shadow-lg"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <MessageCircle className="w-5 h-5" />
                                Join Monietar Now
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.div>
                            </motion.a>
                            
                            <motion.a
                                href="mailto:info@algoritic.com.ng"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-200 group border border-white/20"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Mail className="w-5 h-5" />
                                Contact Support
                            </motion.a>
                        </motion.div>
                    </div>
                    
                </motion.div>
            </div>
        </section>
    );
}