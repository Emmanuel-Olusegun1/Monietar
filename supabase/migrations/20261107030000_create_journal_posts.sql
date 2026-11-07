create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Business finance',
  excerpt text not null default '',
  content text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_journal_posts_published
  on public.journal_posts (published, published_at desc);

create trigger journal_posts_updated_at
before update on public.journal_posts
for each row execute function set_updated_at();
