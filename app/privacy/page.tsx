'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, ArrowRight } from 'lucide-react';


export default function PrivacyPolicyPage() {
  const lastUpdated = 'June 7, 2026';

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* HERO / DOCUMENT HEADER */}
        <section className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-24 lg:pt-36">
          <div className="mx-auto max-w-[1440px]">
            <div className="pt-10 sm:pt-14 lg:pt-16">
           <h1 className="max-w-5xl text-[clamp(3rem,7.5vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-gray-900">
                Privacy
                <br />
                <span className="text-emerald-900">Policy.</span>
              </h1>

              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-300 pt-7 sm:grid-cols-[1fr_1.5fr] lg:mt-16">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Last updated
                  </span>

                  <p className="mt-3 text-sm font-medium text-gray-900">
                    {lastUpdated}
                  </p>
                </div>

                <p className="max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  This policy explains how Monietar collects, uses, protects,
                  and manages information when you use our products and
                  services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  1. Introduction
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Your data deserves to be handled with care.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  Welcome to Monietar (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                  &ldquo;us&rdquo;), a digital financial intelligence and
                  automated ledger platform operated under Algoritic Inc. We
                  are committed to protecting your privacy and ensuring the
                  security of the commercial data you entrust to us.
                </p>

                <p>
                  This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you access our website,
                  applications, automated bookkeeping frameworks, and any
                  related financial tracking utilities. Please read this
                  document carefully. If you do not agree with the terms of
                  this privacy policy, please do not access the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INFORMATION WE COLLECT */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  2. Information We Collect
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  The information needed to run the platform.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="mb-8 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  To provide unified multi-currency ledger tracking and cash
                  flow synchronization, we collect data in the following core
                  categories:
                </p>

                <div className="border-t border-gray-300">
                  <div className="border-b border-gray-300 py-7">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Account Credentials
                    </h3>
                    <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                      Name, professional email address, organization name, and
                      system authentication parameters.
                    </p>
                  </div>

                  <div className="border-b border-gray-300 py-7">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Financial Metadata
                    </h3>
                    <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                      Transaction histories, balance counts, currency
                      variables, ledger entries, and multi-currency settlement
                      tracking data aggregated from your business accounts.
                    </p>
                  </div>

                  <div className="border-b border-gray-300 py-7">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Integrations Data
                    </h3>
                    <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                      When you connect external pipelines or business software
                      to our automated framework, we ingest read-only
                      analytical records required to feed your real-time
                      command dashboard.
                    </p>
                  </div>

                  <div className="py-7">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Technical Device Ingestions
                    </h3>
                    <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                      IP addresses, browser variants, operating system
                      contexts, and access timelines utilized strictly for
                      platform optimization, security, and verification logs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW WE USE YOUR INFORMATION */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  3. How We Use Your Information
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Information should serve a purpose.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  We process information solely to execute our service
                  deliverables and maintain strict platform integrity. Explicit
                  operational paths include:
                </p>

                <div className="mt-8 border-t border-gray-200">
                  {[
                    'Providing real-time cash flow synchronization and cross-border reconciliation updates.',
                    'Parsing context to eliminate manual bookkeeping tracking overhead via AI-native routines.',
                    'Monitoring, detecting, and mitigating fraudulent behaviors, security vulnerabilities, or unauthorized access attempts.',
                    'Fulfilling compliance directives, audit workflows, and regional commercial standards.',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="grid grid-cols-[40px_1fr] gap-4 border-b border-gray-200 py-6"
                    >
                      <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                        0{index + 1}
                      </span>

                      <p className="text-sm font-light leading-6 text-gray-500">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DATA PROTECTION */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
           <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  4. Data Protection & Encryption Architecture
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Protection is part of the architecture.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  We treat transaction records and ledger metrics with
                  enterprise-grade protection criteria. All data streams
                  ingested by Monietar are encrypted in transit using Transport
                  Layer Security (TLS) and at rest using AES-256 standard
                  cryptographic suites.
                </p>

                <p>
                  Our structural pipelines rely heavily on{' '}
                  <strong className="font-semibold text-gray-900">
                    read-only direct data synchronization
                  </strong>
                  . Monietar does not store, hold, or directly manipulate your
                  underlying bank credentials or transactional capital roots.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SHARING & DISCLOSURE */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
       <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  5. Sharing and Disclosure of Data
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Your information is not a product.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  We do not sell, rent, or trade your corporate information or
                  transaction footprints to third-party data brokers or
                  marketing houses. Information disclosures occur exclusively
                  under the following boundaries:
                </p>

                <div className="mt-8 border-t border-gray-200">
                  <div className="border-b border-gray-200 py-7">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Third-Party Cloud Infrastructure
                    </h3>

                    <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                      With verified cloud hosting, database platforms (e.g.,
                      Supabase, Prisma-connected environments), and utility
                      providers working under strict data processing mandates.
                    </p>
                  </div>

                  <div className="py-7">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Legal Demands
                    </h3>

                    <p className="mt-3 text-sm font-light leading-6 text-gray-500">
                      When strictly required to conform to enforceable legal
                      processes, regulatory reviews, or court citations issued
                      by authorized regional authorities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHTS */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  6. Your Rights and Data Controls
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  You have control over your data.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Depending on your operating region, your business entity and
                  administrative teams retain full rights over your processed
                  data footprint, including:
                </p>

                <div className="mt-8 border-t border-gray-300">
                  {[
                    'The right to request immediate erasure of your historical user profiles and synchronized ledger caching traces.',
                    'The right to inspect the exact parameters of transaction metadata currently stored across our systems.',
                    'The right to sever any external data integrations or read-only software pipelines instantly from your settings console.',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="grid grid-cols-[40px_1fr] gap-4 border-b border-gray-300 py-6"
                    >
                      <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
                        0{index + 1}
                      </span>

                      <p className="text-sm font-light leading-6 text-gray-500">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY ADJUSTMENTS */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  7. Policy Adjustments
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Policies evolve with the platform.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  We reserve the right to modify this Privacy Policy at any
                  time to reflect changing technical capabilities or regulatory
                  demands. We will notify users of significant changes by
                  placing a noticeable alert across our active platform
                  workspace or via direct email correspondence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
       <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  8. Legal Contact Information
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Questions about your data?
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  If you have questions, notes, or data processing grievances
                  regarding this operational framework, please reach out
                  directly via:
                </p>

                <div className="mt-8 border-t border-gray-300">
                  <div className="grid grid-cols-[120px_1fr] border-b border-gray-300 py-5 text-sm">
                    <span className="text-gray-400">Entity</span>
                    <span className="font-medium text-gray-900">
                      Monietar <span className='text-gray-400'>Powered by <a href='algoritic.com.ng' target='_blank' rel='noopener noreferrer' className='underline decoration-gray-300 underline-offset-4 transition-colors hover:text-emerald-900 hover:decoration-emerald-900'>Algoritic Inc.</a></span>
                    </span>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] border-b border-gray-300 py-5 text-sm">
                    <span className="text-gray-400">Inquiries Email</span>

                    <a
                      href="mailto:hello@monietar.com.ng"
                      className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-emerald-900 hover:decoration-emerald-900"
                    >
                      hello@monietar.com.ng
                    </a>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] py-5 text-sm">
                    <span className="text-gray-400">Attention</span>
                    <span className="font-medium text-gray-900">
                      Data Privacy & Compliance Desk
                    </span>
                  </div>
                </div>

                <a
                  href="mailto:hello@monietar.com.ng"
                  className="group mt-8 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
                >
                  Contact privacy desk
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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