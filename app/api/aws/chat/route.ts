import { NextRequest, NextResponse } from 'next/server';

let AwsBedrockRuntimeClient: any = null;
let AwsInvokeModelCommand: any = null;

// Import AWS SDK
try {
  const awsSdk = await import("@aws-sdk/client-bedrock-runtime");
  AwsBedrockRuntimeClient = awsSdk.BedrockRuntimeClient;
  AwsInvokeModelCommand = awsSdk.InvokeModelCommand;
} catch (error: any) {
  throw new Error('AWS SDK not installed. Run: npm install @aws-sdk/client-bedrock-runtime');
}

export async function POST(request: NextRequest) {
  console.log('💰 Cash Flow AI API - Financial Analysis Specialized');
  
  try {
    const { message, context } = await request.json();
    
    console.log(`💼 Financial Query: "${message.substring(0, 100)}..."`);
    console.log(`📈 Cash Flow Context: ${context?.length || 0} chars`);
    
    // Validate AWS environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('❌ AWS credentials missing');
      return NextResponse.json({
        success: false,
        error: 'AWS credentials not configured',
        message: 'Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to .env.local',
        response: null
      }, { status: 400 });
    }
    
    const region = process.env.AWS_REGION || 'us-east-1';
    
    // Initialize AWS Bedrock client
    console.log('🔄 Initializing Financial AI client...');
    const bedrockClient = new AwsBedrockRuntimeClient({
      region: region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    
    console.log(`🌍 Using region: ${region}`);
    
    // Analyze financial query type
    const queryType = analyzeFinancialQueryType(message, context);
    console.log(`🔍 Financial Analysis Type: ${queryType.type} - ${queryType.confidence}% confidence`);
    
    // FINANCIAL MODELS ONLY - Optimized for cash flow analysis
    const financialModels = [
      {
        id: 'anthropic.claude-3-sonnet-20240229-v1:0',
        name: 'Claude 3 Sonnet',
        format: 'anthropic',
        maxTokens: 2000,
        temperature: 0.1, // Lower temperature for precise financial analysis
        description: 'Premium Financial Analysis - Best for complex calculations',
        priority: 1,
        provider: 'anthropic',
        isFree: false,
        costPer1KTokens: 3.00,
        specialty: 'Cash Flow Forecasting'
      },
      {
        id: 'anthropic.claude-3-haiku-20240307-v1:0',
        name: 'Claude 3 Haiku',
        format: 'anthropic',
        maxTokens: 2000,
        temperature: 0.15,
        description: 'Fast Financial Analysis - Quick insights and recommendations',
        priority: 2,
        provider: 'anthropic',
        isFree: false,
        costPer1KTokens: 0.25,
        specialty: 'Real-time Analysis'
      },
      {
        id: 'amazon.titan-text-premier-v1:0',
        name: 'Amazon Titan Financial',
        format: 'titan',
        maxTokens: 1500,
        temperature: 0.1,
        description: 'Amazon Financial AI - Optimized for cash flow analysis',
        priority: 3,
        provider: 'amazon',
        isFree: true,
        freeTokensPerMonth: 8000,
        specialty: 'Budget Analysis'
      }
    ];
    
    // Sort by priority
    financialModels.sort((a, b) => a.priority - b.priority);
    
    let lastError = null;
    
    for (const model of financialModels) {
      console.log(`💰 Trying ${model.provider.toUpperCase()} Financial Model: ${model.name}`);
      
      try {
        let params: any;
        
        switch (model.format) {
          case 'anthropic':
            // Specialized financial system prompt
            const systemPrompt = getFinancialSystemPrompt(queryType, context);
            
            params = {
              modelId: model.id,
              contentType: "application/json",
              accept: "application/json",
              body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: model.maxTokens,
                temperature: model.temperature,
                system: systemPrompt,
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: getFinancialPrompt(message, context, queryType)
                      }
                    ]
                  }
                ],
                top_p: 0.8 // Tighter for financial accuracy
              }),
            };
            break;
            
          case 'titan':
            params = {
              modelId: model.id,
              contentType: "application/json",
              accept: "application/json",
              body: JSON.stringify({
                inputText: getTitanFinancialPrompt(message, context, queryType),
                textGenerationConfig: {
                  maxTokenCount: model.maxTokens,
                  temperature: model.temperature,
                  topP: 0.8,
                  stopSequences: []
                }
              }),
            };
            break;
        }
        
        console.log(`📤 Sending for financial analysis to ${model.name}...`);
        const command = new AwsInvokeModelCommand(params);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        console.log(`📥 Received financial analysis from ${model.name}`);
        
        let financialResponse: string;
        
        // Extract response based on model format
        if (model.format === 'anthropic') {
          financialResponse = responseBody.content?.[0]?.text || 
                      getFinancialFallbackResponse(queryType, context);
        } else {
          // Titan format
          financialResponse = responseBody.results?.[0]?.outputText || 
                      getFinancialFallbackResponse(queryType, context);
        }
        
        // Post-process financial response for better formatting
        financialResponse = postProcessFinancialResponse(financialResponse, queryType, context);
        
        // Estimate token usage
        const inputTokens = Math.ceil(((context?.length || 0) + message.length) / 4);
        const outputTokens = Math.ceil(financialResponse.length / 4);
        const totalTokens = inputTokens + outputTokens;
        
        let estimatedCost = 'FREE 🎉';
        if (!model.isFree && model.costPer1KTokens) {
          estimatedCost = `~$${((totalTokens / 1000) * model.costPer1KTokens).toFixed(4)}`;
        }
        
        const modelIntelligence = model.id.includes('claude-3-sonnet') ? 'Expert' :
                                 model.id.includes('claude-3-haiku') ? 'Advanced' :
                                 model.id.includes('titan-text-premier') ? 'Professional' : 'Standard';
        
        return NextResponse.json({ 
          success: true,
          response: financialResponse,
          modelUsed: model.id,
          modelName: `${model.name} (${model.specialty})`,
          provider: model.provider,
          queryType: queryType.type,
          isFreeTier: model.isFree,
          tokenUsage: {
            input: inputTokens,
            output: outputTokens,
            total: totalTokens
          },
          estimatedCost: estimatedCost,
          modelIntelligence: modelIntelligence,
          contextWindow: `${model.maxTokens} tokens`,
          region: region,
          usesUserData: hasFinancialData(context),
          analysisType: queryType.type,
          financialMetrics: extractFinancialMetrics(financialResponse)
        });
        
      } catch (modelError: any) {
        console.error(`❌ ${model.name} failed:`, modelError.name);
        
        // Specific error handling
        if (modelError.name === 'AccessDeniedException') {
          console.log(`⚠️ ${model.name} requires access approval in AWS Console for financial analysis`);
        }
        
        lastError = modelError;
        continue; // Try next model
      }
    }
    
    // All financial models failed
    console.error('💥 All financial models failed');
    
    return NextResponse.json({
      success: false,
      error: 'All Financial AI models failed',
      suggestion: 'Enable Claude 3 Sonnet in AWS Bedrock for advanced financial analysis',
      quickFix: 'Use Amazon Titan Financial (auto-enabled) for basic cash flow analysis',
      steps: [
        '1. AWS Console → Amazon Bedrock',
        '2. Click "Model access"',
        '3. Request "Claude 3 Sonnet" for financial analysis',
        '4. Use case: "Cash Flow Management & Financial Advisory"',
        '5. Approval recommended for financial applications'
      ],
      lastError: lastError?.message,
      response: getFinancialFallbackResponse({ type: 'general' }, context)
    }, { status: 500 });
    
  } catch (error: any) {
    console.error('💥 Financial API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process financial analysis',
      suggestion: 'Check server logs and AWS configuration for financial AI',
      response: "I'm experiencing technical difficulties. Please try your financial query again or contact support for cash flow analysis."
    }, { status: 500 });
  }
}

// FINANCIAL SPECIALIZED HELPER FUNCTIONS

function analyzeFinancialQueryType(message: string, context?: string): {
  type: 'cashflow' | 'budgeting' | 'investment' | 'debt' | 'savings' | 'forecasting' | 'general_financial';
  confidence: number;
  keywords: string[];
} {
  const lowerMessage = message.toLowerCase();
  
  // CASH FLOW ANALYSIS
  const cashFlowWords = [
    'cash flow', 'cashflow', 'liquidity', 'working capital', 'operating cash',
    'net cash', 'cash position', 'cash balance', 'cash reserve',
    'monthly cash', 'weekly cash', 'daily cash', 'cash shortage',
    'cash surplus', 'cash management', 'cash planning', 'cash forecast',
    'burn rate', 'runway', 'cash runway', 'cash cycle', 'cash conversion',
    'receivables', 'payables', 'cash inflow', 'cash outflow', 'cash gap'
  ];
  
  const cashFlowKeywords = cashFlowWords.filter(word => lowerMessage.includes(word));
  if (cashFlowKeywords.length > 0) {
    return { 
      type: 'cashflow', 
      confidence: 95, 
      keywords: cashFlowKeywords 
    };
  }
  
  // BUDGETING ANALYSIS
  const budgetingWords = [
    'budget', 'spending', 'expense', 'cost', 'over budget', 'under budget',
    'budget allocation', 'budget planning', 'budget review', 'budget tracking',
    'expense management', 'cost control', 'spending pattern', 'budget variance',
    'budget adjustment', 'monthly budget', 'annual budget', 'budget category'
  ];
  
  const budgetingKeywords = budgetingWords.filter(word => lowerMessage.includes(word));
  if (budgetingKeywords.length > 0) {
    return { 
      type: 'budgeting', 
      confidence: 90, 
      keywords: budgetingKeywords 
    };
  }
  
  // INVESTMENT ANALYSIS
  const investmentWords = [
    'invest', 'investment', 'portfolio', 'returns', 'dividend', 'stock',
    'bond', 'mutual fund', 'real estate', 'crypto', 'savings', 'yield',
    'roi', 'return on investment', 'capital growth', 'asset allocation',
    'risk tolerance', 'investment strategy', 'diversification'
  ];
  
  const investmentKeywords = investmentWords.filter(word => lowerMessage.includes(word));
  if (investmentKeywords.length > 0) {
    return { 
      type: 'investment', 
      confidence: 90, 
      keywords: investmentKeywords 
    };
  }
  
  // DEBT MANAGEMENT
  const debtWords = [
    'debt', 'loan', 'credit', 'borrow', 'repayment', 'interest',
    'principal', 'debt payoff', 'debt consolidation', 'credit card',
    'overdraft', 'loan payment', 'debt free', 'debt reduction',
    'loan balance', 'credit score', 'debt to income'
  ];
  
  const debtKeywords = debtWords.filter(word => lowerMessage.includes(word));
  if (debtKeywords.length > 0) {
    return { 
      type: 'debt', 
      confidence: 90, 
      keywords: debtKeywords 
    };
  }
  
  // SAVINGS & GOALS
  const savingsWords = [
    'save', 'savings', 'emergency fund', 'retirement', 'goal',
    'target', 'milestone', 'nest egg', 'financial goal',
    'savings rate', 'savings target', 'accumulate', 'reserve'
  ];
  
  const savingsKeywords = savingsWords.filter(word => lowerMessage.includes(word));
  if (savingsKeywords.length > 0) {
    return { 
      type: 'savings', 
      confidence: 85, 
      keywords: savingsKeywords 
    };
  }
  
  // FORECASTING & PROJECTIONS
  const forecastingWords = [
    'forecast', 'projection', 'predict', 'future', 'next month',
    'next year', 'quarterly', 'annual', 'growth projection',
    'revenue forecast', 'expense forecast', 'profit projection',
    'scenario analysis', 'what if', 'planning', 'outlook'
  ];
  
  const forecastingKeywords = forecastingWords.filter(word => lowerMessage.includes(word));
  if (forecastingKeywords.length > 0) {
    return { 
      type: 'forecasting', 
      confidence: 85, 
      keywords: forecastingKeywords 
    };
  }
  
  // GENERAL FINANCIAL (covers money, income, profit, etc.)
  const generalFinancialWords = [
    'money', 'finance', 'financial', 'income', 'profit', 'revenue',
    'earnings', 'loss', 'revenue', 'capital', 'wealth', 'rich',
    'poor', 'broke', 'naira', '₦', 'ngn', 'dollar', 'usd', 'currency',
    'bank', 'account', 'transaction', 'payment', 'fee', 'charge',
    'price', 'value', 'worth', 'afford', 'expensive', 'cheap'
  ];
  
  const generalFinancialKeywords = generalFinancialWords.filter(word => lowerMessage.includes(word));
  if (generalFinancialKeywords.length > 0) {
    return { 
      type: 'general_financial', 
      confidence: 80, 
      keywords: generalFinancialKeywords 
    };
  }
  
  // Default to general financial for any business context
  return { type: 'general_financial', confidence: 60, keywords: [] };
}

function getFinancialSystemPrompt(queryType: any, context?: string): string {
  const baseIdentity = "You are Monietar Cash Flow AI, an expert financial analyst specializing in African business finance and cash flow management. ";
  
  const cashFlowExpertise = `EXPERT FINANCIAL ANALYST RULES:
1. ALWAYS analyze the provided financial data first
2. Calculate SPECIFIC cash flow metrics (burn rate, runway, liquidity ratios)
3. Provide ACTIONABLE recommendations with EXACT numbers
4. Focus on AFRICAN context (informal economy, FX volatility, local challenges)
5. Include 3-6 month cash flow projections when possible
6. Calculate percentages, growth rates, and financial ratios
7. Use structured financial analysis format
8. Prioritize liquidity and working capital management

RESPONSE STRUCTURE:
1. [CASH FLOW ASSESSMENT] Immediate liquidity position
2. [KEY METRICS] Burn rate, runway, working capital ratio
3. [ACTION PLAN] 3-5 specific steps with timelines
4. [RISK ANALYSIS] Potential cash flow risks
5. [FORECAST] Short-term cash flow projection`;

  switch (queryType.type) {
    case 'cashflow':
      return baseIdentity + `CASH FLOW SPECIALIST MODE\n` + cashFlowExpertise + `
SPECIAL FOCUS:
• Daily/Weekly/Monthly cash position tracking
• Cash conversion cycle optimization
• Working capital management
• Receivables/Payables timing
• Emergency liquidity buffers`;
    
    case 'budgeting':
      return baseIdentity + `BUDGET ANALYST MODE\n` + cashFlowExpertise + `
SPECIAL FOCUS:
• Zero-based budgeting principles
• Variable vs fixed cost analysis
• Budget variance explanations
• Cost reduction opportunities
• Departmental budget allocations`;
    
    case 'investment':
      return baseIdentity + `INVESTMENT ANALYST MODE\n` + cashFlowExpertise + `
SPECIAL FOCUS:
• Return on Investment (ROI) calculations
• Risk-adjusted returns
• Portfolio diversification
• Investment timing
• African market opportunities`;
    
    case 'debt':
      return baseIdentity + `DEBT MANAGEMENT SPECIALIST\n` + cashFlowExpertise + `
SPECIAL FOCUS:
• Debt-to-Income ratios
• Interest cost optimization
• Debt consolidation strategies
• Credit score improvement
• Negotiation tactics with lenders`;
    
    case 'savings':
      return baseIdentity + `SAVINGS & GOALS ANALYST\n` + cashFlowExpertise + `
SPECIAL FOCUS:
• Compound interest calculations
• Savings rate optimization
• Goal-based savings plans
• Emergency fund sizing
• Automated savings strategies`;
    
    case 'forecasting':
      return baseIdentity + `FINANCIAL FORECASTING EXPERT\n` + cashFlowExpertise + `
SPECIAL FOCUS:
• Scenario analysis (best/worst case)
• Seasonal adjustments
• Growth rate projections
• Sensitivity analysis
• Contingency planning`;
    
    default: // 'general_financial'
      return baseIdentity + `GENERAL FINANCIAL ANALYST\n` + cashFlowExpertise + `
DEFAULT BEHAVIOR:
• Analyze all available financial data
• Provide comprehensive financial assessment
• Calculate key performance indicators
• Offer holistic financial guidance
• Ask clarifying questions if data is insufficient`;
  }
}

function getFinancialPrompt(message: string, context?: string, queryType?: any): string {
  if (!queryType) queryType = analyzeFinancialQueryType(message, context);
  
  const hasData = hasFinancialData(context);
  const dataContext = hasData ? 
    `USER'S FINANCIAL DASHBOARD (CASH FLOW DATA):\n${context}\n\n` : 
    "NO FINANCIAL DATA: User needs to add transactions for cash flow analysis.\n\n";
  
  const analysisRequest = `FINANCIAL ANALYSIS REQUEST: "${message}"\n\n`;
  const expertInstructions = getExpertInstructions(queryType);
  
  return dataContext + analysisRequest + expertInstructions;
}

function getExpertInstructions(queryType: any): string {
  switch (queryType.type) {
    case 'cashflow':
      return `AS CASH FLOW EXPERT: Analyze liquidity position, calculate burn rate and cash runway, identify immediate cash flow risks, and provide 30-60-90 day cash flow projections with specific action steps.`;
    
    case 'budgeting':
      return `AS BUDGET ANALYST: Review spending patterns, identify budget variances, recommend cost optimization strategies, and provide reallocation suggestions with specific percentage targets.`;
    
    case 'investment':
      return `AS INVESTMENT ANALYST: Assess risk tolerance, calculate potential returns, suggest portfolio allocation, and provide timing recommendations with specific African market insights.`;
    
    case 'debt':
      return `AS DEBT MANAGEMENT SPECIALIST: Analyze debt structure, calculate total interest costs, recommend payoff strategies, and provide negotiation tactics with specific payment schedules.`;
    
    case 'savings':
      return `AS SAVINGS ANALYST: Calculate optimal savings rate, project compound growth, recommend account types, and provide automated savings strategies with specific monthly targets.`;
    
    case 'forecasting':
      return `AS FORECASTING EXPERT: Create financial projections, analyze growth scenarios, identify key assumptions, and provide sensitivity analysis with specific quarterly forecasts.`;
    
    default:
      return `AS FINANCIAL ANALYST: Conduct comprehensive financial assessment, calculate key metrics, identify improvement opportunities, and provide actionable recommendations with specific numbers.`;
  }
}

function getTitanFinancialPrompt(message: string, context?: string, queryType?: any): string {
  if (!queryType) queryType = analyzeFinancialQueryType(message, context);
  
  let analysisType = "COMPREHENSIVE FINANCIAL ANALYSIS";
  let focusAreas = "1. Cash flow assessment 2. Budget analysis 3. Financial projections 4. Risk assessment";
  
  switch (queryType.type) {
    case 'cashflow':
      analysisType = "CASH FLOW ANALYSIS";
      focusAreas = "1. Liquidity position 2. Burn rate calculation 3. Cash runway 4. Working capital";
      break;
    case 'budgeting':
      analysisType = "BUDGET ANALYSIS";
      focusAreas = "1. Spending patterns 2. Budget variances 3. Cost optimization 4. Allocation review";
      break;
    case 'investment':
      analysisType = "INVESTMENT ANALYSIS";
      focusAreas = "1. ROI calculation 2. Risk assessment 3. Portfolio allocation 4. Market timing";
      break;
    case 'debt':
      analysisType = "DEBT MANAGEMENT ANALYSIS";
      focusAreas = "1. Debt structure 2. Interest costs 3. Payoff strategy 4. Credit improvement";
      break;
    case 'savings':
      analysisType = "SAVINGS ANALYSIS";
      focusAreas = "1. Savings rate 2. Compound growth 3. Goal planning 4. Automation strategies";
      break;
    case 'forecasting':
      analysisType = "FINANCIAL FORECASTING";
      focusAreas = "1. Revenue projections 2. Expense forecasts 3. Scenario analysis 4. Growth planning";
      break;
  }
  
  return `[ROLE] You are Monietar Cash Flow AI, expert financial analyst
${hasFinancialData(context) ? `[FINANCIAL DATA] ${context}` : '[NO DATA] Please add transactions for analysis'}
[ANALYSIS TYPE] ${analysisType}
[FOCUS AREAS] ${focusAreas}
[USER QUERY] "${message}"
[ANALYSIS REQUIREMENTS] 1. Use specific numbers 2. Calculate metrics 3. African context 4. Actionable steps
[RESPONSE FORMAT] Structured financial analysis with clear recommendations:`;
}

function getFinancialFallbackResponse(queryType: any, context?: string): string {
  const hasData = hasFinancialData(context);
  
  if (!hasData) {
    return `📊 **FINANCIAL ANALYSIS READY**\n\nI'm Monietar Cash Flow AI, your financial analysis specialist.\n\nTo begin personalized cash flow analysis:\n\n🔹 **Step 1: Add Your Financial Data**\n• Income transactions\n• Expense records\n• Current balances\n• Budget targets\n\n🔹 **Step 2: Specify Analysis Type**\n• Cash flow projections\n• Budget optimization\n• Investment planning\n• Debt management\n• Savings strategies\n\n🔹 **Step 3: Receive Expert Analysis**\n• Burn rate calculation\n• Cash runway estimation\n• Working capital analysis\n• Financial ratio assessment\n• Actionable recommendations\n\n**Next:** Start by adding your first transaction or share specific financial goals.`;
  }
  
  switch (queryType.type) {
    case 'cashflow':
      return `💰 **CASH FLOW ANALYSIS**\n\nBased on your financial data:\n\n**Liquidity Assessment:**\n• Immediate cash position: Review needed\n• Monthly burn rate: Calculate with transactions\n• Cash runway: Determine sustainability\n\n**Action Plan:**\n1. Track daily cash inflows/outflows\n2. Calculate 3-month cash flow projection\n3. Establish minimum cash reserve\n4. Optimize payment terms\n\n**Key Metrics to Calculate:**\n• Current Ratio = Current Assets / Current Liabilities\n• Quick Ratio = (Cash + Receivables) / Current Liabilities\n• Cash Conversion Cycle = DIO + DSO - DPO`;
    
    case 'budgeting':
      return `📋 **BUDGET ANALYSIS**\n\n**Budget Review Framework:**\n1. **Fixed vs Variable Costs:** Categorize all expenses\n2. **Spending Patterns:** Identify trends and anomalies\n3. **Budget Variance:** Compare actual vs planned\n4. **Optimization:** Find 10-20% reduction opportunities\n\n**Immediate Actions:**\n• Review top 3 expense categories\n• Negotiate recurring costs\n• Implement spending approvals\n• Set category-specific limits`;
    
    case 'investment':
      return `📈 **INVESTMENT ANALYSIS**\n\n**Investment Assessment:**\n• Current allocation review needed\n• Risk tolerance evaluation\n• Return expectations\n• Time horizon consideration\n\n**African Market Opportunities:**\n1. **Short-term:** Money market funds (10-15% yield)\n2. **Medium-term:** Government bonds (15-20%)\n3. **Long-term:** Equity investments (20-30%+)\n\n**Action Steps:**\n• Diversify across 3-5 asset classes\n• Consider dollar-cost averaging\n• Review quarterly performance`;
    
    case 'debt':
      return `💳 **DEBT MANAGEMENT ANALYSIS**\n\n**Debt Assessment Framework:**\n1. **Debt Inventory:** List all liabilities with interest rates\n2. **Interest Analysis:** Calculate total annual interest cost\n3. **Cash Flow Impact:** Monthly debt service requirements\n4. **Priority Ranking:** High-interest debt first\n\n**Optimization Strategies:**\n• Debt consolidation for rates above 20%\n• Balance transfer opportunities\n• Negotiate lower interest rates\n• Accelerate principal payments`;
    
    case 'savings':
      return `🏦 **SAVINGS ANALYSIS**\n\n**Savings Strategy:**\n• **Emergency Fund:** 3-6 months of expenses\n• **Goal-Based Savings:** Specific targets with timelines\n• **Automation:** Pay yourself first (10-20% of income)\n• **Compound Growth:** Early and consistent contributions\n\n**Calculations Needed:**\n• Monthly savings capacity\n• Time to reach goals\n• Required savings rate\n• Impact of increased contributions`;
    
    case 'forecasting':
      return `🔮 **FINANCIAL FORECASTING**\n\n**Forecasting Framework:**\n1. **Historical Analysis:** 6-12 month trend review\n2. **Growth Assumptions:** Conservative/realistic/optimistic\n3. **Seasonal Adjustments:** Peak/off-peak variations\n4. **Scenario Planning:** Best/worst case outcomes\n\n**Projection Elements:**\n• Monthly revenue forecasts\n• Variable cost projections\n• Cash flow timing\n• Break-even analysis\n• Growth rate calculations`;
    
    default:
      return `📊 **COMPREHENSIVE FINANCIAL ANALYSIS**\n\n**Financial Health Assessment:**\nBased on your dashboard data:\n\n1. **Profitability Analysis:**\n• Gross profit margin calculation\n• Net profit margin assessment\n• Return on assets/investment\n\n2. **Liquidity Analysis:**\n• Current and quick ratios\n• Working capital position\n• Cash flow adequacy\n\n3. **Efficiency Analysis:**\n• Expense to income ratio\n• Revenue per transaction\n• Cost structure optimization\n\n4. **Growth Analysis:**\n• Month-over-month growth\n• Revenue diversification\n• Market opportunity assessment\n\n**Next:** Please ask specific financial questions for detailed analysis.`;
  }
}

function postProcessFinancialResponse(response: string, queryType: any, context?: string): string {
  // Remove any unwanted prefixes
  let processed = response.replace(/^(AI:|Assistant:|Bot:|Monietar AI:|Response:)/i, '').trim();
  
  // Add financial analysis markers
  if (!processed.includes('💰') && !processed.includes('📊') && !processed.includes('📈')) {
    const emoji = queryType.type === 'cashflow' ? '💰' : 
                  queryType.type === 'investment' ? '📈' : 
                  queryType.type === 'budgeting' ? '📋' : '📊';
    processed = `${emoji} **FINANCIAL ANALYSIS**\n\n${processed}`;
  }
  
  // Ensure currency context
  if (hasFinancialData(context) && !processed.includes('₦') && !processed.includes('NGN')) {
    processed = processed.replace('Based on your data', 'Based on your ₦ financial data');
  }
  
  // Add structured formatting if missing
  if (!processed.includes('\n\n**') && processed.length > 200) {
    const lines = processed.split('\n');
    if (lines.length > 4) {
      processed = lines[0] + '\n\n' + lines.slice(1).join('\n');
    }
  }
  
  // Remove excessive line breaks but keep financial structure
  processed = processed.replace(/\n{4,}/g, '\n\n');
  
  return processed;
}

function hasFinancialData(context?: string): boolean {
  if (!context) return false;
  const lowerContext = context.toLowerCase();
  return (
    lowerContext.includes('income') ||
    lowerContext.includes('expense') ||
    lowerContext.includes('profit') ||
    lowerContext.includes('revenue') ||
    lowerContext.includes('₦') ||
    lowerContext.includes('naira') ||
    lowerContext.includes('salary') ||
    lowerContext.includes('budget') ||
    lowerContext.includes('cash') ||
    lowerContext.includes('transaction') ||
    /\d+/.test(context) // Has numbers
  );
}

function extractFinancialMetrics(response: string): {
  hasCalculations: boolean;
  hasPercentages: boolean;
  hasCurrency: boolean;
  hasRecommendations: boolean;
  wordCount: number;
} {
  const hasCalculations = /\d+\.?\d*\s*[+\-*/]\s*\d+\.?\d*/g.test(response) || 
                         /calculate|calculation|compute/g.test(response.toLowerCase());
  
  const hasPercentages = /%\s*\d+|percent|percentage/g.test(response.toLowerCase());
  
  const hasCurrency = /₦|NGN|\$|USD|€|EUR|CFA|naira|dollar|euro/g.test(response);
  
  const hasRecommendations = /recommend|suggest|advise|action|step|plan/g.test(response.toLowerCase());
  
  const wordCount = response.split(/\s+/).length;
  
  return {
    hasCalculations,
    hasPercentages,
    hasCurrency,
    hasRecommendations,
    wordCount
  };
}