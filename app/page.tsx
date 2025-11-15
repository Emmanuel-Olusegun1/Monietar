'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Brain, Plug, DollarSign, Users, LayoutDashboard, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/Home-sections/Hero';
import Trustbar from '@/Home-sections/Trustbar';
import Feature from '@/Home-sections/Feature';
import Premuim from '@/Home-sections/Premium';
import Pricing from '@/Home-sections/Pricing';
import Faqs from '@/Home-sections/Faqs';
// import Benefits from '@/Home-sections/Benefits'
// import Testimonials from '@/Home-sections/Testimonial';
import Contacts from '@/Home-sections/Contacts';

function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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
      {/* FAQ Section */}
      <Faqs />
      {/* Benefits section */}
      {/* <Benefits /> */}
      {/* Pricing Section */}
      <Pricing />
      {/* Testimonials Section */}
      {/* <Testimonials /> */}
      {/* Contact Section */}
      <Contacts />
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
