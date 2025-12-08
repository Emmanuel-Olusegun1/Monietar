export const dynamic = 'force-static';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🩺 AWS Bedrock Health Check');
  
  const health = {
    timestamp: new Date().toISOString(),
    status: 'checking' as 'checking' | 'healthy' | 'unhealthy',
    awsConfigured: false,
    hasCredentials: false,
    region: process.env.AWS_REGION || 'us-east-1',
    issues: [] as string[],
    freeModels: [
      {
        id: 'anthropic.claude-instant-v1',
        name: 'Claude Instant',
        freeTokensPerMonth: 100000,
        description: '100K tokens free per month'
      },
      {
        id: 'amazon.titan-text-lite-v1',
        name: 'Amazon Titan Text Lite',
        freeTokensPerMonth: 8000,
        description: '8K tokens free per month'
      },
      {
        id: 'amazon.titan-text-express-v1',
        name: 'Amazon Titan Text Express',
        freeTokensPerMonth: 8000,
        description: '8K tokens free per month'
      }
    ],
    setupSteps: [
      '1. Sign in to AWS Console',
      '2. Go to Amazon Bedrock',
      '3. Click "Model access"',
      '4. Request free tier models',
      '5. Start using!'
    ]
  };
  
  try {
    // Check environment variables
    if (!process.env.AWS_ACCESS_KEY_ID) {
      health.issues.push('AWS_ACCESS_KEY_ID not set in .env.local');
    }
    
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      health.issues.push('AWS_SECRET_ACCESS_KEY not set in .env.local');
    }
    
    health.hasCredentials = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    
    if (!health.hasCredentials) {
      health.status = 'unhealthy';
      return NextResponse.json(health);
    }
    
    // Validate region
    const validRegions = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1'];
    if (!validRegions.includes(health.region)) {
      health.issues.push(`Region ${health.region} may not support free models. Try: ${validRegions.join(', ')}`);
    }
    
    // Check if SDK is available
    try {
      await import("@aws-sdk/client-bedrock-runtime");
      console.log('✅ AWS SDK is available');
      
      health.awsConfigured = true;
      health.status = 'healthy';
      
      console.log(`✅ AWS Bedrock configured in region: ${health.region}`);
      
    } catch (importError: any) {
      health.issues.push(`AWS SDK not installed: ${importError.message}`);
      health.status = 'unhealthy';
    }
    
  } catch (error: any) {
    console.error('❌ Health check failed:', error);
    health.issues.push(`Health check error: ${error.message}`);
    health.status = 'unhealthy';
  }
  
  return NextResponse.json(health);
}