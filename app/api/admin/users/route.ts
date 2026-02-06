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

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();
  const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
  const offset = Math.max(Number(searchParams.get('offset') || 0), 0);

  try {
    const supabase = createAdminClient();

    let requestBuilder = supabase
      .from('users')
      .select('id, name, business_name, email, phone, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (query) {
      requestBuilder = requestBuilder.or(
        `email.ilike.%${query}%,name.ilike.%${query}%,business_name.ilike.%${query}%`
      );
    }

    const { data, count, error } = await requestBuilder;
    if (error) throw error;

    return NextResponse.json({
      users: data || [],
      total: count || 0,
      limit,
      offset
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load users' }, { status: 500 });
  }
}
