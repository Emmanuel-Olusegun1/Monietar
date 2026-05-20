"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-white">
      <Header />
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="w-full py-24 px-4 md:px-0 border-b border-emerald-100 flex items-center justify-center" style={{minHeight: '60vh'}}>
          <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-8">
            <h1 className="text-6xl font-extrabold text-emerald-800 leading-tight drop-shadow-lg">Monietar</h1>
            <p className="text-2xl text-gray-700 max-w-2xl mx-auto">AI-powered cash flow intelligence for African SMEs and individuals. Predict trends, optimize operations, and grow with confidence.</p>
            <span className="inline-block bg-emerald-100 text-emerald-800 font-semibold px-5 py-2 rounded-full text-base mt-2 mb-2 shadow-sm">
              A product of <a href="https://algoritic.com.ng" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-900">Algoritic Inc.</a>
            </span>
            <a href="/contact" className="inline-block bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-emerald-800 transition text-lg mt-4">Get Started</a>
          </div>
        </section>

        {/* About Product Section */}
        <section className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-gray-100 -mt-16 z-10 relative" style={{marginTop: '-4rem'}}>
          <h2 className="text-3xl font-extrabold text-emerald-800 mb-6 text-center">Why Monietar?</h2>
          <p className="text-lg text-gray-600 mb-10 text-center">
            Built for the realities of African business and personal finance. Monietar combines advanced AI, seamless integrations, and a beautiful, intuitive interface to help you take control of your money—no matter your background or goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-emerald-50 rounded-xl p-6 shadow">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Smarter Insights</h3>
              <p className="text-gray-700">AI-driven recommendations tailored to your unique financial patterns and goals.</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-6 shadow">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Effortless Tracking</h3>
              <p className="text-gray-700">Track spending, income, and budgets with ease—across all your accounts, in one place.</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-6 shadow">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Secure & Private</h3>
              <p className="text-gray-700">Your data is protected with industry-leading security and privacy standards.</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-6 shadow">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Built for Africa</h3>
              <p className="text-gray-700">Local context, local support, and features designed for African markets and currencies.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mt-8">
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-emerald-700 mb-2">Who We Serve</h4>
              <p className="text-gray-700">Entrepreneurs, SMEs, and individuals seeking smarter, simpler financial management.</p>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-emerald-700 mb-2">Our Commitment</h4>
              <p className="text-gray-700">Continuous innovation, user-first design, and a relentless focus on your financial well-being.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-extrabold text-emerald-800 mb-8 text-center tracking-tight">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-700">Personalized recommendations and forecasts to help you make smarter decisions.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Comprehensive Budgeting</h3>
              <p className="text-gray-700">Set, track, and achieve your financial goals with powerful budgeting tools.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Bank Integrations</h3>
              <p className="text-gray-700">Connect securely to your bank accounts for real-time tracking and insights.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Data Privacy & Security</h3>
              <p className="text-gray-700">Your privacy is our priority. We use best-in-class security to keep your data safe.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="max-w-3xl mx-auto mt-24 text-center">
          <h2 className="text-3xl font-extrabold text-emerald-700 mb-4">Ready to experience Monietar?</h2>
          <p className="text-lg text-gray-700 mb-8">Join thousands of users who trust Monietar to manage, grow, and understand their finances.</p>
          <a href="/contact" className="inline-block bg-emerald-700 text-white font-semibold px-10 py-5 rounded-2xl shadow-xl hover:bg-emerald-800 transition text-xl">Get Started Today</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
