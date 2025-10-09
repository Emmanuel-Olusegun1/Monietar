'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Rajdhani } from 'next/font/google';

const rajdhaniFont = Rajdhani({
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
    const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    
    // Spring physics for smoother animations
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
    const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    };
    
    const stagger = {
        animate: { transition: { staggerChildren: 0.15 } }
    };

    return (
        <section 
            ref={containerRef}
            className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 overflow-hidden"
        >
            {/* Modern Background Elements */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <motion.div 
                    className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                    style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
                />
                <motion.div 
                    className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
                    style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
                />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
                </div>

                {/* Accent Lines */}
                <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-emerald-500/40 to-transparent"></div>
                <div className="absolute bottom-20 right-10 w-px h-32 bg-gradient-to-t from-emerald-500/30 to-transparent"></div>
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            y: useTransform(scrollYProgress, [0, 1], [0, Math.random() * 200 - 100])
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>
            
            <motion.div 
                className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                style={{
                    y: smoothY,
                    opacity: smoothOpacity,
                    scale: smoothScale
                }}
            >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                    {/* Left Content */}
                    <motion.div 
                        className="flex-1 text-center lg:text-left"
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.h1 
                            className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight ${rajdhaniFont.className}`}
                            variants={fadeInUp}
                        >
                            Master Your {' '}
                            <motion.span 
                                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300"
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    backgroundSize: '200% 200%'
                                }}
                            >
                                Business Cash Flow
                            </motion.span>{' '}
                            with Ease
                        </motion.h1>
                        
                        <motion.p 
                            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                            variants={fadeInUp}
                        >
                            Empowering African SMEs with AI-driven cash flow management system with financial insights for smarter decisions and sustainable growth.
                        </motion.p>
                        
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                            variants={fadeInUp}
                        >
                            <motion.a
                                href='/auth/signup'
                                className="group relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="relative">Get Started For Free</span>
                                <motion.svg 
                                    className="w-5 h-5 relative" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </motion.a>
                            
                            <motion.a
                                href='/'
                                className="group relative border-2 border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.svg 
                                    className="w-5 h-5" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <path d="M8 5v14l11-7z"/>
                                </motion.svg>
                                <span>Watch a Demo</span>
                            </motion.a>
                        </motion.div>

                        {/* Regulatory Compliance Badges - Responsive Grid */}
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 lg:max-w-lg"
                            variants={fadeInUp}
                        >
                            <motion.div 
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10"
                                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-emerald-300">Licensed by CBN</div>
                                    <div className="text-xs text-gray-400">Central Bank of Nigeria</div>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10"
                                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-blue-300">Insured by NDIC</div>
                                    <div className="text-xs text-gray-400">Deposit Insurance Corporation</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Modern Fintech Visualization */}
                    <motion.div 
                        className="hidden lg:flex flex-1 relative justify-center items-center"
                        initial={{ opacity: 0, x: 100, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Animated Cards Stack */}
                        <div className="relative w-full max-w-md">
                            {/* Card 1 */}
                            <motion.div
                                className="absolute -top-6 -right-6 w-full h-64 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-2xl border border-emerald-400/20 backdrop-blur-sm"
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotateZ: [0, -1, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            
                            {/* Card 2 */}
                            <motion.div
                                className="absolute -top-3 -right-3 w-full h-64 bg-gradient-to-br from-emerald-600/10 to-green-600/5 rounded-2xl border border-emerald-500/20 backdrop-blur-sm"
                                animate={{ 
                                    y: [0, -5, 0],
                                    rotateZ: [0, 0.5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                            />
                            
                            {/* Main Card */}
                            <motion.div
                                className="relative w-full h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-emerald-400/30 backdrop-blur-sm p-6 shadow-2xl"
                                whileHover={{ scale: 1.02, rotateY: 5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Animated Chart */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-sm font-semibold text-white">Cash Flow Trend</div>
                                        <div className="text-xs text-emerald-400">+12.5%</div>
                                    </div>
                                    <div className="h-20 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg flex items-end justify-between p-2">
                                        {[30, 45, 60, 40, 75, 50, 65].map((height, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-4 bg-gradient-to-t from-emerald-400 to-green-500 rounded-t"
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ 
                                                    duration: 1, 
                                                    delay: i * 0.1,
                                                    type: "spring",
                                                    stiffness: 100
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Income', value: '₦250K', trend: 'up' },
                                        { label: 'Expenses', value: '₦180K', trend: 'down' },
                                        { label: 'Profit', value: '₦70K', trend: 'up' }
                                    ].map((stat, index) => (
                                        <motion.div 
                                            key={index}
                                            className="text-center p-2 bg-white/5 rounded-lg"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <div className={`text-sm font-semibold ${
                                                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-gray-400">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}