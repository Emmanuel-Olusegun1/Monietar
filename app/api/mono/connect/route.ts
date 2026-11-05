// app/api/mono/connect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';

const MONO_BASE_URL = 'https://api.withmono.com/v2';

function normalizePlan(value: unknown) {
  if (
    value === 'growing-merchant' ||
    value === 'borderless-pro' ||
    value === 'retail-starter'
  ) {
    return value;
  }

  return 'retail-starter';
}

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
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'code is required' }, { status: 400 });
    }

    const authClient = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be signed in to connect a bank account.' }, { status: 401 });
    }

    const monoSecretKey = process.env.MONO_SECRET_KEY;
    if (!monoSecretKey) {
      return NextResponse.json({ error: 'MONO_SECRET_KEY not configured' }, { status: 500 });
    }

    const authResponse = await fetch(`${MONO_BASE_URL}/accounts/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'mono-sec-key': monoSecretKey
      },
      body: JSON.stringify({ code })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json({ error: authData?.message || 'Mono auth failed' }, { status: 400 });
    }

    const authAccountId = authData?.id || authData?.data?.id || authData?.accountId;
    if (!authAccountId) {
      return NextResponse.json({ error: 'Mono account ID not returned' }, { status: 400 });
    }

    const accountResponse = await fetch(`${MONO_BASE_URL}/accounts/${authAccountId}`, {
      headers: {
        accept: 'application/json',
        'mono-sec-key': monoSecretKey
      }
    });

    const accountData = await accountResponse.json();
    if (!accountResponse.ok) {
      return NextResponse.json({ error: accountData?.message || 'Failed to fetch Mono account details' }, { status: 400 });
    }

    const monoAccountId =
      accountData?.account?.id ||
      accountData?.data?.account?.id ||
      authAccountId;
    const monoDisplayId = authAccountId;

    const supabase = createAdminClient();
    const plan = normalizePlan(
      user.user_metadata?.subscription_plan ?? user.user_metadata?.plan
    );
    const connectedBankLimit =
      plan === 'retail-starter' ? 1 : plan === 'growing-merchant' ? 3 : Infinity;

    const { count: connectedBankCount, error: countError } = await supabase
      .from('user_accounts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['active', 'connected']);

    if (countError) {
      throw countError;
    }

    if ((connectedBankCount ?? 0) >= connectedBankLimit) {
      return NextResponse.json(
        {
          error:
            plan === 'retail-starter'
              ? 'Retail Starter allows one connected bank account. Upgrade your plan to connect another account.'
              : 'You have reached the connected bank account limit for your plan.',
        },
        { status: 403 }
      );
    }

    const { data: accountRow, error } = await supabase
      .from('user_accounts')
      .insert({
        user_id: user.id,
        mono_account_id: monoAccountId,
        mono_display_id: monoDisplayId,
        institution: accountData?.institution || accountData?.data?.institution || authData?.institution || 'Bank Account',
        status: 'active',
        connected_at: new Date().toISOString(),
        last_sync: null,
        account_name: accountData?.account_name || accountData?.data?.account_name || null,
        account_number: accountData?.account_number || accountData?.data?.account_number || null,
        balance: accountData?.balance || accountData?.data?.balance || null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, accountId: monoAccountId, account: accountRow });
  } catch (error: any) {
    console.error('Mono connect error:', error);
    return NextResponse.json({ error: error.message || 'Failed to connect account' }, { status: 500 });
  }
}
