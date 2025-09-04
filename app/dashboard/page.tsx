// ./app/dashboard/page.tsx
import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient(); // Await to resolve Promise<SupabaseClient>

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth?signin'); // Fixed typo in redirect URL
  }

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Fetch summary metrics for current month
  const { data: metrics } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('user_id', user.id)
    .gte('date', `${currentMonth}-01`)
    .lte('date', `${currentMonth}-31`);

  // Calculate totals
  const totalIncome = metrics
    ?.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpenses = metrics
    ?.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const balance = totalIncome - totalExpenses;

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(10);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

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
            <span className="text-sm text-gray-700 hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-6xl mx-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Balance Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="mb-6">
          <Link
            href="/dashboard/add-transaction"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            + Add Transaction
          </Link>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>

          {transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-3 text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm text-gray-900">{transaction.description}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-sm text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No transactions yet</div>
              <Link
                href="/dashboard/add-transaction"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Record your first transaction
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © 2024 Payar. All rights reserved.
      </footer>
    </div>
  );
}