'use client'

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Download, Trash2, Bell, Key, LogOut, ChevronRight, User,
  Shield, Database, MessageSquare, Mail, Send, CreditCard, Settings as SettingsIcon, // CHANGED: Renamed this import
  Building, FileText, Lock, HelpCircle, Loader2, CheckCircle
} from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { useSettings, Settings as SettingsType } from '@/contexts/SettingsContext'; // CHANGED: Renamed this import
import { CURRENCIES, LANGUAGES, DEFAULT_SETTINGS } from '@/app/utils/constants';

interface SettingsPageProps {
  handleExportData: () => void;
  setShowChangePasswordDialog: (show: boolean) => void;
  setShowClearDataDialog: (show: boolean) => void;
  setShowDeleteAccountDialog: (show: boolean) => void;
  setShowRestoreDialog: (show: boolean) => void;
  handleBackupData: () => void;
  darkMode: boolean;
  themeClasses: any;
  user: any;
}

// Profile Section
const ProfileSection = memo(function ProfileSection({
  localSettings,
  updateSetting,
  darkMode,
  themeClasses,
  user
}: any) {
  const [profileData, setProfileData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: ''
  });

  // Fetch user profile on mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const { data, error } = await supabase
        .from('users')
        .select('name, business_name, email, phone')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          await createUserProfile();
        }
      } else if (data) {
        setProfileData(data);
        setOriginalData(data);
        setHasUnsavedChanges(false);
        updateSetting('profile.fullName', data.name);
        updateSetting('profile.businessName', data.business_name);
        updateSetting('profile.phoneNumber', data.phone);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async () => {
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          business_name: `Business-${user.id.slice(0, 8)}`,
          email: user.email,
          phone: null
        })
        .select()
        .single();
      
      if (!error && data) {
        setProfileData(data);
        setOriginalData(data);
        setHasUnsavedChanges(false);
        updateSetting('profile.fullName', data.name);
        updateSetting('profile.businessName', data.business_name);
        updateSetting('profile.phoneNumber', data.phone);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSaveAll = async () => {
    if (!hasUnsavedChanges || !user?.id) return;
    
    try {
      setSaving(true);
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const updateData: any = {};
      if (profileData.name !== originalData.name) updateData.name = profileData.name;
      if (profileData.business_name !== originalData.business_name) updateData.business_name = profileData.business_name;
      if (profileData.phone !== originalData.phone) updateData.phone = profileData.phone || null;
      
      if (Object.keys(updateData).length === 0) {
        setHasUnsavedChanges(false);
        return;
      }
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) {
        if (error.code === '23505') {
          if (error.message.includes('business_name_unique')) {
            alert('Business name is already taken. Please choose another.');
          } else if (error.message.includes('users_phone_key')) {
            alert('Phone number is already registered. Please use a different number.');
          }
          setProfileData(originalData);
          throw error;
        }
        throw error;
      }
      
      setOriginalData(profileData);
      setHasUnsavedChanges(false);
      updateSetting('profile.fullName', profileData.name);
      updateSetting('profile.businessName', profileData.business_name);
      updateSetting('profile.phoneNumber', profileData.phone);
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Check if any field has changed
    const hasChanges = 
      (field === 'name' && value !== originalData.name) ||
      (field === 'business_name' && value !== originalData.business_name) ||
      (field === 'phone' && value !== originalData.phone);
    
    setHasUnsavedChanges(hasChanges);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Profile Information</h3>
          <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Profile Information</h3>
            <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Manage your personal and business details</p>
          </div>
          
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                saving
                  ? 'bg-emerald-400 text-white cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Full Name *</label>
            <input
              type="text"
              value={profileData.name}
              onChange={handleChange('name')}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Email Address *</label>
            <input
              type="email"
              value={user?.email || profileData.email || ''}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-not-allowed ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your email"
              disabled
            />
            <p className={`text-xs mt-2 ${themeClasses.text.muted}`}>Email can't be changed</p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-5 h-5 text-emerald-500" />
            <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Business Information</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Business Name *</label>
              <input
                type="text"
                value={profileData.business_name}
                onChange={handleChange('business_name')}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Phone Number</label>
              <input
                type="tel"
                value={profileData.phone || ''}
                onChange={handleChange('phone')}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="+234 123 456 7890"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Preferences Section
const PreferencesSection = memo(function PreferencesSection({
  localSettings,
  updateSetting,
  darkMode,
  themeClasses
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Preferences</h3>
        <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Customize your financial dashboard experience</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Primary Currency *</label>
            <select
              value={localSettings.currency || DEFAULT_SETTINGS.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
            <p className={`text-xs mt-2 ${themeClasses.text.muted}`}>Used for all financial calculations</p>
          </div>
          
          <div>
            <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Language</label>
            <select
              value={localSettings.language || DEFAULT_SETTINGS.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Date Format</label>
            <select
              value={localSettings.dateFormat || DEFAULT_SETTINGS.dateFormat}
              onChange={(e) => updateSetting('dateFormat', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>Time Zone</label>
            <select
              value={localSettings.timezone || DEFAULT_SETTINGS.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="UTC">UTC</option>
              <option value="Africa/Lagos">West Africa Time (WAT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
              <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h4 className={`text-lg font-semibold mb-6 ${themeClasses.text.primary}`}>Dashboard Preferences</h4>
        <div className="space-y-4">
          {[
            { key: 'dashboard.compactView', title: 'Compact View', description: 'Show more data in less space' },
            { key: 'dashboard.autoRefresh', title: 'Auto-refresh Data', description: 'Automatically update data every 5 minutes' },
            { key: 'dashboard.showCharts', title: 'Show Charts', description: 'Display visual charts on dashboard' },
            { key: 'dashboard.defaultToCurrentMonth', title: 'Default to Current Month', description: 'Start with current month view' }
          ].map((item) => {
            const settingKey = item.key.split('.')[1] as keyof SettingsType['dashboard']; // CHANGED: Use SettingsType
            const isEnabled = localSettings.dashboard?.[settingKey] || false;
            
            return (
              <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex-1">
                  <p className={`font-semibold ${themeClasses.text.primary}`}>{item.title}</p>
                  <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isEnabled}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                    darkMode ? 'bg-gray-600 peer-checked:bg-emerald-600' : 'bg-gray-200 peer-checked:bg-emerald-600'
                  }`}></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Notifications Section
const NotificationsSection = memo(function NotificationsSection({
  localSettings,
  updateSetting,
  darkMode,
  themeClasses
}: any) {
  const items = [
    { key: 'notifications.budgetAlerts', title: 'Budget Alerts', description: 'Get notified when you\'re close to budget limits', Icon: CreditCard },
    { key: 'notifications.weeklyReports', title: 'Weekly Reports', description: 'Receive weekly financial summary emails', Icon: Mail },
    { key: 'notifications.transactionAlerts', title: 'Transaction Alerts', description: 'Get notified for large or unusual transactions', Icon: Bell },
    { key: 'notifications.aiRecommendations', title: 'Smart Insights', description: 'Receive AI-powered financial insights and recommendations', Icon: MessageSquare },
    { key: 'notifications.securityAlerts', title: 'Security Alerts', description: 'Immediate notifications for security-related activities', Icon: Shield }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Notification Preferences</h3>
        <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Choose how you want to be notified about your finances</p>
        
        <div className="space-y-6">
          {items.map((item) => {
            const settingKey = item.key.split('.')[1] as keyof SettingsType['notifications']; // CHANGED: Use SettingsType
            const isEnabled = localSettings.notifications?.[settingKey] ?? true;
            
            return (
              <div key={item.key} className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
                    <item.Icon className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${themeClasses.text.primary}`}>{item.title}</p>
                    <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isEnabled}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                    darkMode ? 'bg-gray-600 peer-checked:bg-emerald-600' : 'bg-gray-200 peer-checked:bg-emerald-600'
                  }`}></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Security Section
const SecuritySection = memo(function SecuritySection({
  handleChangePassword,
  setShowDeleteAccountDialog,
  darkMode,
  themeClasses
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Security Settings</h3>
        <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Manage your account security and access controls</p>
        
        <div className="space-y-4">
          <button
            onClick={handleChangePassword}
            className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
                <Key className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <p className={`font-semibold ${themeClasses.text.primary}`}>Change Password</p>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Update your account password</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${themeClasses.text.muted}`} />
          </button>

          <button
            onClick={() => toast('Two-Factor Authentication will be available soon', {
              icon: '🔐',
              style: { background: darkMode ? '#1f2937' : '#ffffff', color: darkMode ? '#f3f4f6' : '#111827' }
            })}
            className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
                <Lock className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <p className={`font-semibold ${themeClasses.text.primary}`}>Two-Factor Authentication</p>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Add an extra layer of security</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${themeClasses.text.muted}`}>Not available</span>
              <ChevronRight className={`w-5 h-5 ${themeClasses.text.muted}`} />
            </div>
          </button>

          <button
            onClick={() => setShowDeleteAccountDialog(true)}
            className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              darkMode ? 'bg-red-900/20 border-red-800 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:bg-red-100'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-100'}`}>
                <LogOut className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div>
                <p className={`font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Delete Account</p>
                <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Permanently delete your account and all data</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          </button>
        </div>
      </div>
    </div>
  );
});

// Billing & Plan Section
const BillingSection = memo(function BillingSection({
  localSettings,
  themeClasses
}: any) {
  const currentPlan = localSettings?.plan || 'Starter';
  const isPaid = ['Professional', 'Enterprise'].includes(currentPlan);

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Plan & Billing</h3>
        <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>
          Manage your subscription and upgrade when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Current Plan</p>
          <h4 className={`text-xl font-semibold mt-2 ${themeClasses.text.primary}`}>{currentPlan}</h4>
          <p className={`text-sm mt-2 ${themeClasses.text.secondary}`}>
            {isPaid ? 'You have access to premium features.' : 'Upgrade to unlock advanced tools.'}
          </p>
        </div>

        <div className={`rounded-2xl p-6 border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Professional</p>
          <h4 className={`text-xl font-semibold mt-2 ${themeClasses.text.primary}`}>NGN 5,000 / month</h4>
          <p className={`text-sm mt-2 ${themeClasses.text.secondary}`}>Advanced analytics and exports.</p>
          <a
            href="/checkout?plan=professional&billing=monthly"
            className="inline-flex items-center justify-center w-full mt-4 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            Upgrade to Professional
          </a>
        </div>

        <div className={`rounded-2xl p-6 border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Enterprise</p>
          <h4 className={`text-xl font-semibold mt-2 ${themeClasses.text.primary}`}>NGN 12,000 / month</h4>
          <p className={`text-sm mt-2 ${themeClasses.text.secondary}`}>Full access, priority support.</p>
          <a
            href="/checkout?plan=enterprise&billing=monthly"
            className="inline-flex items-center justify-center w-full mt-4 px-4 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
          >
            Upgrade to Enterprise
          </a>
        </div>
      </div>

      <div className={`rounded-2xl p-4 border ${themeClasses.card}`}>
        <p className={`text-sm ${themeClasses.text.secondary}`}>
          Test mode is enabled. Upgrades simulate plan changes without charging.
        </p>
      </div>
    </div>
  );
});

// Data & Privacy Section
const DataPrivacySection = memo(function DataPrivacySection({
  handleExport,
  handleBackup,
  setShowRestoreDialog,
  setShowClearDataDialog,
  localSettings,
  updateSetting,
  darkMode,
  themeClasses,
  isBackingUp = false
}: {
  handleExport: () => void;
  handleBackup: () => void;
  setShowRestoreDialog: (show: boolean) => void;
  setShowClearDataDialog: (show: boolean) => void;
  localSettings: any;
  updateSetting: (key: string, value: any) => void;
  darkMode: boolean;
  themeClasses: any;
  isBackingUp?: boolean;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Data & Privacy</h3>
        <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Manage your financial data and privacy settings</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-3 rounded-lg inline-flex mb-4 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
              <Download className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Export Data</h4>
            <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Download your financial data as CSV or Excel</p>
            <p className={`text-xs mb-3 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Pro feature</p>
            <button
              onClick={handleExport}
              disabled
              className={`w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                darkMode
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Export Data
            </button>
            <button
              onClick={() => toast('Upgrade to Pro to unlock data export.')}
              className={`mt-3 w-full px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                darkMode
                  ? 'border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:text-emerald-200'
                  : 'border-emerald-600/40 text-emerald-700 hover:border-emerald-600 hover:text-emerald-800'
              }`}
            >
              Upgrade to Pro
            </button>
          </div>

          <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-3 rounded-lg inline-flex mb-4 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
              <Save className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Create Backup</h4>
            <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Save your current data as a secure backup</p>
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className={`w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                isBackingUp
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isBackingUp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Backup...</span>
                </>
              ) : (
                'Create Backup'
              )}
            </button>
          </div>

          <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-3 rounded-lg inline-flex mb-4 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
              <Database className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Restore Backup</h4>
            <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Restore from a previous backup file</p>
            <button
              onClick={() => setShowRestoreDialog(true)}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Restore Data
            </button>
          </div>

          <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <div className={`p-3 rounded-lg inline-flex mb-4 ${darkMode ? 'bg-red-900/20' : 'bg-red-100'}`}>
              <Trash2 className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Clear All Data</h4>
            <p className={`text-sm mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Permanently delete all your financial data</p>
            <button
              onClick={() => setShowClearDataDialog(true)}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className={`p-6 rounded-xl border-2 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`font-semibold mb-4 ${themeClasses.text.primary}`}>Privacy Settings</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`font-medium ${themeClasses.text.primary}`}>Anonymous Data Sharing</p>
                <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>Help us improve by sharing anonymous usage data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.privacy?.dataSharing || false}
                  onChange={(e) => updateSetting('privacy.dataSharing', e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  darkMode ? 'bg-gray-600 peer-checked:bg-emerald-600' : 'bg-gray-200 peer-checked:bg-emerald-600'
                }`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`font-medium ${themeClasses.text.primary}`}>Marketing Communications</p>
                <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>Receive emails about new features and tips</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.privacy?.marketingEmails || false}
                  onChange={(e) => updateSetting('privacy.marketingEmails', e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  darkMode ? 'bg-gray-600 peer-checked:bg-emerald-600' : 'bg-gray-200 peer-checked:bg-emerald-600'
                }`}></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Feedback Form
const FeedbackForm = memo(function FeedbackForm({
  feedback,
  setFeedback,
  handleSendFeedback,
  sendingFeedback,
  darkMode,
  themeClasses
}: any) {
  return (
    <div className={`p-6 rounded-xl border-2 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
          <MessageSquare className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
        </div>
        <div>
          <h4 className={`font-semibold ${themeClasses.text.primary}`}>Send Feedback</h4>
          <p className={`text-sm ${themeClasses.text.secondary}`}>Your feedback helps us improve Monietar</p>
        </div>
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="What can we improve? What features would you like to see? Any issues you've encountered?"
        rows={6}
        maxLength={500}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
          darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <span className={`text-sm ${themeClasses.text.secondary}`}>{feedback.length}/500 characters</span>
        <motion.button
          whileHover={{ scale: feedback.trim() && !sendingFeedback ? 1.02 : 1 }}
          whileTap={{ scale: feedback.trim() && !sendingFeedback ? 0.98 : 1 }}
          onClick={handleSendFeedback}
          disabled={!feedback.trim() || sendingFeedback}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            !feedback.trim() || sendingFeedback
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
          }`}
        >
          {sendingFeedback ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Feedback</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
});

// Help & Feedback Full Section
const HelpFeedbackSection = memo(function HelpFeedbackSection({
  feedback,
  setFeedback,
  handleSendFeedback,
  sendingFeedback,
  darkMode,
  themeClasses
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Help & Feedback</h3>
        <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>We're here to help and always listening to your feedback</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-3 rounded-lg inline-flex mb-4 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
              <FileText className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Documentation</h4>
            <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Browse our help center and guides</p>
            <button 
              onClick={() => window.open('https://monietardoc.hashnode.space/', '_blank')} 
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm hover:cursor-pointer font-medium"
            >
              View Docs
            </button>
          </div>

          <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-3 rounded-lg inline-flex mb-4 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
              <MessageSquare className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Email Support</h4>
            <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Get help from our support team</p>
            <button 
              onClick={() => window.location.href = 'mailto:support@monietar.com'} 
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:cursor-pointer hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Email Support
            </button>
          </div>
        </div>

        <FeedbackForm
          feedback={feedback}
          setFeedback={setFeedback}
          handleSendFeedback={handleSendFeedback}
          sendingFeedback={sendingFeedback}
          darkMode={darkMode}
          themeClasses={themeClasses}
        />
      </div>
    </div>
  );
});

export default function SettingsPage({
  handleExportData,
  setShowChangePasswordDialog,
  setShowClearDataDialog,
  setShowDeleteAccountDialog,
  setShowRestoreDialog,
  handleBackupData,
  darkMode,
  themeClasses,
  user
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  // Use settings from context
  const { settings, updateSettings, isLoading } = useSettings();
  
  // Use settings with defaults
  const localSettings = {
    ...DEFAULT_SETTINGS,
    ...settings
  };

  // Type-safe updateSetting function
  const updateSetting = async (key: string, value: any) => {
    try {
      // Handle nested settings
      if (key.includes('.')) {
        const keys = key.split('.');
        
        if (keys.length === 2) {
          const [section, settingKey] = keys;
          
          // Type-safe handling for each section
          switch (section) {
            case 'profile':
              await updateSettings({
                profile: {
                  ...localSettings.profile,
                  [settingKey]: value
                }
              });
              break;
              
            case 'notifications':
              await updateSettings({
                notifications: {
                  ...localSettings.notifications,
                  [settingKey]: value
                }
              });
              break;
              
            case 'dashboard':
              await updateSettings({
                dashboard: {
                  ...localSettings.dashboard,
                  [settingKey]: value
                }
              });
              break;
              
            case 'privacy':
              await updateSettings({
                privacy: {
                  ...localSettings.privacy,
                  [settingKey]: value
                }
              });
              break;
          }
        }
      } else {
        // Handle top-level settings
        const validTopLevelSettings = ['currency', 'language', 'dateFormat', 'timezone', 'theme', 'plan'] as const;
        type TopLevelSetting = typeof validTopLevelSettings[number];
        
        if (validTopLevelSettings.includes(key as TopLevelSetting)) {
          await updateSettings({ [key]: value } as Partial<SettingsType>); // CHANGED: Use SettingsType
        }
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // The settings are already saved via updateSetting, but we can save any pending changes
      toast.success('Settings saved successfully!');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter feedback before sending');
      return;
    }

    try {
      if (!user?.id) {
        toast.error('Please sign in to send feedback');
        return;
      }

      setSendingFeedback(true);

      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_text: feedback,
          category: 'general',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      setFeedback('');
    } catch (error: any) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback');
    } finally {
      setSendingFeedback(false);
    }
  };

  const handleChangePassword = () => setShowChangePasswordDialog(true);
  const handleExport = async () => {
    if (handleExportData) await handleExportData();
    else toast.error('Export functionality not available');
  };
  
  const handleBackup = async () => {
    if (handleBackupData) {
      setIsBackingUp(true);
      try {
        await handleBackupData();
      } finally {
        setIsBackingUp(false);
      }
    } else {
      toast.error('Backup functionality not available');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile & Business', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }, // CHANGED: Use SettingsIcon
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'feedback', label: 'Help & Feedback', icon: HelpCircle },
  ];

  const renderSection = () => {
    const sectionProps = {
      localSettings,
      updateSetting,
      darkMode,
      themeClasses,
      user
    };

    switch (activeSection) {
      case 'profile':
        return <ProfileSection {...sectionProps} />;
      case 'preferences':
        return <PreferencesSection {...sectionProps} />;
      case 'notifications':
        return <NotificationsSection {...sectionProps} />;
      case 'security':
        return (
          <SecuritySection 
            handleChangePassword={handleChangePassword}
            setShowDeleteAccountDialog={setShowDeleteAccountDialog}
            darkMode={darkMode}
            themeClasses={themeClasses}
          />
        );
      case 'billing':
        return (
          <BillingSection
            localSettings={localSettings}
            darkMode={darkMode}
            themeClasses={themeClasses}
          />
        );
      case 'data':
        return (
          <DataPrivacySection 
            handleExport={handleExport}
            handleBackup={handleBackup}
            setShowRestoreDialog={setShowRestoreDialog}
            setShowClearDataDialog={setShowClearDataDialog}
            localSettings={localSettings}
            updateSetting={updateSetting}
            darkMode={darkMode}
            themeClasses={themeClasses}
            isBackingUp={isBackingUp}
          />
        );
      case 'feedback':
        return (
          <HelpFeedbackSection 
            feedback={feedback}
            setFeedback={setFeedback}
            handleSendFeedback={handleSendFeedback}
            sendingFeedback={sendingFeedback}
            darkMode={darkMode}
            themeClasses={themeClasses}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pt-6">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>Settings</h1>
            <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account preferences and settings
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
              saving ? 'bg-gray-400 cursor-not-allowed' : saveSuccess ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg'
            } text-white w-full lg:w-auto justify-center`}
          >
            {saving ? (
              <> <Loader2 className="w-5 h-5 animate-spin" /> <span>Saving...</span> </>
            ) : saveSuccess ? (
              <> <CheckCircle className="w-5 h-5" /> <span>Saved!</span> </>
            ) : (
              <> <Save className="w-5 h-5" /> <span>Save Changes</span> </>
            )}
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <div className={`p-4 sm:p-6 rounded-2xl border-2 backdrop-blur-sm lg:sticky lg:top-24 ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : `hover:bg-gray-100 dark:hover:bg-gray-700 ${themeClasses.text.primary}`
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{section.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl border-2 backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
