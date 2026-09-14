'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ArrowUpRight,
  Bell,
  Video,
} from 'lucide-react';

export default function WebinarPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] font-sans text-gray-900 antialiased selection:bg-emerald-900/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* Hero */}
        <section className="px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                <h1 className="mt-5 max-w-6xl text-[clamp(3.2rem,8vw,8rem)] font-bold leading-[0.88] tracking-[-0.065em] text-gray-950">
                Conversations for
                <br />
                <span className="text-emerald-900">
                  smarter businesses.
                </span>
              </h1>
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Coming soon
                </span>

                <p className="mt-3 text-sm font-medium text-gray-900">
                  Our webinar series is taking shape.
                </p>
              </div>

              <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                We’re preparing practical conversations around cash flow,
                financial visibility, business operations, sourcing, and the
                realities of building and growing an SME in Africa.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Meta */}
              <div>
                <div className="flex items-start justify-between border-b border-gray-300 pb-6">
                  <span className="font-mono text-[10px] tracking-widest text-gray-400">
                    
                  </span>

                  <Video className="h-5 w-5 text-emerald-900" />
                </div>

                <div className="mt-8">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                    First session
                  </span>

                  <p className="mt-4 max-w-sm text-xs leading-5 text-gray-400">
                    The first Monietar webinar is currently being planned.
                    Details will be announced here once the session is ready.
                  </p>
                </div>
              </div>

              {/* Main */}
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Nothing scheduled yet
                </span>

                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-gray-950 sm:text-5xl lg:text-6xl">
                  We’re not ready to put a date on the calendar
                  <span className="text-emerald-900"> just yet.</span>
                </h2>

                <p className="mt-7 max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Rather than fill this space with events that do not exist,
                  we’re keeping it simple. When Monietar hosts its first
                  webinar, this is where you’ll find the topic, speakers,
                  schedule, and registration details.
                </p>

                <div className="mt-10 border-t border-gray-200 pt-7">
                  <div className="flex items-start gap-4">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-emerald-900" />

                    <div>
                      <p className="text-sm font-semibold text-gray-950">
                        No upcoming sessions
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Check back here when the first Monietar webinar is
                        announced.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="bg-[#f1f1f1] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <motion.div
              className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-950 sm:text-5xl">
                  Practical conversations.
                  <br />
                  <span className="text-emerald-900">
                    Not empty presentations.
                  </span>
                </h2>
              </div>

              <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                Future sessions will focus on the financial and operational
                problems business owners actually deal with, and the
                decisions that help them build healthier, more visible
                businesses.
              </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 border-t border-gray-300 md:grid-cols-2">
              {[
                {
                  number: '',
                  title: 'Cash Flow',
                  detail:
                    'Understanding where money comes from, where it goes, and why visibility matters.',
                },
                {
                  number: '',
                  title: 'Financial Intelligence',
                  detail:
                    'Turning everyday business activity into information that supports better decisions.',
                },
                {
                  number: '',
                  title: 'Business Operations',
                  detail:
                    'Building systems around the work that keeps growing businesses moving.',
                },
                {
                  number: '',
                  title: 'Cross-Border Commerce',
                  detail:
                    'Navigating sourcing, currencies, costs, and margins as businesses expand across markets.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.number}
                  className={`border-b border-gray-300 py-8 md:px-8 ${
                    index % 2 === 0
                      ? 'md:border-r md:pl-0'
                      : 'md:pr-0'
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                >
                  <span className="font-mono text-[10px] tracking-widest text-gray-400">
                    {item.number}
                  </span>

                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-gray-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
