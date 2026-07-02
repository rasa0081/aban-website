'use client';

import { Box, Container, Typography, Grid, Paper, TextField, Button, IconButton, Tooltip } from '@mui/material';
import { colors } from '../../theme/theme';
import { useEffect, useState } from 'react';
import { contentApi } from '../../lib/api';
import PageWrapper from '../../components/layout/PageWrapper';
import { MobilePageLayout } from '../../components/MobileApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [contactData, setContactData] = useState({
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳، طبقه ۴',
    phone1: '',
    phone2: '',
    mobile: '',
    email1: 'info@abaan.ir',
    email2: 'support@abaan.ir',
    workHours: `شنبه تا چهارشنبه: ۹ - ۱۸
پنجشنبه: ۹ - ۱۳
جمعه: تعطیل`,
    instagram: 'https://www.instagram.com/aban.ec?igsh=MWJqZGsyc3Zya3F1Mw==',
    linkedin: 'https://www.linkedin.com/in/aban-e-commerce-bb4412415?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    telegram: 'https://t.me/abanagencyg',
    whatsapp: 'https://wa.me/message/JSIPIQGW3NESM1',
  });

  useEffect(() => {
    setMounted(true);
    contentApi.getAll().then(data => {
      setContactData(prev => ({
        address: data.contact_address || prev.address,
        phone1: data.contact_phone1 || prev.phone1,
        phone2: data.contact_phone2 || prev.phone2,
        mobile: data.contact_mobile || prev.mobile,
        email1: data.contact_email1 || prev.email1,
        email2: data.contact_email2 || prev.email2,
        workHours: data.contact_work_hours || prev.workHours,
        instagram: data.contact_instagram || prev.instagram,
        linkedin: data.contact_linkedin || prev.linkedin,
        telegram: data.contact_telegram || prev.telegram,
        whatsapp: data.contact_whatsapp || prev.whatsapp,
      }));
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [copied, setCopied] = useState(null);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for non-secure contexts / older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  const contactInfo = [
    { icon: <LocationOnIcon sx={{ fontSize: 32, color: colors.gold }} />, title: 'آدرس', details: [contactData.address] },
    { icon: <PhoneIcon sx={{ fontSize: 32, color: colors.gold }} />, title: 'تلفن تماس', details: [contactData.phone1, contactData.phone2, contactData.mobile].filter(Boolean), copyable: true },
    { icon: <EmailIcon sx={{ fontSize: 32, color: colors.gold }} />, title: 'ایمیل', details: [contactData.email1, contactData.email2].filter(Boolean), copyable: true },
    { icon: <AccessTimeIcon sx={{ fontSize: 32, color: colors.gold }} />, title: 'ساعت کاری', details: contactData.workHours.split('\n') },
  ];

  const socialLinks = [
    { icon: <InstagramIcon />, url: contactData.instagram, color: '#E4405F', name: 'اینستاگرام' },
    { icon: <LinkedInIcon />, url: contactData.linkedin, color: '#0077B5', name: 'لینکدین' },
    { icon: <TelegramIcon />, url: contactData.telegram, color: '#26A5E4', name: 'تلگرام' },
    { icon: <WhatsAppIcon />, url: contactData.whatsapp, color: '#25D366', name: 'واتساپ' },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
    {/* Mobile */}
    <MobilePageLayout title="تماس با ما" subtitle="ما مشتاق شنیدن نظرات و ایده‌های شما هستیم.">
      {/* Contact cards */}
      {contactInfo.map((item, i) => (
        <Box key={i} sx={{ bgcolor: 'white', borderRadius: '20px', p: 2.5, mb: 2, border: '1px solid rgba(197,165,108,0.12)', display: 'flex', gap: 2, alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: 'rgba(197,165,108,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: colors.primary, mb: 0.5 }}>{item.title}</Typography>
            {item.details.map((d, j) => (
              <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start' }}>
                <Typography dir="auto" sx={{ fontSize: '0.82rem', color: colors.dark, opacity: 0.7, lineHeight: 1.8, unicodeBidi: 'plaintext' }}>{d}</Typography>
                {item.copyable && (
                  <Tooltip title={copied === d ? 'کپی شد' : 'کپی'} placement="top">
                    <IconButton onClick={() => handleCopy(d)} size="small" sx={{ p: 0.3, color: copied === d ? '#4CAF50' : colors.gold }}>
                      {copied === d ? <CheckIcon sx={{ fontSize: 15 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
      {/* Social */}
      <Box sx={{ bgcolor: 'white', borderRadius: '20px', p: 2.5, mb: 3, border: '1px solid rgba(197,165,108,0.12)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: colors.primary, mb: 2 }}>شبکه‌های اجتماعی</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {socialLinks.map(s => (
            <Box key={s.name} component="a" href={s.url} target="_blank"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: `${s.color}15`, px: 2, py: 1, borderRadius: '50px', textDecoration: 'none', border: `1px solid ${s.color}30` }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Typography sx={{ fontSize: '0.78rem', color: colors.primary, fontWeight: '500' }}>{s.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Form */}
      <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, border: '1px solid rgba(197,165,108,0.12)' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: colors.primary, mb: 2.5 }}>ارسال پیام</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[['name','نام و نام خانوادگی','text'],['email','ایمیل','email'],['phone','شماره تماس','tel'],['subject','موضوع','text']].map(([name, label, type]) => (
            <Box key={name} component="input" type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={label} required
              sx={{ width: '100%', p: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(197,165,108,0.2)', bgcolor: 'rgba(197,165,108,0.03)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: colors.primary, direction: 'rtl', boxSizing: 'border-box', '&:focus': { borderColor: colors.gold } }} />
          ))}
          <Box component="textarea" name="message" value={formData.message} onChange={handleChange} placeholder="پیام شما" rows={4} required
            sx={{ width: '100%', p: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(197,165,108,0.2)', bgcolor: 'rgba(197,165,108,0.03)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: colors.primary, direction: 'rtl', resize: 'none', boxSizing: 'border-box', '&:focus': { borderColor: colors.gold } }} />
          <Button type="submit" variant="contained" fullWidth disabled={submitStatus === 'loading'} sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', py: 1.5, fontWeight: 'bold', boxShadow: '0 4px 20px rgba(197,165,108,0.35)', mt: 0.5 }}>
            {submitStatus === 'loading' ? 'در حال ارسال...' : 'ارسال پیام'}
          </Button>
          {submitStatus === 'success' && <Typography sx={{ color: 'green', textAlign: 'center', mt: 1 }}>پیام شما با موفقیت ارسال شد.</Typography>}
          {submitStatus === 'error' && <Typography sx={{ color: 'red', textAlign: 'center', mt: 1 }}>خطا در ارسال پیام. دوباره تلاش کنید.</Typography>}
        </Box>
      </Box>
    </MobilePageLayout>

    {/* Desktop */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
    <PageWrapper>
      <Box
        sx={{
          minHeight: '100vh',
          background: colors.background,
          // INCREASED top padding to clear the navbar
          pt: { xs: '120px', sm: '140px', md: '224px', lg: '264px' },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ mb: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              position: 'relative',
              py: { xs: 3, sm: 4, md: 7 },
              px: { xs: 2.5, sm: 4, md: 6 },
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}DD 100%)`,
              borderRadius: { xs: '24px', sm: '30px', md: '40px' },
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.7rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 'bold',
                color: 'white',
                mb: 1.5,
                animation: mounted ? 'fadeInDown 0.6s ease-out' : 'none',
              }}
            >
              تماس با ما
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.8,
                animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
              }}
            >
              ما مشتاق شنیدن نظرات و ایده‌های شما هستیم. برای همکاری، مشاوره یا هر سوال دیگر با ما در تماس باشید.
            </Typography>
            
            {/* Decorative circles */}
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
          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
            {/* Contact Info Cards */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  animation: mounted ? 'fadeInLeft 0.6s ease-out' : 'none',
                }}
              >
                <Typography
                  sx={{
                    color: colors.gold,
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    letterSpacing: 2,
                    mb: 1,
                  }}
                >
                  اطلاعات تماس
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.6rem', sm: '2rem', md: '2.2rem' },
                    fontWeight: 'bold',
                    color: colors.primary,
                    mb: 3,
                  }}
                >
                  در ارتباط باشید
                </Typography>
                <Typography
                  sx={{
                    color: colors.dark,
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    mb: 4,
                    opacity: 0.85,
                  }}
                >
                  ما همیشه آماده پاسخگویی به سوالات شما هستیم. از راه‌های زیر می‌توانید با ما در ارتباط باشید.
                </Typography>

                {/* Info Cards */}
                {contactInfo.map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      mb: 2.5,
                      borderRadius: '24px',
                      background: 'white',
                      border: '1px solid rgba(197,165,108,0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(-5px)',
                        borderColor: colors.gold,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '15px',
                          background: `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.gold}05 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: colors.primary,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                    {item.details.map((detail, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 7, mb: 0.5 }}>
                        <Typography
                          dir="auto"
                          sx={{
                            fontSize: '0.9rem',
                            color: colors.dark,
                            opacity: 0.75,
                            unicodeBidi: 'plaintext',
                          }}
                        >
                          {detail}
                        </Typography>
                        {item.copyable && (
                          <Tooltip title={copied === detail ? 'کپی شد ✓' : 'کپی'} placement="top">
                            <IconButton onClick={() => handleCopy(detail)} size="small"
                              sx={{ p: 0.4, color: copied === detail ? '#4CAF50' : colors.gold, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(197,165,108,0.12)' } }}>
                              {copied === detail ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 15 }} />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    ))}
                  </Paper>
                ))}

                {/* Social Links */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: colors.primary,
                      mb: 2,
                    }}
                  >
                    شبکه‌های اجتماعی
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {socialLinks.map((social, index) => (
                      <IconButton
                        key={index}
                        href={social.url}
                        target="_blank"
                        sx={{
                          bgcolor: 'white',
                          border: '1px solid rgba(197,165,108,0.2)',
                          color: social.color,
                          width: 45,
                          height: 45,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: social.color,
                            color: 'white',
                            transform: 'translateY(-5px)',
                            borderColor: 'transparent',
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  animation: mounted ? 'fadeInRight 0.6s ease-out' : 'none',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: '30px',
                    background: 'white',
                    border: '1px solid rgba(197,165,108,0.15)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: colors.primary,
                      mb: 0.5,
                    }}
                  >
                    ارسال پیام
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: colors.dark,
                      opacity: 0.7,
                      mb: 3,
                    }}
                  >
                    فرم زیر را پر کنید، در اسرع وقت با شما تماس می‌گیریم
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="name"
                          label="نام و نام خانوادگی"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '15px',
                              '&:hover fieldset': {
                                borderColor: colors.gold,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.gold,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.gold,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="email"
                          label="ایمیل"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '15px',
                              '&:hover fieldset': {
                                borderColor: colors.gold,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.gold,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.gold,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="phone"
                          label="شماره تماس"
                          value={formData.phone}
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '15px',
                              '&:hover fieldset': {
                                borderColor: colors.gold,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.gold,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.gold,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="subject"
                          label="موضوع"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '15px',
                              '&:hover fieldset': {
                                borderColor: colors.gold,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.gold,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.gold,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          name="message"
                          label="پیام شما"
                          multiline
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '15px',
                              '&:hover fieldset': {
                                borderColor: colors.gold,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.gold,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.gold,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          disabled={submitStatus === 'loading'}
                          endIcon={<SendIcon />}
                          sx={{
                            backgroundColor: colors.gold,
                            color: colors.dark,
                            py: 1.5,
                            borderRadius: '15px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: colors.primary,
                              color: 'white',
                              transform: 'translateY(-3px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {submitStatus === 'loading' ? 'در حال ارسال...' : 'ارسال پیام'}
                        </Button>
                        {submitStatus === 'success' && <Typography sx={{ color: 'green', textAlign: 'center', mt: 1 }}>پیام شما با موفقیت ارسال شد.</Typography>}
                        {submitStatus === 'error' && <Typography sx={{ color: 'red', textAlign: 'center', mt: 1 }}>خطا در ارسال پیام. دوباره تلاش کنید.</Typography>}
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* Map Section */}
          <Box
            sx={{
              mt: 8,
              borderRadius: '30px',
              overflow: 'hidden',
              border: '1px solid rgba(197,165,108,0.2)',
              animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.166488433971!2d51.389346!3d35.699751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e014a5d7b9b9b%3A0x8b9b9b9b9b9b9b9b!2sTehran%2C%20Iran!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="دفتر آبان"
            />
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