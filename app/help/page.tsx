'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Package,
  Search,
  Settings,
  Wallet,
  X,
} from 'lucide-react';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

type Article = {
  title: string;
  category: string;
  description: string;
};

const categories = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description:
      'Learn the basics and get your Monietar account ready for use.',
  },
  {
    icon: BarChart3,
    title: 'Sales & Financial Intelligence',
    description:
      'Understand your sales, profit, cash flow, and financial reports.',
  },
  {
    icon: Wallet,
    title: 'Cash & Bank Transfers',
    description:
      'Learn how Monietar handles bank transfers and physical cash.',
  },
  {
    icon: Package,
    title: 'Inventory & Sourcing',
    description:
      'Track inventory and understand how sourcing costs affect your margins.',
  },
  {
    icon: CreditCard,
    title: 'Plans & Billing',
    description:
      'Everything you need to know about plans, billing, and upgrades.',
  },
  {
    icon: Settings,
    title: 'Account & Settings',
    description:
      'Manage your business information, preferences, and connected services.',
  },
];

const articles: Article[] = [
  {
    title: 'How do I get started with Monietar?',
    category: 'Getting Started',
    description:
      'A simple guide to setting up your business and getting your financial workspace ready.',
  },
  {
    title: 'Setting up your Monietar business',
    category: 'Getting Started',
    description:
      'Learn how to configure your business information and prepare your workspace.',
  },
  {
    title: 'Understanding your Monietar workspace',
    category: 'Getting Started',
    description:
      'Understand the main areas of Monietar and where to find the information you need.',
  },

  {
    title: 'How does Monietar track my cash flow?',
    category: 'Sales & Financial Intelligence',
    description:
      'Understand how sales, transfers, physical cash, and other financial activity contribute to your cash-flow picture.',
  },
  {
    title: 'How does Monietar calculate profit?',
    category: 'Sales & Financial Intelligence',
    description:
      'Learn how Monietar turns your business activity into a clearer view of profitability.',
  },
  {
    title: 'Understanding your profit and loss',
    category: 'Sales & Financial Intelligence',
    description:
      'Learn how to read and use your profit-and-loss information.',
  },
  {
    title: 'Reading your financial insights',
    category: 'Sales & Financial Intelligence',
    description:
      'Understand the signals Monietar provides about the financial state of your business.',
  },

  {
    title: 'How does automatic transfer logging work?',
    category: 'Cash & Bank Transfers',
    description:
      'Learn how bank transfers can be captured and reflected in your business records.',
  },
  {
    title: 'Connecting your bank account',
    category: 'Cash & Bank Transfers',
    description:
      'Understand the process of connecting your bank account to Monietar.',
  },
  {
    title: 'Recording physical cash',
    category: 'Cash & Bank Transfers',
    description:
      'Learn how to keep your physical cash position separate and visible.',
  },
  {
    title: 'Understanding your cash position',
    category: 'Cash & Bank Transfers',
    description:
      'See how your available cash fits into the bigger picture of your business finances.',
  },

  {
    title: 'How does inventory tracking work?',
    category: 'Inventory & Sourcing',
    description:
      'Understand how Monietar helps you keep track of stock and inventory movement.',
  },
  {
    title: 'Monitoring sourcing prices',
    category: 'Inventory & Sourcing',
    description:
      'Learn how Monietar helps you monitor sourcing prices and changes across currencies.',
  },
  {
    title: 'How does cross-border sourcing monitoring work?',
    category: 'Inventory & Sourcing',
    description:
      'Understand how sourcing costs and currency movements can be viewed alongside your cash flow.',
  },
  {
    title: 'Understanding sourcing and cash flow',
    category: 'Inventory & Sourcing',
    description:
      'See how changes in sourcing costs can affect your margins and available cash.',
  },

  {
    title: 'Choosing a Monietar plan',
    category: 'Plans & Billing',
    description:
      'Compare Monietar plans and understand which one fits your business.',
  },
  {
    title: 'Monthly vs yearly billing',
    category: 'Plans & Billing',
    description:
      'Understand the difference between monthly and yearly billing.',
  },
  {
    title: 'Changing your plan',
    category: 'Plans & Billing',
    description:
      'Learn what happens when you upgrade or change your Monietar plan.',
  },

  {
    title: 'Managing your business profile',
    category: 'Account & Settings',
    description:
      'Update your business information and account details.',
  },
  {
    title: 'Managing connected accounts',
    category: 'Account & Settings',
    description:
      'Understand how connected financial accounts are managed.',
  },
  {
    title: 'Updating your preferences',
    category: 'Account & Settings',
    description:
      'Manage your Monietar preferences and account settings.',
  },
];

const popularArticles = [
  'How do I get started with Monietar?',
  'How does Monietar track my cash flow?',
  'How does automatic transfer logging work?',
  'How does Monietar calculate profit?',
  'How does inventory tracking work?',
  'How does cross-border sourcing monitoring work?',
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        !activeCategory || article.category === activeCategory;

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((current) =>
      current === category ? null : category
    );

    setSearchQuery('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
  };

  return (
    <>
      <Header />

      <main className="bg-[#f1f1f1] text-gray-900">
        {/* HERO */}
        <section className="border-b border-gray-300 px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-40">
          <div className="mx-auto max-w-[1440px]">
            {selectedArticle ? (
              <div className="max-w-4xl">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Help Center
                </button>

                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  {selectedArticle.category}
                </p>

                <h1 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
                  {selectedArticle.title}
                </h1>
              </div>
            ) : (
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <h1 className="max-w-5xl text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                  Get the help
                  <br />
                  <span className="text-emerald-900">
                    you need.
                  </span>
                </h1>

                <p className="max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl lg:pb-2">
                  Find answers about setting up Monietar, tracking your
                  finances, managing inventory, and getting the most out of
                  your account.
                </p>
              </div>
            )}

            {/* SEARCH */}
            {!selectedArticle && (
              <div className="mt-16 max-w-3xl">
                <div className="flex items-center gap-4 border-b-2 border-gray-900 py-4">
                  <Search className="h-6 w-6 shrink-0 text-gray-500" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search the Help Center..."
                    className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400 sm:text-xl"
                  />

                  {(searchQuery || activeCategory) && (
                    <button
                      onClick={clearFilters}
                      aria-label="Clear search"
                      className="shrink-0"
                    >
                      <X className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ARTICLE */}
        {selectedArticle ? (
          <section className="border-b border-gray-300 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="mx-auto max-w-[1440px]">
              <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Help article
                  </p>
                </div>

                <article className="max-w-3xl">
                  <p className="mb-10 text-xl leading-relaxed text-gray-600">
                    {selectedArticle.description}
                  </p>

                  <div className="space-y-8 border-t border-gray-300 pt-10">
                    <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                      About this feature
                    </h2>

                    <p className="leading-8 text-gray-600">
                      This Help Center article will contain the detailed
                      guide for{' '}
                      <strong className="font-semibold text-gray-900">
                        {selectedArticle.title.toLowerCase()}
                      </strong>
                      .
                    </p>

                    <p className="leading-8 text-gray-600">
                      Monietar is designed to give business owners a clearer
                      view of what is happening across their sales, cash,
                      expenses, inventory, and financial activity.
                    </p>

                    <div className="border-l-2 border-emerald-900 bg-[#f1f1f1] p-6">
                      <p className="font-medium leading-relaxed">
                        More detailed documentation for this topic is being
                        prepared and will be added here as the Help Center
                        grows.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="group mt-12 inline-flex items-center gap-3 border-b border-gray-900 pb-3 text-sm font-semibold"
                  >
                    Back to Help Center
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                </article>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* SEARCH RESULTS */}
            {(searchQuery || activeCategory) && (
              <section className="border-b border-gray-300 bg-white px-5 py-16 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                  <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Search results
                      </p>

                      <h2 className="text-4xl font-semibold tracking-[-0.04em]">
                        {filteredArticles.length} result
                        {filteredArticles.length === 1 ? '' : 's'}
                      </h2>
                    </div>

                    {activeCategory && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-sm font-semibold text-emerald-900"
                      >
                        Clear filters
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {filteredArticles.length > 0 ? (
                    <div className="border-l border-t border-gray-300">
                      {filteredArticles.map((article, index) => (
                        <button
                          key={`${article.title}-${index}`}
                          onClick={() => handleArticleClick(article)}
                          className="group flex w-full items-start justify-between gap-8 border-b border-r border-gray-300 p-6 text-left transition-colors hover:bg-[#f1f1f1] sm:p-8"
                        >
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-900">
                              {article.category}
                            </p>

                            <h3 className="mb-2 text-xl font-semibold tracking-[-0.02em]">
                              {article.title}
                            </h3>

                            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                              {article.description}
                            </p>
                          </div>

                          <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-gray-300 p-10">
                      <h3 className="mb-3 text-2xl font-semibold">
                        No articles found.
                      </h3>

                      <p className="text-gray-600">
                        Try a different search term or browse the topics
                        below.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* POPULAR */}
            {!searchQuery && !activeCategory && (
              <section className="border-b border-gray-300 bg-white px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                  <div className="mb-12">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Popular questions
                    </p>

                    <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                      Start with what{' '}
                      <span className="text-emerald-900">
                        people ask most.
                      </span>
                    </h2>
                  </div>

                  <div className="grid border-l border-t border-gray-300 sm:grid-cols-2 lg:grid-cols-3">
                    {popularArticles.map((article, index) => {
                      const found = articles.find(
                        (item) => item.title === article
                      );

                      if (!found) return null;

                      return (
                        <motion.button
                          key={article}
                          onClick={() => handleArticleClick(found)}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.04 }}
                          className="group flex min-h-[120px] items-start justify-between gap-6 border-b border-r border-gray-300 p-6 text-left transition-colors hover:bg-[#f1f1f1]"
                        >
                          <span className="text-base font-medium leading-relaxed">
                            {article}
                          </span>

                          <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* CATEGORIES */}
            <section className="border-b border-gray-300 bg-[#f1f1f1] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
              <div className="mx-auto max-w-[1440px]">
                <div className="mb-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Browse by topic
                  </p>

                  <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    Everything you need to understand and use Monietar.
                  </h2>
                </div>

                <div className="grid border-l border-t border-gray-300 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category, index) => {
                    const Icon = category.icon;

                    const categoryArticles = articles.filter(
                      (article) => article.category === category.title
                    );

                    return (
                      <motion.button
                        key={category.title}
                        onClick={() =>
                          handleCategoryClick(category.title)
                        }
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex min-h-[340px] flex-col justify-between border-b border-r border-gray-300 p-7 text-left transition-colors hover:bg-white lg:p-8"
                      >
                        <div>
                          <div className="mb-8 flex h-12 w-12 items-center justify-center border border-gray-300">
                            <Icon className="h-5 w-5" />
                          </div>

                          <h3 className="mb-3 text-2xl font-semibold tracking-[-0.03em]">
                            {category.title}
                          </h3>

                          <p className="max-w-sm leading-relaxed text-gray-600">
                            {category.description}
                          </p>
                        </div>

                        <div className="mt-10">
                          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                            {categoryArticles.length} articles
                          </p>

                          <div className="space-y-3">
                            {categoryArticles
                              .slice(0, 3)
                              .map((article) => (
                                <div
                                  key={article.title}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <span className="mt-2 h-1 w-1 shrink-0 bg-emerald-900" />
                                  <span>{article.title}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-emerald-900">
                          Explore topic
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SUPPORT */}
            <section className="border-b border-gray-300 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
              <div className="mx-auto max-w-[1440px]">
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
                  <div>
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Still need help?
                    </p>

                    <h2 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                      Some questions are better answered by a person.
                    </h2>
                  </div>

                  <div className="lg:pl-16">
                    <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-600">
                      If you cannot find what you are looking for, reach out
                      to our team. We will help you figure it out.
                    </p>

                    <a
                      href="/contact"
                      className="group inline-flex items-center gap-3 border-b border-gray-900 pb-3 text-sm font-semibold"
                    >
                      Contact Monietar
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}