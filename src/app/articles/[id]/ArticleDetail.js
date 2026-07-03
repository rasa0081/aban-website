'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Chip, CircularProgress, Divider,
} from '@mui/material';
import { colors } from '../../../theme/theme';
import PageWrapper from '../../../components/layout/PageWrapper';
import { MobilePageLayout } from '../../../components/MobileApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ArticleDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // ── Fetch category display name ─────────────────────────────────────────
  useEffect(() => {
    if (!article?.category) return;
    fetch('/api/categories', { cache: 'no-store' })
      .then(r => r.json())
      .then(cats => {
        if (!Array.isArray(cats)) return;
        const match = cats.find(c => c.slug === article.category)
          || cats.flatMap(c => c.children || []).find(c => c.slug === article.category);
        setCategoryName(match ? match.name : article.category);
      })
      .catch(() => setCategoryName(article.category));
  }, [article?.category]);

  // ── Fetch article ─────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    if (!id) return;
    fetch(`/api/articles/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (data && !data.error) {
          setArticle(data);
          fetch(`/api/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, views: (data.views || 0) + 1 }),
          }).catch(() => {});
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  // ── Link click handler ────────────────────────────────────────────────────
  useEffect(() => {
    if (!article) return;

    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      if (!anchor.closest('.article-content')) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      if (href.startsWith('#')) {
        const id = href.slice(1);
        const all = document.querySelectorAll('[id="' + id + '"]');
        const target = Array.from(all).find(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) || all[all.length - 1];
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (href.startsWith('http') || href.startsWith('//')) {
        try {
          const url = new URL(href);
          if (url.hostname === window.location.hostname) {
            router.push(url.pathname + url.search + url.hash);
          } else {
            window.open(href, '_blank', 'noopener,noreferrer');
          }
        } catch (_) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      router.push(href);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [article, router]);

  // ── Strip target="_blank" from anchor links in saved HTML ─────────────────
  const fixContent = (html) => {
    if (!html) return html;
    let out = html.replace(/<a([^>]*)>/g, (match, attrs) => {
      const href = (attrs.match(/href="([^"]*)"/) || [])[1] || '';
      if (href.startsWith('#')) {
        const cleaned = attrs
          .replace(/\s*target="[^"]*"/g, '')
          .replace(/\s*rel="[^"]*"/g, '');
        return `<a${cleaned}>`;
      }
      return match;
    });

    out = out.replace(/<(p|h1|h2|h3|h4|h5|h6|li|blockquote|td|th|div)([^>]*)>/g, (match, tag, attrs) => {
      let cleanedAttrs = attrs
        .replace(/\s*dir="[^"]*"/g, '')
        .replace(/(style="[^"]*?)direction\s*:\s*ltr\s*;?/g, '$1');
      return `<${tag}${cleanedAttrs} dir="rtl">`;
    });

    out = out.split(/(<[^>]+>|&[a-zA-Z][a-zA-Z0-9]*;|&#[0-9]+;|&#x[0-9a-fA-F]+;)/g).map(part => {
      if (part.startsWith('<') || part.startsWith('&')) return part;
      return part.replace(/[A-Za-z0-9][A-Za-z0-9\s.,:;!?()%/_@+#-]*[A-Za-z0-9%]|[A-Za-z0-9]/g,
        (run) => `<span dir="ltr" style="unicode-bidi:isolate">${run}</span>`);
    }).join('');

    out = out.replace(/font-family\s*:\s*("[^"]*"|'[^']*'|[^;"}]*)\s*;?/gi, '');

    return out;
  };

  if (!mounted) return null;

  const contentSx = {
    fontFamily: 'Veno, Roboto, Arial, sans-serif',
    lineHeight: 2,
    '& *': { fontFamily: 'inherit !important' },
    '& p': { mb: 2 },
    '& h1': { fontWeight: 'bold', color: colors.primary, mb: 1.5, mt: 3, fontSize: '2rem' },
    '& h2': { fontWeight: 'bold', color: colors.primary, mb: 1.5, mt: 3, fontSize: '1.6rem' },
    '& h3': { fontWeight: 'bold', color: colors.primary, mb: 1.5, mt: 3, fontSize: '1.35rem' },
    '& h4': { fontWeight: 'bold', color: colors.primary, mb: 1.5, mt: 3, fontSize: '1.15rem' },
    '& h5': { fontWeight: 'bold', color: colors.primary, mb: 1.5, mt: 3, fontSize: '1rem' },
    '& h6': { fontWeight: 'bold', color: colors.gold, mb: 1.5, mt: 3, fontSize: '0.9rem', letterSpacing: '0.05em' },
    '& ul,& ol': { pr: 2.5, mb: 2 },
    '& li': { mb: 0.5 },
    '& img': { maxWidth: '100%', borderRadius: '12px', my: 2 },
    '& a': { color: colors.gold, textDecoration: 'underline', cursor: 'pointer' },
    '& blockquote': { borderRight: `4px solid ${colors.gold}`, pr: 2, my: 2, opacity: 0.8, fontStyle: 'italic' },
    '& pre': { bgcolor: '#1e1e1e', color: '#d4d4d4', p: 2, borderRadius: '8px', overflow: 'auto', mb: 2 },
    '& code': { bgcolor: 'rgba(0,0,0,0.06)', px: 0.5, borderRadius: '4px', fontSize: '0.9em' },
    '& table': { borderCollapse: 'collapse', width: '100%', mb: 2 },
    '& td, & th': { border: `1px solid rgba(197,165,108,0.3)`, p: '8px 12px', textAlign: 'right' },
    '& th': { bgcolor: `rgba(197,165,108,0.1)`, fontWeight: 'bold' },
    '& hr': { border: 'none', borderTop: `2px solid rgba(197,165,108,0.3)`, my: 3 },
    '& iframe': { maxWidth: '100%', borderRadius: '12px', my: 2 },
  };

  if (loading) return (
    <>
      <MobilePageLayout title="مقاله" subtitle="">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: colors.gold }} />
        </Box>
      </MobilePageLayout>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PageWrapper>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress sx={{ color: colors.gold }} />
          </Box>
        </PageWrapper>
      </Box>
    </>
  );

  if (notFound || !article) return (
    <>
      <MobilePageLayout title="مقاله" subtitle="">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontSize: '3rem', mb: 2 }}>😕</Typography>
          <Typography sx={{ fontWeight: 'bold', color: colors.primary, mb: 1 }}>مقاله پیدا نشد</Typography>
          <Typography sx={{ color: colors.dark, opacity: 0.6, mb: 3 }}>این مقاله وجود ندارد یا حذف شده است.</Typography>
          <Box component="button" onClick={() => router.push('/articles')}
            sx={{ bgcolor: colors.gold, color: colors.dark, border: 'none', borderRadius: '50px', px: 3, py: 1.5, fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
            بازگشت به مقالات
          </Box>
        </Box>
      </MobilePageLayout>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PageWrapper>
          <Box sx={{ minHeight: '100vh', background: colors.background, pt: { md: '256px', lg: '272px' }, pb: { md: 12 } }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>😕</Typography>
                <Typography sx={{ fontWeight: 'bold', color: colors.primary, fontSize: '1.5rem', mb: 1 }}>مقاله پیدا نشد</Typography>
                <Typography sx={{ color: colors.dark, opacity: 0.6, mb: 3 }}>این مقاله وجود ندارد یا حذف شده است.</Typography>
                <Box component="button" onClick={() => router.push('/articles')}
                  sx={{ bgcolor: colors.gold, color: colors.dark, border: 'none', borderRadius: '50px', px: 3, py: 1.5, fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                  بازگشت به مقالات
                </Box>
              </Box>
            </Container>
          </Box>
        </PageWrapper>
      </Box>
    </>
  );

  const body = (isMobile) => (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Box onClick={() => router.push('/articles')}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: colors.gold, mb: 3, fontWeight: 'bold', fontSize: '0.9rem', '&:hover': { opacity: 0.8 } }}>
        <ArrowForwardIcon sx={{ fontSize: 18 }} />
        بازگشت به مقالات
      </Box>

      {article.category && (
        <Chip label={categoryName || article.category} size="small"
          sx={{ bgcolor: `${colors.gold}20`, color: colors.gold, fontWeight: 'bold', mb: 2, fontSize: '0.78rem' }} />
      )}

      <Typography variant="h1"
        sx={{ fontSize: isMobile ? '1.4rem' : '2.2rem', fontWeight: 'bold', color: colors.primary, lineHeight: 1.5, mb: 2 }}>
        {article.title}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        {article.date && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.dark, opacity: 0.6 }}>
            <CalendarTodayIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: '0.8rem' }}>{article.date}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.dark, opacity: 0.6 }}>
          <VisibilityIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: '0.8rem' }}>{(article.views || 0).toLocaleString('fa-IR')} بازدید</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: `${colors.gold}30` }} />

      {article.intro && (
        <Box
          className="article-content"
          sx={{
            fontFamily: 'Veno, Roboto, Arial, sans-serif',
            fontSize: isMobile ? '1rem' : '1.1rem', color: colors.primary, fontWeight: 'bold', lineHeight: 1.9, mb: 3, p: 2.5, borderRadius: '16px', bgcolor: `${colors.gold}10`, borderRight: `4px solid ${colors.gold}`,
            '& *': { fontFamily: 'inherit !important' },
            '& p': { m: 0 },
            '& a': { color: colors.gold, textDecoration: 'underline', cursor: 'pointer' },
          }}
          dangerouslySetInnerHTML={{ __html: fixContent(article.intro) }}
        />
      )}

      {article.content && (
        <Box
          className="article-content"
          sx={{
            ...contentSx,
            fontSize: article.fontSize || 16,
            color: article.fontColor || colors.dark,
            fontWeight: article.isBold ? 'bold' : 600,
            fontStyle: article.isItalic ? 'italic' : 'normal',
          }}
          dangerouslySetInnerHTML={{ __html: fixContent(article.content) }}
        />
      )}
    </Box>
  );

  return (
    <>
      <MobilePageLayout title="مقاله" subtitle={article.title || ''}>
        {body(true)}
      </MobilePageLayout>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PageWrapper>
          <Box sx={{ minHeight: '100vh', background: colors.background, pt: { md: '256px', lg: '272px' }, pb: { md: 12 } }}>
            <Container maxWidth="lg">
              {body(false)}
            </Container>
          </Box>
        </PageWrapper>
      </Box>
    </>
  );
}