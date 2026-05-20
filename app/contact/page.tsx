"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-0">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-6">Contact Monietar</h1>
          <p className="text-lg text-gray-700 mb-4">
            We’d love to hear from you! Whether you have questions, feedback, or partnership inquiries, reach out and our team will get back to you soon.
          </p>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Contact Information</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Email: <a href="mailto:support@monietar.com" className="text-emerald-700 underline">support@monietar.com</a></li>
              <li>Phone: <a href="tel:+2348000000000" className="text-emerald-700 underline">+234 800 000 0000</a></li>
              <li>Address: 123 Fintech Avenue, Lagos, Nigeria</li>
            </ul>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Send Us a Message</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              <input type="email" placeholder="Your Email" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              <textarea placeholder="Your Message" className="w-full border border-gray-300 rounded-lg px-4 py-2" rows={4}></textarea>
              <button type="submit" className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition">Send</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
