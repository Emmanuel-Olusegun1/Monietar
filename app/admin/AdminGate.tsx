'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

interface AdminGateProps {
  allowedEmails: string[];
}

export default function AdminGate({ allowedEmails }: AdminGateProps) {
  const normalizedAllowed = useMemo(
    () => allowedEmails.map((email) => email.toLowerCase()),
    [allowedEmails]
  );
  const [email, setEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = window.sessionStorage.getItem('admin_email') || '';
    if (stored && normalizedAllowed.includes(stored.toLowerCase())) {
      setEmail(stored);
      setAuthenticated(true);
    }
  }, [normalizedAllowed]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalizedAllowed.includes(normalized)) {
      setError('This email is not authorized for admin access.');
      return;
    }
    window.sessionStorage.setItem('admin_email', normalized);
    setError('');
    setAuthenticated(true);
  };

  if (authenticated) {
    return <AdminDashboard adminEmail={email} />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f1f1f1] px-5 py-12 text-gray-900 sm:px-8">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gray-200 blur-3xl" />

      <div className="relative w-full max-w-[460px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold tracking-[-0.04em] text-gray-900">
              monietar
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Admin workspace
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center border border-gray-300 bg-white text-emerald-900">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-7 shadow-[0_20px_60px_rgba(17,24,39,0.08)] sm:p-9">
          <div className="mb-7 flex h-11 w-11 items-center justify-center bg-gray-900 text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-900">
            Restricted access
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] text-gray-900">
            Welcome to the admin workspace.
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Enter an authorized email to manage Monietar operations and product
            activity.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Admin email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@company.com"
                className="mt-2 w-full border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-700 focus:bg-white"
                required
              />
            </label>
            {error && (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-3 bg-gray-900 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-900"
            >
              Enter workspace
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[10px] text-gray-400">
          Monietar operations · Access is logged
        </p>
      </div>
    </div>
  );
}
