'use client';

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'final_cta',
        }),
      });

      if (!response.ok) {
        const errData = await response.json();

        throw new Error(
          errData.message ||
            'Failed to secure your spot. Please try again.'
        );
      }

      setIsSubmitted(true);
      setEmail('');
    } catch (err: any) {
      console.error('Final CTA submission error:', err);

      setError(
        err.message ||
          'A network error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="waitlist-section"
      className="bg-[#f1f1f1] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {!isSubmitted ? (
          <div className="grid grid-cols-1 gap-12 py-7 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:py-20">

            {/* Product context */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="mb-8 flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center border border-gray-300 text-gray-500">
                    <Plus className="h-3 w-3" />
                  </span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                    Start with Monietar
                  </span>
                </div>

                <div className="max-w-sm">
                  <p className="text-sm leading-6 text-gray-500">
                    Your business already generates the numbers.
                    Monietar brings them together so you can finally
                    see what they mean.
                  </p>
                </div>
              </div>

              {/* Product signals */}
              <div className="mt-10 hidden lg:block">
                <div className="border-t border-gray-300 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                        01
                      </span>
                      <span className="mt-1 block text-xs font-medium text-gray-600">
                        Sales
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                        02
                      </span>
                      <span className="mt-1 block text-xs font-medium text-gray-600">
                        Profit
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                        03
                      </span>
                      <span className="mt-1 block text-xs font-medium text-gray-600">
                        Cash Flow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="max-w-3xl">
                <h2 className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-bold leading-[0.94] tracking-[-0.055em] text-gray-900">
                  Put your business
                  <br />
                  <span className="text-emerald-900">
                    on one ledger.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Safely link your shop’s bank transfers, physical
                  cash box, and cross-border currency pools into one
                  hands-free ledger. No manual math, no missing flow.
                </p>

                {/* Waitlist form */}
                <div className="mt-8 max-w-xl">
                  <form
                    onSubmit={handleWaitlistSubmit}
                    className="flex w-full flex-col gap-3 sm:flex-row"
                  >
                    <div className="w-full min-w-0 sm:flex-1">
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="box-border block h-12 w-full min-w-0 appearance-none rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full sm:px-5"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="box-border flex h-12 w-full flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-900 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[150px] sm:rounded-full"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>Join Waitlist</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {error && (
                    <p className="mt-3 flex items-start gap-1.5 text-xs font-semibold leading-5 text-rose-600">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      <span>{error}</span>
                    </p>
                  )}

                  <div className="mt-4 hidden md:flex md:flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-medium uppercase tracking-[0.18em] text-gray-400 sm:text-[10px]">
                    <span>Early access</span>
                    <span className="text-gray-300">/</span>
                    <span>No payment required</span>
                    <span className="text-gray-300">/</span>
                    <span>Built for African businesses</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid min-h-[420px] place-items-center py-16"
          >
            <div className="max-w-xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-emerald-800/20 bg-emerald-900/5">
                <CheckCircle2 className="h-6 w-6 text-emerald-800" />
              </div>

              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-gray-900">
                You’re on the list.
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                Your early-access position has been reserved.
                Check your inbox for confirmation.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
