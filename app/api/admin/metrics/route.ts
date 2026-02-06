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

    const [
      usersCount,
      transactionsCount,
      budgetsCount
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('transactions').select('id', { count: 'exact', head: true }),
      supabase.from('budgets').select('id', { count: 'exact', head: true })
    ]);

    const now = new Date();
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [newUsers7, newUsers30] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', last7),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', last30)
    ]);

    return NextResponse.json({
      users: usersCount.count || 0,
      transactions: transactionsCount.count || 0,
      budgets: budgetsCount.count || 0,
      newUsers7d: newUsers7.count || 0,
      newUsers30d: newUsers30.count || 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load metrics' }, { status: 500 });
  }
}
