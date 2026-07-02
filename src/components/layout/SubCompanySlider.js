'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { linkProps } from '../../lib/linkProps';
import { useState, useEffect, useRef } from 'react';
import { colors } from '../../theme/theme';

export default function SubCompanySlider() {
  const [companies, setCompanies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    fetch('/api/subcompanies', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCompanies(data.filter(c => c.visible));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || companies.length === 0) return null;

  // Need at least enough items to fill the slider smoothly
  // Duplicate only if needed for smooth infinite scroll
  const minItems = 6;
  let items = [...companies];
  while (items.length < minItems) {
    items = [...items, ...companies];
  }
  // Triple for smooth infinite loop
  items = [...items, ...items, ...items];

  return (
    <Box sx={{ mb: 0, maxWidth: 500, mx: 'auto', px: 2 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', mb: 1.5, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
        زیرمجموعه‌ها
      </Typography>

      <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0, bottom: 0,
          width: 40,
          zIndex: 2,
          pointerEvents: 'none',
        },
        '&::before': { left: 0, background: `linear-gradient(to right, #1a1e24, transparent)` },
        '&::after': { right: 0, background: `linear-gradient(to left, #1a1e24, transparent)` },
      }}>
        <Box
          ref={trackRef}
          sx={{
            display: 'flex',
            gap: 2,
            width: 'max-content',
            animation: `scrollLogos ${companies.length * 3}s linear infinite`,
            '&:hover': { animationPlayState: 'paused' },
            '@keyframes scrollLogos': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: `translateX(-${100 / 3}%)` },
            },
          }}
        >
          {items.map((company, idx) => (
            <Tooltip key={idx} title={company.name} arrow placement="top">
              <Box
                component="a"
                {...linkProps(company.url)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 50,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  '&:hover': {
                    bgcolor: 'rgba(197,165,108,0.15)',
                    borderColor: `rgba(197,165,108,0.4)`,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 6px 20px rgba(197,165,108,0.2)`,
                  },
                }}
              >
                {company.logo ? (
                  <Box
                    component="img"
                    src={company.logo}
                    alt={company.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 1, opacity: 0.85, transition: 'opacity 0.3s', '&:hover': { opacity: 1 } }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <Typography sx={{ display: company.logo ? 'none' : 'flex', color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center', px: 0.5, lineHeight: 1.2 }}>
                  {company.name}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Box>
  );
}