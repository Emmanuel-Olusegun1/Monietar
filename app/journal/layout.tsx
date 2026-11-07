import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal | Monietar',
  description:
    'Practical ideas and useful thinking about business finance, cash flow, operations, and building better businesses.',
  alternates: {
    canonical: 'https://www.monietar.com.ng/journal',
  },
  openGraph: {
    title: 'Journal | Monietar',
    description:
      'Practical ideas and useful thinking for growing businesses.',
    url: 'https://www.monietar.com.ng/journal',
    siteName: 'Monietar',
    type: 'website',
  },
};

export default function JournalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
