'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

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

  // Simplified variants - removed complex scroll animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
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

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section ref={containerRef} id="features" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-gray-100"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-gray-100"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={headerVariants}
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

        {/* Features Grid - Single implementation for all screen sizes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 md:p-8 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <motion.div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" as const, stiffness: 400 }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </motion.div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a
            href='/auth/signin'
            className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gray-900 text-white cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-base md:text-lg font-semibold">Explore Platform</span>
            <motion.div
              className="w-4 h-4 md:w-5 md:h-5"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.a>
          
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
      </div>
    </section>
  );
}