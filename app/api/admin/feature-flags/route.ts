import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase service role key not configured');
  }

  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
};

const isAuthorized = async (request: NextRequest) => {
  const authClient = createRouteHandlerClient({ cookies });
  const { data: { user } } = await authClient.auth.getUser();
  const admins = getAdminEmails();
  const headerEmail = (request.headers.get('x-admin-email') || '').toLowerCase();
  return (
    (user?.email && admins.includes(user.email.toLowerCase())) ||
    (headerEmail && admins.includes(headerEmail))
  );
};

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('feature_flags')
      .select('key, enabled, description, updated_at')
      .order('key');

    if (error) throw error;
    return NextResponse.json({ flags: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load flags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, enabled } = await request.json();
    if (!key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('feature_flags')
      .upsert({
        key,
        enabled: !!enabled,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update flag' }, { status: 500 });
  }
}
