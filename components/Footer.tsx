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