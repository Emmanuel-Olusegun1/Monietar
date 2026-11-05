// app/api/mono/sync/route.ts
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

const toNumber = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeAmount = (value: any) => {
  const num = toNumber(value);
  return num > 1000 ? num / 100 : num;
};

type SyncedTransaction = {
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  status: 'completed';
  is_deleted: false;
  source: 'bank_sync';
  created_at: string;
  updated_at: string;
};

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    const authClient = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be signed in to sync a bank account.' }, { status: 401 });
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

    const rows: SyncedTransaction[] = transactions.map((tx: any) => {
      const amount = normalizeAmount(tx.amount ?? tx.amount_value ?? tx.amount_in_base_currency);
      const type = (tx.type || tx.transaction_type || '').toLowerCase() === 'credit' ? 'income' : 'expense';
      const description = tx.narration || tx.description || tx.remark || 'Bank transaction';
      const category = tx.category || 'Bank';
      const date = tx.date || tx.transaction_date || tx.created_at || new Date().toISOString();

      return {
        user_id: user.id,
        amount: Math.abs(amount),
        category,
        description,
        date: new Date(date).toISOString().split('T')[0],
        type,
        status: 'completed',
        is_deleted: false,
        source: 'bank_sync',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

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

    const { data: account, error: accountError } = await supabase
      .from('bank_connections')
      .select('id')
      .eq('mono_account_id', accountId)
      .eq('business_id', business.id)
      .in('status', ['active', 'connected'])
      .maybeSingle();

    if (accountError) {
      throw accountError;
    }

    if (!account) {
      return NextResponse.json({ error: 'The bank account does not belong to the signed-in user.' }, { status: 403 });
    }

    const plan = normalizePlan(
      user.user_metadata?.subscription_plan ?? user.user_metadata?.plan
    );
    const transactionLimit =
      plan === 'retail-starter' ? 30 : plan === 'growing-merchant' ? 2500 : Infinity;
    let rowsToInsert = rows;

    if (transactionLimit !== Infinity) {
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
        .toISOString()
        .split('T')[0];
      const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
        .toISOString()
        .split('T')[0];
      const { count, error: usageError } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .eq('is_deleted', false)
        .eq('source', 'bank_sync')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (usageError) {
        throw usageError;
      }

      const remaining = Math.max(0, transactionLimit - (count ?? 0));
      const monthlyRows = rows.filter((row) => row.date >= monthStart && row.date <= monthEnd);
      if (monthlyRows.length > remaining) {
        return NextResponse.json(
          {
            error: `This sync contains ${monthlyRows.length} automatic transactions, but only ${remaining} remain in your plan this month.`,
            limit: transactionLimit,
            used: count ?? 0,
          },
          { status: 403 }
        );
      }
    }

    if (rowsToInsert.length > 0) {
      const { error } = await supabase.from('transactions').insert(rowsToInsert);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    await supabase
      .from('bank_connections')
      .update({
        last_sync: new Date().toISOString(),
        status: 'active'
      })
      .eq('mono_account_id', accountId)
      .eq('business_id', business.id);

    return NextResponse.json({ success: true, inserted: rowsToInsert.length });
  } catch (error: any) {
    console.error('Mono sync error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync transactions' }, { status: 500 });
  }
}
