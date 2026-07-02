'use client';

import { Box, Container, Typography, IconButton, Tooltip } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { colors } from '../../theme/theme';
import Link from 'next/link';
import SubCompanySlider from './SubCompanySlider';

export default function Footer() {
  const navLinks = [
    { name: 'صفحه اصلی', path: '/' },
    { name: 'خدمات', path: '/services' },
    { name: 'نمونه کارها', path: '/portfolio' },
    { name: 'مقالات', path: '/articles' },
    { name: 'تماس با ما', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <InstagramIcon sx={{ fontSize: 18 }} />, url: 'https://www.instagram.com/aban.ec?igsh=MWJqZGsyc3Zya3F1Mw==', name: 'اینستاگرام' },
    { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, url: 'https://www.linkedin.com/in/aban-e-commerce-bb4412415?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', name: 'لینکدین' },
    { icon: <TelegramIcon sx={{ fontSize: 18 }} />, url: 'https://t.me/abanagency', name: 'تلگرام' },
    { icon: <WhatsAppIcon sx={{ fontSize: 18 }} />, url: 'https://wa.me/message/JSIPIQGW3NESM1', name: 'واتساپ' },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: colors.dark, color: 'white', borderTop: `1px solid rgba(197,165,108,0.15)`, direction: 'rtl' }}>
      <Container maxWidth="lg">

        {/* Sub companies — top center */}
        <Box sx={{ py: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SubCompanySlider />
        </Box>

        {/* Main footer row */}
        <Box sx={{
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 3,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Brand */}
          <Box>
            <Typography sx={{ color: colors.gold, fontWeight: 'bold', fontSize: '1.3rem', lineHeight: 1 }}>آبان</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', mt: 0.5 }}>آژانس تجارت الکترونیک</Typography>
          </Box>

          {/* Nav links */}
          <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flexWrap: 'wrap', justifyContent: 'center' }}>
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} style={{ textDecoration: 'none' }}>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.82rem',
                  transition: 'color 0.2s',
                  '&:hover': { color: colors.gold },
                  cursor: 'pointer',
                }}>
                  {link.name}
                </Typography>
              </Link>
            ))}
          </Box>

          {/* Social icons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {socialLinks.map((s) => (
              <Tooltip key={s.name} title={s.name} arrow>
                <IconButton href={s.url} target="_blank" size="small"
                  sx={{ color: 'rgba(255,255,255,0.45)', '&:hover': { color: colors.gold, bgcolor: 'rgba(197,165,108,0.1)' }, transition: 'all 0.2s' }}>
                  {s.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem' }}>
            طراحی و توسعه توسط آژانس تجارت الکترونیک آبان
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem' }}>
            © {new Date().getFullYear()} تمامی حقوق محفوظ است
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}