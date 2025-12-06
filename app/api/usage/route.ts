// app/api/usage/route.ts
export const dynamic = 'force-static';

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store (use Redis/DB in production)
const usageStore = {
  dailyRequests: 0,
  monthlyTokens: 0,
  lastReset: new Date(),
  responseTimes: [] as number[]
};

export async function GET(request: NextRequest) {
  // Reset counters if new day
  const now = new Date();
  if (now.getDate() !== usageStore.lastReset.getDate()) {
    usageStore.dailyRequests = 0;
    usageStore.lastReset = now;
  }
  
  // Calculate average response time
  const avgResponseTime = usageStore.responseTimes.length > 0
    ? Math.round(usageStore.responseTimes.reduce((a, b) => a + b, 0) / usageStore.responseTimes.length)
    : 0;
  
  return NextResponse.json({
    dailyRequests: usageStore.dailyRequests,
    dailyLimit: 50, // Gemini free tier daily limit
    monthlyTokens: usageStore.monthlyTokens,
    monthlyLimit: 1000000, // 1M tokens free per month
    responseTime: avgResponseTime,
    lastUpdated: now.toISOString()
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tokens, responseTime } = body;
  
  // Update usage
  usageStore.dailyRequests += 1;
  usageStore.monthlyTokens += tokens || 0;
  
  if (responseTime) {
    usageStore.responseTimes.push(responseTime);
    // Keep only last 100 entries
    if (usageStore.responseTimes.length > 100) {
      usageStore.responseTimes.shift();
    }
  }
  
  return NextResponse.json({ success: true });
}