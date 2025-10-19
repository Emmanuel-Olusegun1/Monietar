import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: code and userId' },
        { status: 400 }
      );
    }

    console.log('Connecting Mono account for user:', userId);

    // Exchange auth code for account ID using Mono's API
    const tokenResponse = await fetch('https://api.withmono.com/account/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY!,
      },
      body: JSON.stringify({ code }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Mono auth error:', tokenData);
      return NextResponse.json(
        { error: tokenData.message || 'Failed to authenticate with Mono' },
        { status: 400 }
      );
    }

    const accountId = tokenData.id;
    console.log('Mono account ID:', accountId);

    // Get account information from Mono
    const accountResponse = await fetch(`https://api.withmono.com/accounts/${accountId}`, {
      headers: {
        'mono-sec-key': process.env.MONO_SECRET_KEY!,
      },
    });

    const accountData = await accountResponse.json();

    if (!accountResponse.ok) {
      console.error('Mono account fetch error:', accountData);
      return NextResponse.json(
        { error: accountData.message || 'Failed to fetch account details' },
        { status: 400 }
      );
    }

    console.log('Mono account data:', accountData);

    // Save account to database
    const { data: savedAccount, error: dbError } = await supabaseAdmin
      .from('user_accounts')
      .insert({
        user_id: userId,
        mono_account_id: accountId,
        institution: accountData.account?.institution?.name || 'Unknown Bank',
        account_name: accountData.account?.name || 'Bank Account',
        account_number: accountData.account?.account_number || '',
        balance: accountData.account?.balance || 0,
        status: 'active',
        connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: dbError.message || 'Failed to save account to database' },
        { status: 500 }
      );
    }

    console.log('Account saved successfully:', savedAccount.id);

    return NextResponse.json({
      success: true,
      accountId: savedAccount.id,
      message: 'Account connected successfully'
    });

  } catch (error: any) {
    console.error('Mono connect error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}