'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';

type Step = 'password' | 'confirm' | 'success' | 'error';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [currentStep, setCurrentStep] = useState<Step>('password');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const checkResetSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          const message =
            'This password reset link is invalid or has expired. Please request a new one.';

          setErrorMessage(message);
          setCurrentStep('error');

          toast.error(message);

          return;
        }

        if (
          session.user?.aud === 'authenticated' &&
          session.user?.app_metadata?.provider === 'email'
        ) {
          setCurrentStep('password');
          setErrorMessage('');
        } else {
          const message =
            'This reset link is no longer valid. Please request a new password reset link.';

          setErrorMessage(message);
          setCurrentStep('error');

          toast.error(message);
        }
      } catch {
        const message =
          'We could not verify this reset link. Please request a new one.';

        if (mounted) {
          setErrorMessage(message);
          setCurrentStep('error');

          toast.error(message);
        }
      } finally {
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkResetSession();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.id]: e.target.value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const showUserError = (message: string) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const validatePassword = () => {
    const password = formData.password;

    if (!password) {
      showUserError('Please enter a new password.');
      return false;
    }

    if (password.length < 8) {
      showUserError(
        'Your password must be at least 8 characters long.'
      );
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      showUserError(
        'Your password must contain an uppercase letter, a lowercase letter, and a number.'
      );
      return false;
    }

    return true;
  };

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword) {
      showUserError('Please confirm your new password.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showUserError(
        'Your passwords do not match. Please check them and try again.'
      );
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setErrorMessage('');

    if (currentStep === 'password') {
      if (validatePassword()) {
        setCurrentStep('confirm');
      }

      return;
    }

    if (currentStep === 'confirm') {
      if (validateConfirmPassword()) {
        handleSubmit();
      }
    }
  };

  const handlePreviousStep = () => {
    if (!isLoading && currentStep === 'confirm') {
      setErrorMessage('');
      setCurrentStep('password');
    }
  };

  const getFriendlyErrorMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('session') ||
      lowerMessage.includes('expired') ||
      lowerMessage.includes('refresh token') ||
      lowerMessage.includes('jwt')
    ) {
      return 'Your password reset session has expired. Please request a new reset link.';
    }

    if (
      lowerMessage.includes('weak') ||
      lowerMessage.includes('password should') ||
      lowerMessage.includes('password must')
    ) {
      return 'That password does not meet the security requirements. Please choose a stronger password.';
    }

    if (
      lowerMessage.includes('same') ||
      lowerMessage.includes('different')
    ) {
      return 'Please choose a password that is different from your previous password.';
    }

    return 'We could not update your password. Please try again.';
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;
    if (!validateConfirmPassword()) return;

    setIsLoading(true);
    setErrorMessage('');

    const loadingToast = toast.loading(
      'Updating your password...'
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const message =
          'Your password reset session has expired. Please request a new reset link.';

        setCurrentStep('error');
        setErrorMessage(message);
        toast.error(message);

        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        const friendlyMessage = getFriendlyErrorMessage(
          error.message
        );

        if (
          friendlyMessage.includes('session has expired')
        ) {
          setCurrentStep('error');
        } else {
          setCurrentStep('password');
        }

        showUserError(friendlyMessage);

        return;
      }

      await supabase.auth.signOut();

      setFormData({
        password: '',
        confirmPassword: '',
      });

      setErrorMessage('');
      setCurrentStep('success');

      toast.success('Your password has been updated successfully.');
    } catch {
      const message =
        'Something went wrong while updating your password. Please try again.';

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) {
      return {
        strength: 0,
        color: 'gray',
        text: '',
      };
    }

    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengths = [
      { color: 'red', text: 'Very Weak' },
      { color: 'orange', text: 'Weak' },
      { color: 'amber', text: 'Fair' },
      { color: 'blue', text: 'Good' },
      { color: 'emerald', text: 'Strong' },
      { color: 'emerald', text: 'Very Strong' },
    ];

    return {
      strength,
      ...strengths[strength],
    };
  };

  const passwordStrengthInfo = passwordStrength(
    formData.password
  );

  const isPasswordRequirementMet = {
    length: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const isStepCompleted = (step: Step) => {
    if (step === 'password') {
      return (
        currentStep === 'confirm' ||
        currentStep === 'success'
      );
    }

    if (step === 'confirm') {
      return currentStep === 'success';
    }

    return false;
  };

  const getConnectorColor = (step: Step) => {
    return isStepCompleted(step)
      ? 'bg-emerald-500'
      : 'bg-gray-200';
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />

        <Header />

        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
            <span>Checking reset link...</span>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (currentStep === 'error') {
    return (
      <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />

        <Header />

        <main className="flex flex-1 bg-[#f1f1f1] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto flex w-full max-w-[440px] items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-red-100 bg-red-50">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Reset Link Expired
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  This password reset link is no longer valid.
                  Request a new link to continue.
                </p>
              </div>

              <div className="border border-gray-200 bg-white p-5 sm:p-7">
                <div className="border border-red-100 bg-red-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        Unable to continue
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {errorMessage ||
                          'Your reset session is no longer active. Request a new password reset link.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      router.push('/auth/signin')
                    }
                    className="flex-1 cursor-pointer border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Back to Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push('/auth/forgot-password')
                    }
                    className="flex-1 cursor-pointer bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    Request New Link
                  </button>
                </div>
              </div>

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

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
          },
          success: {
            duration: 3500,
            iconTheme: {
              primary: '#047857',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />

      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Intro */}
            <div className="mb-7 text-center">
              <div className="mb-4 hidden h-12 w-12 items-center justify-center rounded-full bg-gray-100 md:flex mx-auto">
                {currentStep === 'success' ? (
                  <ShieldCheck className="h-6 w-6 text-emerald-700" />
                ) : (
                  <KeyRound className="h-6 w-6 text-emerald-700" />
                )}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {currentStep === 'password' &&
                  'Set New Password'}

                {currentStep === 'confirm' &&
                  'Confirm New Password'}

                {currentStep === 'success' &&
                  'Password Reset Complete'}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {currentStep === 'password' &&
                  'Create a strong password for your Monietar account.'}

                {currentStep === 'confirm' &&
                  'Confirm your new password to complete the reset.'}

                {currentStep === 'success' &&
                  'Your password has been updated successfully.'}
              </p>
            </div>

            {/* Progress */}
            {currentStep !== 'success' && (
              <div className="mb-6 flex items-center justify-center">
                {(['password', 'confirm'] as Step[]).map(
                  (step, index) => (
                    <div
                      key={step}
                      className="flex items-center"
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center border text-[10px] font-semibold transition-all ${
                          currentStep === step
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : isStepCompleted(step)
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        {isStepCompleted(step) ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      {index < 1 && (
                        <div
                          className={`mx-2 h-px w-12 transition-colors sm:w-16 ${getConnectorColor(
                            step
                          )}`}
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            <div className="border border-gray-200 bg-white p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {/* Password */}
                {currentStep === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {errorMessage && (
                      <div className="border border-red-100 bg-red-50/60 p-3.5">
                        <div className="flex items-start gap-2.5">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                          <p className="text-xs leading-5 text-red-700">
                            {errorMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-semibold text-gray-700"
                      >
                        New Password
                      </label>

                      <div className="relative">
                        <input
                          id="password"
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your new password"
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (previous) => !previous
                            )
                          }
                          disabled={isLoading}
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-700 disabled:cursor-not-allowed"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {formData.password && (
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-gray-400">
                              Password strength
                            </span>

                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wide ${
                                passwordStrengthInfo.color ===
                                'red'
                                  ? 'text-red-500'
                                  : passwordStrengthInfo.color ===
                                      'orange'
                                    ? 'text-orange-500'
                                    : passwordStrengthInfo.color ===
                                        'amber'
                                      ? 'text-amber-500'
                                      : passwordStrengthInfo.color ===
                                          'blue'
                                        ? 'text-blue-500'
                                        : 'text-emerald-600'
                              }`}
                            >
                              {passwordStrengthInfo.text}
                            </span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden bg-gray-100">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrengthInfo.color ===
                                'red'
                                  ? 'bg-red-500'
                                  : passwordStrengthInfo.color ===
                                      'orange'
                                    ? 'bg-orange-500'
                                    : passwordStrengthInfo.color ===
                                        'amber'
                                      ? 'bg-amber-500'
                                      : passwordStrengthInfo.color ===
                                          'blue'
                                        ? 'bg-blue-500'
                                        : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${
                                  (passwordStrengthInfo.strength /
                                    5) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-4 border border-gray-100 bg-gray-50 p-3.5">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                          Password requirements
                        </p>

                        <div className="grid grid-cols-1 gap-1.5">
                          {[
                            {
                              label:
                                'At least 8 characters',
                              met: isPasswordRequirementMet.length,
                            },
                            {
                              label:
                                'One lowercase letter',
                              met: isPasswordRequirementMet.lowercase,
                            },
                            {
                              label:
                                'One uppercase letter',
                              met: isPasswordRequirementMet.uppercase,
                            },
                            {
                              label: 'One number',
                              met: isPasswordRequirementMet.number,
                            },
                          ].map((requirement) => (
                            <div
                              key={requirement.label}
                              className={`flex items-center gap-2 text-xs ${
                                requirement.met
                                  ? 'text-emerald-700'
                                  : 'text-gray-500'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  requirement.met
                                    ? 'bg-emerald-500'
                                    : 'bg-gray-300'
                                }`}
                              />

                              {requirement.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={
                        isLoading || !formData.password
                      }
                      className="flex w-full cursor-pointer items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Continue
                      <span aria-hidden="true">→</span>
                    </button>
                  </motion.div>
                )}

                {/* Confirm */}
                {currentStep === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {errorMessage && (
                      <div className="border border-red-100 bg-red-50/60 p-3.5">
                        <div className="flex items-start gap-2.5">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                          <p className="text-xs leading-5 text-red-700">
                            {errorMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-xs font-semibold text-gray-700"
                      >
                        Confirm New Password
                      </label>

                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Enter your new password again"
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                          disabled={isLoading}
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-700 disabled:cursor-not-allowed"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {formData.confirmPassword && (
                        <div
                          className={`mt-2 flex items-center gap-2 text-xs font-medium ${
                            formData.password ===
                            formData.confirmPassword
                              ? 'text-emerald-600'
                              : 'text-red-500'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              formData.password ===
                              formData.confirmPassword
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                            }`}
                          />

                          {formData.password ===
                          formData.confirmPassword
                            ? 'Passwords match'
                            : 'Passwords do not match'}
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-100 bg-gray-50 p-3.5">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                        <p className="text-xs leading-5 text-gray-500">
                          Your password will be updated securely
                          through Monietar authentication.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        disabled={isLoading}
                        className="order-2 flex flex-1 cursor-pointer items-center justify-center gap-1.5 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:order-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={
                          isLoading ||
                          !formData.confirmPassword ||
                          formData.password !==
                            formData.confirmPassword
                        }
                        className="order-1 flex flex-1 cursor-pointer items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {currentStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-emerald-100 bg-emerald-50">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Password Reset Complete
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Your password has been updated. You can now
                      sign in with your new password.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        router.push('/auth/signin')
                      }
                      className="mt-6 flex w-full cursor-pointer items-center justify-center bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Sign In
                    </button>

                    <div className="mt-5 border border-emerald-100 bg-emerald-50/50 p-3.5 text-left">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                        <p className="text-xs leading-5 text-gray-500">
                          For your security, your previous password
                          is no longer valid.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {currentStep !== 'success' && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() =>
                    router.push('/auth/signin')
                  }
                  disabled={isLoading}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </button>
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
