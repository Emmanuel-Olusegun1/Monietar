// app/api/chat/route.ts - USING OPENROUTER SDK WITH FINANCIAL CONTEXT
export const dynamic = 'force-static';

import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter } from "@openrouter/sdk";

type ResponseStyle = 'simple' | 'balanced' | 'professional';

// Free models on OpenRouter
const FREE_MODELS = [
  'amazon/nova-2-lite-v1:free',      // Free Amazon Nova Lite
  'google/gemini-2.0-flash-exp:free', // Free Gemini Flash
  'mistralai/mistral-7b-instruct:free', // Free Mistral
  'huggingfaceh4/zephyr-7b-beta:free', // Free Zephyr
  'meta-llama/llama-3.2-3b-instruct:free', // Free Llama 3.2
];

// Paid models (if you upgrade)
const PAID_MODELS = [
  'anthropic/claude-3.5-sonnet:beta',
  'openai/gpt-4o',
  'google/gemini-2.0-pro-exp-02-05:free',
  'meta-llama/llama-3.1-70b-instruct:nitro',
];

// African currencies
const AFRICAN_CURRENCIES = [
  'NGN', // Nigerian Naira
  'KES', // Kenyan Shilling
  'GHS', // Ghanaian Cedi
  'ZAR', // South African Rand
  'EGP', // Egyptian Pound
  'CFA', // West African CFA Franc
  'USD', // US Dollar (commonly used)
  'EUR', // Euro (common in some regions)
];

export async function POST(request: NextRequest) {
  console.log('🚀 Monietar AI - Powered by OpenRouter (Africa Focused)');
  
  try {
    const formData = await request.formData();
    const message = formData.get('message') as string;
    const context = formData.get('context') as string;
    const style = (formData.get('style') as ResponseStyle) || 'balanced';
    const modelPreference = formData.get('model') as string || 'free';

    if (!message?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 });
    }

    console.log(`📝 Query: ${message.substring(0, 100)}...`);
    console.log(`🎨 Style: ${style}`);
    console.log(`🤖 Model Preference: ${modelPreference}`);
    console.log(`📊 Has Financial Context: ${!!context && context !== "NO FINANCIAL DATA"}`);

    // Select model based on preference and API key availability
    const selectedModel = modelPreference === 'pro' && process.env.OPENROUTER_API_KEY 
      ? PAID_MODELS[0] 
      : FREE_MODELS[0];

    try {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY not configured. Get free key at https://openrouter.ai');
      }

      // Determine if we should use the financial context
      const shouldUseFinancialContext = shouldIncludeFinancialData(message, context);
      
      const openrouterResponse = await queryOpenRouterStreaming(
        message, 
        shouldUseFinancialContext ? context : null,
        style, 
        selectedModel
      );
      
      return NextResponse.json({
        success: true,
        response: openrouterResponse.text,
        model: openrouterResponse.model,
        provider: 'OpenRouter',
        style: style,
        costEstimate: {
          inputTokens: openrouterResponse.inputTokens,
          outputTokens: openrouterResponse.outputTokens,
          reasoningTokens: openrouterResponse.reasoningTokens,
          totalTokens: openrouterResponse.totalTokens,
          estimatedCost: openrouterResponse.estimatedCost,
          isFreeTier: selectedModel.includes(':free')
        },
        tokensUsed: openrouterResponse.totalTokens,
        performance: {
          responseTime: openrouterResponse.responseTime,
          model: selectedModel,
          reasoningTokens: openrouterResponse.reasoningTokens
        },
        usedFinancialContext: shouldUseFinancialContext
      });
      
    } catch (openrouterError: any) {
      console.error('❌ OpenRouter failed:', openrouterError.message);
      
      // Fallback to non-streaming API
      try {
        const fallbackResponse = await queryOpenRouterSimple(message, context, style);
        
        return NextResponse.json({
          success: true,
          response: fallbackResponse.text,
          model: fallbackResponse.model,
          provider: 'OpenRouter (Fallback)',
          style: style,
          costEstimate: {
            inputTokens: fallbackResponse.inputTokens,
            outputTokens: fallbackResponse.outputTokens,
            reasoningTokens: fallbackResponse.reasoningTokens,
            totalTokens: fallbackResponse.totalTokens,
            estimatedCost: fallbackResponse.estimatedCost,
            isFreeTier: true
          },
          tokensUsed: fallbackResponse.totalTokens,
          fallback: true,
          fallbackReason: openrouterError.message
        });
        
      } catch (simpleError) {
        // Final fallback to smart financial responses
        return NextResponse.json({
          success: true,
          response: getSmartFinancialResponse(message, style, context),
          model: 'monietar-ai',
          provider: 'Monietar Financial Engine',
          style: style,
          costEstimate: {
            inputTokens: 0,
            outputTokens: 0,
            reasoningTokens: 0,
            totalTokens: 0,
            estimatedCost: '0.000000',
            isFreeTier: true
          },
          tokensUsed: 0,
          fallback: true,
          fallbackReason: 'Using built-in financial knowledge'
        });
      }
    }

  } catch (error: any) {
    console.error('💥 API Error:', error);
    
    return NextResponse.json({
      success: false,
      response: getErrorFallback(),
      provider: 'Error Recovery',
      error: error.message || 'Unknown error'
    }, { status: 200 });
  }
}

// Determine if financial context should be included based on user's question
function shouldIncludeFinancialData(message: string, context: string): boolean {
  if (!context || context === "NO FINANCIAL DATA") {
    return false;
  }
  
  const lowerMessage = message.toLowerCase();
  
  // Financial-related keywords that indicate we should use the context
  const financialKeywords = [
    // Money and finances
    'money', 'finance', 'financial', 'cash', 'income', 'expense', 'expenses',
    'spend', 'spending', 'budget', 'budgeting', 'save', 'saving', 'savings',
    'invest', 'investment', 'portfolio', 'debt', 'loan', 'credit',
    'profit', 'loss', 'revenue', 'earnings', 'revenue',
    
    // Analysis and advice
    'analyze', 'analysis', 'advice', 'suggestion', 'recommend', 'recommendation',
    'improve', 'optimize', 'better', 'help with', 'what should', 'how can',
    'review', 'evaluate', 'assess', 'plan', 'strategy',
    
    // Specific questions
    'how much', 'how many', 'what is my', 'what are my', 'where should',
    'should i', 'can i', 'could i', 'would you', 'do you think',
    
    // Comparison and goals
    'compare', 'comparison', 'goal', 'target', 'objective', 'progress',
    'performance', 'growth', 'increase', 'decrease', 'reduce', 'cut',
    
    // Categories and types
    'category', 'categories', 'type', 'types', 'expense', 'expenses',
    'income', 'incomes', 'source', 'sources', 'pattern', 'patterns'
  ];
  
  // Check if any financial keyword is in the message
  return financialKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Query OpenRouter with Streaming (using direct fetch for better compatibility)
async function queryOpenRouterStreaming(
  message: string,
  financialContext: string | null,
  style: ResponseStyle,
  model: string = FREE_MODELS[0]
): Promise<{
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
  estimatedCost: string;
  responseTime: number;
}> {
  const startTime = Date.now();
  
  try {
    // Use direct fetch API for streaming - more reliable than SDK
    const systemPrompt = getSystemPrompt(style, financialContext);
    
    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    // Add financial context if available and relevant
    if (financialContext && shouldIncludeFinancialData(message, financialContext)) {
      messages.push({
        role: "user",
        content: `Here is my current financial situation:\n\n${financialContext}\n\nNow, based on this information: ${message}`
      });
    } else {
      messages.push({
        role: "user",
        content: message
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Monietar AI Financial Assistant'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true,
        temperature: getTemperatureForStyle(style),
        max_tokens: getMaxTokensForStyle(style)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let responseText = '';
    let usageData: any = null;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                responseText += parsed.choices[0].delta.content;
              }
              if (parsed.usage) {
                usageData = parsed.usage;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    }

    const responseTime = Date.now() - startTime;
    
    console.log(`✅ OpenRouter streaming response received in ${responseTime}ms`);
    console.log(`💰 Used financial context: ${!!financialContext}`);
    
    const isFreeModel = model.includes(':free');
    const estimatedCost = isFreeModel ? '0.000000' : calculateCost(
      usageData?.prompt_tokens || 0,
      usageData?.completion_tokens || 0,
      usageData?.reasoning_tokens || 0,
      model
    );
    
    return {
      text: responseText.trim() || 'No response received',
      model: model,
      inputTokens: usageData?.prompt_tokens || 0,
      outputTokens: usageData?.completion_tokens || 0,
      reasoningTokens: usageData?.reasoning_tokens || 0,
      totalTokens: usageData?.total_tokens || 0,
      estimatedCost,
      responseTime
    };
    
  } catch (error: any) {
    console.error('OpenRouter streaming error:', error);
    // Fallback to non-streaming if streaming fails
    return queryOpenRouterSimple(message, financialContext, style);
  }
}

// Alternative: Query OpenRouter without streaming (more compatible)
async function queryOpenRouterSimple(
  message: string,
  financialContext: string | null,
  style: ResponseStyle
): Promise<{
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
  estimatedCost: string;
  responseTime: number;
}> {
  const startTime = Date.now();
  
  const systemPrompt = getSystemPrompt(style, financialContext);
  
  // Build messages array
  const messages: any[] = [
    {
      role: "system",
      content: systemPrompt
    }
  ];

  // Add financial context if available and relevant
  if (financialContext && shouldIncludeFinancialData(message, financialContext)) {
    messages.push({
      role: "user",
      content: `Here is my current financial situation:\n\n${financialContext}\n\nNow, based on this information: ${message}`
    });
  } else {
    messages.push({
      role: "user",
      content: message
    });
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Monietar AI Financial Assistant'
    },
    body: JSON.stringify({
      model: FREE_MODELS[0],
      messages: messages,
      temperature: getTemperatureForStyle(style),
      max_tokens: getMaxTokensForStyle(style)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;
  
  console.log(`✅ OpenRouter simple response received in ${responseTime}ms`);
  console.log(`💰 Used financial context: ${!!financialContext}`);
  
  return {
    text: data.choices[0]?.message?.content || 'No response',
    model: data.model || FREE_MODELS[0],
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    reasoningTokens: data.usage?.reasoning_tokens || 0,
    totalTokens: data.usage?.total_tokens || 0,
    estimatedCost: '0.000000', // Free model
    responseTime
  };
}

// System prompt generator - Africa Focused with financial context awareness
function getSystemPrompt(style: ResponseStyle, financialContext: string | null): string {
  let basePrompt = `You are Monietar AI, a world-class financial coach specializing in African markets.

CORE IDENTITY:
• Expert in: cash flow management, budgeting, savings strategies, debt management, investments, tax optimization
• Analyzes financial documents and provides data-driven insights
• Focuses on practical, actionable advice for real-world financial improvement
• Encouraging but realistic, optimistic but not naive

AFRICAN FINANCIAL EXPERTISE:
• Knowledge of major African currencies: ${AFRICAN_CURRENCIES.join(', ')}
• Understanding of African banking systems, mobile money (M-Pesa, MTN Mobile Money, etc.)
• Familiar with African investment opportunities (T-bills, stock markets, real estate, agriculture)
• Awareness of regional economic factors across Africa
• Knowledge of tax laws and compliance requirements in various African countries

CULTURAL UNDERSTANDING:
• Respects diverse African cultures and business practices
• Considers informal economies and small business dynamics
• Understands remittance patterns and diaspora engagement
• Familiar with community-based financial systems (susu, stokvel, etc.)
• Acknowledges varying levels of financial literacy across regions

IMPORTANT INSTRUCTION:`;

  if (financialContext && !financialContext.includes("NO FINANCIAL DATA")) {
    basePrompt += `

FINANCIAL CONTEXT INSTRUCTION:
When the user provides their financial data, you MUST:
1. Reference their specific numbers when giving advice
2. Base recommendations on their actual income, expenses, and profit
3. Consider their specific expense categories and patterns
4. Factor in their budget adherence if they have budgets
5. Personalize all suggestions to their financial situation
6. Compare their current performance to healthy financial benchmarks
7. Use their currency format when discussing amounts

Example: Instead of "You should save 20% of income", say "Based on your current income of ₦500,000, aim to save ₦100,000 (20%) monthly"`;
  }

  if (style === 'simple') {
    return basePrompt + `

COMMUNICATION REQUIREMENTS:
1. Reply in VERY SIMPLE English, like talking to a friend
2. Use short sentences only (max 15 words)
3. Avoid all financial jargon - explain like I'm new to finance
4. Use local currency names (naira, shilling, cedi, rand) instead of symbols
5. Keep it friendly and encouraging
6. Use bullet points only if absolutely necessary
7. Focus on one main idea at a time
8. Use African cultural references and local examples
9. Consider varying education levels across Africa
10. Be practical and solution-oriented`;
  }

  if (style === 'professional') {
    return basePrompt + `

COMMUNICATION REQUIREMENTS:
1. Use proper financial terminology and industry standards
2. Include specific calculations, formulas, and data analysis
3. Structure response with clear hierarchical headings
4. Use tables for comparative data when applicable
5. Include relevant financial ratios and metrics
6. Provide data-driven, actionable recommendations
7. Be formal but approachable in tone
8. Reference authoritative sources and financial principles
9. Include risk assessment and mitigation strategies
10. Provide clear next steps with timelines
11. Consider cross-border financial implications
12. Address regulatory considerations for African markets`;
  }

  return basePrompt + `

COMMUNICATION REQUIREMENTS:
1. Be clear, helpful, and educational
2. Explain financial terms in simple terms when first used
3. Use bullet points for clarity when listing multiple items
4. Maintain a natural, friendly but knowledgeable tone
5. Provide practical, actionable advice
6. Include real-world African examples and scenarios
7. Balance depth with accessibility
8. Highlight key takeaways
9. Suggest additional resources if relevant
10. Consider both formal and informal financial systems`;
}

// Calculate estimated cost (for paid models)
function calculateCost(
  inputTokens: number,
  outputTokens: number,
  reasoningTokens: number,
  model: string
): string {
  // Approximate costs per 1M tokens
  const costs: Record<string, { input: number; output: number; reasoning: number }> = {
    'anthropic/claude-3.5-sonnet': { input: 3.0, output: 15.0, reasoning: 3.0 }, // $ per 1M
    'openai/gpt-4o': { input: 5.0, output: 15.0, reasoning: 0 },
    'google/gemini-2.0-pro': { input: 0.125, output: 0.375, reasoning: 0 },
    'meta-llama/llama-3.1-70b': { input: 0.59, output: 0.79, reasoning: 0 },
  };

  const modelKey = Object.keys(costs).find(key => model.includes(key));
  if (!modelKey) return '0.000000'; // Free or unknown model

  const cost = costs[modelKey];
  const totalCost = (
    (inputTokens / 1_000_000) * cost.input +
    (outputTokens / 1_000_000) * cost.output +
    ((reasoningTokens || 0) / 1_000_000) * (cost.reasoning || cost.input)
  );

  return totalCost.toFixed(6);
}

// Smart financial responses (fallback when API fails) with context awareness
function getSmartFinancialResponse(message: string, style: ResponseStyle, context: string | null): string {
  const lower = message.toLowerCase();
  const hasFinancialData = context && !context.includes("NO FINANCIAL DATA");
  
  // Parse financial data from context if available
  let income = 0, expenses = 0, profit = 0, transactionCount = 0;
  if (hasFinancialData) {
    // Extract numbers from context (simple parsing)
    const incomeMatch = context.match(/Total Income: (?:[^\d]*)([\d,]+)/);
    const expensesMatch = context.match(/Total Expenses: (?:[^\d]*)([\d,]+)/);
    const profitMatch = context.match(/Net (?:Profit|Loss): (?:[^\d]*)([\d,]+)/);
    const transactionMatch = context.match(/Transaction Count: (\d+)/);
    
    income = incomeMatch ? parseFloat(incomeMatch[1].replace(/,/g, '')) : 0;
    expenses = expensesMatch ? parseFloat(expensesMatch[1].replace(/,/g, '')) : 0;
    profit = profitMatch ? parseFloat(profitMatch[1].replace(/,/g, '')) : 0;
    transactionCount = transactionMatch ? parseInt(transactionMatch[1]) : 0;
  }
  
  // Common African financial questions
  if (lower.includes('budget') || lower.includes('spend')) {
    if (hasFinancialData) {
      const savingsRate = income > 0 ? ((profit / income) * 100).toFixed(1) : '0';
      const expenseRatio = income > 0 ? ((expenses / income) * 100).toFixed(1) : '0';
      
      return `# Budget Analysis Based on Your Data 💰\n\n## Your Current Situation:\n• **Income:** ${income.toLocaleString()}\n• **Expenses:** ${expenses.toLocaleString()}\n• **Savings Rate:** ${savingsRate}%\n• **Expense-to-Income Ratio:** ${expenseRatio}%\n\n## Recommendations:\n\n### Immediate Actions:\n1. **Track spending** for 2 weeks\n2. **Categorize expenses** to identify patterns\n3. **Set realistic budgets** for top spending categories\n\n### African-Specific Tips:\n• Use mobile money apps for tracking\n• Consider informal savings groups (susu/stokvel)\n• Factor in seasonal variations in income/expenses\n\n### Goal Setting:\n• Aim for 20% savings rate\n• Reduce expense ratio to 70% or less\n• Build 3-6 month emergency fund`;
    }
  }
  
  if (lower.includes('invest') || lower.includes('save')) {
    const monthlySavings = profit > 0 ? profit : 0;
    
    return `# Smart Saving & Investing in Africa 📈\n\n${hasFinancialData ? `## Based on your current monthly savings: **${monthlySavings.toLocaleString()}**\n\n` : ''}## Options Available:\n\n### For Small Amounts (${hasFinancialData ? `~${Math.floor(monthlySavings * 0.3).toLocaleString()}` : '₦5,000-₦20,000'} monthly):\n• **Mobile Money Savings** (M-Shwari, etc.)\n• **Government Bonds** (minimum ₦5,000)\n• **Cooperative Savings** (community-based)\n\n### For Medium Amounts (${hasFinancialData ? `~${Math.floor(monthlySavings * 0.6).toLocaleString()}` : '₦50,000+'} monthly):\n• **Stock Markets** (NSE, JSE, GSE)\n• **Real Estate** (REITs or small properties)\n• **Agriculture Investments**\n\n💡 **African Pro Tip:** Start with 3-6 months emergency fund first!`;
  }
  
  if (lower.includes('debt') || lower.includes('loan')) {
    return `# Managing Debt in Africa 🏦\n\n## Strategy Based on ${hasFinancialData ? 'Your Income' : 'Typical Incomes'}:\n\n### High-Interest First:\n1. List all debts with interest rates\n2. Pay minimum on all debts\n3. Extra money goes to highest interest debt\n\n### Common African Debt Sources:\n• **Mobile Loans** (high interest, short term)\n• **Bank Loans** (lower rates, longer terms)\n• **Family/Friends** (no interest but relationships)\n• **Cooperatives** (community-based lending)\n\n${hasFinancialData && income > 0 ? `\n### Based on Your Income:\n• Safe debt payment: ${Math.floor(income * 0.3).toLocaleString()} monthly\n• Emergency fund target: ${Math.floor(expenses * 3).toLocaleString()}` : ''}`;
  }
  
  if (lower.includes('cash flow') || lower.includes('cashflow')) {
    if (hasFinancialData) {
      const monthlyCashFlow = profit;
      const positiveCashFlow = profit > 0;
      
      return `# Cash Flow Analysis 💸\n\n## Your Current Cash Flow:\n• **Monthly Income:** ${income.toLocaleString()}\n• **Monthly Expenses:** ${expenses.toLocaleString()}\n• **Monthly Cash Flow:** ${monthlyCashFlow.toLocaleString()} (${positiveCashFlow ? 'Positive ✅' : 'Negative ⚠️'})\n\n## Recommendations:\n\n${positiveCashFlow ? `### Building on Positive Cash Flow:\n1. **Save ${Math.floor(monthlyCashFlow * 0.5).toLocaleString()}** monthly\n2. **Invest ${Math.floor(monthlyCashFlow * 0.3).toLocaleString()}**\n3. **Use ${Math.floor(monthlyCashFlow * 0.2).toLocaleString()}** for debt/opportunities` : `### Fixing Negative Cash Flow:\n1. **Reduce expenses by ${Math.floor((Math.abs(profit)/expenses)*100)}%**\n2. **Increase income through side hustles**\n3. **Negotiate better terms with creditors**`}\n\n### African Context:\n• Consider seasonal income variations\n• Build cash reserves for lean periods\n• Use mobile money for better tracking`;
    }
  }
  
  // Default response with or without data
  return `# Welcome to Monietar AI - Your African Financial Companion! 🌍\n\nI'm here to help you manage your finances across African markets.\n\n${hasFinancialData ? `## Your Financial Snapshot:\n• **Income:** ${income.toLocaleString()}\n• **Expenses:** ${expenses.toLocaleString()}\n• **Transactions:** ${transactionCount}\n• **Status:** ${profit >= 0 ? 'Positive cash flow ✅' : 'Needs attention ⚠️'}\n\n` : '## Get Started:\nAdd transactions to get personalized insights!\n\n'}## Quick Questions to Ask:\n1. "How can I reduce my expenses?"\n2. "What's the best investment for me?"\n3. "How do I create a budget?"\n4. "Should I pay off debt or save first?"\n\n💡 **African Wisdom:** "Little by little, the bird builds its nest."`;
}

function getErrorFallback(): string {
  return `# Setup OpenRouter 🔑\n\n## Get Free API Key:\n1. Visit https://openrouter.ai\n2. Sign up (free credits included)\n3. Copy API key\n4. Add to .env.local:\n\n\`\`\`env\nOPENROUTER_API_KEY=your_key_here\n\`\`\`\n\n## Current Mode: Built-in African financial guidance active.\n\n🌍 **Ask me about African finance, savings, investments, or budgeting!**`;
}

// Helper functions
function getTemperatureForStyle(style: ResponseStyle): number {
  switch (style) {
    case 'simple': return 0.7;
    case 'balanced': return 0.5;
    case 'professional': return 0.3;
    default: return 0.5;
  }
}

function getMaxTokensForStyle(style: ResponseStyle): number {
  switch (style) {
    case 'simple': return 512;
    case 'balanced': return 1024;
    case 'professional': return 2048;
    default: return 1024;
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    provider: 'OpenRouter',
    free_models: FREE_MODELS,
    paid_models: PAID_MODELS,
    african_focus: {
      currencies: AFRICAN_CURRENCIES,
      features: [
        'Mobile money integration',
        'Informal economy awareness',
        'Regional investment knowledge',
        'Cross-border financial advice',
        'Financial context awareness'
      ]
    },
    context_features: [
      'Automatic financial data inclusion',
      'Personalized recommendations',
      'Currency-aware advice',
      'African market consideration'
    ],
    setup: {
      step1: 'Get free API key at https://openrouter.ai',
      step2: 'Add OPENROUTER_API_KEY to .env.local',
      step3: 'Restart server'
    }
  });
}