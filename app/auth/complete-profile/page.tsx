// app/auth/complete-profile/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Building2,
  Loader2,
  Phone,
  User,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';

type FormData = {
  business_name: string;
  name: string;
  phone: string;
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    name: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          toast.error('Please sign in first.');
          router.replace('/auth/signin');
          return;
        }

        setUserEmail(user.email || '');

        const userMeta = user.user_metadata || {};

        const hasProfileData = Boolean(
          userMeta.business_name || userMeta.name
        );

        setIsNewUser(!hasProfileData);

        setFormData({
          business_name: userMeta.business_name || '',
          name:
            userMeta.name ||
            userMeta.full_name ||
            userMeta.given_name ||
            user.email?.split('@')[0] ||
            '',
          phone: userMeta.phone || '',
        });
      } catch (error) {
        console.error('Error initializing profile:', error);

        toast.error('Failed to load your profile.');
        router.replace('/auth/signin');
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, [router, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const businessName = formData.business_name.trim();
    const name = formData.name.trim();
    const phone = formData.phone.trim();

    if (!businessName) {
      toast.error('Business name is required.');
      return;
    }

    if (!name) {
      toast.error('Your name is required.');
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading(
      isNewUser ? 'Completing your profile...' : 'Updating your profile...'
    );

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          business_name: businessName,
          name,
          phone,
          completed_profile: true,
          profile_completed_at: new Date().toISOString(),
        },
      });

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      toast.success(
        isNewUser
          ? 'Profile completed successfully.'
          : 'Profile updated successfully.'
      );

      router.replace('/dashboard/overview');
    } catch (error) {
      console.error('Profile update error:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update your profile.'
      );
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleSkip = () => {
    toast('You can complete your profile later from settings.');
    router.replace('/dashboard/overview');
  };

  if (initializing) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f1f1f1]">
        <Header />

        <main className="flex flex-1 items-center justify-center px-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
            Loading your account...
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900">
      <Header />

      <main className="flex-1 bg-[#f1f1f1] px-5 pt-30 md:pt-0 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="mb-7 text-center">
           <div className="hidden mx-auto mb-3 md:flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              {isNewUser
                ? 'Complete Your Profile'
                : 'Update Your Profile'}
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {isNewUser
                ? 'Add a few details so we can personalize your Monietar experience.'
                : 'Keep your Monietar profile information up to date.'}
            </p>

            {userEmail && (
              <p className="mt-3 text-xs text-gray-400">
                Signed in as{' '}
                <span className="font-medium text-gray-600">
                  {userEmail}
                </span>
              </p>
            )}
          </div>

          <div className="border border-gray-200 bg-white p-5 sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="business_name"
                  className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700"
                >
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  Business Name
                </label>

                <input
                  id="business_name"
                  name="business_name"
                  type="text"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  autoComplete="organization"
                  autoFocus
                  required
                  disabled={loading}
                  className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  This can appear on your invoices and financial reports.
                </p>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700"
                >
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  Your Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700"
                >
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  Phone Number
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                  disabled={loading}
                  className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Used for important account notifications.
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isNewUser ? 'Completing...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      {isNewUser
                        ? 'Complete Profile'
                        : 'Save Changes'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {isNewUser && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={loading}
                    className="mt-2.5 w-full cursor-pointer border border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </form>
          </div>

          {isNewUser && (
            <div className="mt-5 border border-emerald-100 bg-emerald-50/50 p-3.5">
              <p className="text-center text-xs leading-5 text-gray-500">
                Complete your profile to keep your business information
                organized across Monietar.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-gray-400">
            The Cash Flow Operating System
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
