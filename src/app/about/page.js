'use client';

import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { colors } from '../../theme/theme';
import { useEffect, useState, useRef } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { MobilePageLayout } from '../../components/MobileApp';
import { contentApi } from '../../lib/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const goldTopRef = useRef(null);
  const goldBottomRef = useRef(null);
  const blackCapsuleRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll animation for the logo - SLOW and completes ONLY at the very bottom
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = documentHeight - windowHeight;
      
      let progress = 0;
      if (maxScroll > 0) {
        progress = scrollY / maxScroll;
      }
      
      progress = Math.min(1, Math.max(0, progress));
      
      const slowEase = (t) => {
        if (t < 0.7) {
          return Math.pow(t / 0.7, 1.5) * 0.3;
        }
        const remaining = (t - 0.7) / 0.3;
        return 0.3 + (Math.pow(remaining, 0.8) * 0.7);
      };
      
      const eased = Math.min(1, Math.max(0, slowEase(progress)));
      setScrollProgress(eased);
      
      if (goldTopRef.current) {
        const tx = -120 + (120 * eased);
        const ty = -100 + (100 * eased);
        const rot = -20 + (20 * eased);
        const opacity = 0.5 + (0.5 * eased);
        goldTopRef.current.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        goldTopRef.current.style.opacity = opacity;
      }
      
      if (goldBottomRef.current) {
        const tx = 120 - (120 * eased);
        const ty = 100 - (100 * eased);
        const rot = 20 - (20 * eased);
        const opacity = 0.5 + (0.5 * eased);
        goldBottomRef.current.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        goldBottomRef.current.style.opacity = opacity;
      }
      
      if (blackCapsuleRef.current) {
        const scale = 0.5 + (0.5 * eased);
        const transY = 60 - (60 * eased);
        const opacity = 0.6 + (0.4 * eased);
        blackCapsuleRef.current.style.transform = `scale(${scale}) translateY(${transY}px)`;
        blackCapsuleRef.current.style.opacity = opacity;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const [aboutContent, setAboutContent] = useState({
    heroTitle: 'درباره آبان',
    heroSubtitle: 'ما تیمی از متخصصان خلاق و با تجربه هستیم که به دنبال خلق تجربه‌های دیجیتال منحصر‌به‌فرد برای کسب‌وکارها هستیم.',
    missionTitle: 'تحول دیجیتال کسب‌وکارها',
    missionText: 'در آبان، ما به دنبال ایجاد تحول دیجیتال در کسب‌وکارها هستیم. با ترکیب خلاقیت، تکنولوژی و تجربه، راه‌حل‌های منحصر‌به‌فردی ارائه می‌دهیم.',
    missionLabel: 'مأموریت ما',
    whyTitle: 'چرا آبان؟',
    whyItems: ['تیم متخصص و با تجربه', 'رویکرد مشتری‌محور', 'استفاده از آخرین تکنولوژی‌ها', 'پشتیبانی ۲۴/۷', 'تحویل به‌موقع پروژه‌ها'],
    qualityTags: ['خلاقیت', 'نوآوری', 'کیفیت', 'حرفه‌ای‌گری'],
    valuesLabel: 'ارزش‌های ما',
    valuesHeading: 'اصولی که به آنها باور داریم',
    ctaTitle: 'آماده همکاری با ما هستید؟',
    ctaSubtitle: 'بیایید با هم ایده‌های بزرگ را به واقعیت تبدیل کنیم',
    stats: [
      { number: '۸+', label: 'سال تجربه' },
      { number: '۱۵۰+', label: 'پروژه موفق' },
      { number: '۵۰+', label: 'تیم متخصص' },
    ],
    values: [
      { title: 'کیفیت', description: 'ما به کیفیت کار خود افتخار می‌کنیم.' },
      { title: 'نوآوری', description: 'همیشه به دنبال راه‌های جدید هستیم.' },
      { title: 'اعتماد', description: 'اعتماد مشتریان مهمترین سرمایه ماست.' },
      { title: 'تعهد', description: 'به تعهدات خود پایبند هستیم.' },
    ],
  });

  const statsIcons = [
    <EmojiEventsIcon sx={{ fontSize: 40, color: colors.gold }} />,
    <RocketLaunchIcon sx={{ fontSize: 40, color: colors.gold }} />,
    <GroupsIcon sx={{ fontSize: 40, color: colors.gold }} />,
  ];

  const stats = aboutContent.stats.map((s, i) => ({ ...s, icon: statsIcons[i] }));
  const values = aboutContent.values;

  useEffect(() => {
    contentApi.getAll().then(data => {
      setAboutContent(prev => ({
        heroTitle: data.about_hero_title || prev.heroTitle,
        heroSubtitle: data.about_hero_subtitle || prev.heroSubtitle,
        missionTitle: data.about_mission_title || prev.missionTitle,
        missionText: data.about_mission_text || prev.missionText,
        missionLabel: data.about_mission_label || prev.missionLabel,
        whyTitle: data.about_why_title || prev.whyTitle,
        whyItems: data.about_why_items || prev.whyItems,
        qualityTags: data.about_quality_tags || prev.qualityTags,
        valuesLabel: data.about_values_label || prev.valuesLabel,
        valuesHeading: data.about_values_heading || prev.valuesHeading,
        ctaTitle: data.about_cta_title || prev.ctaTitle,
        ctaSubtitle: data.about_cta_subtitle || prev.ctaSubtitle,
        stats: data.about_stats || prev.stats,
        values: data.about_values || prev.values,
      }));
    }).catch(() => {});
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
    {/* Mobile */}
    <MobilePageLayout title={aboutContent.heroTitle} subtitle={aboutContent.heroSubtitle}>
      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {stats.map((stat, i) => (
          <Box key={i} sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <Box sx={{ mb: 0.5 }}>{stat.icon}</Box>
            <Typography sx={{ fontSize: '1.4rem', fontWeight: 'bold', color: colors.primary }}>{stat.number}</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: colors.dark, opacity: 0.6 }}>{stat.label}</Typography>
          </Box>
        ))}
      </Box>
      {/* Mission */}
      <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, mb: 2.5, border: '1px solid rgba(197,165,108,0.12)' }}>
        <Typography component="p" sx={{ color: colors.gold, fontSize: '0.65rem', letterSpacing: '0.15em', mb: 1 }}>ماموریت ما</Typography>
        <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: colors.primary, mb: 1.5 }}>{aboutContent.missionTitle}</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: colors.dark, lineHeight: 1.8, opacity: 0.8 }}>
          در آبان، ما به دنبال ایجاد تحول دیجیتال در کسب‌وکارها هستیم. با ترکیب خلاقیت، تکنولوژی و تجربه، راه‌حل‌های منحصر‌به‌فردی ارائه می‌دهیم.
        </Typography>
      </Box>
      {/* Values */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '1rem', color: colors.primary, mb: 2 }}>ارزش‌های ما</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {values.map((v, i) => (
            <Box key={i} sx={{ bgcolor: 'white', borderRadius: '18px', p: 2, border: '1px solid rgba(197,165,108,0.12)' }}>
              {v.icon && (
                <Box component="img" src={v.icon} alt={v.title} sx={{ width: 32, height: 32, objectFit: 'contain', mb: 0.5 }} />
              )}
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: colors.primary, mb: 0.5 }}>{v.title}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: colors.dark, opacity: 0.65, lineHeight: 1.6 }}>{v.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* CTA */}
      <Box sx={{ bgcolor: colors.primary, borderRadius: '24px', p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', mb: 1 }}>آماده همکاری هستید؟</Typography>
        <Button component="a" href="/contact" variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', px: 4, fontWeight: 'bold', mt: 1 }}>تماس با ما</Button>
      </Box>
    </MobilePageLayout>

    {/* Desktop */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
    <PageWrapper>
      <Box
        sx={{
          minHeight: '150vh',
          background: colors.background,
          pt: { xs: '128px', sm: '140px', md: '224px', lg: '240px' },
          pb: { xs: 12, md: 15 },
          position: 'relative',
        }}
      >
        {/* Animated Logo - Fixed on the RIGHT side */}
        <Box
          sx={{
            position: 'fixed',
            right: { xs: '-80px', sm: '-40px', md: '20px', lg: '50px' },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            display: { xs: 'none', sm: 'none', md: 'block' },
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '154px',
              height: '256px',
              backgroundColor: 'transparent',
              borderRadius: '1.5rem',
            }}
          >
            {/* Top-Left Gold Shape */}
            <Box
              ref={goldTopRef}
              sx={{
                position: 'absolute',
                width: '102px',
                height: '179px',
                backgroundColor: '#bfa36a',
                top: 0,
                left: 0,
                borderRadius: '51px 51px 0 51px',
                boxShadow: 'inset -2px -2px 8px rgba(0,0,0,0.2), inset 2px 2px 12px rgba(255,245,190,0.6)',
                transition: 'transform 0.08s linear, opacity 0.08s linear',
              }}
            />
            
            {/* Bottom-Right Gold Shape */}
            <Box
              ref={goldBottomRef}
              sx={{
                position: 'absolute',
                width: '102px',
                height: '179px',
                backgroundColor: '#bfa36a',
                bottom: 0,
                right: 0,
                borderRadius: '0 51px 51px 51px',
                boxShadow: 'inset -2px -2px 8px rgba(0,0,0,0.2), inset 2px 2px 12px rgba(255,245,190,0.5)',
                transition: 'transform 0.08s linear, opacity 0.08s linear',
              }}
            />
            
            {/* Central Capsule - Matching main page background */}
            <Box
              ref={blackCapsuleRef}
              sx={{
                position: 'absolute',
                width: '56px',
                height: '205px',
                backgroundColor: colors.background,
                top: '25px',
                left: '49px',
                borderRadius: '28px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingBottom: '15px',
                zIndex: 2,
                boxShadow: '0 0 0 1px rgba(191,163,106,0.25), inset 0 4px 8px rgba(255,255,255,0.05), 8px 12px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.08s linear, opacity 0.08s linear',
              }}
            >
              {/* Gold Dot */}
              <Box
                sx={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#bfa36a',
                  borderRadius: '50%',
                  boxShadow: scrollProgress > 0.95 ? '0 0 20px rgba(191,163,106,0.9)' : '0 0 8px rgba(191,163,106,0.7)',
                  transition: 'box-shadow 0.2s ease',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              position: 'relative',
              py: { xs: 3.5, sm: 4, md: 8 },
              px: { xs: 3, sm: 4, md: 6 },
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}DD 100%)`,
              borderRadius: { xs: '24px', sm: '30px', md: '40px' },
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.6rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                animation: mounted ? 'fadeInDown 0.6s ease-out' : 'none',
              }}
            >
              {aboutContent.heroTitle}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
                animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
              }}
            >
              {aboutContent.heroSubtitle}
            </Typography>
            
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                pointerEvents: 'none',
              }}
            />
          </Box>
        </Container>

        <Container maxWidth="lg">
          {/* Mission Section */}
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center" sx={{ mb: { xs: 5, sm: 6, md: 10 } }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ animation: mounted ? 'fadeInLeft 0.6s ease-out' : 'none' }}>
                <Typography sx={{ color: colors.gold, fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: 2, mb: 1 }}>
                  {aboutContent.missionLabel || 'مأموریت ما'}
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', sm: '2rem', md: '2.2rem' }, fontWeight: 'bold', color: colors.primary, mb: 2 }}>
                  {aboutContent.missionTitle}
                </Typography>
                <Typography sx={{ color: colors.dark, lineHeight: 1.8, fontSize: '0.95rem', mb: 3, opacity: 0.85 }}>
                  {aboutContent.missionText}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {(Array.isArray(aboutContent.qualityTags)
                    ? aboutContent.qualityTags
                    : typeof aboutContent.qualityTags === 'string'
                      ? aboutContent.qualityTags.split(',').map(s => s.trim()).filter(Boolean)
                      : ['خلاقیت', 'نوآوری', 'کیفیت', 'حرفه‌ای‌گری']
                  ).map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(197,165,108,0.1)', px: 1.5, py: 0.6, borderRadius: '20px' }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: colors.gold }} />
                      <Typography sx={{ fontSize: '0.8rem', color: colors.primary }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.primary}02 100%)`, borderRadius: '30px', p: { xs: 3, md: 4 }, border: '1px solid rgba(197,165,108,0.2)', animation: mounted ? 'fadeInRight 0.6s ease-out' : 'none' }}>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.3rem', md: '1.5rem' }, fontWeight: 'bold', color: colors.primary, mb: 2, textAlign: 'center' }}>
                  {aboutContent.whyTitle || 'چرا آبان؟'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {(Array.isArray(aboutContent.whyItems)
                    ? aboutContent.whyItems
                    : typeof aboutContent.whyItems === 'string'
                      ? aboutContent.whyItems.split('\n').map(s => s.trim()).filter(Boolean)
                      : ['تیم متخصص و با تجربه', 'رویکرد مشتری‌محور', 'استفاده از آخرین تکنولوژی‌ها', 'پشتیبانی ۲۴/۷', 'تحویل به‌موقع پروژه‌ها']
                  ).map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: colors.gold }} />
                      <Typography sx={{ color: colors.dark, fontSize: '0.9rem' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Stats Section */}
          <Box sx={{ py: { xs: 5, md: 6 }, mb: { xs: 6, md: 8 }, background: `linear-gradient(135deg, ${colors.primary}05 0%, transparent 100%)`, borderRadius: '30px' }}>
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Box sx={{ textAlign: 'center', p: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                    <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                    <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 'bold', color: colors.primary, mb: 0.5 }}>
                      {stat.number}
                    </Typography>
                    <Typography sx={{ color: colors.dark, fontSize: '0.9rem', opacity: 0.7 }}>{stat.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Values Section */}
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography sx={{ textAlign: 'center', color: colors.gold, fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: 2, mb: 1 }}>
              {aboutContent.valuesLabel || 'ارزش‌های ما'}
            </Typography>
            <Typography variant="h2" sx={{ textAlign: 'center', fontSize: { xs: '1.6rem', sm: '2rem', md: '2.2rem' }, fontWeight: 'bold', color: colors.primary, mb: 4 }}>
              {aboutContent.valuesHeading || 'اصولی که به آنها باور داریم'}
            </Typography>
            <Grid container spacing={3}>
              {values.map((value, index) => (
                <Grid size={{ xs: 12, sm: 6, md: values.length <= 3 ? 4 : 3 }} key={index}>
                  <Paper elevation={0} sx={{ p: 2.5, textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px solid rgba(197,165,108,0.15)', transition: 'all 0.3s ease', height: '100%', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderColor: colors.gold } }}>
                    {value.icon && (
                      <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.gold}05 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, overflow: 'hidden' }}>
                        <Box component="img" src={value.icon} alt={value.title} sx={{ width: '68%', height: '68%', objectFit: 'contain' }} />
                      </Box>
                    )}
                    <Typography variant="h4" sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.primary, mb: 1 }}>{value.title}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: colors.dark, lineHeight: 1.6, opacity: 0.7 }}>{value.description}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box sx={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}CC 100%)`, borderRadius: '30px', p: { xs: 3, md: 5 }, textAlign: 'center', animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none', mb: 4 }}>
            <Typography variant="h5" sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' }, fontWeight: 'bold', color: 'white', mb: 1.5 }}>
              {aboutContent.ctaTitle || 'آماده همکاری با ما هستید؟'}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', mb: 3, maxWidth: '500px', mx: 'auto' }}>
              {aboutContent.ctaSubtitle || 'بیایید با هم ایده‌های بزرگ را به واقعیت تبدیل کنیم'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" href="/contact" sx={{ bgcolor: 'white', color: colors.primary, px: 3.5, py: 1.2, fontSize: '0.9rem', '&:hover': { bgcolor: colors.gold, color: 'white', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}>
                تماس با ما
              </Button>
              <Button variant="outlined" href="/portfolio" sx={{ borderColor: 'white', color: 'white', px: 3.5, py: 1.2, fontSize: '0.9rem', '&:hover': { borderColor: colors.gold, bgcolor: colors.gold, color: colors.primary, transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}>
                مشاهده نمونه کارها
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </PageWrapper>
    </Box>
    </>
  );
}