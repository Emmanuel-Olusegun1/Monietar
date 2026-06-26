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
    image: 'https://logos.hunter.io/mono.co',
    alt: 'Mono'
  },
  {  
    image: 'https://cdn.brandfetch.io/idSJbgjvJl/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Stitch'
  },
  {  
    image: 'https://cdn.brandfetch.io/idvtkQjw5h/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Orange'
  },
  {  
    image: 'https://cdn.brandfetch.io/idjRhziMSh/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Moniepoint'
  },
  {  
    image: 'https://cdn.brandfetch.io/idM5mrwtDs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667559828449',
    alt: 'Paystack'
  },
  {  
    image: 'https://cdn.brandfetch.io/id7yHeqwD3/w/284/h/92/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Opay'
  },
  {  
    image: 'https://cdn.brandfetch.io/idB52afxsR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'EcoBank'
  },
    {  
    image: 'https://cdn.brandfetch.io/iddYbQIdlK/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Flutterwave'
  },
  {  
    image: 'https://cdn.brandfetch.io/idbEJ2XWew/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'UBA'
  }
];

export default function Trustbar() {
  return (
    <section className="bg-[#f1f1f1] relative overflow-hidden">
     
      <div className="container mx-auto max-w-7xl px-1 relative z-10">
        <motion.p 
          className="text-center text-emerald-800 text-sm uppercase tracking-wider mb-6 font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Securely  Connected to Africa's Leading Banking Networks
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
                className="flex-shrink-0 relative h-10 w-22 mx-6"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <Image
                  src={trust.image}
                  alt={trust.alt}
                  fill
                  className="object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 mb-4"
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