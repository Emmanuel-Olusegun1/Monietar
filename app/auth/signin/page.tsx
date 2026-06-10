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

  const handleForgotPassword = () => {
    if (signinMethod !== 'email') {
      toast.error('Please use email to reset your password');
      return;
    }

    if (!formData.email) {
      router.push('/auth/forgot-password');
    } else {
      router.push(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+\s]/g, '');
    if (!cleaned.startsWith('+')) return '+' + cleaned.replace(/[^\d]/g, '');
    const num = cleaned.slice(1).replace(/\D/g, '');
    if (num.length <= 3) return '+' + num;
    if (num.length <= 6) return `+${num.slice(0, 3)} ${num.slice(3)}`;
    if (num.length <= 9) return `+${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
    return `+${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6, 10)} ${num.slice(10)}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) });
  };

  return (
    <div className='flex w-full md:h-screen bg-slate-50 text-slate-900'>
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

      {/* Left Image Side */}
      <div className='flex-1 relative hidden md:block shadow-inner h-screen'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='cashflow image'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-slate-900/10'></div>
      </div>

      {/* Right Form Side */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 h-screen relative overflow-hidden bg-white'>
        
        {/* Light Mode Language Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 transition font-medium"
          >
            <Globe className="h-4 w-4 text-slate-500" />
            <span>{currentLanguage}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 w-40 overflow-hidden">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setCurrentLanguage(language.name);
                    setShowLanguageDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clean Light Form Container */}
        <div className="w-full max-w-md py-4 pt-[120px] overflow-y-auto md:pt-8 scrollbar-hide">
          <h1 className='text-3xl font-extrabold mb-2 text-center text-slate-900 tracking-tight'>{t.welcome}</h1>
          <p className='mb-6 text-slate-500 text-center text-sm'>{t.subtitle}</p>

          {/* Light Mode Method Switch Toggle */}
          <div className="w-full mb-5">
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setSigninMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  signinMethod === 'email'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.signInWithEmail || 'Email'}
              </button>
              <button
                type="button"
                onClick={() => setSigninMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  signinMethod === 'phone'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.signInWithPhone || 'Phone'}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Inputs converted from raw dark gray boxes to clean, bordered slate designs */}
              {signinMethod === 'email' ? (
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 text-slate-900 text-sm"
                    placeholder={t.email}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 text-slate-900 text-sm"
                      placeholder={t.phonePlaceholder || '+234 801 234 5678'}
                      required
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-1">
                    {t.phoneFormatHint || "Enter your full international phone number with country code"}
                    <br />
                    <span className="text-emerald-600 font-medium">Examples: +234 908 567 8900, +229 7911 123456</span>
                  </p>
                </div>
              )}

              {/* Password Input Context */}
              {signinMethod === 'email' && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-slate-400 text-slate-900 text-sm"
                    placeholder={t.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Forgot Password Link styling refinement */}
              {signinMethod === 'email' && (
                <div className="text-right pr-0.5">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors underline underline-offset-2"
                  >
                    {(t as any).forgotPassword || 'Forgot password?'}
                  </button>
                </div>
              )}

              {/* Primary Emerald Button */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/80 text-white font-semibold py-2.5 rounded-lg shadow-sm shadow-emerald-600/10 hover:shadow-md transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 text-white" />
                    {signinMethod === 'email' ? 'Signing in...' : 'Sending code...'}
                  </>
                ) : signinMethod === 'email' ? (
                  t.signin || 'Sign In'
                ) : (
                  t.signInWithPhone || 'Send Code'
                )}
              </button>

              {/* Navigation Redirect footer option */}
              <div className="text-center text-sm text-slate-500 pt-3">
                {t.dontHaveAccount}{' '}
                <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-500 font-semibold underline underline-offset-2 transition-colors">
                  {t.createAccount}
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Global utilities wrapper logic */}
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
