// Complete updated AIChatModal.tsx with scrollbar hidden and token debug
'use client'

import { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, Send, Bot, Zap, Crown, Sparkles, 
  Cloud, Database, RefreshCw, AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
  darkMode: boolean;
  suggestedQuestions: string[];
  aiStatus: 'aws' | 'standard' | 'checking'; // Updated type
  usePremium: boolean;
  onTogglePremium: () => void;
  tokensRemaining: number;
}

export function AIChatModal({
  isOpen,
  onClose,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  darkMode,
  suggestedQuestions,
  aiStatus,
  usePremium,
  onTogglePremium,
  tokensRemaining
}: AIChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    onNewMessageChange(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const getAIStatusIcon = () => {
    switch (aiStatus) {
      case 'aws':
        return <Cloud className="w-4 h-4 text-green-500" />;
      case 'standard':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />;
      default:
        return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAIStatusText = () => {
    switch (aiStatus) {
      case 'aws':
        return 'AWS AI';
      case 'standard':
        return 'Standard Analysis';
      case 'checking':
        return 'Checking...';
      default:
        return 'AI Assistant';
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl z-50 flex flex-col ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <Dialog.Title className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Financial AI Assistant
                </Dialog.Title>
                <div className="flex items-center space-x-2 mt-1">
                  {getAIStatusIcon()}
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getAIStatusText()}
                  </span>
                  {tokensRemaining > 0 ? (
                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      {tokensRemaining} tokens
                    </span>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                      No tokens available
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Debug: {tokensRemaining} tokens
                </div>
              )}
              
              {/* Premium Toggle */}
              <button
                onClick={onTogglePremium}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  usePremium 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                    : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Premium</span>
              </button>
              
              <Dialog.Close asChild>
                <button className={`p-2 rounded-xl ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Messages Container - Scrollbar Hidden */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <Sparkles className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ask me anything about your finances!
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  I can help with cash flow analysis, budget optimization, and financial planning.
                </p>
                
                {/* Suggested Questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className={`p-3 text-left rounded-xl transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-sm">{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? darkMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-600 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && (
                        <Bot className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      )}
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => onNewMessageChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your cash flow, budgets, or financial strategy..."
                  className={`w-full p-4 pr-12 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  rows={2}
                />
                <button
                  onClick={onSendMessage}
                  disabled={!newMessage.trim()}
                  className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-200 ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                      : darkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Status Info */}
            <div className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {aiStatus === 'standard' && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Using standard analysis - AI features limited</span>
                </div>
              )}
              {tokensRemaining === 0 && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span>Daily AI tokens exhausted - using basic analysis</span>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}