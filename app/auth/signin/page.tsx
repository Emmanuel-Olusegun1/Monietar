// app/auth/signin/page.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { translations, languages } from './signintranslations';
import { Loader2, Eye, EyeOff, Globe, ChevronDown } from 'lucide-react';

// Modern Supabase client (2025+)
import { supabase } from '@/utils/supabase/client';

export default function Signin() {
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

  const router = useRouter();
  const t = translations[currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations] || translations.en;

  // Auto redirect if already logged in
  useEffect(() => {
  const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.replace('/dashboard');
    }
  };
  checkSession();
}, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    const loadingToast = toast.loading(signinMethod === 'email' ? 'Signing in...' : 'Sending code...');

    try {
      if (signinMethod === 'email') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (error) {
          toast.error(
            error.message.includes('Invalid login credentials')
              ? 'Invalid email or password'
              : error.message.includes('Email not confirmed')
              ? 'Please verify your email first'
              : error.message
          );
          return;
        }

        toast.success(t.thankYou || 'Welcome back!');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        let phone = formData.phone.replace(/\s/g, '');
        if (!phone.startsWith('+')) {
          toast.error('Please include country code (e.g., +234)');
          return;
        }

        const { error } = await supabase.auth.signInWithOtp({ phone });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Verification code sent to your phone!');
        setTimeout(() => {
          router.push(`/auth/verify-phone?phone=${encodeURIComponent(phone)}`);
        }, 1500);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSigningIn(false);
      toast.dismiss(loadingToast);
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // UPDATED: Redirect to forgot password page instead of handling it here
  const handleForgotPassword = () => {
    if (signinMethod !== 'email') {
      toast.error('Please use email to reset your password');
      return;
    }

    if (!formData.email) {
      // Redirect to forgot password page without email
      router.push('/auth/forgot-password');
    } else {
      // Redirect with email pre-filled
      router.push(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+\s]/g, '');
    if (!cleaned.startsWith('+')) return '+' + cleaned.replace(/[^\d]/g, '');
    const num = cleaned.slice(1).replace(/\D/g, '');
    if (num.length <= 3) return '+' + num;
    if (num.length <= 6) return `+${num.slice(0,3)} ${num.slice(3)}`;
    if (num.length <= 9) return `+${num.slice(0,3)} ${num.slice(3,6)} ${num.slice(6)}`;
    return `+${num.slice(0,3)} ${num.slice(3,6)} ${num.slice(6,10)} ${num.slice(10)}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) });
  };

  return (
    <div className='flex w-full md:h-screen bg-gray-900 text-white'>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          loading: { duration: Infinity, iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
        }}
      />

      {/* Left Image */}
      <div className='flex-1 relative hidden md:block shadow-lg h-screen'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='cashflow image'
          fill
          className='object-cover rounded-md'
          priority
        />
        <div className='absolute inset-0 bg-black/30'></div>
      </div>

      {/* Right Form */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-gray-900'>
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
          >
            <Globe className="h-5 w-5" />
            <span>{currentLanguage}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-20 w-40">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setCurrentLanguage(language.name);
                    setShowLanguageDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-white"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md py-4 pt-[120px] overflow-y-auto md:pt-8 scrollbar-hide">
          <h1 className='text-3xl font-bold mb-2 text-center text-white'>{t.welcome}</h1>
          <p className='mb-6 text-gray-300 text-center'>{t.subtitle}</p>

          {/* Toggle */}
          <div className="w-full mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSigninMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
              {/* Email or Phone Input */}
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
                      placeholder={t.phonePlaceholder || '+234 801 234 5678'}
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

              {/* Password */}
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Forgot Password */}
              {signinMethod === 'email' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm hover:cursor-pointer text-emerald-400 hover:text-emerald-300 underline"
                  >
                    {(t as any).forgotPassword || 'Forgot password?'}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-2 rounded-lg transition-colors hover:cursor-pointer flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    {signinMethod === 'email' ? 'Signing in...' : 'Sending code...'}
                  </>
                ) : signinMethod === 'email' ? (
                  t.signin || 'Sign In'
                ) : (
                  t.signInWithPhone || 'Send Code'
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">{t.orContinue}</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={isSigningIn}
                className="w-full flex justify-center hover:cursor-pointer items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="none" />
                  <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
                  <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
                  <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
                  <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
                </svg>
                {t.signInWithGoogle || 'Continue with Google'}
              </button>

              {/* Sign Up Link */}
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

      {/* Hide Scrollbar */}
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