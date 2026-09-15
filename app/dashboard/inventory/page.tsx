'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ChevronDown,
  ClipboardList,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type StockStatus = 'Healthy' | 'Low stock' | 'Out of stock';

type MovementType = 'Stock in' | 'Sale' | 'Adjustment';

interface InventoryItem {
  id: string;
  product: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  soldThisMonth: number;
  stockValue: number;
  status: StockStatus;
  updated: string;
}

interface StockMovement {
  id: string;
  product: string;
  type: MovementType;
  quantity: number;
  reference: string;
  time: string;
}

const inventory: InventoryItem[] = [
  {
    id: 'INV-001',
    product: 'Anker Power Bank 20,000mAh',
    sku: 'ANK-PB20',
    category: 'Electronics',
    stock: 18,
    reorderLevel: 8,
    soldThisMonth: 42,
    stockValue: 513000,
    status: 'Healthy',
    updated: 'Today',
  },
  {
    id: 'INV-002',
    product: 'USB-C Fast Charger',
    sku: 'USB-FC01',
    category: 'Electronics',
    stock: 7,
    reorderLevel: 10,
    soldThisMonth: 31,
    stockValue: 87500,
    status: 'Low stock',
    updated: 'Today',
  },
  {
    id: 'INV-003',
    product: 'Wireless Bluetooth Earbuds',
    sku: 'WBE-02',
    category: 'Electronics',
    stock: 24,
    reorderLevel: 8,
    soldThisMonth: 27,
    stockValue: 444000,
    status: 'Healthy',
    updated: 'Today',
  },
  {
    id: 'INV-004',
    product: 'Phone Stand',
    sku: 'PHN-ST01',
    category: 'Accessories',
    stock: 3,
    reorderLevel: 8,
    soldThisMonth: 18,
    stockValue: 22500,
    status: 'Low stock',
    updated: 'Yesterday',
  },
  {
    id: 'INV-005',
    product: 'Lightning Cable',
    sku: 'LGT-CB01',
    category: 'Accessories',
    stock: 0,
    reorderLevel: 10,
    soldThisMonth: 22,
    stockValue: 0,
    status: 'Out of stock',
    updated: 'Yesterday',
  },
  {
    id: 'INV-006',
    product: 'Laptop Sleeve 15.6"',
    sku: 'LPS-156',
    category: 'Accessories',
    stock: 12,
    reorderLevel: 6,
    soldThisMonth: 14,
    stockValue: 180000,
    status: 'Healthy',
    updated: '2 days ago',
  },
  {
    id: 'INV-007',
    product: 'Mechanical Keyboard',
    sku: 'MKB-01',
    category: 'Computing',
    stock: 5,
    reorderLevel: 7,
    soldThisMonth: 9,
    stockValue: 210000,
    status: 'Low stock',
    updated: '2 days ago',
  },
  {
    id: 'INV-008',
    product: 'Wireless Mouse',
    sku: 'WMS-01',
    category: 'Computing',
    stock: 21,
    reorderLevel: 8,
    soldThisMonth: 16,
    stockValue: 367500,
    status: 'Healthy',
    updated: '3 days ago',
  },
  {
    id: 'INV-009',
    product: 'Laptop Backpack',
    sku: 'LPB-01',
    category: 'Accessories',
    stock: 16,
    reorderLevel: 6,
    soldThisMonth: 11,
    stockValue: 240000,
    status: 'Healthy',
    updated: '3 days ago',
  },
];

const movements: StockMovement[] = [
  {
    id: 'MOV-108',
    product: 'Anker Power Bank 20,000mAh',
    type: 'Sale',
    quantity: -2,
    reference: 'SAL-1048',
    time: '10:42 AM',
  },
  {
    id: 'MOV-107',
    product: 'USB-C Fast Charger',
    type: 'Sale',
    quantity: -3,
    reference: 'SAL-1047',
    time: '10:18 AM',
  },
  {
    id: 'MOV-106',
    product: 'Wireless Bluetooth Earbuds',
    type: 'Stock in',
    quantity: 10,
    reference: 'PO-204',
    time: '9:35 AM',
  },
  {
    id: 'MOV-105',
    product: 'Phone Stand',
    type: 'Sale',
    quantity: -2,
    reference: 'SAL-1044',
    time: '8:47 AM',
  },
  {
    id: 'MOV-104',
    product: 'Mechanical Keyboard',
    type: 'Adjustment',
    quantity: -1,
    reference: 'ADJ-019',
    time: 'Yesterday',
  },
  {
    id: 'MOV-103',
    product: 'Wireless Mouse',
    type: 'Stock in',
    quantity: 15,
    reference: 'PO-201',
    time: 'Yesterday',
  },
];

const categories = [
  'All categories',
  'Electronics',
  'Accessories',
  'Computing',
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [status, setStatus] = useState<'All' | StockStatus>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All categories' || item.category === category;

      const matchesStatus =
        status === 'All' || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const totalUnits = inventory.reduce(
    (sum, item) => sum + item.stock,
    0
  );

  const totalStockValue = inventory.reduce(
    (sum, item) => sum + item.stockValue,
    0
  );

  const lowStockCount = inventory.filter(
    (item) => item.status === 'Low stock'
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => item.status === 'Out of stock'
  ).length;

  const totalSold = inventory.reduce(
    (sum, item) => sum + item.soldThisMonth,
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
              Inventory
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Keep track of what is available, what is moving, and which
              products need to be replenished.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300"
            >
              <ClipboardList size={17} />
              Stock adjustment
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />
              Add stock
            </button>
          </div>
        </div>

        {/* Inventory summary */}
        <div className="mb-8 grid grid-cols-1 border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Units in stock"
            value={totalUnits.toLocaleString()}
            description="Across your catalogue"
            icon={<Boxes size={18} />}
          />

          <Metric
            label="Stock value"
            value={formatCurrency(totalStockValue)}
            description="Current inventory value"
            icon={<Package size={18} />}
          />

          <Metric
            label="Low stock"
            value={lowStockCount.toString()}
            description="Products below reorder level"
            icon={<AlertTriangle size={18} />}
            warning
          />

          <Metric
            label="Units sold"
            value={totalSold.toLocaleString()}
            description="This month"
            icon={<ShoppingCart size={18} />}
          />
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-6">
            {/* Inventory table */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Stock overview
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Current stock position by product
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
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                        placeholder="Search inventory"
                        className="w-full border border-gray-200 bg-[#f8f8f8] py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-900 sm:w-[220px]"
                      />
                    </div>

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      className="border border-gray-200 bg-[#f8f8f8] px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-900"
                    >
                      {categories.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`inline-flex items-center justify-center gap-2 border px-3 py-2.5 text-sm transition ${
                        showFilters
                          ? 'border-emerald-900 bg-emerald-900 text-white'
                          : 'border-gray-200 bg-[#f8f8f8] text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <TrendingDown size={16} />
                      Filters
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {(
                      [
                        'All',
                        'Healthy',
                        'Low stock',
                        'Out of stock',
                      ] as const
                    ).map((item) => (
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
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#fafafa] text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Product
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        In stock
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reorder level
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Sold
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Stock value
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr
                        key={item.id}
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
                                {item.product}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {item.category} · {item.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                item.stock === 0
                                  ? 'text-red-700'
                                  : item.status === 'Low stock'
                                    ? 'text-amber-700'
                                    : 'text-gray-900'
                              }`}
                            >
                              {item.stock}
                            </p>

                            <div className="mt-1.5 h-1 w-20 bg-gray-100">
                              <div
                                className={`h-full ${
                                  item.stock === 0
                                    ? 'bg-red-700'
                                    : item.status === 'Low stock'
                                      ? 'bg-amber-600'
                                      : 'bg-emerald-900'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    item.stock === 0
                                      ? 0
                                      : (item.stock /
                                          Math.max(
                                            item.reorderLevel * 2,
                                            1
                                          )) *
                                        100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {item.reorderLevel}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {item.soldThisMonth}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(item.stockValue)}
                        </td>

                        <td className="px-4 py-4">
                          <StockBadge status={item.status} />
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            className="p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
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
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 p-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-[#f5f5f5]">
                          <Package
                            size={17}
                            className="text-gray-500"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.product}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {item.category} · {item.sku}
                          </p>
                        </div>
                      </div>

                      <StockBadge status={item.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          In stock
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            item.stock === 0
                              ? 'text-red-700'
                              : item.status === 'Low stock'
                                ? 'text-amber-700'
                                : 'text-gray-900'
                          }`}
                        >
                          {item.stock}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Reorder level
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {item.reorderLevel}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Sold this month
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {item.soldThisMonth}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Stock value
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatCurrency(item.stockValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredInventory.length === 0 && (
                <div className="px-5 py-16 text-center">
                  <Boxes
                    size={28}
                    className="mx-auto mb-3 text-gray-300"
                  />

                  <p className="text-sm font-medium text-gray-900">
                    No inventory found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try changing your search or filters.
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 px-5 py-4">
                <p className="text-xs text-gray-500">
                  Showing {filteredInventory.length} of{' '}
                  {inventory.length} products
                </p>
              </div>
            </section>

            {/* Stock movements */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Recent stock movements
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Recent changes to your inventory
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <MovementIcon type={movement.type} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {movement.product}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {movement.type} · {movement.reference} ·{' '}
                          {movement.time}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-sm font-semibold ${
                        movement.quantity > 0
                          ? 'text-emerald-700'
                          : 'text-gray-900'
                      }`}
                    >
                      {movement.quantity > 0 ? '+' : ''}
                      {movement.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Attention */}
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Needs attention
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Products that may need replenishment
                    </p>
                  </div>

                  <AlertTriangle
                    size={18}
                    className="text-amber-600"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {inventory
                  .filter(
                    (item) =>
                      item.status === 'Low stock' ||
                      item.status === 'Out of stock'
                  )
                  .map((item) => (
                    <div key={item.id} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.product}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.stock === 0
                              ? 'Currently out of stock'
                              : `${item.stock} units remaining`}
                          </p>
                        </div>

                        <StockBadge status={item.status} />
                      </div>

                      <button
                        type="button"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-900 hover:underline"
                      >
                        Restock item
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  ))}
              </div>
            </section>

            {/* Inventory movement */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900">
                  Inventory movement
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  This month
                </p>
              </div>

              <div className="space-y-5">
                <MovementSummary
                  label="Stock received"
                  value="40"
                  icon={<ArrowUpRight size={15} />}
                  positive
                />

                <MovementSummary
                  label="Units sold"
                  value={totalSold.toString()}
                  icon={<ArrowDownRight size={15} />}
                />

                <MovementSummary
                  label="Adjustments"
                  value="3"
                  icon={<ClipboardList size={15} />}
                />
              </div>
            </section>

            {/* Insight */}
            <section className="border border-emerald-900 bg-emerald-900 p-5 text-white">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={17} />

                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Monietar Insight
                </span>
              </div>

              <p className="text-sm leading-6 text-emerald-50">
                {lowStockCount > 0 || outOfStockCount > 0
                  ? `${lowStockCount + outOfStockCount} products need stock attention. Products that sell quickly but stay below their reorder level can put pressure on future sales and cash flow.`
                  : 'Your current inventory levels are above their configured reorder points.'}
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
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>Add stock</span>
                  <Plus size={16} className="text-gray-400" />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>Adjust stock</span>
                  <ClipboardList
                    size={16}
                    className="text-gray-400"
                  />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>View products</span>
                  <ArrowUpRight
                    size={16}
                    className="text-gray-400"
                  />
                </button>
              </div>
            </section>
          </aside>
        </div>

        {/* Temporary data notice */}
        <div className="mt-6 border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs leading-5 text-gray-500">
            <span className="font-medium text-gray-700">
              Temporary dashboard data.
            </span>{' '}
            Stock levels, movements, inventory values, and reorder
            information shown here are placeholders and are not connected
            to your live inventory yet.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  description,
  icon,
  warning = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>

        <span
          className={warning ? 'text-amber-600' : 'text-gray-400'}
        >
          {icon}
        </span>
      </div>

      <p className="text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      <p
        className={`mt-1 text-xs ${
          warning ? 'text-amber-700' : 'text-gray-500'
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function StockBadge({ status }: { status: StockStatus }) {
  const styles = {
    Healthy: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    'Low stock': 'border-amber-200 bg-amber-50 text-amber-800',
    'Out of stock': 'border-red-200 bg-red-50 text-red-800',
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap border px-2 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function MovementIcon({ type }: { type: MovementType }) {
  if (type === 'Stock in') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
        <ArrowUpRight size={16} />
      </div>
    );
  }

  if (type === 'Sale') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-gray-200 bg-gray-50 text-gray-600">
        <ShoppingCart size={16} />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-amber-200 bg-amber-50 text-amber-700">
      <ClipboardList size={16} />
    </div>
  );
}

function MovementSummary({
  label,
  value,
  icon,
  positive = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={positive ? 'text-emerald-700' : 'text-gray-400'}>
          {icon}
        </span>

        <span className="text-sm text-gray-600">{label}</span>
      </div>

      <span className="text-sm font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
}