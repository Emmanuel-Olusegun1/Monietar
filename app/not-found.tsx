'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] text-gray-900 antialiased selection:bg-emerald-900/10 selection:text-emerald-900">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="relative z-10 mx-auto w-full max-w-[520px] text-center">
          {/* 404 */}
          <div className="mb-10">
            <div className="select-none text-[96px] font-black leading-none tracking-[-0.06em] text-gray-200 sm:text-[128px]">
              404
            </div>

            <div className="relative -mt-5 sm:-mt-7">
              <div className="mx-auto mb-5 h-px w-10 bg-emerald-900" />

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                This page doesn't exist.
              </h1>
            </div>
          </div>

          {/* Message */}
          <p className="mx-auto mb-10 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            The page you’re looking for may have been moved, removed, or
            temporarily unavailable.
          </p>

          {/* Action */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-emerald-900 bg-emerald-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-900/20 focus:ring-offset-2 focus:ring-offset-[#f1f1f1]"
            >
              Return to previous page
            </button>
          </div>

          {/* Status */}
          <div className="mt-14 border-t border-gray-200 pt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
              Error 404
            </p>
          </div>
        </div>

        {/* Subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229, 231, 235, 0.7) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229, 231, 235, 0.7) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
