'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Poppins } from 'next/font/google';
import { Loader2, AlertCircle } from 'lucide-react';

const PoppinsFont = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
});

export default function Hero() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'hero' }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(
                    errData.message || 'Submission failed. Please try again.'
                );
            }

            setSubscribed(true);
            setEmail('');

            setTimeout(() => setSubscribed(false), 5000);
        } catch (err: any) {
            console.error('Error subscribing:', err);
            setError(
                err.message ||
                    'Something went wrong. Please check your connection.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className={`relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#f1f1f1] text-gray-900 ${PoppinsFont.className}`}
        >
            <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">

                {/* Top editorial line */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between border-b border-gray-300/80 py-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-gray-500 sm:text-[10px]"
                >
                    <span>Monietar</span>

                    <span className="hidden sm:block">
                        Business Finance / 01
                    </span>

                    <span>2026</span>
                </motion.div>

                {/* Main editorial area */}
                <section className="flex flex-1 flex-col justify-center py-12 sm:py-20 lg:py-24">

                    {/* Small label */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mb-7 flex items-center gap-3 sm:mb-8"
                    >
                        <span className="text-[9px] hidden md:block font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-xs sm:tracking-[0.25em]">
                            Financial visibility for modern business
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.15 }}
                        className="max-w-[1200px]"
                    >
                        <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.92] tracking-[-0.055em]">
                            Track Your Sales,
                            <br />
                            Profits, and Cash Flow
                            <br />
                            <span className="text-emerald-900">
                                Automatically
                            </span>
                        </h1>
                    </motion.div>

                    {/* Lower editorial section */}
                    <div className="mt-10 grid grid-cols-1 gap-8 border-t border-gray-300/80 pt-7 sm:mt-14 sm:gap-10 sm:pt-8 lg:grid-cols-[1fr_1.3fr] lg:items-end">

                        {/* Editorial marker */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                                One financial picture
                            </div>

                            <div className="mt-2 text-sm font-medium text-gray-500">
                                Sales / Profit / Cash Flow
                            </div>
                        </motion.div>

                        {/* Description + form */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35 }}
                            className="w-full max-w-3xl"
                        >
                            <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base lg:text-lg lg:leading-8">
                                Safely link your shop’s bank transfers,
                                physical cash box, and cross-border currency
                                pools into one hands-free ledger. No manual
                                math, No missing flow.
                            </p>

                            {/* Waitlist */}
                            <form
                                onSubmit={handleEmailSubmit}
                                className="mt-6 flex w-full max-w-xl flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3"
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                    className="h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:opacity-70 sm:h-12 sm:flex-1 sm:rounded-full sm:px-5"
                                />

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex h-12 w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-900 px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[145px] sm:rounded-full"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Join Waitlist'
                                    )}
                                </motion.button>
                            </form>

                            {/* Error */}
                            {error && (
                                <p className="mt-3 flex items-start gap-1.5 text-xs font-semibold leading-5 text-rose-600">
                                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </p>
                            )}

                            {/* Success */}
                            {subscribed && (
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 text-sm font-semibold text-emerald-700"
                                >
                                    ✓ Thanks for joining! Check your email soon.
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* Bottom editorial line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex items-center justify-between border-t border-gray-300/80 py-5 text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400 sm:text-[10px]"
                >
                    <span>Sales</span>
                    <span>Profit</span>
                    <span>Cash Flow</span>
                    <span className="hidden sm:block">
                        One hands-free ledger
                    </span>
                </motion.div>
            </div>
        </main>
    );
}
