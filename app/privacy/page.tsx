'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 7, 2026";

  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">
      <Header />

      <main className="relative pt-28 pb-24 overflow-hidden">
        {/* Subtle background blur for structural layout consistency */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/[0.01] rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-8 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
              Legal Framework
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-slate-500 text-sm">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Legal Body Copy */}
          <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-8 font-normal">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Introduction</h2>
              <p>
                Welcome to Monietar (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), a digital financial intelligence and automated ledger platform operated under Algoritic Inc. We are committed to protecting your privacy and ensuring the security of the commercial data you entrust to us. 
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access our website, applications, automated bookkeeping frameworks, and any related financial tracking utilities. Please read this document carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Information We Collect</h2>
              <p>
                To provide unified multi-currency ledger tracking and cash flow synchronization, we collect data in the following core categories:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong className="text-slate-900">Account Credentials:</strong> Name, professional email address, organization name, and system authentication parameters.
                </li>
                <li>
                  <strong className="text-slate-900">Financial Metadata:</strong> Transaction histories, balance counts, currency variables, ledger entries, and multi-currency settlement tracking data aggregated from your business accounts.
                </li>
                <li>
                  <strong className="text-slate-900">Integrations Data:</strong> When you connect external pipelines or business software to our automated framework, we ingest read-only analytical records required to feed your real-time command dashboard.
                </li>
                <li>
                  <strong className="text-slate-900">Technical Device Ingestions:</strong> IP addresses, browser variants, operating system contexts, and access timelines utilized strictly for platform optimization, security, and verification logs.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. How We Use Your Information</h2>
              <p>
                We process information solely to execute our service deliverables and maintain strict platform integrity. Explicit operational paths include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Providing real-time cash flow synchronization and cross-border reconciliation updates.</li>
                <li>Parsing context to eliminate manual bookkeeping tracking overhead via AI-native routines.</li>
                <li>Monitoring, detecting, and mitigating fraudulent behaviors, security vulnerabilities, or unauthorized access attempts.</li>
                <li>Fulfilling compliance directives, audit workflows, and regional commercial standards.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Data Protection & Encryption Architecture</h2>
              <p>
                We treat transaction records and ledger metrics with enterprise-grade protection criteria. All data streams ingested by Monietar are encrypted in transit using Transport Layer Security (TLS) and at rest using AES-256 standard cryptographic suites. 
              </p>
              <p>
                Our structural pipelines rely heavily on <strong className="text-slate-900">read-only direct data synchronization</strong>. Monietar does not store, hold, or directly manipulate your underlying bank credentials or transactional capital roots.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Sharing and Disclosure of Data</h2>
              <p>
                We do not sell, rent, or trade your corporate information or transaction footprints to third-party data brokers or marketing houses. Information disclosures occur exclusively under the following boundaries:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong className="text-slate-900">Third-Party Cloud Infrastructure:</strong> With verified cloud hosting, database platforms (e.g., Supabase, Prisma-connected environments), and utility providers working under strict data processing mandates.
                </li>
                <li>
                  <strong className="text-slate-900">Legal Demands:</strong> When strictly required to conform to enforceable legal processes, regulatory reviews, or court citations issued by authorized regional authorities.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Your Rights and Data Controls</h2>
              <p>
                Depending on your operating region, your business entity and administrative teams retain full rights over your processed data footprint, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>The right to request immediate erasure of your historical user profiles and synchronized ledger caching traces.</li>
                <li>The right to inspect the exact parameters of transaction metadata currently stored across our systems.</li>
                <li>The right to sever any external data integrations or read-only software pipelines instantly from your settings console.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Policy Adjustments</h2>
              <p>
                We reserve the right to modify this Privacy Policy at any time to reflect changing technical capabilities or regulatory demands. We will notify users of significant changes by placing a noticeable alert across our active platform workspace or via direct email correspondence. 
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. Legal Contact Information</h2>
              <p>
                If you have questions, notes, or data processing grievances regarding this operational framework, please reach out directly via:
              </p>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 space-y-1">
                <div><span className="text-slate-400">Entity:</span> Algoritic Inc.</div>
                <div><span className="text-slate-400">Inquiries Email:</span> info@algoritic.com.ng</div>
                <div><span className="text-slate-400">Attention:</span> Data Privacy & Compliance Desk</div>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
