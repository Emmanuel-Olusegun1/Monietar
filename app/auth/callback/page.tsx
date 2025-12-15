// app/auth/callback/page.tsx - Complete fix
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Loader2, CheckCircle, XCircle, UserPlus, LogIn, MailCheck } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'checking_user'>('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [source, setSource] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const processAuthCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const next = searchParams.get('next') || '/dashboard';
      const sourceParam = searchParams.get('source') as 'signin' | 'signup' || 'signin';
      
      setSource(sourceParam);

      console.log('🔐 Auth Callback Details:', { 
        code: code ? '✓ Received' : '✗ Missing', 
        error, 
        next, 
        source: sourceParam 
      });

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => {
          router.push(`/auth/${sourceParam}?error=${encodeURIComponent(error)}`);
        }, 3000);
        return;
      }

      // If no code, something went wrong
      if (!code) {
        console.error('No authorization code received');
        setStatus('error');
        setMessage('No authorization code received');
        setTimeout(() => {
          router.push(`/auth/${sourceParam}?error=no_code`);
        }, 3000);
        return;
      }

      try {
        setStatus('processing');
        setMessage('Verifying authentication...');

        // Wait for Supabase to process the OAuth flow
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check for session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error(sessionError.message);
        }

        if (!session) {
          // Try to refresh session
          console.log('No session found, refreshing...');
          setMessage('Finalizing sign in...');
          
          // Try to get user directly
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            // Last attempt: try to trigger auth state change
            console.log('Trying to trigger auth state...');
            await supabase.auth.refreshSession();
            
            // Wait and check again
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const { data: { session: finalSession } } = await supabase.auth.getSession();
            
            if (!finalSession) {
              throw new Error('Authentication timed out. Please try again.');
            }
            
            handleSuccessfulAuth(finalSession, sourceParam, next);
          } else {
            // We have a user but no session - create a fake session object
            handleSuccessfulAuth({ user } as any, sourceParam, next);
          }
        } else {
          handleSuccessfulAuth(session, sourceParam, next);
        }

      } catch (error: any) {
        console.error('❌ Authentication error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
        
        setTimeout(() => {
          router.push(`/auth/${source}?error=${encodeURIComponent(error.message || 'auth_failed')}`);
        }, 3000);
      }
    };

    const handleSuccessfulAuth = async (session: any, source: 'signin' | 'signup', next: string) => {
      console.log('✅ Authentication successful for user:', session.user.email);
      setUserEmail(session.user.email);
      
      // Check if this is a new user by looking for profile completion flag
      const userMeta = session.user.user_metadata || {};
      const hasCompletedProfile = userMeta.completed_profile === true;
      const hasBusinessName = !!userMeta.business_name;
      
      // For signup flow, check if user needs to complete profile
      if (source === 'signup' && (!hasCompletedProfile || !hasBusinessName)) {
        console.log('New user detected, checking if profile needs completion...');
        setStatus('checking_user');
        setMessage('Setting up your account...');
        
        // Give user feedback before redirecting
        setTimeout(() => {
          router.push('/auth/complete-profile');
        }, 1500);
      } else {
        // For signin or users with complete profile
        setStatus('success');
        setMessage(source === 'signup' ? 'Account created successfully!' : 'Welcome back!');
        
        // Store a flag that user has signed in
        localStorage.setItem('monietar_last_signin', new Date().toISOString());
        
        // Redirect after a brief delay
        setTimeout(() => {
          console.log(`Redirecting to: ${next}`);
          router.push(next);
        }, 2000);
      }
    };

    processAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Status Icon */}
          {status === 'processing' && (
            <>
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                <Loader2 className="absolute top-1/2 left-1/2 h-10 w-10 text-emerald-400 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {source === 'signup' ? 'Creating Your Account...' : 'Signing You In...'}
              </h1>
            </>
          )}

          {status === 'checking_user' && (
            <>
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                <MailCheck className="absolute top-1/2 left-1/2 h-10 w-10 text-blue-400 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Almost There!</h1>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 animate-scale-in">
                {source === 'signup' ? (
                  <UserPlus className="h-12 w-12 text-emerald-400" />
                ) : (
                  <LogIn className="h-12 w-12 text-emerald-400" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {source === 'signup' ? 'Account Created!' : 'Welcome Back!'}
              </h1>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 animate-scale-in">
                <XCircle className="h-12 w-12 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
            </>
          )}

          {/* Message */}
          <p className="text-gray-300 mb-6">{message}</p>

          {/* User Email Display */}
          {userEmail && (
            <div className="w-full max-w-xs bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Signed in as</p>
              <p className="text-white font-medium truncate flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                {userEmail}
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          {status === 'processing' && (
            <div className="w-full max-w-xs mb-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">This may take a moment...</p>
            </div>
          )}

          {/* Status-specific details */}
          {status === 'checking_user' && (
            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Preparing your account setup...
              </div>
              <div className="text-xs text-blue-400 bg-blue-400/10 rounded-lg p-3">
                🎉 You'll be redirected to complete your profile
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                Redirecting you to {source === 'signup' ? 'your dashboard' : 'the dashboard'}...
              </div>
              {source === 'signup' && (
                <div className="text-xs text-emerald-400 bg-emerald-400/10 rounded-lg p-3">
                  ✨ Your Monietar account is ready! Get started with your financial management.
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col gap-3">
            {status === 'success' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <span>→</span>
              </button>
            )}
            
            {status === 'checking_user' && (
              <button
                onClick={() => router.push('/auth/complete-profile')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Complete Profile Now</span>
              </button>
            )}
            
            {status === 'error' && (
              <button
                onClick={() => router.push(`/auth/${source}`)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Return to {source === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            )}
            
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-gray-400 hover:text-gray-300 underline"
              >
                {status === 'processing' ? 'Taking too long? Refresh' : 'Refresh page'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}