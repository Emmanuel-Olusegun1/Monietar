import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminGate from './AdminGate';

export const dynamic = 'force-dynamic';

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const admins = getAdminEmails();
  const email = (user.email || '').toLowerCase();

  if (admins.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-gray-900">Admin Access Required</h1>
          <p className="text-sm text-gray-500 mt-2">
            ADMIN_EMAILS is not configured. Add at least one admin email in .env.
          </p>
        </div>
      </div>
    );
  }

  return <AdminGate allowedEmails={admins} />;
}
