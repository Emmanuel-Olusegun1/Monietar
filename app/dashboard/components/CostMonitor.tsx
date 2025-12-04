'use client';

import { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface CostMonitorProps {
  darkMode?: boolean;
}

export default function CostMonitor({ darkMode = true }: CostMonitorProps) {
  const [costData, setCostData] = useState({
    totalRequests: 0,
    estimatedCost: 0,
    freeTierUsed: 0,
    freeTierRemaining: 100000, // 100K tokens free/month
    lastModelUsed: ''
  });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('monietar_cost_data');
    if (saved) {
      setCostData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('monietar_cost_data', JSON.stringify(costData));
  }, [costData]);

  const formatCost = (cost: number) => {
    if (cost === 0) return 'FREE';
    return `$${cost.toFixed(6)}`;
  };

  const getCostColor = () => {
    if (costData.estimatedCost === 0) return 'text-green-400';
    if (costData.estimatedCost < 0.01) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className={`w-5 h-5 ${getCostColor()}`} />
          <h3 className="font-semibold">AI Cost Monitor</h3>
        </div>
        <div className={`text-sm ${costData.estimatedCost === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
          {costData.estimatedCost === 0 ? 'FREE' : 'LOW COST'}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Free Tier Used</span>
            <span>{Math.round(costData.freeTierUsed / 1000)}K / 100K tokens</span>
          </div>
          <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              style={{ width: `${Math.min(100, (costData.freeTierUsed / 100000) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
            <div className="text-xs opacity-75">Total Requests</div>
            <div className="text-lg font-semibold">{costData.totalRequests}</div>
          </div>
          
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
            <div className="text-xs opacity-75">Estimated Cost</div>
            <div className={`text-lg font-semibold ${getCostColor()}`}>
              {formatCost(costData.estimatedCost)}
            </div>
          </div>
        </div>
        
        {costData.lastModelUsed && (
          <div className={`text-sm p-2 rounded ${darkMode ? 'bg-gray-900/50' : 'bg-gray-200/50'}`}>
            <span className="opacity-75">Last model: </span>
            <span className="font-medium">{costData.lastModelUsed}</span>
          </div>
        )}
        
        <div className={`text-xs p-3 rounded ${darkMode ? 'bg-gray-900/50' : 'bg-gray-200/50'}`}>
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Cost Saving Tips:</p>
              <ul className="space-y-1 opacity-75">
                <li>• Using free tier models when available</li>
                <li>• Keeping responses concise</li>
                <li>• Batch similar questions</li>
                <li>• Monitor usage monthly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}