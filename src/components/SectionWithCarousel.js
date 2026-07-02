'use client';

import { Box, Typography, Button } from '@mui/material';
import { linkProps } from '../lib/linkProps';
import { colors } from '../theme/theme';
import ImageCarousel from './ImageCarousel';

export default function SectionWithCarousel({ title, subtitle, buttonText, buttonLink, buttonAction, icon, carouselImages, textColor = colors.primary }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: 3 }}>

      {/* Text block */}
      <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
        {icon && (
          <Box sx={{ mb: 2, animation: 'bounce 3s ease-in-out infinite', display: 'flex', justifyContent: 'center' }}>
            {icon}
          </Box>
        )}
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' }, color: textColor, mb: 1.5, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography sx={{ color: colors.dark, mb: 3, fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8, opacity: 0.8 }}>
          {subtitle}
        </Typography>
        <Button
          variant="contained"
          {...linkProps(buttonLink)}
          onClick={buttonAction === 'next' ? () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }) : undefined}
          sx={{
            bgcolor: colors.gold,
            color: colors.dark,
            px: 4,
            py: 1.2,
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            '&:hover': { bgcolor: colors.primary, color: 'white', transform: 'translateY(-2px)' },
            transition: 'all 0.3s',
            boxShadow: `0 4px 20px rgba(197,165,108,0.35)`,
          }}
        >
          {buttonText}
        </Button>
      </Box>

      {/* Carousel */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ImageCarousel images={carouselImages} />
      </Box>

    </Box>
  );
}