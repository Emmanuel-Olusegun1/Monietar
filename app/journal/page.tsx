'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, BookOpen, Lightbulb, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface JournalPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
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

export default function JournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    fetch('/api/journal')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load journal posts.');
        return data.posts as JournalPost[];
      })
      .then((data) => {
        if (mounted) setPosts(data);
      })
      .catch((loadError) => {
        if (mounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load journal posts.'
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
            <div className="pt-10 sm:pt-14 lg:pt-16">
              <h1 className="max-w-6xl text-[clamp(3rem,7.5vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                Ideas worth
                <br />
                knowing are
                <br />
                <span className="text-emerald-900">here.</span>
              </h1>

              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                    The Monietar Journal
                  </span>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  A collection of ideas, insights, and practical thinking around
                  business finance, cash flow, operations, and building better
                  businesses.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 border-y border-gray-300 sm:grid-cols-2">
                <div className="flex items-center gap-3 py-5 sm:border-r sm:border-gray-300 sm:pr-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    01
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    Practical thinking
                  </span>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-300 py-5 sm:border-t-0 sm:pl-8">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                    02
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    Built for business
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNAL LIST */}
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
              <div>
                <h2 className="max-w-2xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Less noise. More useful thinking.
                </h2>
                <p className="mt-6 max-w-sm text-sm font-light leading-7 text-gray-500">
                  Choose a journal to read. Every article is written to give you
                  something practical to take back to your business.
                </p>
              </div>

              <div className="border-t border-gray-200">
                {loading && (
                  <div className="py-12 text-sm text-gray-500">
                    Loading the latest journal posts...
                  </div>
                )}

                {!loading && error && (
                  <div className="border-b border-gray-200 py-10 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {!loading && !error && posts.length === 0 && (
                  <div className="border-b border-gray-200 py-12">
                    <p className="text-lg font-semibold text-gray-900">
                      The first article is being prepared.
                    </p>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">
                      Check back soon for useful ideas on money, operations, and
                      building better businesses.
                    </p>
                  </div>
                )}

                {!loading &&
                  !error &&
                  posts.map((post, index) => (
                    <a
                      key={post.id}
                      href={`/journal/${post.slug}`}
                      className="group grid grid-cols-[52px_1fr] gap-5 border-b border-gray-200 py-8 transition-colors hover:bg-[#fafafa] sm:grid-cols-[70px_1fr] sm:gap-8 sm:px-4"
                    >
                      <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-900">
                          <span>{post.category}</span>
                          <span className="text-gray-400">
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                        </div>
                        <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-gray-900 sm:text-3xl">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-900">
                          Read journal
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section className="bg-[#f1f1f1] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  What to expect
                </p>
                <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl lg:text-6xl">
                  Useful ideas, not just more content.
                </h2>
              </div>

              <div className="border-t border-gray-300">
                {[
                  ['01', 'Business finance', 'Practical perspectives on cash flow, financial visibility, profitability, and everyday decisions.'],
                  ['02', 'Running better businesses', 'Ideas around operations, inventory, sourcing, and systems that help businesses work better.'],
                  ['03', 'Building for African businesses', 'Thinking about the realities, constraints, opportunities, and possibilities shaping African markets.'],
                  ['04', 'Product & technology', 'Lessons from building technology for businesses and the people behind them.'],
                ].map(([number, title, description]) => (
                  <div key={number} className="grid grid-cols-[60px_1fr] gap-5 border-b border-gray-300 py-8 sm:gap-8">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">{number}</span>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h3>
                      <p className="mt-3 max-w-xl text-sm font-light leading-6 text-gray-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
            <div>
              <h2 className="max-w-4xl text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-gray-900 sm:text-5xl lg:text-6xl">
                Good ideas are better when they are shared.
              </h2>
            </div>
            <div className="flex items-end">
              <div className="max-w-md">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Want to stay close to what we are building and thinking about?
                  Reach out to us.
                </p>
                <a
                  href="mailto:hello@monietar.com.ng"
                  className="group mt-8 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
                >
                  Get in touch
                  <Mail className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
