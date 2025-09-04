// ./app/dashboard/page.tsx
import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Payar</span>
          </Link>

          <div className="flex items-center space-x-4">
          
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © 2024 Payar. All rights reserved.
      </footer>
    </div>
  );
}