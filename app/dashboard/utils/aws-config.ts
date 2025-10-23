import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Configure AWS clients
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export class AWSBedrockService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = bedrockClient;
  }

  async invokeModel(params: {
    modelId: string;
    body: string;
  }): Promise<any> {
    const command = new InvokeModelCommand({
      modelId: params.modelId,
      contentType: "application/json",
      accept: "application/json",
      body: params.body
    });

    const response = await this.client.send(command);
    return JSON.parse(new TextDecoder().decode(response.body));
  }

  async analyzeFinancialPrompt(prompt: string, usePremium: boolean = false): Promise<string> {
    const modelId = usePremium 
      ? 'anthropic.claude-3-sonnet-20240229-v1:0'
      : 'anthropic.claude-3-haiku-20240307-v1:0';

    const input = {
      modelId,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    };

    const result = await this.invokeModel(input);
    return result.content[0].text;
  }
}

export class AWSTokenManager {
  private ddb: DynamoDBDocumentClient;

  constructor() {
    this.ddb = ddbDocClient;
  }

  async getTokenStatus(userId: string): Promise<{
    tokensRemaining: number;
    totalTokens: number;
    resetTime: Date;
    percentage: number;
  }> {
    try {
      const command = new GetCommand({
        TableName: 'user-tokens',
        Key: { userId }
      });

      const result = await this.ddb.send(command);
      
      if (result.Item) {
        return {
          tokensRemaining: result.Item.tokensRemaining || 5,
          totalTokens: result.Item.totalTokens || 5,
          resetTime: new Date(result.Item.resetTime || Date.now() + 24 * 60 * 60 * 1000),
          percentage: result.Item.percentage || 100
        };
      }
      
      return this.createDefaultTokenStatus();
    } catch (error) {
      console.error('Error getting token status:', error);
      return this.createDefaultTokenStatus();
    }
  }

  async updateTokenUsage(userId: string, tokensUsed: number): Promise<void> {
    try {
      const command = new UpdateCommand({
        TableName: 'user-tokens',
        Key: { userId },
        UpdateExpression: 'SET tokensRemaining = if_not_exists(tokensRemaining, :default) - :used, lastUpdated = :now',
        ExpressionAttributeValues: {
          ':used': tokensUsed,
          ':now': new Date().toISOString(),
          ':default': 5
        }
      });

      await this.ddb.send(command);
    } catch (error) {
      console.error('Error updating token usage:', error);
      // Don't throw error for token tracking failures
    }
  }

  private createDefaultTokenStatus() {
    return {
      tokensRemaining: 5,
      totalTokens: 5,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      percentage: 100
    };
  }
}

export const awsBedrockService = new AWSBedrockService();
export const awsTokenManager = new AWSTokenManager();