'use client';

import { Box, Container, Typography, Grid, Paper, Card, CardContent, Chip, Button } from '@mui/material';
import { linkProps } from '../../lib/linkProps';
import { colors } from '../../theme/theme';
import { useEffect, useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { MobilePageLayout } from '../../components/MobileApp';
import { contentApi } from '../../lib/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [expandedService, setExpandedService] = useState(null);
  const [servicesData, setServicesData] = useState(null);

  useEffect(() => {
    setMounted(true);
    contentApi.getAll().then(data => {
      if (data?.services_data) {
        setServicesData(data.services_data);
      }
    }).catch(() => {});
  }, []);

  const handleExpand = (index) => {
    setExpandedService(expandedService === index ? null : index);
  };

  const services = servicesData?.items?.filter(s => s.visible) || [];
  const heroTitle = servicesData?.heroTitle || 'خدمات ما';
  const heroSubtitle = servicesData?.heroSubtitle || 'راه‌حل‌های جامع دیجیتال برای رشد کسب‌وکار شما';
  const mobileTitle = servicesData?.mobileTitle || 'خدمات ما';
  const mobileSubtitle = servicesData?.mobileSubtitle || 'راه‌حل‌های دیجیتال جامع برای کسب‌وکار شما';
  const ctaTitle = servicesData?.ctaTitle || 'آماده شروع پروژه شما هستیم';
  const ctaSubtitle = servicesData?.ctaSubtitle || 'برای مشاوره رایگان و دریافت قیمت با ما تماس بگیرید';
  const mobileCTATitle = servicesData?.mobileCTATitle || 'مشاوره رایگان';
  const mobileCTASubtitle = servicesData?.mobileCTASubtitle || 'همین امروز با ما در تماس باشید';
  const ctaLink = servicesData?.ctaLink || '/contact';
  const ctaLink2 = servicesData?.ctaLink2 || '/portfolio';

  if (!mounted) return null;

  return (
    <>
    {/* Mobile */}
    <MobilePageLayout title={mobileTitle} subtitle={mobileSubtitle}>
      {services.map((svc, i) => (
        <Box key={i} sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, mb: 2, border: '1px solid rgba(197,165,108,0.12)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s', '&:active': { transform: 'scale(0.98)' } }} onClick={() => handleExpand(i)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: expandedService === i ? 2 : 0 }}>
            {/* Image or fallback */}
            <Box sx={{ width: 52, height: 52, borderRadius: '16px', bgcolor: 'rgba(197,165,108,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {svc.image
                ? <Box component="img" src={svc.image} alt={svc.title} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
                : <Box sx={{ fontSize: 24 }}>⚡</Box>
              }
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.primary }}>{svc.title}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: colors.dark, opacity: 0.6, mt: 0.3 }}>{(svc.description || '').slice(0, 50)}...</Typography>
            </Box>
            <Box sx={{ color: colors.gold, fontSize: 20 }}>{expandedService === i ? '−' : '+'}</Box>
          </Box>
          {expandedService === i && (
            <Box sx={{ borderTop: '1px solid rgba(197,165,108,0.1)', pt: 2 }}>
              <Typography sx={{ fontSize: '0.82rem', color: colors.dark, lineHeight: 1.8, mb: 2, opacity: 0.8 }}>{svc.description}</Typography>

              {/* Sub-services as full cards — matches desktop detail level */}
              {svc.subServices && svc.subServices.filter(s => s.visible !== false).length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                  {svc.subServices.filter(s => s.visible !== false).map((sub, j) => (
                    <Box key={j} sx={{ bgcolor: 'rgba(197,165,108,0.06)', borderRadius: '16px', border: '1px solid rgba(197,165,108,0.15)', p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: sub.description || (sub.features && sub.features.length > 0) ? 1.5 : 0 }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: '10px', overflow: 'hidden', bgcolor: sub.image ? 'transparent' : `rgba(197,165,108,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {sub.image
                            ? <Box component="img" src={sub.image} alt={sub.name} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
                            : <Box sx={{ fontSize: 16 }}>✦</Box>
                          }
                        </Box>
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 'bold', color: colors.primary }}>{sub.name}</Typography>
                      </Box>
                      {sub.description && (
                        <Typography sx={{ fontSize: '0.78rem', color: colors.dark, lineHeight: 1.7, opacity: 0.75, mb: sub.features && sub.features.length > 0 ? 1 : 0 }}>
                          {sub.description}
                        </Typography>
                      )}
                      {sub.features && sub.features.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                          {sub.features.map((feature, fIdx) => (
                            <Box key={fIdx} sx={{ bgcolor: 'rgba(197,165,108,0.12)', px: 1.5, py: 0.4, borderRadius: '20px' }}>
                              <Typography sx={{ fontSize: '0.68rem', color: colors.primary, fontWeight: '500' }}>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      {sub.link && (
                        <Button component="a" {...linkProps(sub.link)} size="small"
                          sx={{ mt: 1, color: colors.gold, fontWeight: 'bold', fontSize: '0.72rem', p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                          اطلاعات بیشتر ←
                        </Button>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {svc.link && (
                <Button component="a" {...linkProps(svc.link)} variant="contained" size="small"
                  sx={{ mt: 1, bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  صفحه اختصاصی
                </Button>
              )}
            </Box>
          )}
        </Box>
      ))}
      <Box sx={{ bgcolor: colors.primary, borderRadius: '24px', p: 3, textAlign: 'center', mt: 1 }}>
        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.05rem', mb: 1 }}>{mobileCTATitle}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', mb: 2 }}>{mobileCTASubtitle}</Typography>
        <Button component="a" {...linkProps(ctaLink)} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', px: 4, fontWeight: 'bold' }}>شروع کنید</Button>
      </Box>
    </MobilePageLayout>

    {/* Desktop */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
    <PageWrapper>
      <Box sx={{ minHeight: '100vh', background: colors.background, pt: { xs: '120px', sm: '140px', md: '240px', lg: '256px' }, pb: { xs: 8, md: 12 } }}>

        {/* Hero */}
        <Container maxWidth="lg" sx={{ mb: { xs: 5, md: 7 } }}>
          <Box sx={{ position: 'relative', py: { xs: 4, sm: 5, md: 7 }, px: { xs: 3, sm: 4, md: 6 }, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}DD 100%)`, borderRadius: { xs: '24px', sm: '30px', md: '40px' }, overflow: 'hidden', textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }, fontWeight: 'bold', color: 'white', mb: 2, animation: mounted ? 'fadeInDown 0.6s ease-out' : 'none' }}>
              {heroTitle}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }, color: 'rgba(255,255,255,0.9)', maxWidth: '700px', mx: 'auto', lineHeight: 1.8, animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none' }}>
              {heroSubtitle}
            </Typography>
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          </Box>
        </Container>

        <Container maxWidth="lg">
          {/* Services Grid */}
          <Grid container spacing={{ xs: 3, sm: 3, md: 4 }} sx={{ mb: { xs: 5, sm: 6, md: 8 }, flexWrap: { xs: 'wrap', sm: 'wrap', md: services.length > 3 ? 'wrap' : 'nowrap' } }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={services.length > 3 ? 6 : 4} key={service.id || index}>
                <Box sx={{ animation: mounted ? `fadeInUp ${0.3 + index * 0.1}s ease-out` : 'none', height: '100%' }}>
                  <Paper elevation={0} onClick={() => handleExpand(index)}
                    sx={{ p: 3, borderRadius: '30px', background: `linear-gradient(135deg, white 0%, ${colors.background} 100%)`, border: `2px solid ${expandedService === index ? colors.gold : 'rgba(197,165,108,0.2)'}`, transition: 'all 0.3s ease', cursor: 'pointer', height: '100%',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderColor: colors.gold },
                    }}>
                    {/* Service image or icon box */}
                    <Box sx={{ width: 80, height: 80, borderRadius: '25px', overflow: 'hidden', background: service.image ? 'transparent' : `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.gold}05 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                      {service.image
                        ? <Box component="img" src={service.image} alt={service.title} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
                        : <Box sx={{ fontSize: 36 }}>⚡</Box>
                      }
                    </Box>
                    <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, mb: 1.5 }}>
                      {service.title}
                    </Typography>
                    <Typography sx={{ color: colors.dark, fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.8, mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.gold, mt: 2 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>مشاهده جزئیات</Typography>
                      {expandedService === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Sub-services expanded */}
          {expandedService !== null && services[expandedService] && (
            <Box sx={{ animation: 'slideUp 0.5s ease-out', mb: 6 }}>
              <Box sx={{ background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.primary}02 100%)`, borderRadius: '40px', p: { xs: 3, md: 5 }, border: '1px solid rgba(197,165,108,0.15)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 60, height: 60, borderRadius: '20px', overflow: 'hidden', background: services[expandedService].image ? 'transparent' : `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.gold}10 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {services[expandedService].image
                        ? <Box component="img" src={services[expandedService].image} alt={services[expandedService].title} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
                        : <Box sx={{ fontSize: 28 }}>⚡</Box>
                      }
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', color: colors.gold, fontWeight: 'bold', letterSpacing: 2 }}>خدمات تخصصی</Typography>
                      <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 'bold', color: colors.primary }}>
                        {services[expandedService].title}
                      </Typography>
                    </Box>
                  </Box>
                  {services[expandedService].link && (
                    <Button component="a" {...linkProps(services[expandedService].link)} variant="contained" endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                      sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', px: 3, fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>
                      صفحه اختصاصی
                    </Button>
                  )}
                </Box>

                {/* Sub-services grid */}
                {services[expandedService].subServices && services[expandedService].subServices.length > 0 && (
                  <Grid container spacing={3}>
                    {services[expandedService].subServices.filter(s => s.visible !== false).map((sub, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Card sx={{ borderRadius: '24px', border: '1px solid rgba(197,165,108,0.12)', boxShadow: 'none', transition: 'all 0.3s ease', height: '100%',
                          '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', borderColor: colors.gold },
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              {/* Sub-service image or default */}
                              <Box sx={{ width: 45, height: 45, borderRadius: '14px', overflow: 'hidden', background: sub.image ? 'transparent' : `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.gold}05 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {sub.image
                                  ? <Box component="img" src={sub.image} alt={sub.name} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
                                  : <Box sx={{ fontSize: 20 }}>✦</Box>
                                }
                              </Box>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.primary }}>{sub.name}</Typography>
                            </Box>
                            {sub.description && (
                              <Typography sx={{ fontSize: '0.85rem', color: colors.dark, lineHeight: 1.6, mb: 2, opacity: 0.75 }}>
                                {sub.description}
                              </Typography>
                            )}
                            {sub.features && sub.features.length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {sub.features.map((feature, fIdx) => (
                                  <Chip key={fIdx} label={feature} size="small" sx={{ bgcolor: 'rgba(197,165,108,0.1)', color: colors.primary, fontSize: '0.7rem', borderRadius: '12px' }} />
                                ))}
                              </Box>
                            )}
                            {sub.link && (
                              <Button component="a" {...linkProps(sub.link)} size="small" sx={{ mt: 2, color: colors.gold, fontWeight: 'bold', fontSize: '0.78rem', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                                اطلاعات بیشتر ←
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          )}

          {/* CTA */}
          <Box sx={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}CC 100%)`, borderRadius: { xs: '24px', sm: '30px', md: '40px' }, p: { xs: 3, sm: 4, md: 6 }, textAlign: 'center', animation: mounted ? 'fadeInUp 0.8s ease-out' : 'none', mt: 4 }}>
            <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }, fontWeight: 'bold', color: 'white', mb: 2 }}>
              {ctaTitle}
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', mb: 3, maxWidth: '500px', mx: 'auto' }}>
              {ctaSubtitle}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" {...linkProps(ctaLink)}
                sx={{ bgcolor: 'white', color: colors.primary, px: 4, py: 1.2, fontSize: '0.95rem', borderRadius: '50px', '&:hover': { bgcolor: colors.gold, color: 'white', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}>
                دریافت مشاوره
              </Button>
              <Button variant="outlined" {...linkProps(ctaLink2)}
                sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.2, fontSize: '0.95rem', borderRadius: '50px', '&:hover': { borderColor: colors.gold, bgcolor: colors.gold, color: colors.primary, transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}>
                مشاهده نمونه کارها
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <style jsx global>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </PageWrapper>
    </Box>
    </>
  );
}