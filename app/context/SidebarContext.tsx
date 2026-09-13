'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const SidebarContext =
  createContext<SidebarContextType | null>(
    null
  );

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context =
    useContext(SidebarContext);

  if (!context) {
    throw new Error(
      'useSidebar must be used within SidebarProvider'
    );
  }

  return context;
}