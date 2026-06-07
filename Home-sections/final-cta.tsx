'use client';

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API database synchronization layer
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    // Outer section wrapper providing clean breathing room around the card
    <section id="waitlist-section" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="container mx-auto max-w-6xl">
        
        {/* Floating Rounded Container Card - Styled directly based on image_c79302.jpg */}
        <div className="relative w-full bg-black border border-zinc-900 rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-emerald-500/5">
          
          {/* Subtle Ambient Background Gradients to fit Monietar's brand theme */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {!isSubmitted ? (
              <>
                {/* Core Headline String */}
                <motion.h2
                  className="text-1xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Take Command of Your Store’s <span className="text-emerald-400 mt-2 block"> Financial Intelligence Today.
                  </span>
                </motion.h2>

                {/* Structured Muted Two-Line Sub-text */}
                <motion.p
                  className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Join our exclusive early-bird cohort to lock in your 6 month 50% discount and eliminate manual bookkeeping forever.
                </motion.p>

                {/* Clean Inline Form Block matching image_c79302.jpg */}
            <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 bg-zinc-900/90 p-2 rounded-2xl border border-gray-800 focus-within:border-emerald-500/50 transition-colors shadow-2xl">
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your business email address..."
                className="flex-grow bg-transparent px-4 py-3 tetoxt-white text-base placeholder-gray-500 outline-none rounded-xl disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-black text-base font-bold px-6 py-3.5 sm:py-0 rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap flex items-center justify-center gap-2 min-w-[180px]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-black" />
                ) : (
                  <>
                    Claim My 50% Discount
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-white text-lg font-bold mb-1">Position Secured Successfully</h3>
              <p className="text-gray-400 text-sm">We've reserved your early tokens. Check your inbox for queue verification.</p>
            </motion.div>
          )}
        </motion.div>
              </>
            ) : (
              /* Inline Animated Success State Card */
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Position Secured Successfully</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                  We've reserved your early tokens. Check your inbox shortly for queue verification.
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}