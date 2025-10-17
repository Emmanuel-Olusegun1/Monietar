'use client'

import * as Dialog from '@radix-ui/react-dialog'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  darkMode: boolean
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  darkMode
}: DeleteAccountModalProps) {
  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    },
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
        <Dialog.Content className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 border ${themeClasses.card}`}>
          <Dialog.Title className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
            Delete Account
          </Dialog.Title>
          <Dialog.Description className={`mb-6 ${themeClasses.text.secondary}`}>
            Are you sure you want to permanently delete your account? This will remove all your data and cannot be undone.
          </Dialog.Description>
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 border border-red-500"
            >
              Delete Account
            </button>
            <button
              onClick={onClose}
              className={`flex-1 border py-3 rounded-xl ${
                darkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}