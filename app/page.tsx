'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Brain, Plug, DollarSign, Users, LayoutDashboard, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Trustbar from '@/components/Trustbar';
import Feature from '@/components/Feature';
import Premuim from '@/components/Premium';

function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage('Success! You\'re on the waitlist.');
      setEmail('');
    } catch (error) {
      setSubmitMessage('Oops! Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };



  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans">

      {/* Header */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* Trust Bar */}
      <Trustbar />
      {/* Features Section */}
      <Feature />
      {/* Premium Coming Soon Section */}
      <Premuim />?

      {/* Pricing Section */}
<section id="pricing" className="py-16 px-4 bg-gray-50">
  <div className="container mx-auto max-w-7xl">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the plan that works for your business needs.</p>
      
      {/* Currency Toggle */}
      <div className="flex justify-center mt-8">
        <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setCurrency('NGN')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              currency === 'NGN' 
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nigeria (₦)
          </button>
          <button
            onClick={() => setCurrency('XOF')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              currency === 'XOF' 
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Benin Republic (CFA)
          </button>
        </div>
      </div>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Free Plan */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {currency === 'NGN' ? '₦0' : '0 CFA'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-gray-600 mt-2">Perfect for getting started</p>
        </div>
        <ul className="space-y-4 mb-8">
          {['Basic income/expense tracking', '90-day cash flow forecasting', 'AI-powered insights', 'Email support', '1 business account'].map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors">
          Get Started Free
        </button>
      </motion.div>
      
      {/* Pro Plan - Coming Soon */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-500 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg">
          COMING SOON
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {currency === 'NGN' ? '₦5,000' : '8,000 CFA'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-gray-600 mt-2">For growing businesses</p>
          {currency === 'XOF' && (
            <p className="text-sm text-emerald-600 mt-1">≈ ₦5,000</p>
          )}
        </div>
        <ul className="space-y-4 mb-8">
          {['Everything in Free', 'Advanced analytics & reports', 'Multi-business management', 'Priority support', 'Custom financial goals', 'Export capabilities'].map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-gray-300 text-gray-600 font-medium py-3 rounded-lg cursor-not-allowed">
          Coming Soon
        </button>
      </motion.div>
      
      {/* Business Plan - Coming Soon */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg">
          COMING SOON
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {currency === 'NGN' ? '₦12,000' : '19,200 CFA'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-gray-600 mt-2">For established businesses</p>
          {currency === 'XOF' && (
            <p className="text-sm text-emerald-600 mt-1">≈ ₦12,000</p>
          )}
        </div>
        <ul className="space-y-4 mb-8">
          {['Everything in Pro', 'Unlimited business accounts', 'Dedicated account manager', 'Custom integrations', 'Team collaboration', 'White-label reports'].map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-gray-300 text-gray-600 font-medium py-3 rounded-lg cursor-not-allowed">
          Coming Soon
        </button>
      </motion.div>
    </div>
    
    {/* Currency Note */}
    <div className="text-center mt-12">
      <p className="text-gray-600 text-sm">
        * Prices in CFA Francs are approximate. Actual charges will be processed in your local currency.
        {currency === 'XOF' && ' 1 CFA ≈ 0.625 NGN'}
      </p>
    </div>
  </div>
</section>


      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about fintar</p>
          </motion.div>
          
          <div className="space-y-4">
            {[
              {
                question: "Is Fintar really free to use?",
                answer: "Yes! Our core features are completely free forever. We believe every African business should have access to powerful financial tools. The Free tier includes income/expense tracking, 90-day cash flow forecasting, AI-powered insights, and email support. We'll offer premium features in the future, but the core functionality will always remain free."
              },
              {
                question: "How does Fintar protect my financial data?",
                answer: "We take security seriously. All data is encrypted in transit and at rest. We're GDPR compliant and never share your data with third parties without your explicit permission. Our security practices are regularly audited by independent experts."
              },
              {
                question: "Do I need to connect my bank account?",
                answer: "No, connecting your bank account is optional. You can manually enter your financial data, or connect your accounts for automatic synchronization. We use bank-level security for all connections."
              },
              {
                question: "When will premium features be available?",
                answer: "We're planning to launch our premium tier in Q2 2024. Early adopters who join our waitlist will get special pricing and early access to these features."
              },
              {
                question: "Can I use Fintar on my mobile phone?",
                answer: "Absolutely! Fintar is designed to work perfectly on mobile devices. We'll also be launching dedicated iOS and Android apps in the near future."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* Testimonials Section */}
<section id="testimonials" className="py-16 px-4 bg-gray-50">
  <div className="container mx-auto max-w-7xl">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Entrepreneurs</h2>
      <p className="text-xl text-gray-600">Real stories from African business owners.</p>
    </motion.div>
    
    <Slider
      dots={false}
      infinite={true}
      speed={500}
      slidesToShow={2}
      slidesToScroll={1}
      autoplay={true}
      autoplaySpeed={5000}
      pauseOnHover={true}
      responsive={[
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots:false
          }
        }
      ]}
      customPaging={(i) => (
        <div className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300 mt-8"></div>
      )}
      appendDots={dots => (
        <div>
          <ul className="flex justify-center space-x-2 mt-8"> {dots} </ul>
        </div>
      )}
    >
      {[
        { 
          name: 'Adeola S.', 
          role: 'Fashion Boutique, Lagos',
          quote: 'Fintar revealed seasonal cash flow patterns I never noticed, helping me optimize inventory decisions. My revenue increased by 30% in just 3 months!',
        },
        { 
          name: 'Chukwuma E.', 
          role: 'Restaurant, Benin City',
          quote: 'No more payroll stress! Fintar gives me weeks of advance notice to plan and adjust. The AI predictions have been incredibly accurate.',
        },
        { 
          name: 'Fatima O.', 
          role: 'Tech Startup, Abuja',
          quote: 'As a growing startup, cash flow management was our biggest challenge. Fintar helped us secure funding by providing professional financial forecasts.',
        },
        { 
          name: 'Kwame A.', 
          role: 'Agriculture Export, Accra',
          quote: 'The multi-currency support is fantastic for our export business. We can now track finances in both local and foreign currencies seamlessly.',
        }
      ].map((testimonial, i) => (
        <div key={i} className="px-2 outline-none w-screen h-full">
          <div className=" h-[15rem]">
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="min-w-0">
                  <h4 className="font-semibold text-xl text-[#059669] truncate">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm truncate">{testimonial.role}</p>
                </div>
              </div>
             
              <p className="text-gray-700 italic flex-grow">"{testimonial.quote}"</p>
            </motion.div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
</section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We'd love to hear from you.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">hello@usefintar.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community</h4>
                    <p className="text-gray-600">Join our Facebook group for African entrepreneurs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Live Chat</h4>
                    <p className="text-gray-600">Get instant help from our support team</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <form className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Footer */}
<footer className="bg-gray-950 text-gray-300 relative overflow-hidden">
  {/* Background Decorative Elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
  </div>

  {/* Main Footer Content */}
  <div className="container mx-auto max-w-7xl px-4 py-16 relative z-10">
    {/* Top Section - Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
      {/* Brand Column - Spans 2 cols on mobile */}
      <div className="col-span-2">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">fintar</span>
            <span className="text-emerald-400 text-sm">Financial Intelligence</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-8 text-base leading-relaxed max-w-md">
          Empowering African SMEs with AI-driven financial insights for smarter decisions and sustainable growth.
        </p>
        
        {/* Social Links */}
        <div className="flex space-x-3">
          {[
            { 
              icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
              label: 'Twitter'
            },
            { 
              icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
              label: 'LinkedIn'
            },
            { 
              icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.40-1.439-1.40z"/></svg>,
              label: 'Instagram'
            }
          ].map((social, index) => (
            <a
              key={index}
              href="#"
              className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
              aria-label={social.label}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Product Links */}
      <div className="">
        <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
          Product
          <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
        </h3>
        <ul className="space-y-3">
          {['Features', 'Pricing', 'Use Cases', 'Testimonials', 'API'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources Links */}
      <div className="">
        <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
          Resources
          <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
        </h3>
        <ul className="space-y-3">
          {['Blog', 'Guides', 'Webinars', 'Help Center', 'Community'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Company Links */}
      <div className="">
        <h3 className="text-white font-semibold mb-6 text-lg relative inline-block">
          Company
          <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
        </h3>
        <ul className="space-y-3">
          {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
            <li key={item}>
              <a 
                href={item === 'Contact' ? 'mailto:hello@usefintar.com' : `#${item.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

    
    </div>

    {/* Bottom Section */}
    <div className="border-t border-gray-800 pt-8">
      <div className="flex flex-col md:flex-row justify-between text-gray-400 items-center space-y-4 md:space-y-0">
        {/* Countries */}
        <div className="text-sm ">
        <span>© {new Date().getFullYear()} Fintar. All rights reserved.</span>
        </div>
        
        {/* Copyright and Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm ">
           <a href="#" className="hover:text-white transition-colors text-sm">Powered By Algoritic Inc</a> 
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

export default Home;
