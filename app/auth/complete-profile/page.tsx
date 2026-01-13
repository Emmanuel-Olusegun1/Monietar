// app/auth/complete-profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { Loader2, Building2, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          toast.error('Please sign in first');
          router.push('/auth/signup');
          return;
        }
        
        setUser(user);
        
        // Check if user is new (no profile data)
        const userMeta = user.user_metadata || {};
        const hasProfileData = !!(userMeta.business_name || userMeta.name);
        
        setIsNewUser(!hasProfileData);
        
        // Pre-fill existing data
        setFormData({
          business_name: userMeta.business_name || '',
          name: userMeta.name || userMeta.full_name || userMeta.given_name || user.email?.split('@')[0] || '',
          phone: userMeta.phone || ''
        });
        
      } catch (error) {
        console.error('Error initializing:', error);
        toast.error('Failed to load user data');
        router.push('/auth/signup');
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name.trim()) {
      toast.error('Business name is required');
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error('Your name is required');
      return;
    }

    setLoading(true);

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          business_name: formData.business_name.trim(),
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          completed_profile: true,
          profile_completed_at: new Date().toISOString()
        }
      });

      if (updateError) throw updateError;

      toast.success('Profile updated successfully!');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast('You can complete your profile later from settings');
    router.push('/dashboard');
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isNewUser ? 'Complete Your Profile' : 'Update Your Profile'}
          </h1>
          <p className="text-gray-400">
            {isNewUser 
              ? 'Welcome to Monietar! We need a few details to personalize your experience.'
              : 'Update your profile information to keep your account up to date.'
            }
          </p>
          {user?.email && (
            <div className="mt-4 inline-block bg-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-emerald-400 font-medium">{user.email}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 shadow-xl">
          {!isNewUser && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">
                  You already have an account. You can update your profile information here.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Building2 className="h-4 w-4" />
                Business Name *
              </label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Enter your business name"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                This will appear on invoices and reports
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User className="h-4 w-4" />
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Phone className="h-4 w-4" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="+1 234 567 8900"
              />
              <p className="text-xs text-gray-500 mt-2">
                Used for important notifications and account recovery
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span>{isNewUser ? 'Complete Setup' : 'Update Profile'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {isNewUser && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full text-gray-400 hover:text-gray-300 hover:bg-gray-700 py-3 rounded-lg transition-colors text-sm"
                >
                  Skip for now
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info box */}
        {isNewUser && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-sm text-emerald-400 text-center">
              ✨ Complete your profile to unlock all features including invoicing, expense tracking, and financial reporting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}