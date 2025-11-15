'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      {/* Main Content */}
      <div className="text-center max-w-md">
        {/* Minimal 404 Display */}
        <div className="mb-12">
          <div className="text-[120px] font-light text-gray-800 leading-none tracking-tighter">
            404
          </div>
          <div className="relative -mt-16">
            <div className="text-2xl font-medium text-white mb-2">
              Page not found
            </div>
            <div className="w-12 h-0.5 bg-gray-700 mx-auto mb-4" />
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-400 text-lg leading-relaxed mb-12 font-light">
          This page you are looking for doesn't exist or has been moved.
        </p>

        {/* Back Action Button */}
        <div className="flex justify-center">
         <button
  onClick={() => router.back()}
  className="group relative px-8 py-3  bg-gray-900 text-gray-300 font-medium transition-all duration-500 hover:text-white rounded-lg cursor-pointer"
>
  <span className="relative z-10">Return to previous page</span>
  
  {/* Animated underline */}
  <div className="absolute bottom-2 left-0 w-0 h-px bg-gray-500 transition-all duration-500 group-hover:w-full group-hover:bg-emerald-700" />
  
  {/* Background hover effect - UPDATED */}
  <div className="absolute inset-0 bg-emerald-700 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
</button>
        </div>

        {/* Subtle divider */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-600 font-light">
            Error code: 404 • Page not found
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, gray 1px, transparent 1px),
              linear-gradient(to bottom, gray 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-900 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 bg-gradient-to-tl from-gray-800 to-transparent  rounded-full blur-3xl" />
      </div>
    </div>
  );
}