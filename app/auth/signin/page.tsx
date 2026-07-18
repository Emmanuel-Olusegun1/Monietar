'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { Toaster, toast } from 'react-hot-toast';
import {
  Loader2,
  Eye,
  EyeOff,
  Globe,
  ChevronDown,
} from 'lucide-react';

import {
  translations,
  languages,
} from './signintranslations';

import { createClient } from '@/lib/supabase/client';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function Signin() {
  const router = useRouter();

  const supabase = createClient();

  const [isSigningIn, setIsSigningIn] =
    useState(false);

  const [currentLanguage, setCurrentLanguage] =
    useState('English');

  const [
    showLanguageDropdown,
    setShowLanguageDropdown,
  ] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [signinMethod, setSigninMethod] =
    useState<'email' | 'phone'>('email');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const t =
    translations[
      currentLanguage
        .toLowerCase()
        .substring(
          0,
          2
        ) as keyof typeof translations
    ] || translations.en;

  const getTranslation = (
    key: string,
    fallback: string
  ) => {
    return (t as any)[key] || fallback;
  };

  /**
   * Redirect if already authenticated
   */
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (session) {
        router.replace('/dashboard/overview');
      }
    };

    checkSession();
  }, [router]);

  /**
   * Keep auth state synchronized
   */
  useEffect(() => {
    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (event) => {
          if (event === 'SIGNED_IN') {
            router.replace('/dashboard/overview');
            router.refresh();
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setIsSigningIn(true);

    const loadingToast =
      toast.loading(
        signinMethod === 'email'
          ? 'Signing in...'
          : 'Sending code...'
      );

    try {
      if (signinMethod === 'email') {
        const {
          data,
          error,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                formData.email.trim(),
              password:
                formData.password,
            }
          );

        if (error) {
          toast.error(
            error.message.includes(
              'Invalid login credentials'
            )
              ? 'Invalid email or password'
              : error.message.includes(
                    'Email not confirmed'
                  )
                ? 'Please verify your email first'
                : error.message
          );

          return;
        }
        

        if (!data.session) {
          toast.error(
            'Unable to establish session.'
          );
          return;
        }

        toast.success(
          t.thankYou ||
            'Welcome back!'
        );

        router.replace('/dashboard/overview');
      } else {
        let phone =
          formData.phone.replace(
            /\s/g,
            ''
          );

        if (!phone.startsWith('+')) {
          toast.error(
            'Please include country code (e.g. +234)'
          );
          return;
        }

        const { error } =
          await supabase.auth.signInWithOtp(
            {
              phone,
            }
          );

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success(
          'Verification code sent to your phone!'
        );

        setTimeout(() => {
          router.push(
            `/auth/verify-phone?phone=${encodeURIComponent(
              phone
            )}`
          );
        }, 1500);
      }
    } catch {
      toast.error(
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsSigningIn(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleForgotPassword = () => {
    if (signinMethod !== 'email') {
      toast.error(
        'Please use email to reset your password'
      );
      return;
    }

    if (!formData.email) {
      router.push(
        '/auth/forgot-password'
      );
    } else {
      router.push(
        `/auth/forgot-password?email=${encodeURIComponent(
          formData.email
        )}`
      );
    }
  };

  const formatPhoneNumber = (
    value: string
  ) => {
    const cleaned =
      value.replace(
        /[^\d+\s]/g,
        ''
      );

    if (!cleaned.startsWith('+'))
      return (
        '+' +
        cleaned.replace(
          /[^\d]/g,
          ''
        )
      );

    const num = cleaned
      .slice(1)
      .replace(/\D/g, '');

    if (num.length <= 3)
      return '+' + num;

    if (num.length <= 6)
      return `+${num.slice(
        0,
        3
      )} ${num.slice(3)}`;

    if (num.length <= 9)
      return `+${num.slice(
        0,
        3
      )} ${num.slice(
        3,
        6
      )} ${num.slice(6)}`;

    return `+${num.slice(
      0,
      3
    )} ${num.slice(
      3,
      6
    )} ${num.slice(
      6,
      10
    )} ${num.slice(10)}`;
  };

  const handlePhoneChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      phone:
        formatPhoneNumber(
          e.target.value
        ),
    });
  };

  return (
   <div
  className={`flex w-full flex-row-reverse md:h-screen bg-[#f1f1f1] text-slate-700 antialiased selection:bg-emerald-500/20 selection:text-emerald-700 ${poppins.className}`}
>
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#ffffff',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
      },
      success: {
        duration: 3000,
        iconTheme: {
          primary: '#059669',
          secondary: '#fff',
        },
      },
      error: {
        duration: 5000,
        iconTheme: {
          primary: '#dc2626',
          secondary: '#fff',
        },
      },
      loading: {
        duration: Infinity,
        iconTheme: {
          primary: '#2563eb',
          secondary: '#fff',
        },
      },
    }}
  />

  {/* Hero Panel */}

  <div className="relative hidden h-screen flex-1 overflow-hidden bg-slate-900 md:block">
    <Image
      src="https://res.cloudinary.com/dzibfknxq/image/upload/v1757900862/Finance_Automation_And_Its_Critical_Role_In_Streamlining_Financial_Processes_-_OPEN_Money_Blog_ihfxxe.jpg"
      alt="SME Cashflow Automation Engine"
      fill
      className="object-cover opacity-80 mix-blend-luminosity"
      priority
    />

    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20" />

    <div className="absolute bottom-16 left-16 right-16 z-10 max-w-xl text-white">
      <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight lg:text-4xl">
        Track sales, profits, and cash flow.
        Automatically.
      </h2>

      <p className="text-sm font-medium leading-relaxed text-slate-300 lg:text-base">
        Connect bank transfers, cash sales and
        cross-border currency flows into one
        intelligent ledger so your business runs
        on clear numbers instead of manual math.
      </p>
    </div>
  </div>

  {/* Right Side */}

  <div className="relative flex h-screen flex-1 flex-col items-center justify-center border-l border-slate-100 bg-white p-6">

    {/* Language */}

    <div className="absolute right-6 top-6 z-10">
      <button
        type="button"
        onClick={() =>
          setShowLanguageDropdown(
            !showLanguageDropdown
          )
        }
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800"
      >
        <Globe className="h-4 w-4 text-slate-400" />

        <span>{currentLanguage}</span>

        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${
            showLanguageDropdown
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      {showLanguageDropdown && (
        <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setCurrentLanguage(
                  language.name
                );

                setShowLanguageDropdown(
                  false
                );
              }}
              className="block w-full rounded-lg px-4 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-600"
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Form */}

    <div className="scrollbar-hide flex w-full max-w-md flex-col justify-center overflow-y-auto px-2 pt-[60px] md:pt-0">

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
          {t.welcome}
        </h1>

        <p className="px-4 text-sm font-medium text-slate-500">
          {t.subtitle}
        </p>
      </div>

      {/* Sign In Method */}

      <div className="mb-6 w-full">
        <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1.5">

          <button
            type="button"
            onClick={() =>
              setSigninMethod('email')
            }
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              signinMethod === 'email'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.signInWithEmail ??
              'Use Email'}
          </button>

          <button
            type="button"
            onClick={() =>
              setSigninMethod('phone')
            }
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              signinMethod === 'phone'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.signInWithPhone ??
              'Use Phone'}
          </button>

        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email */}

{signinMethod === 'email' ? (
  <div>
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
      Email Address
    </label>

    <input
      type="email"
      id="email"
      value={formData.email}
      onChange={handleChange}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      placeholder="merchant@company.com"
      required
    />
  </div>
) : (
  <div className="space-y-2">
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
      Phone Number
    </label>

    <input
      type="tel"
      id="phone"
      value={formData.phone}
      onChange={handlePhoneChange}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      placeholder="+234..."
      required
      maxLength={20}
    />

    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs font-medium leading-relaxed text-slate-500">
      Enter your international phone number.

      <div className="mt-1 font-semibold text-emerald-600">
        Example:
        +234 Nigeria • +229 Benin • +233 Ghana
      </div>
    </div>
  </div>
)}

{/* Password */}

{signinMethod === 'email' && (
  <div>
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
      Password
    </label>

    <div className="relative">
      <input
        id="password"
        type={
          showPassword
            ? 'text'
            : 'password'
        }
        value={formData.password}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        placeholder="••••••••"
        required
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword(
            !showPassword
          )
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
      >
        {showPassword ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </button>
    </div>
  </div>
)}

{/* Forgot Password */}

{signinMethod === 'email' && (
  <div className="text-right">
    <button
      type="button"
      onClick={handleForgotPassword}
      className="text-xs font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
    >
      {(t as any)
        .forgotPassword ??
        'Forgot password?'}
    </button>
  </div>
)}

{/* Submit */}

<button
  type="submit"
  disabled={isSigningIn}
  className="mt-2 flex w-full items-center justify-center gap-3 rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
>
  {isSigningIn ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />

      <span>
        {signinMethod === 'email'
          ? 'Signing in...'
          : 'Sending code...'}
      </span>
    </>
  ) : signinMethod ===
    'email' ? (
    t.signin ??
    'Sign In'
  ) : (
    getTranslation(
      'createAccountWithPhone',
      'Send Code'
    )
  )}
</button>

</form>

{/* Signup */}

<div className="mt-6 text-center text-xs font-medium text-slate-500">
  {t.dontHaveAccount}{' '}

  <Link
    href="/auth/signup"
    className="font-bold text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
  >
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