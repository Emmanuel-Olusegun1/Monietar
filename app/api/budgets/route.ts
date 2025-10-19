import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const budgetData = await request.json();
    
    // Validate required fields
    const { name, amount, category, period } = budgetData;
    if (!name || !amount || !category || !period) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert budget into database
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        name,
        amount: parseFloat(amount),
        category,
        period,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating budget:', error);
      return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in budget API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');

    let query = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    if (period) {
      query = query.eq('period', period);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching budgets:', error);
      return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in budget API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}