'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else if (data && !isLogin) {
      alert('Please check your email for confirmation!');
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
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
        </div>
      </nav>

      {/* Auth Form */}
      <div className="flex-grow min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 space-y-8 transform transition-all duration-300">
          <div className="text-center">
            <h2 className="text-3xl  md:text-4xl font-extrabold text-[#059669]">
              {isLogin ? 'Welcome Back to Payar' : 'Join Payar Today'}
            </h2>
            <p className="mt-2 text-gray-500 text-sm md:text-base">
              {isLogin ? 'Sign in to manage your finances' : 'Create an account to get started'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all duration-200"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-[#059669] text-white font-semibold text-sm md:text-base hover:bg-[#059669]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
              ) : null}
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-[#059669] hover:text-[#059669]/80 font-medium transition-colors duration-200"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://res.cloudinary.com/dzibfknxq/image/upload/v1756988421/Payar_logo_gl4egd.png"
                alt="Payar Logo"
                width={100}
                height={32}
                className="rounded-full"
              />
            </div>
            <p className="mb-6 max-w-xs text-sm">Empowering African SMEs and startups with seamless financial tools.</p>
            <div className="flex gap-4">
              {[
                {
                  name: 'Twitter',
                  icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
                  rule: 'nonzero',
                },
                {
                  name: 'Facebook',
                  icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
                  rule: 'evenodd',
                },
                {
                  name: 'Instagram',
                  icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.630zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
                  rule: 'evenodd',
                },
              ].map((social, i) => (
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
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#059669] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#059669] font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#059669] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#059669] font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#059669] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-[#059669] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200/20 pt-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} Payar. All rights reserved.</p>
            <p>Powered By <a href="#" className="text-[#059669] hover:text-[#10b981]">Algoritic Inc.</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}