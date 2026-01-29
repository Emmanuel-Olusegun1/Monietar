'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Inter } from 'next/font/google';

const InterFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax effects
    const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
    const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
    const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
    
    const [imagesLoaded, setImagesLoaded] = useState({
        main: false,
        analytics: false,
        reports: false
    });

    const dashboardImages = {
        main: "https://res.cloudinary.com/dzibfknxq/image/upload/v1765131259/download_3_kmovob.png",
        analytics: "https://res.cloudinary.com/dzibfknxq/image/upload/v1765131756/download_4_enb6hl.png",
        reports: "https://res.cloudinary.com/dzibfknxq/image/upload/v1765131756/download_4_enb6hl.png"
    };

    const handleImageLoad = (imageKey: keyof typeof imagesLoaded) => {
        setImagesLoaded(prev => ({ ...prev, [imageKey]: true }));
    };


    return (
        <div ref={containerRef} className="relative bg-[#f1f1f1] overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#f3f4f6_1px,transparent_1px),linear-gradient(#f3f4f6_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>
            </div>

            {/* Main content */}
            <section className="relative min-h-screen flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-0 mb-0 max-w-7xl">
                    <div className="flex flex-col items-center justify-center text-center py-10 pt-28">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg mb-12"
                        >
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-gray-700">
                                Trusted by African SMEs
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="mb-12 max-w-4xl mx-auto"
                        >
                            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight ${InterFont.className}`}>
                                <span className="block text-gray-900">Master Your Business</span>
                                <span className="text-emerald-600">Cash Flow with AI</span>
                            </h1>
                            
                            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-light">
                                AI-powered cash flow intelligence for African SMEs. 
                                Predict trends, optimize operations, and drive growth with real-time financial insights.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <motion.a
                                href='/auth/signup'
                                className="group bg-emerald-600 text-white font-medium px-8 py-4 rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-3"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>Start Free Trial</span>
                                <svg 
                                    className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.a>
                            
                            <motion.a
                                href='https://youtube.com/@algoritic?si=PRPb9aGjrVT0_Pc6'
                                className="group border border-gray-300 text-emerald-700 hover:text-emerald-800 font-medium px-8 py-4 rounded-lg transition-all duration-200 hover:border-emerald-400 flex items-center justify-center gap-3"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg 
                                    className="w-5 h-5 text-emerald-600 group-hover:text-emerald-800" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <span>Watch Demo</span>
                            </motion.a>
                        </motion.div>

                        {/* Dashboard with Floating Pill Features */}
                        <div className="relative w-[80%] max-w-6xl mx-auto mt-8">

                            {/* Stacked Dashboard */}
                            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px]">
                                {/* Card 3 - Back */}
                                <motion.div 
                                    className="absolute inset-x-0 top-12 lg:top-16 mx-auto w-[85%] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                                    style={{ y: y3 }}
                                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    
                                    <div className="relative h-full">
                                        {!imagesLoaded.reports && (
                                            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                        )}
                                        
                                        <img
                                            src={dashboardImages.reports}
                                            alt="Monietar Reports Dashboard"
                                            className={`w-full h-full object-cover ${imagesLoaded.reports ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
                                            onLoad={() => handleImageLoad('reports')}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
                                    </div>
                                </motion.div>

                                {/* Card 2 - Middle */}
                                <motion.div 
                                    className="absolute inset-x-0 top-6 lg:top-8 mx-auto w-[90%] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                                    style={{ y: y2 }}
                                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <div className="relative h-full">
                                        {!imagesLoaded.analytics && (
                                            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                        )}
                                        
                                        <img
                                            src={dashboardImages.analytics}
                                            alt="Monietar Analytics Dashboard"
                                            className={`w-full h-full object-cover ${imagesLoaded.analytics ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
                                            onLoad={() => handleImageLoad('analytics')}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
                                    </div>
                                </motion.div>

                                {/* Card 1 - Front */}
                                <motion.div 
                                    className="absolute inset-x-0 top-0 mx-auto w-[95%] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                                    style={{ y: y1 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    whileHover={{ y: -5 }}
                                >
                                    
                                    <div className="relative h-full">
                                        {!imagesLoaded.main && (
                                            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                        )}
                                        
                                        <img
                                            src={dashboardImages.main}
                                            alt="Monietar Cash Flow Dashboard"
                                            className={`w-full h-full object-cover ${imagesLoaded.main ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
                                            onLoad={() => handleImageLoad('main')}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}