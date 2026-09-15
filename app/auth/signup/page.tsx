'use client';

import { useMemo, useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Globe2,
  Loader2,
  User,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { translations, languages } from './signuptranslations';
import { createClient } from '@/lib/supabase/client';

export default function Signup() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isSigningup, setIsSigningup] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>(
    'email'
  );

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

  const t =
    translations[
      currentLanguage.toLowerCase().substring(0, 2) as keyof typeof translations
    ] || translations.en;

  const getTranslation = (key: string, fallback: string) => {
    return (t as any)[key] || fallback;
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace('/dashboard/overview');
      }
    };

    checkSession();
  }, [router, supabase]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.business_name.trim()) {
      errors.business_name = getTranslation(
        'businessNameRequired',
        'Business name is required'
      );
    } else if (formData.business_name.trim().length < 2) {
      errors.business_name =
        'Business name must be at least 2 characters';
    }

    if (!formData.name.trim()) {
      errors.name = getTranslation(
        'nameRequired',
        'Full name is required'
      );
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    if (signupMethod === 'email') {
      if (!formData.email.trim()) {
        errors.email = getTranslation(
          'emailRequired',
          'Email is required'
        );
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        errors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone.trim()) {
        errors.phone = getTranslation(
          'phoneRequired',
          'Phone number is required'
        );
      } else if (!formData.phone.trim().startsWith('+')) {
        errors.phone =
          'Please include country code (e.g., +234)';
      } else if (
        formData.phone.replace(/\s/g, '').length < 8
      ) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password) {
      errors.password = getTranslation(
        'passwordRequired',
        'Password is required'
      );
    } else if (formData.password.length < 6) {
      errors.password =
        'Password must be at least 6 characters';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    ) {
      errors.password =
        'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirm_password) {
      errors.confirm_password =
        'Please confirm your password';
    } else if (
      formData.password !== formData.confirm_password
    ) {
      errors.confirm_password = getTranslation(
        'passwordsDoNotMatch',
        "Passwords don't match"
      );
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));

    if (formErrors[id]) {
      setFormErrors((previous) => ({
        ...previous,
        [id]: '',
      }));
    }
  };

  const validateBusinessName = async (businessName: string) => {
    if (businessName.trim().length < 2) return;

    setIsValidating(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsValidating(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSigningup) return;

    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSigningup(true);

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
          if (
            error.message
              .toLowerCase()
              .includes('already registered')
          ) {
            toast.error(
              'An account with this email already exists.'
            );
          } else if (
            error.message
              .toLowerCase()
              .includes('password should be')
          ) {
            toast.error('Password is too weak.');
          } else {
            toast.error(error.message);
          }

          return;
        }

        if (data.user && !data.user.identities?.length) {
          toast.error('Email already registered.');
          return;
        }

        toast.success(
          'Account created! Check your email for verification.'
        );

        setTimeout(() => {
          router.push('/auth/signin');
        }, 2500);
      } else {
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
          if (
            error.message
              .toLowerCase()
              .includes('already registered')
          ) {
            toast.error('Phone number already registered.');
          } else {
            toast.error(error.message);
          }

          return;
        }

        toast.success(
          'Verification code sent to your phone.'
        );

        setTimeout(() => {
          router.push(
            `/auth/verify-phone?phone=${encodeURIComponent(phone)}`
          );
        }, 1800);
      }
    } catch (error) {
      console.error('Signup error:', error);

      toast.error(
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsSigningup(false);
    }
  };

  const selectLanguage = (languageName: string) => {
    setCurrentLanguage(languageName);
    setShowLanguageDropdown(false);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+\s]/g, '');

    if (!cleaned.startsWith('+')) {
      return '+' + cleaned.replace(/[^\d]/g, '');
    }

    const num = cleaned.slice(1).replace(/\D/g, '');

    if (num.length <= 3) {
      return '+' + num;
    }

    if (num.length <= 6) {
      return `+${num.slice(0, 3)} ${num.slice(3)}`;
    }

    if (num.length <= 10) {
      return `+${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
    }

    return `+${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(
      6,
      10
    )} ${num.slice(10)}`;
  };

  const handlePhoneChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatPhoneNumber(e.target.value);

    setFormData((previous) => ({
      ...previous,
      phone: formatted,
    }));

    if (formErrors.phone) {
      setFormErrors((previous) => ({
        ...previous,
        phone: '',
      }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 pt-30 md:pt-0 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: 'easeOut',
            }}
          >
            {/* Intro */}
            <div className="mb-7 text-center">
              <div className=" hidden mx-auto mb-3 md:flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>

              <h1 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] text-gray-950 sm:text-[2.2rem]">
                {getTranslation(
                  'welcome',
                  'Create your Monietar account'
                )}
              </h1>

              <p className="mx-auto mt-3 max-w-[390px] text-[13px] leading-6 text-gray-500">
                Start automating your daily sales, profit, and
                cash-flow tracking in one workspace.
              </p>
            </div>

            {/* Form */}
            <div className="border border-gray-200 bg-white p-5 sm:p-7">
              {/* Signup method */}
              <div className="mb-6 grid grid-cols-2 border border-gray-200 p-1">
                <button
                  type="button"
                  disabled={isSigningup}
                  onClick={() => setSignupMethod('email')}
                  className={`h-10 px-3 text-xs font-medium transition ${
                    signupMethod === 'email'
                      ? 'bg-gray-950 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  } ${
                    isSigningup
                      ? 'cursor-not-allowed opacity-60'
                      : ''
                  }`}
                >
                  {getTranslation(
                    'signUpWithEmail',
                    'Use Email'
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSigningup}
                  onClick={() => setSignupMethod('phone')}
                  className={`h-10 px-3 text-xs font-medium transition ${
                    signupMethod === 'phone'
                      ? 'bg-gray-950 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  } ${
                    isSigningup
                      ? 'cursor-not-allowed opacity-60'
                      : ''
                  }`}
                >
                  {getTranslation(
                    'signUpWithPhone',
                    'Use Phone'
                  )}
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Business + Name */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Business name */}
                    <div className="relative">
                      <label
                        htmlFor="business_name"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        {t.businessName}
                      </label>

                      <input
                        type="text"
                        id="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        onBlur={(e) =>
                          validateBusinessName(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Alata Retail Ltd"
                        autoComplete="organization"
                        disabled={isSigningup}
                        className={`h-12 w-full border bg-[#fafafa] px-4 pr-10 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          formErrors.business_name
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-emerald-900'
                        } ${
                          isSigningup
                            ? 'cursor-not-allowed opacity-60'
                            : ''
                        }`}
                      />

                      {isValidating && (
                        <div className="absolute right-3 top-[34px]">
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-900" />
                        </div>
                      )}

                      {formErrors.business_name && (
                        <p className="mt-1.5 text-[11px] leading-4 text-red-500">
                          {formErrors.business_name}
                        </p>
                      )}
                    </div>

                    {/* Full name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        {t.name}
                      </label>

                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full name"
                        autoComplete="name"
                        disabled={isSigningup}
                        className={`h-12 w-full border bg-[#fafafa] px-4 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          formErrors.name
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-emerald-900'
                        } ${
                          isSigningup
                            ? 'cursor-not-allowed opacity-60'
                            : ''
                        }`}
                      />

                      {formErrors.name && (
                        <p className="mt-1.5 text-[11px] leading-4 text-red-500">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email / Phone */}
                  {signupMethod === 'email' ? (
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        {t.email}
                      </label>

                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="merchant@company.com"
                        autoComplete="email"
                        disabled={isSigningup}
                        className={`h-12 w-full border bg-[#fafafa] px-4 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          formErrors.email
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-emerald-900'
                        } ${
                          isSigningup
                            ? 'cursor-not-allowed opacity-60'
                            : ''
                        }`}
                      />

                      {formErrors.email && (
                        <p className="mt-1.5 text-[11px] leading-4 text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        Phone
                      </label>

                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder={
                          t.phonePlaceholder || '+234 ...'
                        }
                        autoComplete="tel"
                        disabled={isSigningup}
                        maxLength={20}
                        className={`h-12 w-full border bg-[#fafafa] px-4 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          formErrors.phone
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-emerald-900'
                        } ${
                          isSigningup
                            ? 'cursor-not-allowed opacity-60'
                            : ''
                        }`}
                      />

                      {formErrors.phone && (
                        <p className="mt-1.5 text-[11px] leading-4 text-red-500">
                          {formErrors.phone}
                        </p>
                      )}

                      <p className="mt-2 text-[11px] leading-5 text-gray-400">
                        {t.phoneFormatHint ||
                          'Use your active phone number with country code for account verification.'}
                      </p>
                    </div>
                  )}

                  {/* Password + Confirm password */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        {t.password}
                      </label>

                      <div className="relative">
                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          disabled={isSigningup}
                          className={`h-12 w-full border bg-[#fafafa] px-4 pr-12 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                            formErrors.password
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-gray-200 focus:border-emerald-900'
                          } ${
                            isSigningup
                              ? 'cursor-not-allowed opacity-60'
                              : ''
                          }`}
                        />

                        <button
                          type="button"
                          disabled={isSigningup}
                          onClick={() =>
                            setShowPassword(
                              (previous) => !previous
                            )
                          }
                          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-gray-400 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {formErrors.password && (
                        <p className="mt-1.5 text-[11px] leading-4 text-red-500">
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label
                        htmlFor="confirm_password"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        {t.confirmPassword}
                      </label>

                      <div className="relative">
                        <input
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          id="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          disabled={isSigningup}
                          className={`h-12 w-full border bg-[#fafafa] px-4 pr-12 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                            formErrors.confirm_password
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-gray-200 focus:border-emerald-900'
                          } ${
                            isSigningup
                              ? 'cursor-not-allowed opacity-60'
                              : ''
                          }`}
                        />

                        <button
                          type="button"
                          disabled={isSigningup}
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-gray-400 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {formErrors.confirm_password && (
                        <p className="mt-1.5 text-[11px] leading-4 text-red-500">
                          {formErrors.confirm_password}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSigningup}
                    className="group flex h-12 w-full items-center justify-between bg-emerald-900 px-4 text-[13px] font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>
                      {isSigningup
                        ? getTranslation(
                            'creatingAccount',
                            'Creating your account...'
                          )
                        : signupMethod === 'email'
                          ? t.createAccount
                          : getTranslation(
                              'createAccountWithPhone',
                              'Create account with phone'
                            )}
                    </span>

                    {isSigningup ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>

                {/* Already have an account */}
                <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                  <p className="text-xs leading-5 text-gray-500">
                    Already using Monietar?{' '}
                    <Link
                      href="/auth/signin"
                      className="font-medium text-emerald-900 transition hover:underline"
                    >
                      Sign in to workspace
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Language */}
            <div className="relative mt-6 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setShowLanguageDropdown(
                    (previous) => !previous
                  )
                }
                className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-gray-900"
              >
                <Globe2 className="h-3.5 w-3.5 shrink-0" />

                <span>{currentLanguage}</span>

                <ArrowRight
                  className={`h-3 w-3 shrink-0 transition-transform ${
                    showLanguageDropdown
                      ? 'rotate-90'
                      : ''
                  }`}
                />
              </button>

              {showLanguageDropdown && (
                <div className="absolute bottom-full z-20 mb-2 w-40 border border-gray-200 bg-white py-1 shadow-sm">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() =>
                        selectLanguage(language.name)
                      }
                      className={`flex w-full items-center px-3 py-2 text-left text-xs transition hover:bg-gray-50 ${
                        currentLanguage === language.name
                          ? 'font-medium text-emerald-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-5 text-center text-[9px] font-medium uppercase leading-4 tracking-[0.16em] text-gray-400">
              The Cash Flow Operating System
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
