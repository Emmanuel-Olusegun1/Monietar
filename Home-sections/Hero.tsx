'use client';

import { motion } from 'framer-motion';
import { useState} from 'react';



export default function Hero() {

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
      };
    
      const stagger = {
        animate: { transition: { staggerChildren: 0.1 } }
      };

    return(

         <section className="pt-34 px-4 md:pt-34 pb-16 md:px-54 min-h-[80vh] flex flext-col justify-center items-center">
                <div className="container mx-auto">
                  <div className="flex flext-col justify-center items-center text-center">
                    <motion.div variants={stagger} initial="initial" animate="animate">
                      <motion.h1 
                        className="w-full text-4xl lg:text-5xl text-center justify-center items-center xl:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                        variants={fadeIn}
                      >
                        Master Your <span className="text-emerald-500">Business Cash Flow</span> with Ease
                      </motion.h1>
                      <motion.p 
                        className="text-md mx-auto md:mx-24 justify-center items-center text-center text-gray-600 mb-8"
                        variants={fadeIn}
                      >
                        Empowering African SMEs with AI-driven cash flow managagement system with financial insights for smarter decisions and sustainable growth.
                      </motion.p>
                      <motion.div className="mb-6" variants={fadeIn}>
                        <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
                        <a
                            href='/signup'
                            className="bg-[#059669]/50 hover:bg-[#059669] flex flex-cols justify-center items-center text-white font-medium px-8 py-4 rounded-md transition-all disabled:opacity-50 shadow-sm hover:shadow"
                          >
                            Get Started For Free
                          </a>
                          <a
                            href='/'
                            className="flex flex-cols justify-center items-center border-2 border-[#059669]/50 hover:border-[#059669] hover:bg-[#059669] hover:text-white text-[#059669] font-medium px-8 py-4 rounded-md transition-all disabled:opacity-50"
                          >
                            <svg className="mr-2" xmlns="http://www.w3. justify-cenorg/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m74.77 217.3l-114.45 69.14a10.78 10.78 0 0 1-16.32-9.31V186.87a10.78 10.78 0 0 1 16.32-9.31l114.45 69.14a10.89 10.89 0 0 1 0 18.6"/></svg>  Watch a Demo
                          </a>
                        </div>
                      </motion.div>
                      
                    </motion.div>
                  </div>
                </div>
              </section>


    );
}

