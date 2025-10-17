'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { PasswordData } from '../../types'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  passwordData: PasswordData
  onPasswordDataChange: (data: PasswordData) => void
  onSubmit: () => void
  darkMode: boolean
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  passwordData,
  onPasswordDataChange,
  onSubmit,
  darkMode
}: ChangePasswordModalProps) {
  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
        <Dialog.Content className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-xl w-[80%] md:w-auto mx-4 border ${themeClasses.card}`}>
          <Dialog.Title className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Change Password
          </Dialog.Title>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => onPasswordDataChange({...passwordData, currentPassword: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => onPasswordDataChange({...passwordData, newPassword: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => onPasswordDataChange({...passwordData, confirmPassword: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            />
            <div className="flex space-x-3">
              <button
                onClick={onSubmit}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 border border-emerald-500"
              >
                Update Password
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-3 border rounded-xl ${
                  darkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}