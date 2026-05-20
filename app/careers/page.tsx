"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-0">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-6">Careers at Monietar</h1>
          <p className="text-lg text-gray-700 mb-4">
            Join our mission to revolutionize financial management for African SMEs and individuals. We’re always looking for passionate, talented people to help us build the future of fintech.
          </p>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Open Roles</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Frontend Engineer (React/Next.js)</li>
              <li>Backend Engineer (Node.js, AWS)</li>
              <li>Product Designer (UI/UX)</li>
              <li>Growth & Marketing Lead</li>
              <li>Customer Success Specialist</li>
            </ul>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Why Monietar?</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Remote-first, flexible work culture</li>
              <li>Competitive compensation and benefits</li>
              <li>Opportunities for growth and learning</li>
              <li>Impactful work in a fast-growing sector</li>
            </ul>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">How to Apply</h2>
            <p className="text-gray-700">Send your CV and a short cover letter to <a href="mailto:careers@monietar.com" className="text-emerald-700 underline">careers@monietar.com</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
