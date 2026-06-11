// app/auth/change-password/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  KeyRound, 
  ArrowLeft, 
  Lock, 
  ShieldCheck 
} from 'lucide-react';

// MOCK_DATA for frontend development
const MOCK_DATA = {
  currentPassword: 'password123'
};

// Mock API service module
const authAPI = {
  async changePassword(currentPassword: string, newPassword: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (currentPassword !== MOCK_DATA.currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error('Password must contain uppercase, lowercase, and numbers');
    }

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
    if (currentStep === 'new') setCurrentStep('current');
    if (currentStep === 'confirm') setCurrentStep('new');
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

  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, color: 'slate', text: '' };

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
      { color: 'emerald', text: 'Very Strong' }
    ];

    return { strength, ...strengths[strength] };
  };

  const newPasswordStrength = passwordStrength(formData.newPassword);

  const stepTitles = {
    current: 'Verify Identity',
    new: 'Create New Password',
    confirm: 'Confirm New Password',
    success: 'Password Changed!'
  };

  const stepDescriptions = {
    current: 'Enter your active password parameters to continue authentication',
    new: 'Design a highly secure configuration for your profile protection',
    confirm: 'Re-verify your chosen configuration values to sync encryption',
    success: 'Your updated credentials map is now secure and active'
  };

  const isStepCompleted = (step: Step) => {
    if (step === 'current') return currentStep !== 'current';
    if (step === 'new') return currentStep === 'confirm' || currentStep === 'success';
    if (step === 'confirm') return currentStep === 'success';
    return false;
  };

  const getConnectorColor = (step: Step) => {
    if (step === 'current') return currentStep !== 'current' ? 'bg-emerald-500' : 'bg-slate-200';
    if (step === 'new') return (currentStep === 'confirm' || currentStep === 'success') ? 'bg-emerald-500' : 'bg-slate-200';
    return 'bg-slate-200';
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 text-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { 
            background: '#ffffff', 
            color: '#1e293b', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          loading: { duration: Infinity, iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
        }}
      />

      {/* Side Image Pane */}
      <div className='flex-1 relative hidden md:block h-screen shadow-inner'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='change password security image'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-slate-900/10'></div>
      </div>

      {/* Centralized Form Section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 min-h-screen bg-white'>
        <div className="w-full max-w-md py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100"
          >
            {/* Dynamic Timeline Stepper */}
            <div className="flex justify-center items-center mb-8">
              {(['current', 'new', 'confirm', 'success'] as Step[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                    currentStep === step 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20' 
                      : isStepCompleted(step)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-200 text-slate-400 bg-slate-50'
                  }`}>
                    {isStepCompleted(step) ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors duration-500 ${getConnectorColor(step)}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Stage Description Context */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                {currentStep === 'success' ? (
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                ) : (
                  <KeyRound className="w-7 h-7 text-emerald-600" />
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                {stepTitles[currentStep]}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed px-2">
                {stepDescriptions[currentStep]}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Current Verification Node */}
              {currentStep === 'current' && (
                <motion.div
                  key="current"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="currentPassword" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase pl-0.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 bg-slate-50/50 text-slate-900 text-sm"
                        placeholder="Enter active password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleCurrentPasswordVisibility}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className="flex-1 cursor-pointer order-2 sm:order-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors text-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isLoading || !formData.currentPassword}
                      className="flex-1 cursor-pointer order-1 sm:order-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
                    >
                      Continue
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: New Generation Struct */}
              {currentStep === 'new' && (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase pl-0.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 bg-slate-50/50 text-slate-900 text-sm"
                        placeholder="Enter brand new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Complexity Analytics Scale */}
                    {formData.newPassword && (
                      <div className="mt-2 pt-0.5 animate-fadeIn">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Password strength:</span>
                          <span className={`text-[11px] font-bold tracking-wide uppercase ${
                            newPasswordStrength.color === 'red' ? 'text-red-500' :
                            newPasswordStrength.color === 'orange' ? 'text-orange-500' :
                            newPasswordStrength.color === 'amber' ? 'text-amber-500' :
                            newPasswordStrength.color === 'blue' ? 'text-blue-500' : 'text-emerald-600'
                          }`}>
                            {newPasswordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              newPasswordStrength.color === 'red' ? 'bg-red-500' :
                              newPasswordStrength.color === 'orange' ? 'bg-orange-500' :
                              newPasswordStrength.color === 'amber' ? 'bg-amber-500' :
                              newPasswordStrength.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(newPasswordStrength.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 cursor-pointer order-2 sm:order-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isLoading || !formData.newPassword}
                      className="flex-1 cursor-pointer order-1 sm:order-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
                    >
                      Continue
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Match Confirmation Node */}
              {currentStep === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase pl-0.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 bg-slate-50/50 text-slate-900 text-sm"
                        placeholder="Re-type your new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {formData.confirmPassword && (
                      <div className="flex items-center space-x-1.5 mt-2 pl-0.5 animate-fadeIn">
                        {formData.newPassword === formData.confirmPassword ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600">Verification vectors match</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="text-xs font-medium text-red-500">Verification vectors mismatch</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 cursor-pointer order-2 sm:order-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isLoading || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                      className="flex-1 cursor-pointer order-1 sm:order-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success Module Execution */}
              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-5"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-slate-900">Credentials Updated!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed px-1">
                      Your operational password matrix has been altered. All security logs have been flagged as updated.
                    </p>
                  </div>

                  <button
                    onClick={handleGoToSignIn}
                    className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm transition-all text-center"
                  >
                    Return to Sign In
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
