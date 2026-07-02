'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Custom SVG icons
const IconAbout = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M17 4l1.5 1.5M19 8h-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconContact = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M2 7l10 6.5L22 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconServices = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const IconPortfolio = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 5V4a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconArticles = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import { colors } from '../../theme/theme';
import Link from 'next/link';
import { useSidebar } from '../../contexts/SidebarContext';

const navItems = [
  { name: 'خواندنی ها', icon: <IconArticles />, path: '/articles' },
  { name: 'پورتفولیو', icon: <IconPortfolio />, path: '/portfolio' },
  { name: 'خدمات', icon: <IconServices />, path: '/services' },
  { name: 'تماس با ما', icon: <IconContact />, path: '/contact' },
  { name: 'درباره آبان', icon: <IconAbout />, path: '/about' },
];

const navItems2 = [
  { name: 'خدمات', icon: <IconServices />, path: '/services' },
  { name: 'خواندنی ها', icon: <IconArticles />, path: '/articles' },
  { name: 'پورتفولیو', icon: <IconPortfolio />, path: '/portfolio' },
  { name: 'تماس با ما', icon: <IconContact />, path: '/contact' },
  { name: 'درباره آبان', icon: <IconAbout />, path: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  
  let sidebarContext;
  try {
    sidebarContext = useSidebar();
  } catch (error) {
    console.log('Sidebar context not available yet');
  }
  
  const setSidebarOpen = sidebarContext?.setSidebarOpen || (() => {});
  const setSidebarWidth = sidebarContext?.setSidebarWidth || (() => {});

  useEffect(() => {
    setMounted(true);
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 900);
      setIsTablet(window.innerWidth >= 900 && window.innerWidth < 1400);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      const isScrolled = currentScrollY > 100;
      setScrolled(isScrolled);
      
      const viewportHeight = window.innerHeight;
      const newActiveSection = Math.round(currentScrollY / viewportHeight);
      setActiveSection(newActiveSection);
      
      if (setSidebarOpen) {
        setSidebarOpen(isScrolled && (isMobile || isTablet));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isTablet, setSidebarOpen]);

  useEffect(() => {
    if (setSidebarWidth) {
      if (isMobile) setSidebarWidth(80);
      else if (isTablet) setSidebarWidth(90);
      else setSidebarWidth(0);
    }
  }, [isMobile, isTablet, setSidebarWidth]);

  const getIconOffset = (index) => {
    if (!mounted || isMobile) return 0;
    
    const totalItems = navItems.length;
    const position = index / (totalItems - 1);
    const angle = (position - 0.5) * Math.PI;
    const offset = Math.abs(Math.sin(angle)) * (isTablet ? 20 : 40);
    
    return scrolled ? offset * 0.3 : offset;
  };

  if (!mounted) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 240,
          background: colors.primary,
          borderBottomLeftRadius: '50% 240px',
          borderBottomRightRadius: '50% 240px',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            mt: 3,
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes logoSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes navItemSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Desktop Arc Navbar ── */}
      <Box
        sx={{
          position: 'fixed',
          top: scrolled ? (isTablet ? -176 : -240) : 0,
          left: 0,
          right: 0,
          height: isTablet ? 176 : 240,
          background: colors.primary,
          backdropFilter: 'blur(12px)',
          borderBottomLeftRadius: isTablet ? '50% 176px' : '50% 240px',
          borderBottomRightRadius: isTablet ? '50% 176px' : '50% 240px',
          zIndex: 1200,
          overflow: 'visible',
          pointerEvents: 'none',
          boxShadow: scrolled ? '0 10px 30px 0 rgba(12,43,41,0.5)' : '0 20px 40px 0 rgba(12,43,41,0.6)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderTop: 'none',
          transition: 'top 0.5s cubic-bezier(0.4,0,0.2,1)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ pointerEvents: 'auto' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              position: 'relative',
              mt: isMobile ? 2 : isTablet ? 3 : 4,
              width: isMobile ? 56 : isTablet ? 66 : 86,
              height: isMobile ? 56 : isTablet ? 66 : 86,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.08)',
              },
              '&:hover .logo-glow': { opacity: 0.95 },
              '&:hover .logo-ring': { opacity: 1 },
            }}
          >
            {/* soft gold glow */}
            <Box className="logo-glow" sx={{
              position: 'absolute', inset: '-32%', borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.gold}55 0%, transparent 62%)`,
              filter: 'blur(7px)', opacity: 0.6, transition: 'opacity 0.4s ease', pointerEvents: 'none',
            }} />
            {/* rotating gold ring */}
            <Box className="logo-ring" sx={{
              position: 'absolute', inset: '-3px', borderRadius: '50%', padding: '2px',
              background: `conic-gradient(from 0deg, transparent 0%, ${colors.gold} 22%, transparent 45%, ${colors.gold}aa 70%, transparent 100%)`,
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor', maskComposite: 'exclude',
              animation: 'logoSpin 9s linear infinite',
              opacity: 0.8, transition: 'opacity 0.4s ease', pointerEvents: 'none',
            }} />
            {/* frosted disc */}
            <Box sx={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${colors.gold}3a`,
              boxShadow: `inset 0 1px 14px ${colors.gold}26, 0 8px 26px rgba(0,0,0,0.38)`,
              pointerEvents: 'none',
            }} />
            <img 
              src={'/Logo.png'}
              alt='آبان لوگو'
              style={{ 
                position: 'relative',
                zIndex: 1,
                width: '60%',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 3px 9px rgba(0,0,0,0.45))',
              }}
            />
          </Box>
        </Link>

        {!isMobile && !scrolled && (
          <Box
            sx={{
              position: 'absolute',
              bottom: isTablet ? 15 : 18,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: isTablet ? 10 : 14,
              px: 2,
              width: '100%',
              maxWidth: isTablet ? 900 : 1200,
              mx: 'auto',
            }}
          >
            {navItems.map((item, index) => {
              const offset = getIconOffset(index);
              const isHovered = hoveredIndex === index;
              const delay = index * 0.1;
              
              return (
                <Tooltip key={index} title={item.name} arrow placement="bottom"
                  slotProps={{ tooltip: { sx: { bgcolor: colors.primary, fontSize: '0.78rem', fontWeight: 'bold', borderRadius: '8px', border: `1px solid rgba(197,165,108,0.3)` } }, arrow: { sx: { color: colors.primary } } }}>
                <Link 
                  href={item.path} 
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: colors.background,
                      transform: `translateY(-${offset}px) scale(${isTablet ? 1.0 : 1.1})`,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      
                      '&:hover': {
                        color: colors.gold,
                        transform: `translateY(-${offset}px) scale(${isTablet ? 1.15 : 1.3})`,
                        filter: 'drop-shadow(0 0 15px rgba(197, 165, 108, 0.5))',
                      }
                    }}
                  >
                    <Box sx={{ 
                      fontSize: isTablet ? 22 : 26,
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      transition: 'all 0.3s ease',
                    }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ 
                      fontSize: isTablet ? 10 : 11, 
                      mt: 0.3, 
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      display: isTablet ? 'none' : 'block',
                      transition: 'all 0.3s ease',
                    }}>
                      {item.name}
                    </Typography>
                  </Box>
                </Link>
                </Tooltip>
              );
            })}
          </Box>
        )}


        </Box>
      </Box>

      {/* ── Mobile Top Navbar ── */}
      <Box sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1200,
        flexDirection: 'column',
      }}>
        {/* Main bar */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          bgcolor: colors.primary,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(12,43,41,0.4)',
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? 'none' : 'auto',
          transition: 'opacity 0.35s ease',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}>
              <Box component="img" src="/Logo.png" alt="آبان"
                sx={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(197,165,108,0.4))' }} />
              <Typography sx={{ color: colors.gold, fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                آبان
              </Typography>
            </Box>
          </Link>

          {/* Nav icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            {navItems.map((item, index) => (
              <Tooltip key={index} title={item.name} arrow placement="bottom"
                slotProps={{ tooltip: { sx: { bgcolor: colors.primary, fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '8px' } }, arrow: { sx: { color: colors.primary } } }}>
              <Link href={item.path} style={{ textDecoration: 'none' }}>
                <Box sx={{
                  width: 48, height: 52,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  gap: 0.3,
                  animation: `navItemSlideIn ${0.1 + index * 0.05}s ease-out both`,
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    color: colors.gold,
                    bgcolor: 'rgba(197,165,108,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': { transform: 'scale(0.88)', opacity: 0.8 },
                }}>
                  <Box sx={{ fontSize: 18, display: 'flex' }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: 9, fontWeight: 'bold', mt: 0.2, lineHeight: 1 }}>{item.name}</Typography>
                </Box>
              </Link>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Animated gold line at bottom */}
        <Box sx={{
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
          opacity: scrolled ? 0 : 0.35,
          transition: 'opacity 0.35s ease',
        }} />
      </Box>

      {/* Glassy Capsule Sidebar - SMALLER ON MOBILE (HALF SIZE) */}
      <Box
        sx={{
          position: 'fixed',
          left: {
            xs: 15,
            sm: 20,
            md: 30,
            lg: 12,
            xl: 30,
          },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1300,
          display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex', xl: 'flex' },
          flexDirection: 'column',
          background: 'rgba(12, 43, 41, 0.75)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: { lg: '50px', xl: '80px' },
          border: '1.5px solid rgba(197, 165, 108, 0.4)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
          opacity: scrolled ? 1 : 0,
          visibility: scrolled ? 'visible' : 'hidden',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: scrolled ? 'auto' : 'none',
          py: { lg: 2, xl: 3 },
          px: { lg: 1.5, xl: 2 },
          alignItems: 'center',
          justifyContent: 'center',
          gap: {
            xs: 1,
            sm: 1.5,
            md: 2,
            lg: 1,
            xl: 2,
          },
        }}
      >
        {/* Logo in capsule - SMALLER ON MOBILE */}
        <Link href="/" sx={{ textDecoration: 'none' }}>
  <Box
    sx={{
      width: { xs: 35, sm: 45, md: 60, lg: 38, xl: 60 },
      height: { xs: 35, sm: 45, md: 60, lg: 38, xl: 60 },
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: { xs: 0.5, sm: 1, md: 1.5, lg: 0.5, xl: 1.5 },
      border: '1.5px solid rgba(197, 165, 108, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(197, 165, 108, 0.25)',
        transform: 'scale(1.15)',
        borderColor: colors.gold, // ensure colors is defined
        boxShadow: '0 0 20px rgba(197, 165, 108, 0.5)',
      },
    }}
  >
    <Box
      component="img"
      src="/Logo.png"
      alt="آبان لوگو"
      sx={{
        width: { xs: '60%', sm: '65%', md: '70%' },
        height: 'auto',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
      }}
    />
  </Box>
</Link>

        {/* Navigation Icons - SMALLER ON MOBILE */}
        {navItems2.map((item, index) => (
          <Tooltip key={index} title={item.name} arrow placement="right"
            slotProps={{ tooltip: { sx: { bgcolor: colors.primary, fontSize: '0.78rem', fontWeight: 'bold', borderRadius: '8px', border: `1px solid rgba(197,165,108,0.3)` } }, arrow: { sx: { color: colors.primary } } }}>
          <Link 
            href={item.path} 
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.9)',
                width: { xs: 35, sm: 45, md: 55, lg: 36, xl: 55 },
                height: { xs: 35, sm: 45, md: 55, lg: 36, xl: 55 },
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent',
                position: 'relative',
                
                '&:hover': {
                  color: colors.gold,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'scale(1.15)',
                  border: '1.5px solid rgba(197, 165, 108, 0.6)',
                  boxShadow: '0 0 15px rgba(197, 165, 108, 0.3)',
                },
              }}
            >
              <Box sx={{ 
                fontSize: {
                  xs: 18,
                  sm: 22,
                  md: 28,
                  lg: 18,
                  xl: 28
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.icon}
              </Box>
            </Box>
          </Link>
          </Tooltip>
        ))}

        {/* Indicator dot - SMALLER ON MOBILE */}
        <Box
          sx={{
            width: { xs: 3, sm: 3.5, md: 4, lg: 3, xl: 4 },
            height: { xs: 3, sm: 3.5, md: 4, lg: 3, xl: 4 },
            borderRadius: '50%',
            background: colors.gold,
            opacity: 0.5,
            mt: {
              xs: 0.5,
              sm: 0.8,
              md: 1
            },
          }}
        />
      </Box>

      {/* Glassy Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 320,
            background: 'linear-gradient(135deg, rgba(12, 43, 41, 0.7) 0%, rgba(26, 64, 61, 0.6) 100%)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            color: colors.background,
            borderTopLeftRadius: '50% 100px',
            borderBottomLeftRadius: '50% 100px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        <Box sx={{ 
          p: 4, 
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              position: 'absolute',
              top: 30,
              left: 50,
              color: colors.gold,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              width: 45,
              height: 45,
              zIndex: 10,
              
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                transform: 'scale(1.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 25px rgba(197, 165, 108, 0.5)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                mx: 'auto',
                mb: 6,
                mt: 5,
                border: '3px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(5px)',
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                
                '&:hover': {
                  transform: 'scale(1.1)',
                  borderColor: colors.gold,
                  boxShadow: '0 0 40px rgba(197, 165, 108, 0.5)',
                },
              }}
            >
              <img 
                src={'/Logo.svg'}
                alt='آبان لوگو'
                style={{ 
                  width: '100%',
                  height: 'auto',
                  maxWidth: '60px',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }}
              />
            </Box>
          </Link>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5,
            flex: 1,
          }}>
            {navItems2.map((item, index) => {
              return (
                <Link 
                  href={item.path} 
                  key={item.name}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      p: 2,
                      borderRadius: '30px 30px 30px 30px / 40px 40px 40px 40px',
                      color: 'rgba(255, 255, 255, 0.95)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                        transition: 'left 0.5s ease',
                      },
                      
                      '&:hover': {
                        color: colors.gold,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        transform: 'translateX(-8px) scale(1.02)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        
                        '&::before': {
                          left: '100%',
                        },
                      },
                    }}
                  >
                    <Box sx={{ 
                      color: colors.gold, 
                      fontSize: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '50%',
                      padding: '10px',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                    }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ 
                      fontSize: 18, 
                      fontWeight: 'bold',
                      textShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                    }}>
                      {item.name}
                    </Typography>
                  </Box>
                </Link>
              );
            })}
          </Box>

          <Box
            sx={{
              mt: 'auto',
              pt: 3,
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 60,
                borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, transparent 80%)',
                filter: 'blur(15px)',
              }}
            />
          </Box>
        </Box>
      </Drawer>

      {/* ── Mobile Minimal Bottom Navbar ── */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none', xl: 'none' },
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1400,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(12,43,41,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '50px',
            border: '1px solid rgba(197,165,108,0.35)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            px: 1.5,
            py: 1,
          }}
        >
          {/* Logo dot */}
          <Tooltip title="صفحه اصلی" arrow placement="bottom"
            slotProps={{ tooltip: { sx: { bgcolor: 'rgba(12,43,41,0.95)', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '8px', border: '1px solid rgba(197,165,108,0.3)' } }, arrow: { sx: { color: 'rgba(12,43,41,0.95)' } } }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mr: 0.5,
              '&:hover': { bgcolor: 'rgba(197,165,108,0.15)' },
              transition: 'all 0.2s',
            }}>
              <Box component="img" src="/Logo.png" alt="آبان" sx={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(10)' }} />
            </Box>
          </Link>
          </Tooltip>

          {/* Divider */}
          <Box sx={{ width: 1, height: 24, bgcolor: 'rgba(197,165,108,0.25)', mx: 0.5 }} />

          {/* Nav icons */}
          {navItems2.map((item, index) => (
            <Tooltip key={index} title={item.name} arrow placement="bottom"
              slotProps={{ tooltip: { sx: { bgcolor: 'rgba(12,43,41,0.95)', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '8px', border: '1px solid rgba(197,165,108,0.3)' } }, arrow: { sx: { color: 'rgba(12,43,41,0.95)' } } }}>
            <Link href={item.path} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  width: 44, height: 48, borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  gap: 0.3,
                  '&:hover': {
                    color: colors.gold,
                    bgcolor: 'rgba(197,165,108,0.15)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', fontSize: 18 }}>{item.icon}</Box>
                <Typography sx={{ fontSize: 9, fontWeight: 'bold', lineHeight: 1 }}>{item.name}</Typography>
              </Box>
            </Link>
            </Tooltip>
          ))}
        </Box>
      </Box>

    </>
  );
}