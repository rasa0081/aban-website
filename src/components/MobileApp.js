'use client';

/**
 * MobileApp — Complete mobile experience overlay
 * Shows on xs/sm screens, replaces the desktop scroll-snap layout
 * Concept: Luxury Dark Glass — premium, minimal, client-friendly
 */

import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { linkProps } from '../lib/linkProps';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { colors } from '../theme/theme';
import { useHomeContent } from '../hooks/useHomeContent';
import { sectionImagesApi } from '../lib/api';
import ImageCarousel from './ImageCarousel';

// Icons
const IconAbout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconContact = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M2 7l10 6.5L22 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconServices = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const IconPortfolio = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 5V4a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconArticles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const navLinks = [
  { name: 'خدمات', path: '/services', icon: <IconServices /> },
  { name: 'نمونه کارها', path: '/portfolio', icon: <IconPortfolio /> },
  { name: 'خواندنی‌ها', path: '/articles', icon: <IconArticles /> },
  { name: 'تماس با ما', path: '/contact', icon: <IconContact /> },
  { name: 'درباره آبان', path: '/about', icon: <IconAbout /> },
];

// ── Floating Mobile Navbar ─────────────────────────────────────────────────────
export function MobileNavbar({ scrolled }) {
  return (
    <Box sx={{
      display: { xs: 'flex', md: 'none' },
      position: 'fixed',
      top: scrolled ? 12 : -80,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1400,
      transition: 'top 0.4s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: scrolled ? 'auto' : 'none',
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 0.3,
        bgcolor: 'rgba(12,43,41,0.92)',
        backdropFilter: 'blur(24px)',
        borderRadius: '50px',
        border: '1px solid rgba(197,165,108,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        px: 1.5, py: 0.8,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 0.5, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(197,165,108,0.2)' } }}>
            <Box component="img" src="/Logo.png" alt="آبان" sx={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(10)' }} />
          </Box>
        </Link>
        <Box sx={{ width: 1, height: 20, bgcolor: 'rgba(197,165,108,0.2)', mx: 0.5 }} />
        {navLinks.map((item) => (
          <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
            <Box sx={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', transition: 'all 0.2s', '&:hover': { color: colors.gold, bgcolor: 'rgba(197,165,108,0.15)', transform: 'translateY(-2px)' } }}>
              {item.icon}
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

// ── Mobile Hero Section ────────────────────────────────────────────────────────
function MobileHero({ hero }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  const title = hero?.title || 'آژانس تجارت الکترونیک آبان';
  const subtitle = hero?.subtitle || 'داستان، چهره، اثر';
  const heroButtons = (hero?.buttons && hero.buttons.length > 0)
    ? hero.buttons
    : [
        { text: 'مشاهده خدمات', link: '/services', variant: 'contained' },
        { text: 'تماس با ما', link: '/contact', variant: 'outlined' },
      ];

  return (
    <Box sx={{
      height: '100svh',
      minHeight: 500,
      background: `linear-gradient(160deg, ${colors.primary} 0%, #061410 60%, #0a1a18 100%)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      position: 'relative', overflow: 'hidden', px: { xs: 3, sm: 6 }, pt: '60px', pb: 6,
    }}>
      {/* Background decoration */}
      <Box sx={{ position: 'absolute', top: '10%', right: '-20%', width: '70vw', height: '70vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,165,108,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '5%', left: '-25%', width: '80vw', height: '80vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,165,108,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'url("/pattern.webp")', backgroundSize: '800px', opacity: 0.04, pointerEvents: 'none' }} />

      {/* Logo */}
      <Box sx={{ mb: 4, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-20px)', transition: 'all 0.7s ease 0.1s' }}>
        <Box component="img" src="/Logo.png" alt="آبان" sx={{ width: 80, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(197,165,108,0.4))' }} />
      </Box>

      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: 2, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.2s' }}>
        <Typography sx={{ color: 'white', fontWeight: '800', fontSize: { xs: '2.2rem', sm: '2.8rem' }, lineHeight: 1.3, mb: 1.5 }}>
          {title}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: { xs: '1.1rem', sm: '1.25rem' }, lineHeight: 1.5 }}>
          {subtitle}
        </Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ width: 40, height: 2, bgcolor: colors.gold, borderRadius: 1, my: 3, opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.35s' }} />

      {/* Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', maxWidth: { xs: 280, sm: 360 }, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.45s' }}>
        {heroButtons.map((btn, bi) => (
          btn.variant === 'outlined' ? (
            <Button key={bi} component={Link} {...linkProps(btn.link || '#')} variant="outlined" fullWidth
              sx={{ borderColor: 'rgba(197,165,108,0.4)', color: 'rgba(255,255,255,0.85)', borderRadius: '50px', py: 1.4, fontWeight: '500', fontSize: '0.9rem', '&:hover': { borderColor: colors.gold, bgcolor: 'rgba(197,165,108,0.1)' } }}>
              {btn.text}
            </Button>
          ) : (
            <Button key={bi} component={Link} {...linkProps(btn.link || '#')} variant="contained" fullWidth
              sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', py: 1.5, fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 24px rgba(197,165,108,0.4)', '&:hover': { bgcolor: '#d4b882' } }}>
              {btn.text}
            </Button>
          )
        ))}
      </Box>

      {/* Scroll hint */}
      <Box sx={{ position: 'absolute', bottom: 28, left: 0, right: 0, mx: 'auto', width: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.4, animation: 'floatDown 2s ease-in-out infinite' }}>
        <Typography sx={{ color: 'white', fontSize: '0.65rem', letterSpacing: '0.1em', textWrap:'nowrap' }}>اسکرول کنید</Typography>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
      </Box>
    </Box>
  );
}

// ── Mobile Section Card ────────────────────────────────────────────────────────
function MobileSectionCard({ section, index, dbImages = [] }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isLight = section.backgroundColor === '#f5f2ee' || section.backgroundColor === colors.background;

  return (
    <Box ref={ref} sx={{
      height: '100svh',
      minHeight: 500,
      display: 'flex', flexDirection: 'column',
      background: section.backgroundColor, position: 'relative', overflow: 'hidden',
      pt: '64px', pb: 3,
    }}>
      {section.hasPattern && (
        <Box sx={{ position: 'absolute', inset: 0, background: 'url("/pattern.webp")', backgroundSize: '600px', opacity: 0.04, pointerEvents: 'none' }} />
      )}

      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        px: { xs: 2.5, sm: 5 }, position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <Box sx={{
          borderRadius: '28px',
          p: { xs: 3, sm: 4 },
          maxWidth: { sm: '600px' },
          background: isLight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.3)',
        }}>
          {/* Title */}
          <Typography sx={{
            fontSize: { xs: '2rem', sm: '2.6rem' }, fontWeight: '800', lineHeight: 1.15, mb: 1.5,
            color: section.textColor || colors.primary,
          }}>
            {section.title}
          </Typography>

          {/* Subtitle */}
          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: isLight ? colors.dark : 'rgba(255,255,255,0.7)', lineHeight: 1.8, mb: 3, opacity: 0.8 }}>
            {section.subtitle}
          </Typography>

          {/* Buttons (admin-editable) */}
          {(section.buttons && section.buttons.length > 0) && (
            <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
              {section.buttons.map((btn, bi) => (
                <Button key={bi} component={Link} {...linkProps(btn.link || '#')} variant={btn.variant === 'outlined' ? 'outlined' : 'contained'}
                  sx={btn.variant === 'outlined'
                    ? { borderColor: colors.gold, color: colors.gold, borderRadius: '50px', px: 3, py: 1.1, fontWeight: 'bold', fontSize: '0.85rem', '&:hover': { bgcolor: colors.gold, color: colors.dark } }
                    : { bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', px: 3.5, py: 1.2, fontWeight: 'bold', fontSize: '0.88rem', boxShadow: '0 4px 20px rgba(197,165,108,0.35)', '&:hover': { bgcolor: '#d4b882' } }}>
                  {btn.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Images */}
          {(dbImages.length > 0 || (section.carouselImages && section.carouselImages.length > 0)) && (
            <Box sx={{ mt: 3 }}>
              <MobileSectionImages
                images={dbImages.length > 0 ? dbImages : section.carouselImages}
                isLight={isLight}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ── Mobile Section Images ──────────────────────────────────────────────────────
function MobileSectionImages({ images, isLight }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setCurrent(c => (c + 1) % images.length); setAnimating(false); }, 300);
    }, 3500);
    return () => clearInterval(t);
  }, [images?.length]);

  if (!images || images.length === 0) return null;
  const img = images[current];

  return (
    <Box>
      {/* Pill + info card side by side — RTL: info on right, pill on left */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, direction: 'rtl' }}>

        {/* Info card — right side in RTL */}
        <Box sx={{ width: '38%', flexShrink: 0, bgcolor: 'white', borderRadius: '14px', p: 1.2, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(197,165,108,0.12)' }}>
          {img?.category && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, bgcolor: 'rgba(197,165,108,0.1)', px: 0.8, py: 0.2, borderRadius: '20px', mb: 0.6 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: colors.gold }} />
              <Typography sx={{ fontSize: '0.55rem', color: colors.gold, fontWeight: 'bold' }}>{img.category}</Typography>
            </Box>
          )}
          <Typography sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: colors.primary, mb: 0.3, lineHeight: 1.3 }}>
            {img?.title}
          </Typography>
          {img?.description && (
            <Typography sx={{ fontSize: '0.62rem', color: colors.dark, opacity: 0.55, lineHeight: 1.5, mb: 0.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {img.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {img?.date && (
              <Box sx={{ flex: 1, bgcolor: 'rgba(197,165,108,0.07)', borderRadius: '8px', py: 0.6, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.5rem', color: colors.gold }}>سال</Typography>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 'bold', color: colors.primary }}>{img.date}</Typography>
              </Box>
            )}
            {img?.rating && (
              <Box sx={{ flex: 1, bgcolor: 'rgba(197,165,108,0.07)', borderRadius: '8px', py: 0.6, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.5rem', color: colors.gold }}>امتیاز</Typography>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 'bold', color: colors.primary }}>{img.rating}</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Pill image — left side in RTL, arrows overlaid */}
        <Box sx={{ position: 'relative', flex: 1, height: 240, borderRadius: '70px', overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.22)', border: '2px solid rgba(255,255,255,0.15)' }}>
          <Box component="img" src={img?.src} alt={img?.title}
            sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec', opacity: animating ? 0 : 1, transform: animating ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.3s ease' }} />
          {/* Arrows on pill — RTL: next on right, prev on left */}
          {images.length > 1 && (
            <>
              <Box onClick={() => setCurrent(c => (c + 1) % images.length)}
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', '&:active': { transform: 'translateY(-50%) scale(0.9)' } }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </Box>
              <Box onClick={() => setCurrent(c => c === 0 ? images.length - 1 : c - 1)}
                sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', '&:active': { transform: 'translateY(-50%) scale(0.9)' } }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </Box>
            </>
          )}
        </Box>

      </Box>

      {/* Dots */}
      {images.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, mt: 1.5 }}>
          {images.map((_, i) => (
            <Box key={i} onClick={() => setCurrent(i)}
              sx={{ width: i === current ? 20 : 6, height: 6, borderRadius: '3px', bgcolor: i === current ? colors.gold : isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s', cursor: 'pointer' }} />
          ))}
        </Box>
      )}
    </Box>
  );
}

// ── Main Mobile Home Page ──────────────────────────────────────────────────────
export function MobileHomePage() {
  const [sectionImages, setSectionImages] = useState({});
  const { hero, cards } = useHomeContent();
  const visibleSections = cards.filter(s => s.visible);

  useEffect(() => {
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

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <MobileHero hero={hero} />
      {visibleSections.map((section, i) => (
        <MobileSectionCard key={section.id} section={section} index={i + 1} dbImages={sectionImages[section.id] || []} />
      ))}
      <style jsx global>{`
        @keyframes floatDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </Box>
  );
}

// ── Mobile Page Wrapper (for inner pages) ─────────────────────────────────────
export function MobilePageLayout({ title, subtitle, icon, children, bgDark = false }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, bgcolor: colors.background }}>
      {/* Hero header */}
      <Box sx={{
        background: bgDark
          ? `linear-gradient(160deg, ${colors.primary} 0%, #061410 100%)`
          : `linear-gradient(160deg, ${colors.primary} 0%, #0a1f1e 100%)`,
        pt: { xs: '76px', sm: '90px' }, pb: { xs: 4, sm: 5 }, px: { xs: 3, sm: 5 }, position: 'relative', overflow: 'hidden',
        mb: 0,
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(197,165,108,0.07)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <Box sx={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', maxWidth: { sm: '600px' } }}>
          {icon && <Box sx={{ color: colors.gold, mb: 1.5 }}>{icon}</Box>}
          <Typography sx={{ fontWeight: '800', fontSize: { xs: '2.2rem', sm: '2.8rem' }, color: 'white', lineHeight: 1.2, mb: 1 }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{subtitle}</Typography>}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 }, maxWidth: { sm: '720px' }, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}

export default MobileNavbar;