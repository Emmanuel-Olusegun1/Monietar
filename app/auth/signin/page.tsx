'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { translations, languages } from './signintranslations';
import { supabase } from '@/lib/supabase/client';
import { Toaster, toast } from 'react-hot-toast';

// Create a wrapper component that uses useSearchParams
function SigninContent() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signinMethod, setSigninMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = translations[currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations] || translations.en;

  // Check if Supabase is initialized
  useEffect(() => {
    try {
      // This will throw an error if Supabase isn't properly configured
      supabase.auth.getSession();
      setSupabaseInitialized(true);
    } catch (error) {
      console.error('Supabase not initialized:', error);
      toast.error('Authentication service is not configured properly');
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!supabaseInitialized) return;
      
      // Check if this is an OAuth callback by looking for specific parameters
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        toast.error(errorDescription || 'Authentication failed');
        return;
      }

      // Check if we have a session (OAuth success)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsSigningIn(true);
        toast.loading('Completing sign in...');
        
        try {
          toast.success(t.thankYou || 'Welcome back!');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } catch (error: any) {
          console.error('OAuth error:', error);
          toast.error(error.message || 'Failed to sign in');
        } finally {
          setIsSigningIn(false);
          toast.dismiss();
        }
      }
    };
    
    handleOAuthCallback();
  }, [searchParams, router, t.thankYou, supabaseInitialized]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabaseInitialized) {
      toast.error('Authentication service is not ready');
      return;
    }
    
    setIsSigningIn(true);
    
    const loadingToast = toast.loading('Signing in...');

    try {
      if (signinMethod === 'email') {
        // Email signin
        const { email, password } = formData;
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session && data.user) {
          toast.success(t.thankYou || 'Welcome back!');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      } else {
        // Phone signin - Send OTP
        // Ensure phone number includes country code
        let phoneNumber = formData.phone.replace(/\s/g, '');
        
        // Add country code if not present (assuming +1 as default, but user should enter full international format)
        if (!phoneNumber.startsWith('+')) {
          toast.error('Please include country code (e.g., +1 for US/Canada)');
          setIsSigningIn(false);
          toast.dismiss(loadingToast);
          return;
        }

        const { data, error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
          options: {
            // If the user doesn't exist, this will create a new user
            shouldCreateUser: false,
          },
        });

        if (error) {
          throw error;
        }

        if (data) {
          toast.success('Verification code sent to your phone!');
          // Redirect to OTP verification page
          setTimeout(() => {
            router.push(`/auth/verify-phone?phone=${encodeURIComponent(phoneNumber)}`);
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      
      // More user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email address before signing in');
      } else if (error.message.includes('Phone')) {
        toast.error('Invalid phone number or user not found');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    } finally {
      setIsSigningIn(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleGoogleSignin = async () => {
    if (!supabaseInitialized) {
      toast.error('Authentication service is not ready');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/signin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      toast.loading('Redirecting to Google...');
      
    } catch (error: any) {
      console.error('Google signin error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const handleForgotPassword = async () => {
    if (signinMethod === 'email' && !formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    if (signinMethod === 'phone') {
      toast.error('Please use email to reset your password');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset instructions');
    }
  };

  const selectLanguage = (languageCode: string, languageName: string) => {
    setCurrentLanguage(languageName);
    setShowLanguageDropdown(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Format phone number as user types (international format with +)
  const formatPhoneNumber = (value: string) => {
    // Allow only numbers, +, and spaces
    const cleaned = value.replace(/[^\d+\s]/g, '');
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned.replace(/[^\d]/g, '');
    }
    
    // Format the rest of the number with spaces for readability
    const plusPart = '+';
    const numberPart = cleaned.slice(1).replace(/\D/g, '');
    
    if (numberPart.length <= 3) {
      return plusPart + numberPart;
    } else if (numberPart.length <= 6) {
      return plusPart + numberPart.slice(0, 3) + ' ' + numberPart.slice(3);
    } else if (numberPart.length <= 9) {
      return plusPart + numberPart.slice(0, 3) + ' ' + numberPart.slice(3, 6) + ' ' + numberPart.slice(6);
    } else {
      return plusPart + numberPart.slice(0, 3) + ' ' + numberPart.slice(3, 6) + ' ' + numberPart.slice(6, 10) + ' ' + numberPart.slice(10);
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      phone: formattedPhone
    });
  };

  return (
    <div className='flex w-full md:h-screen'>
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
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='cashflow image'
          fill
          className='object-cover rounded-md'
          priority
        />
      </div>
      
      {/* The main and form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden'>
        {/* Language Switcher - Top Left */}
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
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Centered Content Container */}
        <div className="w-full max-w-md py-4 pt-[120px] overflow-y-scroll md:pt-8 md:overflow-y-hidden">
          <h1 className='text-3xl font-bold mb-2 text-center'>{t.welcome}</h1>
          <p className='mb-6 text-gray-600 text-center'>{t.subtitle}</p>

          {/* Signin Method Toggle */}
          <div className="w-full mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSigninMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signinMethod === 'email'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.signInWithEmail || 'Email'}
              </button>
              <button
                type="button"
                onClick={() => setSigninMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signinMethod === 'phone'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.signInWithPhone || 'Phone'}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email/Phone Field */}
              {signinMethod === 'email' ? (
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.email}
                    required
                    disabled={!supabaseInitialized}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-3 py-2 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                      placeholder="+1 234 567 8900"
                      required
                      disabled={!supabaseInitialized}
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {t.phoneFormatHint || "Enter your full international phone number with country code"}
                    <br />
                    <span className="text-emerald-600">Examples: +234 908 567 8900, +229 7911 123456</span>
                  </p>
                </div>
              )}
              
              {/* Password Field (only for email signin) */}
              {signinMethod === 'email' && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                    placeholder={t.password}
                    required
                    disabled={!supabaseInitialized}
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
              )}

              {/* Forgot Password (only for email signin) */}
              {signinMethod === 'email' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-700 underline hover:cursor-pointer"
                  >
                    {(t as any).forgotPassword || 'Forgot password?'}
                  </button>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSigningIn || !supabaseInitialized}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center hover:cursor-pointer justify-center"
              >
                {isSigningIn ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {signinMethod === 'email' ? t.signingIn : 'Sending code...'}
                  </>
                ) : (
                  supabaseInitialized 
                    ? (signinMethod === 'email' ? t.signin : (t.signInWithPhone || 'Send Code'))
                    : 'Loading...'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t.orContinue}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignin}
                disabled={isSigningIn || !supabaseInitialized}
                className="w-full flex hover:cursor-pointer justify-center items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="none" />
                  <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
                  <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
                  <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
                  <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
                </svg>
                {t.signInWithGoogle}
              </button>

              <div className="text-center text-sm text-gray-600 pt-2">
                {t.dontHaveAccount}{' '}
                <Link href="/auth/signup" className="text-emerald-500 hover:text-emerald-600 font-medium">
                  {t.createAccount}
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Signin() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <SigninContent />
    </Suspense>
  );
}