'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Building2, Clock, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5 text-emerald-600" />,
      title: 'Email Support',
      description: 'For general inquiries, account assistance, or product support issues.',
      contact: 'support@algoritic.com'
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      title: 'Partnerships & Press',
      description: 'Looking to partner with us or integrate our digital solutions?',
      contact: 'hello@algoritic.com'
    }
  ];

  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-40 pb-16 bg-[#FCFCFD]">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
              Connect With Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              We're here to help your <br />business grow.
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
              Have questions about our software platforms, dedicated hardware, or custom business solutions? Reach out and our team will get back to you swiftly.
            </p>
          </div>
        </section>

        {/* --- MAIN CONTACT CONTENT --- */}
        <section className="pb-24 bg-[#FCFCFD]">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* LEFT COLUMN: CONTACT CHANNELS & OFFICE INFO */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Communication Channels
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Select the most relevant point of contact to ensure your inquiry routes directly to the right department.
                  </p>
                </div>

                {/* Direct Channels */}
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex gap-4 items-start hover:border-slate-300 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {method.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                          {method.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed font-normal">
                          {method.description}
                        </p>
                        <a 
                          href={`mailto:${method.contact}`}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 pt-1 group"
                        >
                          {method.contact}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-slate-200/60" />

                {/* Additional Metadata */}
                <div className="space-y-4 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Algoritic Inc. &bull; Software Architecture Agency & Solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Operating Hours: Monday – Friday, 9:00 AM – 5:00 PM (WAT)</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SECURE INTERACTIVE CONTACT FORM */}
              <div className="lg:col-span-7">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="first-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first-name"
                          required
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all font-medium"
                          placeholder="John"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="last-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last-name"
                          required
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all font-medium"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all font-medium"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Inquiry Subject
                      </label>
                      <select
                        id="subject"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-slate-300 focus:bg-white transition-all font-medium appearance-none"
                      >
                        <option value="general">General Inquiries</option>
                        <option value="hardware">Monietar TAP Hardware</option>
                        <option value="software">Software Customization</option>
                        <option value="partnership">Business Partnership</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all font-medium resize-none"
                        placeholder="Detail how our software solutions or hardware parameters can assist your operations..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-md transition-all active:scale-[0.99]"
                    >
                      Send Message
                    </button>

                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
