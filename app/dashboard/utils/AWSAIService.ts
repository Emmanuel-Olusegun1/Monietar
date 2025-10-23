import { awsBedrockService, awsTokenManager } from './aws-config';

export class AWSAIService {
  
  async analyzeFinancialData(
    userQuestion: string,
    financialData: any,
    session: any,
    usePremium: boolean = false
  ): Promise<{ response: string; tokensUsed: boolean; tokensRemaining: number }> {
    
    try {
      const prompt = this.createFinancialPrompt(userQuestion, financialData);
      const aiResponse = await awsBedrockService.analyzeFinancialPrompt(prompt, usePremium);

      // Update token usage
      const userId = session?.user?.id;
      if (userId) {
        await awsTokenManager.updateTokenUsage(userId, 1);
      }

      const tokenStatus = await awsTokenManager.getTokenStatus(userId || 'default');

      return {
        response: aiResponse,
        tokensUsed: true,
        tokensRemaining: tokenStatus.tokensRemaining
      };
      
    } catch (error: any) {
      console.error('AWS AI service error:', error);
      throw new Error(`AI service unavailable: ${error.message}`);
    }
  }

  private createFinancialPrompt(userQuestion: string, financialData: any): string {
    return `
      You are a financial advisor analyzing business financial data.

      FINANCIAL OVERVIEW:
      - Income: $${financialData.income || 0}
      - Expenses: $${financialData.expenses || 0}
      - Profit: $${financialData.profit || 0}
      - Transactions: ${financialData.transactions?.length || 0}
      - Budgets: ${financialData.budgets?.length || 0}

      QUESTION: ${userQuestion}

      Provide practical, actionable financial advice.
    `;
  }
}

export const awsAIService = new AWSAIService();