'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Poppins } from 'next/font/google';

const PoppinsFont = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add your email submission logic here
            // Example: const response = await fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) });
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        } catch (error) {
            console.error('Error subscribing:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div ref={containerRef} className="relative bg-[#f1f1f1] overflow-hidden mb-0 pb-0">
            {/* Main content */}
            <section className="relative flex items-center justify-center">
                <div className="container mx-auto px-4 pb-0 mb-0 max-w-7xl">
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="mb-12 max-w-4xl mx-auto"
                        >
                            <h1 className={`text-3xl text-gray-900 md:text-5xl lg:text-6xl font-bold mb-4 mt-24 leading-tight tracking-tight ${PoppinsFont.className}`}>
                                Track Your Sales, Profits, and Cash Flow<span className=" text-emerald-900 "> Automatically</span>
                            </h1>
                            
                            <p className={`text-sm md:text-xl text-gray-600 leading-relaxed font-light ${PoppinsFont.className}`}>
                                Safely link your shop’s bank transfers, physical cash box, and cross-border currency pools into one hands-free ledger. No manual math, No missing flow.
                            </p>
                        </motion.div>

                        {/* Email Waitlist Input */}
                        <motion.div 
                            className="w-full max-w-md mb-0"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-emerald-800 text-white font-medium px-6 py-3 rounded-full hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Joining...' : 'Join Waitlist'}
                                </motion.button>
                            </form>
                            {subscribed && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-emerald-600 text-sm mt-3 font-medium"
                                >
                                    ✓ Thanks for joining! Check your email soon.
                                </motion.p>
                            )}
                        </motion.div>

                    </div>
                </div>
            </section>
        </div>
    );
}