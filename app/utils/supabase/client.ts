// utils/supabase/client.ts
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../..//types/supabase';

// Use the new createPagesBrowserClient instead of createBrowserSupabaseClient
export const supabase = createPagesBrowserClient<Database>();

// You might also want to create a helper for server components:
export const createClient = () => createPagesBrowserClient<Database>();