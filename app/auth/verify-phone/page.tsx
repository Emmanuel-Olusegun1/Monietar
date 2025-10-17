'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

function VerifyPhoneContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phone = searchParams.get('phone');
    if (phone) {
      setPhoneNumber(phone);
    } else {
      toast.error('Phone number not found');
      router.push('/auth/signin');
    }
  }, [searchParams, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? '' : d))]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (pastedOtp.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus the last filled input
      const lastFilledIndex = pastedOtp.length - 1;
      if (lastFilledIndex < 5) {
        const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
        inputs[lastFilledIndex + 1]?.focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    const loadingToast = toast.loading('Verifying code...');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpString,
        type: 'sms',
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Phone number verified successfully!');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      if (error.message.includes('invalid_otp')) {
        toast.error('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.querySelector<HTMLInputElement>('.otp-input');
        firstInput?.focus();
      } else if (error.message.includes('expired')) {
        toast.error('Verification code has expired. Please request a new one.');
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error(error.message || 'Failed to verify code');
      }
    } finally {
      setIsVerifying(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before requesting a new code`);
      return;
    }

    setIsResending(true);
    const loadingToast = toast.loading('Sending new verification code...');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        throw error;
      }

      toast.success('New verification code sent!');
      setCountdown(60); // 60 seconds countdown
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      const firstInput = document.querySelector<HTMLInputElement>('.otp-input');
      firstInput?.focus();
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Failed to send new code');
    } finally {
      setIsResending(false);
      toast.dismiss(loadingToast);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format for display: +1 (234) 567-8900
    const cleaned = phone.replace(/\D/g, '');
    const countryCode = cleaned.slice(0, 1);
    const areaCode = cleaned.slice(1, 4);
    const firstPart = cleaned.slice(4, 7);
    const secondPart = cleaned.slice(7, 11);
    
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Phone
          </h1>
          
          <p className="text-gray-600 mb-4">
            Enter the 6-digit code sent to
          </p>
          
          <p className="text-lg font-semibold text-emerald-600 mb-6">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                className="otp-input w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors"
                type="text"
                name="otp"
                maxLength={1}
                value={data}
                onChange={e => handleOtpChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onPaste={handlePaste}
                disabled={isVerifying}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-emerald-600 hover:text-emerald-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? (
                'Sending...'
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                'Resend verification code'
              )}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Didn't receive the code?</p>
              <p className="mt-1">Check your message app or request a new code. It may take a few minutes to arrive.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPhone() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <VerifyPhoneContent />
    </Suspense>
  );
}