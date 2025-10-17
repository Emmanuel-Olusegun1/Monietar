export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  spent: number;
  budget_limit: number;
  percentage: number;
  period: 'Monthly' | 'Quarterly' | 'Yearly';
  created_at?: string;
}

export interface Alert {
  type: 'alert' | 'warning' | 'info';
  message: string;
  category: string;
  priority: 'critical' | 'high' | 'low';
}

export interface FinancialData {
  income: number;
  expenses: number;
  profit: number;
  transactions: Transaction[];
  budgets: Budget[];
  alerts: Alert[];
  aiRecommendations: string[];
  cashFlowForecast: { month: string; forecast: number; actual: number | null }[];
}

export interface UserInfo {
  name: string;
  email: string;
  businessName: string;
  avatar: string;
  plan: string;
  joinedDate: string;
}

export interface CategoryData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface CurrencyOption {
  value: string;
  label: string;
}

export interface TimeFilter {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface UserSettings {
  fullName: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  currency: string;
  language: string;
  dateFormat: string;
  timezone: string;
  notifications: {
    budgetAlerts: boolean;
    weeklyReports: boolean;
    transactionAlerts: boolean;
    aiRecommendations: boolean;
  };
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}