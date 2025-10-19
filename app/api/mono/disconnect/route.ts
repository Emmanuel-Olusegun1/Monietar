import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { accountId, monoAccountId, userId } = await request.json();

    if (!accountId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Unlink account from Mono (optional - for complete disconnection)
    if (monoAccountId) {
      await fetch(`https://api.withmono.com/accounts/${monoAccountId}/unlink`, {
        method: 'POST',
        headers: {
          'mono-sec-key': process.env.MONO_SECRET_KEY!,
        },
      });
    }

    // Delete account and associated transactions from database
    const { error: deleteError } = await supabase
      .from('user_accounts')
      .delete()
      .eq('id', accountId)
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Account disconnected successfully'
    });

  } catch (error: any) {
    console.error('Disconnect error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}