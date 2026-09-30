'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Loader2,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type SaleStatus =
  | 'Completed'
  | 'Pending'
  | 'Cancelled'
  | string;

type Currency = 'NGN' | 'XOF';

const SUPPORTED_CURRENCIES: Currency[] = [
  'NGN',
  'XOF',
];

interface Sale {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: Currency;
  status: SaleStatus;
  sale_date: string;
  customer_name: string | null;
  customer_reference: string | null;
  notes: string | null;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  user_id: string;
  name: string;
  sku: string | null;
  unit: string | null;
  cost_price: number | string | null;
  selling_price: number | string | null;
  currency: Currency | null;
  current_stock: number | null;
  reserved_stock: number | null;
  available_stock: number | null;
  is_service: boolean | null;
  is_active: boolean | null;
}

interface ProductPerformance {
  id: string;
  name: string;
  units: number;
  revenue: number;
  currency: Currency;
}

type Period =
  | 'Today'
  | 'This week'
  | 'This month'
  | 'Last month';

const formatCurrency = (
  amount: number,
  currency: Currency = 'NGN'
) => {
  if (currency === 'XOF') {
    return `CFA ${Math.round(amount).toLocaleString(
      'en-US'
    )}`;
  }

  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(value);

const toNumber = (
  value: number | string | null | undefined
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

function normalizeCurrency(
  value: unknown
): Currency | null {
  if (typeof value !== 'string') {
    return null;
  }

  const currency = value
    .trim()
    .toUpperCase();

  if (
    SUPPORTED_CURRENCIES.includes(
      currency as Currency
    )
  ) {
    return currency as Currency;
  }

  return null;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  /*
   * sale_date is normally YYYY-MM-DD.
   * Adding a local midnight avoids the UTC
   * interpretation that can shift the displayed day.
   */
  const dateOnly =
    /^\d{4}-\d{2}-\d{2}$/.test(value);

  const date = new Date(
    dateOnly
      ? `${value}T00:00:00`
      : value
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function getPeriodRange(period: Period) {
  const now = new Date();

  const start = new Date(now);
  const end = new Date(now);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (period === 'Today') {
    return {
      start,
      end,
    };
  }

  if (period === 'This week') {
    const day = start.getDay();

    const difference =
      day === 0 ? 6 : day - 1;

    start.setDate(
      start.getDate() - difference
    );

    return {
      start,
      end,
    };
  }

  if (period === 'This month') {
    start.setDate(1);

    return {
      start,
      end,
    };
  }

  start.setMonth(
    start.getMonth() - 1
  );

  start.setDate(1);

  end.setDate(0);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
}

function isCompletedSale(sale: Sale) {
  return (
    sale.status.toLowerCase() ===
    'completed'
  );
}

function formatSaleTime(sale: Sale) {
  const date = parseDate(
    sale.created_at
  );

  if (!date) {
    return sale.sale_date;
  }

  const today = new Date();

  const saleDay = getDateKey(date);
  const todayKey = getDateKey(today);

  if (saleDay === todayKey) {
    return new Intl.DateTimeFormat(
      'en-NG',
      {
        hour: 'numeric',
        minute: '2-digit',
      }
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    'en-NG',
    {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  ).format(date);
}

function formatSaleDate(
  dateValue: string
) {
  const date = parseDate(dateValue);

  if (!date) {
    return dateValue;
  }

  return new Intl.DateTimeFormat(
    'en-NG',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(date);
}

function getStatusClasses(
  status: SaleStatus
) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';

    case 'pending':
      return 'border-amber-200 bg-amber-50 text-amber-800';

    case 'cancelled':
    case 'canceled':
      return 'border-red-200 bg-red-50 text-red-800';

    default:
      return 'border-gray-200 bg-gray-50 text-gray-700';
  }
}

function StatusBadge({
  status,
}: {
  status: SaleStatus;
}) {
  const label =
    status.charAt(0).toUpperCase() +
    status.slice(1);

  return (
    <span
      className={`inline-flex border px-2 py-1 text-[11px] font-medium ${getStatusClasses(
        status
      )}`}
    >
      {label}
    </span>
  );
}

function Metric({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {label}
        </span>

        <span className="text-gray-400">
          {icon}
        </span>
      </div>

      <span className="text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </span>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ProductIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-gray-50 text-emerald-900">
      <Package
        size={17}
        strokeWidth={1.7}
      />
    </div>
  );
}

export default function SalesPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [sales, setSales] = useState<Sale[]>(
    []
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [period, setPeriod] =
    useState<Period>('Today');

  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>('NGN');

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All statuses');

  const [openSaleMenu, setOpenSaleMenu] =
    useState<string | null>(null);

  const [showRecordSale, setShowRecordSale] =
    useState(false);

  const [recordingSale, setRecordingSale] =
    useState(false);

  const [saleFormError, setSaleFormError] =
    useState<string | null>(null);

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState('');

  const [saleQuantity, setSaleQuantity] =
    useState('1');

  const [
    saleUnitPrice,
    setSaleUnitPrice,
  ] = useState('');

  const [saleCurrency, setSaleCurrency] =
    useState<Currency>('NGN');

  const [customerName, setCustomerName] =
    useState('');

  const [
    customerReference,
    setCustomerReference,
  ] = useState('');

  const [saleDate, setSaleDate] =
    useState(getDateKey(new Date()));

  const [saleNotes, setSaleNotes] =
    useState('');

  const loadSales = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      setError(null);

      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

      if (authError || !user) {
        setError(
          authError
            ? 'We could not verify your account.'
            : 'You need to be signed in to view your sales.'
        );

        setLoading(false);

        return;
      }

      const [
        salesResult,
        productsResult,
      ] = await Promise.all([
        supabase
          .from('sales')
          .select(`
            id,
            user_id,
            product_id,
            transaction_id,
            quantity,
            unit_price,
            total_amount,
            currency,
            status,
            sale_date,
            customer_name,
            customer_reference,
            notes,
            created_at,
            updated_at,
            products (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', {
            ascending: false,
          }),

        supabase
          .from('products')
          .select(`
            id,
            user_id,
            name,
            sku,
            unit,
            cost_price,
            selling_price,
            currency,
            current_stock,
            reserved_stock,
            available_stock,
            is_service,
            is_active
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('name', {
            ascending: true,
          }),
      ]);

      if (salesResult.error) {
        console.error(
          'Sales load error:',
          salesResult.error
        );

        setError(
          'We could not load your sales.'
        );

        setLoading(false);

        return;
      }

      if (productsResult.error) {
        console.error(
          'Products load error:',
          productsResult.error
        );

        setError(
          'We could not load your inventory.'
        );

        setLoading(false);

        return;
      }

      /*
       * Build a Sale[] directly.
       *
       * This avoids map() returning Sale | null,
       * which was the source of the TypeScript
       * errors in the previous version.
       */
      const normalizedSales =
        (salesResult.data ?? []).reduce<
          Sale[]
        >((result, sale: any) => {
          const productRelation =
            Array.isArray(
              sale.products
            )
              ? sale.products[0]
              : sale.products;

          const normalizedCurrency =
            normalizeCurrency(
              sale.currency
            );

          /*
           * Ignore legacy/unsupported currencies.
           * The current Monietar MVP only supports
           * NGN and XOF.
           */
          if (!normalizedCurrency) {
            return result;
          }

          result.push({
            id: String(
              sale.id
            ),
            user_id: String(
              sale.user_id
            ),
            product_id:
              sale.product_id ?? null,
            transaction_id:
              sale.transaction_id ?? null,
            product_name:
              productRelation?.name ??
              'Unlinked product',
            quantity: toNumber(
              sale.quantity
            ),
            unit_price: toNumber(
              sale.unit_price
            ),
            total_amount: toNumber(
              sale.total_amount
            ),
            currency:
              normalizedCurrency,
            status:
              sale.status ??
              'Completed',
            sale_date:
              String(
                sale.sale_date ??
                  ''
              ),
            customer_name:
              sale.customer_name ??
              null,
            customer_reference:
              sale.customer_reference ??
              null,
            notes:
              sale.notes ?? null,
            created_at:
              String(
                sale.created_at ??
                  ''
              ),
            updated_at:
              String(
                sale.updated_at ??
                  ''
              ),
          });

          return result;
        }, []);

      /*
       * Products are also restricted to the
       * supported MVP currencies.
       */
      const normalizedProducts =
        (productsResult.data ?? [])
          .reduce<Product[]>(
            (
              result,
              product
            ) => {
              const currency =
                normalizeCurrency(
                  product.currency
                );

              if (!currency) {
                return result;
              }

              result.push({
                id: String(
                  product.id
                ),
                user_id: String(
                  product.user_id
                ),
                name: String(
                  product.name
                ),
                sku:
                  product.sku ??
                  null,
                unit:
                  product.unit ??
                  null,
                cost_price:
                  product.cost_price ??
                  null,
                selling_price:
                  product.selling_price ??
                  null,
                currency,
                current_stock:
                  product.current_stock ??
                  null,
                reserved_stock:
                  product.reserved_stock ??
                  null,
                available_stock:
                  product.available_stock ??
                  null,
                is_service:
                  product.is_service ??
                  null,
                is_active:
                  product.is_active ??
                  null,
              });

              return result;
            },
            []
          );

      setSales(normalizedSales);
      setProducts(normalizedProducts);

      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    loadSales();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) =>
          product.id ===
          selectedProductId
      ) ?? null,
    [
      products,
      selectedProductId,
    ]
  );

  const availableStock = useMemo(() => {
    if (!selectedProduct) {
      return 0;
    }

    if (selectedProduct.is_service) {
      return null;
    }

    return toNumber(
      selectedProduct.available_stock
    );
  }, [selectedProduct]);

  const saleTotal = useMemo(() => {
    const quantity =
      toNumber(saleQuantity);

    const unitPrice =
      toNumber(saleUnitPrice);

    return quantity * unitPrice;
  }, [
    saleQuantity,
    saleUnitPrice,
  ]);

  function resetSaleForm() {
    setSelectedProductId('');
    setSaleQuantity('1');
    setSaleUnitPrice('');
    setSaleCurrency(
      selectedCurrency
    );
    setCustomerName('');
    setCustomerReference('');
    setSaleDate(
      getDateKey(new Date())
    );
    setSaleNotes('');
    setSaleFormError(null);
  }

  function openSaleForm() {
    setError(null);
    setSaleFormError(null);
    setOpenSaleMenu(null);
    resetSaleForm();
    setShowRecordSale(true);
  }

  function closeSaleForm() {
    if (recordingSale) {
      return;
    }

    setShowRecordSale(false);
    resetSaleForm();
  }

  function handleProductChange(
    productId: string
  ) {
    setSelectedProductId(
      productId
    );

    const product =
      products.find(
        (item) =>
          item.id === productId
      );

    if (!product) {
      setSaleCurrency(
        selectedCurrency
      );
      setSaleUnitPrice('');
      setSaleFormError(null);
      return;
    }

    const productCurrency =
      normalizeCurrency(
        product.currency
      );

    if (!productCurrency) {
      setSaleFormError(
        'This product does not have a supported NGN or XOF currency.'
      );

      setSaleUnitPrice('');

      return;
    }

    setSaleUnitPrice(
      String(
        toNumber(
          product.selling_price
        )
      )
    );

    /*
     * A sale must use the same currency
     * as the product price.
     */
    setSaleCurrency(
      productCurrency
    );

    if (
      productCurrency !==
      selectedCurrency
    ) {
      setSaleFormError(
        `This product is priced in ${productCurrency}. The sale currency has been switched to ${productCurrency}.`
      );
    } else {
      setSaleFormError(null);
    }
  }

  async function handleSubmitSale(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaleFormError(null);
    setError(null);

    if (!selectedProduct) {
      setSaleFormError(
        'Select a product from your inventory.'
      );

      return;
    }

    const productCurrency =
      normalizeCurrency(
        selectedProduct.currency
      );

    if (!productCurrency) {
      setSaleFormError(
        'This product must use NGN or XOF before it can be sold.'
      );

      return;
    }

    if (
      saleCurrency !==
      productCurrency
    ) {
      setSaleFormError(
        `This product is priced in ${productCurrency}. The sale currency must match the product currency.`
      );

      return;
    }

    const quantity =
      toNumber(saleQuantity);

    const unitPrice =
      toNumber(saleUnitPrice);

    if (
      quantity <= 0
    ) {
      setSaleFormError(
        'Sale quantity must be greater than zero.'
      );

      return;
    }

    if (
      !selectedProduct.is_service &&
      quantity !==
        Math.trunc(quantity)
    ) {
      setSaleFormError(
        'Inventory quantity must be a whole number.'
      );

      return;
    }

    if (
      !selectedProduct.is_service &&
      availableStock !== null &&
      quantity >
        availableStock
    ) {
      setSaleFormError(
        `Not enough stock. Only ${formatNumber(
          availableStock
        )} ${
          selectedProduct.unit ||
          'units'
        } are available.`
      );

      return;
    }

    if (unitPrice < 0) {
      setSaleFormError(
        'Unit price cannot be negative.'
      );

      return;
    }

    if (
      !SUPPORTED_CURRENCIES.includes(
        saleCurrency
      )
    ) {
      setSaleFormError(
        'Only NGN and XOF are currently supported.'
      );

      return;
    }

    if (!saleDate) {
      setSaleFormError(
        'Sale date is required.'
      );

      return;
    }

    setRecordingSale(true);

    try {
      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

      if (authError || !user) {
        setSaleFormError(
          authError
            ? 'We could not verify your account.'
            : 'You need to be signed in to record a sale.'
        );

        return;
      }

      const {
        error: rpcError,
      } = await supabase.rpc(
        'record_inventory_sale',
        {
          p_product_id:
            selectedProduct.id,
          p_quantity: quantity,
          p_unit_price: unitPrice,
          p_currency:
            saleCurrency,
          p_sale_date:
            saleDate,
          p_customer_name:
            customerName.trim() ||
            null,
          p_customer_reference:
            customerReference.trim() ||
            null,
          p_notes:
            saleNotes.trim() ||
            null,
        }
      );

      if (rpcError) {
        console.error(
          'Record sale error:',
          rpcError
        );

        setSaleFormError(
          rpcError.message ||
            'We could not record this sale.'
        );

        return;
      }

      setShowRecordSale(false);
      resetSaleForm();

      await loadSales(true);
    } catch (submissionError) {
      console.error(
        'Unexpected record sale error:',
        submissionError
      );

      setSaleFormError(
        'We could not record this sale. Please try again.'
      );
    } finally {
      setRecordingSale(false);
    }
  }

  /*
   * Keep supported currencies separate.
   */
  const supportedSales = useMemo(
    () =>
      sales.filter((sale) =>
        SUPPORTED_CURRENCIES.includes(
          sale.currency
        )
      ),
    [sales]
  );

  /*
   * All calculations on this page now operate
   * on exactly one currency at a time.
   */
  const currencySales = useMemo(
    () =>
      supportedSales.filter(
        (sale) =>
          sale.currency ===
          selectedCurrency
      ),
    [
      supportedSales,
      selectedCurrency,
    ]
  );

  const periodSales = useMemo(() => {
    const { start, end } =
      getPeriodRange(period);

    return currencySales.filter(
      (sale) => {
        const date = parseDate(
          sale.sale_date
        );

        if (!date) {
          return false;
        }

        return (
          date >= start &&
          date <= end
        );
      }
    );
  }, [
    currencySales,
    period,
  ]);

  const completedSales = useMemo(
    () =>
      periodSales.filter(
        isCompletedSale
      ),
    [periodSales]
  );

  const revenue = useMemo(
    () =>
      completedSales.reduce(
        (sum, sale) =>
          sum + sale.total_amount,
        0
      ),
    [completedSales]
  );

  const revenueDisplay = useMemo(
    () =>
      formatCurrency(
        revenue,
        selectedCurrency
      ),
    [
      revenue,
      selectedCurrency,
    ]
  );

  const averageSaleDisplay =
    useMemo(() => {
      const average =
        revenue /
        Math.max(
          completedSales.length,
          1
        );

      return formatCurrency(
        average,
        selectedCurrency
      );
    }, [
      revenue,
      completedSales.length,
      selectedCurrency,
    ]);

  const totalUnits = useMemo(
    () =>
      completedSales.reduce(
        (sum, sale) =>
          sum + sale.quantity,
        0
      ),
    [completedSales]
  );

  const filteredSales = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return periodSales.filter(
      (sale) => {
        const matchesSearch =
          !query ||
          sale.product_name
            .toLowerCase()
            .includes(query) ||
          sale.customer_name
            ?.toLowerCase()
            .includes(query) ||
          sale.customer_reference
            ?.toLowerCase()
            .includes(query) ||
          sale.id
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter ===
            'All statuses' ||
          sale.status.toLowerCase() ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    periodSales,
    search,
    statusFilter,
  ]);

  const productPerformance =
    useMemo(() => {
      const grouped =
        new Map<
          string,
          ProductPerformance
        >();

      completedSales.forEach(
        (sale) => {
          const key =
            sale.product_id ??
            `unlinked-${sale.product_name}`;

          const existing =
            grouped.get(key);

          if (existing) {
            existing.units +=
              sale.quantity;

            existing.revenue +=
              sale.total_amount;
          } else {
            grouped.set(key, {
              id: key,
              name: sale.product_name,
              units: sale.quantity,
              revenue:
                sale.total_amount,
              currency:
                selectedCurrency,
            });
          }
        }
      );

      return Array.from(
        grouped.values()
      )
        .sort(
          (a, b) =>
            b.units - a.units
        )
        .slice(0, 5);
    }, [
      completedSales,
      selectedCurrency,
    ]);

  const dailySales = useMemo(() => {
    const now = new Date();

    const monday = new Date(now);
    const day = monday.getDay();

    const difference =
      day === 0 ? 6 : day - 1;

    monday.setDate(
      monday.getDate() -
        difference
    );

    monday.setHours(
      0,
      0,
      0,
      0
    );

    const days = Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          new Date(monday);

        date.setDate(
          monday.getDate() +
            index
        );

        return {
          key: getDateKey(date),
          day: new Intl.DateTimeFormat(
            'en-NG',
            {
              weekday: 'short',
            }
          ).format(date),
          amount: 0,
          currency:
            selectedCurrency,
        };
      }
    );

    completedSales.forEach(
      (sale) => {
        const day = days.find(
          (item) =>
            item.key ===
            sale.sale_date
        );

        if (!day) {
          return;
        }

        day.amount +=
          sale.total_amount;
      }
    );

    return days;
  }, [
    completedSales,
    selectedCurrency,
  ]);

  const highestDay = Math.max(
    ...dailySales.map(
      (item) => item.amount
    ),
    0
  );

  const statusCounts = useMemo(() => {
    const counts: Record<
      string,
      number
    > = {};

    periodSales.forEach(
      (sale) => {
        const status =
          sale.status
            .charAt(0)
            .toUpperCase() +
          sale.status.slice(1);

        counts[status] =
          (counts[status] ?? 0) + 1;
      }
    );

    return counts;
  }, [periodSales]);

  const completedCount =
    statusCounts.Completed ?? 0;

  const pendingCount =
    statusCounts.Pending ?? 0;

  function refreshSales() {
    setOpenSaleMenu(null);
    setRefreshing(true);

    loadSales(true).finally(() => {
      setRefreshing(false);
    });
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Revenue
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Sales
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Record sales and see what is moving across your business.
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Reporting in{' '}
              <span className="font-semibold text-gray-700">
                {selectedCurrency}
              </span>
              . NGN and XOF sales are kept separate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={refreshSales}
              disabled={
                loading ||
                refreshing
              }
              className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading ||
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh
            </button>

            <div
              className="flex h-11 border border-gray-200 bg-white"
              role="group"
              aria-label="Sales currency"
            >
              {SUPPORTED_CURRENCIES.map(
                (currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() =>
                      setSelectedCurrency(
                        currency
                      )
                    }
                    aria-pressed={
                      selectedCurrency ===
                      currency
                    }
                    className={`min-w-[58px] px-3 text-xs font-semibold transition ${
                      selectedCurrency ===
                      currency
                        ? 'bg-emerald-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {currency}
                  </button>
                )
              )}
            </div>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={period}
                onChange={(event) =>
                  setPeriod(
                    event.target
                      .value as Period
                  )
                }
                className="appearance-none border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none focus:border-emerald-900"
              >
                <option>
                  Today
                </option>

                <option>
                  This week
                </option>

                <option>
                  This month
                </option>

                <option>
                  Last month
                </option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              type="button"
              onClick={
                openSaleForm
              }
              className="inline-flex items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />
              Record sale
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="shrink-0"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Sales summary */}
        <div className="mb-8 grid grid-cols-1 border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Sales revenue"
            value={
              loading
                ? '—'
                : revenueDisplay
            }
            icon={
              <CircleDollarSign
                size={18}
              />
            }
            description={`${period.toLowerCase()} completed ${selectedCurrency} sales`}
          />

          <Metric
            label="Sales"
            value={
              loading
                ? '—'
                : formatNumber(
                    completedCount
                  )
            }
            icon={
              <ShoppingBag size={18} />
            }
            description={`Completed ${selectedCurrency} sales`}
          />

          <Metric
            label="Units sold"
            value={
              loading
                ? '—'
                : formatNumber(
                    totalUnits
                  )
            }
            icon={
              <Package size={18} />
            }
            description="Products moved"
          />

          <Metric
            label="Average sale"
            value={
              loading
                ? '—'
                : averageSaleDisplay
            }
            icon={
              <TrendingUp size={18} />
            }
            description="Average completed sale"
          />
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-6">
            {/* Sales trend */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Sales movement
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Daily completed{' '}
                    {selectedCurrency}{' '}
                    sales for the current week
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Peak day
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(
                      highestDay,
                      selectedCurrency
                    )}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex h-[230px] items-center justify-center text-sm text-gray-500">
                  <Loader2
                    size={17}
                    className="mr-2 animate-spin"
                  />
                  Loading sales...
                </div>
              ) : (
                <div className="flex h-[230px] items-end gap-2 border-b border-gray-200 pb-0 sm:gap-4">
                  {dailySales.map(
                    (item) => {
                      const height =
                        highestDay === 0
                          ? 8
                          : Math.max(
                              8,
                              Math.round(
                                (item.amount /
                                  highestDay) *
                                  100
                              )
                            );

                      return (
                        <div
                          key={
                            item.key
                          }
                          className="flex h-full flex-1 flex-col items-center justify-end"
                        >
                          <div className="mb-2 hidden text-[10px] text-gray-500 sm:block">
                            {item.amount >
                            0
                              ? formatCurrency(
                                  item.amount,
                                  selectedCurrency
                                )
                              : '—'}
                          </div>

                          <div
                            className="w-full max-w-[54px] bg-emerald-900 transition hover:bg-emerald-800"
                            style={{
                              height: `${height}%`,
                            }}
                          />

                          <span className="mt-3 text-[11px] text-gray-500">
                            {
                              item.day
                            }
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>

            {/* Sales ledger */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Recent sales
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {selectedCurrency}{' '}
                      sales recorded for{' '}
                      {period.toLowerCase()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(
                          event
                        ) =>
                          setSearch(
                            event.target
                              .value
                          )
                        }
                        placeholder="Search sales"
                        className="w-full border border-gray-200 bg-[#f8f8f8] py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-emerald-900 sm:w-[220px]"
                      />
                    </div>

                    <select
                      value={
                        statusFilter
                      }
                      onChange={(
                        event
                      ) =>
                        setStatusFilter(
                          event.target
                            .value
                        )
                      }
                      className="border border-gray-200 bg-[#f8f8f8] px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-900"
                    >
                      <option>
                        All statuses
                      </option>

                      <option>
                        Completed
                      </option>

                      <option>
                        Pending
                      </option>

                      <option>
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#fafafa] text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Sale
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Quantity
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
                            <Loader2
                              size={17}
                              className="mr-2 animate-spin"
                            />
                            Loading sales...
                          </div>
                        </td>
                      </tr>
                    ) : filteredSales.length ===
                      0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center bg-gray-50 text-gray-400">
                              <ShoppingBag
                                size={21}
                              />
                            </div>

                            <p className="mt-4 text-sm font-medium text-gray-900">
                              {periodSales.length ===
                              0
                                ? `No ${selectedCurrency} sales recorded`
                                : 'No sales found'}
                            </p>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                              {periodSales.length ===
                              0
                                ? `There are no ${selectedCurrency} sales recorded for ${period.toLowerCase()}.`
                                : 'Try changing your search or status filter.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSales.map(
                        (sale) => (
                          <tr
                            key={
                              sale.id
                            }
                            className="border-b border-gray-100 transition hover:bg-[#fafafa]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <ProductIcon />

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {
                                      sale.product_name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {sale.id.slice(
                                      0,
                                      8
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm text-gray-700">
                                  {sale.customer_name ||
                                    'Walk-in customer'}
                                </p>

                                {sale.customer_reference && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    {
                                      sale.customer_reference
                                    }
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {formatNumber(
                                sale.quantity
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(
                                  sale.total_amount,
                                  sale.currency
                                )}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatCurrency(
                                  sale.unit_price,
                                  sale.currency
                                )}{' '}
                                / unit
                              </p>
                            </td>

                            <td className="px-4 py-4">
                              <p className="text-sm text-gray-500">
                                {formatSaleDate(
                                  sale.sale_date
                                )}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatSaleTime(
                                  sale
                                )}
                              </p>
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge
                                status={
                                  sale.status
                                }
                              />
                            </td>

                            <td className="relative px-4 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenSaleMenu(
                                    (
                                      current
                                    ) =>
                                      current ===
                                      sale.id
                                        ? null
                                        : sale.id
                                  )
                                }
                                className="p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                              >
                                <MoreHorizontal
                                  size={18}
                                />
                              </button>

                              {openSaleMenu ===
                                sale.id && (
                                <div className="absolute right-3 top-12 z-20 w-44 border border-gray-200 bg-white py-1 shadow-lg">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenSaleMenu(
                                        null
                                      );
                                      setError(
                                        'Sale details are shown in the sales record.'
                                      );
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                                  >
                                    View sale
                                  </button>

                                  {sale.transaction_id && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenSaleMenu(
                                          null
                                        );
                                        setError(
                                          'Transaction details are available from the Transactions page.'
                                        );
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                                    >
                                      View transaction
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
                    <Loader2
                      size={17}
                      className="mr-2 animate-spin"
                    />
                    Loading sales...
                  </div>
                ) : filteredSales.length ===
                  0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                    <ShoppingBag
                      size={28}
                      className="text-gray-300"
                    />

                    <p className="mt-4 text-sm font-medium text-gray-900">
                      {periodSales.length ===
                      0
                        ? `No ${selectedCurrency} sales recorded`
                        : 'No sales found'}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      {periodSales.length ===
                      0
                        ? `There are no ${selectedCurrency} sales recorded for ${period.toLowerCase()}.`
                        : 'Try changing your search or status filter.'}
                    </p>
                  </div>
                ) : (
                  filteredSales.map(
                    (sale) => (
                      <div
                        key={sale.id}
                        className="border-b border-gray-200 p-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <ProductIcon />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {
                                  sale.product_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {sale.id.slice(
                                  0,
                                  8
                                )}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              sale.total_amount,
                              sale.currency
                            )}
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Customer
                            </p>

                            <p className="mt-1 truncate text-sm text-gray-800">
                              {sale.customer_name ||
                                'Walk-in customer'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Quantity
                            </p>

                            <p className="mt-1 text-sm text-gray-800">
                              {formatNumber(
                                sale.quantity
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Sale date
                            </p>

                            <p className="mt-1 text-sm text-gray-800">
                              {formatSaleDate(
                                sale.sale_date
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Status
                            </p>

                            <div className="mt-1">
                              <StatusBadge
                                status={
                                  sale.status
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              <div className="border-t border-gray-200 px-5 py-4">
                <p className="text-xs text-gray-500">
                  Showing{' '}
                  {filteredSales.length} of{' '}
                  {periodSales.length}{' '}
                  {selectedCurrency}{' '}
                  sales
                </p>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Sales status */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900">
                  Sales status
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedCurrency} sales by status
                </p>
              </div>

              <div className="space-y-4">
                <StatusSummary
                  label="Completed"
                  count={
                    completedCount
                  }
                  total={
                    periodSales.length
                  }
                  className="text-emerald-700"
                />

                <StatusSummary
                  label="Pending"
                  count={
                    pendingCount
                  }
                  total={
                    periodSales.length
                  }
                  className="text-amber-700"
                />

                <StatusSummary
                  label="Other"
                  count={Math.max(
                    periodSales.length -
                      completedCount -
                      pendingCount,
                    0
                  )}
                  total={
                    periodSales.length
                  }
                  className="text-gray-600"
                />
              </div>
            </section>

            {/* Top products */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900">
                  Best-selling products
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Based on units sold in{' '}
                  {selectedCurrency}
                </p>
              </div>

              {productPerformance.length ===
              0 ? (
                <div className="py-6 text-center">
                  <Package
                    size={22}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-xs text-gray-500">
                    No {selectedCurrency}{' '}
                    product sales yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productPerformance.map(
                    (
                      product,
                      index
                    ) => (
                      <div
                        key={
                          product.id
                        }
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-200 text-xs font-semibold text-gray-500">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {formatNumber(
                              product.units
                            )}{' '}
                            units
                          </p>
                        </div>

                        <p className="text-xs font-medium text-gray-700">
                          {formatCurrency(
                            product.revenue,
                            product.currency
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Insight */}
            <section className="border border-emerald-900 bg-emerald-900 p-5 text-white">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={17} />

                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Monietar Insight
                </span>
              </div>

              {periodSales.length ===
              0 ? (
                <p className="text-sm leading-6 text-emerald-50">
                  Once you start recording{' '}
                  {selectedCurrency} sales, Monietar will use them to give you a clearer view of what is moving and how sales contribute to your cash flow.
                </p>
              ) : completedCount ===
                0 ? (
                <p className="text-sm leading-6 text-emerald-50">
                  You have{' '}
                  <span className="font-medium text-white">
                    {periodSales.length}{' '}
                    recorded{' '}
                    {selectedCurrency}{' '}
                    {periodSales.length ===
                    1
                      ? 'sale'
                      : 'sales'}
                  </span>{' '}
                  for this period, but none are marked as completed yet.
                </p>
              ) : (
                <p className="text-sm leading-6 text-emerald-50">
                  You recorded{' '}
                  <span className="font-medium text-white">
                    {formatNumber(
                      completedCount
                    )}{' '}
                    completed{' '}
                    {completedCount ===
                    1
                      ? 'sale'
                      : 'sales'}
                  </span>{' '}
                  with{' '}
                  <span className="font-medium text-white">
                    {formatNumber(
                      totalUnits
                    )}{' '}
                    units
                  </span>{' '}
                  moved during this period.
                </p>
              )}

              <p className="mt-3 text-xs leading-5 text-emerald-200">
                Insights are based on the sales information you've recorded.
              </p>
            </section>

            {/* Quick actions */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4">
                <p className="text-sm font-semibold text-gray-900">
                  Quick actions
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  type="button"
                  onClick={
                    openSaleForm
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>
                    Record a sale
                  </span>

                  <Plus
                    size={16}
                    className="text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      'Transaction details are available from the Transactions page.'
                    )
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>
                    View transactions
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      'Inventory details are available from the Inventory page.'
                    )
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>
                    View inventory
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="text-gray-400"
                  />
                </button>
              </div>
            </section>

            {/* Data connection */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-gray-200 bg-gray-50 text-emerald-900">
                  <Clock3 size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Live sales data
                  </p>

                  <p className="text-xs text-gray-500">
                    Connected to your account
                  </p>
                </div>
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Sales shown here come directly from your Monietar sales records and are filtered to your account and selected currency.
              </p>
            </section>
          </aside>
        </div>

        {/* Bottom note */}
        <div className="mt-6 border-t border-gray-200 pt-5">
          <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Sales are linked directly to your account.
            </p>

            <p className="text-gray-400">
              Revenue is calculated from completed{' '}
              {selectedCurrency} sales only.
            </p>
          </div>
        </div>
      </div>

      {/* Record Sale Modal */}
      {showRecordSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Record a sale
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Record a sale from your inventory.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeSaleForm
                }
                disabled={
                  recordingSale
                }
                className="p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmitSale
              }
            >
              <div className="space-y-5 p-5 sm:p-6">
                {saleFormError && (
                  <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {
                        saleFormError
                      }
                    </span>
                  </div>
                )}

                {products.length ===
                0 ? (
                  <div className="border border-amber-200 bg-amber-50 px-4 py-4">
                    <p className="text-sm font-medium text-amber-900">
                      No supported products are available in your inventory.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Add an active product priced in NGN or XOF before recording a sale.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Product */}
                    <div>
                      <label
                        htmlFor="sale-product"
                        className="mb-2 block text-xs font-medium text-gray-700"
                      >
                        Product
                      </label>

                      <div className="relative">
                        <select
                          id="sale-product"
                          value={
                            selectedProductId
                          }
                          onChange={(
                            event
                          ) =>
                            handleProductChange(
                              event
                                .target
                                .value
                            )
                          }
                          disabled={
                            recordingSale
                          }
                          className="w-full appearance-none border border-gray-200 bg-white px-3 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-50"
                        >
                          <option value="">
                            Select a product
                          </option>

                          {products.map(
                            (
                              product
                            ) => (
                              <option
                                key={
                                  product.id
                                }
                                value={
                                  product.id
                                }
                              >
                                {product.name}
                                {product.sku
                                  ? ` · ${product.sku}`
                                  : ''}{' '}
                                ·{' '}
                                {product.currency}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                      </div>

                      {selectedProduct && (
                        <div className="mt-3 border border-gray-200 bg-gray-50 px-4 py-3">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Available
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {selectedProduct.is_service
                                  ? 'Service'
                                  : `${formatNumber(
                                      availableStock ??
                                        0
                                    )} ${
                                      selectedProduct.unit ||
                                      'units'
                                    }`}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Inventory price
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {formatCurrency(
                                  toNumber(
                                    selectedProduct.selling_price
                                  ),
                                  selectedProduct.currency ??
                                    'NGN'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity + Unit price */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="sale-quantity"
                          className="mb-2 block text-xs font-medium text-gray-700"
                        >
                          Quantity
                        </label>

                        <input
                          id="sale-quantity"
                          type="number"
                          min="0"
                          step={
                            selectedProduct?.is_service
                              ? '0.01'
                              : '1'
                          }
                          value={
                            saleQuantity
                          }
                          onChange={(
                            event
                          ) =>
                            setSaleQuantity(
                              event
                                .target
                                .value
                            )
                          }
                          disabled={
                            recordingSale
                          }
                          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="sale-unit-price"
                          className="mb-2 block text-xs font-medium text-gray-700"
                        >
                          Unit price
                        </label>

                        <div className="flex border border-gray-200 bg-gray-50">
                          <select
                            value={
                              saleCurrency
                            }
                            onChange={(
                              event
                            ) =>
                              setSaleCurrency(
                                event
                                  .target
                                  .value as Currency
                              )
                            }
                            disabled={
                              recordingSale ||
                              !selectedProduct
                            }
                            className="border-r border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-500 outline-none disabled:cursor-not-allowed"
                          >
                            {SUPPORTED_CURRENCIES.map(
                              (
                                currency
                              ) => (
                                <option
                                  key={
                                    currency
                                  }
                                  value={
                                    currency
                                  }
                                >
                                  {
                                    currency
                                  }
                                </option>
                              )
                            )}
                          </select>

                          <input
                            id="sale-unit-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              saleUnitPrice
                            }
                            onChange={(
                              event
                            ) =>
                              setSaleUnitPrice(
                                event
                                  .target
                                  .value
                              )
                            }
                            disabled={
                              recordingSale
                            }
                            className="min-w-0 flex-1 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
                            placeholder="0"
                          />
                        </div>

                        {selectedProduct && (
                          <p className="mt-1.5 text-[11px] text-gray-400">
                            Currency follows the product price.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border border-gray-200 bg-gray-50 px-4 py-3">
                      <span className="text-xs text-gray-500">
                        Sale total
                      </span>

                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          saleTotal,
                          saleCurrency
                        )}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="customer-name"
                          className="mb-2 block text-xs font-medium text-gray-700"
                        >
                          Customer
                        </label>

                        <input
                          id="customer-name"
                          type="text"
                          value={
                            customerName
                          }
                          onChange={(
                            event
                          ) =>
                            setCustomerName(
                              event
                                .target
                                .value
                            )
                          }
                          disabled={
                            recordingSale
                          }
                          placeholder="Walk-in customer"
                          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="customer-reference"
                          className="mb-2 block text-xs font-medium text-gray-700"
                        >
                          Reference
                        </label>

                        <input
                          id="customer-reference"
                          type="text"
                          value={
                            customerReference
                          }
                          onChange={(
                            event
                          ) =>
                            setCustomerReference(
                              event
                                .target
                                .value
                            )
                          }
                          disabled={
                            recordingSale
                          }
                          placeholder="Optional"
                          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label
                        htmlFor="sale-date"
                        className="mb-2 block text-xs font-medium text-gray-700"
                      >
                        Sale date
                      </label>

                      <input
                        id="sale-date"
                        type="date"
                        value={
                          saleDate
                        }
                        onChange={(
                          event
                        ) =>
                          setSaleDate(
                            event
                              .target
                              .value
                          )
                        }
                        disabled={
                          recordingSale
                        }
                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label
                        htmlFor="sale-notes"
                        className="mb-2 block text-xs font-medium text-gray-700"
                      >
                        Notes
                      </label>

                      <textarea
                        id="sale-notes"
                        value={
                          saleNotes
                        }
                        onChange={(
                          event
                        ) =>
                          setSaleNotes(
                            event
                              .target
                              .value
                          )
                        }
                        disabled={
                          recordingSale
                        }
                        rows={3}
                        placeholder="Optional sale notes"
                        className="w-full resize-none border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={
                    closeSaleForm
                  }
                  disabled={
                    recordingSale
                  }
                  className="border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    recordingSale ||
                    products.length ===
                      0 ||
                    !selectedProduct
                  }
                  className="inline-flex items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {recordingSale && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {recordingSale
                    ? 'Recording...'
                    : 'Record sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusSummary({
  label,
  count,
  total,
  className,
}: {
  label: string;
  count: number;
  total: number;
  className: string;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (count / total) * 100
        );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {label}
        </span>

        <span
          className={`text-xs font-semibold ${className}`}
        >
          {percentage}%
        </span>
      </div>

      <div className="mb-2 h-1.5 bg-gray-100">
        <div
          className="h-full bg-emerald-900"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="text-xs font-medium text-gray-700">
        {formatNumber(count)}{' '}
        {count === 1
          ? 'sale'
          : 'sales'}
      </p>
    </div>
  );
}
