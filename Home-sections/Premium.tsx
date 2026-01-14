'use client'

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';

export default function Premium() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage('✓ You have been added to our priority access list.');
        setEmail('');
      } else {
        setSubmitMessage(data.error || 'Please try again.');
      }
    } catch (error) {
      setSubmitMessage('✓ Thank you for your interest. We will be in touch soon.');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z', 
      title: 'AI Financial Planning', 
      desc: 'Predictive analytics and scenario modeling for strategic financial decision-making.'
    },
    { 
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', 
      title: 'Enterprise Integrations', 
      desc: 'Seamless connectivity with banking APIs and accounting platforms.'
    },
    { 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
      title: 'Global Currency', 
      desc: 'Multi-currency support with real-time forex rates and automated conversions.'
    },
    { 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
      title: 'Team Workspace', 
      desc: 'Role-based access controls and collaborative financial reporting tools.'
    },
    { 
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', 
      title: 'Executive Dashboard', 
      desc: 'Customizable financial dashboards with real-time KPI tracking.'
    },
    { 
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
      title: 'Bank-Grade Security', 
      desc: 'Enterprise security protocols with SOC 2 compliance and audit trails.'
    }
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium Dark Background with Sophisticated Textures */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMiIvPjwvc3ZnPg==')] opacity-10"></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-30deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        {/* Accent Lines */}
        <div className="absolute top-0 left-20 w-px h-40 bg-gradient-to-b from-emerald-400/40 to-transparent"></div>
        <div className="absolute top-0 right-20 w-px h-40 bg-gradient-to-b from-emerald-400/20 to-transparent"></div>
        <div className="absolute bottom-0 left-1/4 w-px h-32 bg-gradient-to-t from-emerald-400/30 to-transparent"></div>
        <div className="absolute bottom-0 right-1/4 w-px h-32 bg-gradient-to-t from-emerald-400/20 to-transparent"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Sophisticated Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-10"
          >
            <motion.div 
              className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/20"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-emerald-300 tracking-wide">PREMIUM LAUNCH</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
              Monietar 
            </span>
            <span className="text-emerald-400 font-normal"> Enterprise</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Advanced financial intelligence for visionary businesses
          </motion.p>
        </motion.div>
        
        {/* Premium Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 + 0.6 }}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-700 overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Animated Background Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <motion.div 
                className="relative w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-8 group-hover:bg-emerald-400/20 transition-all duration-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md group-hover:blur-lg transition-all duration-500"></div>
                <svg className="w-7 h-7 text-emerald-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                </svg>
              </motion.div>
              
              <h3 className="text-2xl font-semibold text-white mb-4 leading-tight tracking-wide">
                {feature.title}
              </h3>
              
              <p className="text-slate-300 leading-relaxed tracking-wide text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Exclusive Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative"
        >
          {/* Animated Border Glow */}
          
          
          <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-12 md:p-16 max-w-4xl mx-auto border border-white/10 shadow-2xl">
            <div className="text-center mb-12">
              <motion.h3 
                className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  Priority Access
                </span>
              </motion.h3>
              <motion.p 
                className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed tracking-wide"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Join our exclusive waitlist for founding member benefits and personalized onboarding
              </motion.p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 ">
              <div className="flex-grow">
                <input
                  type="email"
                  placeholder="Enter your corporate email"
                  className="w-full px-6 py-4 rounded-lg border border-white/20 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-300 backdrop-blur-sm tracking-wide"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] border border-emerald-400/30 tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing...
                  </span>
                ) : (
                  'Request Priority Access'
                )}
              </motion.button>
            </form>
            
            {submitMessage && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center mt-6 text-sm font-medium tracking-wide ${
                  submitMessage.includes('✓') 
                    ? 'text-emerald-400' 
                    : 'text-red-400'
                }`}
              >
                {submitMessage}
              </motion.p>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-center text-slate-400 text-sm mt-8 flex items-center justify-center gap-8 flex-wrap tracking-wide"
            >
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow shadow-emerald-400/20"></div>
                Exclusive early access
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow shadow-emerald-400/20"></div>
                Founding member rates
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow shadow-emerald-400/20"></div>
                Dedicated support
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}