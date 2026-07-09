'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Home,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  HelpCircle,
  RefreshCw,
  Coins,
  Boxes,
  FileSpreadsheet,
  TrendingUp,
  MessageSquareText,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface SidebarGroup {
  title: string
  items: NavigationItem[]
}

interface UserInfo {
  name: string
  email: string
  businessName: string
  avatar: string
  plan: string
  joinedDate: string
}

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: UserInfo
  onLogout: () => void
}

// ─── Navigation config ───────────────────────────────────────────────────────

const navigationGroups: SidebarGroup[] = [
  {
    title: 'MAIN',
    items: [
      { id: 'overview',      label: 'Overview',      icon: Home },
      { id: 'transactions',  label: 'Transactions',  icon: CreditCard },
      { id: 'analytics',     label: 'Analytics',     icon: BarChart3 },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'dual-currency', label: 'Dual-Currency Ledger', icon: Coins },
      { id: 'inventory',     label: 'Inventory Tracking',   icon: Boxes },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      { id: 'precompiled-statements', label: 'Pre-compiled Statements', icon: FileSpreadsheet },
      { id: 'pl-reports',             label: 'P&L Reports',             icon: TrendingUp },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help',     label: 'Help',     icon: HelpCircle },
    ],
  },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavLinks({
  activeTab,
  setActiveTab,
  onItemClick,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  onItemClick?: () => void
}) {
  return (
    <div className="flex-1 overflow-y-auto px-3 space-y-3">
      {navigationGroups.map((group) => (
        <div key={group.title} className="flex flex-col">
          <p className="text-[#A0AEC0] text-[10px] font-bold tracking-wider px-4 mb-1.5 mt-4 uppercase">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    onItemClick?.()
                  }}
                  className={`flex items-center px-4 py-2.5 text-xs rounded-xl w-full transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E2E8F0] text-[#1A365D] font-bold border-l-4 border-[#2D3748]'
                      : 'text-[#6C757D] hover:text-[#212529] hover:bg-[#E9ECEF]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mr-3 transition-colors ${
                      isActive ? 'text-[#1A365D]' : 'text-[#A0AEC0]'
                    }`}
                  />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function ChatBox() {
  const [chatInput, setChatInput] = useState('')

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatInput('')
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <MessageSquareText className="w-3.5 h-3.5 text-[#4A5568]" />
        <span className="text-[11px] font-bold text-[#2D3748]">AI Accounting Assistant</span>
      </div>
      <form onSubmit={handleChatSubmit} className="relative flex items-center">
        <input
          type="text"
          placeholder="Ask me anything financial..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg pl-2.5 pr-8 py-1.5 text-xs text-[#2D3748] placeholder-[#A0AEC0] focus:outline-none focus:border-[#4A5568]"
        />
        <button
          type="submit"
          className="absolute right-1.5 p-1 rounded-md text-[#A0AEC0] hover:text-[#4A5568] transition-colors"
          aria-label="Send"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </form>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        <button
          type="button"
          className="text-[10px] font-semibold bg-[#F7FAFC] hover:bg-[#EDF2F7] border border-[#E2E8F0] text-[#4A5568] py-1 px-1.5 rounded-md text-center transition-colors"
        >
          Voice Report
        </button>
        <button
          type="button"
          className="text-[10px] font-semibold bg-[#F7FAFC] hover:bg-[#EDF2F7] border border-[#E2E8F0] text-[#4A5568] py-1 px-1.5 rounded-md text-center transition-colors"
        >
          Audit Check
        </button>
      </div>
    </div>
  )
}

function LogoutConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-5 max-w-xs w-full relative z-10 shadow-xl"
      >
        <h3 className="text-sm font-bold text-[#2D3748] mb-1">Confirm Sign Out</h3>
        <p className="text-xs text-[#718096] mb-4">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 text-xs font-semibold text-[#4A5568] bg-[#EDF2F7] rounded-xl transition-colors hover:bg-[#E2E8F0]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const sidebarFooter = (
    <div className="p-3 border-t border-[#E2E8F0] space-y-3">
      {/* AI Chat Box */}
      <ChatBox />

      {/* Logout */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="flex items-center w-full px-3 py-2 text-xs font-semibold text-red-600 rounded-xl hover:bg-red-50 border border-[#E2E8F0] bg-white transition-colors"
      >
        <LogOut className="w-3.5 h-3.5 mr-2" />
        Sign Out
      </button>
    </div>
  )

  return (
    <>
      {/* ── Mobile menu trigger (rendered in Header slot via a portal would be
           ideal, but keeping it self-contained here as a floating button) ── */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors lg:hidden shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 bg-[#F8F9FA] border-r border-[#E9ECEF]">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-[#E2E8F0] h-16 flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
            alt="Monietar Logo"
            width={140}
            height={32}
            className="object-contain"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-2 overflow-y-auto">
          <NavLinks activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        {/* Footer: chatbox + logout */}
        {sidebarFooter}
      </aside>

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#F8F9FA] border-r border-[#E9ECEF] z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] bg-white h-16 flex-shrink-0">
                <Image
                  src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
                  alt="Monietar Logo"
                  width={110}
                  height={26}
                  className="object-contain"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 mt-2 overflow-y-auto">
                <NavLinks
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </nav>

              {/* Footer: chatbox + logout */}
              {sidebarFooter}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Logout confirm modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirmModal
            onConfirm={() => {
              setShowLogoutConfirm(false)
              onLogout()
            }}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )}
      </AnimatePresence>

      {/* Push desktop content right */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0" aria-hidden="true" />
    </>
  )
}