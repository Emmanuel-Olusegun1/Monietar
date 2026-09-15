'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Loader2,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');

    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const sendResetInstructions = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    const loadingToast = toast.loading('Sending reset instructions...');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        console.error('Password reset error:', error);

        const message = error.message.toLowerCase();

        if (
          message.includes('rate limit') ||
          message.includes('too many requests')
        ) {
          toast.error(
            'Please wait a moment before requesting another reset email.'
          );
        } else if (
          message.includes('disabled') ||
          message.includes('not enabled')
        ) {
          toast.error(
            'Password reset is currently unavailable. Please contact support.'
          );
        } else {
          toast.error(
            error.message || 'Failed to send password reset instructions.'
          );
        }

        return;
      }

      setEmail(trimmedEmail);
      setIsSubmitted(true);

      toast.success('Password reset instructions sent. Check your email.');
    } catch (error) {
      console.error('Unexpected password reset error:', error);

      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendResetInstructions();
  };

  const handleResendInstructions = async () => {
    await sendResetInstructions();
  };

  const handleBackToSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 pt-30 md:pt-0 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Intro */}
            <div className="mb-7 text-center">
                  <div className=" hidden mx-auto mb-3 md:flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                  </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {isSubmitted
                  ? 'Check Your Email'
                  : 'Forgot Your Password?'}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {isSubmitted
                  ? 'We sent instructions to your email address. Follow the link to create a new password.'
                  : 'Enter the email address associated with your Monietar account and we’ll send you a password reset link.'}
              </p>
            </div>

            <div className="border border-gray-200 bg-white p-5 sm:p-7">
              {!isSubmitted ? (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold text-gray-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                      className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>

                  <div className="border-t border-gray-100 pt-5 text-center">
                    <button
                      type="button"
                      onClick={handleBackToSignIn}
                      disabled={isLoading}
                      className="group inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                      Back to Sign In
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-emerald-100 bg-emerald-50">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Instructions Sent
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    We sent a password reset link to:
                  </p>

                  <div className="mt-3 inline-block max-w-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                    <span className="break-all">{email}</span>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-gray-400">
                    Open the email and click the reset link to create your new
                    password. If you don’t see it, check your spam folder.
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={handleBackToSignIn}
                      className="w-full cursor-pointer bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Back to Sign In
                    </button>

                    <button
                      type="button"
                      onClick={handleResendInstructions}
                      disabled={isLoading}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        'Resend Reset Link'
                      )}
                    </button>
                  </div>

                  <div className="mt-5 border border-gray-100 bg-gray-50 p-3.5 text-left">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          Didn’t receive the email?
                        </p>

                        <ul className="mt-1.5 space-y-1 text-xs leading-5 text-gray-500">
                          <li>• Check your spam or junk folder.</li>
                          <li>• Make sure your email address is correct.</li>
                          <li>• Try resending the reset link.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {!isSubmitted && (
              <div className="mt-5 border border-emerald-100 bg-emerald-50/50 p-3.5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-5 text-gray-500">
                    Password reset links are temporary and can only be used
                    within their valid session.
                  </p>
                </div>
              </div>
            )}

            <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-gray-400">
              The Cash Flow Operating System
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1]">
      <Header />

      <main className="flex flex-1 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
      </main>

      <Footer />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}