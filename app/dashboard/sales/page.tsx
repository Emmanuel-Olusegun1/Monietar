'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react';

type PaymentMethod = 'Bank transfer' | 'Cash' | 'POS';

interface Sale {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  paymentMethod: PaymentMethod;
  customer: string;
  time: string;
  status: 'Completed' | 'Pending';
}

const sales: Sale[] = [
  {
    id: 'SAL-1048',
    product: 'Anker Power Bank 20,000mAh',
    quantity: 2,
    amount: 57000,
    paymentMethod: 'Bank transfer',
    customer: 'Walk-in customer',
    time: '10:42 AM',
    status: 'Completed',
  },
  {
    id: 'SAL-1047',
    product: 'USB-C Fast Charger',
    quantity: 3,
    amount: 37500,
    paymentMethod: 'POS',
    customer: 'Michael A.',
    time: '10:18 AM',
    status: 'Completed',
  },
  {
    id: 'SAL-1046',
    product: 'Wireless Bluetooth Earbuds',
    quantity: 1,
    amount: 18500,
    paymentMethod: 'Cash',
    customer: 'Walk-in customer',
    time: '9:56 AM',
    status: 'Completed',
  },
  {
    id: 'SAL-1045',
    product: 'Laptop Sleeve 15.6"',
    quantity: 2,
    amount: 30000,
    paymentMethod: 'Bank transfer',
    customer: 'Daniel O.',
    time: '9:21 AM',
    status: 'Completed',
  },
  {
    id: 'SAL-1044',
    product: 'Phone Stand',
    quantity: 2,
    amount: 15000,
    paymentMethod: 'Cash',
    customer: 'Walk-in customer',
    time: '8:47 AM',
    status: 'Completed',
  },
  {
    id: 'SAL-1043',
    product: 'Mechanical Keyboard',
    quantity: 1,
    amount: 42000,
    paymentMethod: 'POS',
    customer: 'Samuel K.',
    time: 'Yesterday',
    status: 'Completed',
  },
  {
    id: 'SAL-1042',
    product: 'Wireless Mouse',
    quantity: 2,
    amount: 35000,
    paymentMethod: 'Bank transfer',
    customer: 'Blessing T.',
    time: 'Yesterday',
    status: 'Completed',
  },
  {
    id: 'SAL-1041',
    product: 'Lightning Cable',
    quantity: 4,
    amount: 22000,
    paymentMethod: 'Cash',
    customer: 'Walk-in customer',
    time: 'Yesterday',
    status: 'Pending',
  },
  {
    id: 'SAL-1040',
    product: 'USB-C Fast Charger',
    quantity: 2,
    amount: 25000,
    paymentMethod: 'POS',
    customer: 'Joseph E.',
    time: 'Yesterday',
    status: 'Completed',
  },
];

const productPerformance = [
  {
    name: 'Anker Power Bank 20,000mAh',
    units: 42,
    revenue: 1197000,
  },
  {
    name: 'USB-C Fast Charger',
    units: 31,
    revenue: 387500,
  },
  {
    name: 'Wireless Bluetooth Earbuds',
    units: 27,
    revenue: 499500,
  },
  {
    name: 'Phone Stand',
    units: 18,
    revenue: 135000,
  },
];

const dailySales = [
  { day: 'Mon', amount: 98000 },
  { day: 'Tue', amount: 132000 },
  { day: 'Wed', amount: 117000 },
  { day: 'Thu', amount: 168000 },
  { day: 'Fri', amount: 142000 },
  { day: 'Sat', amount: 186000 },
  { day: 'Sun', amount: 121000 },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function SalesPage() {
  const [period, setPeriod] = useState('Today');
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All methods');

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.product.toLowerCase().includes(search.toLowerCase()) ||
        sale.customer.toLowerCase().includes(search.toLowerCase()) ||
        sale.id.toLowerCase().includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === 'All methods' ||
        sale.paymentMethod === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [search, paymentFilter]);

  const completedSales = sales.filter(
    (sale) => sale.status === 'Completed'
  );

  const totalRevenue = completedSales.reduce(
    (sum, sale) => sum + sale.amount,
    0
  );

  const totalUnits = completedSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  const averageSale =
    completedSales.length > 0
      ? totalRevenue / completedSales.length
      : 0;

  const bankTransferTotal = completedSales
    .filter((sale) => sale.paymentMethod === 'Bank transfer')
    .reduce((sum, sale) => sum + sale.amount, 0);

  const cashTotal = completedSales
    .filter((sale) => sale.paymentMethod === 'Cash')
    .reduce((sum, sale) => sum + sale.amount, 0);

  const posTotal = completedSales
    .filter((sale) => sale.paymentMethod === 'POS')
    .reduce((sum, sale) => sum + sale.amount, 0);

  const highestDay = Math.max(...dailySales.map((item) => item.amount));

  return (
    <div className="min-h-screen bg-[#f1f1f1] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Business
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Sales
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Record sales, see where your revenue is coming from, and
              understand what is moving across your business.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="appearance-none border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none focus:border-emerald-900"
              >
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
                <option>Last month</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 border border-emerald-900 bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />
              Record sale
            </button>
          </div>
        </div>

        {/* Sales summary */}
        <div className="mb-8 grid grid-cols-1 border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Sales revenue"
            value={formatCurrency(totalRevenue)}
            change="+12.8%"
            positive
            icon={<CircleDollarSign size={18} />}
            description={`${period.toLowerCase()} sales`}
          />

          <Metric
            label="Sales"
            value={completedSales.length.toString()}
            change="+8.4%"
            positive
            icon={<ShoppingBag size={18} />}
            description="Completed sales"
          />

          <Metric
            label="Units sold"
            value={totalUnits.toString()}
            change="+10.2%"
            positive
            icon={<Package size={18} />}
            description="Products moved"
          />

          <Metric
            label="Average sale"
            value={formatCurrency(averageSale)}
            change="+3.7%"
            positive
            icon={<TrendingUp size={18} />}
            description="Average transaction value"
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
                    Daily revenue for the current week
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Peak day</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(highestDay)}
                  </p>
                </div>
              </div>

              <div className="flex h-[230px] items-end gap-2 border-b border-gray-200 pb-0 sm:gap-4">
                {dailySales.map((item) => {
                  const height = Math.max(
                    8,
                    Math.round((item.amount / highestDay) * 100)
                  );

                  return (
                    <div
                      key={item.day}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="mb-2 hidden text-[10px] text-gray-500 sm:block">
                        {formatCurrency(item.amount)}
                      </div>

                      <div
                        className="w-full max-w-[54px] bg-emerald-900 transition hover:bg-emerald-800"
                        style={{ height: `${height}%` }}
                      />

                      <span className="mt-3 text-[11px] text-gray-500">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                      Sales recorded across your business
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
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search sales"
                        className="w-full border border-gray-200 bg-[#f8f8f8] py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-emerald-900 sm:w-[220px]"
                      />
                    </div>

                    <select
                      value={paymentFilter}
                      onChange={(event) =>
                        setPaymentFilter(event.target.value)
                      }
                      className="border border-gray-200 bg-[#f8f8f8] px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-900"
                    >
                      <option>All methods</option>
                      <option>Bank transfer</option>
                      <option>Cash</option>
                      <option>POS</option>
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
                        Payment
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Time
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-gray-100 transition hover:bg-[#fafafa]"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {sale.product}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {sale.id} · {sale.quantity}{' '}
                              {sale.quantity === 1 ? 'unit' : 'units'}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {sale.customer}
                        </td>

                        <td className="px-4 py-4">
                          <PaymentMethodBadge
                            method={sale.paymentMethod}
                          />
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(sale.amount)}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500">
                          {sale.time}
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={sale.status} />
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
                {filteredSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="border-b border-gray-200 p-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {sale.product}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {sale.id} · {sale.time}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        {formatCurrency(sale.amount)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="mt-1 text-sm text-gray-800">
                          {sale.customer}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="mt-1 text-sm text-gray-800">
                          {sale.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Payment</p>
                        <div className="mt-1">
                          <PaymentMethodBadge
                            method={sale.paymentMethod}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <div className="mt-1">
                          <StatusBadge status={sale.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSales.length === 0 && (
                <div className="px-5 py-16 text-center">
                  <ShoppingBag
                    size={28}
                    className="mx-auto mb-3 text-gray-300"
                  />

                  <p className="text-sm font-medium text-gray-900">
                    No sales found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try changing your search or payment filter.
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 px-5 py-4">
                <p className="text-xs text-gray-500">
                  Showing {filteredSales.length} of {sales.length} sales
                </p>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Payment breakdown */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900">
                  Payment breakdown
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Where sales revenue came from
                </p>
              </div>

              <div className="space-y-5">
                <PaymentBreakdown
                  label="Bank transfer"
                  amount={bankTransferTotal}
                  total={totalRevenue}
                  icon={<ArrowUpRight size={15} />}
                />

                <PaymentBreakdown
                  label="Cash"
                  amount={cashTotal}
                  total={totalRevenue}
                  icon={<Banknote size={15} />}
                />

                <PaymentBreakdown
                  label="POS"
                  amount={posTotal}
                  total={totalRevenue}
                  icon={<CreditCard size={15} />}
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
                  Based on units sold
                </p>
              </div>

              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div
                    key={product.name}
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
                        {product.units} units
                      </p>
                    </div>

                    <p className="text-xs font-medium text-gray-700">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
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
                Bank transfers currently account for the largest share of
                recorded sales. Keeping those inflows connected to your
                transaction records helps Monietar give you a clearer view of
                how sales are affecting cash flow.
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
                  <span>Record a sale</span>
                  <Plus size={16} className="text-gray-400" />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>View transactions</span>
                  <ArrowUpRight size={16} className="text-gray-400" />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition hover:bg-[#fafafa]"
                >
                  <span>View inventory</span>
                  <ArrowUpRight size={16} className="text-gray-400" />
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
            Sales, revenue, payment methods, and product performance shown
            here are placeholders and are not connected to your live
            Monietar data yet.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  change,
  positive,
  icon,
  description,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>

        <span className="text-gray-400">{icon}</span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-gray-950">
          {value}
        </span>

        <span
          className={`mb-1 inline-flex items-center gap-0.5 text-xs font-medium ${
            positive ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {positive ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}

          {change}
        </span>
      </div>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function PaymentBreakdown({
  label,
  amount,
  total,
  icon,
}: {
  label: string;
  amount: number;
  total: number;
  icon: React.ReactNode;
}) {
  const percentage =
    total === 0 ? 0 : Math.round((amount / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>

          <span className="text-xs text-gray-600">{label}</span>
        </div>

        <span className="text-xs font-semibold text-gray-900">
          {percentage}%
        </span>
      </div>

      <div className="mb-2 h-1.5 bg-gray-100">
        <div
          className="h-full bg-emerald-900"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs font-medium text-gray-700">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}

function PaymentMethodBadge({
  method,
}: {
  method: PaymentMethod;
}) {
  const styles = {
    'Bank transfer': 'border-blue-200 bg-blue-50 text-blue-800',
    Cash: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    POS: 'border-purple-200 bg-purple-50 text-purple-800',
  };

  return (
    <span
      className={`inline-flex border px-2 py-1 text-[11px] font-medium ${styles[method]}`}
    >
      {method}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: 'Completed' | 'Pending';
}) {
  return (
    <span
      className={`inline-flex border px-2 py-1 text-[11px] font-medium ${
        status === 'Completed'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
    >
      {status}
    </span>
  );
}