'use client';

import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface AIExecutiveSummaryProps {
  darkMode: boolean;
  recommendations: string[];
}

export default function AIExecutiveSummary({
  darkMode,
  recommendations,
}: AIExecutiveSummaryProps) {
  const insights =
    recommendations.length > 0
      ? recommendations
      : [
          'Revenue increased compared to the previous period.',
          'Cash flow remains healthy.',
          'Continue monitoring operational expenses.',
        ];

  return (
    <section
      className={`rounded-[28px] border overflow-hidden ${
        darkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-[#E8ECE6] bg-white'
      }`}
    >
      {/* Header */}

      <div className="bg-gradient-to-r from-[#0F3B23] to-[#1C5F39] px-7 py-6 text-white">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

            <Sparkles size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              AI Executive Summary
            </h2>

            <p className="mt-1 text-sm text-emerald-100">
              Your AI CFO's analysis of today's business performance.
            </p>

          </div>

        </div>

      </div>

      {/* Summary */}

      <div className="space-y-6 p-7">

        <div className="rounded-2xl bg-[#F7FAF8] p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">

              <TrendingUp
                size={22}
                className="text-emerald-700"
              />

            </div>

            <div>

              <h3 className="font-semibold text-[#14361F]">
                Business Outlook
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-600">
                Your business is maintaining a healthy financial
                position with positive cash flow and stable
                profitability. Continue focusing on revenue growth
                while keeping operating expenses under control.
              </p>

            </div>

          </div>

        </div>

        {/* Recommendations */}

        <div>

          <h3 className="mb-5 text-lg font-bold text-[#14361F]">
            AI Recommendations
          </h3>

          <div className="space-y-4">

            {insights.map((item, index) => (

              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-[#ECEEE8] p-5 transition hover:shadow-md"
              >

                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">

                  <CheckCircle2
                    size={18}
                    className="text-emerald-700"
                  />

                </div>

                <div className="flex-1">

                  <p className="leading-7 text-gray-700">
                    {item}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Warning */}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex items-start gap-4">

            <AlertTriangle
              className="mt-1 text-amber-600"
              size={22}
            />

            <div>

              <h4 className="font-semibold text-amber-900">
                AI Observation
              </h4>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                This analysis is generated from your current
                financial records. More transaction data will
                improve forecasting accuracy over time.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-[#ECEEE8] bg-[#FAFBF9] px-7 py-5">

        <button className="flex items-center gap-2 font-semibold text-[#0F3B23] transition hover:gap-3">

          View Full AI Report

          <ArrowRight size={18} />

        </button>

      </div>

    </section>
  );
}