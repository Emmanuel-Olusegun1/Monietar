'use client'

import * as Dialog from '@radix-ui/react-dialog'

interface Backup {
  id: string;
  created_at: string;
  file_size: number;
}

interface RestoreBackupModalProps {
  isOpen: boolean
  onClose: () => void
  availableBackups: Backup[]
  selectedBackup: string
  onSelectedBackupChange: (backupId: string) => void
  onRestore: (backupId: string) => void
  darkMode: boolean
}

export function RestoreBackupModal({
  isOpen,
  onClose,
  availableBackups,
  selectedBackup,
  onSelectedBackupChange,
  onRestore,
  darkMode
}: RestoreBackupModalProps) {
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
        <Dialog.Content className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 border ${themeClasses.card}`}>
          <Dialog.Title className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Restore Backup
          </Dialog.Title>
          <div className="space-y-4">
            <select
              value={selectedBackup}
              onChange={(e) => onSelectedBackupChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            >
              <option value="" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Select a backup</option>
              {availableBackups.map((backup) => (
                <option key={backup.id} value={backup.id} className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                  {new Date(backup.created_at).toLocaleString()} - {backup.file_size} bytes
                </option>
              ))}
            </select>
            
            <div className="flex space-x-3">
              <button
                onClick={() => selectedBackup && onRestore(selectedBackup)}
                disabled={!selectedBackup}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed border border-emerald-500"
              >
                Restore Selected Backup
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