'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations, languages } from './signuptranslations';
import { Toaster, toast } from 'react-hot-toast';
import { Loader2, Eye, EyeOff, Globe, ChevronDown, Sparkles } from 'lucide-react';

// Modern Supabase client
import { supabase } from '@/utils/supabase/client';

export default function Signup() {
  const [isSigningup, setIsSigningup] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const t = translations[currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations] || translations.en;

  const getTranslation = (key: string, fallback: string) => {
    return (t as any)[key] || fallback;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.business_name.trim()) {
      errors.business_name = getTranslation('businessNameRequired', 'Business name is required');
    } else if (formData.business_name.length < 2) {
      errors.business_name = 'Business name must be at least 2 characters';
    }

    if (!formData.name.trim()) {
      errors.name = getTranslation('nameRequired', 'Full name is required');
    } else if (formData.name.length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    if (signupMethod === 'email') {
      if (!formData.email.trim()) {
        errors.email = getTranslation('emailRequired', 'Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone.trim()) {
        errors.phone = getTranslation('phoneRequired', 'Phone number is required');
      } else if (!formData.phone.startsWith('+')) {
        errors.phone = 'Please include country code (e.g., +234)';
      } else if (formData.phone.replace(/\s/g, '').length < 8) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password) {
      errors.password = getTranslation('passwordRequired', 'Password is required');
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = getTranslation('passwordsDoNotMatch', "Passwords don't match");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateBusinessName = async (businessName: string) => {
    if (businessName.length < 2) return;
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsValidating(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSigningup(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      if (signupMethod === 'email') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              name: formData.name.trim(),
              business_name: formData.business_name.trim(),
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('An account with this email already exists');
          } else if (error.message.includes('Password should be')) {
            toast.error('Password is too weak');
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (data.user && !data.user.identities?.length) {
          toast.error('Email already registered');
          return;
        }

        toast.success('Account created! Check your email for verification.');
        setTimeout(() => router.push('/auth/signin'), 3000);
      } 
      else {
        const phone = formData.phone.replace(/\s/g, '');

        const { error } = await supabase.auth.signUp({
          phone,
          password: formData.password,
          options: {
            data: {
              name: formData.name.trim(),
              business_name: formData.business_name.trim(),
            },
          },
        });

        if (error) {
          toast.error(error.message.includes('already registered')
            ? 'Phone number already registered'
            : error.message
          );
          return;
        }

        toast.success('Verification code sent to your phone!');
        setTimeout(() => {
          router.push(`/auth/verify-phone?phone=${encodeURIComponent(phone)}`);
        }, 2000);
      }
    } catch (err: any) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSigningup(false);
      toast.dismiss(loadingToast);
    }
  };

  const selectLanguage = (languageName: string) => {
    setCurrentLanguage(languageName);
    setShowLanguageDropdown(false);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+\s]/g, '');
    if (!cleaned.startsWith('+')) return '+' + cleaned.replace(/[^\d]/g, '');
    const num = cleaned.slice(1).replace(/\D/g, '');
    if (num.length <= 3) return '+' + num;
    if (num.length <= 6) return `+${num.slice(0,3)} ${num.slice(3)}(`;
    if (num.length <= 9) return `+${num.slice(0,3)} ${num.slice(3,6)} ${num.slice(6)}`;
    return `+${num.slice(0,3)} ${num.slice(3,6)} ${num.slice(6,10)} ${num.slice(10)}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  return (
    <div className='flex w-full flex-row-reverse md:h-screen bg-slate-50 text-slate-700 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-700'>
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
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757901059/Junior_Bookkeeper_Finance_Associate_ifwrdq.jpg'
          alt='SME Cashflow Automation Engine'
          fill
          className='object-cover opacity-80 mix-blend-luminosity'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20'></div>
        
        {/* Value Proposition Content Overlay */}
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 tracking-wide uppercase">Automated Intelligence</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4 leading-tight">
            Stop replacing notebooks.<br/>Start scaling capital.
          </h2>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed font-medium">
            Join thousands of modern merchants running dual-currency ledgers, instant P&L reporting loops, and automated cross-border parallel market syncing models.
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
                  onClick={() => selectLanguage(language.name)}
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
                onClick={() => setSignupMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  signupMethod === 'email' ? 'bg-white text-emerald-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {getTranslation('signUpWithEmail', 'Email Ingestion')}
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  signupMethod === 'phone' ? 'bg-white text-emerald-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {getTranslation('signUpWithPhone', 'SMS Gateway')}
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
              {/* Structural Parameters: Merchant Identity Core */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.businessName}</label>
                  <input
                    type="text"
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    onBlur={(e) => validateBusinessName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:ring-2 ${
                      formErrors.business_name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder="e.g. Alata Retail Ltd"
                    required
                  />
                  {formErrors.business_name && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.business_name}</p>
                  )}
                  {isValidating && (
                    <div className="absolute right-3 bottom-3">
                      <Loader2 className="animate-spin h-4 w-4 text-emerald-500" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.name}</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:ring-2 ${
                      formErrors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder="Full Name"
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.name}</p>
                  )}
                </div>
              </div>

              {/* Communication Routing Ingestion Fields */}
              {signupMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.email}</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:ring-2 ${
                      formErrors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder="merchant@company.com"
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.email}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number Address</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:ring-2 ${
                      formErrors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder={t.phonePlaceholder || "+234 ..."}
                    required
                    maxLength={20}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.phone}</p>}
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs text-slate-500 font-medium leading-relaxed">
                    {t.phoneFormatHint || "Enter international routing structure starting with operational corridor country codes."}
                    <div className="text-emerald-600 mt-1 font-semibold">Trade Corridors: +234 (Nigeria) | +229 (Benin Republic)</div>
                  </div>
                </div>
              )}

              {/* Password Isolation Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.password}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 pr-10 rounded-lg border bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:ring-2 ${
                        formErrors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
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
                  {formErrors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.confirmPassword}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 pr-10 rounded-lg border bg-slate-50 text-slate-900 font-medium text-sm outline-none transition-all placeholder-slate-400 focus:bg-white focus:ring-2 ${
                        formErrors.confirm_password ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.confirm_password && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.confirm_password}</p>}
                </div>
              </div>

              {/* Action Form Directing Triggers */}
              <button
                type="submit"
                disabled={isSigningup}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold py-3 rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                {isSigningup ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>{getTranslation('creatingAccount', 'Provisioning Profile...')}</span>
                  </>
                ) : (
                  signupMethod === 'email' ? t.createAccount : getTranslation('createAccountWithPhone', 'Register via SMS Gateway')
                )}
              </button>
            </form>
            
            {/* Redirect Matrix Link */}
            <div className="mt-6 text-center text-xs font-medium text-slate-500">
              Already configuring ledger states?{' '}
              <Link href="/auth/signin" className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4">
                Sign in to workspace
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
