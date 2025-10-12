// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect } from 'react';

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       setIsScrolled(scrollTop > 50);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//       isScrolled 
//         ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm' 
//         : 'bg-transparent backdrop-blur-none border-transparent'
//     }`}>
//       {/* Remove the md:z-50 and just use z-50 consistently */}
      
//       <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between">
//         <motion.div 
//           className="flex items-center space-x-3"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <img 
//             src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png" 
//             alt="Monietar Logo"
//             className="w-30 h-20 object-contain"
//           />
//           <span className={`text-xl font-bold transition-colors duration-300 ${
//             isScrolled ? 'text-gray-900' : 'text-white'
//           }`}></span>
//         </motion.div>

//         {/* Desktop Navigation */}
//         <nav className="hidden lg:flex items-center space-x-8">
//           {['Features', 'Pricing', 'FAQ', 'Contact'].map((item) => (
//             <a 
//               key={item}
//               href={`#${item.toLowerCase()}`}
//               className={`transition-colors duration-200 font-medium hover:text-emerald-500 ${
//                 isScrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'
//               }`}
//             >
//               {item}
//             </a>
//           ))}
//         </nav>

//         {/* Desktop Sign In Button */}
//         <motion.a
//           href="/auth/signin"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className={`hidden lg:block font-medium px-6 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow ${
//             isScrolled 
//               ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
//               : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 hover:border-white/30'
//           }`}
//         >
//           Sign In
//         </motion.a>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsMenuOpen(true)}
//           className={`lg:hidden p-2 rounded-md transition-colors ${
//             isScrolled 
//               ? 'text-gray-600 hover:text-emerald-500 hover:bg-gray-100' 
//               : 'text-white/90 hover:text-white hover:bg-white/10'
//           }`}
//           aria-label="Open menu"
//         >
//           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Sidebar Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <>
//             {/* Backdrop - Increase z-index */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//               onClick={() => setIsMenuOpen(false)}
//             />
            
//             {/* Sidebar - Ensure higher z-index than backdrop */}
//             <motion.div
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ duration: 0.3, ease: 'easeOut' }}
//               className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 lg:hidden"
//             >
//               <div className="p-6 h-full flex flex-col">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-8">
//                   <div className="flex items-center space-x-3">
//                     <img 
//                       src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png" 
//                       alt="Monietar Logo"
//                       className="w-24 h-16 object-contain"
//                     />
//                   </div>
//                   <button
//                     onClick={() => setIsMenuOpen(false)}
//                     className="p-2 rounded-md text-gray-600 hover:text-emerald-500 hover:bg-gray-100 transition-colors"
//                     aria-label="Close menu"
//                   >
//                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Navigation Links */}
//                 <nav className="flex-1 space-y-4">
//                   {['Features', 'Pricing', 'FAQ', 'Contact'].map((item) => (
//                     <a
//                       key={item}
//                       href={`#${item.toLowerCase()}`}
//                       className="block py-3 px-4 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors duration-200 font-medium"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {item}
//                     </a>
//                   ))}
//                 </nav>

//                 {/* Sign In Button */}
//                 <div className="pt-8 border-t border-gray-200 mt-8">
//                   <a 
//                     href="/auth/signin" 
//                     className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Sign In
//                   </a>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }


'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function WaitlistHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm' 
        : 'bg-transparent backdrop-blur-none border-transparent'
    }`}>
      <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png" 
            alt="Monietar Logo"
            className="w-30 h-20 object-contain"
          />
          <span className={`text-xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-gray-900' : 'text-white'
          }`}></span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {['Features', 'Benefits', 'FAQ', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`transition-colors duration-200 font-medium hover:text-emerald-500 ${
                isScrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop Waitlist & Sign In Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <motion.a
            href="#waitlist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`font-medium px-6 py-2 rounded-md transition-all duration-200 border ${
              isScrolled 
                ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50' 
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            Join Waitlist
          </motion.a>
          '
        </div>

        
    </header>
  );
}