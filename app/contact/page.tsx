'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Building2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function ContactPage() {
  const contactEmail = 'YOUR_PRIVACY_TERMS_EMAIL';

  const contactMethods = [
    {
      icon: Mail,
      number: '01',
      title: 'General inquiries',
      description:
        'Questions about Monietar, your account, waitlist access, or how the platform works.',
      contact: contactEmail,
    },
    {
      icon: MessageSquare,
      number: '02',
      title: 'Partnerships & support',
      description:
        'For partnerships, integrations, business conversations, or product-related support.',
      contact: contactEmail,
    },
  ];

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
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Contact
              </span>

              <h1 className="mt-5 max-w-6xl text-[clamp(3.2rem,8vw,8rem)] font-bold leading-[0.88] tracking-[-0.065em] text-gray-950">
                Let’s talk about
                <br />
                <span className="text-emerald-900">
                  your business.
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
                  Get in touch
                </span>

                <p className="mt-3 text-sm font-medium text-gray-900">
                  We’re here to help
                </p>
              </div>

              <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                Have a question about Monietar, need help with your account,
                or want to explore a business partnership? Send us a message
                and we’ll get back to you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <div className="border-b border-gray-300 pb-6">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                    Communication channels
                  </span>

                  <h2 className="mt-5 max-w-lg text-3xl font-bold leading-[1] tracking-[-0.045em] text-gray-950 sm:text-4xl">
                    Start with the right conversation.
                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
                    Choose the channel that best matches what you need. Our
                    team will route your message to the right place.
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;

                    return (
                      <div
                        key={method.number}
                        className="py-8 first:pt-8"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-[10px] tracking-widest text-gray-400">
                            {method.number}
                          </span>

                          <Icon className="h-5 w-5 text-emerald-900" />
                        </div>

                        <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-gray-950">
                          {method.title}
                        </h3>

                        <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                          {method.description}
                        </p>

                        <a
                          href={`mailto:${method.contact}`}
                          className="mt-5 inline-flex items-center gap-2 border-b border-gray-300 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-700 transition-colors hover:border-emerald-900 hover:text-emerald-900"
                        >
                          {method.contact}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>

                {/* Company Details */}
                <div className="mt-4 border-t border-gray-300 pt-6">
                  <div className="flex flex-col gap-4 text-xs text-gray-500">
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                      <span>
                        Monietar
                        <br />
                        Financial intelligence for growing businesses.
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                      <span>
                        Operating hours
                        <br />
                        Monday – Friday, 9:00 AM – 5:00 PM (WAT)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                <div className="border-t border-gray-300">
                  <div className="flex items-center justify-between border-b border-gray-200 py-5">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Send a message
                    </span>

                    <span className="font-mono text-[9px] tracking-widest text-gray-400">
                      CONTACT / 01
                    </span>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="pt-8"
                  >
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="first-name"
                          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400"
                        >
                          First name
                        </label>

                        <input
                          type="text"
                          id="first-name"
                          required
                          placeholder="John"
                          className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-950 placeholder:text-gray-300 focus:border-emerald-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="last-name"
                          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400"
                        >
                          Last name
                        </label>

                        <input
                          type="text"
                          id="last-name"
                          required
                          placeholder="Doe"
                          className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-950 placeholder:text-gray-300 focus:border-emerald-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400"
                      >
                        Email address
                      </label>

                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="john@example.com"
                        className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-950 placeholder:text-gray-300 focus:border-emerald-900 focus:outline-none"
                      />
                    </div>

                    <div className="mt-8">
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400"
                      >
                        What can we help with?
                      </label>

                      <select
                        id="subject"
                        defaultValue="general"
                        className="w-full appearance-none border-b border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-700 focus:border-emerald-900 focus:outline-none"
                      >
                        <option value="general">
                          General inquiry
                        </option>
                        <option value="account">
                          Account & product support
                        </option>
                        <option value="partnership">
                          Partnership
                        </option>
                        <option value="integration">
                          Integration
                        </option>
                        <option value="press">
                          Press & media
                        </option>
                      </select>
                    </div>

                    <div className="mt-8">
                      <label
                        htmlFor="message"
                        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400"
                      >
                        Your message
                      </label>

                      <textarea
                        id="message"
                        rows={6}
                        required
                        placeholder="Tell us what you need..."
                        className="w-full resize-none border-b border-gray-300 bg-transparent px-0 py-3 text-sm leading-6 text-gray-950 placeholder:text-gray-300 focus:border-emerald-900 focus:outline-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ x: 3 }}
                      className="mt-8 flex w-full items-center justify-between border-t border-emerald-900 pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900 transition-colors"
                    >
                      <span>Send message</span>

                      <ArrowUpRight className="h-4 w-4" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom Statement */}
        <section className="bg-[#f1f1f1] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="border-t border-gray-300 pt-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Monietar
                  </span>

                  <p className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.035em] text-gray-950 sm:text-3xl">
                    Better financial visibility starts with a conversation.
                  </p>
                </div>

                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900"
                >
                  Email us
                  <ArrowUpRight className="h-4 w-4" />
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
