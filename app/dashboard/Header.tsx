'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Moon,
  Sun,
  Globe,
  Eye,
  EyeOff,
  Menu
} from 'lucide-react'

interface UserInfo {
  name: string
  email: string
  businessName: string
  avatar: string
  plan: string
  joinedDate: string
}

interface Notification {
  id: string
  type: 'transaction' | 'budget' | 'system' | 'alert'
  title: string
  message: string
  time: string
  read: boolean
  amount?: number
}

interface HeaderProps {
  activeTab: string
  user: UserInfo
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  onLogout: () => void
  navigationItems: Array<{ id: string; label: string }>
}

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese']

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'New Transaction',
    message: 'Payment received from Client Co.',
    time: '2 min ago',
    read: false,
    amount: 2500
  },
  {
    id: '2',
    type: 'budget',
    title: 'Budget Alert',
    message: 'You have exceeded your marketing budget',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'New features available in Reports',
    time: '3 hours ago',
    read: true
  },
  {
    id: '4',
    type: 'alert',
    title: 'Security Notice',
    message: 'New device logged into your account',
    time: '1 day ago',
    read: true
  }
]

export function Header({ 
  activeTab, 
  user, 
  darkMode, 
  setDarkMode, 
  onLogout, 
  navigationItems 
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'transaction': return Bell
      case 'budget': return Settings
      case 'alert': return HelpCircle
      default: return Bell
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'transaction': return 'text-green-400'
      case 'budget': return 'text-yellow-400'
      case 'alert': return 'text-red-400'
      default: return 'text-blue-400'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-800 bg-gray-900 z-40 lg:left-64">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left Section - Breadcrumb */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              Dashboard
            </span>
            <span className="text-sm text-gray-600">
              /
            </span>
            <span className="text-sm font-medium text-white">
              {navigationItems.find(item => item.id === activeTab)?.label}
            </span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative rounded-xl bg-gray-800">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions, reports..."
              className="w-full py-2 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white placeholder-gray-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Currency Selector - Hidden on mobile, moved to user menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{selectedCurrency}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCurrencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50"
                >
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        setSelectedCurrency(currency)
                        setIsCurrencyOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedCurrency === currency ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
                      }`}
                    >
                      {currency}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle - Always visible */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Balance Visibility - Always visible */}
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>

          {/* Notifications - Always visible */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                        <button className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
                          View all
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type)
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/50 transition-colors ${
                            !notification.read ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg bg-gray-700 ${getNotificationColor(notification.type)}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-white">{notification.title}</p>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 rounded-lg hover:bg-gray-600 transition-colors ml-2"
                                    aria-label="Mark as read"
                                  >
                                    <span className="w-3 h-3 text-gray-400">✓</span>
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                              {notification.amount && (
                                <p className="text-sm text-emerald-400 font-medium mt-1">
                                  +${notification.amount.toLocaleString()}
                                </p>
                              )}
                              <div className="flex items-center mt-2">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-700">
                    <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu - Always visible */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors min-w-0"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.businessName}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-lg bg-gray-800 border-gray-700 z-50"
                >
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Currency Selector for Mobile */}
                    <div className="md:hidden">
                      <div className="px-3 py-2 text-xs text-gray-500 uppercase font-semibold">
                        Currency
                      </div>
                      <div className="grid grid-cols-3 gap-1 px-2 mb-2">
                        {currencies.map((currency) => (
                          <button
                            key={currency}
                            onClick={() => {
                              setSelectedCurrency(currency)
                              setIsUserMenuOpen(false)
                            }}
                            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                              selectedCurrency === currency 
                                ? 'text-emerald-400 bg-emerald-500/10' 
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </button>
                  </div>

                  <div className="p-2 border-t border-gray-700">
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}