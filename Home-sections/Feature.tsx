'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Repeat, Package as BoxIcon, Globe, FileText } from 'lucide-react';

type FeatureCards = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const features: FeatureCards[] = [
  { 
    icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />, 
    title: 'Instant Profit and Loss Tracking', 
    desc: 'Skip the end-of-month stress and view your true net margin updated with every single transaction'
  },
  { 
    icon: <Repeat className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />, 
    title: 'Hands-Free Transfer Logging', 
    desc: 'Secure midnight bank statement syncs automatically and double-checks your records so you never skip a transaction'
  },
  { 
    icon: <BoxIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />, 
    title: 'Independent Physical Cash Vault', 
    desc: 'Log immediate cash sales, track minor daily payouts, and manage money waiting for bank deposit'
  },
  { 
    icon: <BoxIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />, 
    title: 'Automated Inventory Tracking', 
    desc: 'Monietar monitors your inventory stock levels in the background as sales happen across your channels'
  },
  { 
    icon: <Globe className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />, 
    title: 'Dual-Currency Sourcing Corridors', 
    desc: 'Keep your accounting stable using automated daily parallel market rates or set your own custom conversion lock-ins'
  },
  { 
    icon: <FileText className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />, 
    title: 'Pre-compiled Financial Statement Report', 
    desc: 'Share your verified transaction track record directly with banks, partners, or networks to secure loans and grants'
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">The MONIETAR Matrix</span>
          </motion.div> 
          
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2 md:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The Core Engine For Your Business
            <span className="text-emerald-800"> Financial Intelligence</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We connect your store's bank transfers, physical cash, and multi-currency balance into one unified, background automation system
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
                {feature.icon}
              </motion.div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-emerald-900 mb-3 md:mb-4">
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
          {/* <motion.a
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
          </motion.a> */}
          
          <motion.p 
            className="text-gray-500 text-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Trusted by forward thinking businesses in Africa
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}