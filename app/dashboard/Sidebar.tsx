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
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Languages,
  Currency,
  HelpCircle,
  RefreshCw,
  Coins,
  Boxes,
  FileSpreadsheet,
  TrendingUp,
  MessageSquareText,
  Sparkles
} from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { CURRENCIES, LANGUAGES } from '@/app/utils/constants'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
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
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  onLogout: () => void
  showBalance: boolean
  setShowBalance: (show: boolean) => void
  realTimeAlerts: Array<any>
}

const navigationGroups: SidebarGroup[] = [
  {
    title: 'MAIN',
    items: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'transactions', label: 'Transactions', icon: CreditCard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'dual-currency', label: 'Dual-Currency Ledger', icon: Coins },
      { id: 'inventory', label: 'Inventory Tracking', icon: Boxes }
    ]
  },
  {
    title: 'REPORTS',
    items: [
      { id: 'precompiled-statements', label: 'Pre-compiled Statements', icon: FileSpreadsheet },
      { id: 'pl-reports', label: 'P&L Reports', icon: TrendingUp }
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help', label: 'Help', icon: HelpCircle }
    ]
  }
]

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  darkMode, 
  setDarkMode,
  onLogout,
  showBalance,
  setShowBalance,
  realTimeAlerts
}: SidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [chatInput, setChatInput] = useState('')

  const { settings, updateSettings, isLoading } = useSettings()

  // Clean Light Mode Palette mirroring the reference dashboard design context
  const themeClasses = {
    sidebar: 'bg-[#F8F9FA] border-[#E9ECEF]',
    sidebarText: 'text-[#6C757D] hover:text-[#212529]',
    sidebarHover: 'hover:bg-[#E9ECEF]',
    sidebarActive: 'bg-[#E2E8F0] text-[#1A365D] font-bold border-l-4 border-[#2D3748]',
    groupTitle: 'text-[#A0AEC0] text-[10px] font-bold tracking-wider px-4 mb-1.5 mt-4',
    border: 'border-[#E2E8F0]',
    topBar: 'bg-white border-[#E2E8F0]'
  }

  const handleLogoutConfirm = () => setShowLogoutConfirm(true)
  const handleLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const getCurrentLanguage = () => LANGUAGES.find(lang => lang.value === settings?.language)?.label || 'English'
  const getCurrentCurrency = () => CURRENCIES.find(curr => curr.value === settings?.currency)?.label || 'NGN'

  const handleCurrencyChange = async (newCurrency: string) => {
    try {
      await updateSettings({ currency: newCurrency })
      setIsCurrencyOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await updateSettings({ language: newLanguage })
      setIsLanguageOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleThemeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    updateSettings({ theme: newDarkMode ? 'dark' : 'light' })
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatInput('')
  }

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="flex-1 overflow-y-auto px-3 space-y-3">
      {navigationGroups.map((group) => (
        <div key={group.title} className="flex flex-col">
          <p className={themeClasses.groupTitle}>{group.title}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    if (onItemClick) onItemClick()
                  }}
                  className={`flex items-center px-4 py-2.5 text-xs rounded-xl w-full transition-all duration-150 cursor-pointer ${
                    isActive ? themeClasses.sidebarActive : `${themeClasses.sidebarText} ${themeClasses.sidebarHover}`
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-[#1A365D]' : 'text-[#A0AEC0]'}`} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Top Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 h-16 border-b z-40 lg:left-64 ${themeClasses.topBar}`}>
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg lg:hidden text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency Dropdown Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#4A5568] transition-colors"
                disabled={isLoading}
              >
                <Currency className="w-3.5 h-3.5 text-[#718096]" />
                <span>{getCurrentCurrency()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCurrencyOpen && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full right-0 mt-2 w-32 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-1"
                  >
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.value}
                        onClick={() => handleCurrencyChange(curr.value)}
                        className={`w-full px-3 py-2 text-xs text-left cursor-pointer hover:bg-[#F7FAFC] rounded-lg transition-colors ${
                          settings?.currency === curr.value ? 'text-[#2B6CB0] bg-[#EBF8FF] font-semibold' : 'text-[#4A5568]'
                        }`}
                      >
                        {curr.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Utility Toggles */}
            <button onClick={handleThemeToggle} className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#718096] hover:text-[#2D3748] transition-colors">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#718096] hover:text-[#2D3748] transition-colors">
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#718096] hover:text-[#2D3748] relative transition-colors">
              <Bell className="w-4 h-4" />
              {realTimeAlerts.length > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>

            {/* Account Information View Control */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[#2D3748] hover:bg-[#F7FAFC] transition-colors"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-[#4A5568] to-[#2D3748] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold leading-none mb-0.5 text-[#2D3748]">{user.name}</p>
                  <p className="text-[10px] text-[#718096] leading-none">{user.businessName}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A0AEC0]" />
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-[#E2E8F0] shadow-xl bg-white z-50 p-1"
                  >
                    <div className="p-3 border-b border-[#E2E8F0]">
                      <p className="text-xs font-semibold text-[#2D3748] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#718096] truncate mb-2.5">{user.email}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF2F7] text-[#4A5568]">
                        {user.plan}
                      </span>
                    </div>
                    <div className="p-1">
                      <button onClick={handleLogoutConfirm} className="flex items-center w-full px-3 py-2 text-xs text-red-600 rounded-lg hover:bg-red-50/60 transition-colors text-left font-medium">
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Layout */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        <div className={`flex flex-col flex-grow ${themeClasses.sidebar} pt-6 pb-4 overflow-hidden border-r`}>
          
          {/* Logo Container Section */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-[#E2E8F0]">
            <div className="w-[140px] flex items-center relative h-10">
              <Image
                src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
                alt="Monietar Logo"
                width={140}
                height={32}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Premium Account Elevation Upgrade Trigger Banner */}
          <div className="px-4 pt-4 pb-1">
            <button className="w-full flex items-center justify-between bg-gradient-to-r from-[#1A365D] to-[#2A4365] text-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all group text-left">
              <div>
                <p className="text-[11px] font-bold text-white/90 tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                  UPGRADE PLAN
                </p>
                <p className="text-[9px] text-[#E2E8F0] mt-0.5 font-medium">Unlock Borderless Pro Engine</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#E2E8F0] -rotate-90 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Core Functional Module Links */}
          <nav className="flex-1 mt-2 space-y-1 overflow-y-auto">
            {renderNavLinks()}
          </nav>

          {/* Embedded AI Financial Agent Intelligence Input Box */}
          <div className="p-3 border-t border-[#E2E8F0]">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
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
                <button type="submit" className="absolute right-1.5 p-1 rounded-md text-[#A0AEC0] hover:text-[#4A5568] transition-colors">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </form>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button type="button" className="text-[10px] font-semibold bg-[#F7FAFC] hover:bg-[#EDF2F7] border border-[#E2E8F0] text-[#4A5568] py-1 px-1.5 rounded-md text-center transition-colors">
                  Voice Report
                </button>
                <button type="button" className="text-[10px] font-semibold bg-[#F7FAFC] hover:bg-[#EDF2F7] border border-[#E2E8F0] text-[#4A5568] py-1 px-1.5 rounded-md text-center transition-colors">
                  Audit Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Viewport Context Panels */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`fixed inset-y-0 left-0 w-72 ${themeClasses.sidebar} z-50 lg:hidden flex flex-col border-r shadow-2xl`}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-white">
                <div className="w-[110px] flex items-center relative h-8">
                  <Image
                    src="https://res.cloudinary.com/dzibfknxq/image/upload/v1768783064/Artboard_23_hn5kno.png"
                    alt="Monietar Logo"
                    width={110}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg text-[#6C757D] hover:bg-[#E9ECEF]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 mt-2 space-y-1 overflow-y-auto">
                {renderNavLinks(() => setIsMobileMenuOpen(false))}
              </nav>

              <div className="p-3 border-t border-[#E2E8F0] bg-white">
                <div className="bg-[#F7FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-center">
                  <p className="text-xs font-bold text-[#2D3748] mb-1.5">{user.businessName}</p>
                  <button onClick={handleLogoutConfirm} className="w-full text-[#6C757D] hover:text-red-600 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold bg-white transition-colors flex items-center justify-center space-x-1">
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Disconnect Security Action Overlays */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setShowLogoutConfirm(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 max-w-xs w-full relative z-10 shadow-xl">
              <h3 className="text-sm font-bold text-[#2D3748] mb-1">Confirm Sign Out</h3>
              <p className="text-xs text-[#718096] mb-4">Are you sure you want to log out of your retail portal manager?</p>
              <div className="flex space-x-2">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-3 py-2 text-xs font-semibold text-[#4A5568] bg-[#EDF2F7] rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleLogout} className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="h-16 lg:hidden" />
    </>
  )
}