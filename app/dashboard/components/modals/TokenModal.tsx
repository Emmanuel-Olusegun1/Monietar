import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Crown, Zap, X, Clock, Star } from 'lucide-react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenStatus: {
    tokensRemaining: number;
    totalTokens: number;
    resetTime: Date;
  };
  darkMode: boolean;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  tokenStatus,
  darkMode
}) => {
  const plans = [
    {
      name: "Free",
      tokens: 5,
      price: "$0",
      features: ["5 AI tokens per day", "Standard analysis", "Basic support"],
      current: true
    },
    {
      name: "Pro",
      tokens: 50,
      price: "$9.99",
      features: ["50 AI tokens per day", "Premium AI models", "Advanced analytics", "Priority support"],
      popular: true
    },
    {
      name: "Business",
      tokens: 200,
      price: "$29.99",
      features: ["200 AI tokens per day", "All premium features", "Custom models", "Dedicated support"]
    }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl p-6 rounded-2xl shadow-2xl z-50 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <Crown className={`w-6 h-6 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <Dialog.Title className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    AI Token Management
                  </Dialog.Title>
                  <Dialog.Description className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Upgrade your plan for more AI capabilities
                  </Dialog.Description>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`mb-6 p-4 rounded-xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Current Usage
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tokenStatus.tokensRemaining} of {tokenStatus.totalTokens} tokens remaining today
                  </p>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                  darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Resets in {Math.floor((tokenStatus.resetTime.getTime() - new Date().getTime()) / (1000 * 60 * 60))}h
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-xl p-6 border-2 backdrop-blur-sm ${
                    plan.current
                      ? darkMode 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-blue-500 bg-blue-50'
                      : plan.popular
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10'
                      : darkMode
                      ? 'border-gray-600 bg-gray-700/50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>POPULAR</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center space-x-1 mt-2">
                      <span className={`text-3xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {plan.price}
                      </span>
                      {plan.price !== "$0" && (
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          /month
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Zap className={`w-5 h-5 ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-500'
                    }`} />
                    <span className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.tokens} tokens/day
                    </span>
                  </div>

                  <ul className={`space-y-2 mb-6 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          plan.popular ? 'bg-purple-500' : 
                          plan.current ? 'bg-blue-500' : 
                          darkMode ? 'bg-gray-500' : 'bg-gray-400'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      plan.current
                        ? darkMode
                          ? 'bg-gray-600 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                        : darkMode
                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade Now'}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className={`text-center text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <p>Tokens reset daily at midnight UTC. Unused tokens do not carry over.</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};