import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#059669] mb-4">Welcome to Payar</h1>
        <p className="text-lg text-[#059669]/60 mb-8">Simple cash flow management for African SMEs</p>
        <Link href="/auth" className="bg-[#059669]/60 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-[#059669]/90">
          Get Started
        </Link>
      </div>
    </div>
  );
}