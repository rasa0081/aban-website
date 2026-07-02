'use client';

import { Box, IconButton } from '@mui/material';
import { linkProps } from '../../lib/linkProps';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { colors } from '../../theme/theme';

export default function BannerSlider() {
  const pathname = usePathname();
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/banners', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBanners(data.filter(b => b.active));
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const goTo = useCallback((idx) => {
    if (animating || banners.length === 0) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 400);
  }, [animating, banners.length]);

  const goNext = useCallback(() => goTo(current === banners.length - 1 ? 0 : current + 1), [current, banners.length, goTo]);
  const goPrev = useCallback(() => goTo(current === 0 ? banners.length - 1 : current - 1), [current, banners.length, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [banners.length, goNext]);

  if (pathname !== '/' || !loaded || banners.length === 0) return null;

  const banner = banners[current];

  const BannerContent = (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', direction: 'rtl' }}>
      {/* Slide */}
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 90, md: 110 },
          bgcolor: banner.bgColor || colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'background-color 0.4s ease',
          backgroundImage: banner.image ? `url(${banner.image})` : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          overflow: 'hidden',
          cursor: banner.link ? 'pointer' : 'default',
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -20, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Prev / Next arrows */}
        {banners.length > 1 && (
          <>
            <IconButton onClick={(e) => { e.stopPropagation(); goPrev(); }} size="small" sx={{ position: 'absolute', right: { xs: 40, md: 60 }, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }, zIndex: 2 }}>
              <ChevronRightIcon />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); goNext(); }} size="small" sx={{ position: 'absolute', left: { xs: 40, md: 60 }, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }, zIndex: 2 }}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Dot indicators */}
      {banners.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, py: 1, bgcolor: banner.bgColor || colors.primary, opacity: 0.9 }}>
          {banners.map((_, idx) => (
            <Box key={idx} onClick={() => goTo(idx)}
              sx={{ width: idx === current ? 20 : 6, height: 6, borderRadius: '3px', bgcolor: idx === current ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </Box>
      )}
    </Box>
  );

  if (banner.link) {
    return (
      <a {...linkProps(banner.link)} style={{ textDecoration: 'none', display: 'block' }}>
        {BannerContent}
      </a>
    );
  }

  return BannerContent;
}