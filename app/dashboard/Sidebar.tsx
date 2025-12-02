'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Home, 
  CreditCard, 
  PieChart, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Zap,
  Crown,
  Sun,
  Moon,
  Globe,
  Eye,
  EyeOff,
  Languages
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  badge?: 'new' | 'pro'
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
  currency: string
  setCurrency: (currency: string) => void
  language: string
  setLanguage: (language: string) => void
  showBalance: boolean
  setShowBalance: (show: boolean) => void
  currencies: Array<{ value: string; label: string }>
  languagesList: Array<{ value: string; label: string }>
  realTimeAlerts: Array<any>
}

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'budgets', label: 'Budgets', icon: PieChart},
  { id: 'connect account', label: 'Connect Account', icon: CreditCard },
  { id: 'reports', label: 'Reports', icon: FileText, badge: 'pro' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'pro' },
  { id: 'settings', label: 'Settings', icon: Settings}
]

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  darkMode, 
  setDarkMode,
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  onLogout,
  currency,
  setCurrency,
  language,
  setLanguage,
  showBalance,
  setShowBalance,
  currencies,
  languagesList,
  realTimeAlerts
}: SidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const themeClasses = {
    sidebar: 'bg-gray-900 border-gray-800',
    sidebarText: 'text-gray-300',
    sidebarHover: 'hover:bg-gray-800 hover:text-white',
    sidebarActive: 'bg-emerald-900/20 text-white border-l-4 border-emerald-400',
    border: 'border-gray-800',
    topBar: 'bg-gray-900 border-gray-800'
  }

  const getBadgeStyles = (type: 'new' | 'pro') => {
    if (type === 'new') {
      return 'border border-emerald-300 text-white'
    }
    return 'border border-emerald-300 text-white'
  }

  const getBadgeContent = (type: 'new' | 'pro') => {
    if (type === 'new') {
      return 'New'
    }
    return (
      <div className="flex items-center space-x-1">
        <Crown className="w-3 h-3" />
        <span>Pro</span>
      </div>
    )
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const getCurrentLanguage = () => {
    return languagesList.find(lang => lang.value === language)?.label || 'English'
  }

  const getCurrentCurrency = () => {
    return currencies.find(curr => curr.value === currency)?.label || 'USD'
  }

  return (
    <>
      {/* Top Navigation Bar - Enhanced with Toggles */}
      <div className={`fixed top-0 left-0 right-0 h-16 border-b z-40 lg:left-64 ${themeClasses.topBar}`}>
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          
          {/* Left Section - Only mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg lg:hidden text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center Section - Removed search bar */}

          {/* Enhanced Right Section with Functional Toggles */}
          <div className="flex items-center space-x-3">
            {/* Currency Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{getCurrentCurrency()}</span>
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
                    {currencies.map((curr) => (
                      <button
                        key={curr.value}
                        onClick={() => {
                          setCurrency(curr.value)
                          setIsCurrencyOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          currency === curr.value ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
                        }`}
                      >
                        {curr.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Balance Visibility */}
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hidden md:block"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
              >
                <Languages className="w-4 h-4" />
                <span className="text-sm">{getCurrentLanguage()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>



              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50"
                  >
                    {languagesList.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          setLanguage(lang.value)
                          setIsLanguageOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          language === lang.value ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-lg relative text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {realTimeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.businessName}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${
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
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
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
                      <div className="flex items-center px-3 py-2 rounded-lg mb-2 bg-gray-700">
                        <p className="text-sm text-emerald-400">
                          {user.businessName}
                        </p>
                      </div>
                      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-700">
                        <p className="text-sm text-emerald-400">
                          {user.plan}
                        </p>
                      </div>
                    </div>

                    <div className="p-2 border-t border-gray-700">
                      <button
                        onClick={handleLogoutConfirm}
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
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        <div className={`flex flex-col flex-grow ${themeClasses.sidebar} pt-8 pb-6 overflow-hidden border-r ${themeClasses.border}`}>
          {/* Logo - Removed from header but kept in sidebar */}
          <div className="flex items-center justify-center flex-shrink-0 px-6 pb-8">
            <div className="w-[180px] flex items-center justify-center relative">
              <Image
                src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                alt="Monietar Logo"
                width={160}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-visible mb-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex hover:cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium rounded-xl w-full transition-all duration-200 group ${
                    activeTab === item.id
                      ? `${themeClasses.sidebarActive} shadow-lg`
                      : `${themeClasses.sidebarText} ${themeClasses.sidebarHover} border-transparent`
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeStyles(item.badge)}`}>
                      {getBadgeContent(item.badge)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className={`flex-shrink-0 border-t ${themeClasses.border} p-3`}>
            <div className="flex flex-col space-y-4">
              {/* Logout Button */}
              <button
                onClick={handleLogoutConfirm}
                className="group relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex hover:cursor-pointer items-center justify-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className={`fixed inset-y-0 left-0 w-80 ${themeClasses.sidebar} text-white z-50 lg:hidden border-r ${themeClasses.border}`}
            >
              <div className={`flex items-center justify-between p-6 border-b ${themeClasses.border}`}>
                <div className="flex items-center">
                  <div className="w-[120px] h-10 rounded-xl flex items-center justify-center relative overflow-hidden p-2">
                    <Image
                      src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                      alt="Monietar Logo"
                      width={160}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-300 hover:text-white hover:cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 px-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center hover:cursor-pointer justify-between px-4 py-3 text-sm font-medium rounded-xl w-full transition-all border ${
                        activeTab === item.id
                          ? `${themeClasses.sidebarActive} shadow-lg border-emerald-700`
                          : `${themeClasses.sidebarText} ${themeClasses.sidebarHover} border-transparent hover:cursor-pointer`
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeStyles(item.badge)}`}>
                          {getBadgeContent(item.badge)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Logout Section */}
              <div className={`absolute bottom-0 left-0 right-0 p-3 border-t ${themeClasses.border}`}>
                <div className="flex flex-col space-y-4">
                  {/* Logout Button */}
                  <button
                    onClick={handleLogoutConfirm}
                    className="group relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex hover:cursor-pointer items-center justify-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowLogoutConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sign Out</h3>
                    <p className="text-sm text-gray-400">Are you sure you want to sign out?</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for top navigation */}
      <div className="h-16 lg:hidden" />
    </>
  )
}