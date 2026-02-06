// app/api/mono/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { accountId, monoAccountId, userId } = await request.json();

    if (!accountId || !monoAccountId || !userId) {
      return NextResponse.json({ error: 'accountId, monoAccountId, and userId are required' }, { status: 400 });
    }

    const monoSecretKey = process.env.MONO_SECRET_KEY;
    if (!monoSecretKey) {
      return NextResponse.json({ error: 'MONO_SECRET_KEY not configured' }, { status: 500 });
    }

    // Attempt to unlink in Mono (non-blocking)
    try {
      await fetch(`${MONO_BASE_URL}/accounts/${monoAccountId}/unlink`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'mono-sec-key': monoSecretKey
        }
      });
    } catch (unlinkError) {
      console.warn('Mono unlink failed:', unlinkError);
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('id', accountId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mono disconnect error:', error);
    return NextResponse.json({ error: error.message || 'Failed to disconnect account' }, { status: 500 });
  }
}
