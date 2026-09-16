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

const formatNumber = (
  value: number,
  maximumFractionDigits = 2,
) =>
  new Intl.NumberFormat('en-NG', {
    maximumFractionDigits,
    minimumFractionDigits:
      maximumFractionDigits === 2 ? 2 : 0,
  }).format(value);

const formatCurrency = (
  value: number,
  currency: 'NGN' | 'XOF',
) => {
  if (!Number.isFinite(value)) {
    return currency === 'NGN'
      ? '₦0.00'
      : '0 XOF';
  }

  if (currency === 'NGN') {
    return `₦${formatNumber(value, 2)}`;
  }

  return `${formatNumber(value, 0)} XOF`;
};

const formatCompactCurrency = (
  value: number,
  currency: 'NGN' | 'XOF',
) => {
  if (!Number.isFinite(value)) {
    return currency === 'NGN'
      ? '₦0'
      : '0 XOF';
  }

  if (currency === 'NGN') {
    return `₦${formatNumber(value, 0)}`;
  }

  return `${formatNumber(value, 0)} XOF`;
};

const formatDate = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatShortDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
};

const formatDateTime = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getTransactionAmount = (
  transaction: Transaction,
) => {
  const amount = Number(transaction.amount);

  return Number.isFinite(amount) ? amount : 0;
};

const getTransactionBaseAmount = (
  transaction: Transaction,
) => {
  const amountBase = Number(transaction.amount_base);

  return Number.isFinite(amountBase)
    ? amountBase
    : 0;
};

const getRecordedXofRate = (
  transaction: Transaction,
) => {
  const amount =
    getTransactionAmount(transaction);

  const amountBase =
    getTransactionBaseAmount(transaction);

  if (
    transaction.currency?.toUpperCase() !==
      'XOF' ||
    amount <= 0 ||
    amountBase <= 0
  ) {
    return null;
  }

  return amountBase / amount;
};

export default function DualCurrencyPage() {
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
  ] =
    useState<RateHistoryPoint | null>(null);

  const [purchaseXof, setPurchaseXof] =
    useState<number>(10000);

  const [
    sellingPriceNgn,
    setSellingPriceNgn,
  ] = useState<number>(30000);

  const [targetMargin, setTargetMargin] =
    useState<number>(20);

  const [
    conversionAmount,
    setConversionAmount,
  ] = useState<number>(10000);

  const [scenarioRate, setScenarioRate] =
    useState<number>(2.5);

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const loadTransactions = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !session?.user
      ) {
        setTransactions([]);

        setLoading(false);
        setRefreshing(false);

        return;
      }

      const user = session.user;

      const { data, error } =
        await supabase
          .from('transactions')
          .select(`
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
          `)
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
        console.error(
          'Unable to load transactions:',
          error,
        );

        setTransactions([]);
      } else {
        setTransactions(
          (data ?? []) as Transaction[],
        );
      }

      setLoading(false);
      setRefreshing(false);
    },
    [supabase],
  );

  const loadLiveRate = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setFxLoading(true);
      }

      setFxError(null);

      try {
        const response = await fetch(
          '/api/exchange-rate',
          {
            method: 'GET',
            cache: 'no-store',
          },
        );

        const data =
          (await response.json()) as
            | LiveRateResponse
            | { error?: string };

        if (!response.ok) {
          throw new Error(
            'error' in data && data.error
              ? data.error
              : 'Unable to retrieve the live exchange rate.',
          );
        }

        if (
          !('rate' in data) ||
          typeof data.rate !== 'number' ||
          !Number.isFinite(data.rate) ||
          data.rate <= 0
        ) {
          throw new Error(
            'The exchange-rate provider returned an invalid rate.',
          );
        }

        setLiveRate(data.rate);

        setLiveRateUpdatedAt(
          data.updatedAt ?? null,
        );

        setLiveRateSource(
          data.source ?? null,
        );
      } catch (error) {
        console.error(
          'Unable to load live exchange rate:',
          error,
        );

        setFxError(
          error instanceof Error
            ? error.message
            : 'Unable to retrieve the live exchange rate.',
        );
      } finally {
        setFxLoading(false);
      }
    },
    [],
  );

  const loadRateHistory =
    useCallback(
      async (
        selectedPeriod: Period,
        showLoading = true,
      ) => {
        if (showLoading) {
          setRateHistoryLoading(true);
        }

        setRateHistoryError(null);

        try {
          const response = await fetch(
            `/api/exchange-rate/history?period=${selectedPeriod}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );

          const data =
            (await response.json()) as
              | RateHistoryResponse
              | { error?: string };

          if (!response.ok) {
            throw new Error(
              'error' in data && data.error
                ? data.error
                : 'Unable to retrieve historical exchange rates.',
            );
          }

          if (
            !('history' in data) ||
            !Array.isArray(data.history)
          ) {
            throw new Error(
              'The historical exchange-rate provider returned an invalid response.',
            );
          }

          const validHistory =
            data.history.filter(
              (item) =>
                item &&
                typeof item.date ===
                  'string' &&
                typeof item.rate ===
                  'number' &&
                Number.isFinite(
                  item.rate,
                ) &&
                item.rate > 0,
            );

          setRateHistory(
            validHistory,
          );

          if (
            validHistory.length > 0
          ) {
            setSelectedChartPoint(
              validHistory[
                validHistory.length - 1
              ],
            );
          } else {
            setSelectedChartPoint(null);
          }
        } catch (error) {
          console.error(
            'Unable to load rate history:',
            error,
          );

          setRateHistory([]);

          setSelectedChartPoint(null);

          setRateHistoryError(
            error instanceof Error
              ? error.message
              : 'Unable to retrieve historical exchange rates.',
          );
        } finally {
          setRateHistoryLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    loadTransactions();
    loadLiveRate();
  }, [
    loadTransactions,
    loadLiveRate,
  ]);

  useEffect(() => {
    loadRateHistory(period);
  }, [
    period,
    loadRateHistory,
  ]);

  const handleRefresh = async () => {
    await Promise.all([
      loadTransactions(true),
      loadLiveRate(true),
      loadRateHistory(period, true),
    ]);
  };

  const periodStart = useMemo(() => {
    const date = new Date();

    date.setDate(
      date.getDate() -
        PERIOD_DAYS[period],
    );

    date.setHours(0, 0, 0, 0);

    return date;
  }, [period]);

  const periodTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => {
          const date = new Date(
            transaction.date,
          );

          return (
            !Number.isNaN(
              date.getTime(),
            ) &&
            date >= periodStart
          );
        },
      ),
    [transactions, periodStart],
  );

  const xofTransactions = useMemo(
    () =>
      periodTransactions.filter(
        (transaction) =>
          transaction.currency?.toUpperCase() ===
          'XOF',
      ),
    [periodTransactions],
  );

  const ngnTransactions = useMemo(
    () =>
      periodTransactions.filter(
        (transaction) =>
          transaction.currency?.toUpperCase() ===
          'NGN',
      ),
    [periodTransactions],
  );

  const latestRecordedRate =
    useMemo(() => {
      for (const transaction of transactions) {
        const rate =
          getRecordedXofRate(
            transaction,
          );

        if (rate) {
          return rate;
        }
      }

      return null;
    }, [transactions]);

  const activeRate = liveRate;

  const purchaseCostNgn =
    useMemo(() => {
      if (!activeRate) {
        return 0;
      }

      return (
        purchaseXof * activeRate
      );
    }, [purchaseXof, activeRate]);

  const currentProfit =
    useMemo(
      () =>
        sellingPriceNgn > 0
          ? sellingPriceNgn -
            purchaseCostNgn
          : 0,
      [
        sellingPriceNgn,
        purchaseCostNgn,
      ],
    );

  const currentMargin =
    useMemo(() => {
      if (sellingPriceNgn <= 0) {
        return 0;
      }

      return (
        (currentProfit /
          sellingPriceNgn) *
        100
      );
    }, [
      currentProfit,
      sellingPriceNgn,
    ]);

  const minimumSellingPrice =
    useMemo(() => {
      if (!activeRate) {
        return 0;
      }

      const margin = Math.min(
        Math.max(
          targetMargin,
          0,
        ),
        99,
      );

      return (
        purchaseCostNgn /
        (1 - margin / 100)
      );
    }, [
      activeRate,
      purchaseCostNgn,
      targetMargin,
    ]);

  const scenarioPurchaseCost =
    useMemo(
      () =>
        purchaseXof *
        scenarioRate,
      [
        purchaseXof,
        scenarioRate,
      ],
    );

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
    useMemo(() => {
      if (
        !activeRate ||
        activeRate <= 0
      ) {
        return 0;
      }

      return (
        ((scenarioRate -
          activeRate) /
          activeRate) *
        100
      );
    }, [
      activeRate,
      scenarioRate,
    ]);

  const convertedNgn =
    activeRate
      ? conversionAmount *
        activeRate
      : 0;

  const convertedXof =
    activeRate &&
    activeRate > 0
      ? conversionAmount /
        activeRate
      : 0;

  const totalXofSpend =
    useMemo(
      () =>
        xofTransactions.reduce(
          (
            total,
            transaction,
          ) =>
            total +
            Math.abs(
              getTransactionAmount(
                transaction,
              ),
            ),
          0,
        ),
      [xofTransactions],
    );

  const totalNgnValueOfXofSpend =
    activeRate
      ? totalXofSpend *
        activeRate
      : 0;

  const totalNgnActivity =
    useMemo(
      () =>
        ngnTransactions.reduce(
          (
            total,
            transaction,
          ) =>
            total +
            Math.abs(
              getTransactionAmount(
                transaction,
              ),
            ),
          0,
        ),
      [ngnTransactions],
    );

  const recordedRateHistory =
    useMemo(() => {
      return transactions
        .map((transaction) => {
          const rate =
            getRecordedXofRate(
              transaction,
            );

          if (!rate) {
            return null;
          }

          return {
            id: transaction.id,
            date: transaction.date,
            rate,
            description:
              transaction.description ||
              transaction.category ||
              'XOF transaction',
          };
        })
        .filter(
          (
            item,
          ): item is {
            id: string;
            date: string;
            rate: number;
            description: string;
          } => item !== null,
        )
        .slice(0, 6);
    }, [transactions]);

  const liveRateDifference =
    activeRate &&
    latestRecordedRate
      ? activeRate -
        latestRecordedRate
      : null;

  const liveRateDifferencePercent =
    activeRate &&
    latestRecordedRate
      ? ((activeRate -
          latestRecordedRate) /
          latestRecordedRate) *
        100
      : null;

  const chartMetrics = useMemo(() => {
    if (rateHistory.length === 0) {
      return null;
    }

    const first =
      rateHistory[0].rate;

    const latest =
      rateHistory[
        rateHistory.length - 1
      ].rate;

    const change =
      latest - first;

    const changePercent =
      first > 0
        ? (change / first) * 100
        : 0;

    const rates =
      rateHistory.map(
        (item) => item.rate,
      );

    const min = Math.min(
      ...rates,
    );

    const max = Math.max(
      ...rates,
    );

    return {
      first,
      latest,
      change,
      changePercent,
      min,
      max,
    };
  }, [rateHistory]);

  /*
   * The chart uses a fixed internal SVG coordinate system.
   * The SVG itself is responsive through viewBox + width: 100%.
   *
   * The tooltip coordinates are calculated from these same
   * coordinates, which means the tooltip stays attached
   * to the actual point even when the chart scales.
   */
  const chart = useMemo(() => {
    if (
      rateHistory.length === 0
    ) {
      return null;
    }

    const width = 1000;
    const height = 360;

    const paddingLeft = 62;
    const paddingRight = 22;
    const paddingTop = 28;
    const paddingBottom = 48;

    const chartWidth =
      width -
      paddingLeft -
      paddingRight;

    const chartHeight =
      height -
      paddingTop -
      paddingBottom;

    const rates =
      rateHistory.map(
        (item) => item.rate,
      );

    const minRate =
      Math.min(...rates);

    const maxRate =
      Math.max(...rates);

    const range =
      maxRate - minRate;

    const verticalPadding =
      range === 0
        ? Math.max(
            maxRate * 0.015,
            0.01,
          )
        : range * 0.15;

    const minY =
      minRate -
      verticalPadding;

    const maxY =
      maxRate +
      verticalPadding;

    const yRange =
      maxY - minY || 1;

    const points =
      rateHistory.map(
        (item, index) => {
          const x =
            paddingLeft +
            (index /
              Math.max(
                rateHistory.length -
                  1,
                1,
              )) *
              chartWidth;

          const y =
            paddingTop +
            (1 -
              (item.rate -
                minY) /
                yRange) *
              chartHeight;

          return {
            ...item,
            x,
            y,
          };
        },
      );

    const linePath =
      points
        .map(
          (point, index) =>
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
        )
        .join(' ');

    const areaPath = `${linePath} L ${
      points[points.length - 1].x
    } ${
      paddingTop +
      chartHeight
    } L ${
      points[0].x
    } ${
      paddingTop +
      chartHeight
    } Z`;

    const yTicks = Array.from(
      { length: 5 },
      (_, index) => {
        const ratio =
          index / 4;

        const value =
          maxY -
          ratio * yRange;

        const y =
          paddingTop +
          ratio *
            chartHeight;

        return {
          value,
          y,
        };
      },
    );

    /*
     * On short ranges show more labels.
     * On longer ranges keep the chart clean.
     */
    let labelIndexes: number[];

    if (rateHistory.length <= 4) {
      labelIndexes =
        rateHistory.map(
          (_, index) => index,
        );
    } else if (
      rateHistory.length <= 10
    ) {
      labelIndexes = [
        0,
        Math.floor(
          (rateHistory.length - 1) /
            3,
        ),
        Math.floor(
          ((rateHistory.length - 1) *
            2) /
            3,
        ),
        rateHistory.length - 1,
      ];
    } else {
      labelIndexes = [
        0,
        Math.floor(
          (rateHistory.length - 1) /
            2,
        ),
        rateHistory.length - 1,
      ];
    }

    const xLabels =
      labelIndexes.map(
        (index) => ({
          ...points[index],
          label:
            formatShortDate(
              points[index].date,
            ),
        }),
      );

    return {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      chartHeight,
      chartWidth,
      points,
      linePath,
      areaPath,
      yTicks,
      xLabels,
    };
  }, [rateHistory]);

  /*
   * Calculate tooltip position from the selected point.
   *
   * Instead of using:
   *   absolute right-4 top-4
   *
   * the tooltip follows the selected point.
   *
   * We also flip it horizontally/vertically when the
   * selected point is near an edge.
   */
  const chartTooltipPosition = useMemo(() => {
    if (
      !chart ||
      !selectedChartPoint
    ) {
      return null;
    }

    const point = chart.points.find(
      (item) =>
        item.date ===
        selectedChartPoint.date,
    );

    if (!point) {
      return null;
    }

    const leftPercent =
      (point.x / chart.width) * 100;

    const topPercent =
      (point.y / chart.height) * 100;

    const isNearLeft =
      leftPercent < 20;

    const isNearRight =
      leftPercent > 80;

    const isNearTop =
      topPercent < 28;

    return {
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      transform: isNearLeft
        ? 'translate(0, -115%)'
        : isNearRight
          ? 'translate(-100%, -115%)'
          : isNearTop
            ? 'translate(-50%, 18px)'
            : 'translate(-50%, -115%)',
    };
  }, [
    chart,
    selectedChartPoint,
  ]);

  const insight = useMemo(() => {
    if (!activeRate) {
      return 'The live XOF/NGN rate is currently unavailable. Once it loads, Monietar will calculate the current Naira cost of your XOF purchases.';
    }

    if (currentMargin < 0) {
      return `At the current rate, this item is selling below its converted purchase cost by ${formatCurrency(
        Math.abs(currentProfit),
        'NGN',
      )}. Your selling price needs to increase to protect your margin.`;
    }

    if (
      currentMargin >= 0 &&
      currentMargin < 10
    ) {
      return `Your current margin is ${formatNumber(
        currentMargin,
        1,
      )}%. A small XOF/NGN movement could materially reduce the profit on this item.`;
    }

    if (
      latestRecordedRate &&
      liveRateDifferencePercent !==
        null &&
      Math.abs(
        liveRateDifferencePercent,
      ) >= 3
    ) {
      const direction =
        liveRateDifferencePercent >
        0
          ? 'higher'
          : 'lower';

      return `The live reference rate is ${formatNumber(
        Math.abs(
          liveRateDifferencePercent,
        ),
        1,
      )}% ${direction} than your latest recorded transaction rate. Review XOF-priced stock before setting your next Naira selling price.`;
    }

    return `At the current reference rate, your ${formatCurrency(
      purchaseXof,
      'XOF',
    )} purchase costs about ${formatCurrency(
      purchaseCostNgn,
      'NGN',
    )}. Use the calculator to check whether your selling price still protects your target margin.`;
  }, [
    activeRate,
    currentMargin,
    currentProfit,
    latestRecordedRate,
    liveRateDifferencePercent,
    purchaseXof,
    purchaseCostNgn,
  ]);

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-gray-900">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-7 lg:px-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              <Globe2 size={14} />
              Dual Currency
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              Understand your XOF to NGN
              costs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              See what your XOF purchases cost in
              Naira today, what you actually make
              when you sell, and when an exchange-rate
              change means you need to update your
              selling price.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={
              refreshing ||
              fxLoading ||
              rateHistoryLoading
            }
            className="inline-flex h-10 w-full items-center justify-center gap-2 border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw
              size={15}
              className={
                refreshing ||
                fxLoading ||
                rateHistoryLoading
                  ? 'animate-spin'
                  : ''
              }
            />
            Refresh
          </button>
        </div>

        {/* Live rate */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                    Live reference rate
                  </p>

                  <div className="mt-3 flex flex-wrap items-baseline gap-2 sm:gap-3">
                    {fxLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2
                          size={20}
                          className="animate-spin"
                        />
                        <span className="text-sm">
                          Loading live rate...
                        </span>
                      </div>
                    ) : activeRate ? (
                      <>
                        <span className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                          1 XOF
                        </span>

                        <ArrowRight
                          size={18}
                          className="text-gray-400"
                        />

                        <span className="text-2xl font-semibold tracking-tight text-emerald-700 sm:text-3xl">
                          ₦
                          {formatNumber(
                            activeRate,
                            4,
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-medium text-red-600">
                        Rate unavailable
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Globe2 size={19} />
                </div>
              </div>

              {fxError ? (
                <div className="flex items-start gap-3 border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700">
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-medium">
                      Could not load the live rate.
                    </p>

                    <p className="mt-0.5">
                      {fxError}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                  {liveRateUpdatedAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} />
                      Updated{' '}
                      {formatDateTime(
                        liveRateUpdatedAt,
                      )}
                    </span>
                  )}

                  {liveRateSource && (
                    <span>
                      Source: {liveRateSource}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
                <Info
                  size={16}
                  className="text-gray-400"
                />
                What this means
              </div>

              <p className="text-sm leading-6 text-gray-500">
                If your supplier charges{' '}
                <span className="font-medium text-gray-800">
                  10,000 XOF
                </span>
                , Monietar uses the current reference
                rate to estimate what that purchase costs
                you in Naira today.
              </p>

              {activeRate && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">
                    10,000 XOF
                  </span>

                  <span className="text-sm font-semibold text-gray-950">
                    ≈{' '}
                    {formatCurrency(
                      10000 *
                        activeRate,
                      'NGN',
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-[11px] leading-5 text-gray-500 sm:px-6">
            This is a live reference/mid-market rate
            for planning and pricing. Your actual bank,
            BDC, supplier, transfer or settlement rate
            may be different.
          </div>
        </section>

        {/* FX rate movement */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-emerald-50 text-emerald-700">
                  <TrendingUp size={17} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    XOF → NGN rate movement
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-gray-500">
                    See how the Naira cost of 1 XOF has
                    moved over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full self-start border border-gray-200 bg-white sm:w-auto sm:self-auto">
              {(
                ['7D', '30D', '90D'] as Period[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setPeriod(item);
                  }}
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

          {rateHistoryLoading ? (
            <div className="flex min-h-[320px] items-center justify-center px-5 sm:min-h-[360px]">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Loading rate history...
              </div>
            </div>
          ) : rateHistoryError ? (
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 border border-red-100 bg-red-50 p-4 text-xs leading-5 text-red-700">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-medium">
                    Could not load rate history.
                  </p>

                  <p className="mt-0.5">
                    {rateHistoryError}
                  </p>
                </div>
              </div>
            </div>
          ) : rateHistory.length === 0 ||
            !chart ||
            !chartMetrics ? (
            <div className="flex min-h-[320px] items-center justify-center px-6 text-center sm:min-h-[360px]">
              <div>
                <div className="mx-auto flex h-10 w-10 items-center justify-center bg-gray-100 text-gray-400">
                  <History size={17} />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No rate history available
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Historical XOF/NGN data could not be
                  loaded for this period.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] text-gray-400">
                    Starting rate
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-950">
                    ₦
                    {formatNumber(
                      chartMetrics.first,
                      4,
                    )}
                  </p>
                </div>

                <div className="border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] text-gray-400">
                    Latest rate
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-950">
                    ₦
                    {formatNumber(
                      chartMetrics.latest,
                      4,
                    )}
                  </p>
                </div>

                <div className="border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] text-gray-400">
                    Movement
                  </p>

                  <p
                    className={`mt-2 text-lg font-semibold ${
                      chartMetrics.change >
                      0
                        ? 'text-red-600'
                        : chartMetrics.change <
                            0
                          ? 'text-emerald-700'
                          : 'text-gray-700'
                    }`}
                  >
                    {chartMetrics.change >
                    0
                      ? '+'
                      : ''}
                    {formatNumber(
                      chartMetrics.changePercent,
                      2,
                    )}
                    %
                  </p>
                </div>
              </div>

              {/* Responsive chart */}
              <div className="relative w-full overflow-visible">
                <div className="relative w-full overflow-visible">
                  <svg
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="block h-auto max-h-[390px] min-h-[240px] w-full overflow-visible"
                    role="img"
                    aria-label={`XOF to NGN exchange rate movement over ${period}`}
                  >
                    <defs>
                      <linearGradient
                        id="xofRateArea"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#047857"
                          stopOpacity="0.20"
                        />

                        <stop
                          offset="100%"
                          stopColor="#047857"
                          stopOpacity="0.02"
                        />
                      </linearGradient>
                    </defs>

                    {chart.yTicks.map(
                      (tick) => (
                        <g
                          key={`y-${tick.y}`}
                        >
                          <line
                            x1={
                              chart.paddingLeft
                            }
                            x2={
                              chart.width -
                              chart.paddingRight
                            }
                            y1={tick.y}
                            y2={tick.y}
                            stroke="#f0f0f0"
                            strokeWidth="1"
                          />

                          <text
                            x={
                              chart.paddingLeft -
                              10
                            }
                            y={
                              tick.y +
                              4
                            }
                            textAnchor="end"
                            fontSize="11"
                            fill="#9ca3af"
                          >
                            ₦
                            {tick.value.toFixed(
                              3,
                            )}
                          </text>
                        </g>
                      ),
                    )}

                    <path
                      d={chart.areaPath}
                      fill="url(#xofRateArea)"
                    />

                    <path
                      d={chart.linePath}
                      fill="none"
                      stroke="#047857"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chart.points.map(
                      (point) => {
                        const isSelected =
                          selectedChartPoint?.date ===
                          point.date;

                        return (
                          <g
                            key={`${point.date}-${point.rate}`}
                          >
                            {/* Invisible larger hit area */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="14"
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() =>
                                setSelectedChartPoint(
                                  point,
                                )
                              }
                              onFocus={() =>
                                setSelectedChartPoint(
                                  point,
                                )
                              }
                              onClick={() =>
                                setSelectedChartPoint(
                                  point,
                                )
                              }
                              tabIndex={0}
                              role="button"
                              aria-label={`1 XOF equals ${formatNumber(
                                point.rate,
                                4,
                              )} NGN on ${formatDate(
                                point.date,
                              )}`}
                            />

                            {/* Selected point */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={
                                isSelected
                                  ? 5
                                  : 2
                              }
                              fill={
                                isSelected
                                  ? '#ffffff'
                                  : '#047857'
                              }
                              stroke="#047857"
                              strokeWidth={
                                isSelected
                                  ? 3
                                  : 0
                              }
                              pointerEvents="none"
                            />
                          </g>
                        );
                      },
                    )}

                    {chart.xLabels.map(
                      (label) => (
                        <text
                          key={`x-${label.date}`}
                          x={label.x}
                          y={
                            chart.height -
                            13
                          }
                          textAnchor="middle"
                          fontSize="11"
                          fill="#9ca3af"
                        >
                          {label.label}
                        </text>
                      ),
                    )}
                  </svg>

                  {/* Dynamic point tooltip */}
                  {selectedChartPoint &&
                    chartTooltipPosition && (
                      <div
                        className="pointer-events-none absolute z-10 whitespace-nowrap border border-gray-200 bg-white px-3 py-2.5 shadow-lg"
                        style={{
                          left:
                            chartTooltipPosition.left,
                          top:
                            chartTooltipPosition.top,
                          transform:
                            chartTooltipPosition.transform,
                        }}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                          {formatDate(
                            selectedChartPoint.date,
                          )}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-950">
                          1 XOF = ₦
                          {formatNumber(
                            selectedChartPoint.rate,
                            4,
                          )}
                        </p>

                        {chartMetrics && (
                          <p className="mt-0.5 text-[10px] text-gray-400">
                            {selectedChartPoint.rate >
                            chartMetrics.first
                              ? 'Higher than period start'
                              : selectedChartPoint.rate <
                                  chartMetrics.first
                                ? 'Lower than period start'
                                : 'Same as period start'}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 text-[11px] leading-5 text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Daily XOF/NGN reference-rate movement
                </span>

                <span>
                  Source: Frankfurter
                </span>
              </div>

              <div className="mt-4 border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs leading-5 text-gray-500">
                  <span className="font-medium text-gray-800">
                    Pricing meaning:
                  </span>{' '}
                  when the XOF/NGN rate rises, each XOF
                  costs more Naira. If your supplier price
                  stays the same in XOF, your Naira cost
                  increases and your selling price may need
                  to increase to protect your margin.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Main profitability calculator */}
        <section className="mb-6 border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-emerald-50 text-emerald-700">
                <Calculator size={17} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Will I still make money?
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Enter the supplier price in XOF and
                  your Naira selling price.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3">
            {/* Inputs */}
            <div className="border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="space-y-5">
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
                ['7D', '30D', '90D'] as Period[]
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
                    className="flex flex-col gap-2 px-5 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between"
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
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
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