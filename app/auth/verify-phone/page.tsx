'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Info,
  Loader2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { createClient } from '@/lib/supabase/client';

export default function VerifyPhonePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000;

  /*
   * Load the phone number and stored OTP state.
   * This happens in the background without showing an initial loading screen.
   */
  useEffect(() => {
    const initializeVerification = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const phoneFromUrl = params.get('phone');

        const storedPhone = sessionStorage.getItem(
          'verification_phone'
        );

        const resolvedPhone = phoneFromUrl || storedPhone;

        if (!resolvedPhone) {
          toast.error(
            'Phone number not found. Please start verification again.'
          );

          router.replace('/auth/signin');
          return;
        }

        setPhoneNumber(resolvedPhone);

        sessionStorage.setItem(
          'verification_phone',
          resolvedPhone
        );

        const storedAttempts = sessionStorage.getItem(
          `otp_attempts_${resolvedPhone}`
        );

        const storedLastAttempt = sessionStorage.getItem(
          `last_attempt_${resolvedPhone}`
        );

        if (storedAttempts) {
          setAttempts(Number.parseInt(storedAttempts, 10));
        }

        if (storedLastAttempt) {
          setLastAttemptTime(
            Number.parseInt(storedLastAttempt, 10)
          );
        }

        const storedCountdown = localStorage.getItem(
          `otp_countdown_${resolvedPhone}`
        );

        if (storedCountdown) {
          const remaining = Math.max(
            0,
            Number.parseInt(storedCountdown, 10) -
              Math.floor(Date.now() / 1000)
          );

          setCountdown(remaining);
        }
      } catch (error) {
        console.error(
          'Failed to initialize phone verification:',
          error
        );

        toast.error(
          'Unable to load verification. Please try again.'
        );

        router.replace('/auth/signin');
      }
    };

    initializeVerification();
  }, [router]);

  /*
   * Countdown timer
   */
  useEffect(() => {
    if (!phoneNumber || countdown <= 0) {
      if (phoneNumber) {
        localStorage.removeItem(
          `otp_countdown_${phoneNumber}`
        );
      }

      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((previous) => Math.max(0, previous - 1));
    }, 1000);

    localStorage.setItem(
      `otp_countdown_${phoneNumber}`,
      String(
        Math.floor(Date.now() / 1000) + countdown
      )
    );

    return () => window.clearTimeout(timer);
  }, [countdown, phoneNumber]);

  /*
   * Lockout
   */
  const isLockedOut = useCallback(() => {
    if (attempts < MAX_ATTEMPTS) {
      return false;
    }

    const elapsed = Date.now() - lastAttemptTime;

    return elapsed < LOCKOUT_DURATION;
  }, [attempts, lastAttemptTime]);

  /*
   * Remaining lockout time
   */
  const getRemainingLockoutTime = useCallback(() => {
    if (!isLockedOut()) {
      return 0;
    }

    const elapsed = Date.now() - lastAttemptTime;

    return Math.max(
      0,
      Math.ceil(
        (LOCKOUT_DURATION - elapsed) / 1000
      )
    );
  }, [isLockedOut, lastAttemptTime]);

  /*
   * OTP input
   */
  const handleOtpChange = useCallback(
    (
      element: HTMLInputElement,
      index: number
    ) => {
      if (isLockedOut() || isVerifying) {
        return;
      }

      const value = element.value;

      if (value && !/^\d$/.test(value)) {
        return;
      }

      const nextOtp = [...otp];
      nextOtp[index] = value;

      setOtp(nextOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (
        value &&
        index === 5 &&
        nextOtp.every((digit) => digit !== '')
      ) {
        window.setTimeout(() => {
          document
            .querySelector<HTMLFormElement>(
              '#phone-verification-form'
            )
            ?.requestSubmit();
        }, 100);
      }
    },
    [isLockedOut, isVerifying, otp]
  );

  /*
   * Keyboard navigation
   */
  const handleKeyDown = useCallback(
    (
      event: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (isLockedOut() || isVerifying) {
        return;
      }

      if (event.key === 'Backspace') {
        if (otp[index]) {
          const nextOtp = [...otp];
          nextOtp[index] = '';
          setOtp(nextOtp);
          return;
        }

        if (index > 0) {
          const nextOtp = [...otp];
          nextOtp[index - 1] = '';
          setOtp(nextOtp);

          inputRefs.current[index - 1]?.focus();
        }
      }

      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }

      if (event.key === 'ArrowRight' && index < 5) {
        event.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    },
    [isLockedOut, isVerifying, otp]
  );

  /*
   * Paste OTP
   */
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (isLockedOut() || isVerifying) {
        return;
      }

      event.preventDefault();

      const pasted = event.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);

      if (!pasted) {
        return;
      }

      const nextOtp = ['', '', '', '', '', ''];

      pasted
        .split('')
        .forEach((digit, index) => {
          nextOtp[index] = digit;
        });

      setOtp(nextOtp);

      const nextIndex = Math.min(
        pasted.length,
        5
      );

      inputRefs.current[nextIndex]?.focus();

      if (pasted.length === 6) {
        window.setTimeout(() => {
          document
            .querySelector<HTMLFormElement>(
              '#phone-verification-form'
            )
            ?.requestSubmit();
        }, 100);
      }
    },
    [isLockedOut, isVerifying]
  );

  /*
   * Verify OTP using Supabase
   */
  const handleVerify = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!phoneNumber) {
      toast.error(
        'Phone number is missing. Please start again.'
      );
      return;
    }

    if (isLockedOut()) {
      const minutes = Math.ceil(
        getRemainingLockoutTime() / 60
      );

      toast.error(
        `Too many attempts. Please try again in ${minutes} minute${
          minutes === 1 ? '' : 's'
        }.`
      );

      return;
    }

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error(
        'Please enter the 6-digit verification code.'
      );
      return;
    }

    setIsVerifying(true);

    try {
      const { error } =
        await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otpString,
          type: 'sms',
        });

      if (error) {
        throw error;
      }

      /*
       * Successful verification
       */
      setVerificationSuccess(true);

      sessionStorage.removeItem(
        `otp_attempts_${phoneNumber}`
      );

      sessionStorage.removeItem(
        `last_attempt_${phoneNumber}`
      );

      sessionStorage.removeItem(
        'verification_phone'
      );

      localStorage.removeItem(
        `otp_countdown_${phoneNumber}`
      );

      setAttempts(0);
      setLastAttemptTime(0);

      toast.success(
        'Phone number verified successfully!'
      );

      window.setTimeout(() => {
        router.replace('/dashboard/overview');
      }, 900);
    } catch (error: unknown) {
      console.error(
        'Phone verification error:',
        error
      );

      const newAttempts = attempts + 1;
      const currentTime = Date.now();

      setAttempts(newAttempts);
      setLastAttemptTime(currentTime);

      sessionStorage.setItem(
        `otp_attempts_${phoneNumber}`,
        String(newAttempts)
      );

      sessionStorage.setItem(
        `last_attempt_${phoneNumber}`,
        String(currentTime)
      );

      setOtp(['', '', '', '', '', '']);

      if (newAttempts >= MAX_ATTEMPTS) {
        toast.error(
          'Too many failed attempts. Please try again in 15 minutes.'
        );
      } else {
        const message =
          error instanceof Error
            ? error.message
            : '';

        if (
          message.toLowerCase().includes('expired')
        ) {
          toast.error(
            'This verification code has expired. Please request a new one.'
          );
        } else {
          toast.error(
            `Invalid verification code. ${
              MAX_ATTEMPTS - newAttempts
            } attempt${
              MAX_ATTEMPTS - newAttempts === 1
                ? ''
                : 's'
            } remaining.`
          );
        }
      }

      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } finally {
      setIsVerifying(false);
    }
  };

  /*
   * Resend OTP using Supabase
   */
  const handleResendCode = async () => {
    if (!phoneNumber) {
      toast.error(
        'Phone number is missing. Please start again.'
      );
      return;
    }

    if (isLockedOut()) {
      toast.error(
        'Verification is temporarily locked. Please try again later.'
      );
      return;
    }

    if (countdown > 0) {
      toast.error(
        `Please wait ${countdown} seconds before requesting another code.`
      );
      return;
    }

    setIsResending(true);

    try {
      const { error } =
        await supabase.auth.signInWithOtp({
          phone: phoneNumber,
        });

      if (error) {
        throw error;
      }

      toast.success(
        'A new verification code has been sent.'
      );

      setOtp(['', '', '', '', '', '']);
      setCountdown(60);

      localStorage.setItem(
        `otp_countdown_${phoneNumber}`,
        String(
          Math.floor(Date.now() / 1000) + 60
        )
      );

      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error: unknown) {
      console.error(
        'Resend verification error:',
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to send a new verification code.';

      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  /*
   * Display phone number cleanly
   */
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');

    if (cleaned.startsWith('+234')) {
      return `+234 ${cleaned.slice(4)}`;
    }

    return cleaned;
  };

  const lockedOut = isLockedOut();
  const remainingLockoutTime =
    getRemainingLockoutTime();

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 pt-30 md:pt-0 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: 'easeOut',
            }}
          >
            {/* Intro */}
            <div className="mb-7 text-center">
               <div className=" hidden mx-auto mb-3 md:flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <ShieldCheck className="h-5 w-5 text-gray-500" />
                </div>

              <h1 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] text-gray-950 sm:text-[2.2rem]">
                {verificationSuccess
                  ? 'Phone verified'
                  : 'Verify your phone'}
              </h1>

              <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-6 text-gray-500">
                {verificationSuccess
                  ? 'Your phone number has been verified successfully. Redirecting you to your workspace.'
                  : 'Enter the 6-digit verification code we sent to your phone number.'}
              </p>
            </div>

            {/* Verification card */}
            <div className="border border-gray-200 bg-white p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {verificationSuccess ? (
                  <motion.div
                    key="success"
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="py-5 text-center"
                  >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle2 className="h-7 w-7 text-emerald-800" />
                    </div>

                    <h2 className="text-base font-semibold text-gray-950">
                      Verification complete
                    </h2>

                    <p className="mt-2 text-[13px] leading-6 text-gray-500">
                      Your account is ready. Taking you to
                      your workspace...
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Redirecting
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="verification"
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                  >
                    {/* Phone */}
                    <div className="mb-6 border border-gray-100 bg-[#fafafa] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-gray-200 bg-white">
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-800" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
                            Verification sent to
                          </p>

                          <p className="mt-0.5 truncate text-[13px] font-medium text-gray-800">
                            {formatPhoneNumber(
                              phoneNumber
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lockout */}
                    <AnimatePresence>
                      {lockedOut && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="mb-5 overflow-hidden border border-red-100 bg-red-50 px-4 py-3"
                        >
                          <p className="text-xs font-medium text-red-700">
                            Too many attempts
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-red-600">
                            Please try again in{' '}
                            {Math.ceil(
                              remainingLockoutTime /
                                60
                            )}{' '}
                            minutes.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* OTP */}
                    <form
                      id="phone-verification-form"
                      onSubmit={handleVerify}
                    >
                      <label className="mb-3 block text-center text-xs font-medium text-gray-700">
                        Enter verification code
                      </label>

                      <div className="mb-6 flex justify-center gap-2">
                        {otp.map(
                          (digit, index) => (
                            <input
                              key={index}
                              ref={(element) => {
                                inputRefs.current[
                                  index
                                ] = element;
                              }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              disabled={
                                isVerifying ||
                                lockedOut
                              }
                              autoComplete={
                                index === 0
                                  ? 'one-time-code'
                                  : 'off'
                              }
                              onChange={(event) =>
                                handleOtpChange(
                                  event.target,
                                  index
                                )
                              }
                              onKeyDown={(event) =>
                                handleKeyDown(
                                  event,
                                  index
                                )
                              }
                              onPaste={
                                handlePaste
                              }
                              className={`h-12 w-11 border text-center text-lg font-semibold outline-none transition ${
                                lockedOut
                                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                  : digit
                                    ? 'border-emerald-700 bg-emerald-50 text-gray-950'
                                    : 'border-gray-200 bg-[#fafafa] text-gray-950 hover:border-gray-300 focus:border-emerald-900 focus:bg-white'
                              }`}
                              aria-label={`Verification digit ${
                                index + 1
                              }`}
                            />
                          )
                        )}
                      </div>

                      {/* Verify */}
                      <button
                        type="submit"
                        disabled={
                          isVerifying ||
                          otp.join('').length !== 6 ||
                          lockedOut
                        }
                        className="group flex h-12 w-full items-center justify-between bg-emerald-900 px-4 text-[13px] font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>
                          {isVerifying
                            ? 'Verifying...'
                            : lockedOut
                              ? 'Temporarily locked'
                              : 'Verify phone'}
                        </span>

                        {isVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        )}
                      </button>
                    </form>

                    {/* Resend */}
                    <div className="mt-5 text-center">
                      <button
                        type="button"
                        onClick={
                          handleResendCode
                        }
                        disabled={
                          isResending ||
                          countdown > 0 ||
                          lockedOut
                        }
                        className="text-xs font-medium text-emerald-900 transition hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                      >
                        {isResending ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Sending new code...
                          </span>
                        ) : countdown > 0 ? (
                          `Resend code in ${countdown}s`
                        ) : (
                          'Resend verification code'
                        )}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                      <p className="text-[11px] leading-5 text-gray-400">
                        Didn't receive the code?
                        Check your messages or request
                        a new code when the resend timer
                        finishes.
                      </p>
                    </div>

                    {/* Back */}
                    <div className="mt-5 text-center">
                      <Link
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-gray-900"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to sign in
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brand positioning */}
            <p className="mt-6 text-center text-[9px] font-medium uppercase leading-4 tracking-[0.16em] text-gray-400">
              The Cash Flow Operating System
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}