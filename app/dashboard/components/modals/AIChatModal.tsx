'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bot, XCircle, Send, Sparkles } from 'lucide-react'

interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'ai'
}

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
  messages: ChatMessage[]
  newMessage: string
  onNewMessageChange: (message: string) => void
  onSendMessage: () => void
  darkMode: boolean
  suggestedQuestions?: string[]
}

export function AIChatModal({
  isOpen,
  onClose,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  darkMode,
  suggestedQuestions = [
    "How can I improve my cash flow?",
    "What's the difference between profit and cash flow?",
    "How do I calculate my burn rate?",
    "Best practices for expense tracking?",
    "How to create a cash flow forecast?",
    "What is working capital management?"
  ]
}: AIChatModalProps) {
  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  }

  const handleSuggestionClick = (question: string) => {
    onNewMessageChange(question);
    // Auto-send after a brief delay to allow state update
    setTimeout(() => {
      onSendMessage();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl z-50 border ${themeClasses.card}`}
          >
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">AI Financial Assistant</h3>
                    <p className="text-emerald-100 text-xs">Specialized in Cash Flow Management</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-emerald-700 rounded transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Suggested Questions Section */}
            {messages.length === 0 && (
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                    Quick Financial Questions
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className={`text-xs px-3 py-2 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:scale-105 ${
                        darkMode 
                          ? 'bg-gray-700/80 border-gray-600 text-gray-200 hover:bg-gray-600/80 hover:text-white hover:border-emerald-500/50' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`p-4 h-80 overflow-y-auto ${messages.length === 0 ? 'bg-gradient-to-b from-gray-50/50 to-white/50' : ''} ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : ''}`}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Bot className={`w-8 h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>
                    Your Financial AI Assistant
                  </h3>
                  <p className={`text-sm max-w-xs ${themeClasses.text.secondary}`}>
                    Ask me about cash flow management, budgeting, expense tracking, or any financial questions you have about your business.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                          message.sender === 'user'
                            ? 'bg-emerald-600 text-white'
                            : `${darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-100 text-gray-900 border border-gray-200'}`
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => onNewMessageChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                  placeholder="Ask about cash flow, budgeting, or finances..."
                  className={`flex-1 px-4 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm border ${themeClasses.input}`}
                />
                <button
                  onClick={onSendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                    newMessage.trim() 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500 hover:scale-105' 
                      : `${darkMode ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'}`
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-xs mt-2 text-center ${themeClasses.text.secondary}`}>
                Powered by AI • Focused on Fintech & Cash Flow
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}