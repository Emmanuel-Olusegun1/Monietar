'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

type FeatureCards = {
  icon: string;
  title: string;
  desc: string;
};

const features: FeatureCards[] = [
  { 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
    title: 'Cash Flow Tracking', 
    desc: 'Monitor income and expenses effortlessly in real-time with categorization of transactions.'
  },
  { 
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
    title: 'Budgeting Tools', 
    desc: 'Create and manage budgets for specific categories or periods with alerts for overspending.'
  },
  { 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
    title: 'Financial Insights', 
    desc: 'AI-generated reports on cash flow trends, forecasts, and anomalies with visual dashboards.'
  },
  { 
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
    title: 'Decision Support', 
    desc: 'AI recommendations for cost-saving and revenue optimization based on historical data.'
  },
  { 
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', 
    title: 'User Interface', 
    desc: 'Intuitive, mobile-friendly design with multi-language and multi-currency support.'
  },
  { 
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', 
    title: 'Security & Compliance', 
    desc: 'Bank-level encryption, GDPR compliance, and regular security audits to protect your data.'
  }
];

export default function Feature() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  const mobileContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const mobileItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  const desktopContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const desktopItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <section ref={containerRef} id="features" className="relative min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>
        
        {/* Subtle corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-gray-100"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-gray-100"></div>
      </div>

      <motion.div 
        className="container mx-auto max-w-6xl relative z-10"
        style={!isMobile ? { opacity, scale } : {}}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Core Features</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Enterprise-Grade
            <br />
            <span className="text-gray-800">Financial Intelligence</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Advanced tools designed for modern businesses seeking clarity and control
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        {isMobile ? (
          // Mobile Layout
          <motion.div
            className="grid gap-4 px-2"
            variants={mobileContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={mobileItemVariants}
                className="group p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.998] touch-manipulation"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.995 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" as const, stiffness: 400 }}
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Desktop Layout - Clean Grid
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={desktopContainerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={desktopItemVariants}
                className="group p-8 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500"
                whileHover={{ y: -4, borderColor: "rgb(229, 231, 235)" }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors duration-300"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring" as const, stiffness: 400 }}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-semibold text-gray-900 mb-4"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring" as const, stiffness: 400 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 leading-relaxed"
                  whileHover={{ x: 1 }}
                  transition={{ type: "spring" as const, stiffness: 400 }}
                >
                  {feature.desc}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gray-900 text-white cursor-pointer group active:scale-95 touch-manipulation"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg font-semibold">Explore Platform</span>
            <motion.div
              className="w-5 h-5"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-gray-500 text-sm mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Trusted by 10,000+ businesses worldwide
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}