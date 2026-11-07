import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Journal service is not configured.' },
      { status: 500 }
    );
  }

  const { data, error } = await createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
    .from('journal_posts')
    .select(
      'id, title, slug, category, excerpt, content, published_at, created_at'
    )
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Unable to load journal posts.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ posts: data || [] });
}
