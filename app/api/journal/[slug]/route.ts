import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Journal service is not configured.' },
      { status: 500 }
    );
  }

  const { slug } = await params;
  const { data, error } = await createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
    .from('journal_posts')
    .select(
      'id, title, slug, category, excerpt, content, published_at, created_at'
    )
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: 'Unable to load this journal post.' },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ error: 'Journal post not found.' }, { status: 404 });
  }

  return NextResponse.json({ post: data });
}
