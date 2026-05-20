"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-0">
        <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-6">Features</h1>
          <p className="text-lg text-gray-700 mb-8">Something cool is being developed for your business finance. Stay tuned for powerful features that will transform the way you manage money!</p>
          <div className="flex justify-center">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
