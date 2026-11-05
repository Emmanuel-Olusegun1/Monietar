// app/api/mono/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';

const MONO_BASE_URL = 'https://api.withmono.com/v2';

const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase environment variables not configured');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
};

export async function POST(request: NextRequest) {
  try {
    const { accountId, monoAccountId } = await request.json();

    if (!accountId || !monoAccountId) {
      return NextResponse.json({ error: 'accountId and monoAccountId are required' }, { status: 400 });
    }

    const authClient = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be signed in to disconnect a bank account.' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (businessError) {
      throw businessError;
    }

    if (!business) {
      return NextResponse.json({ error: 'No active business was found for this account.' }, { status: 400 });
    }

    const monoSecretKey = process.env.MONO_SECRET_KEY;
    if (!monoSecretKey) {
      return NextResponse.json({ error: 'MONO_SECRET_KEY not configured' }, { status: 500 });
    }

    // Unlink remotely when supported, but keep local disconnect independent
    // so historical transactions are not lost or blocked by foreign keys.
    try {
      const unlinkResponse = await fetch(`${MONO_BASE_URL}/accounts/${monoAccountId}/unlink`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'mono-sec-key': monoSecretKey
        }
      });

      if (!unlinkResponse.ok) {
        console.warn(
          'Mono unlink was not accepted:',
          unlinkResponse.status,
          await unlinkResponse.text()
        );
      }
    } catch (unlinkError) {
      console.warn('Mono unlink failed:', unlinkError);
    }

    const { data: disconnectedAccount, error } = await supabase
      .from('bank_connections')
      .update({
        status: 'disconnected',
        last_sync: null,
      })
      .eq('id', accountId)
      .eq('mono_account_id', monoAccountId)
      .eq('business_id', business.id)
      .select('id')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!disconnectedAccount) {
      return NextResponse.json(
        { error: 'Connected account not found or already disconnected.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mono disconnect error:', error);
    return NextResponse.json({ error: error.message || 'Failed to disconnect account' }, { status: 500 });
  }
}
