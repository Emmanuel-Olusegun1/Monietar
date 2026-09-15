'use client';

import { useEffect, useMemo, useState } from 'react';
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

import { translations, languages } from './signintranslations';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [language, setLanguage] = useState('en');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const t =
    translations[language as keyof typeof translations] ||
    translations.en;

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

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Signed in successfully.');

      router.replace('/dashboard/overview');
    } catch (error) {
      console.error('Email sign-in error:', error);

      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = phone.trim().startsWith('+')
        ? phone.trim()
        : `+${phone.trim()}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Verification code sent.');

      router.push(
        `/auth/verify-phone?phone=${encodeURIComponent(formattedPhone)}`
      );
    } catch (error) {
      console.error('Phone sign-in error:', error);

      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (loginMethod === 'email') {
      await handleEmailLogin();
    } else {
      await handlePhoneLogin();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 pt-30 md:pt-0 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[440px]">
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
                {t.welcome}
              </h1>

              <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-6 text-gray-500">
                {t.subtitle}
              </p>
            </div>

            {/* Form */}
            <div className="border border-gray-200 bg-white p-5 sm:p-7">
              {/* Login method */}
              <div className="mb-6 grid grid-cols-2 border border-gray-200 p-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!loading) {
                      setLoginMethod('email');
                    }
                  }}
                  disabled={loading}
                  className={`h-10 px-3 text-xs font-medium transition ${
                    loginMethod === 'email'
                      ? 'bg-gray-950 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  } ${
                    loading
                      ? 'cursor-not-allowed opacity-70'
                      : ''
                  }`}
                >
                  {t.signInWithEmail}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!loading) {
                      setLoginMethod('phone');
                    }
                  }}
                  disabled={loading}
                  className={`h-10 px-3 text-xs font-medium transition ${
                    loginMethod === 'phone'
                      ? 'bg-gray-950 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  } ${
                    loading
                      ? 'cursor-not-allowed opacity-70'
                      : ''
                  }`}
                >
                  {t.signInWithPhone}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {loginMethod === 'email' ? (
                  <>
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        {t.email}
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        disabled={loading}
                        className="h-12 w-full border border-gray-200 bg-[#fafafa] px-4 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <label
                          htmlFor="password"
                          className="block text-xs font-medium leading-4 text-gray-700"
                        >
                          {t.password}
                        </label>

                        <Link
                          href="/auth/forgot-password"
                          className="shrink-0 text-[11px] font-medium text-emerald-900 transition hover:underline"
                        >
                          {t.forgotPassword}
                        </Link>
                      </div>

                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          disabled={loading}
                          className="h-12 w-full border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (previous) => !previous
                            )
                          }
                          disabled={loading}
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
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-12 w-full items-center justify-between bg-emerald-900 px-4 text-[13px] font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>
                        {loading ? 'Signing in...' : t.signin}
                      </span>

                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-medium leading-4 text-gray-700"
                      >
                        Phone
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        placeholder={t.phonePlaceholder}
                        autoComplete="tel"
                        disabled={loading}
                        className="h-12 w-full border border-gray-200 bg-[#fafafa] px-4 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <p className="mt-2 text-[11px] leading-5 text-gray-400">
                        {t.phoneFormatHint}
                      </p>
                    </div>

                    {/* Phone submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-12 w-full items-center justify-between bg-emerald-900 px-4 text-[13px] font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>
                        {loading ? 'Sending...' : t.sendCode}
                      </span>

                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </>
                )}
              </form>

              {/* Don't have an account */}
              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <p className="text-xs leading-5 text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-emerald-900 transition hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            {/* Language */}
            <div className="relative mt-6 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setShowLanguages(
                    (previous) => !previous
                  )
                }
                className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-gray-900"
              >
                <Globe2 className="h-3.5 w-3.5 shrink-0" />

                <span>
                  {languages.find(
                    (item) => item.code === language
                  )?.name || 'English'}
                </span>

                <ArrowRight
                  className={`h-3 w-3 shrink-0 transition-transform ${
                    showLanguages ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showLanguages && (
                <div className="absolute bottom-full z-20 mb-2 w-40 border border-gray-200 bg-white py-1 shadow-sm">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setShowLanguages(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-xs transition hover:bg-gray-50 ${
                        language === item.code
                          ? 'font-medium text-emerald-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.name}
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
