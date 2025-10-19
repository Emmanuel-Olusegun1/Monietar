'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Trash2, Loader2, ShieldAlert } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  description: string
  confirmText?: string
  darkMode: boolean
  isLoading?: boolean
  type?: 'delete' | 'warning' | 'danger'
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  darkMode,
  isLoading = false,
  type = 'delete'
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false)
    }
  }, [isOpen])

  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      tertiary: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    button: {
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-500',
      warning: 'bg-orange-600 hover:bg-orange-700 text-white border-orange-500',
      secondary: darkMode 
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />
      case 'danger':
        return <ShieldAlert className="w-6 h-6 text-red-500" />
      default:
        return <Trash2 className="w-6 h-6 text-red-500" />
    }
  }

  const getButtonStyle = () => {
    switch (type) {
      case 'warning':
        return themeClasses.button.warning
      case 'danger':
        return themeClasses.button.danger
      default:
        return themeClasses.button.danger
    }
  }

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      // Parent component should handle closing after successful deletion
    } catch (error) {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
        <Dialog.Content 
          className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center p-4"
          onEscapeKeyDown={(e) => {
            if (isDeleting) {
              e.preventDefault()
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative rounded-2xl shadow-2xl w-full max-w-md mx-auto border ${themeClasses.card}`}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  darkMode 
                    ? type === 'warning' ? 'bg-orange-500/20' : 'bg-red-500/20'
                    : type === 'warning' ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <Dialog.Title className={`text-xl font-bold mb-2 ${themeClasses.text.primary}`}>
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className={`${themeClasses.text.secondary} leading-relaxed`}>
                    {description}
                  </Dialog.Description>
                </div>
                {!isDeleting && (
                  <button
                    onClick={handleClose}
                    disabled={isDeleting}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-500'
                    } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            <AnimatePresence>
              {isDeleting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-4"
                >
                  <div className={`flex items-center gap-3 p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                    <span className={themeClasses.text.secondary}>
                      Deleting...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className={`flex-1 py-3 border rounded-xl transition-all ${
                    themeClasses.button.secondary
                  } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className={`flex-1 py-3 border rounded-xl transition-all flex items-center justify-center gap-2 ${
                    getButtonStyle()
                  } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      {confirmText}
                    </>
                  )}
                </button>
              </div>

              {/* Warning Note */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg text-sm ${
                  darkMode 
                    ? 'bg-gray-700/30 border border-gray-600' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className={`flex-shrink-0 mt-0.5 ${
                    type === 'warning' ? 'text-orange-500' : 'text-red-500'
                  }`} />
                  <span className={themeClasses.text.secondary}>
                    This action cannot be undone. Please make sure this is what you want to do.
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}