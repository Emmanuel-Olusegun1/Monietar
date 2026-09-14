'use client';

import { motion } from 'framer-motion';
import {
  Instagram,
  Linkedin,
  MessageCircle,
} from 'lucide-react';
import { SiTiktok, SiX } from 'react-icons/si';

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
  { title: 'Journal', link: '/journal' },
  {
    title: 'Doc',
    link: 'https://monietardoc.hashnode.space/',
    external: true,
  },
  { title: 'Webinars', link: '/webinars' },
  { title: 'Help Center', link: '/help' },
  { title: 'Community', link: '/community' },
];

const socialLinks = [
  {
    title: 'X',
    link: 'https://x.com/monietar',
    icon: SiX,
  },
  {
    title: 'Instagram',
    link: 'https://instagram.com/monietar',
    icon: Instagram,
  },
  {
    title: 'LinkedIn',
    link: 'https://www.linkedin.com/showcase/monietar/',
    icon: Linkedin,
  },
  {
    title: 'TikTok',
    link: 'https://tiktok.com/@monietar',
    icon: SiTiktok,
  },
  {
    title: 'WhatsApp',
    link: 'https://wa.me/2349034010384',
    icon: MessageCircle,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f1f1f1] text-gray-500">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* Top rule */}
        <div className="border-t border-gray-300" />

        {/* Main footer */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-12 sm:py-16 md:grid-cols-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12 lg:py-20">

          {/* Brand */}
          <div className="col-span-2 max-w-sm md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <motion.a
                href="/"
                className="flex items-center"
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
                  alt="Monietar Logo"
                  className="h-20 w-auto object-contain md:h-20"
                />
              </motion.a>

              <p className="mt-5 max-w-xs text-sm leading-6 text-gray-500">
                Safely link your shop’s bank transfers, physical
                cash box, and cross-border currency pools into one
                hands-free ledger. No manual math, no missing flow.
              </p>

              {/* Social media */}
              <div className="mt-7">
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Follow Monietar
                </p>

                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <motion.a
                        key={social.title}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.title}
                        title={social.title}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="flex h-9 w-9 items-center justify-center border border-gray-300 text-gray-500 transition-colors duration-200 hover:border-emerald-900 hover:bg-emerald-900 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product */}
          <FooterColumn
            title="Product"
            links={productLinks}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={company}
          />

          {/* Resources */}
          <FooterColumn
            title="Resources"
            links={resourceLinks}
          />
        </div>

        {/* Bottom metadata */}
        <motion.div
          className="border-t border-gray-300 py-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col gap-4 text-[9px] font-medium uppercase tracking-[0.16em] text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">

            <a
              href="https://algoritic.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 text-emerald-700 hover:text-emerald-800"
            >
              Powered by Algoritic Inc
            </a>

            <div className="flex items-center gap-3">
              <span>
                © {new Date().getFullYear()} All rights reserved.
              </span>
            </div>

          </div>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: LinkProps[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.title}>
            <a
              href={link.link}
              target={link.external ? '_blank' : undefined}
              rel={
                link.external
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="text-sm text-gray-600 transition-colors duration-200 hover:text-emerald-900"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}