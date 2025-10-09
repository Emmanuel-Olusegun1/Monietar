'use client';

import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';

type TrustbarProps = {
  image: string;
  alt: string;
}

const trustbars: TrustbarProps[] = [
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
  },
  {  
    image: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png',
    alt: 'Monietar'
  },
  {  
    image: 'https://res.cloudinary.com/dzibfknxq/image/upload/v1760008054/MTN_Group_id6u4FvWmZ_1_zmrfo0.png',
    alt: 'MTN'
  },
  {  
    image: 'https://cdn.brandfetch.io/idvMDbAci6/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1684941042073',
    alt: 'Airtel'
  },
  {  
    image: 'https://cdn.brandfetch.io/idM5mrwtDs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667559828449',
    alt: 'Paystack'
  },
  {  
    image: 'https://cdn.brandfetch.io/idxE04AMjS/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1745309101688',
    alt: 'Interswitch'
  },
  {  
    image: 'https://cdn.brandfetch.io/idL99acsY_/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667560932568',
    alt: 'First Bank'
  },
  {  
    image: 'https://cdn.brandfetch.io/idMFED6Iz3/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667580089799',
    alt: 'GTBank'
  }
];

export default function Trustbar() {
  return (
    <section className="py-16 bg-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-white/60"></div>
      <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-300/30 rounded-full blur-2xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <motion.p 
          className="text-center text-emerald-800 text-sm uppercase tracking-wider mb-12 font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trusted by Leading African Businesses
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <Marquee
            speed={40}
            gradient={false}
            pauseOnHover={true}
            className="py-4 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
          >
            {trustbars.map((trust, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 relative h-20 w-32 mx-6"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <Image
                  src={trust.image}
                  alt={trust.alt}
                  fill
                  className="object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                />
              </motion.div>
            ))}
          </Marquee>
        </motion.div>
      </div>

      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .marquee-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .marquee-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}