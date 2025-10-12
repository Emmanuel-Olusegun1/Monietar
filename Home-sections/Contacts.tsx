// 'use client'

// import { motion } from 'framer-motion';
// import { useState, FormEvent } from 'react';

// export default function Contact() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitMessage('');

//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSubmitMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
//         setFormData({ name: '', email: '', subject: '', message: '' });
//       } else {
//         setSubmitMessage(data.error || 'Sorry, something went wrong. Please try again.');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       setSubmitMessage('Network error. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const openWhatsApp = () => {
//     const message = "Hello Monietar! I'm interested in learning more about your financial management solutions.";
//     const encodedMessage = encodeURIComponent(message);
//     window.open(`https://wa.me/2349012345678?text=${encodedMessage}`, '_blank');
//   };

//   return (
//     <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
//       <div className="container mx-auto max-w-6xl">
//         <motion.div 
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <motion.h2 
//             className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             Get in Touch
//           </motion.h2>
//           <motion.p 
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             Ready to transform your financial management? Let's start the conversation.
//           </motion.p>
//         </motion.div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Contact Information */}
//           <motion.div
//             className="lg:col-span-1"
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h3 className="text-2xl font-semibold text-gray-900 mb-8">Connect With Us</h3>
            
//             <div className="space-y-6">
//               {/* Email */}
//               <motion.div 
//                 className="flex items-start p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
//                   <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
//                   <p className="text-gray-600 mb-2">Get detailed responses to your queries</p>
//                   <a href="mailto:hello@monietar.com" target='_blank' className="text-emerald-600 hover:text-emerald-700 font-medium">
//                     hello@monietar.com
//                   </a>
//                 </div>
//               </motion.div>
              
//               {/* WhatsApp */}
//               <motion.button
//                 onClick={openWhatsApp}
//                 className="w-full flex items-start p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-left"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
//                   <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">WhatsApp Business</h4>
//                   <p className="text-gray-600 mb-2">Instant messaging for quick questions</p>
//                   <span className="text-green-600 hover:text-green-700 font-medium">
//                   <a href="https://wa.link/5t7265" target='_blank' className="text-emerald-600 hover:text-emerald-700 font-medium">
//                     Chat Now →
//                   </a>
//                   </span>
//                 </div>
//               </motion.button>
              
//               {/* Response Time */}
//               <motion.div
//                 className="flex items-start p-4 rounded-xl bg-emerald-50 border border-emerald-200"
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//               >
//                 <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
//                   <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Quick Response</h4>
//                   <p className="text-gray-700 text-sm">
//                     Average response time: <span className="font-semibold text-emerald-600">Under 2 hours</span>
//                   </p>
//                 </div>
//               </motion.div>

//               {/* Support Hours */}
//               <motion.div
//                 className="flex items-start p-4 rounded-xl bg-blue-50 border border-blue-200"
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//               >
//                 <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
//                   <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Support Hours</h4>
//                   <p className="text-gray-700 text-sm">
//                     Monday - Friday: 9AM - 6PM WAT<br />
//                     Weekend: Emergency support only
//                   </p>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
          
//           {/* Contact Form */}
//           <motion.div
//             className="lg:col-span-2"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
//               <h3 className="text-2xl font-semibold text-gray-900 mb-2">Send us a Message</h3>
//               <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you promptly.</p>
              
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name *
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
//                       placeholder="Enter your full name"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject *
//                   </label>
//                   <select
//                     id="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
//                     required
//                   >
//                     <option value="">Select a subject</option>
//                     <option value="general">General Inquiry</option>
//                     <option value="sales">Sales Question</option>
//                     <option value="support">Technical Support</option>
//                     <option value="enterprise">Enterprise Solution</option>
//                     <option value="partnership">Partnership</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
//                     Message *
//                   </label>
//                   <textarea
//                     id="message"
//                     rows={5}
//                     value={formData.message}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
//                     placeholder="Tell us how we can help you..."
//                     required
//                   ></textarea>
//                 </div>
                
//                 <motion.button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
//                   whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending Message...
//                     </>
//                   ) : (
//                     'Send Message'
//                   )}
//                 </motion.button>

//                 {submitMessage && (
//                   <motion.div 
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`p-4 rounded-lg text-center ${
//                       submitMessage.includes('Thank you') 
//                         ? 'bg-green-100 text-green-700 border border-green-200' 
//                         : 'bg-red-100 text-red-700 border border-red-200'
//                     }`}
//                   >
//                     {submitMessage}
//                   </motion.div>
//                 )}
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-gray-500 text-sm">
//                   We respect your privacy. Your information will never be shared with third parties.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client'

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { Mail, MessageCircle, Clock, Calendar, Send, Shield } from 'lucide-react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage(data.error || 'Sorry, something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = "Hello Monietar! I'm interested in learning more about your financial management solutions.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/2349012345678?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Contact Us</span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Get in Touch
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to transform your financial management? Let's start the conversation.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Connect With Us</h3>
            
            <div className="space-y-6">
              {/* Email */}
              <motion.div 
                className="flex items-start p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                whileHover={{ y: -2 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <Mail className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                  <p className="text-gray-600 mb-2 text-sm">Get detailed responses to your queries</p>
                  <a href="mailto:info@algoritic.com.ng" target='_blank' className="text-gray-900 hover:text-gray-700 font-medium text-sm">
                    info@algoritic.com.ng
                  </a>
                </div>
              </motion.div>
              
              {/* WhatsApp */}
              <motion.button
                onClick={openWhatsApp}
                className="w-full flex items-start p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-left group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <MessageCircle className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">WhatsApp Business</h4>
                  <p className="text-gray-600 mb-2 text-sm">Instant messaging for quick questions</p>
                  <span className="text-gray-900 hover:text-gray-700 font-medium text-sm">
                    <a href="https://wa.link/5t7265" target='_blank' className="text-gray-900 hover:text-gray-700 font-medium">
                      Chat Now →
                    </a>
                  </span>
                </div>
              </motion.button>
              
              {/* Response Time */}
              <motion.div
                className="flex items-start p-6 rounded-xl bg-gray-50 border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quick Response</h4>
                  <p className="text-gray-700 text-sm">
                    Average response time: <span className="font-semibold text-gray-900">Under 2 hours</span>
                  </p>
                </div>
              </motion.div>

              {/* Support Hours */}
              <motion.div
                className="flex items-start p-6 rounded-xl bg-gray-50 border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mr-4 flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Support Hours</h4>
                  <p className="text-gray-700 text-sm">
                    Monday - Friday: 9AM - 6PM WAT<br />
                    Weekend: Emergency support only
                  </p>
                </div>
              </motion.div>

              {/* Privacy */}
              <motion.div
                className="flex items-start p-6 rounded-xl bg-gray-50 border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Your Privacy</h4>
                  <p className="text-gray-700 text-sm">
                    We never share your information with third parties. All data is encrypted and secure.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Send us a Message</h3>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you promptly.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales Question</option>
                    <option value="support">Technical Support</option>
                    <option value="enterprise">Enterprise Solution</option>
                    <option value="partnership">Partnership</option>
                    <option value="waitlist">Waitlist Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none bg-white"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {submitMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center border ${
                      submitMessage.includes('Thank you') 
                        ? 'bg-gray-50 text-gray-700 border-gray-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <p className="text-sm">
                    We respect your privacy. Your information will never be shared with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <motion.div
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { number: '1,000+', label: 'Businesses Helped' },
                { number: '24h', label: 'Avg. Response Time' },
                { number: '98%', label: 'Satisfaction Rate' }
              ].map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}