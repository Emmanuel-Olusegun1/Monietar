import { motion } from 'framer-motion';
import { Zap, Clock, AlertCircle, Crown } from 'lucide-react';

interface TokenStatusProps {
  tokenStatus: {
    tokensRemaining: number;
    totalTokens: number;
    resetTime: Date;
    percentage: number;
  };
  darkMode: boolean;
  onUpgradeClick?: () => void;
}

export const TokenStatus: React.FC<TokenStatusProps> = ({
  tokenStatus,
  darkMode,
  onUpgradeClick
}) => {
  const { tokensRemaining, totalTokens, resetTime, percentage } = tokenStatus;
  
  const isLow = tokensRemaining <= 2;
  const isCritical = tokensRemaining === 0;
  
  const now = new Date();
  const timeUntilReset = resetTime.getTime() - now.getTime();
  const hoursUntilReset = Math.max(0, Math.floor(timeUntilReset / (1000 * 60 * 60)));
  const minutesUntilReset = Math.max(0, Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60)));

  const getResetText = () => {
    if (hoursUntilReset > 0) {
      return `Resets in ${hoursUntilReset}h ${minutesUntilReset}m`;
    }
    return `Resets in ${minutesUntilReset}m`;
  };

  return (
    <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg border backdrop-blur-sm ${
      darkMode 
        ? 'bg-gray-800/50 border-gray-600' 
        : 'bg-white/50 border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`p-1 rounded-full ${
          isCritical 
            ? 'bg-red-500/20 text-red-500' 
            : isLow
            ? 'bg-amber-500/20 text-amber-500'
            : 'bg-green-500/20 text-green-500'
        }`}>
          <Zap className="w-4 h-4" />
        </div>
        
        <div className="flex flex-col min-w-[100px]">
          <span className={`text-sm font-medium ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {tokensRemaining}/{totalTokens} AI Tokens
          </span>
          <span className={`text-xs flex items-center space-x-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{getResetText()}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-[120px]">
        <div className={`w-full h-2 rounded-full overflow-hidden ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              isCritical 
                ? 'bg-red-500' 
                : isLow
                ? 'bg-amber-500'
                : 'bg-green-500'
            }`}
          />
        </div>
      </div>

      {isCritical ? (
        <button
          onClick={onUpgradeClick}
          className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
        >
          <Crown className="w-3 h-3" />
          <span>Upgrade</span>
        </button>
      ) : isLow ? (
        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
          darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
        }`}>
          <AlertCircle className="w-3 h-3" />
          <span>Low</span>
        </div>
      ) : null}
    </div>
  );
};