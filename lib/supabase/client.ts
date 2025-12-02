// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
// If your src/types/supabase.ts does not export a module, declare a local Database type here.
// You can replace `any` with a proper type shape or export the Database type from your types file.
type Database = any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client for build time when env vars are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time
    console.warn('Supabase environment variables are missing. Using mock client.');
    
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
        signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        exchangeCodeForSession: () => Promise.resolve({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
      },
      // Add other methods as needed
    } as any;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
