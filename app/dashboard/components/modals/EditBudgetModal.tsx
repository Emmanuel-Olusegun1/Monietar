'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Tag, Currency, Calendar, X, Loader2, AlertCircle } from 'lucide-react'
import { Budget } from '../../types'

// Define consistent period types
type Period = 'monthly' | 'quarterly' | 'yearly'
type PeriodDisplay = 'Monthly' | 'Quarterly' | 'Yearly'

interface EditBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  budget: Budget | null
  formData: {
    category: string
    budget_limit: string
    period: PeriodDisplay
  }
  onFormDataChange: (data: any) => void
  onSubmit: () => Promise<void> | void
  categories: string[]
  darkMode: boolean
  isLoading?: boolean
}

type Step = 'category' | 'amount' | 'period' | 'review'

// Helper functions to convert between period formats
const toDisplayPeriod = (period: Period): PeriodDisplay => {
  return period.charAt(0).toUpperCase() + period.slice(1) as PeriodDisplay
}

const toStoragePeriod = (period: PeriodDisplay): Period => {
  return period.toLowerCase() as Period
}

export function EditBudgetModal({
  isOpen,
  onClose,
  budget,
  formData,
  onFormDataChange,
  onSubmit,
  categories,
  darkMode,
  isLoading = false
}: EditBudgetModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('category')
  const [direction, setDirection] = useState(0)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasMadeChanges, setHasMadeChanges] = useState(false)

  useEffect(() => {
    if (isOpen && budget) {
      setCurrentStep('category')
      setShowCancelConfirm(false)
      setIsSubmitting(false)
      setHasMadeChanges(false)
      
      // Initialize form data with budget data, converting period to display format
      onFormDataChange({
        category: budget.category,
        budget_limit: budget.budget_limit.toString(),
        period: toDisplayPeriod(budget.period)
      })
    }
  }, [isOpen, budget])

  // Check for changes whenever formData changes
  useEffect(() => {
    if (budget) {
      const changesMade = 
        formData.category !== budget.category ||
        parseFloat(formData.budget_limit) !== budget.budget_limit ||
        toStoragePeriod(formData.period) !== budget.period
      setHasMadeChanges(changesMade)
    }
  }, [formData, budget])

  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      tertiary: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    step: {
      active: 'bg-emerald-500',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
      upcoming: darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500',
    }
  }

  const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    { id: 'category', title: 'Category', icon: <Tag size={16} /> },
    { id: 'amount', title: 'Amount', icon: <Currency size={16} /> },
    { id: 'period', title: 'Period', icon: <Calendar size={16} /> },
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
      handleCancel()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
      // Parent component should handle closing after successful submission
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (hasMadeChanges && !showCancelConfirm && !isSubmitting) {
      setShowCancelConfirm(true)
    } else {
      resetAndClose()
    }
  }

  const resetAndClose = () => {
    if (isSubmitting) return
    setCurrentStep('category')
    setShowCancelConfirm(false)
    setIsSubmitting(false)
    onClose()
  }

  const continueEditing = () => {
    setShowCancelConfirm(false)
  }

  const resetToOriginal = () => {
    if (!budget) return
    onFormDataChange({
      category: budget.category,
      budget_limit: budget.budget_limit.toString(),
      period: toDisplayPeriod(budget.period)
    })
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
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              Updating Budget...
            </h3>
            <p className={themeClasses.text.secondary}>
              Please wait while we update your budget
            </p>
          </div>
        </motion.div>
      )
    }

    switch (currentStep) {
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
                Select Category
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => onFormDataChange({...formData, category})}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.category === category 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : `${darkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' : 'border-gray-200 hover:border-gray-300 bg-white'} ${themeClasses.text.primary}`
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-medium text-sm">{category}</div>
                    {budget?.category === category && (
                      <div className={`text-xs mt-1 ${themeClasses.text.secondary}`}>
                        Current
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

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
                Budget Limit
              </label>
              <div className="relative">
                <Currency className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.tertiary}`} size={20} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.budget_limit}
                  onChange={(e) => onFormDataChange({...formData, budget_limit: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent hide-number-arrows ${themeClasses.input}`}
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              {budget && (
                <div className={`text-sm mt-2 ${themeClasses.text.secondary}`}>
                  Current: ${budget.budget_limit}
                </div>
              )}
            </div>
          </motion.div>
        )

      case 'period':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                Budget Period
              </label>
              <div className="grid grid-cols-1 gap-3">
                {(['Monthly', 'Quarterly', 'Yearly'] as PeriodDisplay[]).map(period => (
                  <button
                    key={period}
                    onClick={() => onFormDataChange({...formData, period})}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.period === period 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : `${darkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' : 'border-gray-200 hover:border-gray-300 bg-white'} ${themeClasses.text.primary}`
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-medium text-sm">{period}</div>
                    <div className={`text-xs mt-1 ${themeClasses.text.secondary}`}>
                      {period === 'Monthly' && 'Reset every month'}
                      {period === 'Quarterly' && 'Reset every 3 months'}
                      {period === 'Yearly' && 'Reset every year'}
                    </div>
                    {budget && toDisplayPeriod(budget.period) === period && (
                      <div className={`text-xs mt-1 text-emerald-500`}>
                        Current
                      </div>
                    )}
                  </button>
                ))}
              </div>
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
              <h3 className={`font-medium mb-3 ${themeClasses.text.primary}`}>Budget Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={themeClasses.text.secondary}>Category:</span>
                  <div className="text-right">
                    <span className={themeClasses.text.primary}>{formData.category}</span>
                    {budget?.category !== formData.category && (
                      <div className="text-xs text-emerald-500">Changed</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={themeClasses.text.secondary}>Budget Limit:</span>
                  <div className="text-right">
                    <span className="font-medium text-emerald-500">
                    {formData.budget_limit}
                    </span>
                    {budget && parseFloat(formData.budget_limit) !== budget.budget_limit && (
                      <div className="text-xs text-emerald-500">
                        {parseFloat(formData.budget_limit) > budget.budget_limit ? 'Increased' : 'Decreased'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={themeClasses.text.secondary}>Period:</span>
                  <div className="text-right">
                    <span className={themeClasses.text.primary}>{formData.period}</span>
                    {budget && toDisplayPeriod(budget.period) !== formData.period && (
                      <div className="text-xs text-emerald-500">Changed</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset to Original Option */}
            {hasMadeChanges && (
              <button
                onClick={resetToOriginal}
                disabled={isSubmitting}
                className={`w-full py-3 border-2 border-dashed rounded-xl transition-all text-sm ${
                  darkMode 
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700/50' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:bg-gray-50'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Reset to Original Values
              </button>
            )}
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
      case 'category':
        return formData.category
      case 'amount':
        return formData.budget_limit && parseFloat(formData.budget_limit) > 0
      case 'period':
        return formData.period
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
            disabled={!hasMadeChanges || isSubmitting}
            className={`flex items-center px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all ${
              !hasMadeChanges || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                Update Budget
                <Check size={20} className="ml-1" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all ${
              !canProceed() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        )}
      </div>
    )
  }

  if (!budget) return null

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
              e.preventDefault()
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
                      Edit Budget
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
                                ? 'bg-emerald-500'
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
        .hide-number-arrows::-webkit-outer-spin-button,
        .hide-number-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-number-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
    </Dialog.Root>
  )
}