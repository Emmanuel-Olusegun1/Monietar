'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { translations, languages } from './signintranslations';
import { Toaster, toast } from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Phone } from 'lucide-react';

// Create Supabase client
const supabase = createClientComponentClient();

const MOCK_DATA = {
  email: {
    'user@monitar.com': {
      Password: 'password123',
      name: 'Monietar User1',
      id: 'user-001'
    },
    'my@monietar.com': {
      password: 'password456',
      name: 'MOnietar User2',
      id: 'user-002'
    }
  },
  Phone: {
    '+234 9034010384': {
      name: 'Phone User1',
      id: 'phone-user-001'
    },
    '+234 9071565791': {
      name: 'Phone User2',
      id: 'phone-user-002'
    }
  }
};

// Mock API service using MOCK_DATA
const authAPI = {
  async signInWithEmail(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_DATA.email[email as keyof typeof MOCK_DATA.email];
    
    if (!user) {
      throw new Error('No user found with this email');
    }
    
    // Note: In your MOCK_DATA, one has 'Password' and one has 'password' - fixing this inconsistency
    const userPassword = (user as any).Password || (user as any).password;
    
    if (userPassword !== password) {
      throw new Error('Invalid password');
    }
    
    return {
      user: {
        id: user.id,
        email: email,
        name: user.name
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    };
  },

  async signInWithPhone(phone: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cleanedPhone = phone.replace(/\s/g, '');
    const phoneKey = Object.keys(MOCK_DATA.Phone).find(key => key.replace(/\s/g, '') === cleanedPhone);
    
    if (!phoneKey) {
      throw new Error('No user found with this phone number');
    }
    
    const user = MOCK_DATA.Phone[phoneKey as keyof typeof MOCK_DATA.Phone];
    
    return {
      success: true,
      message: 'Verification code sent',
      user: {
        id: user.id,
        phone: phoneKey,
        name: user.name
      }
    };
  },

  async signInWithGoogle() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Google OAuth URL
    return '/auth/google/callback';
  },

  async resetPassword(email: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_DATA.email[email as keyof typeof MOCK_DATA.email];
    
    if (!user) {
      throw new Error('No user found with this email');
    }
    
    return { message: 'Password reset instructions sent to your email' };
  },

  async checkAuth(): Promise<{ user?: any }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always return not authenticated in mock
    throw new Error('Not authenticated');
  }
};

// Create a wrapper component that uses useSearchParams
function SigninContent() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signinMethod, setSigninMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = translations[currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations] || translations.en;

  // Check authentication status and handle OAuth callback
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        
        // Use Supabase directly for session check (more reliable)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('User already authenticated, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
        
        // Fallback to API check
        try {
          const response = await authAPI.checkAuth();
          if (response.user) {
            router.push('/dashboard');
            return;
          }
        } catch (apiError) {
          console.log('API auth check failed, continuing with signin form');
        }
        
        // Handle OAuth callback errors
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          toast.error(errorDescription || 'Authentication failed');
          // Clear URL parameters
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('error');
          newUrl.searchParams.delete('error_description');
          window.history.replaceState({}, '', newUrl.toString());
        }
        
      } catch (error) {
        console.log('User not authenticated, showing signin form');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [searchParams, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsSigningIn(true);
    
    const loadingToast = toast.loading('Signing in...');

    try {
      if (signinMethod === 'email') {
        // Email signin
        const { email, password } = formData;
        
        // First try direct Supabase auth
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          toast.success(t.thankYou || 'Welcome back!');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
          
        } catch (directError: any) {
          // Fallback to API if direct auth fails
          console.log('Direct auth failed, trying API:', directError);
          await authAPI.signInWithEmail(email, password);
          toast.success(t.thankYou || 'Welcome back!');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      } else {
        // Phone signin - Send OTP
        let phoneNumber = formData.phone.replace(/\s/g, '');
        
        // Add country code if not present
        if (!phoneNumber.startsWith('+')) {
          toast.error('Please include country code (e.g., +1 for US/Canada)');
          setIsSigningIn(false);
          toast.dismiss(loadingToast);
          return;
        }

        // Try direct Supabase auth first
        try {
          const { error } = await supabase.auth.signInWithOtp({
            phone: phoneNumber,
          });

          if (error) throw error;

          toast.success('Verification code sent to your phone!');
          setTimeout(() => {
            router.push(`/auth/verify-phone?phone=${encodeURIComponent(phoneNumber)}`);
          }, 1500);
          
        } catch (directError: any) {
          // Fallback to API
          console.log('Direct phone auth failed, trying API:', directError);
          await authAPI.signInWithPhone(phoneNumber);
          toast.success('Verification code sent to your phone!');
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
      } else if (error.message.includes('Authentication service unavailable')) {
        toast.error('Authentication service is currently unavailable. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    } finally {
      setIsSigningIn(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const oauthUrl = await authAPI.signInWithGoogle();
      toast.loading('Redirecting to Google...');
      
      // Redirect to Google OAuth
      window.location.href = oauthUrl;
      
    } catch (error: any) {
      console.error('Google signin error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const handleForgotPassword = () => {
    if (signinMethod === 'email' && !formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    if (signinMethod === 'phone') {
      toast.error('Please use email to reset your password');
      return;
    }

    // Redirect to forgot password page with the email pre-filled
    router.push(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`);
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
    const cleaned = value.replace(/[^\d+\s]/g, '');
    
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned.replace(/[^\d]/g, '');
    }
    
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
    <div className='flex w-full md:h-screen bg-gray-900 text-white'>
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
      
      {/* The image slider section */}
      <div className='flex-1 relative hidden md:block shadow-lg h-screen'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='cashflow image'
          fill
          className='object-cover rounded-md'
          priority
        />
      {/* Dark overlay for better text contrast */}
        <div className='absolute inset-0 bg-black/30'></div>
      </div>
      
      {/* The main and form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-gray-900'>
        {/* Language Switcher - Top Left */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 hover:cursor-pointer border border-gray-700"
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
            <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-20 w-40">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => selectLanguage(language.code, language.name)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 hover:cursor-pointer text-white"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Centered Content Container */}
        <div className="w-full max-w-md py-4 pt-[120px] overflow-y-auto md:pt-8 scrollbar-hide">
          <h1 className='text-3xl font-bold mb-2 text-center text-white'>{t.welcome}</h1>
          <p className='mb-6 text-gray-300 text-center'>{t.subtitle}</p>

          {/* Signin Method Toggle */}
          <div className="w-full mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSigninMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signinMethod === 'email'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.signInWithEmail || 'Email'}
              </button>
              <button
                type="button"
                onClick={() => setSigninMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signinMethod === 'phone'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
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
                    className="w-full px-3 py-2 rounded-sm border-b border-gray-600 focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white"
                    placeholder={t.email}
                    required
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
                     className="w-full px-3 py-2 rounded-sm border-b border-gray-600 focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white"
                     placeholder={t.phonePlaceholder} 
                     required
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {t.phoneFormatHint || "Enter your full international phone number with country code"}
                    <br />
                    <span className="text-emerald-400">Examples: +234 908 567 8900, +229 7911 123456</span>
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
                    className="w-full px-3 py-2 pr-10 rounded-sm border-b border-gray-600 focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white"
                    placeholder={t.password}
                    required
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
              )}

              {/* Forgot Password (only for email signin) */}
              {signinMethod === 'email' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-400 hover:text-emerald-300 underline hover:cursor-pointer"
                  >
                    {(t as any).forgotPassword || 'Forgot password?'}
                  </button>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center hover:cursor-pointer justify-center"
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
                  signinMethod === 'email' ? t.signin : (t.signInWithPhone || 'Send Code')
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">{t.orContinue}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignin}
                disabled={isSigningIn}
                className="w-full flex hover:cursor-pointer justify-center items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="text-center text-sm text-gray-400 pt-2">
                {t.dontHaveAccount}{' '}
                <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  {t.createAccount}
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Main component with Suspense boundary
export default function Signin() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <SigninContent />
    </Suspense>
  );
}