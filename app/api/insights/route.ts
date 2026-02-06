// app/api/insights/route.ts - Server-side personalized insights
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

type Tx = {
  id?: string;
  type?: 'income' | 'expense';
  amount?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
};

type Budget = {
  id?: string;
  category?: string;
  budget_limit?: number;
  spent?: number;
  period?: string;
};

type InsightsPayload = {
  userId?: string;
  currency?: string;
  income?: number;
  expenses?: number;
  profit?: number;
  transactions?: Tx[];
  budgets?: Budget[];
};

const MODEL = 'amazon/nova-2-lite-v1:free';

function summarizeTransactions(transactions: Tx[]) {
  const expenseByCategory: Record<string, number> = {};
  const incomeByCategory: Record<string, number> = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const category = tx.category || 'Uncategorized';

    if (tx.type === 'expense') {
      expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
    } else if (tx.type === 'income') {
      incomeByCategory[category] = (incomeByCategory[category] || 0) + amount;
    }
  });

  const topExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  const topIncome = Object.entries(incomeByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({ category, amount }));

  return { topExpenses, topIncome };
}

function summarizeBudgets(budgets: Budget[]) {
  const alerts = budgets.filter((b) => {
    const limit = Number(b.budget_limit) || 0;
    const spent = Number(b.spent) || 0;
    if (!limit) return false;
    return spent >= limit * 0.8;
  });

  const exceeded = alerts.filter((b) => (Number(b.spent) || 0) >= (Number(b.budget_limit) || 0));

  return {
    totalBudgets: budgets.length,
    alerts: alerts.map((b) => ({
      category: b.category || 'Uncategorized',
      spent: Number(b.spent) || 0,
      limit: Number(b.budget_limit) || 0,
      status: (Number(b.spent) || 0) >= (Number(b.budget_limit) || 0) ? 'exceeded' : 'warning'
    })),
    exceededCount: exceeded.length
  };
}

function localFallbackInsights(payload: Required<InsightsPayload>): string[] {
  const insights: string[] = [];
  const income = payload.income;
  const expenses = payload.expenses;
  const profit = payload.profit;
  const savingsRate = income > 0 ? (profit / income) * 100 : 0;

  if (income > 0) {
    insights.push(`Your savings rate is ${savingsRate.toFixed(1)}%. Aim for 15–25% if possible.`);
  }

  if (expenses > income && income > 0) {
    insights.push(`Expenses are higher than income. Consider trimming your top spending category this month.`);
  }

  const budgetSummary = summarizeBudgets(payload.budgets);
  if (budgetSummary.exceededCount > 0) {
    insights.push(`${budgetSummary.exceededCount} budget(s) exceeded. Review limits for the categories over budget.`);
  } else if (budgetSummary.totalBudgets > 0) {
    insights.push(`Great job staying within budgets. Keep monitoring your highest‑spend categories.`);
  } else {
    insights.push(`Set up a few budgets to track your biggest spending categories.`);
  }

  return insights.slice(0, 4);
}

async function queryOpenRouter(prompt: string) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Title': 'Monietar AI Insights'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a financial coach. Provide 3-5 concise, personalized insights. Use plain language, no jargon. Use the provided currency code, not symbols.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 300
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return text;
}

function parseInsights(text: string): string[] {
  const lines = text
    .split('\n')
    .map((line: string) => line.replace(/^[-•\d.\s]+/, '').trim())
    .filter(Boolean);

  return lines.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as InsightsPayload;
    const safePayload: Required<InsightsPayload> = {
      userId: payload.userId || '',
      currency: payload.currency || 'NGN',
      income: Number(payload.income) || 0,
      expenses: Number(payload.expenses) || 0,
      profit: Number(payload.profit) || 0,
      transactions: payload.transactions || [],
      budgets: payload.budgets || []
    };

    const { topExpenses, topIncome } = summarizeTransactions(safePayload.transactions);
    const budgetSummary = summarizeBudgets(safePayload.budgets);

    const prompt = [
      `Currency: ${safePayload.currency}`,
      `Income: ${safePayload.income}`,
      `Expenses: ${safePayload.expenses}`,
      `Profit: ${safePayload.profit}`,
      `Top income categories: ${JSON.stringify(topIncome)}`,
      `Top expense categories: ${JSON.stringify(topExpenses)}`,
      `Budget summary: ${JSON.stringify(budgetSummary)}`
    ].join('\n');

    try {
      const aiText = await queryOpenRouter(prompt);
      const insights = parseInsights(aiText);

      if (insights.length > 0) {
        return NextResponse.json({ success: true, insights, provider: 'OpenRouter' });
      }
    } catch (aiError) {
      console.error('AI insights failed:', aiError);
    }

    const fallbackInsights = localFallbackInsights(safePayload);
    return NextResponse.json({ success: true, insights: fallbackInsights, provider: 'Monietar Fallback' });
  } catch (error: any) {
    console.error('Insights API error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to generate insights' }, { status: 500 });
  }
}
