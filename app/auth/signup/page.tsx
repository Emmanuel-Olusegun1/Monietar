'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations, languages } from './signuptranslations';
import { Toaster, toast } from 'react-hot-toast';
import { Loader2, Eye, EyeOff, Globe, ChevronDown } from 'lucide-react';

// Modern Supabase client (same as your signin page)
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
        errors.phone = 'Please include country code (e.g., +1 for US/Canada)';
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

  // Mock business name validation (you can connect to your backend later if needed)
  const validateBusinessName = async (businessName: string) => {
    if (businessName.length < 2) return;
    setIsValidating(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // For now, allow all names (or connect to your real endpoint)
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

// Google sign-up function
// const signUpWithGoogle = async () => {
//   setIsSigningup(true);
//   try {
//     console.log('Starting Google sign-up flow...');
    
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: `${window.location.origin}/auth/callback?source=signup&next=/dashboard`,
//         queryParams: {
//           access_type: 'offline',
//           prompt: 'consent'
//         }
//       },
//     });

//     if (error) {
//       console.error('Google OAuth error:', error);
//       toast.error(error.message || 'Failed to sign up with Google');
//       setIsSigningup(false);
//     } else {
//       console.log('Google OAuth initiated successfully for signup');
//       // Don't set loading to false - let redirect handle it
//       // The callback route will check if user is new and redirect appropriately
//     }
//   } catch (error: any) {
//     console.error('Unexpected error:', error);
//     toast.error('Something went wrong');
//     setIsSigningup(false);
//   }
// };

  const selectLanguage = (languageName: string) => {
    setCurrentLanguage(languageName);
    setShowLanguageDropdown(false);
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
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  return (
    <div className='flex w-full flex-row-reverse md:h-screen bg-gray-900 text-white'>
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
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757901059/Junior_Bookkeeper_Finance_Associate_ifwrdq.jpg'
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
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
          >
            <Globe className="h-5 w-5" />
            <span>{currentLanguage}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showLanguageDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-20 w-40">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => selectLanguage(language.name)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-white"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="w-full max-w-md px-4 pt-[90px] overflow-y-auto md:pt-8 scrollbar-hide">
          <h1 className='text-3xl font-bold mb-2 text-center text-white'>{t.welcome}</h1>
          <p className='mb-6 text-gray-300 text-center'>{t.subtitle}</p>

          {/* Toggle */}
          <div className="w-full mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSignupMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  signupMethod === 'email' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {getTranslation('signUpWithEmail', 'Email')}
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  signupMethod === 'phone' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {getTranslation('signUpWithPhone', 'Phone')}
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
              {/* Business Name + Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    onBlur={(e) => validateBusinessName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.business_name ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder={t.businessName}
                    required
                  />
                  {formErrors.business_name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.business_name}</p>
                  )}
                  {isValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="animate-spin h-4 w-4 text-emerald-400" />
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder={t.name}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
              </div>

              {/* Email or Phone */}
              {signupMethod === 'email' ? (
                <div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder={t.email}
                    required
                  />
                  {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-3 py-2 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder={t.phonePlaceholder || "+1 234 567 8900"}
                    required
                    maxLength={20}
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                  <p className="text-xs text-gray-400">
                    {t.phoneFormatHint || "Enter your full international phone number with country code"}
                    <br />
                    <span className="text-emerald-400">Examples: +1 234 567 8900, +44 7911 123456</span>
                  </p>
                </div>
              )}

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
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
                  {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.confirm_password ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder={t.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  {formErrors.confirm_password && <p className="text-red-400 text-xs mt-1">{formErrors.confirm_password}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningup}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                {isSigningup ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    {getTranslation('creatingAccount', 'Creating Account...')}
                  </>
                ) : (
                  signupMethod === 'email' ? t.createAccount : getTranslation('createAccountWithPhone', 'Sign up with Phone')
                )}
              </button>

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">{t.orContinue}</span>
                </div>
              </div> */}

              {/* <button
                type="button"
                onClick={signUpWithGoogle}
                disabled={isSigningup}
                className="w-full flex justify-center items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="none" />
                  <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
                  <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
                  <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
                  <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
                </svg>
                {t.signUpWithGoogle}
              </button> */}

              <div className="text-center text-sm text-gray-400 pt-2">
                {t.haveAccount}{' '}
                <Link href="/auth/signin" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  {t.signin}
                </Link>
              </div>
            </form>
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