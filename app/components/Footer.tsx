'use client';

import { motion } from 'framer-motion';

type LinkProps = {
  title: string;
  link: string;
  external?: boolean;
};

const company: LinkProps[] = [
  { title: 'About', link: '/about' },
  { title: 'Careers', link: '/careers' },
  { title: 'Contact', link: '/contact' },
  { title: 'Privacy', link: '/privacy' },
  { title: 'Terms', link: '/terms' },
];

const productLinks: LinkProps[] = [
  { title: 'Monietar TAP', link: '/tap' },
  { title: 'Pricing', link: '/pricing' },
  { title: 'Use Cases', link: '/use-cases' },
  { title: 'API', link: '/api-docs' },
];

const resourceLinks: LinkProps[] = [
  { title: 'Blog', link: '/blog' },
  { title: 'Doc', link: 'https://monietardoc.hashnode.space/', external: true },
  { title: 'Webinars', link: '/webinars' },
  { title: 'Help Center', link: '/help' },
  { title: 'Community', link: '/community' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 relative overflow-hidden border-t border-zinc-900/60">
      {/* Soft Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-zinc-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Grid: Responsive Menu Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Brand/Product Philosophy Statement */}
          <div className="col-span-2 md:col-span-1 pr-4">
            <h3 className="text-xl font-extrabold text-white mb-4 tracking-tight">Monietar.</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
            Safely link your shop’s bank transfers, physical cash box, and cross-border currency pools into one hands-free ledger. No manual math, No missing flow.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col justify-start">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 text-zinc-300">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {productLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.link} className="hover:text-white transition-colors duration-200">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col justify-start">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 text-zinc-300">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {company.map((link) => (
                <li key={link.title}>
                  <a href={link.link} className="hover:text-white transition-colors duration-200">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col justify-start">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 text-zinc-300">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.title}>
                  <a 
                    href={link.link} 
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Bar - Directly mirrors the structure visible at the base of image_c79302.jpg */}
        <motion.div
          className="border-t border-zinc-900 pt-8 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Split Bottom Brand / Copyright Identity Layout */}
            <div className="flex items-center gap-3 text-xs text-zinc-600">
              <span className="font-black tracking-tight text-zinc-500 text-sm">Monietar.</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            
            {/* Engineering Attributions */}
            <div className="text-xs text-zinc-600">
              <a 
                href="https://algoritic.com.ng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-zinc-400 transition-colors duration-200"
              >
                Powered By Algoritic Inc
              </a>
            </div>

          </div>
        </motion.div>

      </div>
    </footer>
  );
}