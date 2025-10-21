'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations, languages } from './signuptranslations';
import { supabase } from '@/lib/supabase/client';
import { Toaster, toast } from 'react-hot-toast';

// Mock data for testing
const MOCK_DATA = {
  business_names: {
    'Tech Corp': { available: false, message: 'Business name already taken' },
    'Startup Inc': { available: false, message: 'Business name already taken' },
    'Monietar Solutions': { available: true }
  },
  users: {
    'existing@monietar.com': { exists: true, message: 'User already registered' },
    'test@monietar.com': { exists: false }
  },
  phones: {
    '+2349012345678': { exists: true, message: 'Phone number already registered' },
    '+2349076543210': { exists: false }
  }
};

// Type definitions for mock data
type BusinessData = { available: boolean; message?: string };
type UserData = { exists: boolean; message?: string };
type PhoneData = { exists: boolean; message?: string };

// API service for signup
const signupAPI = {
  async signUpWithEmail(email: string, password: string, userData: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - check if user exists
    const existingUser = MOCK_DATA.users[email as keyof typeof MOCK_DATA.users] as UserData | undefined;
    if (existingUser?.exists) {
      throw new Error(existingUser.message || 'User already registered');
    }
    
    // Mock successful signup
    return {
      user: {
        id: 'mock-user-' + Date.now(),
        email: email,
        user_metadata: {
          business_name: userData.business_name,
          name: userData.name
        }
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    };
    
    // REAL API CALL - COMMENTED OUT
    /*
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        business_name: userData.business_name,
        name: userData.name,
        signup_method: 'email'
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Signup failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error('Invalid response from server');
    }
    */
  },

  async signUpWithPhone(phone: string, password: string, userData: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - check if phone exists
    const existingPhone = MOCK_DATA.phones[phone as keyof typeof MOCK_DATA.phones] as PhoneData | undefined;
    if (existingPhone?.exists) {
      throw new Error(existingPhone.message || 'Phone number already registered');
    }
    
    // Mock successful phone signup
    return {
      user: {
        id: 'mock-phone-user-' + Date.now(),
        phone: phone,
        user_metadata: {
          business_name: userData.business_name,
          name: userData.name
        }
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    };
    
    // REAL API CALL - COMMENTED OUT
    /*
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone.replace(/\s/g, ''),
        password,
        business_name: userData.business_name,
        name: userData.name,
        signup_method: 'phone'
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Phone signup failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error('Invalid response from server');
    }
    */
  },

  async signUpWithGoogle() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Google OAuth URL
    return '/auth/google/callback';
    
    // REAL API CALL - COMMENTED OUT
    /*
    const response = await fetch('/api/auth/oauth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Google signup failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(responseText);
      return data.redirectUrl;
    } catch {
      throw new Error('Invalid response from server');
    }
    */
  },

  async validateBusinessName(businessName: string): Promise<{ available: boolean; message?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock business name validation
    const normalizedBusinessName = businessName.trim().toLowerCase();
    const existingBusiness = Object.keys(MOCK_DATA.business_names).find(
      name => name.toLowerCase() === normalizedBusinessName
    );
    
    if (existingBusiness) {
      const businessData = MOCK_DATA.business_names[existingBusiness as keyof typeof MOCK_DATA.business_names] as BusinessData;
      return {
        available: false,
        message: businessData.message || 'Business name is not available'
      };
    }
    
    // Mock available business name
    return { available: true };
    
    // REAL API CALL - COMMENTED OUT
    /*
    const response = await fetch('/api/auth/validate-business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ business_name: businessName }),
    });

    if (!response.ok) {
      throw new Error('Validation service unavailable');
    }

    return await response.json();
    */
  }
};

function SignupContent() {
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

  // Type-safe translation access with fallbacks
  const getTranslation = (key: string, fallback: string) => {
    const translation = (t as any)[key];
    return translation || fallback;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Business name validation
    if (!formData.business_name.trim()) {
      errors.business_name = getTranslation('businessNameRequired', 'Business name is required');
    } else if (formData.business_name.length < 2) {
      errors.business_name = 'Business name must be at least 2 characters';
    }

    // Name validation
    if (!formData.name.trim()) {
      errors.name = getTranslation('nameRequired', 'Full name is required');
    } else if (formData.name.length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    // Email/Phone validation based on method
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

    // Password validation
    if (!formData.password) {
      errors.password = getTranslation('passwordRequired', 'Password is required');
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    // Confirm password validation
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
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Validate business name availability
  const validateBusinessName = async (businessName: string) => {
    if (businessName.length < 2) return;
    
    setIsValidating(true);
    try {
      const result = await signupAPI.validateBusinessName(businessName);
      if (!result.available) {
        setFormErrors(prev => ({
          ...prev,
          business_name: result.message || 'Business name is not available'
        }));
      }
    } catch (error) {
      console.error('Business name validation error:', error);
      // Don't show error to user for validation service failure
    } finally {
      setIsValidating(false);
    }
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
      let result;
      
      if (signupMethod === 'email') {
        // Try API first, fallback to direct Supabase
        try {
          result = await signupAPI.signUpWithEmail(
            formData.email, 
            formData.password, 
            { business_name: formData.business_name, name: formData.name }
          );
        } catch (apiError: any) {
          console.log('API signup failed, trying direct Supabase:', apiError);
          // Fallback to direct Supabase auth
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

          if (authError) throw authError;
          result = authData;
        }

        if (result?.user) {
          toast.success(getTranslation('thankYou', 'Account created successfully! Check your email for verification.'));
          
          setTimeout(() => {
            toast.loading('Redirecting to dashboard...');
          }, 2000);
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 4000);
        }
      } else {
        // Phone signup
        const phoneNumber = formData.phone.replace(/\s/g, '');
        
        try {
          result = await signupAPI.signUpWithPhone(
            phoneNumber,
            formData.password,
            { business_name: formData.business_name, name: formData.name }
          );
        } catch (apiError: any) {
          console.log('API phone signup failed, trying direct Supabase:', apiError);
          // Fallback to direct Supabase auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            phone: phoneNumber,
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

          if (authError) throw authError;
          result = authData;
        }

        if (result?.user) {
          toast.success(getTranslation('verifyPhone', 'Verification code sent to your phone!'));
          
          setTimeout(() => {
            toast.loading('Redirecting to verification...');
            return
          }, 1000);
          
          setTimeout(() => {
            router.push('/auth/verify-phone');
          }, 4000);
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // User-friendly error messages
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email/phone already exists');
      } else if (error.message.includes('Invalid email')) {
        toast.error('Please enter a valid email address');
      } else if (error.message.includes('Password')) {
        toast.error('Password does not meet requirements');
      } else if (error.message.includes('phone')) {
        toast.error('Please enter a valid phone number');
      } else if (error.message.includes('rate limit')) {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error(error.message || 'An error occurred during signup. Please try again.');
      }
    } finally {
      setIsSigningup(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsSigningup(true);
      
      // Try API first, fallback to direct Supabase
      try {
        const redirectUrl = await signupAPI.signUpWithGoogle();
        toast.loading('Redirecting to Google...');
        window.location.href = redirectUrl;
      } catch (apiError: any) {
        console.log('API Google signup failed, trying direct Supabase:', apiError);
        // Fallback to direct Supabase OAuth
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
      }
      
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'An error occurred during Google signup');
      setIsSigningup(false);
    }
  };

  const selectLanguage = (languageCode: string, languageName: string) => {
    setCurrentLanguage(languageName);
    setShowLanguageDropdown(false);
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
    
    if (formErrors.phone) {
      setFormErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='flex w-full flex-row-reverse md:h-screen bg-gray-900 text-white'>
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
          src='https://res.cloudinary.com/dzibfknxq/image/upload/v1757901059/Junior_Bookkeeper_Finance_Associate_ifwrdq.jpg'
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
        <div className="absolute top-4 left-4 z-10">
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
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-20 w-40">
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
        <div className="w-full max-w-md px-4 pt-[90px] overflow-y-auto md:pt-8 scrollbar-hide">
          <h1 className='text-3xl font-bold mb-2 text-center text-white'>{t.welcome}</h1>
          <p className='mb-6 text-gray-300 text-center'>{t.subtitle}</p>

          {/* Signup Method Toggle */}
          <div className="w-full mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSignupMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signupMethod === 'email'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {getTranslation('signUpWithEmail', 'Email')}
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${
                  signupMethod === 'phone'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
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
              {/* Business Name and Full Name side by side */}
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
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
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
              
              {/* Email/Phone Field */}
              {signupMethod === 'email' ? (
                <div className="relative">
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
                  {formErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
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
                    {formErrors.phone && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {t.phoneFormatHint || "Enter your full international phone number with country code"}
                    <br />
                    <span className="text-emerald-400">Examples: +1 234 567 8900, +44 7911 123456</span>
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
                    className={`w-full px-3 py-2 pr-10 rounded-sm border-b focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder-gray-300 bg-gray-800 text-white ${
                      formErrors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder={t.password}
                    required
                    minLength={6}
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
                  {formErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
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
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute hover:cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
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
                  {formErrors.confirm_password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.confirm_password}</p>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSigningup}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center hover:cursor-pointer justify-center"
              >
                {isSigningup ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {getTranslation('creatingAccount', 'Creating Account...')}
                  </>
                ) : (
                  signupMethod === 'email' ? t.createAccount : getTranslation('createAccountWithPhone', 'Sign up with Phone')
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
                onClick={handleGoogleSignup}
                disabled={isSigningup}
                className="w-full flex hover:cursor-pointer justify-center items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
export default function Signup() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}