'use client';

import {
  Box, Container, Typography, Grid, Paper, Button, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Switch,
  FormControlLabel, Select, MenuItem, FormControl, InputLabel,
  Alert, Snackbar, Tooltip, InputAdornment, Slider,
  ToggleButton, Card,
} from '@mui/material';
import { colors } from '../../theme/theme';
import { useState, useEffect } from 'react';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ImageIcon from '@mui/icons-material/Image';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import CampaignIcon from '@mui/icons-material/Campaign';
import LinkIcon from '@mui/icons-material/Link';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
import CollectionsIcon from '@mui/icons-material/Collections';
import ArrowUpwardIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownwardIcon from '@mui/icons-material/KeyboardArrowDown';
import { articlesApi, portfolioApi, bannersApi, contentApi, subCompaniesApi, categoriesApi, sectionImagesApi, homeSectionsApi } from '../../lib/api';
import RichTextEditor from '../../components/editor/RichTextEditor';
import ImageUploader from '../../components/editor/ImageUploader';
import VideoUploader from '../../components/editor/VideoUploader';

// ─── Session config ────────────────────────────────────────────────────────────
// Credentials are validated server-side via POST /api/auth — never stored here.
const SESSION_KEY = 'aban_admin_session';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms

// Strip HTML tags for plain-text previews (intro is now rich HTML)
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// ─── Initial Data ──────────────────────────────────────────────────────────────
const initialArticles = [
  { id: 1, title: 'راهنمای جامع سئو برای وبسایت‌های فروشگاهی', category: 'seo', date: '۱۴۰۳/۰۲/۱۵', status: 'published', type: 'main', views: 1240, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=200&fit=crop', intro: 'در این مقاله به بررسی کامل تکنیک‌های سئو می‌پردازیم.', content: 'محتوای کامل مقاله...', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false },
  { id: 2, title: 'اصول طراحی رابط کاربری مدرن', category: 'ui-ux', date: '۱۴۰۳/۰۲/۱۰', status: 'published', type: 'normal', views: 890, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop', intro: 'با اصول طراحی رابط کاربری مدرن آشنا شوید.', content: 'محتوای کامل مقاله...', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false },
  { id: 3, title: 'بهترین فریمورک‌های جاوااسکریپت', category: 'frontend', date: '۱۴۰۳/۰۲/۰۵', status: 'draft', type: 'normal', views: 2100, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop', intro: 'مقایسه برترین فریمورک‌های جاوااسکریپت.', content: 'محتوای کامل مقاله...', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false },
  { id: 4, title: 'بهینه‌سازی سرعت سایت با ۱۰ تکنیک', category: 'seo', date: '۱۴۰۳/۰۱/۲۸', status: 'published', type: 'main', views: 3450, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', intro: 'افزایش سرعت بارگذاری سایت.', content: 'محتوای کامل مقاله...', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false },
];
const initialPortfolio = [
  { id: 1, title: 'فروشگاه آنلاین مد', category: 'programming', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=200&fit=crop', tags: ['Next.js', 'MUI'], year: '۱۴۰۳', client: 'برند پوشاک', description: '', duration: '', url: '', features: [], videoUrl: '', videoTitle: '', visible: true },
  { id: 2, title: 'اپلیکیشن مدیریت وظایف', category: 'programming', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop', tags: ['React Native', 'Firebase'], year: '۱۴۰۳', client: 'استارتاپ', description: '', duration: '', url: '', features: [], videoUrl: '', videoTitle: '', visible: true },
  { id: 3, title: 'هویت بصری شرکت ساختمانی', category: 'graphic', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop', tags: ['برندینگ', 'لوگو'], year: '۱۴۰۲', client: 'شرکت آریا', description: '', duration: '', url: '', features: [], videoUrl: '', videoTitle: '', visible: true },
  { id: 4, title: 'کمپین تبلیغاتی دیجیتال', category: 'marketing', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop', tags: ['SEO', 'تولید محتوا'], year: '۱۴۰۲', client: 'آکادمی', description: '', duration: '', url: '', features: [], videoUrl: '', videoTitle: '', visible: false },
];
const initialHomeData = {
  heroTitle: 'آژانس تجارت الکترونیک آبان',
  heroSubtitle: 'داستان، چهره، اثر',
  banners: [{ id: 1, title: 'تخفیف ویژه خدمات طراحی', subtitle: 'تا پایان ماه', active: true, bgColor: colors.primary, image: '' }],
  sections: [
    { id: 'services', title: 'خدمات ما', subtitle: 'طراحی وبسایت، اپلیکیشن موبایل، سئو', buttonText: 'مشاهده خدمات', visible: true },
    { id: 'about', title: 'درباره آبان', subtitle: 'با تیم حرفه‌ای ما آشنا شوید', buttonText: 'درباره ما', visible: true },
    { id: 'contact', title: 'تماس با ما', subtitle: 'برای شروع همکاری با ما در تماس باشید', buttonText: 'ارسال پیام', visible: true },
  ],
  portfolioHeroTitle: 'نمونه کارها',
  portfolioHeroSubtitle: 'مجموعه‌ای از پروژه‌های موفق ما در حوزه‌های مختلف طراحی وب، اپلیکیشن و برندینگ',
  portfolioMobileTitle: 'نمونه کارها',
  portfolioMobileSubtitle: 'پروژه‌های موفق ما در حوزه‌های مختلف دیجیتال',
  portfolioCTATitle: 'پروژه‌ای در ذهن دارید؟',
  portfolioCTASubtitle: 'بیایید با هم ایده شما را به یک محصول دیجیتال عالی تبدیل کنیم',
  articlesHeroTitle: 'آخرین مقالات و مطالب آموزشی در حوزه طراحی، توسعه، سئو و بازاریابی دیجیتال',
  articlesMobileTitle: 'خواندنی‌ها',
  articlesMobileSubtitle: 'آخرین مقالات و آموزش‌های تخصصی دیجیتال مارکتینگ',
  articlesMainSectionLabel: 'مقالات اصلی و ویژه',
  articlesNormalSectionLabel: 'سایر مقالات',
};
const initialAboutData = {
  heroTitle: 'درباره آبان',
  heroSubtitle: 'ما تیمی از متخصصان خلاق و با تجربه هستیم.',
  missionTitle: 'تحول دیجیتال کسب‌وکارها',
  missionText: 'در آبان، ما به دنبال ایجاد تحول دیجیتال در کسب‌وکارها هستیم.',
  missionLabel: 'مأموریت ما',
  whyTitle: 'چرا آبان؟',
  whyItems: ['تیم متخصص و با تجربه', 'رویکرد مشتری‌محور', 'استفاده از آخرین تکنولوژی‌ها', 'پشتیبانی ۲۴/۷', 'تحویل به‌موقع پروژه‌ها'],
  qualityTags: ['خلاقیت', 'نوآوری', 'کیفیت', 'حرفه‌ای‌گری'],
  valuesLabel: 'ارزش‌های ما',
  valuesHeading: 'اصولی که به آنها باور داریم',
  ctaTitle: 'آماده همکاری با ما هستید؟',
  ctaSubtitle: 'بیایید با هم ایده‌های بزرگ را به واقعیت تبدیل کنیم',
  stats: [{ number: '۸+', label: 'سال تجربه' }, { number: '۱۵۰+', label: 'پروژه موفق' }, { number: '۵۰+', label: 'تیم متخصص' }],
  values: [
    { title: 'کیفیت', description: 'ما به کیفیت کار خود افتخار می‌کنیم.' },
    { title: 'نوآوری', description: 'همیشه به دنبال راه‌های جدید و خلاقانه هستیم.' },
    { title: 'اعتماد', description: 'اعتماد مشتریان مهمترین سرمایه ماست.' },
    { title: 'تعهد', description: 'به تعهدات خود پایبند هستیم.' },
  ],
};
const initialContactData = {
  phone1: '۰۲۱-۸۸۵۲۱۲۳۴', phone2: '۰۲۱-۸۸۵۲۴۳۶۵', mobile: '۰۹۱۲۱۲۳۴۵۶۷',
  email1: 'info@abaan.ir', email2: 'support@abaan.ir',
  address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳، طبقه ۴',
  workHours: 'شنبه تا چهارشنبه: ۹ - ۱۸',
  instagram: 'https://www.instagram.com/aban.ec?igsh=MWJqZGsyc3Zya3F1Mw==', linkedin: 'https://www.linkedin.com/in/aban-e-commerce-bb4412415?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  telegram: 'https://t.me/abanagency', whatsapp: 'https://wa.me/message/JSIPIQGW3NESM1',
};
const initialServicesData = {
  heroTitle: 'خدمات ما',
  heroSubtitle: 'راه‌حل‌های جامع دیجیتال برای رشد کسب‌وکار شما. از طراحی وبسایت تا بازاریابی دیجیتال، همه چیز در یکجا.',
  mobileTitle: 'خدمات ما',
  mobileSubtitle: 'راه‌حل‌های دیجیتال جامع برای کسب‌وکار شما',
  ctaTitle: 'آماده شروع پروژه شما هستیم',
  ctaSubtitle: 'برای مشاوره رایگان و دریافت قیمت با ما تماس بگیرید',
  mobileCTATitle: 'مشاوره رایگان',
  mobileCTASubtitle: 'همین امروز با ما در تماس باشید',
  ctaLink: '/contact',
  ctaLink2: '/portfolio',
  items: [
    { id: 1, title: 'طراحی و توسعه وبسایت', description: 'طراحی وبسایت‌های حرفه‌ای، مدرن و واکنش‌گرا', image: '', link: '', visible: true, subServices: [
      { name: 'وبسایت شرکتی', description: 'طراحی وبسایت حرفه‌ای برای معرفی شرکت', image: '', link: '', features: ['طراحی اختصاصی', 'مدیریت محتوا', 'سئو داخلی'], visible: true },
      { name: 'فروشگاه اینترنتی', description: 'فروشگاه آنلاین با سیستم پرداخت پیشرفته', image: '', link: '', features: ['سیستم پرداخت', 'مدیریت محصولات', 'گزارشات فروش'], visible: true },
    ]},
    { id: 2, title: 'توسعه اپلیکیشن موبایل', description: 'توسعه اپلیکیشن‌های موبایل اندروید و iOS', image: '', link: '', visible: true, subServices: [
      { name: 'اپلیکیشن اندروید', description: 'توسعه اپلیکیشن اندروید', image: '', link: '', features: ['UI/UX مدرن', 'عملکرد بالا'], visible: true },
      { name: 'اپلیکیشن iOS', description: 'توسعه اپلیکیشن iOS با Swift', image: '', link: '', features: ['طراحی اپل', 'امنیت بالا'], visible: true },
    ]},
    { id: 3, title: 'سئو و بازاریابی دیجیتال', description: 'افزایش رتبه سایت در گوگل', image: '', link: '', visible: true, subServices: [
      { name: 'سئو داخلی', description: 'بهینه‌سازی محتوا و ساختار سایت', image: '', link: '', features: ['بهینه‌سازی محتوا', 'سرعت سایت'], visible: true },
      { name: 'بازاریابی محتوا', description: 'تولید محتوای ارزشمند', image: '', link: '', features: ['مقالات حرفه‌ای', 'اینفوگرافیک'], visible: true },
    ]},
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub, onClick }) {
  return (
    <Paper elevation={0} onClick={onClick} sx={{ p: 2.5, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', position: 'relative', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', transition: 'all 0.25s', '&:hover': onClick ? { transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' } : {} }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', bgcolor: color }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 28, flexShrink: 0 }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '1.7rem', fontWeight: 'bold', color: colors.primary, lineHeight: 1 }}>{value}</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: colors.dark, opacity: 0.65, mt: 0.4 }}>{label}</Typography>
          {sub && <Typography sx={{ fontSize: '0.68rem', color, mt: 0.3, fontWeight: 'bold' }}>{sub}</Typography>}
        </Box>
      </Box>
    </Paper>
  );
}

function TextStyleEditor({ value, onChange, label, multiline = false, rows = 3, fontSize, fontColor, isBold, isItalic, onStyleChange }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '0.78rem', color: colors.primary, fontWeight: 'bold', mb: 0.8 }}>{label}</Typography>
      {onStyleChange && (
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <ToggleButton value="bold" selected={isBold} onChange={() => onStyleChange('isBold', !isBold)} size="small" sx={{ border: '1px solid rgba(197,165,108,0.3)', borderRadius: '8px !important', minWidth: 36 }}>
            <FormatBoldIcon sx={{ fontSize: 16 }} />
          </ToggleButton>
          <ToggleButton value="italic" selected={isItalic} onChange={() => onStyleChange('isItalic', !isItalic)} size="small" sx={{ border: '1px solid rgba(197,165,108,0.3)', borderRadius: '8px !important', minWidth: 36 }}>
            <FormatItalicIcon sx={{ fontSize: 16 }} />
          </ToggleButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(197,165,108,0.08)', px: 1.5, py: 0.5, borderRadius: '8px', border: '1px solid rgba(197,165,108,0.3)' }}>
            <FormatSizeIcon sx={{ fontSize: 15, color: colors.gold }} />
            <Typography sx={{ fontSize: '0.72rem', width: 22, textAlign: 'center' }}>{fontSize}</Typography>
            <Slider value={fontSize} min={10} max={32} onChange={(e, v) => onStyleChange('fontSize', v)} sx={{ width: 70, color: colors.gold, ml: 0.5 }} size="small" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(197,165,108,0.08)', px: 1.2, py: 0.5, borderRadius: '8px', border: '1px solid rgba(197,165,108,0.3)' }}>
            <ColorLensIcon sx={{ fontSize: 15, color: colors.gold }} />
            <input type="color" value={fontColor} onChange={(e) => onStyleChange('fontColor', e.target.value)}
              style={{ width: 26, height: 22, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
          </Box>
        </Box>
      )}
      <TextField fullWidth multiline={multiline} rows={multiline ? rows : undefined} value={value} onChange={(e) => onChange(e.target.value)} size="small"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: `${fontSize || 14}px`, color: fontColor || 'inherit', fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
      {onStyleChange && value && (
        <Box sx={{ mt: 0.8, p: 1.2, bgcolor: 'rgba(197,165,108,0.05)', borderRadius: '8px', border: '1px dashed rgba(197,165,108,0.25)' }}>
          <Typography sx={{ fontSize: `${fontSize}px`, color: fontColor, fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal', lineHeight: 1.5 }}>
            {value}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (locked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(t => {
          if (t <= 1) { setLocked(false); setAttempts(0); clearInterval(interval); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [locked, lockTimer]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (locked) return;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const session = { token: btoa(`${username}:${password}`), expires: Date.now() + SESSION_DURATION };        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        onLogin(true);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLocked(true);
          setLockTimer(30);
          setError('تعداد تلاش‌های ناموفق زیاد بود. ۳۰ ثانیه صبر کنید.');
        } else {
          setError(`نام کاربری یا رمز عبور اشتباه است. (${5 - newAttempts} تلاش باقی‌مانده)`);
        }
        setPassword('');
      }
    } catch {
      setError('خطا در ارتباط با سرور. دوباره تلاش کنید.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary} 0%, #0a1f1e 50%, #061410 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{ position: 'absolute', borderRadius: '50%', background: `rgba(197,165,108,${0.03 + i * 0.01})`, width: `${200 + i * 120}px`, height: `${200 + i * 120}px`, top: `${10 + i * 8}%`, left: `${5 + i * 15}%`, pointerEvents: 'none' }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, px: 2 }}>
        {/* Logo area */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ width: 70, height: 70, borderRadius: '20px', bgcolor: colors.gold, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 32px rgba(197,165,108,0.4)` }}>
            <ShieldIcon sx={{ fontSize: 38, color: colors.dark }} />
          </Box>
          <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem', mb: 0.5 }}>پنل مدیریت آبان</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>برای ورود اطلاعات خود را وارد کنید</Typography>
        </Box>

        {/* Login card */}
        <Paper elevation={0} sx={{ borderRadius: '28px', p: 4, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="نام کاربری"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              disabled={locked}
              autoComplete="username"
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} /></InputAdornment> }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '14px', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.gold },
              }}
            />
            <TextField
              label="رمز عبور"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              disabled={locked}
              autoComplete="current-password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(p => !p)} edge="end" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: colors.gold } }}>
                      {showPass ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '14px', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.gold },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ borderRadius: '12px', fontSize: '0.8rem', py: 0.5 }}>
                {locked ? `🔒 ${error} (${lockTimer}s)` : error}
              </Alert>
            )}

            <Button type="submit" variant="contained" disabled={locked || !username || !password} fullWidth
              sx={{ bgcolor: colors.gold, color: colors.dark, py: 1.4, borderRadius: '14px', fontWeight: 'bold', fontSize: '1rem', mt: 0.5, '&:hover': { bgcolor: '#d4b882', transform: 'translateY(-1px)', boxShadow: `0 8px 24px rgba(197,165,108,0.4)` }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }, transition: 'all 0.2s' }}>
              {locked ? `قفل شده (${lockTimer}s)` : 'ورود به پنل'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2.5, justifyContent: 'center' }}>
            <SecurityIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>اتصال امن · نشست ۲ ساعته</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

// ─── Main Admin ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState(0);
  const [articles, setArticles] = useState(initialArticles);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [homeData, setHomeData] = useState(initialHomeData);
  const [aboutData, setAboutData] = useState(initialAboutData);
  const [contactData, setContactData] = useState(initialContactData);
  const [servicesData, setServicesData] = useState(initialServicesData);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  const [articleDialog, setArticleDialog] = useState({ open: false, data: null });
  const [portfolioDialog, setPortfolioDialog] = useState({ open: false, data: null });
  const [bannerDialog, setBannerDialog] = useState({ open: false, data: null });
  const [subCompanies, setSubCompanies] = useState([]);
  const [subCompanyDialog, setSubCompanyDialog] = useState({ open: false, data: null });
  const [categories, setCategories] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState({ open: false, data: null });
  const [sectionImages, setSectionImages] = useState({});
  const [sectionImageDialog, setSectionImageDialog] = useState({ open: false, data: null });
  const [homeSections, setHomeSections] = useState([]);
  const [homeSectionDialog, setHomeSectionDialog] = useState({ open: false, data: null, isNew: false });
  const [activeSectionTab, setActiveSectionTab] = useState('services');
  const [inboxMessages, setInboxMessages] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session?.expires && session.expires > Date.now()) {
          setAuthenticated(true);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (_) {}
    setAuthChecked(true);
  }, []);

  // Load all data from DB when authenticated
  useEffect(() => {
    if (!authenticated) return;
    const load = async () => {
      try {
        const [arts, ports, bans, siteContent] = await Promise.all([
          articlesApi.getAll(),
          portfolioApi.getAll(),
          bannersApi.getAll(),
          contentApi.getAll(),
        ]);
        if (Array.isArray(arts)) setArticles(arts);
        if (Array.isArray(ports)) setPortfolio(ports);
        setHomeData(prev => ({
          ...prev,
          heroTitle: siteContent.home_hero_title || prev.heroTitle,
          heroSubtitle: siteContent.home_hero_subtitle || prev.heroSubtitle,
          sections: siteContent.home_sections || prev.sections,
          banners: Array.isArray(bans) ? bans : prev.banners,
          portfolioHeroTitle: siteContent.portfolio_hero_title || prev.portfolioHeroTitle,
          portfolioHeroSubtitle: siteContent.portfolio_hero_subtitle || prev.portfolioHeroSubtitle,
          portfolioMobileTitle: siteContent.portfolio_mobile_title || prev.portfolioMobileTitle,
          portfolioMobileSubtitle: siteContent.portfolio_mobile_subtitle || prev.portfolioMobileSubtitle,
          portfolioCTATitle: siteContent.portfolio_cta_title || prev.portfolioCTATitle,
          portfolioCTASubtitle: siteContent.portfolio_cta_subtitle || prev.portfolioCTASubtitle,
          articlesHeroTitle: siteContent.articles_hero_title || prev.articlesHeroTitle,
          articlesMobileTitle: siteContent.articles_mobile_title || prev.articlesMobileTitle,
          articlesMobileSubtitle: siteContent.articles_mobile_subtitle || prev.articlesMobileSubtitle,
          articlesMainSectionLabel: siteContent.articles_main_section_label || prev.articlesMainSectionLabel,
          articlesNormalSectionLabel: siteContent.articles_normal_section_label || prev.articlesNormalSectionLabel,
        }));
        setAboutData(prev => ({
          heroTitle: siteContent.about_hero_title || prev.heroTitle,
          heroSubtitle: siteContent.about_hero_subtitle || prev.heroSubtitle,
          missionTitle: siteContent.about_mission_title || prev.missionTitle,
          missionText: siteContent.about_mission_text || prev.missionText,
          missionLabel: siteContent.about_mission_label || prev.missionLabel,
          whyTitle: siteContent.about_why_title || prev.whyTitle,
          whyItems: siteContent.about_why_items || prev.whyItems,
          qualityTags: siteContent.about_quality_tags || prev.qualityTags,
          valuesLabel: siteContent.about_values_label || prev.valuesLabel,
          valuesHeading: siteContent.about_values_heading || prev.valuesHeading,
          ctaTitle: siteContent.about_cta_title || prev.ctaTitle,
          ctaSubtitle: siteContent.about_cta_subtitle || prev.ctaSubtitle,
          stats: siteContent.about_stats || prev.stats,
          values: siteContent.about_values || prev.values,
        }));
        setContactData(prev => ({
          heroTitle: siteContent.contact_hero_title || prev.heroTitle,
          heroSubtitle: siteContent.contact_hero_subtitle || prev.heroSubtitle,
          heroDescription: siteContent.contact_hero_description || prev.heroDescription,
          sectionLabel: siteContent.contact_section_label || prev.sectionLabel,
          sectionHeading: siteContent.contact_section_heading || prev.sectionHeading,
          sectionDescription: siteContent.contact_section_description || prev.sectionDescription,
          formTitle: siteContent.contact_form_title || prev.formTitle,
          formSubtitle: siteContent.contact_form_subtitle || prev.formSubtitle,
          phone1: siteContent.contact_phone1 || prev.phone1,
          phone2: siteContent.contact_phone2 || prev.phone2,
          mobile: siteContent.contact_mobile || prev.mobile,
          email1: siteContent.contact_email1 || prev.email1,
          email2: siteContent.contact_email2 || prev.email2,
          address: siteContent.contact_address || prev.address,
          workHours: siteContent.contact_work_hours || prev.workHours,
          instagram: siteContent.contact_instagram || prev.instagram,
          linkedin: siteContent.contact_linkedin || prev.linkedin,
          telegram: siteContent.contact_telegram || prev.telegram,
          whatsapp: siteContent.contact_whatsapp || prev.whatsapp,
        }));
        if (siteContent.services_data) {
          setServicesData(prev => ({ ...prev, ...siteContent.services_data }));
        }
        // Load sub companies
        const subs = await subCompaniesApi.getAll();
        if (Array.isArray(subs)) setSubCompanies(subs);
        // Load section images
        const imgs = await sectionImagesApi.getAll();
        if (Array.isArray(imgs)) {
          const grouped = imgs.reduce((acc, img) => {
            if (!acc[img.sectionId]) acc[img.sectionId] = [];
            acc[img.sectionId].push(img);
            return acc;
          }, {});
          setSectionImages(grouped);
        }
        // Load categories
        const cats = await categoriesApi.getAll();
        if (Array.isArray(cats)) setCategories(cats);
        // Load home sections (include hidden for admin)
        const hs = await homeSectionsApi.getAll(true);
        if (Array.isArray(hs)) setHomeSections(hs.sort((a, b) => a.order - b.order));
        // Load inbox messages
        const allContent = await contentApi.getAll();
        const messages = Object.entries(allContent)
          .filter(([key]) => key.startsWith('contact_submission_'))
          .map(([key, val]) => ({ key, ...(typeof val === 'object' ? val : {}) }))
          .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
        setInboxMessages(messages);
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    };
    load();
  }, [authenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  const toast = (msg, severity = 'success') => setSnackbar({ open: true, msg, severity });
  // Save ALL content sections to DB
  const saveAll = async () => {
    try {
      const s = (v) => (v === undefined || v === null) ? '' : (typeof v === 'string' ? v : JSON.stringify(v));
      await contentApi.setMany([
        { key: 'about_hero_title', value: s(aboutData.heroTitle) },
        { key: 'about_hero_subtitle', value: s(aboutData.heroSubtitle) },
        { key: 'about_mission_title', value: s(aboutData.missionTitle) },
        { key: 'about_mission_text', value: s(aboutData.missionText) },
        { key: 'about_mission_label', value: s(aboutData.missionLabel) },
        { key: 'about_why_title', value: s(aboutData.whyTitle) },
        { key: 'about_why_items', value: JSON.stringify((aboutData.whyItems || []).map(s => s.trim()).filter(Boolean)) },
        { key: 'about_quality_tags', value: JSON.stringify(aboutData.qualityTags || []) },
        { key: 'about_values_label', value: s(aboutData.valuesLabel) },
        { key: 'about_values_heading', value: s(aboutData.valuesHeading) },
        { key: 'about_cta_title', value: s(aboutData.ctaTitle) },
        { key: 'about_cta_subtitle', value: s(aboutData.ctaSubtitle) },
        { key: 'about_stats', value: JSON.stringify(aboutData.stats || []) },
        { key: 'about_values', value: JSON.stringify(aboutData.values || []) },
        { key: 'contact_hero_title', value: s(contactData.heroTitle) },
        { key: 'contact_hero_subtitle', value: s(contactData.heroSubtitle) },
        { key: 'contact_hero_description', value: s(contactData.heroDescription) },
        { key: 'contact_section_label', value: s(contactData.sectionLabel) },
        { key: 'contact_section_heading', value: s(contactData.sectionHeading) },
        { key: 'contact_section_description', value: s(contactData.sectionDescription) },
        { key: 'contact_form_title', value: s(contactData.formTitle) },
        { key: 'contact_form_subtitle', value: s(contactData.formSubtitle) },
        { key: 'contact_phone1', value: s(contactData.phone1) },
        { key: 'contact_phone2', value: s(contactData.phone2) },
        { key: 'contact_mobile', value: s(contactData.mobile) },
        { key: 'contact_email1', value: s(contactData.email1) },
        { key: 'contact_email2', value: s(contactData.email2) },
        { key: 'contact_address', value: s(contactData.address) },
        { key: 'contact_work_hours', value: s(contactData.workHours) },
        { key: 'contact_instagram', value: s(contactData.instagram) },
        { key: 'contact_linkedin', value: s(contactData.linkedin) },
        { key: 'contact_telegram', value: s(contactData.telegram) },
        { key: 'contact_whatsapp', value: s(contactData.whatsapp) },
        { key: 'home_portfolio_hero_title', value: s(homeData.portfolioHeroTitle) },
        { key: 'portfolio_hero_title', value: s(homeData.portfolioHeroTitle) },
        { key: 'portfolio_hero_subtitle', value: s(homeData.portfolioHeroSubtitle) },
        { key: 'portfolio_mobile_title', value: s(homeData.portfolioMobileTitle) },
        { key: 'portfolio_mobile_subtitle', value: s(homeData.portfolioMobileSubtitle) },
        { key: 'portfolio_cta_title', value: s(homeData.portfolioCTATitle) },
        { key: 'portfolio_cta_subtitle', value: s(homeData.portfolioCTASubtitle) },
        { key: 'articles_hero_title', value: s(homeData.articlesHeroTitle) },
        { key: 'articles_mobile_title', value: s(homeData.articlesMobileTitle) },
        { key: 'articles_mobile_subtitle', value: s(homeData.articlesMobileSubtitle) },
        { key: 'articles_main_section_label', value: s(homeData.articlesMainSectionLabel) },
        { key: 'articles_normal_section_label', value: s(homeData.articlesNormalSectionLabel) },
        { key: 'services_data', value: JSON.stringify(servicesData || {}) },
      ]);
      toast('تمام تغییرات با موفقیت در پایگاه داده ذخیره شد ✓');
    } catch (e) {
      console.error('saveAll error:', e);
      toast('خطا در ذخیره‌سازی: ' + e.message, 'error');
    }
  };

  // Article handlers
  const openNewArticle = () => setArticleDialog({ open: true, data: { title: '', intro: '', content: '', category: categories.filter(c => c.visible)[0]?.slug || '', status: 'draft', type: 'normal', image: '', imageAlt: '', metaDescription: '', keywords: '', views: 0, date: new Date().toLocaleDateString('fa-IR'), fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false } });
  const openEditArticle = (a) => setArticleDialog({ open: true, data: { ...a } });
  const saveArticle = async () => {
    const d = articleDialog.data;
    if (!d.title) { toast('عنوان مقاله الزامی است', 'error'); return; }
    try {
      const numId = d.id ? parseInt(d.id) : null;
      const exists = numId && articles.find(a => parseInt(a.id) === numId);
      if (exists) {
        const updated = await articlesApi.update(numId, d);
        if (updated.error) throw new Error(updated.error);
        setArticles(prev => prev.map(a => parseInt(a.id) === numId ? updated : a));
        toast('مقاله با موفقیت ویرایش شد ✓');
      } else {
        const created = await articlesApi.create(d);
        if (created.error) throw new Error(created.error);
        setArticles(prev => [...prev, created]);
        toast('مقاله جدید اضافه شد ✓');
      }
      setArticleDialog({ open: false, data: null });
    } catch (e) { 
      console.error('saveArticle error:', e);
      toast('خطا در ذخیره مقاله: ' + e.message, 'error'); 
    }
  };
  const deleteArticle = async (id) => {
    try {
      await articlesApi.delete(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      toast('مقاله حذف شد', 'info');
    } catch (e) { toast('خطا در حذف مقاله', 'error'); }
  };
  const toggleArticleStatus = async (id) => {
    const article = articles.find(a => a.id === id);
    const updated = await articlesApi.update(id, { ...article, status: article.status === 'published' ? 'draft' : 'published' });
    setArticles(prev => prev.map(a => a.id === id ? updated : a));
  };
  const toggleArticleType = async (id) => {
    const article = articles.find(a => a.id === id);
    const updated = await articlesApi.update(id, { ...article, type: article.type === 'main' ? 'normal' : 'main' });
    setArticles(prev => prev.map(a => a.id === id ? updated : a));
  };

  // Portfolio handlers
  const openNewPortfolio = () => setPortfolioDialog({ open: true, data: { title: '', category: 'web', image: '', tags: [], year: '۱۴۰۳', client: '', description: '', duration: '', url: '', features: [], videoUrl: '', videoTitle: '', showPreview: false, visible: true } });
  const openEditPortfolio = (p) => setPortfolioDialog({ open: true, data: { ...p, tags: p.tags || [], features: p.features || [], videoUrl: p.videoUrl || '', videoTitle: p.videoTitle || '', duration: p.duration || '', url: p.url || '', description: p.description || '', showPreview: p.showPreview || false } });
  const savePortfolio = async () => {
    const d = portfolioDialog.data;
    if (!d.title) { toast('عنوان پروژه الزامی است', 'error'); return; }
    try {
      const numId = d.id ? parseInt(d.id) : null;
      const exists = numId && portfolio.find(p => parseInt(p.id) === numId);
      if (exists) {
        const updated = await portfolioApi.update(numId, d);
        if (updated.error) throw new Error(updated.error);
        setPortfolio(prev => prev.map(p => parseInt(p.id) === numId ? updated : p));
        toast('پروژه با موفقیت ویرایش شد ✓');
      } else {
        const created = await portfolioApi.create(d);
        if (created.error) throw new Error(created.error);
        setPortfolio(prev => [...prev, created]);
        toast('پروژه جدید اضافه شد ✓');
      }
      setPortfolioDialog({ open: false, data: null });
    } catch (e) { 
      console.error('savePortfolio error:', e);
      toast('خطا در ذخیره پروژه: ' + e.message, 'error'); 
    }
  };
  const deletePortfolio = async (id) => {
    try {
      await portfolioApi.delete(id);
      setPortfolio(prev => prev.filter(p => p.id !== id));
      toast('پروژه حذف شد', 'info');
    } catch (e) { toast('خطا در حذف پروژه', 'error'); }
  };
  const togglePortfolioVisible = async (id) => {
    const proj = portfolio.find(p => p.id === id);
    const updated = await portfolioApi.update(id, { ...proj, visible: !proj.visible });
    setPortfolio(prev => prev.map(p => p.id === id ? updated : p));
  };

  // Banner handlers
  const openNewBanner = () => setBannerDialog({ open: true, data: { active: true, image: '', link: '' } });
  const openEditBanner = (b) => setBannerDialog({ open: true, data: { ...b, link: b.link || '' } });
  const saveBanner = async () => {
    const d = bannerDialog.data;
    if (!d.image) { toast('تصویر بنر الزامی است', 'error'); return; }
    try {
      const numId = d.id ? parseInt(d.id) : null;
      const exists = numId && homeData.banners.find(b => parseInt(b.id) === numId);
      if (exists) {
        const updated = await bannersApi.update(numId, d);
        if (updated.error) throw new Error(updated.error);
        setHomeData(prev => ({ ...prev, banners: prev.banners.map(b => parseInt(b.id) === numId ? updated : b) }));
        toast('بنر با موفقیت ویرایش شد ✓');
      } else {
        const created = await bannersApi.create(d);
        if (created.error) throw new Error(created.error);
        setHomeData(prev => ({ ...prev, banners: [...prev.banners, created] }));
        toast('بنر جدید اضافه شد ✓');
      }
      setBannerDialog({ open: false, data: null });
    } catch (e) { 
      console.error('saveBanner error:', e);
      toast('خطا در ذخیره بنر: ' + e.message, 'error'); 
    }
  };

  if (!authChecked) return null;
  if (!authenticated) return <LoginScreen onLogin={setAuthenticated} />;

  // Sub company handlers
  const openNewSubCompany = () => setSubCompanyDialog({ open: true, data: { name: '', logo: '', url: '', visible: true, order: subCompanies.length } });
  const openEditSubCompany = (c) => setSubCompanyDialog({ open: true, data: { ...c } });
  const saveSubCompany = async () => {
    const d = subCompanyDialog.data;
    if (!d.name) { toast('نام شرکت الزامی است', 'error'); return; }
    try {
      const numId = d.id ? parseInt(d.id) : null;
      const exists = numId && subCompanies.find(c => parseInt(c.id) === numId);
      if (exists) {
        const updated = await subCompaniesApi.update(numId, d);
        setSubCompanies(prev => prev.map(c => parseInt(c.id) === numId ? updated : c));
        toast('شرکت ویرایش شد ✓');
      } else {
        const created = await subCompaniesApi.create(d);
        setSubCompanies(prev => [...prev, created]);
        toast('شرکت اضافه شد ✓');
      }
      setSubCompanyDialog({ open: false, data: null });
    } catch (e) { toast('خطا در ذخیره', 'error'); }
  };
  const deleteSubCompany = async (id) => {
    try {
      await subCompaniesApi.delete(id);
      setSubCompanies(prev => prev.filter(c => c.id !== id));
      toast('شرکت حذف شد', 'info');
    } catch (e) { toast('خطا در حذف', 'error'); }
  };
  const toggleSubCompanyVisible = async (id) => {
    const company = subCompanies.find(c => c.id === id);
    const updated = await subCompaniesApi.update(id, { ...company, visible: !company.visible });
    setSubCompanies(prev => prev.map(c => c.id === id ? updated : c));
  };

  // Category handlers
  const openNewCategory = (parentId = null) => setCategoryDialog({ open: true, data: { name: '', slug: '', parentId, order: 0, visible: true } });
  const openEditCategory = (cat) => setCategoryDialog({ open: true, data: { ...cat } });
  const saveCategory = async () => {
    const d = categoryDialog.data;
    if (!d.name) { toast('نام دسته‌بندی الزامی است', 'error'); return; }
    const slug = d.slug || d.name.replace(/\s+/g, '-');
    try {
      if (d.id) {
        await categoriesApi.update(d.id, { ...d, slug });
      } else {
        await categoriesApi.create({ ...d, slug });
      }
      const cats = await categoriesApi.getAll();
      if (Array.isArray(cats)) setCategories(cats);
      setCategoryDialog({ open: false, data: null });
      toast('دسته‌بندی ذخیره شد ✓');
    } catch (e) { toast('خطا در ذخیره', 'error'); }
  };
  const deleteCategory = async (id) => {
    try {
      await categoriesApi.delete(id);
      const cats = await categoriesApi.getAll();
      if (Array.isArray(cats)) setCategories(cats);
      toast('دسته‌بندی حذف شد', 'info');
    } catch (e) { toast('خطا در حذف', 'error'); }
  };
  const toggleCategoryVisible = async (cat) => {
    await categoriesApi.update(cat.id, { ...cat, visible: !cat.visible });
    const cats = await categoriesApi.getAll();
    if (Array.isArray(cats)) setCategories(cats);
  };

  // Section image handlers — tabs are derived from the live home sections
  // (card sections only; the hero has no gallery), so newly added sections
  // automatically appear here and can receive images.
  const sectionTabs = homeSections
    .filter(s => s.type !== 'hero')
    .map(s => ({ id: s.sectionKey, label: s.title || s.sectionKey }));
  // keep the selected tab valid even if a section was deleted/renamed
  const activeSectionTabId = sectionTabs.some(t => t.id === activeSectionTab)
    ? activeSectionTab
    : (sectionTabs[0]?.id || activeSectionTab);
  const openNewSectionImage = (sectionId) => setSectionImageDialog({ open: true, data: { sectionId, src: '', alt: '', title: '', description: '', details: '', category: '', date: '۱۴۰۳', rating: '', order: 0, visible: true } });
  const openEditSectionImage = (img) => setSectionImageDialog({ open: true, data: { ...img } });
  const saveSectionImage = async () => {
    const d = sectionImageDialog.data;
    if (!d.src) { toast('تصویر الزامی است', 'error'); return; }
    if (!d.title) { toast('عنوان الزامی است', 'error'); return; }
    try {
      if (d.id) {
        await sectionImagesApi.update(d.id, d);
      } else {
        await sectionImagesApi.create(d);
      }
      const imgs = await sectionImagesApi.getAll();
      if (Array.isArray(imgs)) {
        const grouped = imgs.reduce((acc, img) => { if (!acc[img.sectionId]) acc[img.sectionId] = []; acc[img.sectionId].push(img); return acc; }, {});
        setSectionImages(grouped);
      }
      setSectionImageDialog({ open: false, data: null });
      toast('تصویر ذخیره شد ✓');
    } catch (e) { toast('خطا در ذخیره', 'error'); }
  };
  const deleteSectionImage = async (id, sectionId) => {
    try {
      await sectionImagesApi.delete(id);
      setSectionImages(prev => ({ ...prev, [sectionId]: (prev[sectionId] || []).filter(img => img.id !== id) }));
      toast('تصویر حذف شد', 'info');
    } catch (e) { toast('خطا', 'error'); }
  };

  // ── Home Sections (hero + cards) ──────────────────────────────────────────
  const refreshHomeSections = async () => {
    const hs = await homeSectionsApi.getAll(true);
    if (Array.isArray(hs)) setHomeSections(hs.sort((a, b) => a.order - b.order));
  };
  const openNewHomeSection = () => setHomeSectionDialog({
    open: true, isNew: true,
    data: { sectionKey: '', type: 'card', title: '', subtitle: '', buttons: [{ text: '', link: '', variant: 'contained' }], visible: true, order: homeSections.length },
  });
  const openEditHomeSection = (sec) => setHomeSectionDialog({
    open: true, isNew: false,
    data: { ...sec, buttons: Array.isArray(sec.buttons) ? sec.buttons.map(b => ({ ...b })) : [] },
  });
  const saveHomeSection = async () => {
    const d = homeSectionDialog.data;
    if (!d.sectionKey || !/^[a-z0-9-]+$/.test(d.sectionKey)) { toast('شناسه باید با حروف کوچک انگلیسی/عدد/خط‌تیره باشد', 'error'); return; }
    if (!d.title) { toast('عنوان الزامی است', 'error'); return; }
    const cleanButtons = (d.buttons || []).filter(b => (b.text || '').trim() !== '');
    const payload = { ...d, buttons: cleanButtons };
    try {
      const res = homeSectionDialog.isNew
        ? await homeSectionsApi.create(payload)
        : await homeSectionsApi.update(d.id, payload);
      if (res?.error) { toast(res.error, 'error'); return; }
      await refreshHomeSections();
      setHomeSectionDialog({ open: false, data: null, isNew: false });
      toast('بخش ذخیره شد ✓');
    } catch (e) { toast('خطا در ذخیره', 'error'); }
  };
  const deleteHomeSection = async (id) => {
    if (!confirm('این بخش حذف شود؟')) return;
    try {
      await homeSectionsApi.delete(id);
      setHomeSections(prev => prev.filter(s => s.id !== id));
      toast('بخش حذف شد', 'info');
    } catch (e) { toast('خطا', 'error'); }
  };
  const toggleHomeSectionVisible = async (sec) => {
    try {
      await homeSectionsApi.update(sec.id, { visible: !sec.visible });
      setHomeSections(prev => prev.map(s => s.id === sec.id ? { ...s, visible: !s.visible } : s));
    } catch (e) { toast('خطا', 'error'); }
  };
  const moveHomeSection = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= homeSections.length) return;
    const a = homeSections[index], b = homeSections[target];
    // swap order values
    const newList = [...homeSections];
    newList[index] = { ...b, order: a.order };
    newList[target] = { ...a, order: b.order };
    newList.sort((x, y) => x.order - y.order);
    setHomeSections(newList);
    try {
      await Promise.all([
        homeSectionsApi.update(a.id, { order: b.order }),
        homeSectionsApi.update(b.id, { order: a.order }),
      ]);
    } catch (e) { toast('خطا در مرتب‌سازی', 'error'); refreshHomeSections(); }
  };
  // dialog button-array helpers
  const setDialogButtons = (updater) => setHomeSectionDialog(prev => ({ ...prev, data: { ...prev.data, buttons: updater(prev.data.buttons || []) } }));
  const addDialogButton = () => setDialogButtons(btns => [...btns, { text: '', link: '', variant: btns.length === 0 ? 'contained' : 'outlined' }]);
  const updateDialogButton = (i, field, val) => setDialogButtons(btns => btns.map((b, idx) => idx === i ? { ...b, [field]: val } : b));
  const removeDialogButton = (i) => setDialogButtons(btns => btns.filter((_, idx) => idx !== i));

  const tabList = [
    { label: 'داشبورد', icon: <DashboardIcon /> },
    { label: 'مقالات', icon: <ArticleIcon /> },
    { label: 'پورتفولیو', icon: <PhotoLibraryIcon /> },
    { label: 'صفحه اصلی', icon: <HomeIcon /> },
    { label: 'درباره ما', icon: <InfoIcon /> },
    { label: 'تماس', icon: <ContactMailIcon /> },
    { label: 'خدمات', icon: <BuildIcon /> },
    { label: 'زیرمجموعه‌ها', icon: <BusinessIcon /> },
    { label: 'دسته‌بندی‌ها', icon: <CategoryIcon /> },
    { label: 'تصاویر صفحه اصلی', icon: <CollectionsIcon /> },
    { label: 'پیام‌های دریافتی', icon: <ContactMailIcon /> },
  ];

  // Grouped navigation: 5 primary groups instead of 11 flat tabs. Each group maps
  // to existing tab indices, so all panels keep working unchanged; multi-tab groups
  // get a horizontal sub-tab bar in the content area.
  const navGroups = [
    { label: 'داشبورد', icon: <DashboardIcon />, tabs: [0] },
    { label: 'محتوا', icon: <ArticleIcon />, tabs: [1, 8, 2], subLabels: { 1: 'مقالات', 8: 'دسته‌بندی‌ها', 2: 'پورتفولیو' } },
    { label: 'صفحه اصلی', icon: <HomeIcon />, tabs: [3, 9], subLabels: { 3: 'بخش‌ها و بنرها', 9: 'تصاویر بخش‌ها' } },
    { label: 'صفحات سایت', icon: <LanguageIcon />, tabs: [4, 6, 5, 7], subLabels: { 4: 'درباره ما', 6: 'خدمات', 5: 'تماس', 7: 'زیرمجموعه‌ها' } },
    { label: 'پیام‌ها', icon: <ContactMailIcon />, tabs: [10], badge: inboxMessages.length },
  ];
  const activeGroup = navGroups.find(g => g.tabs.includes(tab)) || navGroups[0];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', direction: 'rtl' }}>
      {/* Top Bar */}
      <Box sx={{ bgcolor: colors.primary, color: 'white', px: 3, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1200, boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, bgcolor: colors.gold, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldIcon sx={{ fontSize: 20, color: colors.dark }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>پنل مدیریت آبان</Typography>
            <Typography sx={{ fontSize: '0.65rem', opacity: 0.5 }}>aban-agency.ir · نشست فعال</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button onClick={saveAll} startIcon={<SaveIcon />} variant="contained" size="small"
            sx={{ bgcolor: colors.gold, color: colors.dark, fontWeight: 'bold', borderRadius: '10px', fontSize: '0.8rem', '&:hover': { bgcolor: '#d4b882' } }}>
            ذخیره همه
          </Button>
          <Tooltip title="مشاهده سایت">
            <IconButton href="/" target="_blank" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: colors.gold } }} size="small"><OpenInNewIcon sx={{ fontSize: 18 }} /></IconButton>
          </Tooltip>
          <Tooltip title="خروج از پنل">
            <IconButton onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff6b6b' } }} size="small"><LogoutIcon sx={{ fontSize: 18 }} /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Box sx={{ width: 224, bgcolor: 'white', minHeight: 'calc(100vh - 54px)', borderLeft: '1px solid rgba(197,165,108,0.12)', pt: 2, px: 1.5, flexShrink: 0, position: 'sticky', top: 54, height: 'calc(100vh - 54px)', overflowY: 'auto' }}>
          <Typography sx={{ fontSize: '0.62rem', fontWeight: 'bold', color: colors.dark, opacity: 0.4, letterSpacing: 1, px: 1.5, mb: 1 }}>منوی اصلی</Typography>
          {navGroups.map((g, gi) => {
            const isActive = g.tabs.includes(tab);
            return (
              <Box key={gi} onClick={() => setTab(g.tabs[0])}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.3, mb: 0.5, borderRadius: '14px', cursor: 'pointer',
                  color: isActive ? colors.dark : colors.dark,
                  bgcolor: isActive ? colors.gold : 'transparent',
                  boxShadow: isActive ? '0 6px 18px rgba(197,165,108,0.35)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: isActive ? colors.gold : 'rgba(197,165,108,0.1)' } }}>
                <Box sx={{ fontSize: 20, display: 'flex', color: isActive ? colors.dark : colors.gold }}>{g.icon}</Box>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: isActive ? 'bold' : 600, flex: 1 }}>{g.label}</Typography>
                {g.badge > 0 && (
                  <Box sx={{ bgcolor: isActive ? colors.dark : colors.gold, color: isActive ? colors.gold : colors.dark, borderRadius: '20px', px: 0.9, py: 0.1, fontSize: '0.65rem', fontWeight: 'bold', minWidth: 20, textAlign: 'center' }}>
                    {g.badge}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowX: 'hidden' }}>

          {/* Sub-tab bar for multi-panel groups */}
          {activeGroup.tabs.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', bgcolor: 'white', p: 0.8, borderRadius: '16px', border: '1px solid rgba(197,165,108,0.15)', width: 'fit-content' }}>
              {activeGroup.tabs.map(ti => (
                <Box key={ti} onClick={() => setTab(ti)}
                  sx={{ px: 2.2, py: 0.9, borderRadius: '12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: tab === ti ? 'bold' : 500,
                    color: tab === ti ? colors.dark : colors.dark,
                    bgcolor: tab === ti ? 'rgba(197,165,108,0.18)' : 'transparent',
                    transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(197,165,108,0.1)' } }}>
                  {activeGroup.subLabels?.[ti] || tabList[ti].label}
                </Box>
              ))}
            </Box>
          )}

          {/* DASHBOARD */}
          {tab === 0 && (
            <Box>
              {/* Welcome header */}
              <Box sx={{ mb: 3.5, p: 3, borderRadius: '22px', background: `linear-gradient(120deg, ${colors.primary} 0%, #14403c 100%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>خوش آمدید 👋</Typography>
                  <Typography sx={{ fontSize: '0.85rem', opacity: 0.7, mt: 0.5 }}>یک نمای کلی از وضعیت سایت و محتوای آبان</Typography>
                </Box>
                <Button onClick={() => { setTab(1); setTimeout(openNewArticle, 100); }} startIcon={<AddIcon />} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: '#d4b882' } }}>محتوای جدید</Button>
              </Box>

              {/* Stats */}
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard icon={<ArticleIcon />} label="مقالات" value={articles.length} color={colors.primary} sub={`${articles.filter(a => a.status === 'published').length} منتشرشده`} onClick={() => setTab(1)} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard icon={<PhotoLibraryIcon />} label="پروژه‌ها" value={portfolio.length} color={colors.gold} onClick={() => setTab(2)} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard icon={<VisibilityIcon />} label="بازدید کل" value={articles.reduce((s, a) => s + (a.views || 0), 0).toLocaleString('fa')} color="#4CAF50" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard icon={<ContactMailIcon />} label="پیام‌ها" value={inboxMessages.length} color="#FF9800" sub={inboxMessages.length > 0 ? 'بررسی پیام‌ها' : 'بدون پیام'} onClick={() => setTab(10)} /></Grid>
              </Grid>

              <Grid container spacing={2.5}>
                {/* Recent articles */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>آخرین مقالات</Typography>
                      <Button onClick={() => setTab(1)} size="small" sx={{ color: colors.gold, fontSize: '0.75rem' }}>همه ←</Button>
                    </Box>
                    {articles.length === 0 && <Typography sx={{ fontSize: '0.82rem', color: colors.dark, opacity: 0.45, py: 3, textAlign: 'center' }}>هنوز مقاله‌ای ثبت نشده</Typography>}
                    {articles.slice(0, 5).map(a => (
                      <Box key={a.id} onClick={() => { setTab(1); setTimeout(() => openEditArticle(a), 100); }} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.2, borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', borderRadius: '10px', px: 1, mx: -1, transition: 'background 0.2s', '&:hover': { bgcolor: 'rgba(197,165,108,0.06)' } }}>
                        <Box component="img" src={a.image} sx={{ width: 44, height: 44, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 'bold', color: colors.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: colors.dark, opacity: 0.55 }}>{(a.views || 0).toLocaleString('fa')} بازدید</Typography>
                        </Box>
                        <Chip label={a.status === 'published' ? 'منتشر' : 'پیش‌نویس'} size="small" sx={{ bgcolor: a.status === 'published' ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.06)', color: a.status === 'published' ? '#4CAF50' : '#999', fontSize: '0.62rem' }} />
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Recent messages */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>پیام‌های اخیر</Typography>
                      {inboxMessages.length > 0 && <Button onClick={() => setTab(10)} size="small" sx={{ color: colors.gold, fontSize: '0.75rem' }}>همه ←</Button>}
                    </Box>
                    {inboxMessages.length === 0 && <Typography sx={{ fontSize: '0.82rem', color: colors.dark, opacity: 0.45, py: 3, textAlign: 'center' }}>پیام جدیدی نیست</Typography>}
                    {inboxMessages.slice(0, 4).map((m, i) => (
                      <Box key={m.key || i} onClick={() => setTab(10)} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.2, borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: 'rgba(197,165,108,0.15)', color: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>{(m.name || '?').charAt(0)}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography dir="auto" sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: colors.primary, textAlign: 'start' }}>{m.name}</Typography>
                          <Typography dir="auto" sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.55, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start', unicodeBidi: 'plaintext' }}>{m.subject || m.message}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Quick actions */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2 }}>دسترسی سریع</Typography>
                    <Grid container spacing={1.5}>
                      {[
                        { label: 'مقاله جدید', action: () => { setTab(1); setTimeout(openNewArticle, 100); }, icon: <ArticleIcon /> },
                        { label: 'پروژه جدید', action: () => { setTab(2); setTimeout(openNewPortfolio, 100); }, icon: <PhotoLibraryIcon /> },
                        { label: 'بنر جدید', action: () => { setTab(3); setTimeout(openNewBanner, 100); }, icon: <CampaignIcon /> },
                        { label: 'بخش صفحه اصلی', action: () => setTab(3), icon: <HomeIcon /> },
                        { label: 'ویرایش تماس', action: () => setTab(5), icon: <ContactMailIcon /> },
                        { label: 'مدیریت خدمات', action: () => setTab(6), icon: <BuildIcon /> },
                      ].map((item, i) => (
                        <Grid size={{ xs: 6, sm: 4 }} key={i}>
                          <Box onClick={item.action} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, py: 2, borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(197,165,108,0.18)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(197,165,108,0.08)', borderColor: colors.gold, transform: 'translateY(-2px)' } }}>
                            <Box sx={{ color: colors.gold, fontSize: 24, display: 'flex' }}>{item.icon}</Box>
                            <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: colors.primary, textAlign: 'center' }}>{item.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Site overview */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', height: '100%' }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2 }}>وضعیت سایت</Typography>
                    {[
                      { label: 'بخش‌های نمایش‌داده‌شده', value: `${homeSections.filter(s => s.visible).length} از ${homeSections.length}`, icon: <HomeIcon />, tab: 3 },
                      { label: 'بنرهای فعال', value: homeData.banners.filter(b => b.active).length, icon: <CampaignIcon />, tab: 3 },
                      { label: 'دسته‌بندی‌ها', value: categories.length, icon: <CategoryIcon />, tab: 8 },
                      { label: 'زیرمجموعه‌ها', value: subCompanies.length, icon: <BusinessIcon />, tab: 7 },
                    ].map((row, i) => (
                      <Box key={i} onClick={() => setTab(row.tab)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.3, borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>
                        <Box sx={{ color: colors.gold, fontSize: 18, display: 'flex' }}>{row.icon}</Box>
                        <Typography sx={{ flex: 1, fontSize: '0.82rem', color: colors.dark }}>{row.label}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.primary }}>{typeof row.value === 'number' ? row.value.toLocaleString('fa') : row.value}</Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ARTICLES */}
          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary }}>مدیریت مقالات</Typography>
                <Button onClick={openNewArticle} startIcon={<AddIcon />} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>مقاله جدید</Button>
              </Box>
              <Grid container spacing={2.5}>
                {articles.map(article => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                    <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', border: article.type === 'main' ? `2px solid ${colors.gold}` : '1px solid rgba(197,165,108,0.15)', transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)', transform: 'translateY(-3px)' } }}>
                      <Box sx={{ position: 'relative' }}>
                        <Box component="img" src={article.image} alt={article.title} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.7 }}>
                          <Chip label={article.status === 'published' ? 'منتشر' : 'پیش‌نویس'} size="small" sx={{ bgcolor: article.status === 'published' ? 'rgba(76,175,80,0.9)' : 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.62rem' }} />
                          {article.type === 'main' && <Chip label="اصلی ⭐" size="small" sx={{ bgcolor: 'rgba(197,165,108,0.9)', color: 'white', fontSize: '0.62rem' }} />}
                        </Box>
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.87rem', color: colors.primary, mb: 0.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: colors.dark, opacity: 0.55, mb: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stripHtml(article.intro)}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.7 }}>
                          <Tooltip title="ویرایش"><IconButton size="small" onClick={() => openEditArticle(article)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                          <Tooltip title={article.status === 'published' ? 'پنهان' : 'انتشار'}><IconButton size="small" onClick={() => toggleArticleStatus(article.id)} sx={{ color: article.status === 'published' ? '#4CAF50' : '#999', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}><VisibilityIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                          <Tooltip title={article.type === 'main' ? 'عادی' : 'اصلی'}><IconButton size="small" onClick={() => toggleArticleType(article.id)} sx={{ color: article.type === 'main' ? colors.gold : '#bbb', bgcolor: 'rgba(197,165,108,0.08)', borderRadius: '8px' }}>{article.type === 'main' ? <StarIcon sx={{ fontSize: 15 }} /> : <StarBorderIcon sx={{ fontSize: 15 }} />}</IconButton></Tooltip>
                          <Tooltip title="حذف"><IconButton size="small" onClick={() => deleteArticle(article.id)} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255,107,107,0.2)' } }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* PORTFOLIO */}
          {tab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary }}>مدیریت پورتفولیو</Typography>
                <Button onClick={openNewPortfolio} startIcon={<AddIcon />} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>پروژه جدید</Button>
              </Box>
              <Grid container spacing={2.5}>
                {portfolio.map(proj => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={proj.id}>
                    <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(197,165,108,0.15)', opacity: proj.visible ? 1 : 0.55, transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)', transform: 'translateY(-3px)', opacity: 1 } }}>
                      <Box component="img" src={proj.image} alt={proj.title} sx={{ width: '100%', height: 150, objectFit: 'cover' }} />
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '0.87rem', color: colors.primary }}>{proj.title}</Typography>
                          <Chip label={proj.visible ? 'نمایش' : 'پنهان'} size="small" sx={{ bgcolor: proj.visible ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.06)', color: proj.visible ? '#4CAF50' : '#999', fontSize: '0.62rem' }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                          {(proj.tags || []).map(tag => <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(197,165,108,0.1)', color: colors.primary, fontSize: '0.62rem', height: 20 }} />)}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.7 }}>
                          <Tooltip title="ویرایش"><IconButton size="small" onClick={() => openEditPortfolio(proj)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                          <Tooltip title={proj.visible ? 'پنهان' : 'نمایش'}><IconButton size="small" onClick={() => togglePortfolioVisible(proj.id)} sx={{ color: proj.visible ? '#4CAF50' : '#999', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}><VisibilityIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                          <Tooltip title="حذف"><IconButton size="small" onClick={() => deletePortfolio(proj.id)} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255,107,107,0.2)' } }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* HOME */}
          {tab === 3 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 3 }}>ویرایش صفحه اصلی</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>بخش‌های صفحه اصلی</Typography>
                      <Button onClick={openNewHomeSection} startIcon={<AddIcon />} size="small" variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold' }}>بخش جدید</Button>
                    </Box>
                    <Typography sx={{ fontSize: '0.72rem', color: colors.dark, opacity: 0.55, mb: 2 }}>
                      عنوان، زیرعنوان، دکمه‌ها و لینک‌ها را ویرایش کن. با فلش‌ها ترتیب نمایش را عوض کن، با سوییچ بخش را نمایش/مخفی کن.
                    </Typography>
                    {homeSections.length === 0 && (
                      <Typography sx={{ color: colors.dark, opacity: 0.4, textAlign: 'center', py: 3, fontSize: '0.82rem' }}>
                        بخشی ثبت نشده. روی «بخش جدید» بزن یا اسکریپت seed را اجرا کن.
                      </Typography>
                    )}
                    {homeSections.map((sec, idx) => (
                      <Box key={sec.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.4, borderBottom: idx < homeSections.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', opacity: sec.visible ? 1 : 0.5 }}>
                        {/* reorder */}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton size="small" onClick={() => moveHomeSection(idx, -1)} disabled={idx === 0} sx={{ p: 0.2, color: colors.primary }}><ArrowUpwardIcon sx={{ fontSize: 18 }} /></IconButton>
                          <IconButton size="small" onClick={() => moveHomeSection(idx, 1)} disabled={idx === homeSections.length - 1} sx={{ p: 0.2, color: colors.primary }}><ArrowDownwardIcon sx={{ fontSize: 18 }} /></IconButton>
                        </Box>
                        {/* info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.title || '(بدون عنوان)'}</Typography>
                            {sec.type === 'hero' && <Chip label="هیرو" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(197,165,108,0.18)', color: colors.primary }} />}
                          </Box>
                          <Typography sx={{ fontSize: '0.68rem', color: colors.dark, opacity: 0.5, fontFamily: 'monospace' }}>
                            {sec.sectionKey} · {(sec.buttons || []).length} دکمه
                          </Typography>
                        </Box>
                        {/* actions */}
                        <Switch checked={sec.visible} onChange={() => toggleHomeSectionVisible(sec)} size="small" />
                        <IconButton size="small" onClick={() => openEditHomeSection(sec)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton>
                        <IconButton size="small" onClick={() => deleteHomeSection(sec.id)} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px' }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>مدیریت بنرها</Typography>
                      <Button onClick={openNewBanner} startIcon={<AddIcon />} size="small" variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold' }}>بنر جدید</Button>
                    </Box>
                    {homeData.banners.length === 0 && <Typography sx={{ color: colors.dark, opacity: 0.4, textAlign: 'center', py: 3, fontSize: '0.82rem' }}>بنری وجود ندارد</Typography>}
                    {homeData.banners.map(banner => (
                      <Box key={banner.id} sx={{ p: 2, mb: 1.5, borderRadius: '14px', border: '1px solid rgba(197,165,108,0.2)', bgcolor: banner.active ? 'rgba(197,165,108,0.05)' : 'transparent' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                            {banner.image ? (
                              <Box component="img" src={banner.image} alt="بنر" sx={{ width: 64, height: 36, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                            ) : (
                              <Box sx={{ width: 64, height: 36, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.06)', flexShrink: 0 }} />
                            )}
                            <Typography sx={{ fontSize: '0.78rem', color: colors.dark, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{banner.link || 'بدون لینک'}</Typography>
                          </Box>
                          <Chip label={banner.active ? 'فعال' : 'غیرفعال'} size="small" sx={{ bgcolor: banner.active ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.06)', color: banner.active ? '#4CAF50' : '#999', fontSize: '0.62rem', flexShrink: 0 }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.7 }}>
                          <IconButton size="small" onClick={() => openEditBanner(banner)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                          <IconButton size="small" onClick={async () => { try { await bannersApi.delete(banner.id); setHomeData(prev => ({ ...prev, banners: prev.banners.filter(b => b.id !== banner.id) })); toast('بنر حذف شد', 'info'); } catch(e) { toast('خطا', 'error'); } }} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px' }}><DeleteIcon sx={{ fontSize: 14 }} /></IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ABOUT */}
          {tab === 4 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 3 }}>ویرایش صفحه درباره ما</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mb: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>بخش هیرو</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextStyleEditor label="عنوان" value={aboutData.heroTitle} onChange={(v) => setAboutData(p => ({ ...p, heroTitle: v }))} />
                      <TextStyleEditor label="متن" value={aboutData.heroSubtitle} onChange={(v) => setAboutData(p => ({ ...p, heroSubtitle: v }))} multiline rows={3} />
                    </Box>
                  </Paper>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>بخش ماموریت</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextField label="برچسب بخش ماموریت" value={aboutData.missionLabel} onChange={(e) => setAboutData(p => ({ ...p, missionLabel: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      <TextStyleEditor label="عنوان" value={aboutData.missionTitle} onChange={(v) => setAboutData(p => ({ ...p, missionTitle: v }))} />
                      <TextStyleEditor label="متن" value={aboutData.missionText} onChange={(v) => setAboutData(p => ({ ...p, missionText: v }))} multiline rows={4} />
                      <TextField label="عنوان باکس چرا آبان" value={aboutData.whyTitle} onChange={(e) => setAboutData(p => ({ ...p, whyTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      <TextField label="آیتم‌های چرا آبان (هر خط یک آیتم)" value={(Array.isArray(aboutData.whyItems) ? aboutData.whyItems : []).join('\n')} onChange={(e) => setAboutData(p => ({ ...p, whyItems: e.target.value.split('\n') }))} size="small" fullWidth multiline rows={5} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      <TextField label="تگ‌های کیفیت (با کاما جدا کنید)" value={(aboutData.qualityTags||[]).join('،')} onChange={(e) => setAboutData(p => ({ ...p, qualityTags: e.target.value.split('،').map(t=>t.trim()) }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                    </Box>
                  </Paper>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mt: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>بخش ارزش‌ها و CTA</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField label="برچسب بخش ارزش‌ها" value={aboutData.valuesLabel} onChange={(e) => setAboutData(p => ({ ...p, valuesLabel: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      <TextField label="عنوان بخش ارزش‌ها" value={aboutData.valuesHeading} onChange={(e) => setAboutData(p => ({ ...p, valuesHeading: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      <TextField label="عنوان CTA" value={aboutData.ctaTitle} onChange={(e) => setAboutData(p => ({ ...p, ctaTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      <TextField label="زیرعنوان CTA" value={aboutData.ctaSubtitle} onChange={(e) => setAboutData(p => ({ ...p, ctaSubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mb: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2 }}>آمارها</Typography>
                    {aboutData.stats.map((stat, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField value={stat.number} onChange={(e) => setAboutData(p => ({ ...p, stats: p.stats.map((s, si) => si === i ? { ...s, number: e.target.value } : s) }))} label="عدد" size="small" sx={{ width: 90, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                        <TextField value={stat.label} onChange={(e) => setAboutData(p => ({ ...p, stats: p.stats.map((s, si) => si === i ? { ...s, label: e.target.value } : s) }))} label="برچسب" size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                      </Box>
                    ))}
                  </Paper>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>ارزش‌ها ({aboutData.values.length})</Typography>
                      <Button size="small" variant="contained" onClick={() => setAboutData(p => ({ ...p, values: [...p.values, { title: 'ارزش جدید', description: '' }] }))}
                        sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold', fontSize: '0.75rem' }}>+ افزودن</Button>
                    </Box>
                    {aboutData.values.map((val, i) => (
                      <Box key={i} sx={{ mb: 2, p: 2, bgcolor: 'rgba(197,165,108,0.04)', borderRadius: '12px', border: '1px solid rgba(197,165,108,0.1)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.gold, fontWeight: 'bold' }}>ارزش {i + 1}</Typography>
                          <IconButton size="small" onClick={() => setAboutData(p => ({ ...p, values: p.values.filter((_, vi) => vi !== i) }))}
                            sx={{ color: '#ff6b6b', p: 0.3, '&:hover': { bgcolor: 'rgba(255,107,107,0.1)' } }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Box>
                        <TextField value={val.title} onChange={(e) => setAboutData(p => ({ ...p, values: p.values.map((v, vi) => vi === i ? { ...v, title: e.target.value } : v) }))} label={`عنوان ${i + 1}`} size="small" fullWidth sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                        <TextField value={val.description} onChange={(e) => setAboutData(p => ({ ...p, values: p.values.map((v, vi) => vi === i ? { ...v, description: e.target.value } : v) }))} label="توضیحات" size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                        <Box sx={{ mt: 1.5 }}>
                          <ImageUploader value={val.icon || ''} onChange={(url) => setAboutData(p => ({ ...p, values: p.values.map((v, vi) => vi === i ? { ...v, icon: url } : v) }))} label="آیکون (اختیاری)" height={90} hint="یک تصویر کوچک شفاف (PNG/SVG) به‌جای ایموجی" />
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* CONTACT */}
          {tab === 5 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 3 }}>ویرایش اطلاعات تماس</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mb: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>شماره تماس و ایمیل</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[['phone1','تلفن ۱'],['phone2','تلفن ۲'],['mobile','موبایل'],['email1','ایمیل ۱'],['email2','ایمیل ۲']].map(([key, label]) => (
                        <TextField key={key} label={label} value={contactData[key]} onChange={(e) => setContactData(p => ({ ...p, [key]: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      ))}
                    </Box>
                  </Paper>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>آدرس و ساعت کاری</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField label="آدرس کامل" value={contactData.address} onChange={(e) => setContactData(p => ({ ...p, address: e.target.value }))} size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      <TextField label="ساعت کاری" value={contactData.workHours} onChange={(e) => setContactData(p => ({ ...p, workHours: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>شبکه‌های اجتماعی</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[['instagram','اینستاگرام'],['linkedin','لینکدین'],['telegram','تلگرام'],['whatsapp','واتساپ']].map(([key, label]) => (
                        <TextField key={key} label={label} value={contactData[key]} onChange={(e) => setContactData(p => ({ ...p, [key]: e.target.value }))} size="small" fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 16, color: colors.gold }} /></InputAdornment> }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* SECTION IMAGES */}
          {tab === 9 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 3 }}>تصاویر صفحه اصلی</Typography>
              {/* Section tabs */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {sectionTabs.length === 0 && (
                  <Typography sx={{ color: colors.dark, opacity: 0.5, fontSize: '0.85rem' }}>
                    ابتدا از تب «صفحه اصلی» یک بخش بساز تا اینجا برای افزودن تصویر ظاهر شود.
                  </Typography>
                )}
                {sectionTabs.map(st => (
                  <Button key={st.id} onClick={() => setActiveSectionTab(st.id)} variant={activeSectionTabId === st.id ? 'contained' : 'outlined'}
                    sx={{ borderRadius: '50px', fontWeight: 'bold', ...(activeSectionTabId === st.id ? { bgcolor: colors.gold, color: colors.dark, borderColor: colors.gold } : { borderColor: 'rgba(197,165,108,0.3)', color: colors.primary }) }}>
                    {st.label}
                    <Box component="span" sx={{ ml: 1, bgcolor: activeSectionTabId === st.id ? 'rgba(0,0,0,0.15)' : 'rgba(197,165,108,0.1)', px: 1, py: 0.2, borderRadius: '20px', fontSize: '0.7rem' }}>
                      {(sectionImages[st.id] || []).length}
                    </Box>
                  </Button>
                ))}
              </Box>
              {/* Add button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button onClick={() => openNewSectionImage(activeSectionTabId)} startIcon={<AddIcon />} variant="contained" disabled={sectionTabs.length === 0}
                  sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>
                  تصویر جدید
                </Button>
              </Box>
              {/* Images grid */}
              <Grid container spacing={2.5}>
                {(sectionImages[activeSectionTabId] || []).map(img => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img.id}>
                    <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(197,165,108,0.15)', transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)', transform: 'translateY(-3px)' } }}>
                      <Box component="img" src={img.src} alt={img.title} sx={{ width: '100%', height: 160, objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'; }} />
                      <Box sx={{ p: 2 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.88rem', color: colors.primary, mb: 0.3 }}>{img.title}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: colors.dark, opacity: 0.55, mb: 1.5 }}>{img.description}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.7 }}>
                          <Tooltip title="ویرایش"><IconButton size="small" onClick={() => openEditSectionImage(img)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                          <Tooltip title="حذف"><IconButton size="small" onClick={() => deleteSectionImage(img.id, img.sectionId)} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255,107,107,0.2)' } }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
                {(sectionImages[activeSectionTabId] || []).length === 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center', py: 6, color: colors.dark, opacity: 0.4 }}>
                      <CollectionsIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>تصویری برای این بخش اضافه نشده</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* CATEGORIES */}
          {tab === 8 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary }}>دسته‌بندی مقالات</Typography>
                <Button onClick={() => openNewCategory(null)} startIcon={<AddIcon />} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>دسته جدید</Button>
              </Box>
              {categories.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6, color: colors.dark, opacity: 0.4 }}>
                  <CategoryIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>هنوز دسته‌بندی‌ای اضافه نشده</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categories.map(cat => (
                  <Paper key={cat.id} elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', overflow: 'hidden' }}>
                    {/* Parent category */}
                    <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(197,165,108,0.04)' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: 'rgba(197,165,108,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CategoryIcon sx={{ color: colors.gold, fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.primary }}>{cat.name}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.5 }}>/{cat.slug} · {cat.children?.length || 0} زیردسته</Typography>
                      </Box>
                      <Chip label={cat.visible ? 'نمایش' : 'پنهان'} size="small" sx={{ bgcolor: cat.visible ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.06)', color: cat.visible ? '#4CAF50' : '#999', fontSize: '0.62rem' }} />
                      <Box sx={{ display: 'flex', gap: 0.7 }}>
                        <Tooltip title="زیردسته جدید"><IconButton size="small" onClick={() => openNewCategory(cat.id)} sx={{ color: colors.gold, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><AddIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        <Tooltip title="ویرایش"><IconButton size="small" onClick={() => openEditCategory(cat)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        <Tooltip title={cat.visible ? 'پنهان' : 'نمایش'}><IconButton size="small" onClick={() => toggleCategoryVisible(cat)} sx={{ color: cat.visible ? '#4CAF50' : '#999', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}><VisibilityIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        <Tooltip title="حذف"><IconButton size="small" onClick={() => deleteCategory(cat.id)} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255,107,107,0.2)' } }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                      </Box>
                    </Box>
                    {/* Sub categories */}
                    {cat.children?.length > 0 && (
                      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1, borderTop: '1px solid rgba(197,165,108,0.1)' }}>
                        {cat.children.map(child => (
                          <Box key={child.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: child.visible ? 'rgba(197,165,108,0.08)' : 'rgba(0,0,0,0.04)', px: 1.5, py: 0.6, borderRadius: '50px', border: '1px solid rgba(197,165,108,0.15)' }}>
                            <LabelIcon sx={{ fontSize: 13, color: colors.gold }} />
                            <Typography sx={{ fontSize: '0.78rem', color: colors.primary }}>{child.name}</Typography>
                            <IconButton size="small" onClick={() => openEditCategory(child)} sx={{ p: 0.2, color: colors.dark, opacity: 0.5, '&:hover': { color: colors.gold, opacity: 1 } }}><EditIcon sx={{ fontSize: 12 }} /></IconButton>
                            <IconButton size="small" onClick={() => deleteCategory(child.id)} sx={{ p: 0.2, color: colors.dark, opacity: 0.5, '&:hover': { color: '#ff6b6b', opacity: 1 } }}><DeleteIcon sx={{ fontSize: 12 }} /></IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* SUB COMPANIES */}
          {tab === 7 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary }}>زیرمجموعه‌ها</Typography>
                <Button onClick={openNewSubCompany} startIcon={<AddIcon />} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>شرکت جدید</Button>
              </Box>
              <Grid container spacing={2.5}>
                {subCompanies.map(company => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={company.id}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', opacity: company.visible ? 1 : 0.55, transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-3px)', opacity: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {company.logo ? (
                          <Box component="img" src={company.logo} alt={company.name} sx={{ width: 56, height: 40, objectFit: 'contain', borderRadius: '10px', bgcolor: 'rgba(0,0,0,0.04)', p: 0.5 }} />
                        ) : (
                          <Box sx={{ width: 56, height: 40, borderRadius: '10px', bgcolor: 'rgba(197,165,108,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BusinessIcon sx={{ color: colors.gold, fontSize: 22 }} />
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: colors.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.name}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.55, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.url}</Typography>
                        </Box>
                        <Chip label={company.visible ? 'نمایش' : 'پنهان'} size="small" sx={{ bgcolor: company.visible ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.06)', color: company.visible ? '#4CAF50' : '#999', fontSize: '0.62rem' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.7 }}>
                        <Tooltip title="ویرایش"><IconButton size="small" onClick={() => openEditSubCompany(company)} sx={{ color: colors.primary, bgcolor: 'rgba(197,165,108,0.1)', borderRadius: '8px', '&:hover': { bgcolor: colors.gold, color: 'white' } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        <Tooltip title={company.visible ? 'پنهان' : 'نمایش'}><IconButton size="small" onClick={() => toggleSubCompanyVisible(company.id)} sx={{ color: company.visible ? '#4CAF50' : '#999', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}><VisibilityIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                        <Tooltip title="حذف"><IconButton size="small" onClick={() => deleteSubCompany(company.id)} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.08)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255,107,107,0.2)' } }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
                {subCompanies.length === 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center', py: 6, color: colors.dark, opacity: 0.4 }}>
                      <BusinessIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>هنوز شرکتی اضافه نشده</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* SERVICES */}
          {tab === 6 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 3 }}>ویرایش خدمات</Typography>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mb: 3 }}>
                <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2.5 }}>متون صفحه خدمات</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="عنوان هرو دسکتاپ" value={servicesData.heroTitle} onChange={(e) => setServicesData(p => ({ ...p, heroTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان هرو دسکتاپ" value={servicesData.heroSubtitle} onChange={(e) => setServicesData(p => ({ ...p, heroSubtitle: e.target.value }))} size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="عنوان موبایل" value={servicesData.mobileTitle} onChange={(e) => setServicesData(p => ({ ...p, mobileTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان موبایل" value={servicesData.mobileSubtitle} onChange={(e) => setServicesData(p => ({ ...p, mobileSubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="عنوان CTA دسکتاپ" value={servicesData.ctaTitle} onChange={(e) => setServicesData(p => ({ ...p, ctaTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان CTA دسکتاپ" value={servicesData.ctaSubtitle} onChange={(e) => setServicesData(p => ({ ...p, ctaSubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="عنوان CTA موبایل" value={servicesData.mobileCTATitle} onChange={(e) => setServicesData(p => ({ ...p, mobileCTATitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان CTA موبایل" value={servicesData.mobileCTASubtitle} onChange={(e) => setServicesData(p => ({ ...p, mobileCTASubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="لینک دکمه CTA اصلی" value={servicesData.ctaLink || '/contact'} onChange={(e) => setServicesData(p => ({ ...p, ctaLink: e.target.value }))} size="small" fullWidth placeholder="/contact" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  <TextField label="لینک دکمه CTA دوم" value={servicesData.ctaLink2 || '/portfolio'} onChange={(e) => setServicesData(p => ({ ...p, ctaLink2: e.target.value }))} size="small" fullWidth placeholder="/portfolio" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Box>
              </Paper>

              {/* Services Items */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: colors.primary }}>خدمات ({(servicesData.items||[]).length})</Typography>
                <Button size="small" variant="contained" onClick={() => setServicesData(prev => ({ ...prev, items: [...(prev.items||[]), { id: Date.now(), title: 'خدمت جدید', description: '', image: '', link: '', visible: true, subServices: [] }] }))}
                  sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.78rem' }}>+ افزودن خدمت</Button>
              </Box>

              {(servicesData.items||[]).map((svc, i) => (
                <Paper key={svc.id} elevation={0} sx={{ p: 3, borderRadius: '20px', border: `1px solid ${svc.visible ? 'rgba(197,165,108,0.25)' : 'rgba(0,0,0,0.08)'}`, opacity: svc.visible ? 1 : 0.6, mb: 2 }}>
                  {/* Service header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>خدمت {i + 1}: {svc.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <FormControlLabel control={<Switch checked={svc.visible} size="small" onChange={() => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, visible: !s.visible } : s) }))} />} label={<Typography sx={{ fontSize: '0.78rem' }}>{svc.visible ? 'نمایش' : 'پنهان'}</Typography>} />
                      <IconButton size="small" onClick={() => setServicesData(prev => ({ ...prev, items: prev.items.filter(s => s.id !== svc.id) }))}
                        sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,107,107,0.1)', borderRadius: '8px', '&:hover': { bgcolor: '#ff6b6b', color: 'white' } }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField value={svc.title} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, title: e.target.value } : s) }))} label="عنوان خدمت" size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <TextField value={svc.description} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, description: e.target.value } : s) }))} label="توضیحات" size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <TextField value={svc.link || ''} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, link: e.target.value } : s) }))} label="لینک صفحه اختصاصی (اختیاری)" size="small" fullWidth placeholder="مثال: /services/web-design" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <ImageUploader label="تصویر / آیکون خدمت" value={svc.image || ''} onChange={(url) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, image: url } : s) }))} height={100} />

                    {/* Sub-services */}
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 'bold', color: colors.primary }}>زیرخدمات ({(svc.subServices||[]).length})</Typography>
                        <Button size="small" onClick={() => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: [...(s.subServices||[]), { name: 'زیرخدمت جدید', description: '', image: '', link: '', features: [], visible: true }] } : s) }))}
                          sx={{ color: colors.gold, fontSize: '0.72rem', fontWeight: 'bold', p: 0, minWidth: 0 }}>+ افزودن</Button>
                      </Box>
                      {(svc.subServices||[]).map((sub, j) => (
                        <Box key={j} sx={{ bgcolor: 'rgba(197,165,108,0.04)', borderRadius: '14px', p: 2, mb: 1.5, border: '1px solid rgba(197,165,108,0.12)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: colors.primary }}>زیرخدمت {j + 1}</Typography>
                            <IconButton size="small" onClick={() => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: s.subServices.filter((_, idx) => idx !== j) } : s) }))}
                              sx={{ color: '#ff6b6b', p: 0.3 }}>
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <TextField value={sub.name} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: s.subServices.map((sb, idx) => idx === j ? { ...sb, name: e.target.value } : sb) } : s) }))} label="نام" size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <TextField value={sub.description || ''} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: s.subServices.map((sb, idx) => idx === j ? { ...sb, description: e.target.value } : sb) } : s) }))} label="توضیحات" size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <TextField value={sub.link || ''} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: s.subServices.map((sb, idx) => idx === j ? { ...sb, link: e.target.value } : sb) } : s) }))} label="لینک (اختیاری)" size="small" fullWidth placeholder="/services/..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <TextField value={(sub.features||[]).join(', ')} onChange={(e) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: s.subServices.map((sb, idx) => idx === j ? { ...sb, features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) } : sb) } : s) }))} label="ویژگی‌ها (با ویرگول)" size="small" fullWidth placeholder="ویژگی ۱, ویژگی ۲, ویژگی ۳" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <ImageUploader label="تصویر زیرخدمت (اختیاری)" value={sub.image || ''} onChange={(url) => setServicesData(prev => ({ ...prev, items: prev.items.map(s => s.id === svc.id ? { ...s, subServices: s.subServices.map((sb, idx) => idx === j ? { ...sb, image: url } : sb) } : s) }))} height={80} />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              ))}

              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mt: 3 }}>
                <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2 }}>متون صفحه نمونه کارها</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="عنوان هرو دسکتاپ" value={homeData.portfolioHeroTitle} onChange={(e) => setHomeData(p => ({ ...p, portfolioHeroTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان هرو دسکتاپ" value={homeData.portfolioHeroSubtitle} onChange={(e) => setHomeData(p => ({ ...p, portfolioHeroSubtitle: e.target.value }))} size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="عنوان موبایل" value={homeData.portfolioMobileTitle} onChange={(e) => setHomeData(p => ({ ...p, portfolioMobileTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان موبایل" value={homeData.portfolioMobileSubtitle} onChange={(e) => setHomeData(p => ({ ...p, portfolioMobileSubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="عنوان CTA" value={homeData.portfolioCTATitle} onChange={(e) => setHomeData(p => ({ ...p, portfolioCTATitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان CTA" value={homeData.portfolioCTASubtitle} onChange={(e) => setHomeData(p => ({ ...p, portfolioCTASubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                </Box>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', mt: 3 }}>
                <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 2 }}>متون صفحه مقالات</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="عنوان هرو دسکتاپ" value={homeData.articlesHeroTitle} onChange={(e) => setHomeData(p => ({ ...p, articlesHeroTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="عنوان موبایل" value={homeData.articlesMobileTitle} onChange={(e) => setHomeData(p => ({ ...p, articlesMobileTitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="زیرعنوان موبایل" value={homeData.articlesMobileSubtitle} onChange={(e) => setHomeData(p => ({ ...p, articlesMobileSubtitle: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="برچسب مقالات اصلی" value={homeData.articlesMainSectionLabel} onChange={(e) => setHomeData(p => ({ ...p, articlesMainSectionLabel: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                  <TextField label="برچسب سایر مقالات" value={homeData.articlesNormalSectionLabel} onChange={(e) => setHomeData(p => ({ ...p, articlesNormalSectionLabel: e.target.value }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
                </Box>
              </Paper>
            </Box>
          )}

          {/* INBOX */}
          {tab === 10 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary }}>پیام‌های دریافتی</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: colors.dark, opacity: 0.6 }}>{inboxMessages.length} پیام</Typography>
              </Box>
              {inboxMessages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)' }}>
                  <ContactMailIcon sx={{ fontSize: 48, color: 'rgba(197,165,108,0.3)', mb: 1 }} />
                  <Typography sx={{ color: colors.dark, opacity: 0.5 }}>هنوز پیامی دریافت نشده</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {inboxMessages.map((msg, i) => (
                    <Paper key={msg.key || i} elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', bgcolor: 'white' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                          <Typography dir="auto" sx={{ fontWeight: 'bold', color: colors.primary, fontSize: '1rem', textAlign: 'start' }}>{msg.name || '—'}</Typography>
                          <Typography dir="auto" sx={{ fontSize: '0.78rem', color: colors.gold, textAlign: 'start', unicodeBidi: 'plaintext' }}>{msg.email || ''}{msg.phone ? ` · ${msg.phone}` : ''}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.72rem', color: colors.dark, opacity: 0.5 }}>
                          {msg.receivedAt ? new Date(msg.receivedAt).toLocaleString('fa-IR') : ''}
                        </Typography>
                      </Box>
                      {msg.subject && (
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.88rem', color: colors.primary, mb: 1, textAlign: 'start' }}>
                          موضوع: <Box component="span" dir="auto" sx={{ unicodeBidi: 'isolate' }}>{msg.subject}</Box>
                        </Typography>
                      )}
                      <Typography dir="auto" sx={{ fontSize: '0.88rem', color: colors.dark, lineHeight: 1.8, whiteSpace: 'pre-wrap', unicodeBidi: 'plaintext', textAlign: 'start' }}>{msg.message || ''}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}

        </Box>
      </Box>

      {/* Article Dialog */}
      <Dialog open={articleDialog.open} onClose={() => setArticleDialog({ open: false, data: null })} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl', maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.05rem', color: colors.primary }}>
            {articleDialog.data?.id && articles.find(a => a.id === articleDialog.data?.id) ? 'ویرایش مقاله' : 'مقاله جدید'}
          </Typography>
          <IconButton onClick={() => setArticleDialog({ open: false, data: null })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {articleDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField label="عنوان مقاله" value={articleDialog.data.title}
                onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, title: e.target.value } }))}
                size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } } }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>دسته‌بندی</InputLabel>
                    <Select value={articleDialog.data.category} onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, category: e.target.value } }))} label="دسته‌بندی" sx={{ borderRadius: '12px' }}>
                      {categories.filter(c => c.visible).sort((a, b) => (a.order || 0) - (b.order || 0)).flatMap(c => {
                        const children = (c.children || []).filter(ch => ch.visible).sort((a, b) => (a.order || 0) - (b.order || 0));
                        if (children.length === 0) return [<MenuItem key={c.slug} value={c.slug}>{c.name}</MenuItem>];
                        return [
                          <MenuItem key={c.slug} value={c.slug} sx={{ fontWeight: 'bold' }}>{c.name}</MenuItem>,
                          ...children.map(ch => <MenuItem key={ch.slug} value={ch.slug} sx={{ pr: 4, fontSize: '0.88rem', opacity: 0.85 }}>↳ {ch.name}</MenuItem>)
                        ];
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>وضعیت</InputLabel>
                    <Select value={articleDialog.data.status} onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, status: e.target.value } }))} label="وضعیت" sx={{ borderRadius: '12px' }}>
                      <MenuItem value="published">منتشر شده</MenuItem>
                      <MenuItem value="draft">پیش‌نویس</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>نوع مقاله</InputLabel>
                    <Select value={articleDialog.data.type} onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, type: e.target.value } }))} label="نوع مقاله" sx={{ borderRadius: '12px' }}>
                      <MenuItem value="main">مقاله اصلی ⭐</MenuItem>
                      <MenuItem value="normal">مقاله عادی</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ImageUploader label="تصویر مقاله" value={articleDialog.data.image || ''} onChange={(url) => setArticleDialog(p => ({ ...p, data: { ...p.data, image: url } }))} height={120} />
                  <TextField label="متن جایگزین تصویر (alt) - برای سئو" value={articleDialog.data.imageAlt || ''} onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, imageAlt: e.target.value } }))} size="small" fullWidth placeholder="مثال: طراحی سایت حرفه‌ای برای کسب‌وکار" helperText="این متن توسط موتورهای جستجو برای درک تصویر استفاده می‌شود" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Grid>
              </Grid>
              <Box>
                <TextField
                  label="توضیحات متا (Meta Description) - برای سئو"
                  value={articleDialog.data.metaDescription || ''}
                  onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, metaDescription: e.target.value.slice(0, 160) } }))}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="توضیح کوتاهی که در نتایج گوگل زیر عنوان مقاله نمایش داده می‌شود (حدود ۱۵۰ کاراکتر)"
                  helperText={`${(articleDialog.data.metaDescription || '').length}/160 کاراکتر — اگر خالی بماند، از خلاصه مقاله استفاده می‌شود`}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Box>
              <Box>
                <TextField
                  label="کلمات کلیدی (Keywords) - برای سئو"
                  value={articleDialog.data.keywords || ''}
                  onChange={(e) => setArticleDialog(p => ({ ...p, data: { ...p.data, keywords: e.target.value } }))}
                  size="small"
                  fullWidth
                  placeholder="مثال: طراحی سایت، سئو، فروشگاه اینترنتی، تجارت الکترونیک"
                  helperText="کلمات کلیدی مرتبط با مقاله را با کاما (،) از هم جدا کنید"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.78rem', color: colors.primary, fontWeight: 'bold', mb: 0.8 }}>خلاصه مقاله</Typography>
                <RichTextEditor
                  value={articleDialog.data.intro}
                  onChange={(v) => setArticleDialog(p => ({ ...p, data: { ...p.data, intro: v } }))}
                  placeholder="خلاصه مقاله را اینجا بنویسید... برای لینک دادن به بخشی از متن اصلی، اول در «محتوای کامل مقاله» یک لنگر (Anchor) بسازید و سپس همینجا با # به آن لینک بدهید."
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.78rem', color: colors.primary, fontWeight: 'bold', mb: 0.8 }}>محتوای کامل مقاله</Typography>
                <RichTextEditor
                  value={articleDialog.data.content}
                  onChange={(v) => setArticleDialog(p => ({ ...p, data: { ...p.data, content: v } }))}
                  placeholder="محتوای مقاله را اینجا بنویسید..."
                />
              </Box>

            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setArticleDialog({ open: false, data: null })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={saveArticle} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Portfolio Dialog */}
      <Dialog open={portfolioDialog.open} onClose={() => setPortfolioDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>
            {portfolioDialog.data?.id && portfolio.find(p => p.id === portfolioDialog.data?.id) ? 'ویرایش پروژه' : 'پروژه جدید'}
          </Typography>
          <IconButton onClick={() => setPortfolioDialog({ open: false, data: null })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {portfolioDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField label="عنوان پروژه" value={portfolioDialog.data.title} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, title: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>دسته‌بندی</InputLabel>
                    <Select value={portfolioDialog.data.category} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, category: e.target.value } }))} label="دسته‌بندی" sx={{ borderRadius: '12px' }}>
                      {['programming', 'graphic', 'marketing'].map(c => <MenuItem key={c} value={c}>{c === 'programming' ? 'برنامه نویسی' : c === 'graphic' ? 'گرافیک' : 'مارکتینگ'}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField label="سال" value={portfolioDialog.data.year} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, year: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField label="نام مشتری" value={portfolioDialog.data.client || ''} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, client: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField label="مدت پروژه" value={portfolioDialog.data.duration || ''} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, duration: e.target.value } }))} size="small" fullWidth placeholder="مثال: ۳ ماه" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Grid>
              </Grid>
              <TextField label="لینک پروژه (اختیاری)" value={portfolioDialog.data.url || ''} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, url: e.target.value } }))} size="small" fullWidth placeholder="https://..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <Box sx={{ bgcolor: 'rgba(197,165,108,0.06)', borderRadius: '12px', px: 1.5, py: 0.5 }}>
                <FormControlLabel
                  control={<Switch checked={!!portfolioDialog.data.showPreview} disabled={!portfolioDialog.data.url} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, showPreview: e.target.checked } }))} />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>نمایش پیش‌نمایش زنده‌ی سایت در صفحه نمونه‌کارها</Typography>}
                />
                <Typography sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.55, pr: 1, pb: 0.5 }}>
                  {portfolioDialog.data.url ? 'اگر روشن باشد، سایت داخل یک تب «پیش‌نمایش زنده» نمایش داده می‌شود.' : 'ابتدا لینک پروژه را وارد کنید.'}
                </Typography>
              </Box>
              <TextField label="توضیحات پروژه" value={portfolioDialog.data.description || ''} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, description: e.target.value } }))} size="small" fullWidth multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="ویژگی‌های کلیدی (با ویرگول جدا کنید)" value={(portfolioDialog.data.features || []).join(', ')} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) } }))} size="small" fullWidth placeholder="مثال: طراحی ریسپانسیو, پنل مدیریت, سئو" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <ImageUploader label="تصویر پروژه" value={portfolioDialog.data.image || ''} onChange={(url) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, image: url } }))} height={140} />
              <TextField label="تگ‌ها (با ویرگول جدا کنید)" value={(portfolioDialog.data.tags || []).join(', ')} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 'bold', color: colors.primary, mb: 1 }}>ویدیو معرفی پروژه (اختیاری)</Typography>
                <TextField label="عنوان ویدیو (اختیاری)" value={portfolioDialog.data.videoTitle || ''} onChange={(e) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, videoTitle: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, mb: 1.5 }} />
                <VideoUploader label="آپلود ویدیو" value={portfolioDialog.data.videoUrl || ''} onChange={(url) => setPortfolioDialog(p => ({ ...p, data: { ...p.data, videoUrl: url } }))} hint="MP4, WEBM — حداکثر ۲۰۰ مگابایت" />
              </Box>

            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setPortfolioDialog({ open: false, data: null })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={savePortfolio} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Banner Dialog */}
      <Dialog open={bannerDialog.open} onClose={() => setBannerDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>
            {bannerDialog.data?.id && homeData.banners.find(b => b.id === bannerDialog.data?.id) ? 'ویرایش بنر' : 'بنر جدید'}
          </Typography>
          <IconButton onClick={() => setBannerDialog({ open: false, data: null })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {bannerDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <ImageUploader label="تصویر بنر" value={bannerDialog.data.image || ''} onChange={(url) => setBannerDialog(p => ({ ...p, data: { ...p.data, image: url } }))} height={120} hint="JPG, PNG, WEBP" />
              <TextField label="لینک بنر (اختیاری)" placeholder="https://example.com" value={bannerDialog.data.link || ''} onChange={(e) => setBannerDialog(p => ({ ...p, data: { ...p.data, link: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <FormControlLabel control={<Switch checked={bannerDialog.data.active} onChange={(e) => setBannerDialog(p => ({ ...p, data: { ...p.data, active: e.target.checked } }))} />} label="بنر فعال باشد" />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setBannerDialog({ open: false, data: null })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={saveBanner} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Section Image Dialog */}
      <Dialog open={sectionImageDialog.open} onClose={() => setSectionImageDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>
            {sectionImageDialog.data?.id ? 'ویرایش تصویر' : 'تصویر جدید'}
          </Typography>
          <IconButton onClick={() => setSectionImageDialog({ open: false, data: null })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {sectionImageDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <ImageUploader label="تصویر" value={sectionImageDialog.data.src || ''} onChange={(url) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, src: url } }))} height={150} />
              <TextField label="متن جایگزین تصویر (alt) - برای سئو" value={sectionImageDialog.data.alt || ''} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, alt: e.target.value } }))} size="small" fullWidth placeholder="مثال: نمای ساختمان اداری آبان در تهران" helperText="این متن توسط موتورهای جستجو برای درک تصویر استفاده می‌شود" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="عنوان" value={sectionImageDialog.data.title} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, title: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="توضیح کوتاه" value={sectionImageDialog.data.description || ''} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, description: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="توضیحات کامل" value={sectionImageDialog.data.details || ''} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, details: e.target.value } }))} size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><TextField label="دسته‌بندی" value={sectionImageDialog.data.category || ''} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, category: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                <Grid size={{ xs: 6 }}><TextField label="سال" value={sectionImageDialog.data.date || ''} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, date: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                <Grid size={{ xs: 6 }}><TextField label="امتیاز" value={sectionImageDialog.data.rating || ''} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, rating: e.target.value } }))} size="small" fullWidth placeholder="۴.۹ از ۵" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                <Grid size={{ xs: 6 }}><TextField label="ترتیب" type="number" value={sectionImageDialog.data.order} onChange={(e) => setSectionImageDialog(p => ({ ...p, data: { ...p.data, order: parseInt(e.target.value) || 0 } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setSectionImageDialog({ open: false, data: null })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={saveSectionImage} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Home Section Dialog */}
      <Dialog open={homeSectionDialog.open} onClose={() => setHomeSectionDialog({ open: false, data: null, isNew: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: colors.primary }}>
          {homeSectionDialog.isNew ? 'بخش جدید صفحه اصلی' : 'ویرایش بخش'}
          <IconButton onClick={() => setHomeSectionDialog({ open: false, data: null, isNew: false })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        {homeSectionDialog.data && (
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField label="شناسه (انگلیسی)" value={homeSectionDialog.data.sectionKey} disabled={!homeSectionDialog.isNew}
                  onChange={(e) => setHomeSectionDialog(p => ({ ...p, data: { ...p.data, sectionKey: e.target.value.trim().toLowerCase() } }))}
                  size="small" fullWidth helperText={homeSectionDialog.isNew ? 'مثل services یا my-section (بعداً قابل تغییر نیست)' : 'شناسه ثابت است'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'monospace' } }} />
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>نوع</InputLabel>
                  <Select label="نوع" value={homeSectionDialog.data.type}
                    onChange={(e) => setHomeSectionDialog(p => ({ ...p, data: { ...p.data, type: e.target.value } }))}
                    sx={{ borderRadius: '10px' }}>
                    <MenuItem value="hero">هیرو (تمام‌صفحه)</MenuItem>
                    <MenuItem value="card">کارت + گالری</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TextField label="عنوان" value={homeSectionDialog.data.title}
                onChange={(e) => setHomeSectionDialog(p => ({ ...p, data: { ...p.data, title: e.target.value } }))}
                size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              <TextField label="زیرعنوان" value={homeSectionDialog.data.subtitle || ''}
                onChange={(e) => setHomeSectionDialog(p => ({ ...p, data: { ...p.data, subtitle: e.target.value } }))}
                size="small" fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

              {/* Buttons editor */}
              <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(197,165,108,0.05)', border: '1px dashed rgba(197,165,108,0.3)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: colors.primary }}>دکمه‌ها و لینک‌ها</Typography>
                  <Button onClick={addDialogButton} startIcon={<AddIcon />} size="small" sx={{ color: colors.gold, fontWeight: 'bold' }}>افزودن دکمه</Button>
                </Box>
                {(homeSectionDialog.data.buttons || []).length === 0 && (
                  <Typography sx={{ fontSize: '0.72rem', color: colors.dark, opacity: 0.5, textAlign: 'center', py: 1 }}>بدون دکمه</Typography>
                )}
                {(homeSectionDialog.data.buttons || []).map((btn, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <TextField label="متن" value={btn.text} onChange={(e) => updateDialogButton(i, 'text', e.target.value)} size="small" sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                    <TextField label="لینک" value={btn.link} onChange={(e) => updateDialogButton(i, 'link', e.target.value)} size="small" placeholder="/about یا https://..." sx={{ flex: 1.4, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.8rem' } }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 16, color: colors.gold }} /></InputAdornment> }} />
                    <FormControl size="small" sx={{ minWidth: 96 }}>
                      <Select value={btn.variant || 'contained'} onChange={(e) => updateDialogButton(i, 'variant', e.target.value)} sx={{ borderRadius: '10px', fontSize: '0.78rem' }}>
                        <MenuItem value="contained">پُر</MenuItem>
                        <MenuItem value="outlined">حاشیه‌ای</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton size="small" onClick={() => removeDialogButton(i)} sx={{ color: '#ff6b6b' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                  </Box>
                ))}
              </Box>

              <FormControlLabel
                control={<Switch checked={homeSectionDialog.data.visible} onChange={(e) => setHomeSectionDialog(p => ({ ...p, data: { ...p.data, visible: e.target.checked } }))} />}
                label="نمایش در سایت" />
              {homeSectionDialog.data.type === 'card' && (
                <Typography sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.55 }}>
                  💡 تصاویر گالری این بخش از تب «تصاویر صفحه اصلی» (با همین شناسه) مدیریت می‌شوند.
                </Typography>
              )}
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setHomeSectionDialog({ open: false, data: null, isNew: false })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={saveHomeSection} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialog.open} onClose={() => setCategoryDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>
            {categoryDialog.data?.id ? 'ویرایش دسته‌بندی' : categoryDialog.data?.parentId ? 'زیردسته جدید' : 'دسته‌بندی جدید'}
          </Typography>
          <IconButton onClick={() => setCategoryDialog({ open: false, data: null })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {categoryDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField label="نام دسته‌بندی" value={categoryDialog.data.name}
                onChange={(e) => setCategoryDialog(p => ({ ...p, data: { ...p.data, name: e.target.value, slug: e.target.value.replace(/\s+/g, '-') } }))}
                size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="شناسه (slug)" value={categoryDialog.data.slug}
                onChange={(e) => setCategoryDialog(p => ({ ...p, data: { ...p.data, slug: e.target.value } }))}
                size="small" fullWidth helperText="فقط حروف انگلیسی و خط تیره"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="ترتیب" type="number" value={categoryDialog.data.order}
                onChange={(e) => setCategoryDialog(p => ({ ...p, data: { ...p.data, order: parseInt(e.target.value) || 0 } }))}
                size="small" sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <FormControlLabel control={<Switch checked={categoryDialog.data.visible} onChange={(e) => setCategoryDialog(p => ({ ...p, data: { ...p.data, visible: e.target.checked } }))} />} label="نمایش در سایت" />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setCategoryDialog({ open: false, data: null })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={saveCategory} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Sub Company Dialog */}
      <Dialog open={subCompanyDialog.open} onClose={() => setSubCompanyDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', direction: 'rtl' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', color: colors.primary }}>
            {subCompanyDialog.data?.id ? 'ویرایش شرکت' : 'شرکت جدید'}
          </Typography>
          <IconButton onClick={() => setSubCompanyDialog({ open: false, data: null })} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {subCompanyDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField label="نام شرکت" value={subCompanyDialog.data.name} onChange={(e) => setSubCompanyDialog(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="آدرس سایت" value={subCompanyDialog.data.url} onChange={(e) => setSubCompanyDialog(p => ({ ...p, data: { ...p.data, url: e.target.value } }))} size="small" fullWidth placeholder="https://example.com"
                InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon sx={{ fontSize: 16, color: colors.gold }} /></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <ImageUploader label="لوگوی شرکت" value={subCompanyDialog.data.logo || ''} onChange={(url) => setSubCompanyDialog(p => ({ ...p, data: { ...p.data, logo: url } }))} height={100} hint="PNG با پس‌زمینه شفاف توصیه می‌شود" />
              <TextField label="ترتیب نمایش" type="number" value={subCompanyDialog.data.order} onChange={(e) => setSubCompanyDialog(p => ({ ...p, data: { ...p.data, order: parseInt(e.target.value) } }))} size="small" sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <FormControlLabel control={<Switch checked={subCompanyDialog.data.visible} onChange={(e) => setSubCompanyDialog(p => ({ ...p, data: { ...p.data, visible: e.target.checked } }))} />} label="نمایش در سایت" />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setSubCompanyDialog({ open: false, data: null })} sx={{ borderRadius: '12px' }}>لغو</Button>
          <Button onClick={saveSubCompany} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '12px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>ذخیره</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))} severity={snackbar.severity} sx={{ borderRadius: '14px' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}