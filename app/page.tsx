"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// Define a type for social media objects
interface SocialMedia {
  name: string;
  icon: string;
  rule?: "evenodd" | "nonzero" | "inherit";
}




export default function Home() {

  // Define a type for logos
interface Logo {
  name: string;
  id: number;
  url: string;
}


  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  const logos: Logo[] = [
    { name: "AfriPay", id: 1 , url:"data:image/jpeg;base64,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"},
    { name: "ShopRise", id: 2, url:"data:image/png;base64,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" },
    { name: "GrowFast", id: 3, url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAAA/FBMVEX///8Vizcegpz///3//v8AAAD8//8AeJb///wWijgAfiFoo7MAhy7t+fL7+/tlqHnW6OgAepTMzMyhoaEfgZ3t7e3T09Pz+vuYmJjh4eG3t7fz8/P3//wAeZGKt8O7191gYGDCwsIwMDDL4OV8fHyNjY0AhSbd3d2qqqo/Pz9MTEwjIyN1dXVra2sAfB4AiCtInGJZWVmjxs8Ab4272sbS59g7llIsh54ojEQ8PDyFhYUSEhInJyeBsLw/kKKcxM2Yw6SDt5HQ6dhbl6UVf5FYomx3sohdn6pCmFijzK3j8eVzsoIAeBIThT1TlaxxpraTy6qv07nG6dB+vY+gEZhlAAAMJElEQVR4nO2ZC1fiyBLHGwIJCQkkyNsgohAQQZHhpTMC4uAIjnq5+/2/y63q7vBwwXFld889c+p3RoVOp9P/ruqq6gxjBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQxO+Kwv+tf/2tUDIZpuIHVVWZbSvK7ybQ1pxbIZCpbS362xmQqcMgyFKVCMv8KARffj+Bil3oFzNKiNn9QjDYz/x2AhkbfXnNMOVUCyb/aYGKqqhrX0PvPcu/JmJC6EPDi77iz3Js+FC8tZntfAd9yaG6y0cjysbkPgeMrc4X47u7u3Fnrv4iYquu4IPycCncdSLrF90h2C+Z1G53qMBFcfcWqDBr3PvpXZqm6XkXvbH1XufJwDAuLgzDiL/bbYmq2PeO4xQk2v3acxXWdpIvIyeo2bsEuqNh4fTjUrYNEWLq2LwM6AGJ6ZnjXZ0jrGOYst/lYP6hB2S+B9f5sXHxJehYI0e73XWzew/q9xTIrKkR2MSbulu9NMIWa11Ns/ORB7SddwT2nSIbOsPMrpuLcPOeApnVM4X5wD/BTfGT7j1s7aq4PVNfU7i91xteg+8IjEaZ/SW6fTmRoz0FYgB45PpMY/Aw6yzGcdNDCSa6n4KRT2EqBDL0ZGzoer46PWAOMF4oIWW9zNr8iFeiKEsrOF84Bd8bIXLDVTujFNu8r9yD/uPkACAw6ZxiOPtkKaewB08HvOlEtlizZ5DoLfizsCGyMfLM0H2Bnr8HQ8qWolmVdRgX6LSx5ERc1Vcis5HKV3G5SIr8JXsdaXDzKXQOfbZWnXgBXQ8YCzEZhgtpxb2A0cHPEQsIse74brwMKHE/yHgz/j02n1tzdzme5cdWlVmdTjeiKlIgC3EUZZkm7PbR7cjmZTegiqSjQutRkad9JZZRb51kUCu6LlTmH0tKb1DYFOdrLtZagCfPmPPw89Pzflpjw4PIChZWIyh/ILbpZRwLBPiue4bxqEbw+SE20y8mLMRT6eLZ8NCJpUBFTlCke4WdvjhOUtMKUZe9wkZzbC6v3S9oyaTTL3IrBvtY5cDvYGFnnP2FwDlGRfNuoxGcqPXAZ2HBVfM/uO1089nl85qzCQ+k5gBzPU72CQR7XbEys58YebgxJsZlwBuDId8IlMs40mTQgYo7ipGEC7xfthZxIk7SD027E8kvGKM5njdTNszEckO+QF3sOd2boP92jBkbo2JjwqaP3G9RsPkHF2jp0B1WArWAa+gQqiJLgRvPAH1JOXvNXgo89fUlg0Mu0NeXdIqf3ILTS8jYu6I9F8jDCdQ4oEhhE9OL85tA5/zZe7QgUkDqgD4uhEWRJSE+gYvOodFs4ShCYGYJXi1+wVknC+B9mtZ+5TL5WkDdpvWDEDr7GOO+OME+tDjOffFz8hjDDQUz2rE83IKBy8BsPn/QoSSE/ReHmAnbLq5GUOEDVuZ3sEiQ82GMFt/QU/w4g1BsznyBIMBJcpxXTBD9JM771c64meJ3XyA0B3lIybQ17pKKbd9iv/bOOuDX8CXvssjWi9KCz9wTLZj2nffohsBSHXBq2I+TCwP33uQCVD2BYboihVxg1wHuW2slECMFFziCjm0NDKOJ/McydlQIVF30zSDu0OI9aoJZHSV5ov98uY0KYJYwQDe+ybQjBRoyxKpM1Q1ZnB3irxBE2yf4rTyaOogB/SKDQGgRouN8YlIgtx+YwwZNL+i1r3IKISYFMvUeT04vp6hMLjkk+v5epRpOyevg7Ls/8TSxAh2XC9SXIWji9dy1e8F2xjPm7RnkUtx5A1nBPUL5YPJxlZVAoVI7AqNl8KNjCw2g915aECpPvgZRkOgn+n1r0Z7M2Iqq6hD2VgR8gWZPPkuFKuZJfAyFhNO4A6hmVIa5BnZehy8HdwmXl3vuSmCfM4xifovYECx5FOECI2zoC2S3IowWXv1dt7fAh0s/KrDFT+Fhps7/er6LtpYCx95GwoSberB/GYZViChWHBPDf00Myx2w6aXszKPoRhTk2WB5LsTY4udBBmdDzB4OpAVeEewtcOH5lTVjndbKfmgGRQqUXSNvBYJCKXCBIfMPvCvOHnGBBmBJo7spcBWppUC/+MwsBYIm+0UY0TnlXrq3QEsXgV1+47hPaFYdquw3AheYBDfulmtjodF1YXa+ZFgeDNRdAtFFg0sXZXZhKRBvKfa5FYfs77Agjwaw3+54/ShxMVhA9n9jQTgrXejW2jwhXXgD8d2vwAeuWDLU6ltbClw7lPAg4087pLS1pYsq/AB3JBp8gc4eAiFA6HiE9R5kqMTxp9gCpnkrUGU9Y4wFy1JgDzMCVyoO+lDURngADfAybVPg2sLwuPPir2c/uBTo2tyKeArk1ejeAqEOgQMe6hksRAZQOz1TrL/yViCWYvqEiZd/+HvsSYtGXJEhDIypshhv+bbeIrCIJpJv7t2o4wtU2K1zm2EKf8vh/C0CkSeZngdPs8XsocfPDpctl721IDL1+JsmldtxYUKCkWeEO3wPIPayihEmsLoUxdRW3CyWhkkwm9MfnZ62+44sueF54JtO8LbYXpn0CA4UsBKZ0R4vhtW4Z67eyXCxlz302C0CrYEXWIjdat15njwZAV1ZZnPDmqvIvEOgLVVpjrM8U0B40fAdKRwSsWHIO46wyeknC/bnDryMB7cxfxWoi5MD/DGm3F19getrZ009T0dTxw3PwDDix6Yez+x8EnNwejBmyLdg8M8C0QmT/LyE8xeFDQaf77ycC/IClOdBW0uKM6+71//OdFue/yICarSBLD6ViHUBNdvjRld1NvA4RquzHvrhkLh8Fde65O90JFGov5w/HXeKSU0c/ArB4vI8mHlxeBs2yn4jsHHBGdp7vd2GmydPumHgvM3WzJLeoDALq+67jaWDKNu5m07j4y5uxNUlN95q+V7ZnT7GV0Xr6D4avX8TJyBUZo76jqMVhqMMG0Whh6hkitHvjvO9f+TXvwo7PfrxWtz9XvFj4O3uvLNYdLo4snzxpWxz+9CqLbLjdftm69ap8ZVRbdvOrN7aydsyvNFfutXbRIIgCIL4Z8hlD1Krb+W0+JvKb+ubSGxrTYt7UlfvPCV1drZtvGwt9t7cYttu+oskwvl8uLr8egwSyvCTO3jbsQ5TKZW2DVERfVMn7zymkt3SeFMvZb8e7ppYGQSG3xnyg5zA8uebjMFSVhNcYOmsnGMpkFIDnSU0cRZMfHCehR6wEvlqpYY35itpaeUsCixV8tfwJyfUwjfRR65Iut6AwWMH2Ry2lsSKHOL0b6BjPgHyY7VKVTwQhs8fpspnJRb7mq5sdaWPw9coBqsYTrF8mQtM1Cs5lgB/u66yRp7lwqUDmHrtHJbgACZydpWowwSz9cTx9Upg7TrRgK+581LlGFYDLkLXbDNxzReDVa/Q90+y3FnOj4Xs0rG/yFeg4qxSCqdZ6pylw4cgPXVTT4DARuJkq9f8NYEIuEr+RrhoE37S8PBahX2Lgfpq+hxW4AR+uMAcKzWgf4rlzlYCv1W5i95kU6lwjB2mqjXwinI5FZP7uwwSSrBo+YYYiQtssFyzDPM/yaGNheKTw5tmHt0z0RSzO9jm3H9R4GF1q8DYSRoekrqu1EBgbE0gzhKa1gXC7SiwcdVsNmPg5QcVuBUseZ1bCazB+OgZJ1J0os5i1XJWCMQxqyAyW6unjrOguvT3CGR1eHIWBv+W4hNYF8ia4CW8FQWCMdcFwt6trgmEnrkTEUtgIeppPr/sIas1VgLT0CFbWQlkYRCWlQKrcPEARZ7csCtcTCEwtrfA1NdGEz2wct34ClKuQFL2OsFXmpXQvLlwuQ4blJ0dH4rZVHlQKoXL13UxBKpKQy+Y4uG3ZhPurH0rn9Rx35bP5Q5qYKxo1BvfDrl3CxLhRuMr7M1zNHP5rMEvhBNgeP7cAy4wu6fAZRqrpnG/pHB/JFIshs8UG+gwEcPWWEJczeEWw+Z0WgpMpUSv3Gq0XJrht1TCTwJ8XHgGv7h8dCwhGngyzIkkm4rJ5+aqvGtqLUv/mxxcHZzvF9/+36nmc7/uRBAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDEv8H/AKN5Mfjks/2eAAAAAElFTkSuQmCC"  },
    { name: "NexGen", id: 4, url:"data:image/png;base64,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"  },
    { name: "TradeHub", id: 5, url:"data:image/png;base64,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"  },
    { name: "KudiFlow", id: 6, url:"data:image/png;base64,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"  },
  ];


  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dzibfknxq/image/upload/v1756988421/Payar_logo_gl4egd.png"
              alt="Payar Logo"
              width={100}
              height={40}
              className="rounded-md"
              priority
            />
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-gray-800 hover:text-[#059669]/60 font-medium transition-colors duration-200">Features</a>
            <a href="#pricing" className="text-gray-800 hover:text-[#059669]/60 font-medium transition-colors duration-200">Pricing</a>
            <a href="#faq" className="text-gray-800 hover:text-[#059669]/60 font-medium transition-colors duration-200">FAQ</a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/auth?mode=signin" className="text-gray-800 hover:text-[#059669]/60 font-medium transition-colors duration-200 hidden md:block">
              Sign In
            </Link>
            <Link 
              href="/auth?mode=signup"
              className="bg-gradient-to-r from-[#059669] to-[#059669]/60 text-white px-6 py-3 rounded-md font-medium hover:shadow-lg transition-all duration-300 shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl bg-gradient-to-b from-white to-gray-100 mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Take Control of Your <span className="text-[#059669]">Business Finances. Simply.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mb-8 leading-relaxed">
            Payar is the effortless way for African SMEs and freelancers to track cash flow, manage expenses, and understand profitability, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/auth?mode=signup"
              className="bg-[#059669] text-white px-8 py-4 rounded-md font-medium hover:bg-[#059669]/70 hover:shadow-xl transition-all duration-300"
            >
              Get Started For Free
            </Link>
            <button className="bg-white border border-[#059669]/60 text-[#059669]/60 px-8 py-4 rounded-md font-medium hover:bg-[#059669]/5 hover:cursor-pointer transition-all duration-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-2 shadow-lg">
            <Image
              src="https://res.cloudinary.com/dzibfknxq/image/upload/v1756883740/African_business_team_collaborating.jpg"
              alt="African business professionals collaborating"
              width={600}
              height={400}
              className="rounded-xl object-cover"
              priority
              quality={85}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Master Your Cash Flow</h2>
            <p className="text-gray-600">Payar is built from the ground up to address the unique financial realities of doing business in Africa.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Real-Time Financial Dashboard",
                description: "Watch your balance, income, and expenses update live. Make informed decisions with a clear, visual overview of your financial health, designed for clarity."
              },
              {
                icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Truly Local Categorization",
                description: "Finally, categories that make sense. Effortlessly track 'Mobile Money' transfers, 'Okada' transport costs, 'Generator Fuel', and 'Airtime' expenses. No more awkward workarounds."
              },
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Bank-Level Security",
                description: "Your data is private and secure. We use end-to-end encryption and robust security protocols to ensure your financial information is protected to the highest standard."
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Save Precious Time",
                description: "Ditch the paper ledger. Reclaim hours spent on manual bookkeeping and focus on what actually grows your business."
              },
              {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "One-Click Reports",
                description: "Need a snapshot for your partner or accountant? Generate clear, concise profit & loss statements instantly. No complex setup, just straightforward insights."
              },
              {
                icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
                title: "Access Anywhere, Always",
                description: "Your books are never out of reach. Securely access your financial data on your phone, tablet, or computer. Your dashboard syncs automatically across all your devices."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200/20">
                <div className="w-12 h-12 bg-[#059669]/5 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#059669]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#059669]/90">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-gray-900 mb-4">
            Trusted by African Entrepreneurs
        </h2>
          <Slider {...settings}>
            {logos.map((logo) => (
              <div key={logo.id} className="text-[20px] flex items-center justify-center rounded-lg mx-auto">
                <img
                src={logo.url}
                alt={logo.name}
                className="h-[4rem] md:h-[10rem] w-auto grayscale hover:grayscale-0 transition-all duration-500"
                />
                
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* How It Work Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From Signup to Insight in Under 5 Minutes
          </h2>
          <p className="text-gray-600">
            Getting started with Payar is designed to be incredibly simple. See your financial picture clearly, faster than ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Sign Up & Set Up in Seconds",
              visual: {
                src: "https://res.cloudinary.com/dzibfknxq/image/upload/v1756883740/signup-demo.gif",
                alt: "Payar signup process animation",
              },
              description: "Create your secure account with just your email. No lengthy forms or credit card required. You'll be ready to go in less than a minute.",
            },
            {
              title: "Record Your First Transaction",
              visual: {
                src: "https://res.cloudinary.com/dzibfknxq/image/upload/v1756883740/add-transaction-demo.gif",
                alt: "Payar add transaction animation",
              },
              description: "Adding income and expenses is a breeze. Our smart categories, built for everyday African business needs, make logging transactions intuitive and fast.",
            },
            {
              title: "Watch Your Financial Health Become Clear",
              visual: {
                src: "https://res.cloudinary.com/dzibfknxq/image/upload/v1756883740/dashboard-demo.gif",
                alt: "Payar dashboard animation",
              },
              description: "That's it! Your dashboard automatically transforms your data into a clear, real-time view of your finances. Immediately understand your profitability and where your money is going.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200/20"
            >
              <div className="relative w-full h-48 mb-6">
                <Image
                  src={step.visual.src}
                  alt={step.visual.alt}
                  fill
                  className="object-contain rounded-lg"
                  quality={85}
                />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#059669]/90">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        What African Entrepreneurs Say
      </h2>
      <p className="text-gray-600">
        Hear from businesses across Africa thriving with Payar’s intuitive tools.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          name: "Chinedu Okoro",
          role: "Retail Business, Lagos",
          quote: "Payar has made managing my finances effortless. I can focus on growing my shop now.",
          initials: "CO",
        },
        {
          name: "Amina Suleiman",
          role: "Restaurant, Nairobi",
          quote: "The local categories are spot-on. Payar feels like it was made just for us.",
          initials: "AS",
        },
        {
          name: "Kwame Adetokunbo",
          role: "Freelancer, Accra",
          quote: "I save hours every week with Payar’s simple interface. It’s a game-changer.",
          initials: "KA",
        },
      ].map((testimonial, i) => (
        <div
          key={i}
          className="relative p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:-translate-y-1"
        >
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full mr-4 flex items-center justify-center text-emerald-600 font-bold text-lg">
              {testimonial.initials}
            </div>
            <div>
              <h4 className="font-semibold text-xl text-gray-900">{testimonial.name}</h4>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{testimonial.quote}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-gray-300 py-24">
  <div className="max-w-5xl mx-auto text-center px-6 lg:px-8">
    <h2 className="text-3xl md:text-4xl font-bold text-[#059669] mb-1">
      Simplify Your Finances Today
    </h2>
    <p className="text-white/90 mb-4">
      Join thousands of African businesses thriving with Payar’s seamless cash flow management.
    </p>
    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <a
        href="/signup"
        className="border-2 border-white text-white px-5 py-4 rounded-md font-semibold text-md hover:bg-white hover:text-[#059669] hover:shadow-xl transition-all duration-300 transform"
      >
        Start Free Trial
      </a>
      <a
      href=""
      className="bg-[#059669]/80 text-white px-5 py-4 rounded-md font-semibold text-md hover:bg-[#059669]/90 hover:shadow-xl transition-all duration-300 transform">
        Contact Sales
      </a>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://res.cloudinary.com/dzibfknxq/image/upload/v1756988421/Payar_logo_gl4egd.png"
                alt="Payar Logo"
                width={100}
                height={32}
                className="rounded-full"
              />
            </div>
            <p className="mb-6 max-w-xs">Empowering African SMEs and startups with seamless financial tools.</p>
            <div className="flex gap-4">
              {[
                {
                  name: "Twitter",
                  icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                  rule: "nonzero" as const
                },
                {
                  name: "Facebook",
                  icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                  rule: "evenodd" as const
                },
                {
                  name: "Instagram",
                  icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.630zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
                  rule: "evenodd" as const
                }
              ].map((social: SocialMedia, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-[#059669] transition-colors">
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule={social.rule} d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[#059669] font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#059669] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#059669] font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#059669] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#059669] font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#059669] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <span className=" mt-3 flex border-t min-w-screen border-t-[white]/20"></span>
          <span className="px-3 mt-6 flex flex-col md:flex-row justify-between items-space-between">
          <p> © {new Date().getFullYear()} Payar. All rights reserved.</p>
          <p>Powered By <a href="#" className="text-[#059669] hover:text-[#10b981]">Algoritic Inc. </a></p>
        </span>
      </footer>
    </div>
  );
}