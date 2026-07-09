'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Settings,
  HelpCircle,
 ArrowUpCircle,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  user: UserInfo
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  showBalance: boolean
  setShowBalance: (show: boolean) => void
  onUpgradeClick?: () => void
}

// ─── Mock notifications ───────────────────────────────────────────────────────

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'New Transaction',
    message: 'Payment received from Client Co.',
    time: '2 min ago',
    read: false,
    amount: 2500,
  },
  {
    id: '2',
    type: 'budget',
    title: 'Budget Alert',
    message: 'You have exceeded your marketing budget.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'New features available in Reports.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Security Notice',
    message: 'New device logged into your account.',
    time: '1 day ago',
    read: true,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNotificationDot(type: Notification['type']) {
  switch (type) {
    case 'transaction': return 'bg-green-400'
    case 'budget':      return 'bg-yellow-400'
    case 'alert':       return 'bg-red-400'
    default:            return 'bg-blue-400'
  }
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'budget': return Settings
    case 'alert':  return HelpCircle
    default:       return Bell
  }
}

// ─── Theme token helper ───────────────────────────────────────────────────────
// Returns the right Tailwind classes for each slot based on darkMode.

function useTheme(darkMode: boolean) {
  return {
    // Header bar
    header:       darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-[#E2E8F0]',

    // Avatar
    avatarBg:     darkMode ? 'from-emerald-600 to-teal-700' : 'from-[#4A5568] to-[#2D3748]',

    // Text
    namePrimary:  darkMode ? 'text-gray-100' : 'text-[#2D3748]',
    nameSecond:   darkMode ? 'text-gray-400' : 'text-[#718096]',

    // Icon buttons (theme / visibility)
    iconBtn:      darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-100 hover:bg-gray-700'
      : 'bg-white border-[#E2E8F0] text-[#718096] hover:text-[#2D3748] hover:bg-[#F7FAFC]',

    // Notification panel
    panel:        darkMode ? 'bg-gray-800 border-gray-700 shadow-2xl' : 'bg-white border-[#E2E8F0] shadow-xl',
    panelHeader:  darkMode ? 'border-gray-700' : 'border-[#E2E8F0]',
    panelTitle:   darkMode ? 'text-gray-100' : 'text-[#2D3748]',
    panelMarkAll: darkMode ? 'text-gray-400 hover:text-gray-100' : 'text-[#4A5568] hover:text-[#2D3748]',
    panelDivide:  darkMode ? 'divide-gray-700/60' : 'divide-[#F7FAFC]',
    panelFooter:  darkMode ? 'border-gray-700' : 'border-[#E2E8F0]',

    // Notification row
    rowUnread:    darkMode ? 'bg-emerald-900/20' : 'bg-blue-50/40',
    rowHover:     darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-[#F7FAFC]',
    rowIconUnread:darkMode ? 'bg-gray-700' : 'bg-[#EDF2F7]',
    rowIconRead:  darkMode ? 'bg-gray-700/50' : 'bg-[#F7FAFC]',
    rowTitle:     darkMode ? 'text-gray-100' : 'text-[#2D3748]',
    rowMsg:       darkMode ? 'text-gray-400' : 'text-[#718096]',
    rowTime:      darkMode ? 'text-gray-500' : 'text-[#A0AEC0]',
    rowMarkRead:  darkMode ? 'text-gray-500 hover:text-gray-200' : 'text-[#718096] hover:text-[#2D3748]',

    // Panel footer button
    footerBtn:    darkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      : 'bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#4A5568]',
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

export function Header({
  user,
  darkMode,
  setDarkMode,
  showBalance,
  setShowBalance,
  onUpgradeClick,
}: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const t = useTheme(darkMode)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 border-b z-30 lg:left-64 transition-colors duration-200 ${t.header}`}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6">

        {/* ── Left: user identity ──────────────────────────────────────── */}
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${t.avatarBg}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* sm+ : name + business */}
          <div className="min-w-0 hidden sm:block">
            <p className={`text-sm font-semibold leading-none truncate ${t.namePrimary}`}>
              {user.name}
            </p>
            <p className={`text-xs leading-none mt-0.5 truncate ${t.nameSecond}`}>
              {user.businessName}
            </p>
          </div>

          {/* xs: name only */}
          <p className={`text-sm font-semibold leading-none truncate sm:hidden ${t.namePrimary}`}>
            {user.name}
          </p>
        </div>

        {/* ── Right: controls ──────────────────────────────────────────── */}
        <div className="flex items-center space-x-2">

          {/* Upgrade button */}
          <button
            onClick={onUpgradeClick}
             className={`flex items-center gap-1.5 px-3 py-1.5 p-2 rounded-lg border transition-colors ${t.iconBtn}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
           
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border transition-colors ${t.iconBtn}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Balance visibility */}
          <button
            onClick={() => setShowBalance(!showBalance)}
            className={`p-2 rounded-lg border transition-colors ${t.iconBtn}`}
            aria-label={showBalance ? 'Hide balances' : 'Show balances'}
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen((v) => !v)}
              className={`relative p-2 rounded-lg border transition-colors ${t.iconBtn}`}
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <>
                  {/* Click-away */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-full mt-2 w-80 sm:w-96 border rounded-xl z-50 ${t.panel}`}
                  >
                    {/* Panel header */}
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${t.panelHeader}`}>
                      <h3 className={`text-sm font-semibold ${t.panelTitle}`}>
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className={`text-xs font-medium transition-colors ${t.panelMarkAll}`}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className={`max-h-96 overflow-y-auto divide-y ${t.panelDivide}`}>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors ${t.rowHover} ${
                            !notification.read ? t.rowUnread : ''
                          }`}
                        >
                          {/* Colour dot */}
                          <div
                            className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              !notification.read ? t.rowIconUnread : t.rowIconRead
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${getNotificationDot(notification.type)}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs font-semibold leading-snug ${t.rowTitle}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className={`text-[10px] flex-shrink-0 transition-colors ${t.rowMarkRead}`}
                                  aria-label="Mark as read"
                                >
                                  ✓
                                </button>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 leading-snug ${t.rowMsg}`}>
                              {notification.message}
                            </p>
                            {notification.amount != null && (
                              <p className="text-xs font-semibold text-emerald-500 mt-0.5">
                                +{notification.amount.toLocaleString()}
                              </p>
                            )}
                            <p className={`text-[10px] mt-1 ${t.rowTime}`}>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Panel footer */}
                    <div className={`px-4 py-3 border-t ${t.panelFooter}`}>
                      <button
                        className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${t.footerBtn}`}
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}