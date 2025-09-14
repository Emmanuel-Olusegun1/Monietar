'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

type TrustbarProps = {
  image: string;
  alt: string;
}

const trustbars: TrustbarProps[] = [ // Fixed syntax: added = and ;
  {  
    image: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1757720388/flutterwave-1_jsr2yw.svg',
    alt: 'Flutterwave'
  },
  {  
    image: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1757720984/nestle-13_anacwn.svg',
    alt: 'Nestle'
  },
  {  
    image: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1757721192/shopify-2_ghtoaf.svg',
    alt: 'Shopify'
  },
  {  
    image: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1757721355/airbnb_vfi8kd.svg',
    alt: 'Airbnb'
  }
];

export default function Trustbar() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
          Trusted by African Businesses
        </p>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8  place-items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {trustbars.map((trust, i) => (
            <div key={i} className="relative h-12 w-36">
              <Image
                src={trust.image}
                alt={trust.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}