'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
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
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-slate-500 text-sm">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Legal Body Copy */}
          <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-8 font-normal">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Agreement to Terms</h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&ldquo;you,&rdquo; &ldquo;user,&rdquo; or &ldquo;Customer&rdquo;), and Monietar, operated by Algoritic Inc. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), concerning your access to and use of the Monietar website, apps, and financial ledger synchronization systems.
              </p>
              <p>
                By accessing or using the platform, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms. If you do not agree with all of these Terms, you are explicitly prohibited from using our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Description of Service</h2>
              <p>
                Monietar provides an automated financial intelligence and real-time ledger coordination framework. Our service aggregates financial metadata, Normalizes multi-currency streams, and builds single-screen visibility into business cash flows. 
              </p>
              <p>
                Our services utilize <strong className="text-slate-900">read-only access layers</strong>. Monietar does not initiate payment distributions, manage active cash deposits, execute asset transfers, or operate as a licensed banking house.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. User Accounts & Registration Integrity</h2>
              <p>
                To access the system workspace, you must create a corporate profile. You agree to provide accurate, current, and complete profile parameters during setup and to update them promptly as changes occur.
              </p>
              <p>
                You assume full responsibility for protecting your access credentials and authorization tokens. You must immediately report any breach of authentication logs or suspected unauthorized use of your merchant account to our security desk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Prohibited System Behaviors</h2>
              <p>
                You may access our bookkeeping interfaces solely for legitimate business management operations. You explicitly agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Bypass, disable, or interfere with system security rules, token validations, or encryption routines.</li>
                <li>Deploy automated scrapers, spiders, or extraction protocols to ingest data matrices from our network clusters.</li>
                <li>Use our tools or generated data insights to break any local, regional, or cross-border trade guidelines, fraud compliance standards, or legal decrees.</li>
                <li>Attempt to reverse-engineer, decompile, or unearth the core source architecture of our context-parsing modules.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Third-Party Integrations & Data Rights</h2>
              <p>
                Monietar links with external financial software interfaces, payment channels, and bank endpoints via API integrations. You guarantee that you hold all required rights, titles, and legal permissions to grant Monietar read-only access to those data pipelines.
              </p>
              <p>
                We accept no accountability or legal liability for the service availability, performance logs, data accuracy, or downtime encountered across any external third-party provider platforms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Intellectual Property Protections</h2>
              <p>
                The platform architecture, website configurations, database schemas, codebases, layout parameters, icon sets, logos, and written copy are the property of Algoritic Inc. and are safeguarded by copyright, trademark, and proprietary property legal frameworks. 
              </p>
              <p>
                You receive a limited, revocable, non-transferable, and non-exclusive license to use our application interfaces strictly in accordance with these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Disclaimer of Warranties</h2>
              <p>
                The service is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; framework. We issue no warranties, express or implied, regarding system uptime, the accuracy of parsed data elements, complete lack of system interruptions, or total absence of ledger sync lags. 
              </p>
              <p>
                While our systems track a 99.9% matching profile, you remain independently responsible for cross-checking your core financial documentation before executing significant operational investments or tax filings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. Limitations of Liability</h2>
              <p>
                To the maximum boundary authorized under local laws, Algoritic Inc., its managers, partners, or software developers will assume no liability for any indirect, specific, secondary, exemplary, or penal commercial losses. This includes lost revenues, missed profits, or data corruption instances rising from your access to or inability to use our platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">9. Service Termination</h2>
              <p>
                We reserve the right to pause, cancel, or terminate your system access credentials instantly, without notice or legal liability, for any reason, including a breach of these Terms. You may cancel your user profile at any time by requesting deletion through your settings menu.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">10. Contact and Legal Reviews</h2>
              <p>
                For official notices, operational clarifications, or system governance queries, reach out directly to our administration office:
              </p>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 space-y-1">
                <div><span className="text-slate-400">Company:</span> Algoritic Inc.</div>
                <div><span className="text-slate-400">Contact Line:</span> info@algoritic.com.ng</div>
                <div><span className="text-slate-400">Desk:</span> Terms & Corporate Compliance Department</div>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
