// app/auth/signin/page.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { Toaster, toast } from 'react-hot-toast';
import { translations, languages } from './signintranslations';
import { Loader2, Eye, EyeOff, Globe, ChevronDown } from 'lucide-react';

// Modern Supabase client (2025+)
import { supabase } from '@/utils/supabase/client';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

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

  const getTranslation = (key: string, fallback: string) => {
    return (t as any)[key] || fallback;
  };

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
    <div className={`flex w-full flex-row-reverse md:h-screen bg-[#f1f1f1] text-slate-700 antialiased selection:bg-emerald-500/20 selection:text-emerald-700 ${poppins.className}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px' },
          success: { duration: 3000, iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          loading: { duration: Infinity, iconTheme: { primary: '#2563eb', secondary: '#fff' } },
        }}
      />

      {/* Hero Narrative Split Panel (Left) */}
      <div className='flex-1 relative hidden md:block h-screen bg-slate-900 overflow-hidden'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
          alt='SME Cashflow Automation Engine'
          fill
          className='object-cover opacity-80 mix-blend-luminosity'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20'></div>
        
        {/* Value Proposition Content Overlay */}
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white max-w-xl">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4 leading-tight">
            Track sales, profits, and cash flow. Automatically.
          </h2>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed font-medium">
            Connect bank transfers, cash sales, and cross-border currency flows into one ledger so your business runs on clear numbers, not manual math.
          </p>
        </div>
      </div>

      {/* Main Form Entry Column (Right) */}
      <div className='flex-1 flex flex-col justify-center items-center p-6 h-screen relative bg-white border-l border-slate-100'>
        {/* Language Selection Mechanism */}
        <div className="absolute top-6 right-6 z-10">
          <button 
            type="button"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
          >
            <Globe className="h-4 w-4 text-slate-400" />
            <span>{currentLanguage}</span>
            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg z-20 w-44 overflow-hidden p-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setCurrentLanguage(language.name);
                    setShowLanguageDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Workspace Card Wrapper */}
        <div className="w-full max-w-md px-2 pt-[60px] overflow-y-auto md:pt-0 scrollbar-hide flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className='text-3xl font-black mb-2 text-slate-900 tracking-tight'>{t.welcome}</h1>
            <p className='text-sm text-slate-500 font-medium px-4'>{t.subtitle}</p>
          </div>

          {/* Authentication Ingestion Segment Toggles */}
          <div className="w-full mb-6">
            <div className="flex bg-slate-100 rounded-lg p-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setSigninMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  signinMethod === 'email' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.signInWithEmail || 'Use Email'}
              </button>
              <button
                type="button"
                onClick={() => setSigninMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  signinMethod === 'phone' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.signInWithPhone || 'Use Phone'}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Communication Routing Ingestion Fields */}
              {signinMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="merchant@company.com"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder={t.phonePlaceholder || "+234 ..."}
                    required
                    maxLength={20}
                  />
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs text-slate-500 font-medium leading-relaxed">
                    {t.phoneFormatHint || 'Enter your full international phone number with country code'}
                    <div className="text-emerald-600 mt-1 font-semibold">Example: +234 (Nigeria) | +229 (Benin Republic)</div>
                  </div>
                </div>
              )}

              {/* Password Isolation Architecture */}
              {signinMethod === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Trigger */}
              {signinMethod === 'email' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-2"
                  >
                    {(t as any).forgotPassword || 'Forgot password?'}
                  </button>
                </div>
              )}

              {/* Action Form Directing Triggers */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold py-3 rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-3 disabled:cursor-not-allowed text-sm"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>{signinMethod === 'email' ? 'Signing in...' : 'Sending code...'}</span>
                  </>
                ) : signinMethod === 'email' ? (
                  t.signin || 'Sign In'
                ) : (
                  getTranslation('createAccountWithPhone', 'Send Code')
                )}
              </button>
            </form>
            
            {/* Redirect Matrix Link */}
            <div className="mt-6 text-center text-xs font-medium text-slate-500">
              {t.dontHaveAccount}{' '}
              <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4">
                {t.createAccount}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

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