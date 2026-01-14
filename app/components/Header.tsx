'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Faqs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.header 
          className='fixed top-0 left-0 right-0 z-50 h-12 mt-5'
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
            <div className="flex mx-12 items-center justify-between bg-[#f1f1f1] shadow-lg py-1 mx-5 md:mx-7 rounded-lg">
              {/* Logo */}
              <motion.a 
                href="/"
                className="flex items-center gap-3 mx-2"
                whileHover={{ scale: 1.01 }}
              >
                <img 
                  src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png" 
                  alt="Monietar Logo"
                  className="h-12 object-contain"
                />
              </motion.a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <motion.a 
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                <motion.a
                  href="/auth/signin"
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.a>
                
                <motion.a
                  href="/auth/signup"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-sm hover:shadow mx-2"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.a>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                className='lg:hidden p-2.5 rounded-lg text-emerald-800 transition-colors cursor-pointer'
                aria-label="Open menu"
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                
                {/* Menu Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed top-0 bottom-0 right-0 h-screen  w-80 max-w-full bg-white backdrop-blur-sm shadow-xl border-l border-gray-200 z-50 lg:hidden"
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png" 
                          alt="Monietar Logo"
                          className="h-7 object-contain hidden"
                        />
                      </div>
                      <motion.button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="Close menu"
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-1">
                      {navItems.map((item, index) => (
                        <motion.a
                          key={item.label}
                          href={item.href}
                          className="block py-3 px-4 text-gray-600 hover:text-emerald-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 2 }}
                        >
                          {item.label}
                        </motion.a>
                      ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="space-y-3 pt-8 border-t border-gray-200 mt-6">
                      <motion.a 
                        href="/auth/signin" 
                        className="block w-full py-3 text-center text-gray-600 hover:text-emerald-800 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In
                      </motion.a>
                      
                      <motion.a 
                        href="/auth/signup" 
                        className="block w-full py-3 text-center bg-emerald-600 hover:bg-emerald-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm"
                        onClick={() => setIsMenuOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Get Started
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}