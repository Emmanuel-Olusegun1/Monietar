'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-700 flex flex-col justify-between">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-36 pb-24 px-4 relative overflow-hidden">
        {/* Main Content */}
        <div className="text-center max-w-md relative z-10">
          
          {/* Minimal 404 Display */}
          <div className="mb-12">
            <div className="text-[120px] font-black text-slate-200 leading-none tracking-tighter select-none">
              404
            </div>
            <div className="relative -mt-14">
              <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                Page not found
              </h1>
              <div className="w-12 h-0.5 bg-emerald-500 mx-auto mb-4" />
            </div>
          </div>

          {/* Message */}
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-12 font-medium">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          {/* Back Action Button */}
          <div className="flex justify-center">
            <button
              onClick={() => router.back()}
              className="group relative px-8 py-3.5 bg-slate-900 text-white font-bold text-sm transition-all duration-500 rounded-xl cursor-pointer shadow-md overflow-hidden hover:scale-[1.02]"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                Return to previous page
              </span>
              
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-emerald-600 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
            </button>
          </div>

          {/* Subtle divider */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
              Operational Error Status: 404
            </p>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(226, 232, 240, 0.8) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(226, 232, 240, 0.8) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, white, transparent)'
            }}
          />
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-slate-100 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 bg-gradient-to-tl from-emerald-50/50 to-transparent rounded-full blur-3xl" />
        </div>
      </main>

      <Footer />
    </div>
  );
}