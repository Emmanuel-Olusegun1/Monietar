// test-bedrock-new.js
require('dotenv').config();

async function testBedrock() {
  try {
    console.log('🚀 Testing AWS Bedrock (New Model Access)...\n');
    
    // Check environment variables
    console.log('📋 Environment Check:');
    console.log('AWS_REGION:', process.env.AWS_REGION || 'us-east-1');
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
    
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('\n❌ Please set AWS credentials in .env.local file');
      return;
    }

    // Test AWS credentials first
    console.log('\n1. 🔑 Testing AWS Credentials...');
    const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
    
    const stsClient = new STSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const identity = await stsClient.send(new GetCallerIdentityCommand({}));
    console.log('✅ AWS Credentials Valid!');
    console.log('   Account:', identity.Account);
    console.log('   User:', identity.Arn.split('/').pop());

    // Test Bedrock directly
    console.log('\n2. 🤖 Testing Bedrock Claude Model...');
    const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

    const bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Test with Claude Haiku (free tier friendly)
    const testPrompt = {
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 200,
        temperature: 0.5,
        messages: [{
          role: "user",
          content: "You are Monietar, a financial advisor. Please respond with a short financial tip for small business owners. Keep it under 2 sentences."
        }]
      })
    };

    console.log('   Sending request to Claude Haiku...');
    const command = new InvokeModelCommand(testPrompt);
    const response = await bedrockClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ Bedrock AI Response Successful!');
    console.log('   🤖 AI:', result.content[0].text.trim());
    console.log('   Model:', testPrompt.modelId);

    // Test DynamoDB
    console.log('\n3. 💾 Testing DynamoDB Setup...');
    const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
    
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const tables = await dynamoClient.send(new ListTablesCommand({}));
    console.log('✅ DynamoDB Access Working!');
    console.log('   Tables in region:', tables.TableNames.length);
    
    if (tables.TableNames.includes('user-tokens')) {
      console.log('   ✅ user-tokens table exists');
    } else {
      console.log('   ⚠️  user-tokens table not found (will be created automatically)');
    }

    console.log('\n🎉 ALL SYSTEMS GO! Your AWS setup is working perfectly.');
    console.log('\n📝 Next Steps:');
    console.log('   1. Your Bedrock access is automatically enabled ✅');
    console.log('   2. AWS credentials are valid ✅');
    console.log('   3. You can now use AI features in your dashboard ✅');
    console.log('   4. DynamoDB table will be created on first use ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.name);
    console.log('   Error:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('\n💡 Solution: Your IAM user needs these permissions:');
      console.log('   - AmazonBedrockFullAccess');
      console.log('   - AmazonDynamoDBFullAccess');
    } else if (error.name === 'ResourceNotFoundException') {
      console.log('\n💡 Solution: First-time Anthropic users may need to:');
      console.log('   1. Go to Bedrock Console → Playground');
      console.log('   2. Try using a Claude model there first');
      console.log('   3. This triggers the initial setup process');
    } else if (error.name.includes('Token') || error.name.includes('Signature')) {
      console.log('\n💡 Solution: Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    }
  }
}

testBedrock();