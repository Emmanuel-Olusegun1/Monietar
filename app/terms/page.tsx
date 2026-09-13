'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export default function TermsOfServicePage() {
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
                Terms of
                <br />
                <span className="text-emerald-900">Service.</span>
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
                  These Terms explain the rules, responsibilities, and
                  conditions that apply when you access and use Monietar and
                  its financial intelligence services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AGREEMENT TO TERMS */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  1. Agreement to Terms
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Using Monietar means agreeing to these terms.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  These Terms of Service (&ldquo;Terms&rdquo;) constitute a
                  legally binding agreement between you, whether personally or
                  on behalf of an entity (&ldquo;you,&rdquo; &ldquo;user,&rdquo;
                  or &ldquo;Customer&rdquo;), and Monietar, operated under
                  Algoritic Inc. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                  &ldquo;our&rdquo;).
                </p>

                <p>
                  These Terms govern your access to and use of the Monietar
                  website, applications, financial ledger synchronization
                  systems, and related services.
                </p>

                <p>
                  By accessing or using Monietar, you acknowledge that you have
                  read, understood, and agreed to be bound by these Terms. If
                  you do not agree with them, you should not access or use the
                  platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION OF SERVICE */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  2. Description of Service
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Financial visibility without taking control of your money.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  Monietar provides financial intelligence, automated ledger
                  coordination, and business cash flow visibility tools.
                  Our services are designed to help businesses understand,
                  organize, and monitor financial activity across connected
                  business systems.
                </p>

                <p>
                  The platform may aggregate financial metadata, normalize
                  multi-currency activity, provide cash flow insights, and
                  present business financial information through a centralized
                  workspace.
                </p>

                <p>
                  Monietar primarily utilizes{' '}
                  <strong className="font-semibold text-gray-900">
                    read-only access layers
                  </strong>
                  . We do not initiate payment distributions, manage active
                  cash deposits, execute asset transfers, or operate as a
                  licensed banking institution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* USER ACCOUNTS */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  3. User Accounts & Registration
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Your account comes with responsibilities.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  To access certain Monietar services, you may be required to
                  create an account or business workspace. You agree to provide
                  accurate, current, and complete information during
                  registration and to keep that information updated.
                </p>

                <p>
                  You are responsible for protecting your account credentials,
                  authentication information, and authorized access tokens.
                </p>

                <p>
                  You must promptly notify us if you believe your account has
                  been compromised, accessed without authorization, or used in
                  a manner that you did not approve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROHIBITED BEHAVIOURS */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  4. Prohibited System Behaviors
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Use the platform responsibly.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  You may use Monietar only for legitimate business and
                  financial management purposes. You agree not to:
                </p>

                <div className="mt-8 border-t border-gray-300">
                  {[
                    'Bypass, disable, or interfere with system security controls, authentication mechanisms, token validation, or encryption systems.',
                    'Deploy automated scrapers, spiders, bots, or unauthorized extraction systems against the Monietar platform.',
                    'Use Monietar or its generated insights to violate applicable laws, regulations, trade requirements, or fraud prevention standards.',
                    'Attempt to reverse-engineer, decompile, disassemble, or discover the underlying source architecture of the platform.',
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

        {/* THIRD PARTY INTEGRATIONS */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  5. Third-Party Integrations & Data Rights
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Connected systems remain responsible for their own services.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  Monietar may connect with external financial software,
                  payment channels, banking systems, and other business
                  services through supported integrations and APIs.
                </p>

                <p>
                  By connecting an external service, you confirm that you have
                  the authority and necessary permissions to grant Monietar
                  access to the relevant data.
                </p>

                <p>
                  We are not responsible for the availability, performance,
                  accuracy, security, or downtime of third-party services.
                  Their own terms, policies, and service conditions may also
                  apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTELLECTUAL PROPERTY */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  6. Intellectual Property
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  The platform remains our intellectual property.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  The Monietar platform, including its architecture, software,
                  database structures, interface designs, visual systems,
                  logos, trademarks, written content, and other proprietary
                  materials, is owned by or licensed to Algoritic Inc. and is
                  protected by applicable intellectual property laws.
                </p>

                <p>
                  Subject to these Terms, we grant you a limited,
                  non-exclusive, non-transferable, and revocable right to use
                  the platform for its intended business purposes.
                </p>

                <p>
                  No ownership rights are transferred to you through your use
                  of Monietar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  7. Disclaimer of Warranties
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Financial intelligence is not a substitute for judgment.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  Monietar is provided on an &ldquo;as-is&rdquo; and
                  &ldquo;as-available&rdquo; basis. We do not guarantee
                  uninterrupted availability, complete accuracy of processed
                  information, or that the platform will always operate
                  without delays, interruptions, or synchronization issues.
                </p>

                <p>
                  While Monietar is designed to improve financial visibility
                  and reduce manual bookkeeping overhead, you remain
                  responsible for independently reviewing financial information
                  before making significant business, investment, accounting,
                  or tax decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIMITATION OF LIABILITY */}
        <section className="bg-[#f1f1f1] px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  8. Limitations of Liability
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Some risks cannot be transferred to us.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  To the maximum extent permitted by applicable law, Algoritic
                  Inc., its directors, officers, employees, partners, and
                  service providers will not be liable for indirect,
                  incidental, consequential, special, exemplary, or punitive
                  damages arising from your use of or inability to use
                  Monietar.
                </p>

                <p>
                  This includes, where permitted by law, losses relating to
                  revenue, profits, business opportunities, business
                  interruption, or corruption or loss of data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TERMINATION */}
        <section className="bg-white px-5 pb-15">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-16">
              <div>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  9. Service Termination
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Access can end when the terms are breached.
                </h2>
              </div>

              <div className="max-w-2xl space-y-6 text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                <p>
                  We reserve the right to suspend, restrict, or terminate
                  access to Monietar where reasonably necessary, including when
                  a user violates these Terms, misuses the platform, creates
                  security risks, or engages in unlawful activity.
                </p>

                <p>
                  You may discontinue your use of Monietar at any time and may
                  request deletion of your account or applicable personal
                  information through the available account controls or by
                  contacting us.
                </p>

                <p>
                  Provisions that by their nature should survive termination,
                  including intellectual property, disclaimers, limitations of
                  liability, and applicable legal obligations, will continue to
                  apply.
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
                  10. Legal Contact Information
                </p>

                <h2 className="max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-gray-900 sm:text-5xl">
                  Questions about these terms?
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-light leading-7 text-gray-600 sm:text-base sm:leading-8">
                  For official notices, questions about these Terms, or
                  operational and legal inquiries, please contact us directly.
                </p>

                <div className="mt-8 border-t border-gray-300">
                  <div className="grid grid-cols-[120px_1fr] border-b border-gray-300 py-5 text-sm">
                    <span className="text-gray-400">Entity</span>

                    <span className="font-medium text-gray-900">
                      Monietar{' '}
                      <span className="text-gray-400">
                        Powered by{' '}
                        <a
                          href="https://algoritic.com.ng"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-gray-300 underline-offset-4 transition-colors hover:text-emerald-900 hover:decoration-emerald-900"
                        >
                          Algoritic Inc.
                        </a>
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] border-b border-gray-300 py-5 text-sm">
                    <span className="text-gray-400">
                      Inquiries Email
                    </span>

                    <a
                      href="mailto:hello@monietar.com.ng"
                      className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-emerald-900 hover:decoration-emerald-900"
                    >
                      hello@monietar.com.ng
                    </a>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] py-5 text-sm">
                    <span className="text-gray-400">
                      Attention
                    </span>

                    <span className="font-medium text-gray-900">
                      Terms & Corporate Compliance Desk
                    </span>
                  </div>
                </div>

                <a
                  href="mailto:hello@monietar.com.ng"
                  className="group mt-8 inline-flex items-center gap-3 border border-gray-900 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
                >
                  Contact legal desk

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
