'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  CircleAlert,
  Clock3,
  Lightbulb,
  MessageSquare,
  Package,
  Send,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

type InsightType = 'positive' | 'warning' | 'neutral';

interface Insight {
  title: string;
  description: string;
  type: InsightType;
  metric?: string;
  action?: string;
}

const suggestedQuestions = [
  'How is my cash flow looking?',
  'What is putting pressure on my cash?',
  'Which products should I restock?',
  'Are my expenses growing too fast?',
];

const insights: Insight[] = [
  {
    title: 'Cash flow is healthy',
    description:
      'Money coming into the business is currently higher than money going out. Your cash position remains positive for the selected period.',
    type: 'positive',
    metric: '+₦2.42m',
    action: 'View cash flow',
  },
  {
    title: 'Inventory is absorbing cash',
    description:
      'Inventory purchases are your largest expense category this month. Replenishment is supporting sales, but large purchases can tighten available cash.',
    type: 'warning',
    metric: '48% of expenses',
    action: 'Review inventory',
  },
  {
    title: 'Revenue is growing faster than expenses',
    description:
      'Revenue increased by 16.3% while expenses increased by 7.4%. That gap is currently working in your favour.',
    type: 'positive',
    metric: '+16.3%',
    action: 'View analytics',
  },
  {
    title: 'Three products need attention',
    description:
      'USB-C Fast Charger, Phone Stand, and Mechanical Keyboard are currently below their preferred stock levels.',
    type: 'warning',
    metric: '3 items',
    action: 'Review stock',
  },
];

const quickNumbers = [
  {
    label: 'Revenue',
    value: '₦3.85m',
    change: '+16.3%',
    positive: true,
    icon: TrendingUp,
  },
  {
    label: 'Expenses',
    value: '₦1.43m',
    change: '+7.4%',
    positive: false,
    icon: TrendingDown,
  },
  {
    label: 'Net cash flow',
    value: '₦2.42m',
    change: '+21.6%',
    positive: true,
    icon: Wallet,
  },
  {
    label: 'Stock value',
    value: '₦2.06m',
    change: '9 products',
    positive: true,
    icon: Package,
  },
];

function getInsightClasses(type: InsightType) {
  if (type === 'positive') {
    return {
      border: 'border-emerald-200',
      icon: 'bg-emerald-900 text-white',
      badge: 'bg-emerald-50 text-emerald-900',
    };
  }

  if (type === 'warning') {
    return {
      border: 'border-amber-200',
      icon: 'bg-amber-600 text-white',
      badge: 'bg-amber-50 text-amber-800',
    };
  }

  return {
    border: 'border-gray-200',
    icon: 'bg-gray-900 text-white',
    badge: 'bg-gray-100 text-gray-800',
  };
}

export default function AICFOPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);

  const [period, setPeriod] = useState('This month');

  const currentInsight = useMemo(() => {
    if (period === 'Today') {
      return {
        cash: '₦117k',
        revenue: '₦185k',
        expenses: '₦68k',
        summary:
          'Today looks healthy. Revenue is ahead of expenses, leaving positive cash movement.',
      };
    }

    if (period === 'This week') {
      return {
        cash: '₦612k',
        revenue: '₦964k',
        expenses: '₦352k',
        summary:
          'This week is trending positively. Revenue is comfortably ahead of expenses.',
      };
    }

    if (period === 'Last month') {
      return {
        cash: '₦1.98m',
        revenue: '₦3.31m',
        expenses: '₦1.33m',
        summary:
          'Last month closed with positive cash movement, with revenue continuing to outpace expenses.',
      };
    }

    return {
      cash: '₦2.42m',
      revenue: '₦3.85m',
      expenses: '₦1.43m',
      summary:
        'This month is financially healthy. Revenue is growing faster than expenses, but inventory purchases are taking the largest share of your spending.',
    };
  }, [period]);

  const handleQuestion = (value?: string) => {
    const text = (value ?? question).trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      {
        role: 'user',
        content: text,
      },
      {
        role: 'assistant',
        content:
          'Based on the current Monietar data, your cash position is positive, but inventory purchases are the biggest pressure on available cash. I would keep an eye on replenishment timing and avoid tying up too much cash in slow-moving stock.',
      },
    ]);

    setQuestion('');
  };

  return (
    <main className="min-h-screen bg-[#f1f1f1] text-gray-900">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <section className="mb-8 border-b border-gray-200 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
                Insight / AI CFO
              </p>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Understand what your numbers are telling you.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Your AI CFO looks across your financial activity, sales,
                expenses, inventory, and cash flow to help you understand what
                is happening in your business and what deserves attention.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['Today', 'This week', 'This month', 'Last month'].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={`border px-3 py-2 text-xs font-medium transition ${
                      period === item
                        ? 'border-emerald-900 bg-emerald-900 text-white'
                        : 'border-gray-300 bg-transparent text-gray-700 hover:bg-white'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* CFO overview */}
        <section className="mb-8 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <div className="border border-emerald-900 bg-emerald-900 p-6 text-white sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-5">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-8 w-8 items-center justify-center border border-white/20">
                    <Bot size={16} />
                  </span>
                  Monietar AI CFO
                </div>

                <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                  Here&apos;s what I think you should know.
                </h2>
              </div>

              <Lightbulb
                className="hidden shrink-0 sm:block"
                size={22}
              />
            </div>

            <p className="max-w-2xl text-sm leading-7 text-white/80">
              {currentInsight.summary}
            </p>

            <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Revenue
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {currentInsight.revenue}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Expenses
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {currentInsight.expenses}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Net cash flow
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {currentInsight.cash}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  CFO status
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Business health
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-emerald-900 text-white">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-6">
              <div>
                <p className="text-3xl font-semibold text-emerald-900">
                  Healthy
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Based on current financial activity
                </p>
              </div>

              <p className="text-sm font-medium text-emerald-900">
                Positive
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Cash flow</span>
                <span className="font-medium text-emerald-900">
                  Positive
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Revenue trend</span>
                <span className="font-medium text-emerald-900">
                  Growing
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Expense pressure</span>
                <span className="font-medium text-amber-700">
                  Moderate
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Inventory pressure</span>
                <span className="font-medium text-amber-700">
                  Watch
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="mb-8 grid grid-cols-2 border-y border-l border-gray-200 bg-white lg:grid-cols-4">
          {quickNumbers.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`p-5 sm:p-6 ${
                  index < quickNumbers.length - 1
                    ? 'border-r border-gray-200'
                    : ''
                } ${
                  index < 2
                    ? 'border-b border-gray-200 lg:border-b-0'
                    : ''
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {item.label}
                  </p>

                  <Icon size={16} className="text-gray-400" />
                </div>

                <p className="text-2xl font-semibold tracking-tight">
                  {item.value}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs">
                  <ArrowUpRight
                    size={13}
                    className={
                      item.positive
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }
                  />

                  <span
                    className={
                      item.positive
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }
                  >
                    {item.change}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Insights */}
        <section className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  What needs attention
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Business signals
                </h2>
              </div>

              <p className="hidden text-xs text-gray-500 sm:block">
                Updated from current activity
              </p>
            </div>

            <div className="space-y-3">
              {insights.map((insight) => {
                const classes = getInsightClasses(insight.type);

                return (
                  <div
                    key={insight.title}
                    className={`border bg-white p-5 ${classes.border}`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center ${classes.icon}`}
                      >
                        {insight.type === 'warning' ? (
                          <CircleAlert size={17} />
                        ) : (
                          <Lightbulb size={17} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {insight.title}
                            </h3>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                              {insight.description}
                            </p>
                          </div>

                          {insight.metric && (
                            <span
                              className={`w-fit shrink-0 px-2 py-1 text-xs font-semibold ${classes.badge}`}
                            >
                              {insight.metric}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-900 hover:underline"
                        >
                          {insight.action}
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ask AI */}
          <aside>
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-emerald-900 text-white">
                    <MessageSquare size={16} />
                  </div>

                  <div>
                    <p className="font-semibold">Ask your CFO</p>
                    <p className="text-xs text-gray-500">
                      Ask about your business
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-5 space-y-3">
                  {messages.length === 0 ? (
                    <div className="border border-gray-200 bg-[#f1f1f1] p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-900">
                        <Bot size={14} />
                        AI CFO
                      </div>

                      <p className="text-sm leading-6 text-gray-600">
                        Ask me about your cash flow, expenses, sales,
                        inventory, or financial activity.
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`border p-4 ${
                          message.role === 'user'
                            ? 'ml-5 border-emerald-900 bg-emerald-900 text-white'
                            : 'mr-5 border-gray-200 bg-[#f1f1f1]'
                        }`}
                      >
                        <p className="text-sm leading-6">
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mb-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Try asking
                  </p>

                  <div className="space-y-2">
                    {suggestedQuestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleQuestion(item)}
                        className="flex w-full items-center justify-between border border-gray-200 px-3 py-3 text-left text-xs text-gray-700 transition hover:border-emerald-900 hover:bg-[#f1f1f1]"
                      >
                        <span>{item}</span>

                        <ChevronRight
                          size={14}
                          className="shrink-0 text-gray-400"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleQuestion();
                  }}
                  className="flex border border-gray-300 bg-white"
                >
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask your CFO..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="submit"
                    disabled={!question.trim()}
                    className="flex w-11 shrink-0 items-center justify-center border-l border-gray-300 text-emerald-900 transition hover:bg-[#f1f1f1] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Ask AI CFO"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </div>

            {/* Recent activity */}
            <div className="mt-4 border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock3 size={15} className="text-gray-500" />

                <h3 className="text-sm font-semibold">
                  Recent CFO observations
                </h3>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-emerald-900 pl-3">
                  <p className="text-xs font-medium">
                    Revenue is outpacing expenses
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    12 minutes ago
                  </p>
                </div>

                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="text-xs font-medium">
                    Inventory purchases increased
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    38 minutes ago
                  </p>
                </div>

                <div className="border-l-2 border-gray-300 pl-3">
                  <p className="text-xs font-medium">
                    Three products reached low stock
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Temporary data notice */}
        <section className="mt-8 border border-dashed border-gray-300 bg-white/60 p-4">
          <div className="flex gap-3">
            <CircleAlert
              size={16}
              className="mt-0.5 shrink-0 text-gray-500"
            />

            <div>
              <p className="text-xs font-semibold text-gray-700">
                Temporary CFO intelligence
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                The figures and AI observations on this page are temporary
                dashboard data. The production AI CFO should calculate
                insights from Monietar&apos;s live transactions, sales, cash
                vault, inventory, reports, and dual-currency data.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}