'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';



type companyProps = {
    title: string
    link: string
  }

  const company: companyProps [] = [
    { 
        title: 'About',
        link: ''
      },
      { 
        title: 'Careers',
        link: '#'
      },
      { 
        title: 'Contact',
        link: '#'
      },
      { 
        title: 'Privacy',
        link: '#'
      },
      { 
        title: 'Terms',
        link: '#'
      },
  ]

export default function Header() {



  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden">
    {/* Background Decorative Elements */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
    </div>
  
    {/* Main Footer Content */}
    <div className="container mx-auto max-w-7xl px-4 py-16 relative z-10">
      {/* Top Section - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
        {/* Brand Column - Spans 2 cols on mobile */}
        <div className="col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">Monietar</span>
              <span className="text-emerald-400 text-sm">Financial Intelligence</span>
            </div>
          </div>
          
          <p className="text-gray-400 mb-8 text-base leading-relaxed max-w-md">
            Empowering African SMEs with AI-driven financial insights for smarter decisions and sustainable growth.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-3">
            {[
              { 
                icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
                label: 'Twitter'
              },
              { 
                icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
                label: 'LinkedIn'
              },
              { 
                icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.40-1.439-1.40z"/></svg>,
                label: 'Instagram'
              }
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                aria-label={social.label}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
  
        {/* Product Links */}
        <div className="">
        <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
  Product
  <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
</h3>
<ul className="space-y-3">
  {[
    { 
      title: 'Features',
      link: ''
    },
    { 
      title: 'Pricing',
      link: '#'
    },
    { 
      title: 'Use Cases',
      link: '#'
    },
    { 
      title: 'Testimonials',
      link: '#'
    },
    { 
      title: 'API',
      link: '#'
    },
  ].map((product, index) => (
    <li key={index}>
      <a 
        href={product.link}
        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
      >
        {product.title}
      </a>
    </li>
  ))}
</ul>
        </div>
  
        {/* Resources Links */}
        <div className="">
          <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
            Resources
            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
          </h3>
          <ul className="space-y-3">
  {[
   
   { 
    title: 'Blog',
    link: ''
  },
  { 
    title: 'Guides',
    link: '#'
  },
  { 
    title: 'Webinars',
    link: '#'
  },
  { 
    title: 'Help Center',
    link: '#'
  },
  { 
    title: 'Community',
    link: '#'
  },

  ].map((resource, index) => (
    <li key={index}>
      <a 
        href={resource.link}
        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
      >
        {resource.title}
      </a>
    </li>
  ))}
</ul>
        </div>
        
        {/* Company Links */}
        <div className="">
          <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
            Company
            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
          </h3>

          <ul className="space-y-3">
  {company.map((company, i) => (
    <li key={i}>
      <a 
        href={company.link}
        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
      >
        {company.title}
      </a>
    </li>
  ))}
</ul>
        </div>
      </div>
  
      {/* Bottom Section */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between text-gray-400 items-center space-y-4 md:space-y-0">
          {/* Copyrights and Links*/}
          <div className="text-sm ">
          <span>© {new Date().getFullYear()} Monietar. All rights reserved.</span>
          </div>
          
          {/* Credit */}
            <a href="#" className="hover:text-white transition-colors text-sm">Powered By Algoritic Inc</a> 
        </div>
      </div>
    </div>
  </footer>
  );
}