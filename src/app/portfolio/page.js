'use client';

import { Box, Container, Typography, Grid, Paper, Chip, Button, IconButton, Modal, Fade, Backdrop, Tabs, Tab } from '@mui/material';
import { colors } from '../../theme/theme';
import { portfolioApi } from '../../lib/api';
import { MobilePageLayout } from '../../components/MobileApp';
import { useEffect, useState, useRef } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LaunchIcon from '@mui/icons-material/Launch';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ImageIcon from '@mui/icons-material/Image';

const categories = [
  { id: 'all', label: 'همه' },
  { id: 'programming', label: 'برنامه نویسی' },
  { id: 'graphic', label: 'گرافیک' },
  { id: 'marketing', label: 'مارکتینگ' },
];

// Protected video player — no download, no right-click, custom controls
function ProtectedVideoPlayer({ src, title }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const seek = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
  };

  const formatTime = (s) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ borderRadius: '16px', overflow: 'hidden', bgcolor: '#000', position: 'relative', userSelect: 'none' }}>
      {title && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayCircleIcon sx={{ fontSize: 16, color: colors.gold }} />
          <Typography sx={{ fontSize: '0.82rem', color: 'white', fontWeight: 'bold' }}>{title}</Typography>
        </Box>
      )}
      <video
        ref={videoRef}
        src={src}
        style={{ width: '100%', display: 'block', maxHeight: 320 }}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
      />
      {/* Custom controls */}
      <Box sx={{ bgcolor: 'rgba(12,43,41,0.95)', px: 2, py: 1.5 }}>
        {/* Progress bar */}
        <Box
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            if (videoRef.current) videoRef.current.currentTime = ratio * duration;
          }}
          sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, mb: 1.5, cursor: 'pointer', position: 'relative' }}
        >
          <Box sx={{ height: '100%', width: `${duration ? (currentTime / duration) * 100 : 0}%`, bgcolor: colors.gold, borderRadius: 2, transition: 'width 0.1s linear' }} />
        </Box>
        {/* Buttons row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => seek(-10)} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: colors.gold } }}>
            <Box component="span" sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}>−10s</Box>
          </IconButton>
          <IconButton onClick={togglePlay} size="small"
            sx={{ bgcolor: colors.gold, color: colors.dark, '&:hover': { bgcolor: 'white' }, width: 34, height: 34 }}>
            {playing
              ? <Box component="span" sx={{ fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: 1 }}>▐▐</Box>
              : <Box component="span" sx={{ fontSize: '0.6rem', fontWeight: 'bold', pl: '2px' }}>▶</Box>
            }
          </IconButton>
          <IconButton onClick={() => seek(10)} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: colors.gold } }}>
            <Box component="span" sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}>+10s</Box>
          </IconButton>
          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', ml: 'auto' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTab, setModalTab] = useState('info');

  useEffect(() => {
    setMounted(true);
    portfolioApi.getAll().then(data => {
      if (Array.isArray(data)) {
        setProjects(data.filter(p => p.visible));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const openProject = (proj) => {
    setSelectedProject(proj);
    setModalTab('info');
  };

  if (!mounted) return null;

  return (
    <>
    {/* Mobile */}
    <MobilePageLayout title="نمونه کارها" subtitle="پروژه‌های موفق ما در حوزه‌های مختلف دیجیتال">
      {/* Category filter */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 3, '&::-webkit-scrollbar': { display: 'none' } }}>
        {categories.map(cat => (
          <Box key={cat.id} onClick={() => setActiveCategory(cat.id)}
            sx={{ px: 2.5, py: 0.8, borderRadius: '50px', flexShrink: 0, cursor: 'pointer', bgcolor: activeCategory === cat.id ? colors.gold : 'white', color: activeCategory === cat.id ? colors.dark : colors.primary, border: '1px solid', borderColor: activeCategory === cat.id ? colors.gold : 'rgba(197,165,108,0.2)', fontWeight: activeCategory === cat.id ? 'bold' : '400', fontSize: '0.8rem', transition: 'all 0.2s' }}>
            {cat.label}
          </Box>
        ))}
      </Box>
      {/* Projects grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
        {filtered.map((proj) => (
          <Box key={proj.id} onClick={() => openProject(proj)}
            sx={{ borderRadius: '20px', overflow: 'hidden', bgcolor: 'white', border: '1px solid rgba(197,165,108,0.12)', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s', '&:active': { transform: 'scale(0.97)' } }}>
            <Box sx={{ position: 'relative' }}>
              <Box component="img" src={proj.image} alt={proj.title} sx={{ width: '100%', height: 110, objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
              {proj.videoUrl && (
                <Box sx={{ position: 'absolute', top: 6, left: 6, bgcolor: 'rgba(197,165,108,0.9)', borderRadius: '6px', px: 0.8, py: 0.2, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <PlayCircleIcon sx={{ fontSize: 11, color: colors.dark }} />
                  <Typography sx={{ fontSize: '0.55rem', color: colors.dark, fontWeight: 'bold' }}>ویدیو</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ p: 1.5 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.78rem', color: colors.primary, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.title}</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: colors.gold }}>{proj.year}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </MobilePageLayout>

    {/* Desktop */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
    <PageWrapper>
      <Box sx={{ minHeight: '100vh', background: colors.background, pt: { xs: '120px', sm: '140px', md: '208px', lg: '240px' }, pb: { xs: 8, md: 12 } }}>

        {/* Hero */}
        <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 7 } }}>
          <Box sx={{ position: 'relative', py: { xs: 4, sm: 5, md: 7 }, px: { xs: 3, sm: 4, md: 6 }, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}DD 100%)`, borderRadius: { xs: '24px', sm: '32px', md: '40px' }, overflow: 'hidden', textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', sm: '2rem', md: '3rem', lg: '3.5rem' }, fontWeight: 'bold', color: 'white', mb: 2 }}>
              نمونه کارها
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' }, color: 'rgba(255,255,255,0.9)', maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
              مجموعه‌ای از پروژه‌های موفق ما در حوزه‌های مختلف طراحی وب، اپلیکیشن و برندینگ
            </Typography>
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          </Box>
        </Container>

        <Container maxWidth="lg">
          {/* Category Filter */}
          <Box sx={{ display: 'flex', gap: { xs: 0.8, sm: 1, md: 1.5 }, flexWrap: 'wrap', justifyContent: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
            {categories.map(cat => (
              <Button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                variant={activeCategory === cat.id ? 'contained' : 'outlined'}
                size="small"
                sx={{
                  borderRadius: '50px',
                  px: { xs: 2, sm: 2.5, md: 3 },
                  py: { xs: 0.7, sm: 0.8, md: 1 },
                  fontSize: { xs: '0.78rem', sm: '0.85rem', md: '0.9rem' },
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  ...(activeCategory === cat.id ? {
                    bgcolor: colors.gold, color: colors.dark, borderColor: colors.gold,
                    boxShadow: `0 4px 15px rgba(197,165,108,0.4)`,
                    '&:hover': { bgcolor: colors.primary, color: 'white', borderColor: colors.primary },
                  } : {
                    borderColor: `rgba(197,165,108,0.4)`, color: colors.primary,
                    '&:hover': { borderColor: colors.gold, bgcolor: 'rgba(197,165,108,0.08)' },
                  }),
                }}
              >
                {cat.label}
              </Button>
            ))}
          </Box>

          {/* Projects Grid */}
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {filtered.map((project, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Box
                  sx={{ animation: `fadeInUp ${0.2 + index * 0.08}s ease-out`, height: '100%' }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Paper
                    elevation={0}
                    onClick={() => openProject(project)}
                    sx={{
                      borderRadius: { xs: '18px', sm: '20px', md: '24px' },
                      overflow: 'hidden',
                      border: '1px solid rgba(197,165,108,0.15)',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 24px 50px rgba(0,0,0,0.13)', borderColor: colors.gold },
                    }}
                  >
                    {/* Image */}
                    <Box sx={{ position: 'relative', height: { xs: 180, sm: 200, md: 220 }, overflow: 'hidden' }}>
                      <Box component="img" src={project.image} alt={project.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec', transition: 'transform 0.5s ease', transform: hoveredId === project.id ? 'scale(1.08)' : 'scale(1)' }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: hoveredId === project.id ? 'rgba(12,43,41,0.45)' : 'rgba(0,0,0,0)', transition: 'all 0.35s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {hoveredId === project.id && (
                          <Box sx={{ bgcolor: colors.gold, color: colors.dark, px: 2.5, py: 1, borderRadius: '50px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <OpenInNewIcon sx={{ fontSize: 16 }} /> مشاهده پروژه
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', color: 'white', px: 1.5, py: 0.4, borderRadius: '20px', fontSize: '0.7rem' }}>
                        {project.year}
                      </Box>
                      {project.videoUrl && (
                        <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: colors.gold, color: colors.dark, px: 1.2, py: 0.4, borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.4 }}>
                          <PlayCircleIcon sx={{ fontSize: 13 }} /> ویدیو
                        </Box>
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: { xs: 2, sm: 2, md: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1.05rem' }, color: colors.primary, mb: 1, lineHeight: 1.4 }}>
                        {project.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: colors.dark, opacity: 0.7, lineHeight: 1.6, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mt: 'auto' }}>
                        {(project.tags || []).map(tag => (
                          <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(197,165,108,0.1)', color: colors.primary, fontSize: '0.68rem', borderRadius: '10px', height: 24 }} />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* CTA */}
          <Box sx={{ mt: { xs: 6, sm: 8, md: 10 }, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}CC 100%)`, borderRadius: { xs: '28px', sm: '32px', md: '40px' }, p: { xs: 3, sm: 4, md: 6 }, textAlign: 'center' }}>
            <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem', md: '2rem' }, fontWeight: 'bold', color: 'white', mb: 1.5 }}>
              پروژه‌ای در ذهن دارید؟
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.88rem', sm: '0.95rem', md: '1rem' }, color: 'rgba(255,255,255,0.85)', mb: 3, maxWidth: '500px', mx: 'auto' }}>
              بیایید با هم ایده شما را به یک محصول دیجیتال عالی تبدیل کنیم
            </Typography>
            <Button variant="contained" href="/contact"
              sx={{ bgcolor: colors.gold, color: colors.dark, px: { xs: 3, sm: 4, md: 5 }, py: { xs: 1.2, md: 1.5 }, fontSize: { xs: '0.88rem', md: '1rem' }, fontWeight: 'bold', borderRadius: '50px', '&:hover': { bgcolor: 'white', transform: 'translateY(-3px)' }, transition: 'all 0.3s' }}>
              شروع همکاری
            </Button>
          </Box>
        </Container>
      </Box>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageWrapper>
    </Box>

    {/* Project Detail Modal — shared between mobile & desktop */}
    <Modal open={!!selectedProject} onClose={() => setSelectedProject(null)} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 300 } }}>
        <Fade in={!!selectedProject}>
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', display: 'flex', alignItems: { xs: 'flex-end', md: 'center' }, justifyContent: 'center', p: { xs: 0, md: 2 }, zIndex: 1300 }}>
          <Box sx={{ width: { xs: '100%', sm: '85vw', md: '720px' }, maxHeight: { xs: '92vh', md: '92vh' }, overflowY: 'auto', bgcolor: 'white', borderRadius: { xs: '24px 24px 0 0', md: '30px' }, boxShadow: '0 30px 80px rgba(0,0,0,0.25)', outline: 'none', position: 'relative' }}>
            {selectedProject && (
              <>
                <Box sx={{ position: 'relative', height: { xs: 200, sm: 240, md: 300 } }}>
                  <Box component="img" src={selectedProject.image} alt={selectedProject.title} sx={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f2f0ec', borderRadius: { xs: '24px 24px 0 0', md: '30px 30px 0 0' } }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)', borderRadius: { xs: '24px 24px 0 0', md: '30px 30px 0 0' } }} />
                  <IconButton onClick={() => setSelectedProject(null)} sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: colors.gold } }}>
                    <CloseIcon />
                  </IconButton>
                  {selectedProject.videoUrl && (
                    <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
                      <Chip
                        icon={<PlayCircleIcon sx={{ fontSize: 14, color: colors.dark }} />}
                        label="دارای ویدیو"
                        size="small"
                        sx={{ bgcolor: colors.gold, color: colors.dark, fontWeight: 'bold', fontSize: '0.7rem' }}
                      />
                    </Box>
                  )}
                </Box>

                {(selectedProject.videoUrl || (selectedProject.url && selectedProject.showPreview)) && (
                  <Box sx={{ borderBottom: '1px solid rgba(197,165,108,0.15)', px: { xs: 2, md: 3 } }}>
                    <Tabs value={modalTab} onChange={(_, v) => setModalTab(v)} variant="scrollable" scrollButtons={false} sx={{
                      '& .MuiTab-root': { fontSize: '0.85rem', fontWeight: 'bold', color: colors.primary, minHeight: 48 },
                      '& .Mui-selected': { color: colors.gold },
                      '& .MuiTabs-indicator': { bgcolor: colors.gold },
                    }}>
                      <Tab value="info" label="اطلاعات" icon={<ImageIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                      {selectedProject.url && selectedProject.showPreview && (
                        <Tab value="preview" label="پیش‌نمایش زنده" icon={<OpenInNewIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                      )}
                      {selectedProject.videoUrl && (
                        <Tab value="video" label="ویدیو" icon={<PlayCircleIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                      )}
                    </Tabs>
                  </Box>
                )}

                <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  {(modalTab === 'info' || (!selectedProject.videoUrl && !(selectedProject.url && selectedProject.showPreview))) && (
                    <>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary, mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } }}>
                        {selectedProject.title}
                      </Typography>
                      {selectedProject.description && (
                        <Typography sx={{ color: colors.dark, lineHeight: 1.8, mb: 3, fontSize: { xs: '0.88rem', md: '0.95rem' }, opacity: 0.85 }}>
                          {selectedProject.description}
                        </Typography>
                      )}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        {[
                          { label: 'مشتری', value: selectedProject.client },
                          { label: 'مدت پروژه', value: selectedProject.duration },
                          { label: 'سال', value: selectedProject.year },
                        ].filter(i => i.value).map(item => (
                          <Grid size={{ xs: 4 }} key={item.label}>
                            <Box sx={{ bgcolor: 'rgba(197,165,108,0.08)', borderRadius: '16px', p: { xs: 1, md: 1.5 }, textAlign: 'center' }}>
                              <Typography sx={{ fontSize: '0.65rem', color: colors.gold, mb: 0.3 }}>{item.label}</Typography>
                              <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.82rem' }, fontWeight: 'bold', color: colors.primary }}>{item.value}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      {selectedProject.features && selectedProject.features.length > 0 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 1.5, fontSize: '1rem' }}>ویژگی‌های کلیدی</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {selectedProject.features.map(f => (
                              <Chip key={f} label={f} sx={{ bgcolor: `rgba(197,165,108,0.12)`, color: colors.primary, fontWeight: 'bold', borderRadius: '12px' }} />
                            ))}
                          </Box>
                        </>
                      )}
                      {selectedProject.tags && selectedProject.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                          {selectedProject.tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderColor: colors.gold, color: colors.primary, borderRadius: '10px' }} />
                          ))}
                        </Box>
                      )}
                      {selectedProject.url && (
                        <Button variant="contained" endIcon={<LaunchIcon />} href={selectedProject.url} target="_blank" rel="noopener noreferrer"
                          sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', px: 4, py: 1.2, fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>
                          مشاهده پروژه زنده
                        </Button>
                      )}
                    </>
                  )}

                  {modalTab === 'preview' && selectedProject.url && selectedProject.showPreview && (
                    <Box>
                      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, bgcolor: '#f1f1f1', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                          <Box sx={{ display: 'flex', gap: 0.6, flexShrink: 0 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f57' }} />
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#febc2e' }} />
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#28c840' }} />
                          </Box>
                          <Box dir="ltr" sx={{ flex: 1, bgcolor: 'white', borderRadius: '8px', px: 1.5, py: 0.4, fontSize: '0.7rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedProject.url}
                          </Box>
                        </Box>
                        <Box sx={{ position: 'relative', width: '100%', height: { xs: 380, sm: 440, md: 480 }, bgcolor: '#fff' }}>
                          <Box component="iframe" src={selectedProject.url} title={selectedProject.title}
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            sx={{ width: '100%', height: '100%', border: 'none', display: 'block',
                              touchAction: 'auto',
                              WebkitOverflowScrolling: 'touch',
                            }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
                        <Button variant="contained" endIcon={<LaunchIcon />} href={selectedProject.url} target="_blank" rel="noopener noreferrer"
                          sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '50px', px: 4, py: 1.2, fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>
                          باز کردن سایت در تب جدید
                        </Button>
                      </Box>
                      <Typography sx={{ mt: 1.5, fontSize: '0.72rem', color: colors.dark, opacity: 0.5, textAlign: 'center', lineHeight: 1.7 }}>
                        اگر پیش‌نمایش بارگذاری نشد، آن سایت اجازه‌ی نمایش داخل iframe را نمی‌دهد؛ از دکمه‌ی بالا برای باز کردن استفاده کنید.
                      </Typography>
                    </Box>
                  )}

                  {modalTab === 'video' && selectedProject.videoUrl && (
                    <Box>
                      <ProtectedVideoPlayer src={selectedProject.videoUrl} title={selectedProject.videoTitle || selectedProject.title} />
                      <Typography sx={{ mt: 2, fontSize: '0.75rem', color: colors.dark, opacity: 0.5, textAlign: 'center' }}>
                        این ویدیو محافظت شده است و قابل دانلود نیست.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
          </Box>
        </Fade>
      </Modal>
    </>

  );
}