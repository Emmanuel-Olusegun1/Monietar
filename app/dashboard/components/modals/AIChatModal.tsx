'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bot, XCircle, Send } from 'lucide-react'

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
}

export function AIChatModal({
  isOpen,
  onClose,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  darkMode
}: AIChatModalProps) {
  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  }

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
                  <h3 className="font-semibold">AI Financial Assistant</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-emerald-700 rounded"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto">
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
                          : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => onNewMessageChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                  placeholder="Ask about your finances..."
                  className={`flex-1 px-4 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm ${themeClasses.input}`}
                />
                <button
                  onClick={onSendMessage}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 border border-emerald-500"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}