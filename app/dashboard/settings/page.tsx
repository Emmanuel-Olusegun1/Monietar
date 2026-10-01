'use client';

import {
  AlertCircle,
  Bell,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  Globe2,
  HelpCircle,
  KeyRound,
  Lock,
  Mail,
  Monitor,
  Save,
  ShieldCheck,
  Smartphone,
  User,
  WalletCards,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';

type SettingsSection =
  | 'profile'
  | 'business'
  | 'preferences'
  | 'notifications'
  | 'security'
  | 'connections'
  | 'plan';

type Plan =
  | 'retail-starter'
  | 'growing-merchant'
  | 'borderless-pro';

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BusinessState {
  name: string;
  type: string;
  country: string;
  currency: string;
}

interface PreferencesState {
  language: string;
  timezone: string;
  dateFormat: string;
  weekStarts: string;
}

interface NotificationsState {
  transactions: boolean;
  lowStock: boolean;
  cashFlow: boolean;
  weeklyReport: boolean;
  productUpdates: boolean;
}

interface SettingsMetadata {
  phone?: string;
  business?: Partial<BusinessState>;
  preferences?: Partial<PreferencesState>;
  notifications?: Partial<NotificationsState>;
}

const sections: {
  id: SettingsSection;
  label: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    id: 'profile',
    label: 'Profile',
    description: 'Your personal information',
    icon: User,
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Business details and identity',
    icon: Building2,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'How Monietar works for you',
    icon: Monitor,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Alerts and activity updates',
    icon: Bell,
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Account protection',
    icon: ShieldCheck,
  },
  {
    id: 'connections',
    label: 'Connected accounts',
    description: 'Bank and financial connections',
    icon: WalletCards,
  },
  {
    id: 'plan',
    label: 'Plan & billing',
    description: 'Your Monietar subscription',
    icon: CreditCard,
  },
];

function normalizePlan(value: unknown): Plan {
  if (
    value === 'growing-merchant' ||
    value === 'borderless-pro'
  ) {
    return value;
  }

  return 'retail-starter';
}

function getPlanName(plan: Plan) {
  switch (plan) {
    case 'growing-merchant':
      return 'Growing Merchant';

    case 'borderless-pro':
      return 'Borderless Pro';

    default:
      return 'Retail Starter';
  }
}

export default function SettingsPage() {
  const [supabase] = useState(() =>
    createClient(),
  );

  const [activeSection, setActiveSection] =
    useState<SettingsSection>('profile');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [currentPlan, setCurrentPlan] =
    useState<Plan>('retail-starter');

  const [profile, setProfile] =
    useState<ProfileState>({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });

  const [business, setBusiness] =
    useState<BusinessState>({
      name: '',
      type: 'Retail',
      country: 'Nigeria',
      currency: 'NGN',
    });

  const [preferences, setPreferences] =
    useState<PreferencesState>({
      language: 'English',
      timezone: 'Africa/Lagos',
      dateFormat: 'DD/MM/YYYY',
      weekStarts: 'Monday',
    });

  const [notifications, setNotifications] =
    useState<NotificationsState>({
      transactions: true,
      lowStock: true,
      cashFlow: true,
      weeklyReport: true,
      productUpdates: false,
    });

  const loadSettings = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setError(
            'Your session could not be found. Please sign in again.',
          );
          return;
        }

        const metadata =
          (user.user_metadata ??
            {}) as SettingsMetadata & {
            first_name?: string;
            last_name?: string;
            name?: string;
            subscription_plan?: string;
            plan?: string;
          };

        const metadataName =
          metadata.name?.trim() ?? '';

        const firstName =
          metadata.first_name?.trim() ||
          (metadataName
            ? metadataName.split(' ')[0]
            : '');

        const lastName =
          metadata.last_name?.trim() ||
          (metadataName
            ? metadataName
                .split(' ')
                .slice(1)
                .join(' ')
            : '');

        setProfile({
          firstName,
          lastName,
          email: user.email ?? '',
          phone:
            metadata.phone?.trim() ?? '',
        });

        setBusiness({
          name:
            metadata.business?.name?.trim() ??
            '',
          type:
            metadata.business?.type ??
            'Retail',
          country:
            metadata.business?.country ??
            'Nigeria',
          currency:
            metadata.business?.currency ??
            'NGN',
        });

        setPreferences({
          language:
            metadata.preferences?.language ??
            'English',
          timezone:
            metadata.preferences?.timezone ??
            'Africa/Lagos',
          dateFormat:
            metadata.preferences?.dateFormat ??
            'DD/MM/YYYY',
          weekStarts:
            metadata.preferences?.weekStarts ??
            'Monday',
        });

        setNotifications({
          transactions:
            metadata.notifications
              ?.transactions ??
            true,
          lowStock:
            metadata.notifications?.lowStock ??
            true,
          cashFlow:
            metadata.notifications?.cashFlow ??
            true,
          weeklyReport:
            metadata.notifications
              ?.weeklyReport ??
            true,
          productUpdates:
            metadata.notifications
              ?.productUpdates ??
            false,
        });

        setCurrentPlan(
          normalizePlan(
            metadata.subscription_plan ??
              metadata.plan,
          ),
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load your settings.',
        );
      } finally {
        setLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          'Your session has expired. Please sign in again.',
        );
      }

      const existingMetadata =
        user.user_metadata ?? {};

      const displayName = [
        profile.firstName.trim(),
        profile.lastName.trim(),
      ]
        .filter(Boolean)
        .join(' ');

      const nextMetadata = {
        ...existingMetadata,

        name:
          displayName ||
          existingMetadata.name ||
          undefined,

        first_name:
          profile.firstName.trim(),

        last_name:
          profile.lastName.trim(),

        phone:
          profile.phone.trim(),

        business: {
          ...(existingMetadata.business ??
            {}),
          ...business,
        },

        preferences: {
          ...(existingMetadata.preferences ??
            {}),
          ...preferences,
        },

        notifications: {
          ...(existingMetadata.notifications ??
            {}),
          ...notifications,
        },
      };

      const { error: updateError } =
        await supabase.auth.updateUser({
          data: nextMetadata,
        });

      if (updateError) {
        throw updateError;
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to save your settings.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f1f1f1] text-gray-900">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center px-5 sm:px-8 lg:px-10">
          <div className="text-sm text-gray-400">
            Loading your settings...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f1f1] text-gray-900">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Page header */}
        <section className="mb-8 border-b border-gray-200 pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
            Account / Settings
          </p>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Manage your account, business
                information, preferences,
                connections, and Monietar plan.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex w-fit items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saved ? (
                <Check size={16} />
              ) : (
                <Save size={16} />
              )}

              {saving
                ? 'Saving...'
                : saved
                  ? 'Changes saved'
                  : 'Save changes'}
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Settings navigation */}
          <aside className="lg:self-start">
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Settings
                </p>
              </div>

              <nav className="p-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active =
                    activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id,
                        )
                      }
                      className={`mb-1 flex w-full items-center gap-3 border px-3 py-3 text-left transition ${
                        active
                          ? 'border-emerald-900 bg-emerald-900 text-white'
                          : 'border-transparent text-gray-700 hover:border-gray-200 hover:bg-[#f1f1f1]'
                      }`}
                    >
                      <Icon
                        size={17}
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">
                          {section.label}
                        </span>

                        <span
                          className={`mt-0.5 block truncate text-xs ${
                            active
                              ? 'text-white/65'
                              : 'text-gray-500'
                          }`}
                        >
                          {section.description}
                        </span>
                      </span>

                      {active && (
                        <ChevronRight
                          size={15}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Help */}
            <div className="mt-4 border border-gray-200 bg-white p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center bg-gray-100">
                <HelpCircle
                  size={17}
                  className="text-gray-700"
                />
              </div>

              <h3 className="text-sm font-semibold">
                Need help?
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Find answers or contact the
                Monietar support team.
              </p>

              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-900 hover:underline"
              >
                Visit Help Centre
                <ChevronRight size={13} />
              </button>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            {activeSection === 'profile' && (
              <ProfileSettings
                profile={profile}
                setProfile={setProfile}
              />
            )}

            {activeSection === 'business' && (
              <BusinessSettings
                business={business}
                setBusiness={setBusiness}
              />
            )}

            {activeSection ===
              'preferences' && (
              <PreferencesSettings
                preferences={preferences}
                setPreferences={
                  setPreferences
                }
              />
            )}

            {activeSection ===
              'notifications' && (
              <NotificationSettings
                notifications={
                  notifications
                }
                setNotifications={
                  setNotifications
                }
              />
            )}

            {activeSection === 'security' && (
              <SecuritySettings
                supabase={supabase}
                setError={setError}
              />
            )}

            {activeSection ===
              'connections' && (
              <ConnectionSettings />
            )}

            {activeSection === 'plan' && (
              <PlanSettings
                currentPlan={currentPlan}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

function ProfileSettings({
  profile,
  setProfile,
}: {
  profile: ProfileState;
  setProfile: React.Dispatch<
    React.SetStateAction<ProfileState>
  >;
}) {
  const initials =
    `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
      .trim()
      .toUpperCase() || 'M';

  return (
    <SettingsPanel
      eyebrow="Personal"
      title="Profile"
      description="Keep your personal account information up to date."
    >
      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="flex h-16 w-16 items-center justify-center bg-emerald-900 text-xl font-semibold text-white">
          {initials}
        </div>

        <div>
          <p className="font-semibold">
            {profile.firstName ||
            profile.lastName
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : 'Monietar account'}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Monietar account owner
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="First name"
          value={profile.firstName}
          onChange={(value) =>
            setProfile((current) => ({
              ...current,
              firstName: value,
            }))
          }
        />

        <InputField
          label="Last name"
          value={profile.lastName}
          onChange={(value) =>
            setProfile((current) => ({
              ...current,
              lastName: value,
            }))
          }
        />

        <div>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-gray-600">
              Email address
            </span>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500 outline-none"
            />
          </label>

          <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
            Your login email is managed by your
            authentication account.
          </p>
        </div>

        <InputField
          label="Phone number"
          value={profile.phone}
          onChange={(value) =>
            setProfile((current) => ({
              ...current,
              phone: value,
            }))
          }
        />
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Account identity
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoRow
            icon={Mail}
            label="Email verification"
            value="Verified"
            positive
          />

          <InfoRow
            icon={User}
            label="Account role"
            value="Owner"
          />
        </div>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Business                                                                   */
/* -------------------------------------------------------------------------- */

function BusinessSettings({
  business,
  setBusiness,
}: {
  business: BusinessState;
  setBusiness: React.Dispatch<
    React.SetStateAction<BusinessState>
  >;
}) {
  return (
    <SettingsPanel
      eyebrow="Business"
      title="Business information"
      description="Tell Monietar about the business behind your financial activity."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <InputField
            label="Business name"
            value={business.name}
            onChange={(value) =>
              setBusiness((current) => ({
                ...current,
                name: value,
              }))
            }
            placeholder="Enter your business name"
          />
        </div>

        <SelectField
          label="Business type"
          value={business.type}
          options={[
            'Retail',
            'Wholesale',
            'Services',
            'Manufacturing',
            'Other',
          ]}
          onChange={(value) =>
            setBusiness((current) => ({
              ...current,
              type: value,
            }))
          }
        />

        <SelectField
          label="Country"
          value={business.country}
          options={[
            'Nigeria',
            'Benin',
            'Togo',
            'Côte d’Ivoire',
          ]}
          onChange={(value) =>
            setBusiness((current) => ({
              ...current,
              country: value,
            }))
          }
        />

        <SelectField
          label="Primary currency"
          value={business.currency}
          options={['NGN', 'XOF']}
          onChange={(value) =>
            setBusiness((current) => ({
              ...current,
              currency: value,
            }))
          }
        />
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100">
            <Building2 size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Why this matters
            </p>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Your business information helps
              Monietar organise your financial
              activity, reports, currency
              settings, and business insights
              correctly.
            </p>
          </div>
        </div>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Preferences                                                                */
/* -------------------------------------------------------------------------- */

function PreferencesSettings({
  preferences,
  setPreferences,
}: {
  preferences: PreferencesState;
  setPreferences: React.Dispatch<
    React.SetStateAction<PreferencesState>
  >;
}) {
  return (
    <SettingsPanel
      eyebrow="Preferences"
      title="Workspace preferences"
      description="Control how dates, times, and information appear across Monietar."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Language"
          value={preferences.language}
          options={['English']}
          onChange={(value) =>
            setPreferences((current) => ({
              ...current,
              language: value,
            }))
          }
        />

        <SelectField
          label="Timezone"
          value={preferences.timezone}
          options={[
            'Africa/Lagos',
            'Africa/Porto-Novo',
            'Africa/Lome',
            'Africa/Abidjan',
          ]}
          onChange={(value) =>
            setPreferences((current) => ({
              ...current,
              timezone: value,
            }))
          }
        />

        <SelectField
          label="Date format"
          value={preferences.dateFormat}
          options={[
            'DD/MM/YYYY',
            'MM/DD/YYYY',
            'YYYY-MM-DD',
          ]}
          onChange={(value) =>
            setPreferences((current) => ({
              ...current,
              dateFormat: value,
            }))
          }
        />

        <SelectField
          label="Week starts on"
          value={preferences.weekStarts}
          options={['Monday', 'Sunday']}
          onChange={(value) =>
            setPreferences((current) => ({
              ...current,
              weekStarts: value,
            }))
          }
        />
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <InfoRow
          icon={Globe2}
          label="Regional settings"
          value={preferences.timezone}
        />
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                              */
/* -------------------------------------------------------------------------- */

function NotificationSettings({
  notifications,
  setNotifications,
}: {
  notifications: NotificationsState;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationsState>
  >;
}) {
  const notificationItems = [
    {
      key: 'transactions' as const,
      title: 'Transaction activity',
      description:
        'Get notified when connected accounts record new activity.',
    },
    {
      key: 'lowStock' as const,
      title: 'Low stock alerts',
      description:
        'Know when products reach their configured stock threshold.',
    },
    {
      key: 'cashFlow' as const,
      title: 'Cash flow alerts',
      description:
        'Receive important alerts about unusual cash movement.',
    },
    {
      key: 'weeklyReport' as const,
      title: 'Weekly financial summary',
      description:
        'Receive a weekly summary of your business performance.',
    },
    {
      key: 'productUpdates' as const,
      title: 'Product updates',
      description:
        'Hear about new Monietar features and improvements.',
    },
  ];

  return (
    <SettingsPanel
      eyebrow="Notifications"
      title="Notifications"
      description="Choose which updates Monietar should send you."
    >
      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-5 py-5"
          >
            <div>
              <p className="text-sm font-medium">
                {item.title}
              </p>

              <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
                {item.description}
              </p>
            </div>

            <Toggle
              enabled={notifications[item.key]}
              onChange={() =>
                setNotifications((current) => ({
                  ...current,
                  [item.key]:
                    !current[item.key],
                }))
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs leading-5 text-gray-500">
          Your notification preferences are saved to
          your Monietar account. Actual email or
          in-app delivery depends on the notification
          service configured for your workspace.
        </p>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Security                                                                   */
/* -------------------------------------------------------------------------- */

function SecuritySettings({
  supabase,
  setError,
}: {
  supabase: ReturnType<typeof createClient>;
  setError: (value: string | null) => void;
}) {
  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState<string | null>(null);

  const [signingOutOthers, setSigningOutOthers] =
    useState(false);

  const handlePasswordChange = async () => {
    setError(null);
    setPasswordMessage(null);

    if (password.length < 8) {
      setError(
        'Your new password must contain at least 8 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'Your new passwords do not match.',
      );
      return;
    }

    setChangingPassword(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);

      setPasswordMessage(
        'Your password has been updated.',
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to update your password.',
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOutOthers = async () => {
    setError(null);
    setSigningOutOthers(true);

    try {
      const { error: signOutError } =
        await supabase.auth.signOut({
          scope: 'others',
        });

      if (signOutError) {
        throw signOutError;
      }

      setPasswordMessage(
        'Other active sessions have been signed out.',
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to sign out other sessions.',
      );
    } finally {
      setSigningOutOthers(false);
    }
  };

  return (
    <SettingsPanel
      eyebrow="Security"
      title="Account security"
      description="Protect your Monietar account and financial information."
    >
      {passwordMessage && (
        <div className="mb-5 flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-4">
          <Check
            size={16}
            className="mt-0.5 shrink-0 text-emerald-800"
          />

          <p className="text-sm text-emerald-800">
            {passwordMessage}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() =>
            setShowPasswordForm(
              (current) => !current,
            )
          }
          className="flex w-full items-center gap-4 border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-900"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-100">
            <KeyRound
              size={17}
              className="text-gray-700"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              Change password
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Update your account password.
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-900">
            {showPasswordForm
              ? 'Close'
              : 'Change'}
            <ChevronRight size={14} />
          </span>
        </button>

        {showPasswordForm && (
          <div className="border border-gray-200 bg-gray-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                label="New password"
                value={password}
                onChange={setPassword}
              />

              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="flex items-center gap-2 bg-emerald-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPassword
                  ? 'Updating...'
                  : 'Update password'}
              </button>
            </div>
          </div>
        )}

        <ActionRow
          icon={ShieldCheck}
          title="Two-factor authentication"
          description="Add another layer of protection to your account."
          action="Coming soon"
          disabled
        />

        <button
          type="button"
          onClick={handleSignOutOthers}
          disabled={signingOutOthers}
          className="flex w-full items-center gap-4 border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-100">
            <Smartphone
              size={17}
              className="text-gray-700"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              Active sessions
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Sign out other devices currently
              signed in to your account.
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-900">
            {signingOutOthers
              ? 'Signing out...'
              : 'Sign out others'}
            <ChevronRight size={14} />
          </span>
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex gap-3 border border-emerald-200 bg-emerald-50 p-4">
          <Lock
            size={17}
            className="mt-0.5 shrink-0 text-emerald-900"
          />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Your account is protected
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-800/80">
              Monietar uses secure authentication and
              controlled access to protect your account.
            </p>
          </div>
        </div>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Connections                                                                */
/* -------------------------------------------------------------------------- */

function ConnectionSettings() {
  return (
    <SettingsPanel
      eyebrow="Financial connections"
      title="Connected accounts"
      description="Manage the financial accounts connected to Monietar."
    >
      <div className="mb-6 border border-gray-200 bg-[#f1f1f1] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white">
            <WalletCards size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Retail Starter connection
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Retail Starter supports one connected
              merchant bank account. Connect your
              account when you're ready to bring
              transaction activity into Monietar.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 bg-white">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-emerald-900 text-white">
              <Building2 size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Merchant bank account
              </p>

              <p className="mt-1 text-xs text-gray-500">
                No account connected
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-emerald-900 px-4 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
          >
            Connect account
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Other financial activity
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoRow
            icon={WalletCards}
            label="Physical cash"
            value="Managed through Cash Vault"
          />

          <InfoRow
            icon={CreditCard}
            label="Manual bookkeeping"
            value="Available"
          />
        </div>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Plan                                                                       */
/* -------------------------------------------------------------------------- */

function PlanSettings({
  currentPlan,
}: {
  currentPlan: Plan;
}) {
  const planName =
    getPlanName(currentPlan);

  const isStarter =
    currentPlan === 'retail-starter';

  return (
    <SettingsPanel
      eyebrow="Subscription"
      title="Plan & billing"
      description="Review your current Monietar plan and available features."
    >
      <div className="border border-emerald-900 bg-emerald-900 p-6 text-white">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Current plan
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {planName}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {isStarter
                ? 'The essential Monietar workspace for getting started.'
                : 'Your active Monietar workspace plan.'}
            </p>
          </div>

          <div className="text-left sm:text-right">
            {isStarter ? (
              <>
                <p className="text-2xl font-semibold">
                  ₦0
                </p>

                <p className="text-xs text-white/60">
                  per month
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-white/80">
                Active
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Included with your plan
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <PlanFeature
            title="Product catalogue"
            description="Record your products and basic product information."
          />

          <PlanFeature
            title="Manual stock management"
            description="Add and adjust physical stock quantities yourself."
          />

          <PlanFeature
            title="Sales summaries"
            description="Track your recorded sales activity."
          />

          <PlanFeature
            title="Cash Vault"
            description="Record and manage physical cash activity."
          />
        </div>
      </div>

      {isStarter && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="border border-gray-200 bg-[#f1f1f1] p-5">
            <p className="text-sm font-semibold">
              When you're ready to grow
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Growing Merchant adds deeper automation,
              analytics, automated inventory tracking,
              and other advanced financial intelligence
              features.
            </p>

            <button
              type="button"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-900 hover:underline"
            >
              Compare plans
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared components                                                          */
/* -------------------------------------------------------------------------- */

function SettingsPanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-gray-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-900"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-gray-600">
        {label}
      </span>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-900"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-gray-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-900"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative h-6 w-11 shrink-0 border transition ${
        enabled
          ? 'border-emerald-900 bg-emerald-900'
          : 'border-gray-300 bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 bg-white transition ${
          enabled ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  positive = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border border-gray-200 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-gray-100">
        <Icon
          size={15}
          className="text-gray-600"
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-sm font-medium ${
            positive
              ? 'text-emerald-900'
              : 'text-gray-900'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  title,
  description,
  action,
  disabled = false,
}: {
  icon: typeof User;
  title: string;
  description: string;
  action: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex w-full items-center gap-4 border border-gray-200 bg-white p-5 text-left transition ${
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'hover:border-emerald-900'
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-100">
        <Icon
          size={17}
          className="text-gray-700"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-900">
        {action}
        {!disabled && (
          <ChevronRight size={14} />
        )}
      </span>
    </button>
  );
}

function PlanFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-emerald-50 text-emerald-800">
          <Check size={14} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}