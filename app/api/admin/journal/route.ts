import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase service role key not configured');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
};

async function requireAdmin(request: NextRequest) {
  const authClient = createRouteHandlerClient({ cookies });
  const { data: { user } } = await authClient.auth.getUser();
  const admins = getAdminEmails();
  const headerEmail = (request.headers.get('x-admin-email') || '').toLowerCase();

  if (
    !(
      (user?.email && admins.includes(user.email.toLowerCase())) ||
      (headerEmail && admins.includes(headerEmail))
    )
  ) {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await createAdminClient()
      .from('journal_posts')
      .select('id, title, slug, category, excerpt, content, published, published_at, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load journal posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const published = body.published === true;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await createAdminClient()
      .from('journal_posts')
      .insert({
        title,
        slug,
        category: category || 'Business finance',
        excerpt,
        content,
        published,
        published_at: published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create journal post' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) {
      return NextResponse.json({ error: 'Post id is required.' }, { status: 400 });
    }

    const updates: Record<string, string | boolean | null> = {};
    for (const field of ['title', 'slug', 'category', 'excerpt', 'content']) {
      if (typeof body[field] === 'string') updates[field] = body[field].trim();
    }
    if (typeof body.published === 'boolean') {
      updates.published = body.published;
      updates.published_at = body.published ? new Date().toISOString() : null;
    }

    const { data, error } = await createAdminClient()
      .from('journal_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update journal post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Post id is required.' }, { status: 400 });
    }

    const { error } = await createAdminClient()
      .from('journal_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete journal post' },
      { status: 500 }
    );
  }
}
