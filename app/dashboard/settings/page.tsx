'use client';

import { useState } from 'react';
import {
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
} from 'lucide-react';

type SettingsSection =
  | 'profile'
  | 'business'
  | 'preferences'
  | 'notifications'
  | 'security'
  | 'connections'
  | 'plan';

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

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('profile');

  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Emmanuel',
    lastName: 'Olusegun',
    email: 'emmanuel@example.com',
    phone: '+234 800 000 0000',
  });

  const [business, setBusiness] = useState({
    name: 'My Business',
    type: 'Retail',
    country: 'Nigeria',
    currency: 'NGN',
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    weekStarts: 'Monday',
  });

  const [notifications, setNotifications] = useState({
    transactions: true,
    lowStock: true,
    cashFlow: true,
    weeklyReport: true,
    productUpdates: false,
  });

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSettings
            profile={profile}
            setProfile={setProfile}
          />
        );

      case 'business':
        return (
          <BusinessSettings
            business={business}
            setBusiness={setBusiness}
          />
        );

      case 'preferences':
        return (
          <PreferencesSettings
            preferences={preferences}
            setPreferences={setPreferences}
          />
        );

      case 'notifications':
        return (
          <NotificationSettings
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );

      case 'security':
        return <SecuritySettings />;

      case 'connections':
        return <ConnectionSettings />;

      case 'plan':
        return <PlanSettings />;

      default:
        return null;
    }
  };

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
                Manage your account, business information, preferences,
                connections, and Monietar plan.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="flex w-fit items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Changes saved' : 'Save changes'}
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Settings navigation */}
          <aside>
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Settings
                </p>
              </div>

              <nav className="p-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`mb-1 flex w-full items-center gap-3 border px-3 py-3 text-left transition ${
                        active
                          ? 'border-emerald-900 bg-emerald-900 text-white'
                          : 'border-transparent text-gray-700 hover:border-gray-200 hover:bg-[#f1f1f1]'
                      }`}
                    >
                      <Icon size={17} className="shrink-0" />

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

                      {active && <ChevronRight size={15} />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Help */}
            <div className="mt-4 border border-gray-200 bg-white p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center bg-gray-100">
                <HelpCircle size={17} className="text-gray-700" />
              </div>

              <h3 className="text-sm font-semibold">
                Need help?
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Find answers or contact the Monietar support team.
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
            {renderSection()}
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
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  setProfile: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }>
  >;
}) {
  return (
    <SettingsPanel
      eyebrow="Personal"
      title="Profile"
      description="Keep your personal account information up to date."
    >
      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="flex h-16 w-16 items-center justify-center bg-emerald-900 text-xl font-semibold text-white">
          EO
        </div>

        <div>
          <p className="font-semibold">
            {profile.firstName} {profile.lastName}
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

        <InputField
          label="Email address"
          type="email"
          value={profile.email}
          onChange={(value) =>
            setProfile((current) => ({
              ...current,
              email: value,
            }))
          }
        />

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
  business: {
    name: string;
    type: string;
    country: string;
    currency: string;
  };
  setBusiness: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      country: string;
      currency: string;
    }>
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
          options={['Nigeria', 'Benin', 'Togo', 'Côte d’Ivoire']}
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
              Your business information helps Monietar organise your
              financial activity, reports, currency settings, and
              business insights correctly.
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
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    weekStarts: string;
  };
  setPreferences: React.Dispatch<
    React.SetStateAction<{
      language: string;
      timezone: string;
      dateFormat: string;
      weekStarts: string;
    }>
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
          options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
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
  notifications: {
    transactions: boolean;
    lowStock: boolean;
    cashFlow: boolean;
    weeklyReport: boolean;
    productUpdates: boolean;
  };
  setNotifications: React.Dispatch<
    React.SetStateAction<{
      transactions: boolean;
      lowStock: boolean;
      cashFlow: boolean;
      weeklyReport: boolean;
      productUpdates: boolean;
    }>
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
              <p className="text-sm font-medium">{item.title}</p>

              <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
                {item.description}
              </p>
            </div>

            <Toggle
              enabled={notifications[item.key]}
              onChange={() =>
                setNotifications((current) => ({
                  ...current,
                  [item.key]: !current[item.key],
                }))
              }
            />
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Security                                                                   */
/* -------------------------------------------------------------------------- */

function SecuritySettings() {
  return (
    <SettingsPanel
      eyebrow="Security"
      title="Account security"
      description="Protect your Monietar account and financial information."
    >
      <div className="space-y-3">
        <ActionRow
          icon={KeyRound}
          title="Change password"
          description="Update your account password."
          action="Change"
        />

        <ActionRow
          icon={ShieldCheck}
          title="Two-factor authentication"
          description="Add another layer of protection to your account."
          action="Set up"
        />

        <ActionRow
          icon={Smartphone}
          title="Active sessions"
          description="Review devices currently signed in to your account."
          action="Review"
        />
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
              Monietar uses secure authentication and controlled access
              to protect your account.
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
              Retail Starter connection limit
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Your current plan supports one connected merchant bank
              account and up to 500 automatically logged bank
              transactions monthly.
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
/* Plan                                                                        */
/* -------------------------------------------------------------------------- */

function PlanSettings() {
  return (
    <SettingsPanel
      eyebrow="Subscription"
      title="Plan & billing"
      description="Review your current Monietar plan and usage limits."
    >
      <div className="border border-emerald-900 bg-emerald-900 p-6 text-white">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Current plan
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Retail Starter
            </h2>

            <p className="mt-2 text-sm text-white/70">
              A real Monietar workspace for getting started.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-semibold">₦0</p>
            <p className="text-xs text-white/60">per month</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Plan usage
        </p>

        <div className="space-y-4">
          <UsageRow
            label="Automatic transactions"
            used="327"
            limit="500"
            percentage={65}
          />

          <UsageRow
            label="Connected bank accounts"
            used="0"
            limit="1"
            percentage={0}
          />

          <UsageRow
            label="Manual bookkeeping entries"
            used="Unlimited"
            limit="Unlimited"
            percentage={0}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex flex-col gap-4 border border-gray-200 bg-[#f1f1f1] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">
              Need more capacity?
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Unlock deeper automation, more connected accounts, and
              advanced financial intelligence.
            </p>
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center justify-center gap-2 bg-emerald-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            Compare plans
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
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

      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-gray-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
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
        <Icon size={15} className="text-gray-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>

        <p
          className={`mt-0.5 truncate text-sm font-medium ${
            positive ? 'text-emerald-900' : 'text-gray-900'
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
}: {
  icon: typeof User;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-900"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-100">
        <Icon size={17} className="text-gray-700" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-900">
        {action}
        <ChevronRight size={14} />
      </span>
    </button>
  );
}

function UsageRow({
  label,
  used,
  limit,
  percentage,
}: {
  label: string;
  used: string;
  limit: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium">{label}</p>

        <p className="text-xs text-gray-500">
          {used} / {limit}
        </p>
      </div>

      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-emerald-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}