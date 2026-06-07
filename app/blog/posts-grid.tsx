'use client';

import { useState } from 'react';
import { Search, Calendar, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 'monietar-beta-announcement',
    title: 'Designing the Monietar Beta Engine: Phased Automation for Global Accounts',
    excerpt: 'An inside look at our roadmap, engineering constraints, and why we are executing our upcoming private beta launch ahead of our full distribution target.',
    category: 'Engineering',
    date: 'May 2026',
    readTime: '6 min read'
  },
  {
    id: 'campuusx-milestones',
    title: 'Scaling CampuusX: Handling 56 Active Resource Clusters Under Peak Operations',
    excerpt: 'How optimization iterations and data-sharing architectural changes helped us manage high volumes of resource upvotes seamlessly.',
    category: 'Ecosystem',
    date: 'January 2026',
    readTime: '5 min read'
  },
  {
    id: 'building-in-public-sme',
    title: 'Why Digital Agencies Must Build in Public: Driving Clear SME Business Value',
    excerpt: 'Shifting away from hidden development boxes. Exploring how radical engineering transparency directly improves trust with cross-border business managers.',
    category: 'Product Strategy',
    date: 'November 2025',
    readTime: '3 min read'
  }
];

export default function BlogPostsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Engineering', 'Product Strategy', 'Ecosystem'];

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <section className="py-16 bg-slate-50/40 border-t border-slate-200/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors group"
            >
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                  {post.category}
                </span>
                
                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Action and date footer layout */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                <span className="flex items-center gap-1 text-slate-900 font-bold group-hover:text-emerald-600 transition-colors">
                  Read Article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
