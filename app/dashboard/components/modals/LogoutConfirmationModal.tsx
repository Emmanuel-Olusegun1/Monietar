'use client'

import * as Dialog from '@radix-ui/react-dialog';
import { X, LogOut, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  darkMode: boolean;
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  darkMode
}: LogoutConfirmationModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-xl shadow-lg z-50 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className={`text-lg font-semibold flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Confirm Logout
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Are you sure you want to log out? You will need to sign in again to access your dashboard.
          </Dialog.Description>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}