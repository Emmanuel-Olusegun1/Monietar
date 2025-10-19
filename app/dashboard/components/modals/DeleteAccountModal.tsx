'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, AlertTriangle, X, UserX, Loader2, ShieldAlert, Trash2, FileText, Check } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  darkMode: boolean
  isLoading?: boolean
}

type Step = 'warning' | 'confirmation' | 'review'

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  darkMode,
  isLoading = false
}: DeleteAccountModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('warning')
  const [direction, setDirection] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('warning')
      setIsDeleting(false)
      setConfirmationText('')
    }
  }, [isOpen])

  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      tertiary: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    input: darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500',
    step: {
      active: 'bg-red-500',
      completed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
      upcoming: darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500',
    },
    button: {
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-500',
      disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed',
      secondary: darkMode 
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
    }
  }

  const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    { id: 'warning', title: 'Warning', icon: <AlertTriangle size={16} /> },
    { id: 'confirmation', title: 'Confirm', icon: <FileText size={16} /> },
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
      handleClose()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'warning':
        return true // No checkbox required, user can proceed after reading
      case 'confirmation':
        return confirmationText.toLowerCase() === 'delete my account'
      case 'review':
        return true
      default:
        return false
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

  const isStepCompleted = (stepId: Step): boolean => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    return stepIndex < currentIndex
  }

  const getStepContent = () => {
    if (isDeleting) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center py-8"
        >
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              Deleting Your Account...
            </h3>
            <p className={themeClasses.text.secondary}>
              Please wait while we permanently remove your account and all associated data.
            </p>
          </div>
        </motion.div>
      )
    }

    switch (currentStep) {
      case 'warning':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                    Critical Warning
                  </h4>
                  <p className={`text-sm ${themeClasses.text.secondary} mb-3`}>
                    You are about to permanently delete your account. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className={`font-medium ${themeClasses.text.primary}`}>What will be deleted:</h5>
              <ul className={`space-y-3 ${themeClasses.text.secondary}`}>
                <li className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>All transaction records</span>
                </li>
                <li className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>All budget records</span>
                </li>
                <li className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Account settings and preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>All backup records</span>
                </li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-medium mb-1 ${themeClasses.text.primary}`}>
                    This Action Is Permanent
                  </h4>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    Once deleted, your account cannot be recovered. You will need to create a new account if you wish to use our services again.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className={`text-sm ${themeClasses.text.secondary}`}>
                  Please ensure you have exported any data you wish to keep before proceeding.
                </span>
              </div>
            </div>
          </motion.div>
        )

      case 'confirmation':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                darkMode ? 'bg-red-500/20' : 'bg-red-100'
              }`}>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-lg font-semibold mt-4 mb-2 ${themeClasses.text.primary}`}>
                Confirm Account Deletion
              </h3>
              <p className={themeClasses.text.secondary}>
                To confirm, please type <span className="font-mono text-red-500">delete my account</span> below:
              </p>
            </div>

            <div>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="delete my account"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  themeClasses.input
                }`}
                autoFocus
              />
              {confirmationText && !canProceed() && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertTriangle size={14} />
                  Text must match exactly
                </motion.p>
              )}
            </div>

            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className={`text-sm ${themeClasses.text.secondary}`}>
                  This is your final confirmation step. Proceeding will immediately begin the account deletion process.
                </span>
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
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                darkMode ? 'bg-red-500/20' : 'bg-red-100'
              }`}>
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-lg font-semibold mt-4 mb-2 ${themeClasses.text.primary}`}>
                Final Review
              </h3>
              <p className={themeClasses.text.secondary}>
                You are about to permanently delete your account and all associated data.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-3 ${themeClasses.text.primary}`}>Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Action:</span>
                  <span className="text-red-500 font-medium">Permanent Account Deletion</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Data Loss:</span>
                  <span className="text-red-500">Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.text.secondary}>Recovery:</span>
                  <span className="text-red-500">Not Possible</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className={`text-sm ${themeClasses.text.secondary}`}>
                  Clicking "Delete Account Permanently" will immediately begin the deletion process. This action cannot be cancelled once started.
                </span>
              </div>
            </div>
          </motion.div>
        )
    }
  }

  const getFooterButtons = () => {
    if (isDeleting) {
      return (
        <div className="flex justify-center">
          {/* Empty during loading */}
        </div>
      )
    }

    return (
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className={`flex items-center px-4 py-2 rounded-xl transition-all ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        {currentStep === 'review' ? (
          <button
            onClick={handleConfirm}
            className={`flex items-center px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2`}
          >
            <Trash2 size={16} />
            Delete Account Permanently
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center px-6 py-2 rounded-xl transition-all ${
              canProceed() 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        )}
      </div>
    )
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
            className={`relative rounded-2xl shadow-2xl w-full max-w-md mx-auto border ${themeClasses.card} flex flex-col`}
            style={{ maxHeight: '90vh' }}
          >
            {/* Header - Fixed */}
            <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
              {!isDeleting && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <Dialog.Title className={`text-xl font-bold ${themeClasses.text.primary}`}>
                      Delete Account
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      className={`p-2 rounded-lg transition-all ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-400' 
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
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
                            }`}
                          >
                            {isStepCompleted(step.id) ? <Check size={16} /> : step.icon}
                          </div>
                          <span
                            className={`text-xs mt-1 hidden sm:block ${
                              currentStep === step.id
                                ? themeClasses.text.primary
                                : themeClasses.text.secondary
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              isStepCompleted(step.id) 
                                ? 'bg-red-500'
                                : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content - Scrollable with hidden scrollbar */}
            <div className="flex-1 overflow-y-scroll scrollbar-hide">
              <div className="h-full px-6 py-4">
                <AnimatePresence mode="wait" initial={false}>
                  {getStepContent()}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              {getFooterButtons()}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Global scrollbar hide styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </Dialog.Root>
  )
}