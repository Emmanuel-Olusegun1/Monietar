'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Confetti from 'react-dom-confetti';

// Types
interface VerificationResponse {
  success: boolean;
  message?: string;
  redirectUrl?: string;
}

interface ResendResponse {
  success: boolean;
  message?: string;
  retryAfter?: number;
}

// MOCK_DATA for frontend development
const MOCK_DATA = {
  validCodes: {
    '+2339034010384': '123456',
    '+2349071565791': '654321'
  },
  verifiedUsers: [
    '+2339034010384',
    '+2349071565791'
  ]
};

// Mock API service with enhanced error handling
const authAPI = {
  async verifyOtp(phone: string, token: string): Promise<VerificationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clean phone number for comparison
    const cleanedPhone = phone.replace(/\s/g, '');
    
    // Check if this is a test phone number with valid code
    const validCode = MOCK_DATA.validCodes[cleanedPhone as keyof typeof MOCK_DATA.validCodes];
    
    if (validCode && token === validCode) {
      // Add to verified users
      if (!MOCK_DATA.verifiedUsers.includes(cleanedPhone)) {
        MOCK_DATA.verifiedUsers.push(cleanedPhone);
      }
      
      return {
        success: true,
        message: 'Phone number verified successfully!',
        redirectUrl: '/dashboard'
      };
    } else if (validCode && token !== validCode) {
      throw new Error('invalid_otp');
    } else {
      throw new Error('Invalid verification code');
    }
  },

  async resendOtp(phone: string): Promise<ResendResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clean phone number for comparison
    const cleanedPhone = phone.replace(/\s/g, '');
    
    // Check if this is a test phone number
    const validCode = MOCK_DATA.validCodes[cleanedPhone as keyof typeof MOCK_DATA.validCodes];
    
    if (validCode) {
      return {
        success: true,
        message: 'New verification code sent!'
      };
    } else {
      throw new Error('Failed to send verification code');
    }
  }
};

// Confetti configuration
const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"]
};

export default function VerifyPhonePage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<'message' | 'verification'>('message');
  const [isLoading, setIsLoading] = useState(true);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const router = useRouter();
  const searchParams = useSearchParams();

  // Maximum attempts before lockout
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    const initializePhoneNumber = async () => {
      try {
        setIsLoading(true);
        const phoneFromParams = searchParams.get('phone');
        
        if (phoneFromParams) {
          // Use the phone number from URL parameters
          setPhoneNumber(phoneFromParams);
          
          // Restore attempts from session storage
          const storedAttempts = sessionStorage.getItem(`otp_attempts_${phoneFromParams}`);
          const storedLastAttempt = sessionStorage.getItem(`last_attempt_${phoneFromParams}`);
          
          if (storedAttempts) setAttempts(parseInt(storedAttempts));
          if (storedLastAttempt) setLastAttemptTime(parseInt(storedLastAttempt));
        } else {
          // Try to get phone number from session storage or mock data
          const storedPhone = sessionStorage.getItem('verification_phone');
          if (storedPhone) {
            setPhoneNumber(storedPhone);
          } else {
            // Fallback to mock data - use first available phone number
            const mockPhones = Object.keys(MOCK_DATA.validCodes);
            if (mockPhones.length > 0) {
              setPhoneNumber(mockPhones[0]);
            } else {
              toast.error('Phone number not found');
              router.push('/auth/signin');
              return;
            }
          }
        }

        // Restore countdown
        const storedCountdown = localStorage.getItem('otp_countdown');
        if (storedCountdown) {
          const remaining = Math.max(0, parseInt(storedCountdown) - Math.floor(Date.now() / 1000));
          setCountdown(remaining);
        }
        
      } catch (error) {
        console.error('Error initializing phone number:', error);
        toast.error('Failed to load verification session');
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    initializePhoneNumber();
  }, [searchParams, router]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        localStorage.setItem('otp_countdown', (countdown - 1).toString());
      }, 1000);
    } else {
      localStorage.removeItem('otp_countdown');
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const isLockedOut = useCallback(() => {
    if (attempts >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - lastAttemptTime;
      return timeSinceLastAttempt < LOCKOUT_DURATION;
    }
    return false;
  }, [attempts, lastAttemptTime]);

  const getRemainingLockoutTime = useCallback(() => {
    if (!isLockedOut()) return 0;
    const timeSinceLastAttempt = Date.now() - lastAttemptTime;
    return Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000);
  }, [isLockedOut, lastAttemptTime]);

  const handleOtpChange = useCallback((element: HTMLInputElement, index: number) => {
    if (isLockedOut()) return;
    
    const value = element.value;
    if (value && isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-submit when all digits are filled
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      setTimeout(() => {
        const form = document.querySelector<HTMLFormElement>('form');
        form?.requestSubmit();
      }, 100);
    }

    // Focus next input
    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [otp, isLockedOut]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isLockedOut()) return;

    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [otp, isLockedOut]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (isLockedOut()) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (pastedOtp.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus the last filled input or next empty
      const lastFilledIndex = Math.min(pastedOtp.length - 1, 5);
      const nextIndex = pastedOtp.length < 6 ? pastedOtp.length : 5;
      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [otp, isLockedOut]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLockedOut()) {
      const remainingTime = getRemainingLockoutTime();
      toast.error(`Too many attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`);
      return;
    }

    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    const loadingToast = toast.loading('Verifying code...');

    try {
      const result = await authAPI.verifyOtp(phoneNumber, otpString);
      
      setVerificationSuccess(true);
      toast.success('Phone number verified successfully!');
      
      // Clear attempts on success
      sessionStorage.removeItem(`otp_attempts_${phoneNumber}`);
      sessionStorage.removeItem(`last_attempt_${phoneNumber}`);
      sessionStorage.removeItem('verification_phone');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Verification error:', error);
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setLastAttemptTime(Date.now());
      
      // Store attempts in session storage
      sessionStorage.setItem(`otp_attempts_${phoneNumber}`, newAttempts.toString());
      sessionStorage.setItem(`last_attempt_${phoneNumber}`, Date.now().toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        toast.error(`Too many failed attempts. Please try again in 15 minutes.`);
      } else if (error.message.includes('invalid_otp')) {
        toast.error(`Invalid verification code. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        setOtp(['', '', '', '', '', '']);
        const firstInput = inputRefs.current[0];
        if (firstInput) {
          firstInput.focus();
        }
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
      await authAPI.resendOtp(phoneNumber);

      toast.success('New verification code sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Failed to send new code');
    } finally {
      setIsResending(false);
      toast.dismiss(loadingToast);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters except the plus sign
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If the number starts with +234, format as +234 09034010384
    if (cleaned.startsWith('+234')) {
      const rest = cleaned.slice(4); // Remove +234
      return `+234 ${rest}`;
    }
    
    // If it starts with 234 (without +), add the +
    if (cleaned.startsWith('234')) {
      const rest = cleaned.slice(3);
      return `+234 ${rest}`;
    }
    
    // If it starts with 0 (local format), convert to international
    if (cleaned.startsWith('0')) {
      const rest = cleaned.slice(1);
      return `+234 ${rest}`;
    }
    
    // For any other format, just return as is with spaces removed
    return cleaned;
  };

  const handleContinueToVerification = () => {
    setCurrentStep('verification');
    // Focus first OTP input after transition
    setTimeout(() => {
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    }, 300);
  };

  const remainingLockoutTime = getRemainingLockoutTime();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm border border-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
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
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm border border-gray-700 relative overflow-hidden"
      >
        {/* Success Confetti */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <Confetti active={verificationSuccess} config={confettiConfig} />
        </div>

        {/* Step 1: Message */}
        <AnimatePresence mode="wait">
          {currentStep === 'message' && (
            <motion.div
              key="message"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-900/30 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg border border-emerald-800/50">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Verify Your Phone
              </h1>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  We have sent a verification code to your phone number
                </p>
                
                <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-lg p-4">
                  <p className="text-lg font-semibold text-emerald-400">
                    {formatPhoneNumber(phoneNumber)}
                  </p>
                </div>
                
                <p className="text-gray-400 text-xs">
                  Please check your messages and enter the 6-digit code to continue
                </p>
              </div>

              <button
                onClick={handleContinueToVerification}
                className="w-full hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Continue to Verification
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <Link
                  href="/auth/signin"
                  className="text-gray-400 hover:text-gray-200 font-medium transition-colors duration-200 inline-flex items-center space-x-2 text-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Step 2: Verification */}
          {currentStep === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <button
                  onClick={() => setCurrentStep('message')}
                  className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4 text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg border border-emerald-800/50">
                  <svg
                    className="w-6 h-6 text-emerald-400"
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
                
                <h2 className="text-xl font-bold text-white mb-2">
                  Enter Verification Code
                </h2>
                
                <p className="text-gray-300 text-sm mb-2">
                  Enter the 6-digit code sent to
                </p>
                
                <p className="text-md font-semibold text-emerald-400 mb-6">
                  {formatPhoneNumber(phoneNumber)}
                </p>
              </div>

              {/* Lockout Warning */}
              <AnimatePresence>
                {isLockedOut() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="text-xs text-red-300">
                        <p className="font-medium">Too many attempts</p>
                        <p>Please try again in {Math.ceil(remainingLockoutTime / 60)} minutes</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-center space-x-2 mb-6">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      ref={el => {
                        inputRefs.current[index] = el;
                      }}
                      className={`otp-input w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all duration-200 ${
                        isLockedOut() 
                          ? 'border-gray-600 bg-gray-700 cursor-not-allowed text-gray-400' 
                          : 'border-gray-600 hover:border-emerald-500 bg-gray-700 text-white'
                      } ${
                        data ? 'border-emerald-400 bg-emerald-900/20' : ''
                      }`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={data}
                      onChange={e => handleOtpChange(e.target as HTMLInputElement, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      disabled={isVerifying || isLockedOut()}
                      autoFocus={index === 0 && !isLockedOut()}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otp.join('').length !== 6 || isLockedOut()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : isLockedOut() ? (
                    'Temporarily Locked'
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending || countdown > 0 || isLockedOut()}
                    className="text-emerald-400 hover:text-emerald-300 font-medium disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 text-sm"
                  >
                    {isResending ? (
                      <>
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : countdown > 0 ? (
                      <span>Resend code in {countdown}s</span>
                    ) : (
                      <span>Resend verification code</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-emerald-300">
                    <p className="font-medium">Didn't receive the code?</p>
                    <p className="mt-1">Check your message app or request a new code.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}