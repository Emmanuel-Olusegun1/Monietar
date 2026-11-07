'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';

interface JournalPost {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  published_at: string | null;
  created_at: string;
}

function formatDate(value: string | null) {
  if (!value) return 'Recently published';
  return new Intl.DateTimeFormat('en-NG', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export default function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    params
      .then(({ slug }) => fetch(`/api/journal/${encodeURIComponent(slug)}`))
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load this article.');
        return data.post as JournalPost;
      })
      .then((data) => {
        if (mounted) setPost(data);
      })
      .catch((loadError) => {
        if (mounted) setError(loadError instanceof Error ? loadError.message : 'Unable to load this article.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased">
      <Header />
      <main>
        <section className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-24 lg:pt-36">
          <div className="mx-auto max-w-[1080px]">
            <a href="/journal" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to journal
            </a>

            {loading && <p className="mt-20 text-sm text-gray-500">Loading article...</p>}
            {!loading && error && <p className="mt-20 text-sm text-red-700">{error}</p>}
            {!loading && post && (
              <>
                <div className="mt-16 border-t border-gray-300 pt-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-900">{post.category}</p>
                  <h1 className="mt-5 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                    {post.title}
                  </h1>
                  <div className="mt-8 flex flex-wrap items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read
                    </span>
                  </div>
                </div>

                {post.excerpt && (
                  <p className="mt-10 max-w-2xl text-lg font-light leading-8 text-gray-600 sm:text-xl">
                    {post.excerpt}
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {!loading && post && (
          <article className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-[760px]">
              <div className="text-base leading-8 text-gray-600 sm:text-lg sm:leading-9 [&_a]:font-medium [&_a]:text-emerald-900 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-900 [&_blockquote]:bg-[#f1f1f1] [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-0.03em] [&_h2]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-gray-900 [&_li]:ml-6 [&_li]:pl-2 [&_ol]:my-6 [&_ol]:list-decimal [&_p]:mb-7 [&_p:last-child]:mb-0 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:bg-gray-900 [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-gray-100 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-6 [&_ul]:list-disc">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
              <a href="/journal" className="group mt-14 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
                More from the journal
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
