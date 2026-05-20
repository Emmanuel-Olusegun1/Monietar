"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-0">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-6">Terms & Conditions</h1>
          <p className="text-lg text-gray-700 mb-4">
            Please read these terms and conditions carefully before using Monietar. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Use of Service</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Use Monietar only for lawful purposes</li>
              <li>Do not misuse or attempt to disrupt our services</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Liability</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Monietar is provided "as is" without warranties</li>
              <li>We are not liable for indirect or consequential damages</li>
              <li>Users are responsible for their own financial decisions</li>
            </ul>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Changes</h2>
            <p className="text-gray-700">We may update these terms from time to time. Continued use of Monietar means you accept the new terms.</p>
          </div>
          <div className="mt-8">
            <p className="text-gray-700">For questions, contact <a href="mailto:legal@monietar.com" className="text-emerald-700 underline">legal@monietar.com</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
