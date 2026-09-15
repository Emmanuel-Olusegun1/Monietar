'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;

  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext =
  createContext<SidebarContextType | undefined>(
    undefined
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

  // Close the mobile sidebar when moving
  // into desktop viewport sizes.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, []);

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
  const context = useContext(
    SidebarContext
  );

  if (context === undefined) {
    throw new Error(
      'useSidebar must be used within SidebarProvider'
    );
  }

  return context;
}
