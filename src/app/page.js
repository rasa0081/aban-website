'use client';

import { Box, Container, Typography, Button, Grid, Tooltip } from '@mui/material';
import { linkProps } from '../lib/linkProps';
import { colors } from '../theme/theme';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSidebar } from '../contexts/SidebarContext';
import ImageCarousel from '../components/ImageCarousel';
import { MobileHomePage } from '../components/MobileApp';
import { sectionImagesApi } from '../lib/api';
import { useHomeContent } from '../hooks/useHomeContent';

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [isPastLastSection, setIsPastLastSection] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const { sidebarOpen, sidebarWidth } = useSidebar();
  const lastScrollTime = useRef(0);
  const wheelDeltaRef = useRef(0);
  const touchStartY = useRef(0);
  const isTouching = useRef(false);
  const sectionRefs = useRef([]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sectionImages, setSectionImages] = useState({});

  // Homepage sections (hero + cards) come from the DB via the admin panel.
  const { sections } = useHomeContent();
  const visibleSections = sections.filter(s => s.visible);
  // Ref so the wheel/touch/key handlers always read the latest section count
  // without needing to re-subscribe their listeners.
  const sectionCountRef = useRef(0);
  sectionCountRef.current = visibleSections.length;

  useEffect(() => {
    setHasMounted(true);
    // Load all section images from DB
    sectionImagesApi.getAll().then(images => {
      if (Array.isArray(images)) {
        const grouped = images.reduce((acc, img) => {
          if (!acc[img.sectionId]) acc[img.sectionId] = [];
          acc[img.sectionId].push(img);
          return acc;
        }, {});
        setSectionImages(grouped);
      }
    }).catch(() => {});
  }, []);
  
  useEffect(() => {
    if (activeSection > 0 && !hasScrolled) {
      setHasScrolled(true);
    }
  }, [activeSection, hasScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      const isNearBottom = scrollPosition + windowHeight >= totalHeight - 100;
      setShowFooter(isNearBottom);
      
      const maxSection = sectionCountRef.current - 1;
      let newActiveSection = Math.round(scrollPosition / viewportHeight);
      
      if (isNearBottom) {
        newActiveSection = maxSection;
      }
      
      setActiveSection(Math.min(newActiveSection, maxSection));

      // Hide dots when on last section or beyond
      setIsPastLastSection(newActiveSection >= maxSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTime.current < 800) {
        return;
      }
      
      wheelDeltaRef.current += e.deltaY;
      
      if (Math.abs(wheelDeltaRef.current) < 50) {
        return;
      }
      
      const direction = wheelDeltaRef.current > 0 ? 1 : -1;
      const maxSection = sectionCountRef.current - 1;
      
      let nextSection = activeSection + direction;
      
      if (activeSection === maxSection && direction > 0) {
        const footerTop = (maxSection + 1) * window.innerHeight;
        window.scrollTo({
          top: footerTop,
          behavior: 'smooth'
        });
        lastScrollTime.current = now;
        wheelDeltaRef.current = 0;
        return;
      }
      
      nextSection = Math.max(0, Math.min(maxSection, nextSection));
      
      if (nextSection !== activeSection) {
        lastScrollTime.current = now;
        setIsScrolling(true);
        
        window.scrollTo({
          top: nextSection * window.innerHeight,
          behavior: 'smooth'
        });
        
        wheelDeltaRef.current = 0;
        
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      } else {
        wheelDeltaRef.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      isTouching.current = true;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isTouching.current) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (!isTouching.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      
      const now = Date.now();
      if (now - lastScrollTime.current < 800) {
        isTouching.current = false;
        return;
      }
      
      if (Math.abs(deltaY) > 30) {
        const direction = deltaY > 0 ? 1 : -1;
        const maxSection = sectionCountRef.current - 1;
        
        if (activeSection === maxSection && direction > 0) {
          const footerTop = (maxSection + 1) * window.innerHeight;
          window.scrollTo({
            top: footerTop,
            behavior: 'smooth'
          });
          lastScrollTime.current = now;
          isTouching.current = false;
          return;
        }
        
        const nextSection = Math.max(0, Math.min(maxSection, activeSection + direction));
        
        if (nextSection !== activeSection) {
          lastScrollTime.current = now;
          setIsScrolling(true);
          
          window.scrollTo({
            top: nextSection * window.innerHeight,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            setIsScrolling(false);
          }, 800);
        }
      }
      
      isTouching.current = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastScrollTime.current < 800) return;
        
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        const maxSection = sectionCountRef.current - 1;
        
        if (activeSection === maxSection && direction > 0) {
          const footerTop = (maxSection + 1) * window.innerHeight;
          window.scrollTo({
            top: footerTop,
            behavior: 'smooth'
          });
          lastScrollTime.current = now;
          return;
        }
        
        const nextSection = Math.max(0, Math.min(maxSection, activeSection + direction));
        
        if (nextSection !== activeSection) {
          lastScrollTime.current = now;
          window.scrollTo({
            top: nextSection * window.innerHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  return (
    <>
    {/* ── Mobile View ── */}
    <MobileHomePage />

    {/* ── Desktop View ── */}
    <Box 
      sx={{ 
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'visible',
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* Fixed Logo on Left - This stays independent */}
      {hasMounted && (
        <Box
          sx={{
            position: 'fixed',
            right: { lg: '30px' }, // Fixed on left side, independent
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1400,
            display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
            width: { lg: '150px' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            visibility: activeSection === 0 && !isAnimating ? 'hidden' : 'visible',
            ...(hasScrolled && {
              animation: activeSection === 0 
                ? 'slideOutToLeft 0.5s ease-in forwards'
                : 'slideInFromLeft 0.6s ease-out',
            }),
            pointerEvents: activeSection === 0 ? 'none' : 'auto',
            '&:hover': {
              transform: 'translateY(-50%) scale(1.05)',
            },
          }}
          onClick={() => {
            if (activeSection !== 0) {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }
          }}
        >
          <img 
            src="/Logo.png"
            alt="آبان لوگو"
            style={{
              width: '100%',
              height: 'auto',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
            }}
          />
        </Box>
      )}
      
      {/* Main Content with Sections - Centered */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
        }}
      >
        {visibleSections.map((section, index) => (
          <Box
            key={section.id}
            ref={el => sectionRefs.current[index] = el}
            id={`section-${index}`}
            sx={{
              height: '100vh',
              width: '100%',
              background: section.backgroundColor,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'start',
            }}
          >
            {section.hasPattern && (
              <Box
                sx={{
                  position: 'absolute',
                  width: '100vw',
                  height: '100vh',
                  background: 'url("/pattern.webp")',
                  backgroundSize: '1200px 1200px',
                  opacity: '0.05'
                }}
              />
            )}

            <Container
              maxWidth="lg"
              sx={{
                position: 'relative',
                zIndex: 2,
                pt: { 
                  xs: '100px',
                  sm: '120px',
                  md: '80px',
                  lg: '100px'
                },
                pb: { xs: 3, md: 6 },
                px: { xs: 3, sm: 4, md: 6 },
                // Remove any left/right shifting - center everything
                mx: 'auto',
              }}
            >
              {/* For hero section (no carousel) - center the text */}
              {section.type === 'hero' ? (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // Navbar is `position: fixed` and removed from the document flow, so this
                    // section has to reserve its own clearance for it. The arc navbar's real
                    // rendered height changes with viewport width (see Navbar.js: 176px between
                    // 900-1399px, 240px at 1400px+), so minHeight/pt below are kept in sync with
                    // those exact breakpoints instead of MUI's default sm/md/lg ones.
                    minHeight: { md: 'calc(100vh - 176px)' },
                    textAlign: 'center',
                    // pt is a hard floor (unaffected by vertical centering), so it must alone be
                    // tall enough to clear the navbar at every width — with a comfortable buffer,
                    // not just barely. Previously this was a flat 50px, which left only ~10px of
                    // clearance at 1400px+ (where the navbar is tallest), making the heading look
                    // squeezed right under it.
                    pt: { xs: '50px', md: '80px' },
                    '@media (min-width:1400px)': {
                      minHeight: 'calc(100vh - 240px)',
                      pt: '130px',
                    },
                    px: '50px',
                    pb: '130px',
                  }}
                >
                  <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
                    {section.icon && (
                      <Box sx={{ mb: 2, animation: 'bounce 3s ease-in-out infinite' }}>
                        {section.icon}
                      </Box>
                    )}
                    
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { 
                          xs: '2.2rem',
                          sm: '4rem',
                          md: '5rem',
                          lg: '6rem'
                        },
                        color: section.textColor,
                        mb: 2,
                        fontWeight: 'bold',
                        marginTop:'100px'
                      }}
                    >
                      {section.title}
                    </Typography>
                    
                    <Typography
                      sx={{
                        color: colors.dark,
                        mb: 4,
                        fontSize: { 
                          xs: '3rem', 
                          sm: '3.3rem', 
                          md: '3.6rem'
                        },
                        lineHeight: 1,
                        px: { xs: 2, md: 0 },
                      }}
                    >
                      {section.subtitle}
                    </Typography>
                    
                  {/* Hero Section Buttons (admin-editable) */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    {(section.buttons || []).map((btn, bi) => {
                      const outlined = btn.variant === 'outlined';
                      return (
                        <Button
                          key={bi}
                          variant={outlined ? 'outlined' : 'contained'}
                          {...linkProps(btn.link || '#')}
                          sx={{
                            borderRadius: '150px',
                            ...(outlined
                              ? { borderColor: colors.gold, color: colors.gold }
                              : { backgroundColor: colors.gold, color: colors.dark }),
                            px: { xs: 2.6, md: 3.3 },
                            py: { xs: 1, md: 1.3 },
                            fontWeight: 'bold',
                            fontSize: { xs: '1rem', md: '1.08rem' },
                            '&:hover': outlined
                              ? { backgroundColor: colors.gold, color: colors.dark, borderColor: colors.gold, transform: 'translateY(-3px)' }
                              : { backgroundColor: colors.primary, color: 'white', transform: 'translateY(-3px)' },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {btn.text}
                        </Button>
                      );
                    })}
                  </Box>

                  </Box>

                  {/* Animated Arrow for Next Section */}
                  <Box
                    onClick={() => {
                      window.scrollTo({
                        top: window.innerHeight,
                        behavior: 'smooth'
                      });
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: 0,
                      right: 0,
                      mx: 'auto',
                      width: 'fit-content',
                      cursor: 'pointer',
                      zIndex: 10,
                      animation: 'bounce 2s infinite',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ color: colors.gold, fontSize: '0.8rem', opacity: 0.8 }}>
                      اسکرول کنید
                    </Typography>
                    <Box
                      sx={{
                        width: 30,
                        height: 50,
                        border: `2px solid ${colors.gold}`,
                        borderRadius: '25px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 10,
                          backgroundColor: colors.gold,
                          borderRadius: '3px',
                          position: 'absolute',
                          top: 8,
                          animation: 'scrollWheel 1.5s infinite',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                /* For sections WITH carousel - centered pack of text + carousel */
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: { xs: 2, md: 2.5, lg: 3 }, px: { xs: 2 }, pr: { md: '24px', lg: '110px', xl: '180px' }, pl: { md: '24px', lg: '90px', xl: '150px' } }}>
                  {/* Carousel — center */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ImageCarousel images={sectionImages[section.id] || section.carouselImages} />
                  </Box>
                  {/* Frosted-glass text panel. The frost is a REAL blurred pattern layer
                      inside the panel (filter: blur), so it never relies on backdrop-filter. */}
                  <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'start',
                    width: { xs: 290, lg: 320, xl: 340 },
                    maxWidth: '90%',
                    borderRadius: '28px',
                    p: 4,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 18px 50px rgba(12,43,41,0.22), 0 6px 16px rgba(0,0,0,0.10), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -3px 8px rgba(0,0,0,0.05)',
                  }}>
                    {/* frosted pattern: a blurred copy of the site pattern, clipped to the panel */}
                    <Box aria-hidden sx={{
                      position: 'absolute',
                      inset: -40,
                      backgroundImage: 'url("/pattern.webp")',
                      backgroundSize: '360px',
                      filter: 'blur(5px)',
                      opacity: 0.5,
                      zIndex: 0,
                      pointerEvents: 'none',
                    }} />
                    {/* content sits above the frost */}
                    <Box sx={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="h2" sx={{ fontSize: { md: '2.2rem', lg: '2.8rem' }, color: section.textColor, mb: 1.5, fontWeight: 'bold', lineHeight: 1.3 }}>
                      {section.title}
                    </Typography>
                    <Typography sx={{ color: colors.dark, mb: 3, fontSize: '0.95rem', lineHeight: 1.8, opacity: 0.75 }}>
                      {section.subtitle}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                      {(section.buttons || []).map((btn, bi) => {
                        const outlined = btn.variant === 'outlined';
                        return (
                          <Button key={bi} variant={outlined ? 'outlined' : 'contained'} {...linkProps(btn.link || '#')}
                            sx={{ ...(outlined ? { borderColor: colors.gold, color: colors.gold, '&:hover': { bgcolor: colors.gold, color: colors.dark, borderColor: colors.gold, transform: 'translateY(-2px)' } } : { bgcolor: colors.gold, color: colors.dark, '&:hover': { bgcolor: colors.primary, color: 'white', transform: 'translateY(-2px)' } }), px: 4, py: 1.2, borderRadius: '50px', fontWeight: 'bold', transition: 'all 0.3s', boxShadow: outlined ? 'none' : '0 4px 20px rgba(197,165,108,0.35)' }}>
                            {btn.text}
                          </Button>
                        );
                      })}
                    </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Container>
          </Box>
        ))}
      </Box>

      {/* Section Indicator */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          zIndex: 1400,
          opacity: isPastLastSection ? 0 : 1,
          pointerEvents: isPastLastSection ? 'none' : 'auto',
          transition: 'opacity 0.4s ease',
        }}
      >
        {visibleSections.map((section, i) => (
          <Tooltip key={i} title={section.title} placement="top" arrow
            slotProps={{ tooltip: { sx: { bgcolor: 'rgba(12,43,41,0.95)', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '8px', border: '1px solid rgba(197,165,108,0.3)' } }, arrow: { sx: { color: 'rgba(12,43,41,0.95)' } } }}>
          <Box
            onClick={() => {
              window.scrollTo({
                top: i * window.innerHeight,
                behavior: 'smooth'
              });
            }}
            sx={{
              width: i === activeSection ? 30 : 12,
              height: 12,
              borderRadius: '6px',
              background: i === activeSection ? colors.gold : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: colors.gold,
                width: 20,
              },
            }}
          />
          </Tooltip>
        ))}
      </Box>

      <style jsx global>{`
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        html::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        
        html::-webkit-scrollbar-thumb {
          background: ${colors.gold};
          border-radius: 4px;
        }
        
        html::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        @keyframes slideOutToLeft {
          0% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) translateX(-100px);
          }
        }
      `}</style>
    </Box>
    </>
  );
}