'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Define complete Settings interface matching your components' expectations
export interface Settings {
  // Core settings
  currency: string;
  language: string;
  dateFormat: string;
  timezone: string;
  theme: string;
  
  // Notification settings
  notifications: {
    budgetAlerts: boolean;
    weeklyReports: boolean;
    transactionAlerts: boolean;
    aiRecommendations: boolean;
    securityAlerts: boolean;
  };
  
  // Dashboard preferences
  dashboard: {
    compactView: boolean;
    autoRefresh: boolean;
    showCharts: boolean;
    defaultToCurrentMonth: boolean;
  };
  
  // Privacy settings
  privacy: {
    dataSharing: boolean;
    marketingEmails: boolean;
  };
  
  // Profile settings
  profile: {
    fullName: string;
    businessName: string;
    phoneNumber: string;
  };
  
  // Allow additional properties for flexibility
  [key: string]: any;
}

interface UserSettingsRow {
  user_id: string;
  settings: Settings;
  updated_at?: string;
  created_at?: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  isLoading: boolean;
}

// Default settings that match the structure
const defaultSettings: Settings = {
  currency: 'USD',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timezone: 'UTC',
  theme: 'dark',
  notifications: {
    budgetAlerts: true,
    weeklyReports: false,
    transactionAlerts: true,
    aiRecommendations: true,
    securityAlerts: true
  },
  dashboard: {
    compactView: false,
    autoRefresh: false,
    showCharts: true,
    defaultToCurrentMonth: true
  },
  privacy: {
    dataSharing: false,
    marketingEmails: true
  },
  profile: {
    fullName: '',
    businessName: '',
    phoneNumber: ''
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      if (!userId) {
        setSettings(defaultSettings);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const userSettings = data?.settings || {};
      
      // Merge with defaults ensuring all properties exist
      setSettings({
        ...defaultSettings,
        ...userSettings,
        // Ensure nested objects are properly merged
        notifications: {
          ...defaultSettings.notifications,
          ...(userSettings.notifications || {})
        },
        dashboard: {
          ...defaultSettings.dashboard,
          ...(userSettings.dashboard || {})
        },
        privacy: {
          ...defaultSettings.privacy,
          ...(userSettings.privacy || {})
        },
        profile: {
          ...defaultSettings.profile,
          ...(userSettings.profile || {})
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      if (!userId) {
        // Still update local state for preview
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        return;
      }

      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          settings: updatedSettings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setSettings(updatedSettings);
      
      // Show toast notification for specific settings
      const settingKeys = Object.keys(newSettings);
      if (settingKeys.length === 1) {
        const key = settingKeys[0];
        let message = 'Setting updated';
        if (key === 'currency') message = 'Currency updated';
        else if (key === 'language') message = 'Language updated';
        else if (key === 'theme') message = 'Theme updated';
        toast.success(message, { duration: 2000 });
      }
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(error.message || 'Failed to update settings');
      throw error;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSettings();
      
      // Subscribe to realtime changes
      const channel = supabase
        .channel(`user_settings_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_settings',
            filter: `user_id=eq.${userId}`
          },
          (payload: RealtimePostgresChangesPayload<UserSettingsRow>) => {
            const newRow = payload.new as UserSettingsRow;
            if (newRow && newRow.settings) {
              const userSettings = newRow.settings;
              setSettings({
                ...defaultSettings,
                ...userSettings,
                notifications: {
                  ...defaultSettings.notifications,
                  ...(userSettings.notifications || {})
                },
                dashboard: {
                  ...defaultSettings.dashboard,
                  ...(userSettings.dashboard || {})
                },
                privacy: {
                  ...defaultSettings.privacy,
                  ...(userSettings.privacy || {})
                },
                profile: {
                  ...defaultSettings.profile,
                  ...(userSettings.profile || {})
                }
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setSettings(defaultSettings);
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}