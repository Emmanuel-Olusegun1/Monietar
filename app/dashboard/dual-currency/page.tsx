'use client';

import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calculator,
  CheckCircle2,
  Clock3,
  Coins,
  Globe2,
  History,
  Info,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';

type Plan =
  | 'retail-starter'
  | 'growing-merchant'
  | 'borderless-pro';

type Transaction = {
  id: string;
  user_id: string;
  business_id: string | null;
  account_id: string | null;
  type: string;
  amount: number | string;
  category: string | null;
  description: string | null;
  date: string;
  created_at: string;
  status: string;
  currency: string | null;
  exchange_rate: number | string | null;
  amount_base: number | string | null;
  reference: string | null;
  notes: string | null;
  is_deleted: boolean;
};

type Period = '7D' | '30D' | '90D';

type LiveRateResponse = {
  base: string;
  quote: string;
  rate: number;
  updatedAt: string;
  source: string;
};

type RateHistoryPoint = {
  date: string;
  rate: number;
};

type RateHistoryResponse = {
  base: string;
  quote: string;
  period: Period;
  from: string;
  to: string;
  firstRate: number;
  latestRate: number;
  change: number;
  changePercent: number;
  history: RateHistoryPoint[];
  source: string;
  sourceType: string;
  updatedAt: string;
};

const PERIOD_DAYS: Record<Period, number> = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
};

function normalizePlan(value: unknown): Plan {
  if (
    value === 'growing-merchant' ||
    value === 'borderless-pro'
  ) {
    return value;
  }

  return 'retail-starter';
}

function formatNumber(
  value: number,
  maximumFractionDigits = 0,
) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits,
  }).format(value);
}

function formatCurrency(
  value: number,
  currency: 'NGN' | 'XOF',
) {
  if (!Number.isFinite(value)) {
    return currency === 'NGN' ? '₦0' : '0 XOF';
  }

  if (currency === 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
    }).format(value);
  }

  return `${new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 2,
  }).format(value)} XOF`;
}

function formatCompactCurrency(
  value: number,
  currency: 'NGN' | 'XOF',
) {
  if (!Number.isFinite(value)) {
    return currency === 'NGN' ? '₦0' : '0 XOF';
  }

  if (currency === 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  return `${new Intl.NumberFormat('en-NG', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)} XOF`;
}

function formatDate(value: string) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatShortDate(value: string) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function formatDateTime(value: string) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getTransactionAmount(
  transaction: Transaction,
) {
  const amount = Number(transaction.amount);

  return Number.isFinite(amount) ? amount : 0;
}

function getTransactionBaseAmount(
  transaction: Transaction,
) {
  const amountBase = Number(
    transaction.amount_base,
  );

  if (Number.isFinite(amountBase)) {
    return amountBase;
  }

  const amount = getTransactionAmount(transaction);
  const rate = Number(transaction.exchange_rate);

  if (
    transaction.currency?.toUpperCase() === 'NGN'
  ) {
    return amount;
  }

  if (
    transaction.currency?.toUpperCase() === 'XOF' &&
    Number.isFinite(rate) &&
    rate > 0
  ) {
    return amount * rate;
  }

  return 0;
}

function getRecordedXofRate(
  transaction: Transaction,
) {
  if (
    transaction.currency?.toUpperCase() !== 'XOF'
  ) {
    return null;
  }

  const exchangeRate = Number(
    transaction.exchange_rate,
  );

  if (
    Number.isFinite(exchangeRate) &&
    exchangeRate > 0
  ) {
    return exchangeRate;
  }

  const amount = Math.abs(
    getTransactionAmount(transaction),
  );

  const baseAmount = Math.abs(
    getTransactionBaseAmount(transaction),
  );

  if (
    amount > 0 &&
    baseAmount > 0
  ) {
    const calculatedRate =
      baseAmount / amount;

    return calculatedRate > 0
      ? calculatedRate
      : null;
  }

  return null;
}

export default function DualCurrencyPage() {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [currentPlan, setCurrentPlan] =
    useState<Plan>('retail-starter');

  const [planLoading, setPlanLoading] =
    useState(true);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [period, setPeriod] =
    useState<Period>('30D');

  const [liveRate, setLiveRate] =
    useState<number | null>(null);

  const [
    liveRateUpdatedAt,
    setLiveRateUpdatedAt,
  ] = useState<string | null>(null);

  const [
    liveRateSource,
    setLiveRateSource,
  ] = useState<string | null>(null);

  const [fxLoading, setFxLoading] =
    useState(true);

  const [fxError, setFxError] =
    useState<string | null>(null);

  const [rateHistory, setRateHistory] =
    useState<RateHistoryPoint[]>([]);

  const [
    rateHistoryLoading,
    setRateHistoryLoading,
  ] = useState(true);

  const [
    rateHistoryError,
    setRateHistoryError,
  ] = useState<string | null>(null);

  const [
    selectedChartPoint,
    setSelectedChartPoint,
  ] = useState<RateHistoryPoint | null>(
    null,
  );

  const [purchaseXof, setPurchaseXof] =
    useState(10000);

  const [
    sellingPriceNgn,
    setSellingPriceNgn,
  ] = useState(30000);

  const [
    targetMargin,
    setTargetMargin,
  ] = useState(20);

  const [
    conversionAmount,
    setConversionAmount,
  ] = useState(10000);

  const [
    scenarioRate,
    setScenarioRate,
  ] = useState(2.5);

  const hasDualCurrencyAccess =
    currentPlan === 'borderless-pro';

  const loadPlan = useCallback(
    async () => {
      setPlanLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setCurrentPlan('retail-starter');
          return;
        }

        const metadataPlan =
          user.user_metadata
            ?.subscription_plan ??
          user.user_metadata?.plan;

        setCurrentPlan(
          normalizePlan(metadataPlan),
        );
      } catch {
        setCurrentPlan('retail-starter');
      } finally {
        setPlanLoading(false);
      }
    },
    [supabase],
  );

  const loadTransactions =
    useCallback(async () => {
      if (!hasDualCurrencyAccess) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setTransactions([]);
          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from('transactions')
          .select(
            `
              id,
              user_id,
              business_id,
              account_id,
              type,
              amount,
              category,
              description,
              date,
              created_at,
              status,
              currency,
              exchange_rate,
              amount_base,
              reference,
              notes,
              is_deleted
            `,
          )
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .eq('is_deleted', false)
          .order('date', {
            ascending: false,
          })
          .order('created_at', {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        setTransactions(
          (data ?? []) as Transaction[],
        );
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }, [
      hasDualCurrencyAccess,
      supabase,
    ]);

  const loadLiveRate =
    useCallback(async () => {
      if (!hasDualCurrencyAccess) {
        setFxLoading(false);
        return;
      }

      setFxLoading(true);
      setFxError(null);

      try {
        const response = await fetch(
          '/api/exchange-rate',
          {
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          throw new Error(
            'Unable to load the live exchange rate.',
          );
        }

        const data =
          (await response.json()) as LiveRateResponse;

        const rate = Number(data.rate);

        if (
          !Number.isFinite(rate) ||
          rate <= 0
        ) {
          throw new Error(
            'Invalid exchange rate received.',
          );
        }

        setLiveRate(rate);
        setLiveRateUpdatedAt(
          data.updatedAt ?? null,
        );
        setLiveRateSource(
          data.source ?? null,
        );
      } catch (error) {
        setFxError(
          error instanceof Error
            ? error.message
            : 'Unable to load the live exchange rate.',
        );
        setLiveRate(null);
      } finally {
        setFxLoading(false);
      }
    }, [hasDualCurrencyAccess]);

  const loadRateHistory =
    useCallback(async () => {
      if (!hasDualCurrencyAccess) {
        setRateHistoryLoading(false);
        return;
      }

      setRateHistoryLoading(true);
      setRateHistoryError(null);

      try {
        const response =
          await fetch(
            `/api/exchange-rate/history?period=${period}`,
            {
              cache: 'no-store',
            },
          );

        if (!response.ok) {
          throw new Error(
            'Unable to load exchange-rate history.',
          );
        }

        const data =
          (await response.json()) as RateHistoryResponse;

        const history = Array.isArray(
          data.history,
        )
          ? data.history
              .map((item) => ({
                date: item.date,
                rate: Number(item.rate),
              }))
              .filter(
                (item) =>
                  Boolean(item.date) &&
                  Number.isFinite(item.rate) &&
                  item.rate > 0,
              )
          : [];

        setRateHistory(history);

        if (history.length > 0) {
          setSelectedChartPoint(
            history[
              history.length - 1
            ],
          );
        } else {
          setSelectedChartPoint(null);
        }
      } catch (error) {
        setRateHistory([]);
        setSelectedChartPoint(null);

        setRateHistoryError(
          error instanceof Error
            ? error.message
            : 'Unable to load exchange-rate history.',
        );
      } finally {
        setRateHistoryLoading(false);
      }
    }, [
      hasDualCurrencyAccess,
      period,
    ]);

  useEffect(() => {
    void loadPlan();
  }, [loadPlan]);

  useEffect(() => {
    if (planLoading) {
      return;
    }

    if (!hasDualCurrencyAccess) {
      setTransactions([]);
      setLoading(false);
      setFxLoading(false);
      setRateHistoryLoading(false);
      return;
    }

    void loadTransactions();
    void loadLiveRate();
  }, [
    planLoading,
    hasDualCurrencyAccess,
    loadTransactions,
    loadLiveRate,
  ]);

  useEffect(() => {
    if (
      planLoading ||
      !hasDualCurrencyAccess
    ) {
      return;
    }

    void loadRateHistory();
  }, [
    planLoading,
    hasDualCurrencyAccess,
    loadRateHistory,
  ]);

  const handleRefresh =
    useCallback(async () => {
      if (!hasDualCurrencyAccess) {
        return;
      }

      setRefreshing(true);

      await Promise.all([
        loadTransactions(),
        loadLiveRate(),
        loadRateHistory(),
      ]);

      setRefreshing(false);
    }, [
      hasDualCurrencyAccess,
      loadTransactions,
      loadLiveRate,
      loadRateHistory,
    ]);

  const periodStart = useMemo(() => {
    const date = new Date();

    date.setDate(
      date.getDate() -
        PERIOD_DAYS[period],
    );

    date.setHours(
      0,
      0,
      0,
      0,
    );

    return date;
  }, [period]);

  const periodTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction) => {
          const transactionDate =
            new Date(transaction.date);

          return (
            !Number.isNaN(
              transactionDate.getTime(),
            ) &&
            transactionDate >=
              periodStart
          );
        },
      );
    }, [
      transactions,
      periodStart,
    ]);

  const xofTransactions =
    useMemo(() => {
      return periodTransactions.filter(
        (transaction) =>
          transaction.currency?.toUpperCase() ===
          'XOF',
      );
    }, [periodTransactions]);

  const ngnTransactions =
    useMemo(() => {
      return periodTransactions.filter(
        (transaction) =>
          transaction.currency?.toUpperCase() ===
          'NGN',
      );
    }, [periodTransactions]);

  const latestRecordedRate =
    useMemo(() => {
      for (
        const transaction of transactions
      ) {
        const rate =
          getRecordedXofRate(
            transaction,
          );

        if (
          rate &&
          rate > 0
        ) {
          return rate;
        }
      }

      return null;
    }, [transactions]);

  const activeRate = liveRate;

  const purchaseCostNgn =
    activeRate
      ? purchaseXof * activeRate
      : 0;

  const currentProfit =
    sellingPriceNgn -
    purchaseCostNgn;

  const currentMargin =
    sellingPriceNgn > 0
      ? (currentProfit /
          sellingPriceNgn) *
        100
      : 0;

  const safeTargetMargin =
    Math.min(
      99,
      Math.max(
        0,
        targetMargin,
      ),
    );

  const minimumSellingPrice =
    activeRate
      ? purchaseCostNgn /
        (1 -
          safeTargetMargin /
            100)
      : 0;

  const scenarioPurchaseCost =
    purchaseXof *
    scenarioRate;

  const scenarioProfit =
    sellingPriceNgn -
    scenarioPurchaseCost;

  const scenarioMargin =
    sellingPriceNgn > 0
      ? (scenarioProfit /
          sellingPriceNgn) *
        100
      : 0;

  const rateChangePercent =
    activeRate &&
    activeRate > 0
      ? ((scenarioRate -
          activeRate) /
          activeRate) *
        100
      : 0;

  const convertedNgn =
    activeRate
      ? conversionAmount *
        activeRate
      : 0;

  const convertedXof =
    activeRate
      ? conversionAmount /
        activeRate
      : 0;

  const totalXofSpend =
    useMemo(() => {
      return xofTransactions.reduce(
        (total, transaction) =>
          total +
          Math.abs(
            getTransactionAmount(
              transaction,
            ),
          ),
        0,
      );
    }, [xofTransactions]);

  const totalNgnValueOfXofSpend =
    activeRate
      ? totalXofSpend *
        activeRate
      : 0;

  const totalNgnActivity =
    useMemo(() => {
      return ngnTransactions.reduce(
        (total, transaction) =>
          total +
          Math.abs(
            getTransactionAmount(
              transaction,
            ),
          ),
        0,
      );
    }, [ngnTransactions]);

  const recordedRateHistory =
    useMemo(() => {
      return transactions
        .filter(
          (transaction) =>
            transaction.currency?.toUpperCase() ===
            'XOF',
        )
        .map((transaction) => ({
          id: transaction.id,
          description:
            transaction.description ||
            transaction.category ||
            'XOF transaction',
          date: transaction.date,
          rate:
            getRecordedXofRate(
              transaction,
            ),
        }))
        .filter(
          (
            item,
          ): item is {
            id: string;
            description: string;
            date: string;
            rate: number;
          } =>
            item.rate !== null &&
            item.rate > 0,
        )
        .slice(0, 6);
    }, [transactions]);

  const liveRateDifference =
    activeRate !== null &&
    latestRecordedRate !== null
      ? activeRate -
        latestRecordedRate
      : null;

  const liveRateDifferencePercent =
    activeRate !== null &&
    activeRate > 0 &&
    latestRecordedRate !== null
      ? ((activeRate -
          latestRecordedRate) /
          latestRecordedRate) *
        100
      : null;

  const chartMetrics =
    useMemo(() => {
      if (
        rateHistory.length === 0
      ) {
        return {
          firstRate: null,
          latestRate: null,
          change: null,
          changePercent: null,
          min: null,
          max: null,
        };
      }

      const firstRate =
        rateHistory[0].rate;

      const latestRate =
        rateHistory[
          rateHistory.length - 1
        ].rate;

      const change =
        latestRate - firstRate;

      const changePercent =
        firstRate > 0
          ? (change /
              firstRate) *
            100
          : 0;

      const rates =
        rateHistory.map(
          (item) => item.rate,
        );

      return {
        firstRate,
        latestRate,
        change,
        changePercent,
        min: Math.min(...rates),
        max: Math.max(...rates),
      };
    }, [rateHistory]);

  const chartGeometry =
    useMemo(() => {
      const width = 1000;
      const height = 360;
      const paddingX = 54;
      const paddingTop = 24;
      const paddingBottom = 42;

      if (
        rateHistory.length === 0
      ) {
        return {
          width,
          height,
          points: '',
          area: '',
          min: 0,
          max: 0,
          yTicks: [],
        };
      }

      const rates =
        rateHistory.map(
          (item) => item.rate,
        );

      let min = Math.min(...rates);
      let max = Math.max(...rates);

      if (min === max) {
        min -= 0.01;
        max += 0.01;
      }

      const range = max - min;

      const innerWidth =
        width -
        paddingX * 2;

      const innerHeight =
        height -
        paddingTop -
        paddingBottom;

      const points =
        rateHistory
          .map((item, index) => {
            const x =
              paddingX +
              (index /
                Math.max(
                  1,
                  rateHistory.length -
                    1,
                )) *
                innerWidth;

            const y =
              paddingTop +
              (1 -
                (item.rate -
                  min) /
                  range) *
                innerHeight;

            return `${x},${y}`;
          })
          .join(' ');

      const firstPoint =
        points.split(' ')[0];

      const lastPoint =
        points.split(' ')[
          points.split(' ').length - 1
        ];

      const [
        lastX,
        ,
      ] = lastPoint
        .split(',')
        .map(Number);

      const area =
        `${firstPoint} ${points} ${lastX},${height - paddingBottom} ${paddingX},${height - paddingBottom}`;

      const tickCount = 5;

      const yTicks = Array.from(
        {
          length: tickCount,
        },
        (_, index) => {
          const value =
            max -
            (range /
              (tickCount - 1)) *
              index;

          const y =
            paddingTop +
            (index /
              (tickCount - 1)) *
              innerHeight;

          return {
            value,
            y,
          };
        },
      );

      return {
        width,
        height,
        points,
        area,
        min,
        max,
        yTicks,
      };
    }, [rateHistory]);

  const insight = useMemo(() => {
    if (!activeRate) {
      return 'The live XOF/NGN rate is not available yet. Once it loads, Monietar can help you understand your current sourcing cost and pricing position.';
    }

    if (currentMargin < 0) {
      return `Your current selling price is below the converted purchase cost at today's rate. A weaker Naira against the XOF can reduce your margin quickly, so review your selling price before placing your next order.`;
    }

    if (
      currentMargin >= 0 &&
      currentMargin <= 10
    ) {
      return `Your current margin is ${formatNumber(
        currentMargin,
        1,
      )}%. That leaves limited room for FX movement, delivery costs, or other operating expenses.`;
    }

    if (
      liveRateDifferencePercent !==
        null &&
      Math.abs(
        liveRateDifferencePercent,
      ) >= 3
    ) {
      return `The live rate is ${formatNumber(
        Math.abs(
          liveRateDifferencePercent,
        ),
        1,
      )}% ${
        liveRateDifferencePercent > 0
          ? 'higher'
          : 'lower'
      } than the latest XOF rate recorded in your transactions. That difference can materially change the Naira cost of your next purchase.`;
    }

    return `At the current live rate, ${formatCurrency(
      purchaseXof,
      'XOF',
    )} costs approximately ${formatCurrency(
      purchaseCostNgn,
      'NGN',
    )}. Use the pricing calculator to check whether your current selling price still protects your target margin.`;
  }, [
    activeRate,
    currentMargin,
    liveRateDifferencePercent,
    purchaseXof,
    purchaseCostNgn,
  ]);

  if (planLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f6] text-gray-900">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2
              size={17}
              className="animate-spin"
            />
            Loading your plan...
          </div>
        </div>
      </main>
    );
  }

  if (!hasDualCurrencyAccess) {
    const planName =
      currentPlan ===
      'growing-merchant'
        ? 'Growing Merchant'
        : 'Retail Starter';

    return (
      <main className="min-h-screen bg-[#f7f8f6] text-gray-900">
        <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-10 sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
          <section className="border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-600">
                  <Globe2 size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                    Dual Currency
                  </p>

                  <h1 className="mt-1 text-lg font-semibold text-gray-950">
                    Understand your XOF to NGN costs
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex min-h-[420px] items-center justify-center px-6 py-16">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gray-100 text-gray-500">
                  <Globe2 size={21} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Borderless Pro feature
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-950">
                  Track XOF and NGN together
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Dual Currency helps you monitor
                  XOF-to-NGN rates, understand your
                  sourcing costs, model pricing changes,
                  and see how FX movement affects your
                  margins.
                </p>

                <div className="mt-6 border border-gray-200 bg-gray-50 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <Info
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        You&apos;re currently on{' '}
                        {planName}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Dual Currency is available on
                        Borderless Pro.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex h-10 items-center justify-center bg-gray-900 px-5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  View Borderless Pro
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-gray-900">
      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-10 sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Dual Currency
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              Understand your XOF to NGN costs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Track exchange-rate movement, understand
              your sourcing costs, and see how FX changes
              can affect your margins.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />
            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>
        </div>

        {/* Live reference rate */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-700">
                <Globe2 size={17} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Live reference rate
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Current XOF to NGN reference value used
                  across this page.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs text-gray-400">
                1 XOF =
              </p>

              <div className="mt-2 flex items-end gap-2">
                <p className="text-3xl font-semibold tracking-tight text-gray-950">
                  {fxLoading
                    ? '—'
                    : activeRate
                      ? `₦${formatNumber(
                          activeRate,
                          4,
                        )}`
                      : '—'}
                </p>

                {activeRate && (
                  <span className="pb-1 text-xs text-gray-400">
                    NGN
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} />
                  {liveRateUpdatedAt
                    ? formatDateTime(
                        liveRateUpdatedAt,
                      )
                    : 'Waiting for update'}
                </span>

                {liveRateSource && (
                  <span>
                    Source: {liveRateSource}
                  </span>
                )}
              </div>

              {fxError && (
                <div className="mt-4 flex items-start gap-2 border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700">
                  <AlertCircle
                    size={14}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{fxError}</span>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-xs text-gray-400">
                10,000 XOF equivalent
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-700">
                {activeRate
                  ? formatCurrency(
                      10000 *
                        activeRate,
                      'NGN',
                    )
                  : '—'}
              </p>

              <p className="mt-3 text-xs leading-5 text-gray-400">
                This is a live reference estimate. It
                does not change the exchange rate already
                recorded on your transactions.
              </p>
            </div>
          </div>
        </section>

        {/* FX movement */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-700">
                  <TrendingUp size={17} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    FX movement
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    See how the XOF/NGN reference rate has
                    moved.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full border border-gray-200 bg-gray-50 sm:w-auto">
              {(
                [
                  '7D',
                  '30D',
                  '90D',
                ] as Period[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setPeriod(item)
                  }
                  className={`flex-1 px-4 py-2 text-xs font-medium transition sm:flex-none ${
                    period === item
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {rateHistoryLoading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Loading rate history...
                </div>
              </div>
            ) : rateHistoryError ||
              rateHistory.length === 0 ? (
              <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
                <div>
                  <div className="mx-auto flex h-10 w-10 items-center justify-center bg-gray-100 text-gray-400">
                    <TrendingUp size={17} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    Rate history unavailable
                  </p>

                  <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                    {rateHistoryError ||
                      'There is not enough historical rate data to display this period.'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[11px] text-gray-400">
                      Starting rate
                    </p>

                    <p className="mt-2 text-base font-semibold text-gray-950">
                      ₦
                      {formatNumber(
                        chartMetrics.firstRate ??
                          0,
                        4,
                      )}
                    </p>
                  </div>

                  <div className="border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[11px] text-gray-400">
                      Latest rate
                    </p>

                    <p className="mt-2 text-base font-semibold text-gray-950">
                      ₦
                      {formatNumber(
                        chartMetrics.latestRate ??
                          0,
                        4,
                      )}
                    </p>
                  </div>

                  <div className="border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[11px] text-gray-400">
                      Movement
                    </p>

                    <p
                      className={`mt-2 text-base font-semibold ${
                        (chartMetrics.change ??
                          0) > 0
                          ? 'text-red-600'
                          : (chartMetrics.change ??
                                0) <
                              0
                            ? 'text-emerald-700'
                            : 'text-gray-700'
                      }`}
                    >
                      {chartMetrics.change !==
                      null
                        ? `${
                            chartMetrics.change >
                            0
                              ? '+'
                              : ''
                          }${formatNumber(
                            chartMetrics.change,
                            4,
                          )}`
                        : '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden">
                  <div className="relative">
                    <svg
                      viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
                      className="h-auto w-full"
                      role="img"
                      aria-label="XOF to NGN exchange rate movement"
                    >
                      {chartGeometry.yTicks.map(
                        (tick) => (
                          <g
                            key={`${tick.y}-${tick.value}`}
                          >
                            <line
                              x1="54"
                              x2="946"
                              y1={tick.y}
                              y2={tick.y}
                              stroke="#f1f1f1"
                              strokeWidth="1"
                            />

                            <text
                              x="0"
                              y={
                                tick.y + 4
                              }
                              fill="#9ca3af"
                              fontSize="11"
                            >
                              {formatNumber(
                                tick.value,
                                4,
                              )}
                            </text>
                          </g>
                        ),
                      )}

                      <polygon
                        points={
                          chartGeometry.area
                        }
                        fill="rgba(16, 185, 129, 0.08)"
                      />

                      <polyline
                        points={
                          chartGeometry.points
                        }
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {rateHistory.map(
                        (
                          item,
                          index,
                        ) => {
                          const innerWidth =
                            1000 -
                            54 * 2;

                          const innerHeight =
                            360 -
                            24 -
                            42;

                          const range =
                            chartGeometry.max -
                            chartGeometry.min;

                          const x =
                            54 +
                            (index /
                              Math.max(
                                1,
                                rateHistory.length -
                                  1,
                              )) *
                              innerWidth;

                          const y =
                            24 +
                            (1 -
                              (item.rate -
                                chartGeometry.min) /
                                (range ||
                                  1)) *
                              innerHeight;

                          const isSelected =
                            selectedChartPoint?.date ===
                            item.date;

                          return (
                            <g
                              key={`${item.date}-${index}`}
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={
                                  isSelected
                                    ? 6
                                    : 3
                                }
                                fill={
                                  isSelected
                                    ? '#059669'
                                    : '#ffffff'
                                }
                                stroke="#059669"
                                strokeWidth={
                                  isSelected
                                    ? 2
                                    : 1.5
                                }
                                className="cursor-pointer"
                                onClick={() =>
                                  setSelectedChartPoint(
                                    item,
                                  )
                                }
                              />
                            </g>
                          );
                        },
                      )}
                    </svg>

                    <div className="mt-1 flex justify-between px-[5.4%] text-[10px] text-gray-400">
                      <span>
                        {formatShortDate(
                          rateHistory[0]
                            .date,
                        )}
                      </span>

                      <span>
                        {formatShortDate(
                          rateHistory[
                            rateHistory.length -
                              1
                          ].date,
                        )}
                      </span>
                    </div>
                  </div>

                  {selectedChartPoint && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-gray-100 bg-gray-50 px-4 py-3">
                      <div>
                        <p className="text-[11px] text-gray-400">
                          Selected date
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {formatDate(
                            selectedChartPoint.date,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-gray-400">
                          Rate
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-950">
                          1 XOF = ₦
                          {formatNumber(
                            selectedChartPoint.rate,
                            4,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="flex items-start gap-2">
                    <Calculator
                      size={14}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <p className="text-xs leading-5 text-gray-500">
                      When the XOF rate rises, the same
                      supplier price costs more in Naira.
                      That can reduce your margin unless
                      your selling price moves with it.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Profitability calculator */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-700">
                <Calculator size={17} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Profitability calculator
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Check how your XOF sourcing cost translates
                  into your Naira selling price.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr_1fr]">
            {/* Inputs */}
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Your numbers
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Supplier price
                  </label>

                  <div className="flex border border-gray-200 bg-gray-50">
                    <span className="flex items-center border-r border-gray-200 px-3 text-xs font-medium text-gray-500">
                      XOF
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        purchaseXof
                      }
                      onChange={(event) =>
                        setPurchaseXof(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Your selling price
                  </label>

                  <div className="flex border border-gray-200 bg-gray-50">
                    <span className="flex items-center border-r border-gray-200 px-3 text-sm font-medium text-gray-500">
                      ₦
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        sellingPriceNgn
                      }
                      onChange={(event) =>
                        setSellingPriceNgn(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Target margin
                  </label>

                  <div className="flex border border-gray-200 bg-gray-50">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={
                        targetMargin
                      }
                      onChange={(event) =>
                        setTargetMargin(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                    />

                    <span className="flex items-center border-l border-gray-200 px-3 text-sm font-medium text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current result */}
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                At today&apos;s rate
              </p>

              <div className="mt-5">
                <p className="text-xs text-gray-500">
                  Estimated Naira cost
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
                  {activeRate
                    ? formatCurrency(
                        purchaseCostNgn,
                        'NGN',
                      )
                    : '—'}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-400">
                    Profit
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      currentProfit >=
                      0
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    {activeRate
                      ? formatCurrency(
                          currentProfit,
                          'NGN',
                        )
                      : '—'}
                  </p>
                </div>

                <div className="border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-400">
                    Margin
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      currentMargin >=
                      0
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    {activeRate
                      ? `${formatNumber(
                          currentMargin,
                          1,
                        )}%`
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2">
                {currentProfit >=
                0 ? (
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 text-emerald-600"
                  />
                ) : (
                  <AlertCircle
                    size={15}
                    className="mt-0.5 text-red-600"
                  />
                )}

                <span className="text-xs leading-5 text-gray-600">
                  {activeRate
                    ? currentProfit >=
                      0
                      ? 'This selling price is above your converted purchase cost.'
                      : 'This selling price is below your converted purchase cost.'
                    : 'Waiting for the live rate.'}
                </span>
              </div>
            </div>

            {/* Recommended price */}
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Price protection
              </p>

              <div className="mt-5">
                <p className="text-xs text-gray-500">
                  Selling price for your target margin
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-700">
                  {activeRate
                    ? formatCurrency(
                        minimumSellingPrice,
                        'NGN',
                      )
                    : '—'}
                </p>
              </div>

              {activeRate && (
                <div className="mt-5 border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs leading-5 text-emerald-800">
                    To make{' '}
                    <strong>
                      {targetMargin}%
                    </strong>{' '}
                    margin at the current rate, your
                    selling price should be at least{' '}
                    <strong>
                      {formatCurrency(
                        minimumSellingPrice,
                        'NGN',
                      )}
                    </strong>
                    .
                  </p>
                </div>
              )}

              {activeRate &&
                sellingPriceNgn <
                  minimumSellingPrice && (
                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-amber-700">
                    <TrendingUp
                      size={14}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      Your current selling price is below
                      the target-margin price.
                    </span>
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* Rate scenario */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-700">
                <TrendingUp size={17} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  What if the rate changes?
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  See how a different XOF/NGN rate affects
                  the same product.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Test another XOF → NGN rate
              </label>

              <div className="flex border border-gray-200 bg-gray-50">
                <span className="flex items-center border-r border-gray-200 px-3 text-xs font-medium text-gray-500">
                  1 XOF =
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={scenarioRate}
                  onChange={(event) =>
                    setScenarioRate(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                />

                <span className="flex items-center px-3 text-xs font-medium text-gray-500">
                  NGN
                </span>
              </div>

              {activeRate && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span>
                    Current live rate:{' '}
                    <strong className="text-gray-800">
                      ₦
                      {formatNumber(
                        activeRate,
                        4,
                      )}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] text-gray-400">
                    New purchase cost
                  </p>

                  <p className="mt-2 text-base font-semibold text-gray-950">
                    {formatCurrency(
                      scenarioPurchaseCost,
                      'NGN',
                    )}
                  </p>
                </div>

                <div className="border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] text-gray-400">
                    Profit
                  </p>

                  <p
                    className={`mt-2 text-base font-semibold ${
                      scenarioProfit >=
                      0
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(
                      scenarioProfit,
                      'NGN',
                    )}
                  </p>
                </div>

                <div className="border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] text-gray-400">
                    Margin
                  </p>

                  <p
                    className={`mt-2 text-base font-semibold ${
                      scenarioMargin >=
                      0
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    {formatNumber(
                      scenarioMargin,
                      1,
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2 border-t border-gray-100 pt-4">
                {rateChangePercent >
                0 ? (
                  <ArrowUp
                    size={15}
                    className="mt-0.5 text-red-500"
                  />
                ) : rateChangePercent < 0 ? (
                  <ArrowDown
                    size={15}
                    className="mt-0.5 text-emerald-600"
                  />
                ) : null}

                <p className="text-xs leading-5 text-gray-500">
                  {activeRate
                    ? `The test rate is ${formatNumber(
                        Math.abs(
                          rateChangePercent,
                        ),
                        1,
                      )}% ${
                        rateChangePercent >
                        0
                          ? 'higher'
                          : rateChangePercent <
                              0
                            ? 'lower'
                            : 'the same as'
                      } the current live rate.`
                    : 'Enter a rate to model the scenario.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Converter */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-700">
                <Coins size={17} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Currency converter
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Quickly convert between XOF and NGN
                  using the live reference rate.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                XOF amount
              </label>

              <div className="flex border border-gray-200 bg-gray-50">
                <span className="flex items-center border-r border-gray-200 px-3 text-xs font-medium text-gray-500">
                  XOF
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    conversionAmount
                  }
                  onChange={(event) =>
                    setConversionAmount(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                />
              </div>

              <div className="mt-5 flex items-center justify-center">
                <ArrowDown
                  size={18}
                  className="text-gray-300"
                />
              </div>

              <div className="border border-gray-100 bg-gray-50 p-4">
                <p className="text-[11px] text-gray-400">
                  Equivalent in NGN
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-950">
                  {activeRate
                    ? formatCurrency(
                        convertedNgn,
                        'NGN',
                      )
                    : '—'}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Reverse conversion
              </p>

              <div className="border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">
                    {activeRate
                      ? formatCurrency(
                          conversionAmount,
                          'XOF',
                        )
                      : '—'}
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-gray-300"
                  />

                  <span className="text-sm font-semibold text-gray-950">
                    {activeRate
                      ? formatCurrency(
                          convertedNgn,
                          'NGN',
                        )
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="mt-4 border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">
                    {activeRate
                      ? formatCurrency(
                          convertedNgn,
                          'NGN',
                        )
                      : '—'}
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-gray-300"
                  />

                  <span className="text-sm font-semibold text-gray-950">
                    {activeRate
                      ? formatCurrency(
                          convertedXof,
                          'XOF',
                        )
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick conversions */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-gray-950">
              Common conversions
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Quick XOF to Naira estimates at the current
              live reference rate.
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {[
              1000,
              5000,
              10000,
              25000,
              50000,
              100000,
            ].map((amount) => (
              <button
                type="button"
                key={amount}
                onClick={() =>
                  setConversionAmount(
                    amount,
                  )
                }
                className="p-4 text-left transition hover:bg-gray-50 sm:p-5"
              >
                <p className="text-xs text-gray-400">
                  {formatNumber(
                    amount,
                    0,
                  )}{' '}
                  XOF
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-950">
                  {activeRate
                    ? formatCompactCurrency(
                        amount *
                          activeRate,
                        'NGN',
                      )
                    : '—'}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Business activity */}
        <section className="mb-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950">
                Currency activity
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Transaction activity recorded in your
                selected period.
              </p>
            </div>

            <div className="flex w-full border border-gray-200 bg-white sm:w-auto">
              {(
                [
                  '7D',
                  '30D',
                  '90D',
                ] as Period[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setPeriod(item)
                  }
                  className={`flex-1 px-4 py-2 text-xs font-medium transition sm:flex-none ${
                    period === item
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  XOF activity
                </span>

                <Coins
                  size={16}
                  className="text-gray-300"
                />
              </div>

              <p className="mt-4 text-xl font-semibold text-gray-950">
                {formatCurrency(
                  totalXofSpend,
                  'XOF',
                )}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {xofTransactions.length}{' '}
                recorded XOF transaction
                {xofTransactions.length ===
                1
                  ? ''
                  : 's'}
              </p>
            </div>

            <div className="border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  XOF at live rate
                </span>

                <Globe2
                  size={16}
                  className="text-gray-300"
                />
              </div>

              <p className="mt-4 text-xl font-semibold text-gray-950">
                {activeRate
                  ? formatCurrency(
                      totalNgnValueOfXofSpend,
                      'NGN',
                    )
                  : '—'}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Estimated current Naira value
              </p>
            </div>

            <div className="border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  NGN activity
                </span>

                <Wallet
                  size={16}
                  className="text-gray-300"
                />
              </div>

              <p className="mt-4 text-xl font-semibold text-gray-950">
                {formatCurrency(
                  totalNgnActivity,
                  'NGN',
                )}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {ngnTransactions.length}{' '}
                recorded NGN transaction
                {ngnTransactions.length ===
                1
                  ? ''
                  : 's'}
              </p>
            </div>
          </div>
        </section>

        {/* Rate comparison */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <History
                size={17}
                className="shrink-0 text-gray-400"
              />

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Rate context
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Compare the live reference rate with
                  rates recorded on your XOF transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Latest recorded transaction rate
                </span>

                <History
                  size={15}
                  className="text-gray-300"
                />
              </div>

              <p className="mt-3 text-2xl font-semibold text-gray-950">
                {latestRecordedRate
                  ? `₦${formatNumber(
                      latestRecordedRate,
                      4,
                    )}`
                  : '—'}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Derived from your recorded XOF
                transaction data.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-gray-400">
                  Live reference rate
                </span>

                {liveRateDifferencePercent !==
                  null && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      liveRateDifferencePercent >
                      0
                        ? 'text-red-600'
                        : liveRateDifferencePercent <
                            0
                          ? 'text-emerald-700'
                          : 'text-gray-500'
                    }`}
                  >
                    {liveRateDifferencePercent >
                    0 ? (
                      <TrendingUp size={13} />
                    ) : liveRateDifferencePercent <
                      0 ? (
                      <TrendingDown
                        size={13}
                      />
                    ) : null}

                    {formatNumber(
                      Math.abs(
                        liveRateDifferencePercent,
                      ),
                      1,
                    )}
                    %
                  </span>
                )}
              </div>

              <p className="mt-3 text-2xl font-semibold text-emerald-700">
                {activeRate
                  ? `₦${formatNumber(
                      activeRate,
                      4,
                    )}`
                  : '—'}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Current reference value used by the
                pricing calculator.
              </p>
            </div>
          </div>
        </section>

        {/* Recorded history */}
        {recordedRateHistory.length >
          0 && (
          <section className="mb-6 border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <History
                  size={17}
                  className="text-gray-400"
                />

                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    Recorded transaction rates
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Historical rates derived from your
                    own XOF transaction records.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {recordedRateHistory.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.description}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(
                          item.date,
                        )}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-gray-950">
                      1 XOF = ₦
                      {formatNumber(
                        item.rate,
                        4,
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* Recent XOF transactions */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-gray-950">
                Recent XOF transactions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your most recent completed transactions
                recorded in XOF.
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {xofTransactions.length} in{' '}
              {period}
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Loading transactions...
              </div>
            </div>
          ) : xofTransactions.length ===
            0 ? (
            <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-10 w-10 items-center justify-center bg-gray-100 text-gray-400">
                  <Coins size={17} />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No XOF transactions found
                </p>

                <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                  Completed XOF transactions will
                  appear here once they are recorded
                  in your Monietar account.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Transaction
                    </th>

                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Date
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      XOF
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Recorded NGN
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Recorded rate
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {xofTransactions
                    .slice(0, 10)
                    .map(
                      (
                        transaction,
                      ) => {
                        const amount =
                          Math.abs(
                            getTransactionAmount(
                              transaction,
                            ),
                          );

                        const baseAmount =
                          Math.abs(
                            getTransactionBaseAmount(
                              transaction,
                            ),
                          );

                        const recordedRate =
                          getRecordedXofRate(
                            transaction,
                          );

                        return (
                          <tr
                            key={
                              transaction.id
                            }
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">
                              <p className="max-w-[280px] truncate text-sm font-medium text-gray-800">
                                {transaction.description ||
                                  transaction.category ||
                                  'XOF transaction'}
                              </p>

                              {transaction.reference && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                  {
                                    transaction.reference
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-4 text-xs text-gray-500">
                              {formatDate(
                                transaction.date,
                              )}
                            </td>

                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                              {formatCurrency(
                                amount,
                                'XOF',
                              )}
                            </td>

                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                              {baseAmount
                                ? formatCurrency(
                                    baseAmount,
                                    'NGN',
                                  )
                                : '—'}
                            </td>

                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                              {recordedRate
                                ? `₦${formatNumber(
                                    recordedRate,
                                    4,
                                  )}`
                                : '—'}
                            </td>
                          </tr>
                        );
                      },
                    )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Business insight */}
        <section className="border border-emerald-100 bg-emerald-50">
          <div className="flex items-start gap-4 p-5 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-emerald-700">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Business insight
              </p>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-emerald-950">
                {insight}
              </p>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-6 flex items-start gap-2 text-[11px] leading-5 text-gray-400">
          <Info
            size={13}
            className="mt-0.5 shrink-0"
          />

          <p>
            Live FX is used for estimates and pricing
            decisions. It does not overwrite the exchange
            rate originally recorded on your transactions.
            Your transaction history remains tied to the
            rate and Naira amount recorded at the time of
            the transaction.
          </p>
        </div>
      </div>
    </main>
  );
}