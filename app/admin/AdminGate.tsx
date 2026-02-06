'use client';

import { useEffect, useMemo, useState } from 'react';
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-gray-900">Admin Sign In</h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter an authorized admin email to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@company.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
