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
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    email: '',
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

    const loadingToast = toast.loading('Creating your account...');

    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            business_name: formData.business_name,
            name: formData.name,
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. If signup successful, try to create user record in your database
      if (authData.user) {
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: authData.user.id,
              email: formData.email,
              business_name: formData.business_name,
              name: formData.name,
            }),
          });

          if (!response.ok) {
            console.error('Failed to create user record in database:', await response.text());
          }

          toast.success(t.thankYou);
          
          // Show redirect notification after a short delay
          setTimeout(() => {
            toast.loading('Redirecting to dashboard...');
          }, 1500);
          
          // Redirect to dashboard after a longer delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } catch (dbError) {
          console.error('Database error:', dbError);
          toast.success(t.thankYou);
          
          // Show redirect notification after a short delay
          setTimeout(() => {
            toast.loading('Redirecting to dashboard...');
          }, 1500);
          
          // Still redirect to dashboard since auth was successful
          setTimeout(() => {
            router.push('/dashboard');
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

  return (
    <div className='flex w-full h-screen'>
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
      <div className='flex-1 relative hidden md:block shadow-lg'>
        <Image
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757901059/Junior_Bookkeeper_Finance_Associate_ifwrdq.jpg'
          alt='cashflow image'
          fill
          className='object-cover rounded-md'
          priority
        />
      </div>
      
      {/* The main and form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 overflow-auto max-h-screen relative'>
        {/* Language Switcher - Top Right */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100"
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
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 w-40">
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

        <h1 className='text-3xl font-bold mb-3'>{t.welcome}</h1>
        <p className='mb-8 text-gray-600'>{t.subtitle}</p>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleSubmit} className="">
            <div className="mb-6">
             <input
                type="text"
                id="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder-gray-400"
                placeholder={t.businessName}
                required
              />
            </div>
            
            <div className="mb-6">
             <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                placeholder={t.name}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                placeholder={t.email}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                placeholder={t.password}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                id="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm border-b border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-400"
                placeholder={t.confirmPassword}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSigningup}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center hover:cursor-pointer justify-center mb-4"
            >
              {isSigningup ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0极5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.creatingAccount}
                </>
              ) : (
                t.createAccount
              )}
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t.orContinue}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSigningup}
              className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26极5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64极3.15-3.15C17.45 2.09 14.97 1 极12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.极4c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t.signUpWithGoogle}
            </button>

            <div className="text-center text-sm text-gray-600">
              {t.haveAccount}{' '}
              <Link href="/auth/signin" className="text-emerald-500 hover:text-emerald-600 font-medium">
                {t.signin}
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}