import StarIcon from '@mui/icons-material/Star';

// Article type configuration for easier admin panel integration
export const ARTICLE_TYPES = {
  MAIN: 'main',
  NORMAL: 'normal'
};

// Article configuration (can be moved to admin panel settings)
export const articleConfig = {
  [ARTICLE_TYPES.MAIN]: {
    name: 'مقاله اصلی',
    icon: StarIcon,
    gridSize: {
      xs: 12,
      sm: 12,
      md: 8,
      lg: 8
    },
    imageHeight: 300,
    titleFontSize: '1.5rem',
    introLines: 4,
    featured: true
  },
  [ARTICLE_TYPES.NORMAL]: {
    name: 'مقاله عادی',
    icon: null,
    gridSize: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4
    },
    imageHeight: 200,
    titleFontSize: '1rem',
    introLines: 3,
    featured: false
  }
};