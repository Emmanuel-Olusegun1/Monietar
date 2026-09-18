'use client';

import {
  AlertCircle,
  ArrowUp,
  Boxes,
  CheckCircle2,
  CircleAlert,
  DollarSign,
  Layers3,
  Loader2,
  Lock,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import { createClient } from '@/lib/supabase/client';

type Currency = 'NGN' | 'XOF';

type ProductStatus =
  | 'Healthy'
  | 'Low stock'
  | 'Out of stock'
  | 'Service';

type InventoryFilter =
  | 'all'
  | 'healthy'
  | 'low'
  | 'out'
  | 'services';

interface ProductCategory {
  id: string;
  name: string;
}

interface Product {
  id: string;
  user_id: string;
  category_id: string | null;
  category_name: string;
  sku: string | null;
  barcode: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  unit: string | null;
  cost_price: number;
  selling_price: number;
  currency: string;
  minimum_stock: number;
  reorder_level: number;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  is_service: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductForm {
  name: string;
  sku: string;
  barcode: string;
  category_id: string;
  description: string;
  unit: string;
  cost_price: string;
  selling_price: string;
  currency: Currency;
  minimum_stock: string;
  reorder_level: string;
  current_stock: string;
  is_service: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  sku: '',
  barcode: '',
  category_id: '',
  description: '',
  unit: 'pcs',
  cost_price: '',
  selling_price: '',
  currency: 'NGN',
  minimum_stock: '',
  reorder_level: '',
  current_stock: '',
  is_service: false,
};

function formatMoney(amount: number, currency = 'NGN') {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

function formatNumber(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(amount);
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getAvailableStock(product: Product) {
  return toNumber(
    product.available_stock ??
      product.current_stock - product.reserved_stock
  );
}

function getProductStatus(product: Product): ProductStatus {
  if (product.is_service) {
    return 'Service';
  }

  const availableStock = getAvailableStock(product);

  if (availableStock <= 0) {
    return 'Out of stock';
  }

  const threshold = Math.max(
    toNumber(product.reorder_level),
    toNumber(product.minimum_stock)
  );

  if (threshold > 0 && availableStock <= threshold) {
    return 'Low stock';
  }

  return 'Healthy';
}

function getStockValue(product: Product) {
  if (product.is_service) {
    return 0;
  }

  return getAvailableStock(product) * toNumber(product.cost_price);
}

function getStatusClasses(status: ProductStatus) {
  switch (status) {
    case 'Out of stock':
      return 'border-red-200 bg-red-50 text-red-700';

    case 'Low stock':
      return 'border-amber-200 bg-amber-50 text-amber-700';

    case 'Service':
      return 'border-blue-200 bg-blue-50 text-blue-700';

    default:
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
}

function ProductImage({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  if (product.image_url) {
    return (
      <div
        className={`shrink-0 overflow-hidden border border-gray-200 bg-gray-50 ${
          large ? 'h-14 w-14' : 'h-11 w-11'
        }`}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-gray-200 bg-gray-50 text-emerald-900 ${
        large ? 'h-14 w-14' : 'h-11 w-11'
      }`}
    >
      <Package
        size={large ? 20 : 17}
        strokeWidth={1.6}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  locked = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Package;
  locked?: boolean;
}) {
  return (
    <div className="border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
          <Icon
            size={18}
            strokeWidth={1.7}
            className="text-emerald-900"
          />
        </div>

        {locked && (
          <span className="inline-flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-gray-500">
            <Lock size={10} />
            Upgrade
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  return (
    <span
      className={`inline-flex border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default function InventoryPage() {
  /*
   * Keep one Supabase client instance for the lifetime
   * of this page.
   *
   * This prevents loadData from being recreated on every
   * render and makes the visibility refresh reliable.
   */
  const [supabase] = useState(() => createClient());

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState('all');
  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [showAddProduct, setShowAddProduct] =
    useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    null
  );

  const [productForm, setProductForm] =
    useState<ProductForm>(EMPTY_FORM);

  const [openProductMenu, setOpenProductMenu] =
    useState<string | null>(null);

  /*
   * showLoader = true
   *   Used for the initial page load.
   *
   * showLoader = false
   *   Used when returning from Sales or manually refreshing.
   *
   * This allows the inventory numbers to update without
   * replacing the entire table with the loading state.
   */
  const loadData = useCallback(
    async (showLoader = true) => {
      setError(null);

      if (showLoader) {
        setLoading(true);
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error(
          'Inventory authentication error:',
          authError
        );

        setError(
          authError
            ? 'We could not verify your account.'
            : 'You need to be signed in to view your inventory.'
        );

        setLoading(false);
        return;
      }

      const [productsResult, categoriesResult] =
        await Promise.all([
          supabase
            .from('products')
            .select(`
              id,
              user_id,
              category_id,
              sku,
              barcode,
              name,
              description,
              image_url,
              unit,
              cost_price,
              selling_price,
              currency,
              minimum_stock,
              reorder_level,
              current_stock,
              reserved_stock,
              available_stock,
              is_service,
              is_active,
              created_at,
              updated_at,
              product_categories (
                id,
                name
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', {
              ascending: false,
            }),

          supabase
            .from('product_categories')
            .select('id, name')
            .order('name', {
              ascending: true,
            }),
        ]);

      if (productsResult.error) {
        console.error(
          'Inventory products query error:',
          productsResult.error
        );
      }

      if (categoriesResult.error) {
        console.error(
          'Inventory categories query error:',
          categoriesResult.error
        );
      }

      if (
        productsResult.error ||
        categoriesResult.error
      ) {
        setError(
          productsResult.error
            ? `We could not load your products. ${
                productsResult.error.message || ''
              }`.trim()
            : 'We could not load your product categories.'
        );

        setLoading(false);
        return;
      }

      const normalizedProducts: Product[] = (
        productsResult.data ?? []
      ).map((product: any) => {
        const categoryRelation = Array.isArray(
          product.product_categories
        )
          ? product.product_categories[0]
          : product.product_categories;

        const currentStock = toNumber(
          product.current_stock
        );

        const reservedStock = toNumber(
          product.reserved_stock
        );

        /*
         * available_stock comes directly from Supabase.
         *
         * This is important because after a sale,
         * current_stock is reduced in the database and
         * the generated available_stock column reflects
         * that new value.
         */
        const availableStock = toNumber(
          product.available_stock ??
            currentStock - reservedStock
        );

        return {
          id: product.id,
          user_id: product.user_id,
          category_id: product.category_id ?? null,
          category_name:
            categoryRelation?.name ??
            'Uncategorized',
          sku: product.sku ?? null,
          barcode: product.barcode ?? null,
          name: product.name,
          description: product.description ?? null,
          image_url: product.image_url ?? null,
          unit: product.unit ?? 'pcs',
          cost_price: toNumber(
            product.cost_price
          ),
          selling_price: toNumber(
            product.selling_price
          ),
          currency: product.currency ?? 'NGN',
          minimum_stock: toNumber(
            product.minimum_stock
          ),
          reorder_level: toNumber(
            product.reorder_level
          ),
          current_stock: currentStock,
          reserved_stock: reservedStock,
          available_stock: availableStock,
          is_service: Boolean(product.is_service),
          is_active: product.is_active !== false,
          created_at: product.created_at,
          updated_at: product.updated_at,
        };
      });

      /*
       * This replaces the old product state with the
       * latest database state.
       *
       * Therefore, if Sales reduced 20 -> 17,
       * the Inventory page becomes 17 here.
       */
      setProducts(normalizedProducts);

      setCategories(
        (categoriesResult.data ?? []) as ProductCategory[]
      );

      setLoading(false);
    },
    [supabase]
  );

  /*
   * Initial load + automatic refresh when returning
   * to the Inventory page.
   *
   * Example:
   *
   * Inventory: 20 units
   *       ↓
   * Go to Sales
   *       ↓
   * Record sale of 3
   *       ↓
   * Database: 17 units
   *       ↓
   * Return to Inventory
   *       ↓
   * visibilitychange fires
   *       ↓
   * loadData(false)
   *       ↓
   * Inventory: 17 units
   */
  useEffect(() => {
    loadData(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData(false);
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [loadData]);

  const totalProducts = useMemo(
    () =>
      products.filter(
        (product) => product.is_active
      ).length,
    [products]
  );

  const totalUnits = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.is_active &&
            !product.is_service
        )
        .reduce(
          (total, product) =>
            total +
            Math.max(
              getAvailableStock(product),
              0
            ),
          0
        ),
    [products]
  );

  const lowStock = useMemo(
    () =>
      products.filter(
        (product) =>
          product.is_active &&
          getProductStatus(product) ===
            'Low stock'
      ).length,
    [products]
  );

  const outOfStock = useMemo(
    () =>
      products.filter(
        (product) =>
          product.is_active &&
          getProductStatus(product) ===
            'Out of stock'
      ).length,
    [products]
  );

  const stockValueByCurrency = useMemo(() => {
    const totals: Record<string, number> = {};

    products
      .filter(
        (product) =>
          product.is_active &&
          !product.is_service
      )
      .forEach((product) => {
        const currency =
          product.currency || 'NGN';

        totals[currency] =
          (totals[currency] ?? 0) +
          getStockValue(product);
      });

    return totals;
  }, [products]);

  const stockValueDisplay = useMemo(() => {
    const entries = Object.entries(
      stockValueByCurrency
    );

    if (entries.length === 0) {
      return '₦0';
    }

    if (entries.length === 1) {
      const [currency, value] = entries[0];

      return formatMoney(value, currency);
    }

    return 'Multiple currencies';
  }, [stockValueByCurrency]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      if (!product.is_active) {
        return false;
      }

      const matchesSearch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.sku
          ?.toLowerCase()
          .includes(query) ||
        product.barcode
          ?.toLowerCase()
          .includes(query) ||
        product.category_name
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === 'all' ||
        product.category_id ===
          categoryFilter;

      const status =
        getProductStatus(product);

      let matchesInventory = true;

      switch (inventoryFilter) {
        case 'healthy':
          matchesInventory =
            status === 'Healthy';
          break;

        case 'low':
          matchesInventory =
            status === 'Low stock';
          break;

        case 'out':
          matchesInventory =
            status === 'Out of stock';
          break;

        case 'services':
          matchesInventory =
            status === 'Service';
          break;

        default:
          matchesInventory = true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesInventory
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    inventoryFilter,
  ]);

  const attentionProducts = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.is_active &&
            !product.is_service &&
            (getProductStatus(product) ===
              'Low stock' ||
              getProductStatus(product) ===
                'Out of stock')
        )
        .sort((a, b) => {
          const aStatus =
            getProductStatus(a);
          const bStatus =
            getProductStatus(b);

          if (
            aStatus === 'Out of stock' &&
            bStatus !== 'Out of stock'
          ) {
            return -1;
          }

          if (
            aStatus !== 'Out of stock' &&
            bStatus === 'Out of stock'
          ) {
            return 1;
          }

          return (
            getAvailableStock(a) -
            getAvailableStock(b)
          );
        })
        .slice(0, 5),
    [products]
  );

  function resetProductForm() {
    setProductForm({
      ...EMPTY_FORM,
    });
    setFormError(null);
  }

  function openAddProduct() {
    setError(null);
    resetProductForm();
    setShowAddProduct(true);
  }

  function updateProductForm(
    field: keyof ProductForm,
    value: string | boolean
  ) {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateProduct(
    event?: FormEvent
  ) {
    event?.preventDefault();

    const name =
      productForm.name.trim();

    if (!name) {
      setFormError(
        'Enter a product name.'
      );
      return;
    }

    const costPrice = Number(
      productForm.cost_price || 0
    );

    const sellingPrice = Number(
      productForm.selling_price || 0
    );

    const currentStock =
      Number(
        productForm.current_stock || 0
      );

    const minimumStock =
      Number(
        productForm.minimum_stock || 0
      );

    const reorderLevel =
      Number(
        productForm.reorder_level || 0
      );

    if (
      !Number.isFinite(costPrice) ||
      costPrice < 0 ||
      !Number.isFinite(sellingPrice) ||
      sellingPrice < 0
    ) {
      setFormError(
        'Enter valid product prices.'
      );
      return;
    }

    if (
      !Number.isFinite(currentStock) ||
      currentStock < 0 ||
      !Number.isFinite(minimumStock) ||
      minimumStock < 0 ||
      !Number.isFinite(reorderLevel) ||
      reorderLevel < 0
    ) {
      setFormError(
        'Enter valid stock values.'
      );
      return;
    }

    setSavingProduct(true);
    setFormError(null);
    setError(null);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setFormError(
        authError
          ? 'We could not verify your account.'
          : 'You need to be signed in to add a product.'
      );

      setSavingProduct(false);
      return;
    }

    const { data, error: productError } =
      await supabase
        .from('products')
        .insert({
          user_id: user.id,
          category_id:
            productForm.category_id ||
            null,
          sku:
            productForm.sku.trim() ||
            null,
          barcode:
            productForm.barcode.trim() ||
            null,
          name,
          description:
            productForm.description.trim() ||
            null,
          unit:
            productForm.unit.trim() ||
            'pcs',
          cost_price: costPrice,
          selling_price: sellingPrice,
          currency:
            productForm.currency,
          minimum_stock: Math.round(
            minimumStock
          ),
          reorder_level: Math.round(
            reorderLevel
          ),
          current_stock:
            productForm.is_service
              ? 0
              : Math.round(currentStock),
          reserved_stock: 0,
          is_service:
            productForm.is_service,
          is_active: true,
        })
        .select(`
          id,
          user_id,
          category_id,
          sku,
          barcode,
          name,
          description,
          image_url,
          unit,
          cost_price,
          selling_price,
          currency,
          minimum_stock,
          reorder_level,
          current_stock,
          reserved_stock,
          available_stock,
          is_service,
          is_active,
          created_at,
          updated_at,
          product_categories (
            id,
            name
          )
        `)
        .single();

    if (productError || !data) {
      console.error(
        'Product creation error:',
        productError
      );

      setFormError(
        productError?.message
          ? `We could not add this product. ${productError.message}`
          : 'We could not add this product.'
      );

      setSavingProduct(false);
      return;
    }

    const categoryRelation =
      Array.isArray(
        data.product_categories
      )
        ? data.product_categories[0]
        : data.product_categories;

    const currentStockValue =
      toNumber(data.current_stock);

    const reservedStockValue =
      toNumber(data.reserved_stock);

    const newProduct: Product = {
      id: data.id,
      user_id: data.user_id,
      category_id:
        data.category_id ?? null,
      category_name:
        categoryRelation?.name ??
        'Uncategorized',
      sku: data.sku ?? null,
      barcode: data.barcode ?? null,
      name: data.name,
      description:
        data.description ?? null,
      image_url:
        data.image_url ?? null,
      unit: data.unit ?? 'pcs',
      cost_price:
        toNumber(data.cost_price),
      selling_price:
        toNumber(data.selling_price),
      currency:
        data.currency ?? 'NGN',
      minimum_stock:
        toNumber(data.minimum_stock),
      reorder_level:
        toNumber(data.reorder_level),
      current_stock:
        currentStockValue,
      reserved_stock:
        reservedStockValue,
      available_stock: toNumber(
        data.available_stock ??
          currentStockValue -
            reservedStockValue
      ),
      is_service:
        Boolean(data.is_service),
      is_active:
        data.is_active !== false,
      created_at:
        data.created_at,
      updated_at:
        data.updated_at,
    };

    setProducts((current) => [
      newProduct,
      ...current,
    ]);

    setShowAddProduct(false);
    resetProductForm();
    setSavingProduct(false);
  }

  async function refreshInventory() {
    setOpenProductMenu(null);
    setRefreshing(true);

    try {
      await loadData(false);
    } finally {
      setRefreshing(false);
    }
  }

  function handleLockedAction(
    message: string
  ) {
    setError(message);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-emerald-900">
              <Boxes size={14} />
              Business
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Inventory
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your products, prices and stock
              in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={refreshInventory}
              disabled={
                loading || refreshing
              }
              className="flex h-11 items-center justify-center gap-2 border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading || refreshing
                    ? 'animate-spin'
                    : ''
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                handleLockedAction(
                  'Stock adjustment is available on the Growing Merchant plan.'
                )
              }
              className="flex h-11 items-center justify-center gap-2 border border-gray-300 bg-white px-4 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              <Lock size={15} />
              Stock adjustment
              <span className="text-[10px] uppercase tracking-[0.06em]">
                Upgrade
              </span>
            </button>

            <button
              type="button"
              onClick={openAddProduct}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Plus size={17} />
              Add product
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

        {/* Metrics */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Products"
            value={
              loading
                ? '—'
                : String(totalProducts)
            }
            detail="Active products in your catalogue"
            icon={Package}
          />

          <MetricCard
            label="Units in stock"
            value={
              loading
                ? '—'
                : formatNumber(totalUnits)
            }
            detail="Current available physical stock"
            icon={Boxes}
          />

          <MetricCard
            label="Stock value"
            value={
              loading
                ? '—'
                : stockValueDisplay
            }
            detail="Based on recorded cost prices"
            icon={DollarSign}
            locked
          />

          <MetricCard
            label="Low stock"
            value={
              loading
                ? '—'
                : String(lowStock)
            }
            detail="Based on your recorded stock levels"
            icon={CircleAlert}
            locked
          />
        </section>

        {/* Main Layout */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <section className="border border-gray-200 bg-white">
              {/* Toolbar */}
              <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search products..."
                    className="h-11 w-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-900"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="h-11 border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-900"
                >
                  <option value="all">
                    All categories
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(
                      (current) =>
                        !current
                    )
                  }
                  className={`flex h-11 items-center justify-center gap-2 border px-4 text-sm font-medium transition-colors ${
                    showFilters ||
                    inventoryFilter !==
                      'all'
                      ? 'border-emerald-900 bg-emerald-900 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal
                    size={16}
                  />
                  Filters
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
                  {(
                    [
                      [
                        'all',
                        'All products',
                      ],
                      [
                        'healthy',
                        'Healthy',
                      ],
                      [
                        'low',
                        'Low stock',
                      ],
                      [
                        'out',
                        'Out of stock',
                      ],
                      [
                        'services',
                        'Services',
                      ],
                    ] as const
                  ).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setInventoryFilter(
                            value
                          )
                        }
                        className={`border px-3 py-2 text-xs font-medium transition-colors ${
                          inventoryFilter ===
                          value
                            ? 'border-emerald-900 bg-emerald-900 text-white'
                            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                        Product
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                        In stock
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                        Reorder
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                        Stock value
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                        Status
                      </th>

                      <th className="w-12 px-3 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex min-h-[320px] items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                              Loading inventory...
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredProducts.length ===
                      0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center bg-gray-50 text-gray-400">
                              <Package
                                size={20}
                                strokeWidth={
                                  1.7
                                }
                              />
                            </div>

                            <p className="mt-4 text-sm font-medium text-gray-900">
                              {products.length ===
                              0
                                ? 'No products yet'
                                : 'No products found'}
                            </p>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                              {products.length ===
                              0
                                ? 'Add your first product to start building your catalogue.'
                                : 'Try changing your search or filters.'}
                            </p>

                            {products.length ===
                              0 && (
                              <button
                                type="button"
                                onClick={
                                  openAddProduct
                                }
                                className="mt-5 flex h-10 items-center gap-2 bg-emerald-900 px-4 text-sm font-medium text-white hover:bg-emerald-800"
                              >
                                <Plus
                                  size={15}
                                />
                                Add product
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(
                        (product) => {
                          const status =
                            getProductStatus(
                              product
                            );

                          const availableStock =
                            getAvailableStock(
                              product
                            );

                          return (
                            <tr
                              key={
                                product.id
                              }
                              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <ProductImage
                                    product={
                                      product
                                    }
                                  />

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                      {
                                        product.name
                                      }
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                      <span>
                                        {
                                          product.category_name
                                        }
                                      </span>

                                      {product.sku && (
                                        <>
                                          <span>
                                            •
                                          </span>

                                          <span>
                                            SKU{' '}
                                            {
                                              product.sku
                                            }
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {formatMoney(
                                    product.selling_price,
                                    product.currency
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  per{' '}
                                  {product.unit ||
                                    'unit'}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                {product.is_service ? (
                                  <span className="text-sm text-gray-500">
                                    Service
                                  </span>
                                ) : (
                                  <>
                                    <p className="text-sm font-medium text-gray-900">
                                      {formatNumber(
                                        availableStock
                                      )}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                      {product.unit ||
                                        'units'}
                                    </p>
                                  </>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {product.is_service ? (
                                  <span className="text-xs text-gray-400">
                                    —
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-700">
                                    {product.reorder_level >
                                    0
                                      ? formatNumber(
                                          product.reorder_level
                                        )
                                      : 'Not set'}
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {product.is_service ? (
                                  <span className="text-xs text-gray-400">
                                    —
                                  </span>
                                ) : (
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatMoney(
                                      getStockValue(
                                        product
                                      ),
                                      product.currency
                                    )}
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <StatusBadge
                                  status={
                                    status
                                  }
                                />
                              </td>

                              <td className="relative px-3 py-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenProductMenu(
                                      (
                                        current
                                      ) =>
                                        current ===
                                        product.id
                                          ? null
                                          : product.id
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                  aria-label={`Actions for ${product.name}`}
                                >
                                  <MoreHorizontal
                                    size={17}
                                  />
                                </button>

                                {openProductMenu ===
                                  product.id && (
                                  <div className="absolute right-3 top-12 z-20 w-48 border border-gray-200 bg-white py-1 shadow-lg">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleLockedAction(
                                          'Product editing is not available yet.'
                                        )
                                      }
                                      className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                                    >
                                      Edit product
                                    </button>

                                    {!product.is_service && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleLockedAction(
                                              'Stock adjustment is available on the Growing Merchant plan.'
                                            )
                                          }
                                          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                                        >
                                          <span>
                                            Adjust
                                            stock
                                          </span>

                                          <span className="text-[9px] uppercase tracking-[0.06em] text-gray-400">
                                            Upgrade
                                          </span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleLockedAction(
                                              'Adding stock is available on the Growing Merchant plan.'
                                            )
                                          }
                                          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                                        >
                                          <span>
                                            Add
                                            stock
                                          </span>

                                          <span className="text-[9px] uppercase tracking-[0.06em] text-gray-400">
                                            Upgrade
                                          </span>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {loading ? (
                  <div className="flex min-h-[320px] items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Loading inventory...
                    </div>
                  </div>
                ) : filteredProducts.length ===
                  0 ? (
                  <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center bg-gray-50 text-gray-400">
                      <Package
                        size={20}
                        strokeWidth={1.7}
                      />
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-900">
                      {products.length ===
                      0
                        ? 'No products yet'
                        : 'No products found'}
                    </p>

                    <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
                      {products.length ===
                      0
                        ? 'Add your first product to start building your catalogue.'
                        : 'Try changing your search or filters.'}
                    </p>

                    {products.length ===
                      0 && (
                      <button
                        type="button"
                        onClick={
                          openAddProduct
                        }
                        className="mt-5 flex h-10 items-center gap-2 bg-emerald-900 px-4 text-sm font-medium text-white hover:bg-emerald-800"
                      >
                        <Plus size={15} />
                        Add product
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredProducts.map(
                      (product) => {
                        const status =
                          getProductStatus(
                            product
                          );

                        const availableStock =
                          getAvailableStock(
                            product
                          );

                        return (
                          <div
                            key={
                              product.id
                            }
                            className="p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <ProductImage
                                  product={
                                    product
                                  }
                                  large
                                />

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {
                                      product.name
                                    }
                                  </p>

                                  <p className="mt-1 truncate text-xs text-gray-400">
                                    {
                                      product.category_name
                                    }
                                  </p>
                                </div>
                              </div>

                              <StatusBadge
                                status={
                                  status
                                }
                              />
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-400">
                                  Selling price
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {formatMoney(
                                    product.selling_price,
                                    product.currency
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">
                                  Stock
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {product.is_service
                                    ? 'Service'
                                    : `${formatNumber(
                                        availableStock
                                      )} ${
                                        product.unit ||
                                        'units'
                                      }`}
                                </p>
                              </div>
                            </div>

                            {!product.is_service && (
                              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-xs text-gray-400">
                                  Reorder level
                                </span>

                                <span className="text-xs font-medium text-gray-700">
                                  {product.reorder_level >
                                  0
                                    ? formatNumber(
                                        product.reorder_level
                                      )
                                    : 'Not set'}
                                </span>
                              </div>
                            )}

                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleLockedAction(
                                    'Product editing is not available yet.'
                                  )
                                }
                                className="flex-1 border border-gray-300 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>

                              {!product.is_service && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleLockedAction(
                                      'Stock adjustment is available on the Growing Merchant plan.'
                                    )
                                  }
                                  className="flex-1 border border-gray-300 bg-white px-3 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
                                >
                                  Adjust stock
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Needs Attention */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-950">
                      Needs attention
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Products currently below the levels
                      you've recorded
                    </p>
                  </div>

                  <CircleAlert
                    size={17}
                    className="text-amber-600"
                  />
                </div>
              </div>

              {attentionProducts.length ===
              0 ? (
                <div className="px-5 py-8 text-center">
                  <CheckCircle2
                    size={20}
                    className="mx-auto text-emerald-700"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-900">
                    Nothing needs attention
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Your recorded product levels do not
                    currently show any low or out-of-stock
                    products.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {attentionProducts.map(
                    (product) => {
                      const status =
                        getProductStatus(
                          product
                        );

                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 px-5 py-4"
                        >
                          <ProductImage
                            product={product}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {getAvailableStock(
                                product
                              )}{' '}
                              available
                            </p>
                          </div>

                          <StatusBadge
                            status={status}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
                <p className="text-[11px] leading-5 text-gray-500">
                  These are catalogue-level stock indicators.
                  Automated inventory monitoring and alerts
                  require an upgrade.
                </p>
              </div>
            </section>

            {/* Inventory Overview */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
                  <Layers3
                    size={17}
                    className="text-emerald-900"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Inventory overview
                  </h2>

                  <p className="text-xs text-gray-500">
                    Your current catalogue
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Products
                  </span>

                  <span className="font-medium text-gray-900">
                    {loading
                      ? '—'
                      : totalProducts}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Units in stock
                  </span>

                  <span className="font-medium text-gray-900">
                    {loading
                      ? '—'
                      : formatNumber(
                          totalUnits
                        )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Low stock
                  </span>

                  <span className="font-medium text-amber-700">
                    {loading
                      ? '—'
                      : lowStock}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Out of stock
                  </span>

                  <span className="font-medium text-red-700">
                    {loading
                      ? '—'
                      : outOfStock}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-900">
                      Stock at cost
                    </span>

                    <span className="text-right text-sm font-semibold text-gray-950">
                      {loading
                        ? '—'
                        : stockValueDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Monietar Insight */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-emerald-900 text-white">
                  <TrendingUp size={15} />
                </div>

                <p className="text-sm font-semibold text-gray-950">
                  Monietar insight
                </p>
              </div>

              {products.length ===
              0 ? (
                <p className="text-sm leading-6 text-gray-600">
                  Add your products so Monietar can give
                  you a clearer view of what you sell and
                  the stock information you've recorded.
                </p>
              ) : outOfStock > 0 ? (
                <p className="text-sm leading-6 text-gray-600">
                  You currently have{' '}
                  <span className="font-medium text-gray-900">
                    {outOfStock}{' '}
                    {outOfStock === 1
                      ? 'product'
                      : 'products'}
                  </span>{' '}
                  with no available stock.
                </p>
              ) : lowStock > 0 ? (
                <p className="text-sm leading-6 text-gray-600">
                  You have{' '}
                  <span className="font-medium text-gray-900">
                    {lowStock}{' '}
                    {lowStock === 1
                      ? 'product'
                      : 'products'}
                  </span>{' '}
                  at or below the stock level you've
                  recorded.
                </p>
              ) : (
                <p className="text-sm leading-6 text-gray-600">
                  Your current catalogue does not have any
                  products flagged as low or out of stock.
                </p>
              )}

              <p className="mt-3 text-xs leading-5 text-gray-400">
                These insights are based on the product
                information you've recorded.
              </p>
            </section>

            {/* Inventory Tracking */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#f8f8f8]">
                  <Lock
                    size={17}
                    className="text-emerald-900"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Inventory tracking
                  </h2>

                  <p className="text-xs text-gray-500">
                    Automated stock monitoring
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Lock
                    size={17}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Upgrade to inventory tracking
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Retail Starter includes a basic product
                      catalogue. Automated inventory tracking
                      is available on the Growing Merchant
                      plan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleLockedAction(
                      'Inventory tracking is available on the Growing Merchant plan.'
                    )
                  }
                  className="mt-4 flex h-10 w-full items-center justify-center gap-2 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Upgrade to inventory tracking
                  <ArrowUp size={14} />
                </button>
              </div>
            </section>

            {/* Running Low Alerts */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Running-low alerts
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Know when it's time to restock
                  </p>
                </div>

                <Lock
                  size={16}
                  className="text-gray-400"
                />
              </div>

              <div className="border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-900">
                  Upgrade to running-low alerts
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  Monietar can automatically monitor your
                  stock and alert you when products are
                  running low on the Growing Merchant plan.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleLockedAction(
                    'Running-low stock alerts are available on the Growing Merchant plan.'
                  )
                }
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-emerald-900 text-xs font-medium text-white hover:bg-emerald-800"
              >
                Upgrade to alerts
                <ArrowUp size={14} />
              </button>
            </section>

            {/* Quick Actions */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-950">
                  Quick actions
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  type="button"
                  onClick={
                    openAddProduct
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Plus
                      size={16}
                      className="text-emerald-900"
                    />

                    <span className="text-sm text-gray-700">
                      Add product
                    </span>
                  </span>

                  <ArrowUp
                    size={15}
                    className="rotate-45 text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleLockedAction(
                      'Adding stock is available on the Growing Merchant plan.'
                    )
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Plus
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="text-sm text-gray-500">
                      Add stock
                    </span>
                  </span>

                  <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-gray-400">
                    Upgrade
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleLockedAction(
                      'Stock adjustment is available on the Growing Merchant plan.'
                    )
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Settings2
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="text-sm text-gray-500">
                      Adjust stock
                    </span>
                  </span>

                  <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-gray-400">
                    Upgrade
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 border-t border-gray-200 pt-5">
          <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Retail Starter includes a basic local product
              catalogue and sales summaries.
            </p>

            <p className="text-gray-400">
              Automated inventory tracking and running-low
              alerts require an upgrade.
            </p>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-6">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Add product
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add a product to your local catalogue.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddProduct(false)
                }
                disabled={
                  savingProduct
                }
                className="text-gray-400 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mx-5 mt-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0"
                />

                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={
                handleCreateProduct
              }
              className="overflow-y-auto p-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Product name
                  </label>

                  <input
                    value={
                      productForm.name
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'name',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Wireless keyboard"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Category
                  </label>

                  <select
                    value={
                      productForm.category_id
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'category_id',
                        event.target.value
                      )
                    }
                    className="h-11 w-full border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-900"
                  >
                    <option value="">
                      Uncategorized
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Unit
                  </label>

                  <input
                    value={
                      productForm.unit
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'unit',
                        event.target.value
                      )
                    }
                    placeholder="pcs"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    SKU
                  </label>

                  <input
                    value={
                      productForm.sku
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'sku',
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Barcode
                  </label>

                  <input
                    value={
                      productForm.barcode
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'barcode',
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Description
                  </label>

                  <textarea
                    value={
                      productForm.description
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'description',
                        event.target.value
                      )
                    }
                    placeholder="Optional product description"
                    rows={3}
                    className="w-full resize-none border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Currency
                  </label>

                  <select
                    value={
                      productForm.currency
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'currency',
                        event.target.value as Currency
                      )
                    }
                    className="h-11 w-full border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-900"
                  >
                    <option value="NGN">
                      NGN — Naira
                    </option>

                    <option value="XOF">
                      XOF — CFA Franc
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Cost price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      productForm.cost_price
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'cost_price',
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Selling price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      productForm.selling_price
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'selling_price',
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Initial stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      productForm.current_stock
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'current_stock',
                        event.target.value
                      )
                    }
                    placeholder="0"
                    disabled={
                      productForm.is_service
                    }
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Reorder level
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      productForm.reorder_level
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'reorder_level',
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Minimum stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      productForm.minimum_stock
                    }
                    onChange={(event) =>
                      updateProductForm(
                        'minimum_stock',
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="h-11 w-full border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-emerald-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 border border-gray-200 bg-gray-50 p-4">
                    <input
                      type="checkbox"
                      checked={
                        productForm.is_service
                      }
                      onChange={(event) =>
                        updateProductForm(
                          'is_service',
                          event.target.checked
                        )
                      }
                      className="mt-0.5 h-4 w-4 accent-emerald-900"
                    />

                    <span>
                      <span className="block text-sm font-medium text-gray-900">
                        This is a service
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        Services do not use physical stock
                        quantities.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <div className="border border-amber-100 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <Lock
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-700"
                      />

                      <div>
                        <p className="text-xs font-medium text-amber-900">
                          Retail Starter
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-800">
                          You can record your product and
                          stock information here. Automated
                          inventory tracking and running-low
                          alerts require the Growing Merchant
                          plan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setShowAddProduct(false)
                }
                disabled={
                  savingProduct
                }
                className="h-10 border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCreateProduct()
                }
                disabled={
                  savingProduct
                }
                className="flex h-10 items-center gap-2 bg-emerald-900 px-5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProduct && (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                )}

                Add product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}