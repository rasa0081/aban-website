'use client';

import { Box } from '@mui/material';
import { useSidebar } from '../contexts/SidebarContext';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import BannerSlider from './layout/BannerSlider';
import LoadingScreen from './layout/LoadingScreen';
import MobileStyles from './MobileStyles';
import SecurityGuard from './SecurityGuard';
import RouteChangeLoader from './RouteChangeLoader';
import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function LayoutContent({ children }) {
  const { sidebarOpen, sidebarWidth } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = pathname?.startsWith('/admin');
  const isArticle = pathname?.startsWith('/articles');

  // SSR fallback
  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    );
  }

  // Admin pages: no Navbar, no Footer, no sidebar shift
  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flex: 1 }}>
          <Suspense fallback={null}>
            <RouteChangeLoader>
              {children}
            </RouteChangeLoader>
          </Suspense>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
        background: 'url("/pattern.webp")', backgroundSize: '1200px 1200px', opacity: 0.05,
      }} />
      <LoadingScreen />
      <MobileStyles />
      {/* SecurityGuard: active on all pages except articles */}
      {!isArticle && <SecurityGuard />}
      <Navbar />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.5s ease-in-out, width 0.5s ease-in-out',
          marginLeft: 0,
          width: '100%',
        }}
      >
        <Box component="main" sx={{ flex: 1 }}>
          <Suspense fallback={null}>
            <RouteChangeLoader>
              {children}
            </RouteChangeLoader>
          </Suspense>
        </Box>
        <BannerSlider />
        <Footer />
      </Box>
    </Box>
  );
}

export default function ClientLayout({ children }) {
  return (
    <LayoutContent>
      {children}
    </LayoutContent>
  );
};