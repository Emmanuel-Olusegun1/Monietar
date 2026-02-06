'use client'

import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface Backup {
  id: string;
  created_at: string;
  file_size: number | null;
  backup_name?: string | null;
  backup_date?: string | null;
}

interface RestoreBackupModalProps {
  isOpen: boolean
  onClose: () => void
  availableBackups: Backup[]
  selectedBackup: string
  onSelectedBackupChange: (backupId: string) => void
  onRestore: (backupId: string) => void
  onRename: (backupId: string, newName: string) => void
  darkMode: boolean
}

export function RestoreBackupModal({
  isOpen,
  onClose,
  availableBackups,
  selectedBackup,
  onSelectedBackupChange,
  onRestore,
  onRename,
  darkMode
}: RestoreBackupModalProps) {
  const selectedBackupRecord = useMemo(
    () => availableBackups.find((backup) => backup.id === selectedBackup),
    [availableBackups, selectedBackup]
  );
  const [backupName, setBackupName] = useState('');

  useEffect(() => {
    setBackupName(selectedBackupRecord?.backup_name || '');
  }, [selectedBackupRecord?.backup_name]);

  const handleRename = () => {
    const nextName = backupName.trim();
    if (!selectedBackup || !nextName) return;
    onRename(selectedBackup, nextName);
  };

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
                  {(backup.backup_name || new Date(backup.backup_date || backup.created_at).toLocaleString())} - {(backup.file_size ?? 0)} bytes
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${themeClasses.text.primary}`}>Backup name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="Enter backup name"
                  className={`flex-1 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
                />
                <button
                  onClick={handleRename}
                  disabled={!selectedBackup || !backupName.trim() || backupName.trim() === (selectedBackupRecord?.backup_name || '')}
                  className="px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Rename
                </button>
              </div>
            </div>
            
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
