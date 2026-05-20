import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
// Simple icon components for dropdown items
const DropdownIcons: Record<string, React.ReactNode> = {
  'Monietar TAP': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M8 12h8M12 8v8" strokeWidth="2" /></svg>
  ),
  'API': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="2" /><path d="M8 12h8" strokeWidth="2" /></svg>
  ),
  'Career': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeWidth="2" /></svg>
  ),
  'Doc': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path d="M8 8h8M8 12h8M8 16h4" strokeWidth="2" /></svg>
  ),
  'Blog': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" /></svg>
  ),
  'Privacy': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v4m0 0a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4v4m0-4a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z" strokeWidth="2" /></svg>
  ),
  'Terms': (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2" strokeWidth="2" /><path d="M8 8h8M8 12h8M8 16h4" strokeWidth="2" /></svg>
  ),
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  // Desktop dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      // header background when scrolled past threshold
      setScrolled(currentScrollY > 20);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  // Menu structure
  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About us', href: '/' },
    {
      label: 'Product',
      dropdown: [
        { label: 'Monietar TAP', href: '/features' },
        { label: 'API', href: '/api-info' },
      ],
    },
    {
      label: 'Company',
      dropdown: [
        { label: 'Career', href: '/careers' },
        { label: 'Doc', href: 'https://monietardoc.hashnode.space/', external: true },
        { label: 'Blog', href: '/blog' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ];

  // Dropdown state for mobile
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  // Handlers for dropdown open/close with delay
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.header 
          className={`fixed top-0 left-0 right-0 w-full z-50 h-16 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            duration: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 20
          }}
        >
          <div className="flex w-full max-w-7xl mx-auto items-center justify-between px-4 md:px-8 h-16">
            {/* Logo */}
            <motion.a 
              href="/"
              className="flex items-center gap-3 mx-2"
              whileHover={{ scale: 1.01 }}
            >
              <img 
                src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png" 
                alt="Monietar Logo"
                className="h-18 object-contain"
              />
            </motion.a>


            {/* Desktop Navigation with Dropdowns */}
            <nav className="hidden md:flex items-center px-3 bg-gray-200 rounded-full gap-1">
              {menu.map((item) =>
                item.dropdown ? (
                  <div
                    className="relative  py-1.5"
                    key={item.label}
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      className={`px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors duration-200 rounded-full hover:bg-gray-50 focus:outline-none flex cursor-pointer items-center gap-1 ${openDropdown === item.label ? 'bg-gray-100 text-emerald-700' : ''}`}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                      tabIndex={0}
                    >
                      {item.label}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div
                      className={`absolute left-0 mt-3 w-64 min-w-max bg-white border border-gray-100 rounded-xl shadow-2xl p-4 transition-all duration-200 z-30 flex flex-col gap-2 ${openDropdown === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                      onMouseLeave={handleDropdownLeave}
                      style={{ pointerEvents: openDropdown === item.label ? 'auto' : 'none' }}
                    >
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          target={sub.external ? '_blank' : undefined}
                          rel={sub.external ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-emerald-50 transition-colors duration-150 group"
                        >
                          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-100 group-hover:bg-emerald-200">
                            {DropdownIcons[sub.label] || <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>}
                          </span>
                          <span className="font-semibold text-gray-800 text-base">{sub.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors duration-200 rounded-full hover:bg-gray-50"
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.label}
                  </motion.a>
                )
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* <motion.a
                href="/auth/signin"
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.a> */}
                
              <motion.a
                href="/auth/signup"
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-full cursor-pointer hover:bg-emerald-800 transition-all duration-200 shadow-sm hover:shadow mx-2"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Join waitlist
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
                
                {/* Right-side Sidebar Mobile Menu (matches desktop header) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed top-0 bottom-0 right-0 h-screen w-80 max-w-full bg-white shadow-xl border-l border-gray-100 z-50 lg:hidden"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <a href="/" className="flex items-center gap-3">
                        <img
                          src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
                          alt="Monietar Logo"
                          className="h-8 object-contain"
                        />
                      </a>

                      <motion.button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="Close menu"
                        whileTap={{ scale: 0.94 }}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>

                    <nav className="flex-1 overflow-y-auto">
                      {menu.map((item) => (
                        item.dropdown ? (
                          <div key={item.label} className="mb-2">
                            <button
                              className="w-full flex items-center justify-between py-3 px-3 text-lg text-gray-800 font-semibold tracking-tight rounded-lg hover:bg-emerald-50 transition-colors duration-150 focus:outline-none"
                              onClick={() => setOpenMobileDropdown(openMobileDropdown === item.label ? null : item.label)}
                              aria-expanded={openMobileDropdown === item.label}
                            >
                              <span className="leading-tight">{item.label}</span>
                              <svg className={`w-5 h-5 ml-2 transition-transform ${openMobileDropdown === item.label ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>

                            <div className={`mt-2 pl-4 border-l border-emerald-100 ml-2 transition-all duration-200 overflow-hidden ${openMobileDropdown === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} style={{ pointerEvents: openMobileDropdown === item.label ? 'auto' : 'none' }}>
                              {item.dropdown.map((sub) => (
                                <a
                                  key={sub.label}
                                  href={sub.href}
                                  target={sub.external ? '_blank' : undefined}
                                  rel={sub.external ? 'noopener noreferrer' : undefined}
                                  className="block py-2 px-2 text-base text-gray-700 font-medium tracking-tight hover:text-emerald-800 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {sub.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block py-3 px-3 text-lg text-gray-800 font-semibold tracking-tight hover:text-emerald-800 rounded-lg transition-colors duration-150"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        )
                      ))}
                    </nav>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <motion.a
                        href="/auth/signup"
                        className="block w-full py-3 text-center bg-emerald-600 hover:bg-emerald-800 text-white font-semibold rounded-full transition-all duration-200 shadow-sm"
                        onClick={() => setIsMenuOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Join waitlist
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