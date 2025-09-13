'use client'

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';

export default function Premium() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [email, setEmail] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setDebugInfo('');
    
    try {
      setDebugInfo('Starting API call...');
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      setDebugInfo(`Response status: ${response.status}`);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        setDebugInfo(prev => `${prev}\nResponse is not JSON: ${text.substring(0, 100)}...`);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      setDebugInfo(prev => `${prev}\nResponse data: ${JSON.stringify(data)}`);

      if (response.ok) {
        setSubmitMessage('Success! You\'re on the waitlist.');
        setEmail('');
      } else {
        setSubmitMessage(data.error || 'Oops! Something went wrong.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setDebugInfo(prev => `${prev}\nError: ${error.message}`);
      setSubmitMessage('Failed to submit. Please check the debug info.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[#059669]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-[black]/70"></div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">Unlock Advanced Financial Insights</h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            We're working on premium features that will take your financial management to the next level.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
            {[
              { 
                icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z', 
                title: 'Advanced AI Planning', 
                desc: 'Predictive analytics for future cash flow scenarios. Scenario modeling for "what-if" analysis.' 
              },
              { 
                icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', 
                title: 'API Integrations', 
                desc: 'Seamless integration with accounting software and bank API integration for automated transaction updates.' 
              },
              { 
                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
                title: 'Multi-Currency Support', 
                desc: 'Handling transactions in multiple African currencies with real-time currency conversion.' 
              },
              { 
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
                title: 'Collaboration Tools', 
                desc: 'Team access with role-based permissions with shared budgets and financial reports.' 
              },
              { 
                icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', 
                title: 'Customizable Dashboards', 
                desc: 'Tailored views for different business needs using drag-and-drop widgets for personalized layouts.' 
              },
              { 
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
                title: 'Advanced Security', 
                desc: 'Enterprise-grade security with two-factor authentication, audit logs and SOC 2 compliance.' 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-[#059669]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#059669]/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-[#059669]/20 backdrop-blur-sm p-8 rounded-2xl border border-[#059669]/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">Be the First to Know</h3>
            <p className="text-white/80 mb-6">Get notified when our premium features launch with special early-bird pricing.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-4 rounded-md border border-white/30 focus:ring-2 focus:ring-white focus:border-transparent outline-none bg-white/10 text-white placeholder-white/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-[#059669]/80 font-medium px-8 py-4 rounded-md transition-all hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Notify Me'}
              </button>
            </form>
            {submitMessage && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center ${
                  submitMessage.includes('Success') ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {submitMessage}
              </motion.p>
            )}
           
          </div>
        </motion.div>
      </div>
    </section>
  );
}