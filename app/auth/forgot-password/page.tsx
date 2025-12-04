'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, ArrowLeft, ShieldAlert } from 'lucide-react';

// Modern Supabase client (2025+)
import { supabase } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
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
    <div className="flex w-full md:h-screen bg-gray-900">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
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
      <div className='flex-1 relative hidden md:block shadow-lg h-screen'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='password reset image'
          fill
          className='object-cover rounded-md'
          priority
        />
        {/* Dark overlay for better text contrast */}
        <div className='absolute inset-0 bg-black/30'></div>
      </div>
      
      {/* The main form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-gray-900'>
        {/* Centered Content Container */}
        <div className="w-full max-w-md px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-800/50">
                {isSubmitted ? (
                  <Mail className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-emerald-400" />
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
              </h1>
              
              <p className="text-gray-300">
                {isSubmitted 
                  ? 'We\'ve sent password reset instructions to your email address. Check your inbox (and spam folder).'
                  : 'Enter your email address and we\'ll send you a link to reset your password'
                }
              </p>
            </div>

            {!isSubmitted ? (
              /* Reset Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors placeholder-gray-500 bg-gray-700 text-white"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={handleBackToSignIn}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-200 font-medium flex items-center justify-center mx-auto gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    Instructions Sent!
                  </h2>
                  <p className="text-gray-300">
                    We sent an email to:
                  </p>
                  <p className="text-lg font-medium text-emerald-400 break-all">
                    {email}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click the link in the email to reset your password.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleBackToSignIn}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      Back to Sign In
                    </button>
                    
                    <button
                      onClick={handleResendInstructions}
                      disabled={isLoading}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Resending...
                        </>
                      ) : (
                        'Resend Instructions'
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-gray-300">
                        <p className="font-medium">Didn't receive the email?</p>
                        <ul className="mt-2 space-y-1 text-left">
                          <li>• Check your spam or junk folder</li>
                          <li>• Make sure you entered the correct email</li>
                          <li>• Try resending the instructions</li>
                          <li>• Contact support at{' '}
                            <a href="mailto:support@monietar.com" className="text-emerald-400 hover:text-emerald-300">
                              support@monietar.com
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Note */}
            {!isSubmitted && (
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-emerald-400">Security Note</p>
                    <p className="mt-1">
                      For security reasons, password reset links expire after 24 hours. If you don't receive the email within a few minutes, please check your spam folder.
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