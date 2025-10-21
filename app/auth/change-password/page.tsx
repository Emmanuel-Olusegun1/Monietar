'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// MOCK_DATA for frontend development
const MOCK_DATA = {
  currentPassword: 'password123'
};

// Mock API service module
const authAPI = {
  async changePassword(currentPassword: string, newPassword: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if current password matches
    if (currentPassword !== MOCK_DATA.currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Validate new password strength
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error('Password must contain uppercase, lowercase, and numbers');
    }
    
    // Update the mock current password
    MOCK_DATA.currentPassword = newPassword;
    
    return {
      success: true,
      message: 'Password changed successfully!'
    };
  }
};

type Step = 'current' | 'new' | 'confirm' | 'success';

export default function ChangePasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('current');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const validateCurrentPassword = () => {
    if (!formData.currentPassword) {
      toast.error('Current password is required');
      return false;
    }
    return true;
  };

  const validateNewPassword = () => {
    const errors: string[] = [];

    if (!formData.newPassword) {
      errors.push('New password is required');
    } else if (formData.newPassword.length < 8) {
      errors.push('New password must be at least 8 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.push('Password must contain uppercase, lowercase, and numbers');
    }

    if (formData.currentPassword === formData.newPassword) {
      errors.push('New password must be different from current password');
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
    } else if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'current':
        if (validateCurrentPassword()) {
          setCurrentStep('new');
        }
        break;
      case 'new':
        if (validateNewPassword()) {
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
      case 'new':
        setCurrentStep('current');
        break;
      case 'confirm':
        setCurrentStep('new');
        break;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading('Changing password...');

    try {
      await authAPI.changePassword(formData.currentPassword, formData.newPassword);
      
      setCurrentStep('success');
      toast.success('Password changed successfully!');
      
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.message.includes('Current password is incorrect')) {
        toast.error('Current password is incorrect');
        setCurrentStep('current');
      } else if (error.message.includes('at least 8 characters')) {
        toast.error('New password must be at least 8 characters long');
        setCurrentStep('new');
      } else if (error.message.includes('uppercase, lowercase, and numbers')) {
        toast.error('Password must contain uppercase, lowercase, and numbers');
        setCurrentStep('new');
      } else {
        toast.error(error.message || 'Failed to change password');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
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

  const newPasswordStrength = passwordStrength(formData.newPassword);

  const stepTitles = {
    current: 'Verify Current Password',
    new: 'Create New Password',
    confirm: 'Confirm New Password',
    success: 'Password Changed!'
  };

  const stepDescriptions = {
    current: 'Enter your current password to continue',
    new: 'Create a strong new password for your account',
    confirm: 'Confirm your new password to complete the process',
    success: 'Your password has been updated successfully'
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
          alt='change password security image'
          fill
          className='object-cover rounded-md'
          priority
        />
        {/* Dark overlay for better text contrast */}
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
              {(['current', 'new', 'confirm', 'success'] as Step[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep === step 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : currentStep === 'success' || (
                          step === 'current' ||
                          (step === 'new' && currentStep !== 'current') ||
                          (step === 'confirm' && (currentStep === 'confirm' || currentStep === 'success')) ||
                          (step === 'success' && currentStep === 'success')
                        )
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {currentStep === step || (
                      step === 'current' ||
                      (step === 'new' && currentStep !== 'current') ||
                      (step === 'confirm' && (currentStep === 'confirm' || currentStep === 'success')) ||
                      (step === 'success' && currentStep === 'success')
                    ) ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep === 'success' || (
                        (step === 'current' && currentStep !== 'current') ||
                        (step === 'new' && (currentStep === 'confirm' || currentStep === 'success'))
                      )
                        ? 'bg-emerald-500'
                        : 'bg-gray-600'
                    }`} />
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
              {/* Step 1: Current Password */}
              {currentStep === 'current' && (
                <motion.div
                  key="current"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-colors placeholder-gray-400 bg-gray-700 text-white"
                        placeholder="Enter current password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleCurrentPasswordVisibility}
                        className="absolute hover:cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                      >
                        {showCurrentPassword ? (
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
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleGoToSignIn}
                      className="flex-1 hover:cursor-pointer border border-gray-600 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isLoading || !formData.currentPassword}
                      className="flex-1 hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      Continue
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: New Password */}
              {currentStep === 'new' && (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-colors placeholder-gray-400 bg-gray-700 text-white"
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute hover:cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                      >
                        {showNewPassword ? (
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
                    {formData.newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            newPasswordStrength.color === 'red' ? 'text-red-400' :
                            newPasswordStrength.color === 'orange' ? 'text-orange-400' :
                            newPasswordStrength.color === 'yellow' ? 'text-yellow-400' :
                            newPasswordStrength.color === 'blue' ? 'text-blue-400' :
                            'text-emerald-400'
                          }`}>
                            {newPasswordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              newPasswordStrength.color === 'red' ? 'bg-red-500' :
                              newPasswordStrength.color === 'orange' ? 'bg-orange-500' :
                              newPasswordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              newPasswordStrength.color === 'blue' ? 'bg-blue-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${(newPasswordStrength.strength / 5) * 100}%` }}
                          ></div>
                        </div>
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
                      disabled={isLoading || !formData.newPassword}
                      className="flex-1 hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      Continue
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm Password */}
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
                        {formData.newPassword === formData.confirmPassword ? (
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
                      disabled={isLoading || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                      className="flex-1 hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
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
                      Password Changed!
                    </h2>
                    <p className="text-gray-300">
                      Your password has been updated successfully. Please sign in with your new password.
                    </p>
                  </div>

                  <button
                    onClick={handleGoToSignIn}
                    className="w-full hover:cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Go to Sign In
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}