import { NextResponse } from 'next/server';

type Period = '7D' | '30D' | '90D';

type FrankfurterRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const PERIOD_DAYS: Record<Period, number> = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
};

const getPeriod = (value: string | null): Period => {
  if (value === '7D' || value === '90D') {
    return value;
  }

  return '30D';
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const period = getPeriod(
      searchParams.get('period'),
    );

    const days = PERIOD_DAYS[period];

    const toDate = new Date();

    const fromDate = new Date();
    fromDate.setDate(
      fromDate.getDate() - days,
    );

    const from = formatDate(fromDate);
    const to = formatDate(toDate);

    const url =
      `https://api.frankfurter.dev/v2/rates` +
      `?base=XOF` +
      `&quotes=NGN` +
      `&from=${from}` +
      `&to=${to}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        'Frankfurter history request failed:',
        response.status,
        errorText,
      );

      return NextResponse.json(
        {
          error:
            'Unable to retrieve exchange-rate history.',
          details: `Frankfurter returned ${response.status}.`,
        },
        {
          status: 502,
        },
      );
    }

    const data =
      (await response.json()) as FrankfurterRate[];

    if (!Array.isArray(data)) {
      return NextResponse.json(
        {
          error:
            'Invalid exchange-rate history response.',
        },
        {
          status: 502,
        },
      );
    }

    const history = data
      .filter(
        (item) =>
          item &&
          typeof item.date === 'string' &&
          typeof item.rate === 'number' &&
          Number.isFinite(item.rate) &&
          item.rate > 0,
      )
      .map((item) => ({
        date: item.date,
        rate: item.rate,
      }))
      .sort((a, b) =>
        a.date.localeCompare(b.date),
      );

    if (history.length === 0) {
      return NextResponse.json(
        {
          error:
            'No exchange-rate history is available for this period.',
        },
        {
          status: 404,
        },
      );
    }

    const firstRate = history[0].rate;
    const latestRate =
      history[history.length - 1].rate;

    const change = latestRate - firstRate;

    const changePercent =
      firstRate > 0
        ? (change / firstRate) * 100
        : 0;

    return NextResponse.json(
      {
        base: 'XOF',
        quote: 'NGN',
        period,
        from,
        to,
        firstRate,
        latestRate,
        change,
        changePercent,
        history,
        source: 'Frankfurter',
        sourceType: 'daily reference rate',
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error(
      'Exchange-rate history route error:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to retrieve exchange-rate history.',
      },
      {
        status: 500,
      },
    );
  }
}