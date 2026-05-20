"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-0">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-700 mb-4">
            Your privacy is important to us. This policy explains how Monietar collects, uses, and protects your information.
          </p>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">What We Collect</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Personal information (name, email, etc.)</li>
              <li>Financial data (with your consent)</li>
              <li>Usage and analytics data</li>
            </ul>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">How We Use It</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>To provide and improve our services</li>
              <li>To personalize your experience</li>
              <li>To communicate with you</li>
              <li>To ensure security and compliance</li>
            </ul>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Your Rights</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Access, update, or delete your data</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </div>
          <div className="mt-8">
            <p className="text-gray-700">For questions, contact <a href="mailto:privacy@monietar.com" className="text-emerald-700 underline">privacy@monietar.com</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
