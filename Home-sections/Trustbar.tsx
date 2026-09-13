'use client';

import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';

type TrustbarProps = {
  image: string;
  alt: string;
};

const trustbars: TrustbarProps[] = [
  {
    image: 'https://logos.hunter.io/mono.co',
    alt: 'Mono',
  },
  {
    image:
      'https://cdn.brandfetch.io/idvtkQjw5h/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Orange',
  },
  {
    image:
      'https://cdn.brandfetch.io/idjRhziMSh/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Moniepoint',
  },
  {
    image:
      'https://cdn.brandfetch.io/idM5mrwtDs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667559828449',
    alt: 'Paystack',
  },
  {
    image:
      'https://cdn.brandfetch.io/id7yHeqwD3/w/284/h/92/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Opay',
  },
  {
    image:
      'https://cdn.brandfetch.io/idB52afxsR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'EcoBank',
  },
  {
    image:
      'https://cdn.brandfetch.io/iddYbQIdlK/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'Flutterwave',
  },
  {
    image:
      'https://cdn.brandfetch.io/idbEJ2XWew/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B',
    alt: 'UBA',
  },
];

export default function Trustbar() {
  return (
    <section className="relative overflow-hidden bg-[#f1f1f1]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        
        {/* Editorial divider */}
        <div className="border-t border-gray-300/80" />

        <div className="py-7 sm:py-9">
          
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-gray-400 sm:text-[10px]">
              Securely connected Africa&apos;s leading banking networks
            </p>
          </motion.div>

          {/* Logo marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <Marquee
                speed={35}
                gradient={false}
                pauseOnHover
                className="[scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
              >
                {trustbars.map((trust, i) => (
                  <motion.div
                    key={`${trust.alt}-${i}`}
                    className="relative mx-8 h-9 w-24 flex-shrink-0 sm:mx-10 sm:h-10 sm:w-28"
                    whileHover={{
                      scale: 1.04,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Image
                      src={trust.image}
                      alt={trust.alt}
                      fill
                      sizes="112px"
                      className="object-contain grayscale opacity-45 transition-all duration-300 hover:grayscale-0 hover:opacity-80"
                    />
                  </motion.div>
                ))}
              </Marquee>
            </div>
          </motion.div>
        </div>

        {/* Bottom editorial divider */}
        <div className="border-b border-gray-300/80" />
      </div>

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
