'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
} from 'lucide-react';

type ProductStatus = 'In stock' | 'Low stock' | 'Out of stock';

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  unitsSold: number;
  revenue: number;
  status: ProductStatus;
  lastUpdated: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Anker Power Bank 20,000mAh',
    category: 'Electronics',
    sku: 'ANK-PB20',
    price: 28500,
    stock: 18,
    unitsSold: 42,
    revenue: 1197000,
    status: 'In stock',
    lastUpdated: 'Today',
  },
  {
    id: 2,
    name: 'USB-C Fast Charger',
    category: 'Electronics',
    sku: 'USB-FC01',
    price: 12500,
    stock: 7,
    unitsSold: 31,
    revenue: 387500,
    status: 'Low stock',
    lastUpdated: 'Today',
  },
  {
    id: 3,
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    sku: 'WBE-02',
    price: 18500,
    stock: 24,
    unitsSold: 27,
    revenue: 499500,
    status: 'In stock',
    lastUpdated: 'Yesterday',
  },
  {
    id: 4,
    name: 'Phone Stand',
    category: 'Accessories',
    sku: 'PHN-ST01',
    price: 7500,
    stock: 3,
    unitsSold: 18,
    revenue: 135000,
    status: 'Low stock',
    lastUpdated: 'Yesterday',
  },
  {
    id: 5,
    name: 'Lightning Cable',
    category: 'Accessories',
    sku: 'LGT-CB01',
    price: 5500,
    stock: 0,
    unitsSold: 22,
    revenue: 121000,
    status: 'Out of stock',
    lastUpdated: '2 days ago',
  },
  {
    id: 6,
    name: 'Laptop Sleeve 15.6"',
    category: 'Accessories',
    sku: 'LPS-156',
    price: 15000,
    stock: 12,
    unitsSold: 14,
    revenue: 210000,
    status: 'In stock',
    lastUpdated: '3 days ago',
  },
  {
    id: 7,
    name: 'Mechanical Keyboard',
    category: 'Computing',
    sku: 'MKB-01',
    price: 42000,
    stock: 5,
    unitsSold: 9,
    revenue: 378000,
    status: 'Low stock',
    lastUpdated: '3 days ago',
  },
  {
    id: 8,
    name: 'Wireless Mouse',
    category: 'Computing',
    sku: 'WMS-01',
    price: 17500,
    stock: 21,
    unitsSold: 16,
    revenue: 280000,
    status: 'In stock',
    lastUpdated: '4 days ago',
  },
];

const categories = ['All categories', 'Electronics', 'Accessories', 'Computing'];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [status, setStatus] = useState<'All' | ProductStatus>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All categories' || product.category === category;

      const matchesStatus =
        status === 'All' || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const totalProducts = products.length;
  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );
  const lowStock = products.filter(
    (product) => product.status === 'Low stock'
  ).length;
  const outOfStock = products.filter(
    (product) => product.status === 'Out of stock'
  ).length;

  const totalRevenue = products.reduce(
    (total, product) => total + product.revenue,
    0
  );

  return (
    <div className="min-h-screen bg-[#f1f1f1] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Business
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Keep your product catalogue organised and see how stock and sales
              are moving across your business.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            <Plus size={17} />
            Add product
          </button>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total products</span>
              <Package size={18} className="text-gray-400" />
            </div>

            <div className="text-2xl font-semibold text-gray-950">
              {totalProducts}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Active products in catalogue
            </p>
          </div>

          <div className="border-b border-gray-200 p-5 lg:border-r lg:border-b-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Units in stock</span>
              <Boxes size={18} className="text-gray-400" />
            </div>

            <div className="text-2xl font-semibold text-gray-950">
              {totalUnits}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Across all products
            </p>
          </div>

          <div className="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Low stock</span>
              <AlertTriangle size={18} className="text-amber-600" />
            </div>

            <div className="text-2xl font-semibold text-gray-950">
              {lowStock}
            </div>

            <p className="mt-1 text-xs text-amber-700">
              Products need attention
            </p>
          </div>

          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Product revenue</span>
              <TrendingUp size={18} className="text-gray-400" />
            </div>

            <div className="text-2xl font-semibold text-gray-950">
              {formatCurrency(totalRevenue)}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Temporary period data
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products or SKU"
                    className="w-full border border-gray-200 bg-[#f8f8f8] py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-900"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="border border-gray-200 bg-[#f8f8f8] px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-900"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-2 border px-3 py-2.5 text-sm transition ${
                      showFilters
                        ? 'border-emerald-900 bg-emerald-900 text-white'
                        : 'border-gray-200 bg-[#f8f8f8] text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  {(['All', 'In stock', 'Low stock', 'Out of stock'] as const).map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStatus(item)}
                        className={`border px-3 py-2 text-xs font-medium transition ${
                          status === item
                            ? 'border-emerald-900 bg-emerald-900 text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#fafafa] text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Units sold
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 transition hover:bg-[#fafafa]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-[#f5f5f5]">
                            <Package
                              size={18}
                              className="text-gray-500"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {product.category} · {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {formatCurrency(product.price)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? 'text-red-700'
                              : product.stock <= 7
                                ? 'text-amber-700'
                                : 'text-gray-800'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product.unitsSold}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.revenue)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label={`More actions for ${product.name}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-b border-gray-200 p-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-[#f5f5f5]">
                        <Package size={17} className="text-gray-500" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {product.category} · {product.sku}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 p-1 text-gray-400"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {product.stock}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Units sold</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {product.unitsSold}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <StatusBadge status={product.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="px-5 py-16 text-center">
                <Package
                  size={28}
                  className="mx-auto mb-3 text-gray-300"
                />

                <p className="text-sm font-medium text-gray-900">
                  No products found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 px-5 py-4">
              <p className="text-xs text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </section>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Stock health */}
            <div className="border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Stock health
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Current catalogue position
                  </p>
                </div>

                <Boxes size={18} className="text-gray-400" />
              </div>

              <div className="space-y-4">
                <StockLine
                  label="In stock"
                  value={products.filter(
                    (product) => product.status === 'In stock'
                  ).length}
                  total={totalProducts}
                />

                <StockLine
                  label="Low stock"
                  value={lowStock}
                  total={totalProducts}
                />

                <StockLine
                  label="Out of stock"
                  value={outOfStock}
                  total={totalProducts}
                />
              </div>
            </div>

            {/* Product insight */}
            <div className="border border-emerald-900 bg-emerald-900 p-5 text-white">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={17} />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Monietar Insight
                </span>
              </div>

              <p className="text-sm leading-6 text-emerald-50">
                {lowStock > 0
                  ? `${lowStock} products are running low. Replenishing your fastest-moving items before they sell out can help protect your sales flow.`
                  : 'Your current catalogue has no products flagged as low stock.'}
              </p>
            </div>

            {/* Top products */}
            <div className="border border-gray-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900">
                  Top products
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  By revenue
                </p>
              </div>

              <div className="space-y-4">
                {[...products]
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 4)
                  .map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-200 text-xs font-semibold text-gray-500">
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {product.unitsSold} units sold
                        </p>
                      </div>

                      <span className="text-xs font-medium text-gray-700">
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4">
                <p className="text-sm font-semibold text-gray-900">
                  Quick actions
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>Add product</span>
                  <ArrowUpRight size={16} className="text-gray-400" />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>Review low stock</span>
                  <ArrowDownRight size={16} className="text-gray-400" />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>View inventory</span>
                  <ArrowUpRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Temporary data notice */}
        <div className="mt-6 border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs leading-5 text-gray-500">
            <span className="font-medium text-gray-700">
              Temporary dashboard data.
            </span>{' '}
            Product records, stock levels, sales figures, and revenue shown
            here are placeholders and are not connected to your live
            inventory yet.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const styles = {
    'In stock': 'border-emerald-200 bg-emerald-50 text-emerald-800',
    'Low stock': 'border-amber-200 bg-amber-50 text-amber-800',
    'Out of stock': 'border-red-200 bg-red-50 text-red-800',
  };

  return (
    <span
      className={`inline-flex border px-2 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function StockLine({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-medium text-gray-900">
          {value}
        </span>
      </div>

      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-emerald-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}