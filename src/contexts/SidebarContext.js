'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const value = useMemo(() => ({
    sidebarOpen: mounted ? sidebarOpen : false,
    setSidebarOpen,
    sidebarWidth: mounted ? sidebarWidth : 0,
    setSidebarWidth
  }), [sidebarOpen, sidebarWidth, mounted]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    // Return default values instead of throwing error during SSR
    return {
      sidebarOpen: false,
      setSidebarOpen: () => {},
      sidebarWidth: 0,
      setSidebarWidth: () => {},
    };
  }
  return context;
};