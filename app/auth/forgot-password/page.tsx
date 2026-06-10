// app/auth/forgot-password/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Loader2, Mail, ArrowLeft, ShieldAlert } from 'lucide-react';

// Modern Supabase client (2025+)
import { supabase } from '@/utils/supabase/client';

// Create a client component that uses search params
function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill email from query parameter if available
  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Sending reset instructions...');

    try {
      // Use Supabase's built-in password reset function
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);

        if (error.message.includes('user not found')) {
          toast.error('No account found with this email address');
        } else if (error.message.includes('rate limit')) {
          toast.error('Please wait before requesting another reset');
        } else if (error.message.includes('disabled')) {
          toast.error('Password reset is temporarily disabled. Please contact support.');
        } else {
          toast.error(error.message || 'Failed to send reset instructions');
        }
        return;
      }

      setIsSubmitted(true);
      toast.success('Password reset instructions sent! Check your email.');

    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleBackToSignIn = () => {
    router.push('/auth/signin');
  };

  const handleResendInstructions = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Resending instructions...');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to resend instructions');
        return;
      }

      toast.success('Reset instructions resent! Check your email again.');
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex w-full md:h-screen bg-slate-50 text-slate-900">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* The image section */}
      <div className='flex-1 relative hidden md:block shadow-inner h-screen'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='password reset image'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-slate-900/10'></div>
      </div>

      {/* The main form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-white'>
        {/* Centered Content Container */}
        <div className="w-full max-w-md px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                {isSubmitted ? (
                  <Mail className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-7 h-7 text-emerald-600" />
                )}
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
              </h1>

              <p className="text-slate-500 text-sm leading-relaxed">
                {isSubmitted 
                  ? "We've sent password reset instructions to your email address. Check your inbox (and spam folder)."
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </p>
            </div>

            {!isSubmitted ? (
              /* Reset Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase pl-0.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 bg-slate-50/50 text-slate-900 text-sm"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm shadow-emerald-600/10 hover:shadow-md transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>

                <div className="text-center pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleBackToSignIn}
                    disabled={isLoading}
                    className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center justify-center mx-auto gap-2 transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Instructions Sent!
                  </h2>
                  <p className="text-slate-500 text-sm">
                    We sent an email to:
                  </p>
                  <p className="text-md font-semibold text-emerald-600 break-all bg-emerald-50/60 py-1.5 px-3 rounded-lg border border-emerald-100/50 inline-block max-w-full">
                    {email}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Click the secure link in the verification email to fully reset your workspace credentials.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={handleBackToSignIn}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm transition-all"
                    >
                      Back to Sign In
                    </button>

                    <button
                      onClick={handleResendInstructions}
                      disabled={isLoading}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Resending...
                        </>
                      ) : (
                        'Resend Instructions'
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-left">
                    <div className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p className="font-semibold text-slate-700">Didn't receive the email?</p>
                        <ul className="space-y-1 text-slate-500 list-disc pl-3.5 pt-1">
                          <li>Check your spam or configuration folder</li>
                          <li>Make sure your spelling is exactly correct</li>
                          <li>Try resending the instructions token</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Note */}
            {!isSubmitted && (
              <div className="mt-5 p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                <div className="flex items-start space-x-3">
                  <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <p className="font-bold text-emerald-800">Security Note</p>
                    <p className="mt-0.5 text-slate-500">
                      For validation safety, password reset lines auto-expire after 24 hours. Ensure you check nested tab configurations if verification is missing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div className="flex w-full h-screen bg-slate-50 justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );
}

// Main page component with Suspense
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
