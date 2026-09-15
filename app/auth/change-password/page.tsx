'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

type Step = 'current' | 'new' | 'confirm' | 'success';

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [currentStep, setCurrentStep] = useState<Step>('current');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
  };

  const validateCurrentPassword = () => {
    if (!formData.currentPassword.trim()) {
      toast.error('Please enter your current password.');
      return false;
    }

    return true;
  };

  const validateNewPassword = () => {
    const password = formData.newPassword;

    if (!password) {
      toast.error('Please enter a new password.');
      return false;
    }

    if (password.length < 8) {
      toast.error('Your new password must be at least 8 characters.');
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      toast.error(
        'Your password must contain uppercase, lowercase, and a number.'
      );
      return false;
    }

    if (password === formData.currentPassword) {
      toast.error('Your new password must be different from your current password.');
      return false;
    }

    return true;
  };

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword) {
      toast.error('Please confirm your new password.');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Your passwords do not match.');
      return false;
    }

    return true;
  };

  const verifyCurrentPassword = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user?.email) {
      throw new Error('Unable to verify your account. Please sign in again.');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.user.email,
      password: formData.currentPassword,
    });

    if (signInError) {
      throw new Error('Current password is incorrect.');
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 'current') {
      if (!validateCurrentPassword()) return;

      setIsLoading(true);

      try {
        await verifyCurrentPassword();
        setCurrentStep('new');
      } catch (error) {
        console.error('Current password verification error:', error);

        toast.error(
          error instanceof Error
            ? error.message
            : 'Unable to verify your current password.'
        );
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (currentStep === 'new') {
      if (validateNewPassword()) {
        setCurrentStep('confirm');
      }

      return;
    }

    if (currentStep === 'confirm') {
      if (validateConfirmPassword()) {
        await handleSubmit();
      }
    }
  };

  const handlePreviousStep = () => {
    if (isLoading) return;

    if (currentStep === 'new') {
      setCurrentStep('current');
    }

    if (currentStep === 'confirm') {
      setCurrentStep('new');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const loadingToast = toast.loading('Updating your password...');

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        console.error('Password update error:', updateError);

        throw new Error(
          updateError.message || 'Failed to update your password.'
        );
      }

      setCurrentStep('success');

      toast.success('Password changed successfully.');
    } catch (error) {
      console.error('Change password error:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to change your password. Please try again.'
      );
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) {
      return {
        strength: 0,
        text: '',
      };
    }

    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const labels = [
      '',
      'Very Weak',
      'Weak',
      'Fair',
      'Good',
      'Strong',
    ];

    return {
      strength,
      text: labels[strength] || 'Strong',
    };
  };

  const newPasswordStrength = passwordStrength(formData.newPassword);

  const stepTitles: Record<Step, string> = {
    current: 'Verify Your Password',
    new: 'Create a New Password',
    confirm: 'Confirm Your Password',
    success: 'Password Changed',
  };

  const stepDescriptions: Record<Step, string> = {
    current: 'Enter your current password to continue.',
    new: 'Choose a strong password for your Monietar account.',
    confirm: 'Enter your new password again to confirm the change.',
    success: 'Your password has been updated successfully.',
  };

  const isStepCompleted = (step: Step) => {
    if (step === 'current') {
      return currentStep !== 'current';
    }

    if (step === 'new') {
      return currentStep === 'confirm' || currentStep === 'success';
    }

    if (step === 'confirm') {
      return currentStep === 'success';
    }

    return false;
  };

  const getConnectorColor = (step: Step) => {
    if (step === 'current') {
      return currentStep !== 'current'
        ? 'bg-emerald-600'
        : 'bg-gray-200';
    }

    if (step === 'new') {
      return currentStep === 'confirm' || currentStep === 'success'
        ? 'bg-emerald-600'
        : 'bg-gray-200';
    }

    return 'bg-gray-200';
  };

  const passwordInputClass =
    'w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60';

  const secondaryButtonClass =
    'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60';

  const primaryButtonClass =
    'flex flex-1 cursor-pointer items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 pt-30 md:pt-0  py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="mb-7 text-center">
                  <div className=" hidden mx-auto mb-3 md:flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                  </div>
             <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {stepTitles[currentStep]}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {stepDescriptions[currentStep]}
              </p>
            </div>

            {/* Form Card */}
            <div className="border border-gray-200 bg-white p-5 sm:p-7">
              {/* Progress */}
              {currentStep !== 'success' && (
                <div className="mb-7 flex items-center justify-center">
                  {(['current', 'new', 'confirm'] as Step[]).map(
                    (step, index) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`flex h-7 w-7 items-center justify-center border text-[10px] font-semibold transition-colors ${
                            currentStep === step
                              ? 'border-emerald-700 bg-emerald-700 text-white'
                              : isStepCompleted(step)
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-gray-200 bg-gray-50 text-gray-400'
                          }`}
                        >
                          {isStepCompleted(step) ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        {index < 2 && (
                          <div
                            className={`mx-1 h-px w-8 transition-colors sm:w-12 ${getConnectorColor(
                              step
                            )}`}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Current Password */}
                {currentStep === 'current' && (
                  <motion.div
                    key="current"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="mb-2 block text-xs font-semibold text-gray-700"
                      >
                        Current Password
                      </label>

                      <div className="relative">
                        <input
                          id="currentPassword"
                          type={
                            showCurrentPassword ? 'text' : 'password'
                          }
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="Enter your current password"
                          autoComplete="current-password"
                          disabled={isLoading}
                          className={passwordInputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword((value) => !value)
                          }
                          disabled={isLoading}
                          aria-label={
                            showCurrentPassword
                              ? 'Hide current password'
                              : 'Show current password'
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-700 disabled:cursor-not-allowed"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleGoToSignIn}
                        disabled={isLoading}
                        className={secondaryButtonClass}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={isLoading || !formData.currentPassword}
                        className={primaryButtonClass}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Continue
                            <Lock className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* New Password */}
                {currentStep === 'new' && (
                  <motion.div
                    key="new"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="mb-2 block text-xs font-semibold text-gray-700"
                      >
                        New Password
                      </label>

                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Enter a new password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className={passwordInputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowNewPassword((value) => !value)
                          }
                          disabled={isLoading}
                          aria-label={
                            showNewPassword
                              ? 'Hide new password'
                              : 'Show new password'
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-700 disabled:cursor-not-allowed"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {formData.newPassword && (
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400">
                              Password strength
                            </span>

                            <span className="text-[11px] font-semibold text-emerald-700">
                              {newPasswordStrength.text}
                            </span>
                          </div>

                          <div className="h-1 overflow-hidden bg-gray-100">
                            <div
                              className="h-full bg-emerald-600 transition-all duration-300"
                              style={{
                                width: `${
                                  (newPasswordStrength.strength / 5) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <p className="mt-3 text-xs leading-5 text-gray-400">
                        Use at least 8 characters with uppercase, lowercase,
                        and a number.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        disabled={isLoading}
                        className={secondaryButtonClass}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={isLoading || !formData.newPassword}
                        className={primaryButtonClass}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Confirm Password */}
                {currentStep === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
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
                            showConfirmPassword ? 'text' : 'password'
                          }
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Enter your new password again"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className={passwordInputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          disabled={isLoading}
                          aria-label={
                            showConfirmPassword
                              ? 'Hide confirmed password'
                              : 'Show confirmed password'
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
                        <div className="mt-2 flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 ${
                              formData.newPassword ===
                              formData.confirmPassword
                                ? 'bg-emerald-600'
                                : 'bg-red-500'
                            }`}
                          />

                          <span
                            className={`text-xs ${
                              formData.newPassword ===
                              formData.confirmPassword
                                ? 'text-emerald-700'
                                : 'text-red-500'
                            }`}
                          >
                            {formData.newPassword ===
                            formData.confirmPassword
                              ? 'Passwords match.'
                              : 'Passwords do not match.'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        disabled={isLoading}
                        className={secondaryButtonClass}
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
                          formData.newPassword !== formData.confirmPassword
                        }
                        className={primaryButtonClass}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {currentStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-emerald-100 bg-emerald-50">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Password Updated
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Your Monietar account password has been changed
                      successfully.
                    </p>

                    <button
                      type="button"
                      onClick={handleGoToSignIn}
                      className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Return to Sign In
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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