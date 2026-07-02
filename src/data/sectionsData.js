// src/data/sectionsData.js
import ServicesIcon from '@mui/icons-material/Build';
import PortfolioIcon from '@mui/icons-material/PhotoLibrary';
import ContactIcon from '@mui/icons-material/ContactMail';
import AboutIcon from '@mui/icons-material/Info';
import { colors } from '../theme/theme';

export const sectionsData = [
  {
    id: 'hero',
    title: 'آژانس تجارت الکترونیک آبان',
    subtitle: 'داستان، چهره، اثر',
    buttonText: 'بخش بعدی',
    buttonAction: 'next',
    buttonLink: null,
      heroButtons: [
    { text: 'درباره آبان', link: '/about', variant: 'contained' },
    { text: 'تماس با ما', link: '/contact', variant: 'outlined' }
  ],
    icon: null,
    backgroundColor: colors.background,
    textColor: colors.primary,
    hasPattern: true,
    carouselImages: null,
  },
  {
    id: 'services',
    title: 'خدمات ما',
    subtitle: 'طراحی وبسایت، اپلیکیشن موبایل، سئو و بهینه‌سازی',
    buttonText: 'مشاهده خدمات',
    buttonLink: '/services',
    icon: <ServicesIcon sx={{ fontSize: 60, color: colors.gold }} />,
    backgroundColor: colors.background,
    textColor: colors.primary,
    hasPattern: true,
    carouselImages: [],
  },
  {
    id: 'portfolio',
    title: 'نمونه کارها',
    subtitle: 'مشاهده پروژه‌های اخیر ما در زمینه طراحی وبسایت',
    buttonText: 'مشاهده نمونه کارها',
    buttonLink: '/portfolio',
    icon: <PortfolioIcon sx={{ fontSize: 60, color: colors.gold }} />,
    backgroundColor: colors.background,
    textColor: colors.primary,
    hasPattern: true,
    carouselImages: [],
  },
  {
    id: 'about',
    title: 'درباره آبان',
    subtitle: 'با تیم حرفه‌ای ما آشنا شوید',
    buttonText: 'درباره ما',
    buttonLink: '/about',
    icon: <AboutIcon sx={{ fontSize: 60, color: colors.gold }} />,
    backgroundColor: colors.background,
    textColor: colors.primary,
    hasPattern: true,
    carouselImages: [],
  },
  {
    id: 'contact',
    title: 'تماس با ما',
    subtitle: 'برای شروع همکاری با ما در تماس باشید',
    buttonText: 'ارسال پیام',
    buttonLink: '/contact',
    icon: <ContactIcon sx={{ fontSize: 60, color: colors.gold }} />,
    backgroundColor: colors.background,
    textColor: colors.primary,
    hasPattern: true,
    isLast: true,
    carouselImages: [],
  },
];

// ── Visual defaults resolved by sectionKey (NOT stored in DB) ─────────────────
// Icons and colors are intentionally kept in code. The DB only stores editable
// text/links/order/visibility. New custom sections fall back to sensible defaults.
export const sectionIcons = {
  services: <ServicesIcon sx={{ fontSize: 60, color: colors.gold }} />,
  portfolio: <PortfolioIcon sx={{ fontSize: 60, color: colors.gold }} />,
  about: <AboutIcon sx={{ fontSize: 60, color: colors.gold }} />,
  contact: <ContactIcon sx={{ fontSize: 60, color: colors.gold }} />,
};

// Returns the visual defaults (icon/colors/pattern/base carousel) for a key.
export const getSectionDefaults = (key) => {
  const base = sectionsData.find(s => s.id === key);
  return {
    icon: sectionIcons[key] || null,
    backgroundColor: base?.backgroundColor || colors.background,
    textColor: base?.textColor || colors.primary,
    hasPattern: base?.hasPattern !== undefined ? base.hasPattern : true,
    carouselImages: base?.carouselImages ?? [],
  };
};

// Helper function to get section by id
export const getSectionById = (id) => {
  return sectionsData.find(section => section.id === id);
};

// Helper function to get all carousel images from a section
export const getCarouselImagesBySectionId = (id) => {
  const section = getSectionById(id);
  return section?.carouselImages || [];
};