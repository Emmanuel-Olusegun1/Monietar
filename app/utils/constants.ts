// app/utils/constants.ts

// Shared currency constants
export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'NGN', label: 'NGN (₦)' },
  { value: 'CFA', label: 'XFA' },
];

// Shared language constants
export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'sw', label: 'Swahili' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' },
  { value: 'ha', label: 'Hausa' },
];

// Default settings for all users
export const DEFAULT_SETTINGS = {
  currency: 'NGN',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timezone: 'UTC',
  theme: 'dark',
  notifications: {
    budgetAlerts: true,
    weeklyReports: true,
    transactionAlerts: true,
    aiRecommendations: true,
    securityAlerts: true
  },
  dashboard: {
    compactView: false,
    autoRefresh: true,
    showCharts: true,
    defaultToCurrentMonth: true
  },
  privacy: {
    dataSharing: false,
    marketingEmails: false
  },
};

// Get currency symbol for display
export const getCurrencySymbol = (currencyCode: string): string => {
  switch (currencyCode) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'NGN': return '₦';
    case 'CFA': return 'XFA';
    default: return '₦';
  }
};