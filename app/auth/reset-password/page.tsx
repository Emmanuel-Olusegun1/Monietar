// app/auth/reset-password/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { Loader2, Eye, EyeOff, ShieldCheck, ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';

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
        setCurrentStep('error');
        toast.error('Invalid or expired reset link. Please request a new one.');
        return;
      }

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
    if (currentStep === 'confirm') {
      setCurrentStep('password');
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

  const passwordStrengthInfo = passwordStrength(formData.password);

  const stepTitles = {
    password: 'Set New Password',
    confirm: 'Confirm New Password',
    success: 'Password Reset Successful!',
    error: 'Reset Link Expired'
  };

  const stepDescriptions = {
    password: 'Create a strong, secure password for your workspace account',
    confirm: 'Verify your choice below to complete the secure update',
    success: 'Your credentials have been re-encrypted successfully',
    error: 'This session link has timing parameter timeout'
  };

  const isStepCompleted = (step: Step) => {
    if (step === 'password') return currentStep !== 'password';
    if (step === 'confirm') return currentStep === 'success';
    return false;
  };

  const getConnectorColor = (step: Step) => {
    if (step === 'password') return currentStep !== 'password' ? 'bg-emerald-500' : 'bg-slate-200';
    if (step === 'confirm') return currentStep === 'success' ? 'bg-emerald-500' : 'bg-slate-200';
    return 'bg-slate-200';
  };

  // Shared Error Page State Render
  if (currentStep === 'error') {
    return (
      <div className="flex w-full min-h-screen bg-slate-50 text-slate-900">
        <Toaster position="top-right" />
        
        <div className='flex-1 relative hidden md:block h-screen shadow-inner'>
          <Image
            src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
            alt='password reset image'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-slate-900/10'></div>
        </div>
        
        <div className='flex-1 flex flex-col justify-center items-center p-4 min-h-screen bg-white'>
          <div className="w-full max-w-md py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-red-100"
            >
              <div className="flex justify-center items-center mb-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-300 text-slate-400 text-xs font-bold">1</div>
                  <div className="w-16 h-0.5 mx-2 bg-slate-200" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shadow-sm shadow-red-500/20"><ShieldAlert className="w-4 h-4" /></div>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                  <ShieldAlert className="w-7 h-7 text-red-500" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{stepTitles.error}</h1>
                <p className="text-slate-500 text-sm leading-relaxed">{stepDescriptions.error}</p>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-700 mb-1">What happened?</p>
                  <p>Password reset hooks clear automatically after 24 hours for safety metrics. You must request a fresh token initialization sequence.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="flex-1 cursor-pointer border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors text-center"
                  >
                    Back to Sign In
                  </button>
                  <button
                    onClick={() => router.push('/auth/forgot-password')}
                    className="flex-1 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm transition-colors text-center"
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
    <div className="flex w-full min-h-screen bg-slate-50 text-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          loading: { duration: Infinity, iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
        }}
      />
      
      <div className='flex-1 relative hidden md:block h-screen shadow-inner'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='password reset security image'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-slate-900/10'></div>
      </div>
      
      <div className='flex-1 flex flex-col justify-center items-center p-4 min-h-screen bg-white'>
        <div className="w-full max-w-md py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100"
          >
            {/* Progress Timeline Stepper */}
            <div className="flex justify-center items-center mb-8">
              {(['password', 'confirm', 'success'] as Step[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                    currentStep === step 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20' 
                      : isStepCompleted(step)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-200 text-slate-400 bg-slate-50'
                  }`}>
                    {isStepCompleted(step) ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 sm:w-16 h-0.5 mx-1 transition-colors duration-500 ${getConnectorColor(step)}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Title Identity Layout */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                {currentStep === 'success' ? (
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                ) : (
                  <KeyRound className="w-7 h-7 text-emerald-600" />
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">{stepTitles[currentStep]}</h1>
              <p className="text-slate-500 text-sm leading-relaxed px-2">{stepDescriptions[currentStep]}</p>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Input Setup */}
              {currentStep === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase pl-0.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 bg-slate-50/50 text-slate-900 text-sm"
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Security Vector Level Bar */}
                    {formData.password && (
                      <div className="mt-2 pt-0.5 animate-fadeIn">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Password strength:</span>
                          <span className={`text-[11px] font-bold tracking-wide uppercase ${
                            passwordStrengthInfo.color === 'red' ? 'text-red-500' :
                            passwordStrengthInfo.color === 'orange' ? 'text-orange-500' :
                            passwordStrengthInfo.color === 'amber' ? 'text-amber-500' :
                            passwordStrengthInfo.color === 'blue' ? 'text-blue-500' : 'text-emerald-600'
                          }`}>
                            {passwordStrengthInfo.text}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              passwordStrengthInfo.color === 'red' ? 'bg-red-500' :
                              passwordStrengthInfo.color === 'orange' ? 'bg-orange-500' :
                              passwordStrengthInfo.color === 'amber' ? 'bg-amber-500' :
                              passwordStrengthInfo.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(passwordStrengthInfo.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Checklist Requirements Elements */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Requirements Grid:</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li className={`flex items-center gap-2 transition-colors ${formData.password.length >= 8 ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          At least 8 explicit characters
                        </li>
                        <li className={`flex items-center gap-2 transition-colors ${/[a-z]/.test(formData.password) ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          One standard lowercase variable
                        </li>
                        <li className={`flex items-center gap-2 transition-colors ${/[A-Z]/.test(formData.password) ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          One specific uppercase variable
                        </li>
                        <li className={`flex items-center gap-2 transition-colors ${/[0-9]/.test(formData.password) ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          One numeric digital factor
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={isLoading || !formData.password}
                    className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}

              {/* Step 2: Corroboration Framework */}
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
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {formData.confirmPassword && (
                      <div className="flex items-center space-x-1.5 mt-2 pl-0.5 animate-fadeIn">
                        {formData.password === formData.confirmPassword ? (
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
                      disabled={isLoading || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                      className="flex-1 cursor-pointer order-1 sm:order-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success Layout Confirmation */}
              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-5"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-slate-900">Password Reset Complete!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Your identity credentials parameters have been updated. The previous session key has been destroyed.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm transition-all text-center"
                  >
                    Sign In Now
                  </button>

                  <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/50 text-left">
                    <div className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="text-xs text-slate-600 leading-relaxed">
                        <p className="font-bold text-emerald-800">Security Notification</p>
                        <p className="mt-0.5 text-slate-500">
                          For ongoing perimeter defense, legacy password maps are invalid. If this mutation was unexpected, instantly log a ticket with operations.
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
