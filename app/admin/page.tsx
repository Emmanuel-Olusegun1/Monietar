import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminGate from './AdminGate';

export const dynamic = 'force-dynamic';

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const admins = getAdminEmails();
  const email = (user.email || '').toLowerCase();

  if (admins.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] px-6">
        <div className="w-full max-w-md border border-gray-200 bg-white p-7 shadow-sm">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
            Admin workspace
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-gray-900">
            Admin access is not configured.
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            ADMIN_EMAILS is not configured. Add at least one admin email in .env.
          </p>
        </div>
      </div>
    );
  }

  return <AdminGate allowedEmails={admins} />;
}
