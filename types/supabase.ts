// src/types/supabase.ts
export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            name: string | null;
            business_name: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id: string;
            email: string;
            name?: string | null;
            business_name?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            name?: string | null;
            business_name?: string | null;
            created_at?: string;
            updated_at?: string;
          };
        };
        // Add other tables as needed
        profiles: {
          Row: {
            id: string;
            user_id: string;
            avatar_url: string | null;
            phone: string | null;
            address: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            avatar_url?: string | null;
            phone?: string | null;
            address?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            avatar_url?: string | null;
            phone?: string | null;
            address?: string | null;
            created_at?: string;
            updated_at?: string;
          };
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
    };
  }