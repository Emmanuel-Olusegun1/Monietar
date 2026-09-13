'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const DropdownIcons: Record<string, React.ReactNode> = {
  'Monietar TAP': (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path d="M8 12h8M12 8v8" strokeWidth="1.5" />
    </svg>
  ),

  API: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" strokeWidth="1.5" />
      <path d="M8 12h8" strokeWidth="1.5" />
    </svg>
  ),

  Career: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        strokeWidth="1.5"
      />
    </svg>
  ),

  Doc: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeWidth="1.5" />
    </svg>
  ),

  Blog: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M5 7h14M5 12h14M5 17h9" strokeWidth="1.5" />
    </svg>
  ),

  Privacy: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        strokeWidth="1.5"
      />
      <path d="M9 12l2 2 4-4" strokeWidth="1.5" />
    </svg>
  ),

  Terms: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="6" y="4" width="12" height="16" rx="2" strokeWidth="1.5" />
      <path d="M8 9h8M8 13h8M8 17h4" strokeWidth="1.5" />
    </svg>
  ),
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );

  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setOpenDropdown(null);
      } else {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
      }
    };
  }, [lastScrollY]);

  const menu = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About us',
      href: '/about',
    },
    {
      label: 'Product',
      dropdown: [
        {
          label: 'Monietar TAP',
          href: '/tap',
        },
        {
          label: 'API',
          href: '/api-docs',
        },
      ],
    },
    {
      label: 'Company',
      dropdown: [
        {
          label: 'Career',
          href: '/careers',
        },
        {
          label: 'Doc',
          href: 'https://monietardoc.hashnode.space/',
          external: true,
        },
        {
          label: 'Blog',
          href: '/blog',
        },
        {
          label: 'Privacy',
          href: '/privacy',
        },
        {
          label: 'Terms',
          href: '/terms',
        },
      ],
    },
    {
      label: 'Contact',
      href: '/contact',
    },
  ];

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }

    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`fixed left-0 right-0 top-0 z-50 w-full border-b transition-all duration-300 ${
            scrolled
              ? 'border-gray-200/80 bg-[#f1f1f1]/95 backdrop-blur-md'
              : 'border-transparent bg-[#f1f1f1]/80 backdrop-blur-sm'
          }`}
        >
          <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

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

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {menu.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                      className={`group flex cursor-pointer items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-colors duration-200 ${
                        openDropdown === item.label
                          ? 'text-emerald-800'
                          : 'text-gray-600 hover:text-gray-950'
                      }`}
                    >
                      {item.label}

                      <svg
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.7}
                          d="M6 9l6 6 6-6"
                        />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: 8,
                          }}
                          transition={{
                            duration: 0.18,
                          }}
                          onMouseEnter={() =>
                            handleDropdownEnter(item.label)
                          }
                          onMouseLeave={handleDropdownLeave}
                          className="absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3"
                        >
                          <div className="border border-gray-200 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                            {item.dropdown.map((sub) => (
                              <a
                                key={sub.label}
                                href={sub.href}
                                target={
                                  sub.external ? '_blank' : undefined
                                }
                                rel={
                                  sub.external
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                                className="group flex items-center gap-3 px-3 py-3 transition-colors duration-150 hover:bg-[#f1f1f1]"
                              >
                                <span className="flex h-8 w-8 items-center justify-center text-emerald-800">
                                  {DropdownIcons[sub.label]}
                                </span>

                                <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-950">
                                  {sub.label}
                                </span>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 text-[13px] font-medium text-gray-600 transition-colors duration-200 hover:text-gray-950"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.a>
                )
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <motion.a
                href="/"
                className="flex items-center gap-2 bg-emerald-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-emerald-800"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Join waitlist

                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M5 12h14M13 6l6 6-6 6"
                  />
                </svg>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-emerald-900 md:hidden"
              aria-label="Open menu"
              whileTap={{ scale: 0.94 }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Overlay */}
                <motion.button
                  type="button"
                  aria-label="Close menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeMobileMenu}
                  className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-[2px]"
                />

                {/* Sidebar */}
                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 300,
                  }}
                  className="fixed right-0 top-0 z-50 flex h-screen w-[min(380px,88vw)] flex-col border-l border-gray-200 bg-[#f1f1f1]"
                >
                  <div className="flex h-full flex-col px-6 py-6">

                    {/* Mobile Header */}
                    <div className="flex items-center justify-between border-b border-gray-300 pb-5">
                      <a
                        href="/"
                        className="flex items-center"
                        onClick={closeMobileMenu}
                      >
                        <img
                          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
                          alt="Monietar Logo"
                          className="h-15 w-auto object-contain"
                        />
                      </a>

                      <motion.button
                        type="button"
                        onClick={closeMobileMenu}
                        className="flex h-9 w-9 items-center justify-center text-gray-600"
                        aria-label="Close menu"
                        whileTap={{ scale: 0.94 }}
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M6 6l12 12M18 6L6 18"
                          />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-8">
                      {menu.map((item) =>
                        item.dropdown ? (
                          <div
                            key={item.label}
                            className="border-b border-gray-200 last:border-b-0"
                          >
                            <button
                              type="button"
                              className="flex w-full items-center justify-between py-5 text-left text-lg font-medium tracking-tight text-gray-900"
                              onClick={() =>
                                setOpenMobileDropdown(
                                  openMobileDropdown === item.label
                                    ? null
                                    : item.label
                                )
                              }
                              aria-expanded={
                                openMobileDropdown === item.label
                              }
                            >
                              <span>{item.label}</span>

                              <svg
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                  openMobileDropdown === item.label
                                    ? 'rotate-180'
                                    : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M6 9l6 6 6-6"
                                />
                              </svg>
                            </button>

                            <AnimatePresence initial={false}>
                              {openMobileDropdown === item.label && (
                                <motion.div
                                  initial={{
                                    height: 0,
                                    opacity: 0,
                                  }}
                                  animate={{
                                    height: 'auto',
                                    opacity: 1,
                                  }}
                                  exit={{
                                    height: 0,
                                    opacity: 0,
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-4 pl-4">
                                    {item.dropdown.map((sub) => (
                                      <a
                                        key={sub.label}
                                        href={sub.href}
                                        target={
                                          sub.external
                                            ? '_blank'
                                            : undefined
                                        }
                                        rel={
                                          sub.external
                                            ? 'noopener noreferrer'
                                            : undefined
                                        }
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-emerald-800"
                                      >
                                        <span className="text-emerald-800">
                                          {DropdownIcons[sub.label]}
                                        </span>

                                        {sub.label}
                                      </a>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="block border-b border-gray-200 py-5 text-lg font-medium tracking-tight text-gray-900 transition-colors hover:text-emerald-800"
                          >
                            {item.label}
                          </a>
                        )
                      )}
                    </nav>

                    {/* Mobile CTA */}
                    <div className="border-t border-gray-300 pt-5">
                      <motion.a
                        href="/"
                        onClick={closeMobileMenu}
                        className="flex w-full items-center justify-center gap-2 bg-emerald-900 py-3.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                        whileTap={{ scale: 0.98 }}
                      >
                        Join waitlist

                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.7}
                            d="M5 12h14M13 6l6 6-6 6"
                          />
                        </svg>
                      </motion.a>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
