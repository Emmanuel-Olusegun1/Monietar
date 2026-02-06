// app/api/mono/sync/route.ts
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

const toNumber = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeAmount = (value: any) => {
  const num = toNumber(value);
  return num > 1000 ? num / 100 : num;
};

export async function POST(request: NextRequest) {
  try {
    const { accountId, userId } = await request.json();

    if (!accountId || !userId) {
      return NextResponse.json({ error: 'accountId and userId are required' }, { status: 400 });
    }

    const monoSecretKey = process.env.MONO_SECRET_KEY;
    if (!monoSecretKey) {
      return NextResponse.json({ error: 'MONO_SECRET_KEY not configured' }, { status: 500 });
    }

    const txResponse = await fetch(`${MONO_BASE_URL}/accounts/${accountId}/transactions?paginate=false`, {
      headers: {
        accept: 'application/json',
        'mono-sec-key': monoSecretKey
      }
    });

    const txData = await txResponse.json();
    if (!txResponse.ok) {
      return NextResponse.json({ error: txData?.message || 'Failed to fetch transactions' }, { status: 400 });
    }

    const transactions = Array.isArray(txData?.data) ? txData.data : Array.isArray(txData) ? txData : [];

    const rows = transactions.map((tx: any) => {
      const amount = normalizeAmount(tx.amount ?? tx.amount_value ?? tx.amount_in_base_currency);
      const type = (tx.type || tx.transaction_type || '').toLowerCase() === 'credit' ? 'income' : 'expense';
      const description = tx.narration || tx.description || tx.remark || 'Bank transaction';
      const category = tx.category || 'Bank';
      const date = tx.date || tx.transaction_date || tx.created_at || new Date().toISOString();

      return {
        user_id: userId,
        amount: Math.abs(amount),
        category,
        description,
        date: new Date(date).toISOString().split('T')[0],
        type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    const supabase = createAdminClient();

    if (rows.length > 0) {
      const { error } = await supabase.from('transactions').insert(rows);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    await supabase
      .from('user_accounts')
      .update({
        last_sync: new Date().toISOString(),
        status: 'active'
      })
      .eq('mono_account_id', accountId)
      .eq('user_id', userId);

    return NextResponse.json({ success: true, inserted: rows.length });
  } catch (error: any) {
    console.error('Mono sync error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync transactions' }, { status: 500 });
  }
}
