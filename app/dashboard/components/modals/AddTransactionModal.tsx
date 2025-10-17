'use client'

import * as Dialog from '@radix-ui/react-dialog'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'income' | 'expense'
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
}

export function AddTransactionModal({
  isOpen,
  onClose,
  type,
  formData,
  onFormDataChange,
  onSubmit,
  categories,
  darkMode
}: AddTransactionModalProps) {
  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
        <Dialog.Content className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6 rounded-2xl shadow-xl w-[80%] md:w-auto mx-4 border ${themeClasses.card}`}>
          <Dialog.Title className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Dialog.Title>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => onFormDataChange({...formData, amount: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            />
            <select
              value={formData.category}
              onChange={(e) => onFormDataChange({...formData, category: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            >
              <option value="" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className={darkMode ? 'bg-gray-700' : 'bg-white'}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => onFormDataChange({...formData, date: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
            />
            <div className="flex space-x-3">
              <button
                onClick={onSubmit}
                className={`flex-1 ${
                  type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500' : 'bg-red-600 hover:bg-red-700 border-red-500'
                } text-white py-3 rounded-xl border`}
              >
                Add {type === 'income' ? 'Income' : 'Expense'}
              </button>
              <Dialog.Close asChild>
                <button className={`px-4 py-3 border rounded-xl ${
                  darkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}>
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}