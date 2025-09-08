'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Brain, Plug, DollarSign, Users, LayoutDashboard, Shield } from 'lucide-react';

function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100/50">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Nimbus</span>
          </motion.div>

          <nav className="hidden lg:flex items-center space-x-8">
            {['Features', 'Testimonials', 'Pricing', 'FAQ', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-200 font-medium"
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-1.5 rounded-md transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
          >
            Sign In
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={stagger} initial="initial" animate="animate">
              <motion.div 
                className="inline-flex items-center bg-[#059669]/20 text-[#059669]/60 px-4 py-2 rounded-full mb-6 font-medium"
                variants={fadeIn}
              >
                <span className="mr-2 tex"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="m105.7 263.5l107.5 29.9a7.9 7.9 0 0 1 5.4 5.4l29.9 107.5a7.8 7.8 0 0 0 15 0l29.9-107.5a7.9 7.9 0 0 1 5.4-5.4l107.5-29.9a7.8 7.8 0 0 0 0-15l-107.5-29.9a7.9 7.9 0 0 1-5.4-5.4l-29.9-107.5a7.8 7.8 0 0 0-15 0l-29.9 107.5a7.9 7.9 0 0 1-5.4 5.4l-107.5 29.9a7.8 7.8 0 0 0 0 15Z"><animateTransform additive="sum" attributeName="transform" calcMode="spline" dur="6s" keySplines=".42, 0, .58, 1; .42, 0, .58, 1" repeatCount="indefinite" type="rotate" values="-15 256 256; 15 256 256; -15 256 256"/><animate attributeName="opacity" dur="6s" values="1; .75; 1; .75; 1; .75; 1"/></path></svg></span> Early Access Now Open
              </motion.div>
              <motion.h1 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                variants={fadeIn}
              >
                Master Your <span className="text-emerald-500">Business Finances</span> with Ease
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 mb-8 max-w-2xl"
                variants={fadeIn}
              >
                Nimbus empowers African SMEs with AI-driven cash flow managagement system with financial insights for smarter decisions and sustainable growth.
              </motion.p>
              <motion.div className="mb-6" variants={fadeIn}>
                <div className="flex flex-col sm:flex-row gap-4">
                <a
                    href='#'
                    className="bg-[#059669]/50 hover:bg-[#059669] flex flex-cols justify-center items-center text-white font-medium px-8 py-4 rounded-md transition-all disabled:opacity-50 shadow-sm hover:shadow"
                  >
                    Get Started For Free
                  </a>
                  <a
                    href='#'
                    className="flex flex-cols justify-center items-center border-2 border-[#059669]/50 hover:border-[#059669] hover:bg-[#059669] hover:text-white text-[#059669] font-medium px-8 py-4 rounded-md transition-all disabled:opacity-50"
                  >
                    <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m74.77 217.3l-114.45 69.14a10.78 10.78 0 0 1-16.32-9.31V186.87a10.78 10.78 0 0 1 16.32-9.31l114.45 69.14a10.89 10.89 0 0 1 0 18.6"/></svg>  Watch a Demo
                  </a>
                </div>
              </motion.div>
              <motion.div className="flex items-center gap text-sm text-gray-500" variants={fadeIn}>
                <span className="flex items-center">
                  
                  Free Core Features
                </span>
                <span className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                    <path fillRule="evenodd" d="M128 96a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16" clipRule="evenodd" />
                  </svg>
                GDPR Compliant
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                    <path fillRule="evenodd" d="M128 96a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16" clipRule="evenodd" />
                  </svg>
                  No Credit Card Required
                </span>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-3xl transform rotate-2"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 transform -rotate-2">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between bg-gray-800">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-md bg-red-500"></div>
                        <div className="w-3 h-3 rounded-md bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-md bg-green-500"></div>
                      </div>
                      <span className="text-xs text-gray-400">dashboard.nimbus.com</span>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-white">Financial Dashboard</h2>
                        <span className="text-sm text-emerald-400">Last 30 Days</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-900/50 p-4 rounded-xl">
                          <p className="text-sm text-emerald-300">Income</p>
                          <p className="text-2xl font-bold text-white">₦452,800</p>
                          <p className="text-xs text-emerald-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +12.5%
                          </p>
                        </div>
                        <div className="bg-red-900/50 p-4 rounded-xl">
                          <p className="text-sm text-red-300">Expenses</p>
                          <p className="text-2xl font-bold text-white">₦283,500</p>
                          <p className="text-xs text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            +5.2%
                          </p>
                        </div>
                      </div>
                      <div className="bg-emerald-50/10 p-4 rounded-xl mt-4">
                        <p className="text-sm text-emerald-300">Projected Balance</p>
                        <p className="text-2xl font-bold text-white">₦169,300</p>
                        <div className="w-full bg-gray-700 rounded-md h-2 mt-2">
                          <div className="bg-emerald-500 h-2 rounded-md" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">Trusted by African Businesses</p>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-36 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Nimbus?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Empowering small businesses with intuitive, AI-driven tools.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
  { 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
    title: 'Cash Flow Tracking', 
    desc: 'Monitor income and expenses effortlessly in real-time with categorization of transactions.' 
  },
  { 
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
    title: 'Budgeting Tools', 
    desc: 'Create and manage budgets for specific categories or periods with alerts for overspending or nearing budget limits.' 
  },
  { 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
    title: 'Financial Insights', 
    desc: 'AI-generated reports on cash flow trends, forecasts, and anomalies with visual dashboards chart for easy interpretation.' 
  },
  { 
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
    title: 'Basic Decision Support', 
    desc: 'AI recommendations for cost-saving and revenue optimization and suggestions based on user interactions and historical data.' 
  },
  { 
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', 
    title: 'User Interface', 
    desc: 'Intuitive, mobile-friendly design with multi-language and multi-currency support.' 
  },
  { 
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', 
    title: 'Security & Compliance', 
    desc: 'Bank-level encryption, GDPR compliance, and regular security audits to protect your financial data.' 
  }

            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
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
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]}
      customPaging={(i) => (
        <div className="w-3 h-3 mt-8 rounded-md bg-gray-300 transition-all duration-300"></div>
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
          emoji: '👔', 
          quote: 'Nimbus revealed seasonal cash flow patterns I never noticed, helping me optimize inventory decisions. My revenue increased by 30% in just 3 months!',
          rating: 5
        },
        { 
          name: 'Chukwuma E.', 
          role: 'Restaurant, Benin City', 
          emoji: '🍲', 
          quote: 'No more payroll stress! Nimbus gives me weeks of advance notice to plan and adjust. The AI predictions have been incredibly accurate.',
          rating: 5
        },
        { 
          name: 'Fatima O.', 
          role: 'Tech Startup, Abuja', 
          emoji: '💻', 
          quote: 'As a growing startup, cash flow management was our biggest challenge. Nimbus helped us secure funding by providing professional financial forecasts.',
          rating: 5
        },
        { 
          name: 'Kwame A.', 
          role: 'Agriculture Export, Accra', 
          emoji: '🌱', 
          quote: 'The multi-currency support is fantastic for our export business. We can now track finances in both local and foreign currencies seamlessly.',
          rating: 4
        }
      ].map((testimonial, i) => (
        <div key={i} className="px-4 outline-none">
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-md flex items-center justify-center mr-4">
                <span className="text-xl">{testimonial.emoji}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {Array.from({ length: testimonial.rating }).map((_, j) => (
                <svg key={j} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {Array.from({ length: 5 - testimonial.rating }).map((_, j) => (
                <svg key={j} className="w-5 h-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              ))}
            </div>
            <p className="text-gray-700 italic">"{testimonial.quote}"</p>
          </motion.div>
        </div>
      ))}
    </Slider>
  </div>
</section>

      {/* Premium Coming Soon Section */}
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
      <div className="inline-flex items-center bg-[#059669]/70 text-white px-4 py-2 rounded-md mb-6 font-medium backdrop-blur-sm">
        <span className="mr-2">🚀</span> Premium Features Coming Soon
      </div>
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
            desc: 'Seamless integration with accounting software and banks API integration for automated transaction updates.' 
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
            desc: 'Tailored views for different business needs using a drag-and-drop widgets for personalized layouts.' 
          },
          { 
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
            title: 'Advanced Security', 
            desc: 'Enterprise-grade security with two-factor authentication, audit logs, and SOC 2 compliance.' 
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
            {isSubmitting ? 'Notifying...' : 'Notify Me'}
          </button>
        </form>
      </div>
    </motion.div>
  </div>
</section>

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
                  <span className="text-4xl font-bold text-gray-900">₦0</span>
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
                  <span className="text-4xl font-bold text-gray-900">₦5,000</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">For growing businesses</p>
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
                  <span className="text-4xl font-bold text-gray-900">₦12,000</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">For established businesses</p>
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
            <p className="text-xl text-gray-600">Everything you need to know about Nimbus</p>
          </motion.div>
          
          <div className="space-y-4">
            {[
              {
                question: "Is Nimbus really free?",
                answer: "Yes! Our core features are completely free forever. We believe every African business should have access to powerful financial tools. We'll offer premium features in the future, but the core functionality will always remain free."
              },
              {
                question: "How does Nimbus protect my financial data?",
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
                question: "Can I use Nimbus on my mobile phone?",
                answer: "Absolutely! Nimbus is designed to work perfectly on mobile devices. We'll also be launching dedicated iOS and Android apps in the near future."
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
                    <p className="text-gray-600">hello@usenimbus.com</p>
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

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-500 to-indigo-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Take Control of Your Finances Today</h2>
            <p className="text-xl text-white/90 mb-10">Join thousands of African businesses thriving with Nimbus.</p>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-6 py-4 rounded-md border border-white/20 focus:ring-2 focus:ring-white focus:border-transparent outline-none bg-white/10 text-white placeholder-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-emerald-500 font-medium px-8 py-4 rounded-md transition-all hover:bg-gray-100 disabled:opacity-50 shadow-sm hover:shadow"
                >
                  {isSubmitting ? 'Joining...' : 'Get Started Free'}
                </button>
              </div>
              <p className="text-sm text-white/70">No credit card required</p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-300">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Nimbus</span>
              </div>
              <p className="text-sm">Empowering African businesses with financial clarity</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {['Features', 'Testimonials', 'Pricing', 'FAQ', 'About Us', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={item === 'Contact' ? 'mailto:hello@usenimbus.com' : `#${item.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2025 Nimbus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;