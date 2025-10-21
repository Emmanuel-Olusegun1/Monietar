'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// MOCK_DATA for frontend development
const MOCK_DATA = {
  users: {
    'user@monitar.com': {
      name: 'Monietar User1',
      id: 'user-001'
    },
    'my@monietar.com': {
      name: 'Monietar User2',
      id: 'user-002'
    }
  }
};

// Mock API service module
const authAPI = {
  async resetPassword(email: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if this is a test email
    const user = MOCK_DATA.users[email as keyof typeof MOCK_DATA.users];
    
    if (user) {
      return {
        success: true,
        message: 'Password reset instructions sent!'
      };
    } else {
      throw new Error('user not found');
    }
    
    // REAL API CALL - COMMENTED OUT
    /*
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset instructions');
    }
    
    return await response.json();
    */
  }
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const router = useRouter();

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
      await authAPI.resetPassword(email);
      
      setIsSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.message.includes('user not found')) {
        toast.error('No account found with this email address');
      } else if (error.message.includes('rate limit')) {
        toast.error('Please wait before requesting another reset');
      } else {
        toast.error(error.message || 'Failed to send reset instructions');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleBackToSignIn = () => {
    router.push('/auth/signin');
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
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Forgot Password?
              </h1>
              
              <p className="text-gray-300">
                {isSubmitted 
                  ? 'Check your email for reset instructions'
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-colors placeholder-gray-400 bg-gray-700 text-white"
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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
                    className="text-gray-400 hover:cursor-pointer hover:text-gray-200 font-medium flex items-center justify-center mx-auto"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-800/50">
                  <svg
                    className="w-10 h-10 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    Check Your Email
                  </h2>
                  <p className="text-gray-300">
                    We've sent password reset instructions to:
                  </p>
                  <p className="text-lg font-medium text-emerald-400">
                    {email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleBackToSignIn}
                      className="w-full hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">
                    <p>Didn't receive the email?</p>
                    <div className="mt-2 space-x-4">
                      <button
                        onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                        className="text-emerald-400 hover:cursor-pointer hover:text-emerald-300 font-medium"
                      >
                        Resend instructions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            {!isSubmitted && (
              <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium">Need help?</p>
                    <p className="mt-1">
                      If you're having trouble resetting your password, contact our support team at{' '}
                      <a href="mailto:support@monietar.com" className="text-emerald-400 hover:text-emerald-300">
                        support@monietar.com
                      </a>
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