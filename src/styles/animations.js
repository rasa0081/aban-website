// src/styles/animations.js
export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },

  scaleInBounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },

  // Rotate animations
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.6 },
  },

  // Slide animations
  slideInUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  },

  slideInDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  },

  // Stagger children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  // Hover animations
  hoverScale: {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 },
  },

  hoverLift: {
    whileHover: { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
    transition: { duration: 0.2 },
  },

  hoverGlow: {
    whileHover: { 
      boxShadow: '0 0 15px rgba(197, 165, 108, 0.5)',
    },
    transition: { duration: 0.2 },
  },

  // Loading animations
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },

  pulse: {
    animate: { 
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: { duration: 1.5, repeat: Infinity },
  },

  shimmer: {
    animate: {
      backgroundPosition: ['-200% 0', '200% 0'],
    },
    transition: { duration: 1.5, repeat: Infinity },
  },

  bounce: {
    animate: {
      y: [0, -10, 0],
    },
    transition: { duration: 0.6, repeat: Infinity },
  },
};

// CSS Keyframes for global animations
export const globalKeyframes = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;