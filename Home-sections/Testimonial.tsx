'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Testimonials() {

    


  return (

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
          quote: 'Monietar revealed seasonal cash flow patterns I never noticed, helping me optimize inventory decisions. My revenue increased by 30% in just 3 months!',
        },
        { 
          name: 'Chukwuma E.', 
          role: 'Restaurant, Benin City',
          quote: 'No more payroll stress! Monietar gives me weeks of advance notice to plan and adjust. The AI predictions have been incredibly accurate.',
        },
        { 
          name: 'Fatima O.', 
          role: 'Tech Startup, Abuja',
          quote: 'As a growing startup, cash flow management was our biggest challenge. Monietar helped us secure funding by providing professional financial forecasts.',
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

  );
}