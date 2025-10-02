'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shojumaru } from 'next/font/google';

const shojumaruFont = Shojumaru({
  subsets: ["latin"],
  weight: "400",
});

export default function Hero() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
    };
    
    const stagger = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <section 
            className="min-h-screen pt-32 md:pt-32 px-4 md:pt-32 pb-16 md:px-8 flex flex-col justify-center items-center relative bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://res.cloudinary.com/dzibfknxq/image/upload/v1759420216/unnamed_s4ud02.png")'
            }}
        >
            {/* Optional: Add an overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="container max-w-[60vw] mx-auto relative z-10">
                <div className="flex flex-col justify-center items-center text-center">
                    <motion.div variants={stagger} initial="initial" animate="animate">
                        <motion.h1 
                            className={`w-full text-4xl lg:text-5xl text-center xl:text-6xl font-bold text-white mb-6 leading-tight ${shojumaruFont.className}`}
                            variants={fadeIn}
                        >
                            Master Your <span className="text-emerald-400">Business Cash Flow</span> with Ease
                        </motion.h1>
                        <motion.p 
                        className="text-md mx-auto md:mx-24 justify-center items-center text-center text-white mb-8"
                        variants={fadeIn}
                      >
                            Empowering African SMEs with AI-driven cash flow management system with financial insights for smarter decisions and sustainable growth.
                        </motion.p>
                        <motion.div className="mb-6" variants={fadeIn}>
                            <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
                                <a
                                    href='/auth/signup'
                                    className="bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white font-medium px-8 py-4 rounded-md transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Get Started For Free
                                </a>
                                <a
                                    href='/'
                                    className="flex items-center justify-center border-2 border-white hover:bg-white hover:text-emerald-600 text-white font-medium px-8 py-4 rounded-md transition-all transform hover:scale-105"
                                >
                                    <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m74.77 217.3l-114.45 69.14a10.78 10.78 0 0 1-16.32-9.31V186.87a10.78 10.78 0 0 1 16.32-9.31l114.45 69.14a10.89 10.89 0 0 1 0 18.6"/>
                                    </svg>
                                    Watch a Demo
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}