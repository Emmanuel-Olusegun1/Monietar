'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Modular section imports from the local blog directory
import BlogHero from './hero';
import BlogPostsGrid from './posts-grid';

export default function BlogPage() {
  return (
    <div className="bg-[#FCFCFD] text-slate-900 min-h-screen font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-900">
      <Header />

      <main>
        {/* Editorial Announcement / Hero Section */}
        <BlogHero />

        {/* Dynamic Categorized Post Grid Grid */}
        <BlogPostsGrid />
      </main>

      <Footer />
    </div>
  );
}
