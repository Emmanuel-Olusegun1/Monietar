'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Transaction } from '../../types'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Currency, Tag, FileText, Calendar, X, Loader2 } from 'lucide-react'

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  formData: {
    amount: string
    category: string
    description: string
    date: string
  }
  onFormDataChange: (data: any) => void
  onSubmit: () => void
  categories: string[]
  darkMode: boolean
  isLoading?: boolean // Add loading prop
}

type Step = 'amount' | 'category' | 'details' | 'review'

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  formData,
  onFormDataChange,
  onSubmit,
  categories,
  darkMode,
  isLoading = false // Default to false
}: EditTransactionModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('amount')
  const [direction, setDirection] = useState(0)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get today's date in YYYY-MM-DD format for max date attribute
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('amount')
      setShowCancelConfirm(false)
      setIsSubmitting(false)
      // Set default date to today if no date is set
      if (!formData.date) {
        onFormDataChange({
          ...formData,
          date: getTodayDate()
        })
      }
    }
  }, [isOpen])

  // Reset submitting state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false)
    }
  }, [isOpen])

  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      tertiary: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    step: {
      active: transaction?.type === 'income' ? 'bg-emerald-500' : 'bg-red-500',
      completed: transaction?.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
      upcoming: darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500',
    }
  }

  const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    { id: 'amount', title: 'Amount', icon: <Currency size={16} /> },
    { id: 'category', title: 'Category', icon: <Tag size={16} /> },
    { id: 'details', title: 'Details', icon: <FileText size={16} /> },
    { id: 'review', title: 'Review', icon: <Check size={16} /> },
  ]

  const nextStep = () => {
    setDirection(1)
    const stepIndex = steps.findIndex(step => step.id === currentStep)
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id)
    }
  }

  const prevStep = () => {
    setDirection(-1)
    const stepIndex = steps.findIndex(step => step.id === currentStep)
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id)
    } else {
      // If we're on the first step, show cancel confirmation
      handleCancel()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
      // The parent component should handle closing the modal after successful submission
    } catch (error) {
      // If there's an error, stop the loading state but don't close the modal
      setIsSubmitting(false)
    }
  }

  const hasFormDataChanges = () => {
    if (!transaction) return false
    return (
      formData.amount !== transaction.amount.toString() ||
      formData.category !== transaction.category ||
      formData.description !== (transaction.description || '') ||
      formData.date !== transaction.date
    )
  }

  const handleCancel = () => {
    if (hasFormDataChanges() && !showCancelConfirm && !isSubmitting) {
      setShowCancelConfirm(true)
    } else {
      resetAndClose()
    }
  }

  const resetAndClose = () => {
    // Only allow closing if not currently submitting
    if (isSubmitting) return
    
    setShowCancelConfirm(false)
    setIsSubmitting(false)
    onClose()
  }

  const continueEditing = () => {
    setShowCancelConfirm(false)
  }

  const handleDateChange = (newDate: string) => {
    const today = getTodayDate()
    
    // If the selected date is in the future, set it to today
    if (newDate > today) {
      onFormDataChange({...formData, date: today})
    } else {
      onFormDataChange({...formData, date: newDate})
    }
  }

  const getStepContent = () => {
    if (showCancelConfirm) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center py-4"
        >
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            darkMode ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <X className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              Discard Changes?
            </h3>
            <p className={themeClasses.text.secondary}>
              You have unsaved changes. Are you sure you want to discard them?
            </p>
          </div>
        </motion.div>
      )
    }

    // Show loading state during submission
    if (isSubmitting) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center py-8"
        >
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Loader2 className={`w-10 h-10 animate-spin ${
              transaction?.type === 'income' ? 'text-emerald-500' : 'text-red-500'
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              Updating Transaction...
            </h3>
            <p className={themeClasses.text.secondary}>
              Please wait while we update your transaction
            </p>
          </div>
        </motion.div>
      )
    }

    switch (currentStep) {
      case 'amount':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                Amount
              </label>
              <div className="relative">
                <Currency className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.tertiary}`} size={20} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => onFormDataChange({...formData, amount: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent hide-number-arrows ${themeClasses.input}`}
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </motion.div>
        )

      case 'category':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                Category
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => onFormDataChange({...formData, category})}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.category === category 
                        ? transaction?.type === 'income' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' 
                          : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                        : `${darkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' : 'border-gray-200 hover:border-gray-300 bg-white'} ${themeClasses.text.primary}`
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-medium text-sm">{category}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                Description
              </label>
              <div className="relative">
                <FileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.tertiary}`} size={20} />
                <input
                  type="text"
                  placeholder="Add a description..."
                  value={formData.description}
                  onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.input}`}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                Date
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.tertiary}`} size={20} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  max={getTodayDate()}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.input} custom-date-input`}
                  disabled={isSubmitting}
                />
              </div>
              <p className={`text-xs mt-1 ${themeClasses.text.tertiary}`}>
                Only past and present dates are allowed
              </p>
            </div>
          </motion.div>
        )

      case 'review':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`font-medium mb-3 ${themeClasses.text.primary}`}>Transaction Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Type:</span>
                  <span className={`font-medium capitalize ${transaction?.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {transaction?.type || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Amount:</span>
                  <span className={`font-medium ${transaction?.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    ${formData.amount || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Category:</span>
                  <span className={themeClasses.text.primary}>{formData.category || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Description:</span>
                  <span className={themeClasses.text.primary}>{formData.description || 'No description'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Date:</span>
                  <span className={themeClasses.text.primary}>
                    {formData.date ? new Date(formData.date).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )
    }
  }

  const isStepCompleted = (stepId: Step): boolean => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    return stepIndex < currentIndex
  }

  const canProceed = () => {
    if (showCancelConfirm || isSubmitting) return true
    
    switch (currentStep) {
      case 'amount':
        return formData.amount && parseFloat(formData.amount) > 0
      case 'category':
        return formData.category
      case 'details':
        return formData.date
      case 'review':
        return true
      default:
        return false
    }
  }

  const getFooterButtons = () => {
    if (showCancelConfirm) {
      return (
        <div className="flex gap-3 justify-end">
          <button
            onClick={continueEditing}
            disabled={isSubmitting}
            className={`flex items-center px-6 py-2 rounded-xl transition-all ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continue Editing
          </button>
          <button
            onClick={resetAndClose}
            disabled={isSubmitting}
            className={`flex items-center px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Discard Changes
          </button>
        </div>
      )
    }

    // Show loading state in footer during submission
    if (isSubmitting) {
      return (
        <div className="flex justify-center">
          {/* Empty div to maintain layout during submission */}
        </div>
      )
    }

    return (
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className={`flex items-center px-4 py-2 rounded-xl transition-all ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-100'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        {currentStep === 'review' ? (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center px-6 py-2 rounded-xl text-white transition-all ${
              transaction?.type === 'income' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-red-600 hover:bg-red-700'
            } ${!canProceed() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                Update
                <Check size={20} className="ml-1" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center px-6 py-2 rounded-xl text-white transition-all ${
              transaction?.type === 'income' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-red-600 hover:bg-red-700'
            } ${!canProceed() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        )}
      </div>
    )
  }

  // Early return if no transaction
  if (!transaction) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
        <Dialog.Content 
          className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center p-4"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (!isSubmitting) {
              handleCancel()
            } else {
              e.preventDefault() // Prevent closing during submission
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative rounded-2xl shadow-2xl w-full max-w-md mx-auto border ${themeClasses.card} max-h-[85vh] overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="p-6 pb-4 flex-shrink-0">
              {!showCancelConfirm && !isSubmitting && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <Dialog.Title className={`text-xl font-bold ${themeClasses.text.primary}`}>
                      Edit Transaction
                    </Dialog.Title>
                    <button
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className={`p-2 rounded-lg transition-all ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-400' 
                          : 'hover:bg-gray-100 text-gray-500'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Progress Steps */}
                  <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center flex-1">
                        <div className="flex items-center justify-center flex-col">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                              currentStep === step.id
                                ? `${themeClasses.step.active} text-white`
                                : isStepCompleted(step.id)
                                ? `${themeClasses.step.completed}`
                                : `${themeClasses.step.upcoming}`
                            } ${isSubmitting ? 'opacity-50' : ''}`}
                          >
                            {isStepCompleted(step.id) ? <Check size={16} /> : step.icon}
                          </div>
                          <span
                            className={`text-xs mt-1 hidden sm:block ${
                              currentStep === step.id
                                ? themeClasses.text.primary
                                : themeClasses.text.secondary
                            } ${isSubmitting ? 'opacity-50' : ''}`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              isStepCompleted(step.id) 
                                ? transaction?.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                                : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            } ${isSubmitting ? 'opacity-50' : ''}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto custom-scrollbar px-6 pb-4">
                <AnimatePresence mode="wait" initial={false}>
                  {getStepContent()}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              {getFooterButtons()}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Global scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-date-input::-webkit-calendar-picker-indicator {
          filter: ${darkMode ? 'invert(1)' : 'invert(0)'};
          cursor: pointer;
        }
        .custom-date-input::-webkit-datetime-edit-fields-wrapper {
          color: ${darkMode ? '#fff' : '#000'};
        }
        /* Hide number input arrows */
        .hide-number-arrows::-webkit-outer-spin-button,
        .hide-number-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-number-arrows {
          -moz-appearance: textfield;
        }
        /* Disable future dates in date picker */
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
        input[type="date"]:in-range::-webkit-datetime-edit-year-field,
        input[type="date"]:in-range::-webkit-datetime-edit-month-field,
        input[type="date"]:in-range::-webkit-datetime-edit-day-field,
        input[type="date"]:in-range::-webkit-datetime-edit-text {
          color: inherit;
        }
      `}</style>
    </Dialog.Root>
  )
}