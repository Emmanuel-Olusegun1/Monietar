'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowUpRight,
  MessageCircle,
  Users,
  Lightbulb,
  BookOpen,
  TrendingUp,
  CircleHelp,
  Check,
} from 'lucide-react';

const communityChannels = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Ask better questions',
    description:
      'Bring the real problems you are facing in your business. Learn from other people who are dealing with similar challenges.',
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Share what works',
    description:
      'Share the systems, habits, and ideas that are helping you make better decisions and run your business better.',
  },
  {
    icon: BookOpen,
    number: '03',
    title: 'Learn from each other',
    description:
      'Get practical conversations around cash flow, profitability, operations, inventory, sourcing, and growth.',
  },
];

const topics = [
  'Cash flow',
  'Profit & margins',
  'Business operations',
  'Inventory',
  'Cross-border sourcing',
  'Financial visibility',
];

const communityValues = [
  'Real business conversations',
  'Practical ideas over generic advice',
  'Learning from other business owners',
  'Better financial decision-making',
];

export default function CommunityPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f1f1f1] text-gray-900">
        {/* HERO */}
        <section className="border-b border-gray-300 px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-32 lg:pt-40">
          <div className="mx-auto max-w-[1440px]">
           <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
               <h1 className="max-w-6xl text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                Better businesses
                <br />
                <span className="text-emerald-900">
                  grow together.
                </span>
              </h1>
              </div>

              <div className="max-w-xl lg:pb-2">
                <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
                  A growing community for business owners who want to
                  understand their numbers, learn from others, and get better
                  at running their businesses.
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-emerald-900">
                  <span className="h-2 w-2 bg-emerald-900" />
                  Opening on WhatsApp
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold">
              <a
                href="#what-to-expect"
                className="group inline-flex items-center gap-3 border-b border-gray-900 pb-3"
              >
                See what to expect
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              <a
                href="#topics"
                className="group inline-flex items-center gap-3 border-b border-gray-400 pb-3 text-gray-600"
              >
                Explore conversations
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="border-b border-gray-300 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Why we are building it
                </p>
              </div>

              <div className="max-w-5xl">
                <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  Running a business comes with questions that{' '}
                  <span className="text-emerald-900">
                    software cannot answer alone.
                  </span>
                </h2>

                <p className="mt-8 max-w-3xl text-lg leading-relaxed text-gray-600">
                  Sometimes you need to see how someone else solved a problem.
                  Sometimes you need a second perspective. And sometimes you
                  simply need to know that another business owner is dealing
                  with the same thing.
                </p>

                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-600">
                  That is what we want the Monietar community to be — a place
                  where those conversations can happen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section
          id="what-to-expect"
          className="border-b border-gray-300 bg-[#f1f1f1] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                What to expect
              </p>

              <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                A community built around{' '}
                <span className="text-emerald-900">
                  useful conversations.
                </span>
              </h2>
            </div>

            <div className="grid border-l border-t border-gray-300 md:grid-cols-3">
              {communityChannels.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="flex min-h-[380px] flex-col justify-between border-b border-r border-gray-300 p-7 transition-colors hover:bg-white lg:p-8"
                  >
                    <div>
                      <div className="mb-10 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center border border-gray-300">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="text-xs font-semibold tracking-[0.15em] text-gray-400">
                          {item.number}
                        </span>
                      </div>

                      <h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em]">
                        {item.title}
                      </h3>

                      <p className="max-w-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-10 h-px w-full bg-gray-300" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TOPICS */}
        <section
          id="topics"
          className="border-b border-gray-300 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
               <h2 className="max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl">
                  The things that actually{' '}
                  <span className="text-emerald-900">
                    affect your business.
                  </span>
                </h2>

                <p className="mt-7 max-w-md text-lg leading-relaxed text-gray-600">
                  No forced topics. No corporate noise. Just conversations
                  around the realities of building and running a business.
                </p>
              </div>

              <div className="border-l border-gray-300">
                {topics.map((topic, index) => (
                  <div
                    key={topic}
                    className="group flex items-center justify-between border-b border-gray-300 py-6 pl-6 transition-colors hover:bg-[#f1f1f1] sm:pl-8"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-xs text-gray-400">
                        0{index + 1}
                      </span>

                      <span className="text-lg font-medium sm:text-xl">
                        {topic}
                      </span>
                    </div>

                    <ArrowUpRight className="mr-2 h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:mr-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY PRINCIPLES */}
        <section className="border-b border-gray-300 bg-[#f1f1f1] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  The kind of community we want
                </p>

                <h2 className="max-w-2xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-6xl">
                  Come for the conversation.
                  <br />
                  <span className="text-emerald-900">
                    Stay for the people.
                  </span>
                </h2>
              </div>

              <div className="border-t border-gray-300">
                {communityValues.map((value, index) => (
                  <div
                    key={value}
                    className="flex items-center gap-5 border-b border-gray-300 py-6"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-gray-300 text-xs font-semibold">
                      {index + 1}
                    </span>

                    <span className="text-lg font-medium">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHATSAPP CTA */}
        <section className="bg-emerald-900 px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <div className="mb-7 flex h-12 w-12 items-center justify-center border border-emerald-700">
                  <MessageCircle className="h-5 w-5 text-emerald-200" />
                </div>

                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Coming soon on WhatsApp
                </p>

                <h2 className="max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                  The conversation
                  <br />
                  starts here.
                </h2>
              </div>

              <div className="lg:pl-12">
                <p className="max-w-lg text-lg leading-relaxed text-emerald-50">
                  We are opening the Monietar community on WhatsApp soon.
                  A place to meet other business owners, exchange ideas, ask
                  questions, and learn together.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}