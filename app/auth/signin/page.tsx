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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = translations[currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations] || translations.en;

  // Handle OAuth callback and store user in database
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      if (code) {
        setIsSigningIn(true);
        toast.loading('Completing sign in...');
        
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }

          const user = data.user;
          if (user) {
            // Store or update user in database via API
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email!.split('@')[0],
                business_name: user.user_metadata?.business_name || '',
              }),
            });

            if (!response.ok) {
              console.error('Failed to create user record');
            }

            toast.success(t.thankYou || 'Welcome back!');
            router.push('/dashboard');
          }
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
  }, [searchParams, router, t.thankYou]);

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
      const { email, password } = formData;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session && data.user) {
        // Store or update user in database via API
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
            business_name: data.user.user_metadata?.business_name || '',
          }),
        });

        if (!response.ok) {
          console.error('Failed to update user record');
        }

        toast.success(t.thankYou || 'Welcome back!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsSigningIn(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleGoogleSignin = async () => {
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
      console.error('Google signin error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
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
      <div className='flex-1 relative hidden md:block'>
        <Image
           src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg'
           alt='cashflow image'
           fill
          className='object-cover'
          priority
        />
      </div>
      
      {/* The main and form section */}
      <div className='flex-1 flex flex-col justify-center items-center p-4 overflow-auto max-h-screen relative'>
        {/* Language Switcher - Top Right */}
        <div className="absolute top-4 left-4">
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

        <h1 className='text-3极l font-bold mb-3'>{t.welcome}</h1>
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
            
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center hover:cursor-pointer justify-center mb-4"
            >
              {isSigningIn ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 极 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.signingIn}
                </>
              ) : (
                t.signin
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
              onClick={handleGoogleSignin}
              disabled={isSigningIn}
              className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/s极" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6极16-4.53z"/>
              </svg>
              {t.signInWithGoogle}
            </button>

            <div className="text-center text-sm text-gray-600">
              {t.dontHaveAccount}{' '}
              <Link href="/auth/signup" className="text-emerald-500 hover:text-emerald-600 font-medium">
                {t.createAccount}
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Signin() {
  return (
    <div className="flex-row-reverse">
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
    
      <SigninContent />
     
    </Suspense>
    </div>
  );
}