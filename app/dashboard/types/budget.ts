// app/dashboard/types/budget.ts
export interface EnhancedBudget {
  id: string;
  user_id: string;
  category: string;
  budget_limit: number;
  spent: number;
  percentage: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at: string;
}