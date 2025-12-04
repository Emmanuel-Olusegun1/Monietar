// app/auth/reset-password/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';

type Step = 'password' | 'confirm' | 'success' | 'error';

export default function ResetPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('password');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  const router = useRouter();

  // Check for reset session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session means the reset link is invalid/expired
        setCurrentStep('error');
        toast.error('Invalid or expired reset link. Please request a new one.');
        return;
      }

      // Check if this is a password recovery session
      if (session.user?.app_metadata?.provider === 'email' && 
          session.user?.aud === 'authenticated') {
        setSession(session);
      } else {
        setCurrentStep('error');
        toast.error('Invalid reset session. Please request a new password reset.');
      }
    };

    checkSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const validatePassword = () => {
    const errors: string[] = [];

    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.push('Password must contain uppercase, lowercase, and numbers');
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    return true;
  };

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword) {
      toast.error('Please confirm your new password');
      return false;
    } else if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'password':
        if (validatePassword()) {
          setCurrentStep('confirm');
        }
        break;
      case 'confirm':
        if (validateConfirmPassword()) {
          handleSubmit();
        }
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'confirm':
        setCurrentStep('password');
        break;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading('Updating password...');

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        console.error('Password update error:', error);
        
        if (error.message.includes('session')) {
          toast.error('Reset link has expired. Please request a new one.');
          setCurrentStep('error');
        } else if (error.message.includes('weak')) {
          toast.error('Password is too weak. Please choose a stronger password.');
          setCurrentStep('password');
        } else {
          toast.error(error.message || 'Failed to update password');
        }
        return;
      }

      // Sign out the user after password reset
      await supabase.auth.signOut();
      
      setCurrentStep('success');
      toast.success('Password updated successfully! Please sign in with your new password.');
      
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
  };

  const handleRequestNewLink = () => {
    router.push('/auth/forgot-password');
  };

  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, color: 'gray', text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengths = [
      { color: 'red', text: 'Very Weak' },
      { color: 'orange', text: 'Weak' },
      { color: 'yellow', text: 'Fair' },
      { color: 'blue', text: 'Good' },
      { color: 'green', text: 'Strong' },
      { color: 'green', text: 'Very Strong' }
    ];
    
    return { strength, ...strengths[strength] };
  };

  const passwordStrengthInfo = passwordStrength(formData.password);

  const stepTitles = {
    password: 'Set New Password',
    confirm: 'Confirm New Password',
    success: 'Password Reset Successful!',
    error: 'Reset Link Expired'
  };

  const stepDescriptions = {
    password: 'Create a strong new password for your account',
    confirm: 'Confirm your new password to complete the reset',
    success: 'Your password has been reset successfully',
    error: 'This reset link is no longer valid'
  };

  // Helper function to determine if a step is completed
  const isStepCompleted = (step: Step) => {
    switch (step) {
      case 'password':
        return currentStep !== 'password';
      case 'confirm':
        return currentStep === 'success';
      case 'success':
        return currentStep === 'success';
      default:
        return false;
    }
  };

  // Helper function to determine connector color
  const getConnectorColor = (step: Step) => {
    switch (step) {
      case 'password':
        return currentStep !== 'password' ? 'bg-emerald-500' : 'bg-gray-600';
      case 'confirm':
        return currentStep === 'success' ? 'bg-emerald-500' : 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (currentStep === 'error') {
    return (
      <div className="flex w-full md:h-screen bg-gray-900">
        <Toaster position="top-right" />
        
        {/* The image section */}
        <div className='flex-1 relative hidden md:block shadow-lg h-screen'>
          <Image
            src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
            alt='password reset image'
            fill
            className='object-cover rounded-md'
            priority
          />
          <div className='absolute inset-0 bg-black/60'></div>
        </div>
        
        {/* Error state */}
        <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-gray-900'>
          <div className="w-full max-w-md px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-red-700/50"
            >
              {/* Progress Steps - Simplified for error state */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-600 text-gray-400">
                    1
                  </div>
                  <div className="w-12 h-0.5 mx-2 bg-gray-600" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-500 text-white bg-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800/50">
                  <svg
                    className="w-8 h-8 text-red-400"
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
                  {stepTitles.error}
                </h1>
                
                <p className="text-gray-300">
                  {stepDescriptions.error}
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-gray-300">
                      <p className="font-medium">What happened?</p>
                      <p className="mt-1">
                        Password reset links expire after 24 hours for security reasons. 
                        You need to request a new reset link to continue.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleGoToSignIn}
                    className="flex-1 hover:cursor-pointer border border-gray-600 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-lg transition-colors"
                  >
                    Back to Sign In
                  </button>
                  <button
                    onClick={handleRequestNewLink}
                    className="flex-1 hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Request New Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full md:h-screen bg-gray-900">
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
          alt='password reset security image'
          fill
          className='object-cover rounded-md'
          priority
        />
        <div className='absolute inset-0 bg-black/60'></div>
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
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8">
              {(['password', 'confirm', 'success'] as Step[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep === step 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isStepCompleted(step)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {currentStep === step || isStepCompleted(step) ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-2 ${getConnectorColor(step)}`} />
                  )}
                </div>
              ))}
            </div>

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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                {stepTitles[currentStep]}
              </h1>
              
              <p className="text-gray-300">
                {stepDescriptions[currentStep]}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: New Password */}
              {currentStep === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-colors placeholder-gray-400 bg-gray-700 text-white"
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute hover:cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrengthInfo.color === 'red' ? 'text-red-400' :
                            passwordStrengthInfo.color === 'orange' ? 'text-orange-400' :
                            passwordStrengthInfo.color === 'yellow' ? 'text-yellow-400' :
                            passwordStrengthInfo.color === 'blue' ? 'text-blue-400' :
                            'text-emerald-400'
                          }`}>
                            {passwordStrengthInfo.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrengthInfo.color === 'red' ? 'bg-red-500' :
                              passwordStrengthInfo.color === 'orange' ? 'bg-orange-500' :
                              passwordStrengthInfo.color === 'yellow' ? 'bg-yellow-500' :
                              passwordStrengthInfo.color === 'blue' ? 'bg-blue-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${(passwordStrengthInfo.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    <div className="mt-4 space-y-1">
                      <p className="text-xs text-gray-400 font-medium">Password must contain:</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li className={`flex items-center ${formData.password.length >= 8 ? 'text-emerald-400' : ''}`}>
                          <svg className={`w-3 h-3 mr-2 ${formData.password.length >= 8 ? 'text-emerald-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {formData.password.length >= 8 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            )}
                          </svg>
                          At least 8 characters
                        </li>
                        <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                          <svg className={`w-3 h-3 mr-2 ${/[a-z]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {/[a-z]/.test(formData.password) ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            )}
                          </svg>
                          One lowercase letter
                        </li>
                        <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                          <svg className={`w-3 h-3 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {/[A-Z]/.test(formData.password) ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            )}
                          </svg>
                          One uppercase letter
                        </li>
                        <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                          <svg className={`w-3 h-3 mr-2 ${/[0-9]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {/[0-9]/.test(formData.password) ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            )}
                          </svg>
                          One number
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={isLoading || !formData.password}
                    className="w-full hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    Continue
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}

              {/* Step 2: Confirm Password */}
              {currentStep === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-colors placeholder-gray-400 bg-gray-700 text-white"
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute hover:cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <div className="flex items-center space-x-2 mt-1">
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs text-emerald-400">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-xs text-red-400">Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 hover:cursor-pointer border border-gray-600 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isLoading || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                      className="flex-1 hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting Password...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-6"
                >
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
                      Password Reset Complete!
                    </h2>
                    <p className="text-gray-300">
                      Your password has been updated successfully. Please sign in with your new password.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleGoToSignIn}
                      className="flex-1 hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      Sign In Now
                    </button>
                  </div>

                  {/* Security Note */}
                  <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="text-sm text-gray-300">
                        <p className="font-medium text-emerald-400">Security Tip</p>
                        <p className="mt-1">
                          For your security, your old password can no longer be used. 
                          If you didn't request this password reset, please contact support immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}