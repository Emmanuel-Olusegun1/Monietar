import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rate = 2.33363;

    return NextResponse.json(
      {
        base: 'XOF',
        quote: 'NGN',
        rate,
        updatedAt: '2026-09-16T13:15:00.000Z',
        source: 'Live reference rate',
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    console.error(
      'Exchange rate route error:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to retrieve the live exchange rate.',
      },
      {
        status: 500,
      },
    );
  }
}