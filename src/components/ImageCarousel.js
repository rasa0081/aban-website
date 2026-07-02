'use client';

import { Box, IconButton, Typography, SwipeableDrawer, Fab } from '@mui/material';
import { useState, useEffect } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { colors } from '../theme/theme';

export default function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setAnimating(false), 400);
  };
  const goToPrev = () => goTo(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  const goToNext = () => goTo(currentIndex === images.length - 1 ? 0 : currentIndex + 1);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  const cur = images[currentIndex];
  if (!cur) return null;

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
          <Box sx={{ position: 'relative', width: '100%', height: 240, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
            <Box component="img" src={cur.src} alt={cur.alt || cur.title} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec', transition: 'opacity 0.4s', opacity: animating ? 0 : 1 }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 2 }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{cur.title}</Typography>
              <Typography sx={{ color: colors.gold, fontSize: '0.75rem' }}>{cur.description}</Typography>
            </Box>
            <Fab size="small" onClick={() => setDrawerOpen(true)} sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.45)', color: 'white', width: 34, height: 34, '&:hover': { bgcolor: colors.gold } }}>
              <InfoIcon sx={{ fontSize: 16 }} />
            </Fab>
            <IconButton onClick={goToPrev} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.35)', color: 'white', width: 32, height: 32, '&:hover': { bgcolor: colors.gold } }}><ChevronLeftIcon /></IconButton>
            <IconButton onClick={goToNext} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.35)', color: 'white', width: 32, height: 32, '&:hover': { bgcolor: colors.gold } }}><ChevronRightIcon /></IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5 }}>
            {images.map((_, idx) => (
              <Box key={idx} onClick={() => goTo(idx)} sx={{ width: idx === currentIndex ? 20 : 6, height: 6, borderRadius: '3px', bgcolor: idx === currentIndex ? colors.gold : 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </Box>
        </Box>

        <SwipeableDrawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)} onOpen={() => setDrawerOpen(true)}
          PaperProps={{ sx: { borderTopLeftRadius: '30px', borderTopRightRadius: '30px', maxHeight: '65vh' } }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}><Box sx={{ width: 40, height: 4, bgcolor: '#ccc', borderRadius: 2 }} /></Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ position: 'absolute', right: 10, top: 10 }}><CloseIcon /></IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 1.5 }}>{cur.title}</Typography>
            <Typography sx={{ color: colors.dark, lineHeight: 1.7, mb: 2, fontSize: '0.9rem' }}>{cur.details || cur.description}</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {[['دسته‌بندی', cur.category], ['سال', cur.date], ['امتیاز', cur.rating]].filter(([, v]) => v).map(([label, value]) => (
                <Box key={label} sx={{ bgcolor: 'rgba(197,165,108,0.1)', px: 2, py: 1, borderRadius: '20px' }}>
                  <Typography sx={{ fontSize: '0.65rem', color: colors.gold }}>{label}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </SwipeableDrawer>
      </>
    );
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', mx: 'auto' }}>

      {/* Info card — left (frosted glass, same treatment as the section text panel) */}
      <Box sx={{
        position: 'relative',
        overflow: 'hidden',
        width: { xs: 175, xl: 200 },
        flexShrink: 0,
        p: 3,
        borderRadius: '28px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 18px 50px rgba(12,43,41,0.20), 0 6px 16px rgba(0,0,0,0.10), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -3px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.4s ease',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(8px)' : 'translateY(0)',
      }}>
        {/* frosted pattern layer (real blur, no backdrop-filter) */}
        <Box aria-hidden sx={{ position: 'absolute', inset: -40, backgroundImage: 'url("/pattern.png")', backgroundSize: '300px', filter: 'blur(5px)', opacity: 0.5, zIndex: 0, pointerEvents: 'none' }} />
        {/* content above the frost */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Category badge */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: `rgba(197,165,108,0.12)`, borderRadius: '20px', px: 1.5, py: 0.4, mb: 2 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.gold, mr: 0.8 }} />
          <Typography sx={{ fontSize: '0.7rem', color: colors.gold, fontWeight: 'bold' }}>{cur.category}</Typography>
        </Box>

        <Typography sx={{ fontWeight: 'bold', color: colors.primary, fontSize: '1.1rem', mb: 1, lineHeight: 1.4 }}>{cur.title}</Typography>
        <Typography sx={{ color: colors.dark, fontSize: '0.82rem', lineHeight: 1.7, opacity: 0.75, mb: 2 }}>{cur.details || cur.description}</Typography>

        {/* Stats row */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {cur.date && (
            <Box sx={{ flex: 1, textAlign: 'center', bgcolor: 'rgba(197,165,108,0.08)', borderRadius: '14px', py: 1 }}>
              <Typography sx={{ fontSize: '0.62rem', color: colors.gold, mb: 0.2 }}>سال</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: colors.primary }}>{cur.date}</Typography>
            </Box>
          )}
          {cur.rating && (
            <Box sx={{ flex: 1, textAlign: 'center', bgcolor: 'rgba(197,165,108,0.08)', borderRadius: '14px', py: 1 }}>
              <Typography sx={{ fontSize: '0.62rem', color: colors.gold, mb: 0.2 }}>امتیاز</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: colors.primary }}>{cur.rating}</Typography>
            </Box>
          )}
        </Box>
        </Box>
      </Box>

      {/* Pill carousel — center with side arrows */}
      <Box sx={{ position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Prev arrow — left of pill */}
        <IconButton onClick={goToPrev} sx={{ bgcolor: 'white', color: colors.primary, width: 40, height: 40, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: `1px solid rgba(197,165,108,0.25)`, '&:hover': { bgcolor: colors.gold, color: 'white', transform: 'scale(1.1)' }, transition: 'all 0.25s', flexShrink: 0 }}>
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ position: 'relative' }}>
          {/* Glow */}
          <Box sx={{ position: 'absolute', inset: -16, borderRadius: '200px', background: `radial-gradient(ellipse, rgba(197,165,108,0.15) 0%, transparent 70%)`, pointerEvents: 'none' }} />

          <Box sx={{
            position: 'relative',
            width: { xs: 215, xl: 250 },
            height: { xs: 350, xl: 400 },
            borderRadius: '200px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.4)',
            border: '2px solid rgba(255,255,255,0.35)',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': { transform: 'translateY(-6px)' },
          }}>
            <Box component="img" src={cur.src} alt={cur.alt || cur.title}
              sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec', transition: 'opacity 0.4s, transform 0.6s', opacity: animating ? 0 : 1, transform: animating ? 'scale(1.05)' : 'scale(1)' }} />
          </Box>

          {/* Dot indicators — below pill */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            {images.map((_, idx) => (
              <Box key={idx} onClick={() => goTo(idx)} sx={{ width: idx === currentIndex ? 24 : 7, height: 7, borderRadius: '4px', bgcolor: idx === currentIndex ? colors.gold : 'rgba(197,165,108,0.3)', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { bgcolor: colors.gold } }} />
            ))}
          </Box>
        </Box>

        {/* Next arrow — right of pill */}
        <IconButton onClick={goToNext} sx={{ bgcolor: 'white', color: colors.primary, width: 40, height: 40, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: `1px solid rgba(197,165,108,0.25)`, '&:hover': { bgcolor: colors.gold, color: 'white', transform: 'scale(1.1)' }, transition: 'all 0.25s', flexShrink: 0 }}>
          <ChevronLeftIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Thumbnail stack — right */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>
        {images.map((img, idx) => (
          <Box key={idx} onClick={() => goTo(idx)} sx={{
            width: { xs: 50, xl: 58 },
            height: { xs: 50, xl: 58 },
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: idx === currentIndex ? `2.5px solid ${colors.gold}` : '2.5px solid transparent',
            opacity: idx === currentIndex ? 1 : 0.55,
            transition: 'all 0.3s',
            boxShadow: idx === currentIndex ? `0 4px 16px rgba(197,165,108,0.4)` : 'none',
            transform: idx === currentIndex ? 'scale(1.08)' : 'scale(1)',
            '&:hover': { opacity: 1, transform: 'scale(1.08)' },
          }}>
            <Box component="img" src={img.src} alt={img.alt || img.title} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
          </Box>
        ))}
      </Box>

    </Box>
  );
}