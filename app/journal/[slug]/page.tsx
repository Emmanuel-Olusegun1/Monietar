import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

interface JournalPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  published_at: string | null;
  created_at: string;
}

const siteUrl = 'https://www.monietar.com.ng';

async function getJournalPost(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Journal service is not configured.');
  }

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
    throw new Error('Unable to load this journal post.');
  }

  return data as JournalPost | null;
}

function formatDate(value: string | null) {
  if (!value) return 'Recently published';
  return new Intl.DateTimeFormat('en-NG', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function getDescription(post: JournalPost) {
  const description = post.excerpt || post.content.replace(/\s+/g, ' ').trim();
  return description.length > 160
    ? `${description.slice(0, 157).trimEnd()}...`
    : description;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) {
    return {
      title: 'Journal post not found | Monietar',
      robots: { index: false, follow: false },
    };
  }

  const description = getDescription(post);
  const url = `${siteUrl}/journal/${post.slug}`;

  return {
    title: `${post.title} | Monietar Journal`,
    description,
    keywords: [
      post.category,
      'business finance',
      'cash flow',
      'financial visibility',
      'African businesses',
      'Monietar Journal',
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${post.title} | Monietar Journal`,
      description,
      siteName: 'Monietar',
      publishedTime: post.published_at || post.created_at,
      section: post.category,
      images: [
        {
          url: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png',
          width: 1200,
          height: 630,
          alt: 'Monietar',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Monietar Journal`,
      description,
      images: [
        'https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png',
      ],
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.published_at || post.created_at;
  const wordCount = post.content.trim().split(/\s+/).length;
  const description = getDescription(post);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    articleSection: post.category,
    datePublished: publishedDate,
    dateModified: post.created_at,
    mainEntityOfPage: `${siteUrl}/journal/${post.slug}`,
    image:
      'https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png',
    author: {
      '@type': 'Organization',
      name: 'Monietar',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Monietar',
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>
        <section className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-24 lg:pt-36">
          <div className="mx-auto max-w-[1080px]">
            <a
              href="/journal"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to journal
            </a>

            <div className="mt-16 border-t border-gray-300 pt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
                {post.category}
              </p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                {post.title}
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                <span>{formatDate(publishedDate)}</span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {Math.max(1, Math.ceil(wordCount / 200))} min read
                </span>
              </div>
            </div>

            {post.excerpt && (
              <p className="mt-10 max-w-2xl text-lg font-light leading-8 text-gray-600 sm:text-xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>

        <article className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[760px]">
            <div className="text-base leading-8 text-gray-600 sm:text-lg sm:leading-9 [&_a]:font-medium [&_a]:text-emerald-900 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-900 [&_blockquote]:bg-[#f1f1f1] [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-0.03em] [&_h2]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-gray-900 [&_li]:ml-6 [&_li]:pl-2 [&_ol]:my-6 [&_ol]:list-decimal [&_p]:mb-7 [&_p:last-child]:mb-0 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:bg-gray-900 [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-gray-100 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-6 [&_ul]:list-disc">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
            <a
              href="/journal"
              className="group mt-14 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              More from the journal
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
