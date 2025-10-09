'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type LinkProps = {
  title: string;
  link: string;
};

const company: LinkProps[] = [
  { title: 'About', link: '#about' },
  { title: 'Careers', link: '#careers' },
  { title: 'Contact', link: '#contact' },
  { title: 'Privacy', link: '#privacy' },
  { title: 'Terms', link: '#terms' },
];

const productLinks: LinkProps[] = [
  { title: 'Features', link: '#features' },
  { title: 'Pricing', link: '#pricing' },
  { title: 'Use Cases', link: '#use-cases' },
  { title: 'Testimonials', link: '#testimonials' },
  { title: 'API', link: '#api' },
];

const resourceLinks: LinkProps[] = [
  { title: 'Blog', link: '#blog' },
  { title: 'Guides', link: '#guides' },
  { title: 'Webinars', link: '#webinars' },
  { title: 'Help Center', link: '#help' },
  { title: 'Community', link: '#community' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        {/* Top Section - 2-column mobile grid */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16 lg:mb-20">
          {/* Brand Column - Spans full width on mobile, 2 cols on desktop */}
          <motion.div
            className="col-span-3 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-3">
              <div>
              <img 
              src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png" 
              alt="Monietar Logo"
              className="w-30 h-20 object-contain"
            />
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-lg">
              Empowering African SMEs with AI-driven financial insights for smarter decisions and sustainable growth.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              {[
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                  label: 'X (Twitter)'
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  ),
                  label: 'LinkedIn'
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.40-1.439-1.40z"/>
                    </svg>
                  ),
                  label: 'Instagram'
                }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300 group shadow-lg hover:shadow-xl"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            className="col-span-1 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
              Product
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
            </h3>
            <ul className="space-y-4">
              {productLinks.map((product, index) => (
                <motion.li key={index} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a 
                    href={product.link}
                    className="text-gray-400 hover:text-white transition-all duration-300 inline-block text-base font-medium hover:font-semibold"
                  >
                    {product.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            className="col-span-1 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
              Resources
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
            </h3>
            <ul className="space-y-4">
              {resourceLinks.map((resource, index) => (
                <motion.li key={index} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a 
                    href={resource.link}
                    className="text-gray-400 hover:text-white transition-all duration-300 inline-block text-base font-medium hover:font-semibold"
                  >
                    {resource.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Company Links - Spans full width on mobile, 2 cols on desktop */}
          <motion.div
            className=""
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
            </h3>
            <ul className="space-y-4">
              {company.map((company, index) => (
                <motion.li key={index} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a 
                    href={company.link}
                    className="text-gray-400 hover:text-white transition-all duration-300 inline-block text-base font-medium hover:font-semibold"
                  >
                    {company.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center lg:text-left">
              <span>© {new Date().getFullYear()} Monietar. All rights reserved.</span>
            </div>
            
            {/* Additional Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
            
            {/* Credit */}
            <div className="text-gray-500 text-sm">
              <a href="https://algoritic.com.ng" target='_blank' className="hover:text-white transition-colors duration-300">
                Powered By Algoritic Inc
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}