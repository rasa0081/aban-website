// src/components/AnimatedButton.js
'use client';

import { Button, CircularProgress } from '@mui/material';
import { linkProps } from '../lib/linkProps';
import { styled } from '@mui/material/styles';
import { colors } from '../theme/theme';
import { useState, useEffect } from 'react';

const StyledButton = styled(Button)(({ theme, loading, variant }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Loading state
  ...(loading && {
    color: 'transparent !important',
    pointerEvents: 'none',
    '& .MuiCircularProgress-root': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),

  // Hover animations
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s ease, height 0.6s ease',
  },

  '&:hover::before': {
    width: '300px',
    height: '300px',
  },

  // Ripple effect on click
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    transition: 'all 0.5s ease',
  },

  '&:active::after': {
    width: '200px',
    height: '200px',
    opacity: 1,
    transition: '0s',
  },

  // Scroll-based animation class
  '&.scroll-visible': {
    animation: 'slideInUp 0.6s ease-out',
  },

  // Shimmer effect for loading
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },

  // Slide in animation
  '@keyframes slideInUp': {
    from: {
      transform: 'translateY(20px)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },

  // Pulse animation for attention
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    '50%': {
      transform: 'scale(1.05)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
  },

  // Bounce animation
  '@keyframes bounce': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-5px)',
    },
  },
}));

export default function AnimatedButton({
  children,
  loading = false,
  variant = 'contained',
  color = 'primary',
  href,
  onClick,
  animation = 'none', // 'pulse', 'bounce', 'shimmer', 'none'
  fullWidth = false,
  size = 'medium',
  sx = {},
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll animations
  useState(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`btn-${props.id}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    if (isVisible) return 'scroll-visible';
    if (animation === 'pulse') return 'pulse-animation';
    if (animation === 'bounce') return 'bounce-animation';
    return '';
  };

  return (
    <StyledButton
      id={`btn-${props.id}`}
      variant={variant}
      {...linkProps(href)}
      onClick={onClick}
      loading={loading}
      fullWidth={fullWidth}
      size={size}
      className={getAnimationClass()}
      sx={{
        backgroundColor: variant === 'contained' 
          ? color === 'gold' ? colors.gold 
          : color === 'primary' ? colors.primary 
          : color 
          : 'transparent',
        color: variant === 'contained' 
          ? color === 'gold' ? colors.dark : 'white'
          : color === 'gold' ? colors.gold 
          : color === 'primary' ? colors.primary 
          : color,
        borderColor: color === 'gold' ? colors.gold 
          : color === 'primary' ? colors.primary 
          : color,
        '&:hover': {
          backgroundColor: variant === 'contained'
            ? color === 'gold' ? colors.primary
            : color === 'primary' ? colors.gold
            : color
            : 'rgba(255,255,255,0.1)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
      {loading && <CircularProgress size={24} sx={{ color: 'inherit' }} />}
    </StyledButton>
  );
}