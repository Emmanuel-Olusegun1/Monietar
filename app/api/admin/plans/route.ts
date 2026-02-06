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

export async function GET(request: NextRequest) {
  const authClient = createRouteHandlerClient({ cookies });
  const { data: { user } } = await authClient.auth.getUser();

  const admins = getAdminEmails();
  const headerEmail = (request.headers.get('x-admin-email') || '').toLowerCase();
  const isAdmin =
    (user?.email && admins.includes(user.email.toLowerCase())) ||
    (headerEmail && admins.includes(headerEmail));

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('users')
      .select('plan');

    if (error) throw error;

    const counts: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      const plan = (row.plan || 'Free').toString();
      counts[plan] = (counts[plan] || 0) + 1;
    });

    return NextResponse.json({ plans: counts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load plans' }, { status: 500 });
  }
}
