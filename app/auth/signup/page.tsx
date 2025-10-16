'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations, languages } from './signuptranslations';
import { supabase } from '@/lib/supabase/client';
import { Toaster, toast } from 'react-hot-toast';

export default function Signup() {
  const [isSigningup, setIsSigningup] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const router = useRouter();
  const t = translations[currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations] || translations.en;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSigningup(true);

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      toast.error(t.passwordsDoNotMatch || "Passwords don't match");
      setIsSigningup(false);
      return;
    }

    // Validate required fields based on signup method
    if (signupMethod === 'email' && !formData.email) {
      toast.error(t.emailRequired || 'Email is required');
      setIsSigningup(false);
      return;
    }

    if (signupMethod === 'phone' && !formData.phone) {
      toast.error(t.phoneRequired || 'Phone number is required');
      setIsSigningup(false);
      return;
    }

    const loadingToast = toast.loading('Creating your account...');

    try {
      if (signupMethod === 'email') {
        // Email signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              business_name: formData.business_name,
              name: formData.name,
              user_metadata: {
                business_name: formData.business_name,
                name: formData.name,
              }
            }
          }
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (authData.user) {
          toast.success(t.thankYou || 'Account created successfully!');
          
          // Show redirect notification after a short delay
          setTimeout(() => {
            toast.loading('Redirecting to dashboard...');
          }, 1500);
          
          // Redirect to dashboard after a longer delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      } else {
        // Phone signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          phone: formData.phone,
          password: formData.password,
          options: {
            data: {
              business_name: formData.business_name,
              name: formData.name,
              user_metadata: {
                business_name: formData.business_name,
                name: formData.name,
              }
            }
          }
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (authData.user) {
          toast.success(t.verifyPhone || 'Verification code sent to your phone!');
          
          // Show redirect notification after a short delay
          setTimeout(() => {
            toast.loading('Redirecting to verification...');
          }, 1500);
          
          // Redirect to verification page or dashboard
          setTimeout(() => {
            router.push('/verify-phone');
          }, 3000);
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'An error occurred during signup');
    } finally {
      setIsSigningup(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      toast.loading('Redirecting to Google...');
      
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'An error occurred during Google signup');
    }
  };

  const selectLanguage = (languageCode: string, languageName: string) => {
    setCurrentLanguage(languageName);
    setShowLanguageDropdown(false);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      phone: formattedPhone
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='flex flex-row-reverse w-full md:h-screen '>
      {/* Toast Notifications */}
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
      
      {/* The image slider section */}
      <div className='flex-1 relative hidden md:block shadow-lg h-screen'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757901059/Junior_Bookkeeper_Finance_Associate_ifwrdq.jpg'
          alt='cashflow image'
          fill
          className='object-cover rounded-md'
          priority
        />
      </div>
      
      {/* The main and form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-[#f1f1f1]'>
        {/* Language Switcher - Top Right */}
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-300 hover:cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{currentLanguage}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-40">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => selectLanguage(language.code, language.name)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Centered Content Container */}
      <div className="w-full max-w-md px-4 pt-[90px] overflow-y-scroll md:pt-8 md:overflow-y-hidden">
          <h1 className='text-3xl font-bold mb-2 text-center'>{t.welcome}</h1>
          <p className='mb-6 text-gray-600 text-center'>{t.subtitle}</p>

          {/* Signup Method Toggle */}
          <div className="w-full mb-4">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSignupMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signupMethod === 'email'
                    ? 'bg-[#fff]/70 text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.signUpWithEmail || 'Email'}
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signupMethod === 'phone'
                    ? 'bg-[#fff]/70 text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.signUpWithPhone || 'Phone'}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name and Full Name side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder={t.businessName}
                    required
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.name}
                    required
                  />
                </div>
              </div>
              
              {/* Email/Phone Field */}
              {signupMethod === 'email' ? (
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.email}
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-3 py-2 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.phonePlaceholder || "(123) 456-7890"}
                    required
                    maxLength={14}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t.phoneFormatHint || "We'll send a verification code to this number"}
                  </p>
                </div>
              )}
              
              {/* Password and Confirm Password side by side with toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Password Field */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.password}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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

                {/* Confirm Password Field */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.confirmPassword}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
              </div>
              
              <button
                type="submit"
                disabled={isSigningup}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center hover:cursor-pointer justify-center"
              >
                {isSigningup ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.creatingAccount}
                  </>
                ) : (
                  signupMethod === 'email' ? t.createAccount : (t.createAccountWithPhone || 'Sign up with Phone')
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#f1f1f1] text-gray-500">{t.orContinue}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isSigningup}
                className="w-full flex hover:cursor-pointer justify-center items-center gap-2 bg-[#fff]/70 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="none" />
                  <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
                  <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
                  <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
                  <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
                </svg>
                {t.signUpWithGoogle}
              </button>

              <div className="text-center text-sm text-gray-600 pt-2">
                {t.haveAccount}{' '}
                <Link href="/auth/signin" className="text-emerald-500 hover:text-emerald-600 font-medium">
                  {t.signin}
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}