// app/dashboard/components/pages/SettingsPage.tsx
'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Download, 
  Trash2, 
  Bell, 
  Key, 
  LogOut, 
  ChevronRight, 
  User,
  Shield,
  Database,
  MessageSquare,
  Mail,
  Send,
  CreditCard,
  Settings,
  Building,
  FileText,
  Lock,
  HelpCircle
} from 'lucide-react';

interface SettingsPageProps {
  userSettings: any;
  setUserSettings: (settings: any) => void;
  handleSaveSettings: () => void;
  handleExportData: () => void;
  setShowChangePasswordDialog: (show: boolean) => void;
  setShowClearDataDialog: (show: boolean) => void;
  setShowDeleteAccountDialog: (show: boolean) => void;
  setShowRestoreDialog: (show: boolean) => void;
  handleBackupData: () => void;
  darkMode: boolean;
  themeClasses: any;
  languagesList: any[];
  currencies: any[];
  currency: string;
  language: string;
  setCurrency: (curr: string) => void;
  setLanguage: (lang: string) => void;
}

export default function SettingsPage({
  userSettings,
  setUserSettings,
  handleSaveSettings,
  handleExportData,
  setShowChangePasswordDialog,
  setShowClearDataDialog,
  setShowDeleteAccountDialog,
  setShowRestoreDialog,
  handleBackupData,
  darkMode,
  themeClasses,
  languagesList,
  currencies,
  currency,
  language,
  setCurrency,
  setLanguage
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  // Initialize userSettings with defaults if not provided
  const settings = {
    fullName: userSettings?.fullName || '',
    email: userSettings?.email || '',
    businessName: userSettings?.businessName || '',
    phoneNumber: userSettings?.phoneNumber || '',
    currency: userSettings?.currency || 'USD',
    language: userSettings?.language || 'en',
    dateFormat: userSettings?.dateFormat || 'MM/DD/YYYY',
    timezone: userSettings?.timezone || 'UTC',
    compactView: userSettings?.compactView || false,
    autoRefresh: userSettings?.autoRefresh || false,
    showCharts: userSettings?.showCharts || true,
    notifications: userSettings?.notifications || {
      budgetAlerts: true,
      weeklyReports: false,
      transactionAlerts: true,
      aiRecommendations: true,
      securityAlerts: true
    },
    dataSharing: userSettings?.dataSharing || false,
    marketingEmails: userSettings?.marketingEmails || true,
    // Add other settings with defaults
    ...userSettings
  };

  const handleSave = async () => {
    setSaving(true);
    await handleSaveSettings();
    setTimeout(() => setSaving(false), 1000);
  };

  const handleSendFeedback = () => {
    console.log('Feedback:', feedback);
    // In a real app, you would send this to your backend
    alert('Thank you for your feedback!');
    setFeedback('');
  };

  const sections = [
    { id: 'profile', label: 'Profile & Business', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'feedback', label: 'Help & Feedback', icon: HelpCircle },
  ];

  const SectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Profile Information</h3>
              <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Manage your personal and business details</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => setUserSettings({...settings, fullName: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setUserSettings({...settings, email: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-5 h-5 text-emerald-500" />
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Business Information</h4>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => setUserSettings({...settings, businessName: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => setUserSettings({...settings, phoneNumber: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Preferences</h3>
              <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Customize your financial dashboard experience</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                    Primary Currency *
                  </label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => {
                      setUserSettings({...settings, currency: e.target.value});
                      setCurrency(e.target.value);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {currencies.map((curr) => (
                      <option key={curr.value} value={curr.value}>{curr.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                    Language
                  </label>
                  <select 
                    value={settings.language}
                    onChange={(e) => {
                      setUserSettings({...settings, language: e.target.value});
                      setLanguage(e.target.value);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {languagesList.map((lang) => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                    Date Format
                  </label>
                  <select 
                    value={settings.dateFormat}
                    onChange={(e) => setUserSettings({...settings, dateFormat: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}>
                    Time Zone
                  </label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => setUserSettings({...settings, timezone: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="UTC">UTC</option>
                    <option value="Africa/Lagos">West Africa Time (WAT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h4 className={`text-lg font-semibold mb-6 ${themeClasses.text.primary}`}>Dashboard Preferences</h4>
              <div className="space-y-4">
                {[
                  {
                    key: 'compactView',
                    title: 'Compact View',
                    description: 'Show more data in less space',
                    enabled: settings.compactView
                  },
                  {
                    key: 'autoRefresh',
                    title: 'Auto-refresh Data',
                    description: 'Automatically update data every 5 minutes',
                    enabled: settings.autoRefresh
                  },
                  {
                    key: 'showCharts',
                    title: 'Show Charts',
                    description: 'Display visual charts and graphs',
                    enabled: settings.showCharts
                  }
                ].map((item) => (
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
                        checked={item.enabled}
                        onChange={(e) => setUserSettings({
                          ...settings, 
                          [item.key]: e.target.checked
                        })}
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        darkMode 
                          ? 'bg-gray-600 peer-checked:bg-emerald-600' 
                          : 'bg-gray-200 peer-checked:bg-emerald-600'
                      }`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Notification Preferences</h3>
              <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Choose how you want to be notified about your finances</p>
              
              <div className="space-y-6">
                {[
                  {
                    key: 'budgetAlerts',
                    title: 'Budget Alerts',
                    description: 'Get notified when you\'re close to budget limits',
                    icon: CreditCard
                  },
                  {
                    key: 'weeklyReports',
                    title: 'Weekly Reports',
                    description: 'Receive weekly financial summary emails',
                    icon: Mail
                  },
                  {
                    key: 'transactionAlerts',
                    title: 'Transaction Alerts',
                    description: 'Get notified for large or unusual transactions',
                    icon: Bell
                  },
                  {
                    key: 'aiRecommendations',
                    title: 'Smart Insights',
                    description: 'Receive AI-powered financial insights and recommendations',
                    icon: MessageSquare
                  },
                  {
                    key: 'securityAlerts',
                    title: 'Security Alerts',
                    description: 'Immediate notifications for security-related activities',
                    icon: Shield
                  }
                ].map((item) => (
                  <div key={item.key} className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 ${
                    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          darkMode ? 'text-emerald-400' : 'text-emerald-600'
                        }`} />
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
                        checked={settings.notifications[item.key]}
                        onChange={(e) => setUserSettings({
                          ...settings, 
                          notifications: {...settings.notifications, [item.key]: e.target.checked}
                        })}
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        darkMode 
                          ? 'bg-gray-600 peer-checked:bg-emerald-600' 
                          : 'bg-gray-200 peer-checked:bg-emerald-600'
                      }`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Security Settings</h3>
              <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Manage your account security and access controls</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowChangePasswordDialog(true)}
                  className={`w-full flex hover:cursor-pointer items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                    }`}>
                      <Key className={`w-5 h-5 ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${themeClasses.text.primary}`}>Change Password</p>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${themeClasses.text.muted}`} />
                </button>

                <button 
                  onClick={() => alert('Two-Factor Authentication dialog would open here')}
                  className={`w-full hover:cursor-pointer flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                    }`}>
                      <Lock className={`w-5 h-5 ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${themeClasses.text.primary}`}>Two-Factor Authentication</p>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>Add an extra layer of security</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${themeClasses.text.muted}`}>Not enabled</span>
                    <ChevronRight className={`w-5 h-5 ${themeClasses.text.muted}`} />
                  </div>
                </button>

                <button 
                  onClick={() => setShowDeleteAccountDialog(true)}
                  className={`w-full hover:cursor-pointer flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    darkMode ? 'bg-red-900/20 border-red-800 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-red-900/20' : 'bg-red-100'
                    }`}>
                      <LogOut className={`w-5 h-5 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
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

      case 'data':
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Data & Privacy</h3>
              <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>Manage your financial data and privacy settings</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 rounded-lg inline-flex mb-4 ${
                    darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                  }`}>
                    <Download className={`w-6 h-6 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Export Data</h4>
                  <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Download your financial data as CSV or Excel</p>
                  <button 
                    onClick={handleExportData}
                    className="w-full hover:cursor-pointer px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Export Data
                  </button>
                </div>

                <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 rounded-lg inline-flex mb-4 ${
                    darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                  }`}>
                    <Save className={`w-6 h-6 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Create Backup</h4>
                  <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Save your current data as a secure backup</p>
                  <button 
                    onClick={handleBackupData}
                    className="w-full hover:cursor-pointer px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Create Backup
                  </button>
                </div>

                <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 rounded-lg inline-flex mb-4 ${
                    darkMode ? 'bg-purple-900/20' : 'bg-purple-100'
                  }`}>
                    <Database className={`w-6 h-6 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Restore Backup</h4>
                  <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Restore from a previous backup file</p>
                  <button 
                    onClick={() => setShowRestoreDialog(true)}
                    className="w-full hover:cursor-pointer px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Restore Data
                  </button>
                </div>

                <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                }`}>
                  <div className={`p-3 rounded-lg inline-flex mb-4 ${
                    darkMode ? 'bg-red-900/20' : 'bg-red-100'
                  }`}>
                    <Trash2 className={`w-6 h-6 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Clear All Data</h4>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Permanently delete all your financial data</p>
                  <button 
                    onClick={() => setShowClearDataDialog(true)}
                    className="w-full hover:cursor-pointer px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Clear Data
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-xl border-2 ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`font-semibold mb-4 ${themeClasses.text.primary}`}>Privacy Settings</h4>
                <div className="space-y-4">
                  {[
                    {
                      key: 'dataSharing',
                      title: 'Anonymous Data Sharing',
                      description: 'Help us improve by sharing anonymous usage data',
                      enabled: settings.dataSharing
                    },
                    {
                      key: 'marketingEmails',
                      title: 'Marketing Communications',
                      description: 'Receive emails about new features and tips',
                      enabled: settings.marketingEmails
                    }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`font-medium ${themeClasses.text.primary}`}>{item.title}</p>
                        <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={item.enabled}
                          onChange={(e) => setUserSettings({
                            ...settings, 
                            [item.key]: e.target.checked
                          })}
                        />
                        <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          darkMode 
                            ? 'bg-gray-600 peer-checked:bg-emerald-600' 
                            : 'bg-gray-200 peer-checked:bg-emerald-600'
                        }`}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>Help & Feedback</h3>
              <p className={`text-sm mb-6 ${themeClasses.text.secondary}`}>We're here to help and always listening to your feedback</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 rounded-lg inline-flex mb-4 ${
                    darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Documentation</h4>
                  <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Browse our help center and guides</p>
                  <button 
                    onClick={() => window.open('https://docs.monietar.com', '_blank')}
                    className="w-full hover:cursor-pointer px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    View Docs
                  </button>
                </div>

                <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 rounded-lg inline-flex mb-4 ${
                    darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                  }`}>
                    <MessageSquare className={`w-6 h-6 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>Contact Support</h4>
                  <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>Get help from our support team</p>
                  <button 
                    onClick={() => window.location.href = 'mailto:support@monietar.com'}
                    className="w-full hover:cursor-pointer px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-xl border-2 ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                  }`}>
                    <MessageSquare className={`w-6 h-6 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
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
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  maxLength={500}
                />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                  <span className={`text-sm ${themeClasses.text.secondary}`}>
                    {feedback.length}/500 characters
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendFeedback}
                    disabled={!feedback.trim()}
                    className={`flex items-center hover:cursor-pointer space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      feedback.trim() 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pt-6">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              Settings
            </h1>
            <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account preferences and settings
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className={`flex hover:cursor-pointer items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg'
            } text-white w-full lg:w-auto justify-center`}
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Mobile First */}
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
                      className={`w-full hover:cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
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

          {/* Main Content */}
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
                  <SectionContent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}