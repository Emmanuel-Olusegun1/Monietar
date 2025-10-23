import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export class TokenManager {
  private static readonly DAILY_TOKENS = 5;
  private static readonly TOKEN_RESET_HOURS = 24;

  static async checkTokens(session: any): Promise<{ hasTokens: boolean; tokensRemaining: number; resetTime: Date }> {
    if (!session?.user?.id) {
      return { hasTokens: false, tokensRemaining: 0, resetTime: new Date() };
    }

    try {
      const today = new Date().toDateString();
      const tokenKey = `ai_tokens_${session.user.id}_${today}`;
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(tokenKey);
        if (stored) {
          const data = JSON.parse(stored);
          return { 
            hasTokens: data.tokens > 0, 
            tokensRemaining: data.tokens,
            resetTime: new Date(data.resetTime)
          };
        }
      }

      const { data, error } = await supabase
        .from('user_ai_tokens')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .single();

      if (error || !data) {
        return await this.initializeDailyTokens(session.user.id);
      }

      const tokensRemaining = data.tokens_remaining;
      const resetTime = new Date(data.reset_time);

      if (typeof window !== 'undefined') {
        localStorage.setItem(tokenKey, JSON.stringify({
          tokens: tokensRemaining,
          resetTime: resetTime.toISOString()
        }));
      }

      return { 
        hasTokens: tokensRemaining > 0, 
        tokensRemaining,
        resetTime 
      };

    } catch (error) {
      console.error('Token check error:', error);
      return { hasTokens: false, tokensRemaining: 0, resetTime: new Date() };
    }
  }

  static async useToken(session: any): Promise<{ success: boolean; tokensRemaining: number; resetTime: Date }> {
    if (!session?.user?.id) {
      return { success: false, tokensRemaining: 0, resetTime: new Date() };
    }

    try {
      const today = new Date().toDateString();
      const tokenKey = `ai_tokens_${session.user.id}_${today}`;
      
      const current = await this.checkTokens(session);
      
      if (!current.hasTokens) {
        return { 
          success: false, 
          tokensRemaining: current.tokensRemaining, 
          resetTime: current.resetTime 
        };
      }

      const newTokenCount = current.tokensRemaining - 1;

      const { error } = await supabase
        .from('user_ai_tokens')
        .update({ 
          tokens_remaining: newTokenCount,
          last_used: new Date().toISOString()
        })
        .eq('user_id', session.user.id)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      if (error) {
        throw error;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(tokenKey, JSON.stringify({
          tokens: newTokenCount,
          resetTime: current.resetTime.toISOString()
        }));
      }

      return { 
        success: true, 
        tokensRemaining: newTokenCount, 
        resetTime: current.resetTime 
      };

    } catch (error) {
      console.error('Token usage error:', error);
      return { success: false, tokensRemaining: 0, resetTime: new Date() };
    }
  }

  private static async initializeDailyTokens(userId: string): Promise<{ hasTokens: boolean; tokensRemaining: number; resetTime: Date }> {
    const resetTime = new Date();
    resetTime.setHours(resetTime.getHours() + 24);
    resetTime.setMinutes(0, 0, 0);

    try {
      const { error } = await supabase
        .from('user_ai_tokens')
        .insert({
          user_id: userId,
          tokens_remaining: this.DAILY_TOKENS,
          reset_time: resetTime.toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      const tokenKey = `ai_tokens_${userId}_${new Date().toDateString()}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem(tokenKey, JSON.stringify({
          tokens: this.DAILY_TOKENS,
          resetTime: resetTime.toISOString()
        }));
      }

      return { 
        hasTokens: true, 
        tokensRemaining: this.DAILY_TOKENS, 
        resetTime 
      };

    } catch (error) {
      console.error('Token initialization error:', error);
      return { hasTokens: false, tokensRemaining: 0, resetTime: new Date() };
    }
  }

  static async getTokenStatus(session: any): Promise<{
    tokensRemaining: number;
    totalTokens: number;
    resetTime: Date;
    percentage: number;
  }> {
    const status = await this.checkTokens(session);
    
    return {
      tokensRemaining: status.tokensRemaining,
      totalTokens: this.DAILY_TOKENS,
      resetTime: status.resetTime,
      percentage: (status.tokensRemaining / this.DAILY_TOKENS) * 100
    };
  }
}