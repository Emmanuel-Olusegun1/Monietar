// components/GeminiStatus.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, Zap, AlertCircle, CheckCircle, 
  Battery, BatteryCharging, BatteryFull,
  RefreshCw, Globe, Shield, TrendingUp
} from 'lucide-react';

interface GeminiStatusProps {
  darkMode?: boolean;
  onModelChange?: (model: 'pro' | 'flash') => void;
}

export default function GeminiStatus({ darkMode = true, onModelChange }: GeminiStatusProps) {
  const [selectedModel, setSelectedModel] = useState<'pro' | 'flash'>('pro');
  const [usageStats, setUsageStats] = useState({
    dailyRequests: 0,
    dailyLimit: 50,
    monthlyTokens: 0,
    monthlyLimit: 1000000,
    responseTime: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsageStats();
    const interval = setInterval(fetchUsageStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/usage');
      const data = await response.json();
      setUsageStats(data);
    } catch (error) {
      console.error('Failed to fetch usage stats');
    }
  };

  const handleModelChange = (model: 'pro' | 'flash') => {
    setSelectedModel(model);
    if (onModelChange) onModelChange(model);
  };

  const dailyPercentage = (usageStats.dailyRequests / usageStats.dailyLimit) * 100;
  const monthlyPercentage = (usageStats.monthlyTokens / usageStats.monthlyLimit) * 100;

  const getBatteryIcon = (percentage: number) => {
    if (percentage > 80) return <Battery className="w-4 h-4 text-red-400" />;
    if (percentage > 50) return <BatteryCharging className="w-4 h-4 text-yellow-400" />;
    return <BatteryFull className="w-4 h-4 text-emerald-400" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage > 80) return 'text-red-400';
    if (percentage > 50) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <div className={`rounded-xl p-5 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'} border ${darkMode ? 'border-gray-700/30' : 'border-gray-300/30'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Google Gemini AI</h3>
            <p className="text-sm opacity-75 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Powered by Google's latest AI
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'} text-emerald-500`}>
            <Shield className="w-3 h-3 inline mr-1" />
            Free Tier Active
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3">Select AI Model</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleModelChange('pro')}
            className={`p-4 rounded-lg border transition-all ${
              selectedModel === 'pro'
                ? 'border-blue-500/50 bg-blue-500/10'
                : 'border-gray-700/30 hover:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">Gemini Pro</div>
                <div className="text-xs opacity-75">Advanced analysis</div>
              </div>
            </div>
            <div className="text-xs opacity-75">
              Best for complex financial analysis and detailed reports
            </div>
          </button>
          
          <button
            onClick={() => handleModelChange('flash')}
            className={`p-4 rounded-lg border transition-all ${
              selectedModel === 'flash'
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-gray-700/30 hover:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-gradient-to-r from-green-500 to-emerald-500">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">Gemini Flash</div>
                <div className="text-xs opacity-75">Fast responses</div>
              </div>
            </div>
            <div className="text-xs opacity-75">
              Perfect for quick questions and simple analysis
            </div>
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              {getBatteryIcon(dailyPercentage)}
              <span>Daily Requests</span>
            </div>
            <span className={getStatusColor(dailyPercentage)}>
              {usageStats.dailyRequests} / {usageStats.dailyLimit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-800/50 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                dailyPercentage > 80 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : dailyPercentage > 50
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
              }`}
              style={{ width: `${dailyPercentage}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              {getBatteryIcon(monthlyPercentage)}
              <span>Monthly Tokens</span>
            </div>
            <span className={getStatusColor(monthlyPercentage)}>
              {(usageStats.monthlyTokens / 1000).toFixed(0)}K / {(usageStats.monthlyLimit / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-800/50 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                monthlyPercentage > 80 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : monthlyPercentage > 50
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}
              style={{ width: `${monthlyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-700/30">
        <div className="text-center">
          <div className="text-xs opacity-75 mb-1">Avg Response</div>
          <div className="font-medium text-emerald-400">
            {usageStats.responseTime || '0'}ms
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs opacity-75 mb-1">Model</div>
          <div className="font-medium">
            {selectedModel === 'pro' ? 'Pro' : 'Flash'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs opacity-75 mb-1">Status</div>
          <div className="font-medium text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </div>
        </div>
      </div>
      
      {/* Refresh Button */}
      <button
        onClick={fetchUsageStats}
        disabled={isLoading}
        className="w-full mt-4 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-700/30 transition-all flex items-center justify-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="text-sm">Refresh Stats</span>
      </button>
    </div>
  );
}