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
  LogOut
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
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
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  onLogout: () => void
}

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  darkMode, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  onLogout 
}: SidebarProps) {
  const themeClasses = {
    sidebar: darkMode ? 'bg-gray-900 border-gray-800' : 'bg-emerald-900 border-emerald-800',
    sidebarText: darkMode ? 'text-gray-300' : 'text-emerald-100',
    sidebarHover: darkMode ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-emerald-800 hover:text-white',
    sidebarActive: darkMode ? 'bg-gray-800 text-white' : 'bg-emerald-800 text-white',
    border: darkMode ? 'border-gray-800' : 'border-emerald-800'
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className={`flex flex-col flex-grow ${themeClasses.sidebar} text-white pt-6 pb-4 overflow-hidden border-r ${themeClasses.border}`}>
          {/* Logo with Image */}
          <div className="flex items-center justify-center flex-shrink-0 px-6 pb-8">
            <div className="w-[220px] flex items-center justify-center relative overflow-hidden bg-white rounded-sm p-2">
              <Image
                src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                alt="Monietar Logo"
                width={208}
                height={8}
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation - No scroll */}
          <nav className="flex-1 px-4 space-y-2 overflow-visible">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all border ${
                    activeTab === item.id
                      ? `${themeClasses.sidebarActive} shadow-lg border-emerald-700`
                      : `${themeClasses.sidebarText} ${themeClasses.sidebarHover} border-transparent`
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Section - Fixed at bottom */}
          <div className={`flex-shrink-0 flex border-t ${themeClasses.border} p-6`}>
            <div className="flex items-center w-full">
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-emerald-200'}`}>{user.businessName}</p>
                <p className="text-xs text-emerald-300">{user.plan}</p>
              </div>
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
                  <div className="w-[120px] h-10 bg-white rounded-xl flex items-center justify-center relative overflow-hidden p-2">
                    <Image
                      src="https://res.cloudinary.com/dzibfknxq/image/upload/v1758404391/Monietar_full_logo-removebg-preview_wrhgjj.png"
                      alt="Monietar Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <h1 className="ml-3 text-xl font-bold text-white">Monietar</h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-emerald-100 hover:text-white"
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
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all border ${
                        activeTab === item.id
                          ? `${themeClasses.sidebarActive} shadow-lg border-emerald-700`
                          : `${themeClasses.sidebarText} ${themeClasses.sidebarHover} border-transparent hover:cursor-pointer`
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${themeClasses.border}`}>
                <div className="flex items-center justify-between">
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-emerald-200'}`}>{user.businessName}</p>
                    <p className="text-xs text-emerald-300">{user.plan}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}