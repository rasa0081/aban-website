'use client';

import { Box, Container, Typography, Grid, Paper, Card, CardMedia, CardContent, Chip, TextField, InputAdornment, Collapse, List, ListItem, ListItemText, ListItemIcon, IconButton, Pagination, Skeleton, Button, useMediaQuery, useTheme, Divider } from '@mui/material';
import { colors } from '../../theme/theme';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '../../components/layout/PageWrapper';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// Strip HTML tags for plain-text previews (intro is now rich HTML)
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Calculate estimated read time based on word count (Persian avg ~130 words/min)
const calculateReadTime = (intro, content) => {
  const text = stripHtml(intro) + ' ' + stripHtml(content);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 130));
  const persianDigits = (n) => n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  return `${persianDigits(minutes)} دقیقه`;
};

// Look up a category's display name (and any nested children) by its slug
const findCategoryInTree = (items, slug) => {
  for (const item of items) {
    if (item.id === slug) return item;
    if (item.children) {
      const found = findCategoryInTree(item.children, slug);
      if (found) return found;
    }
  }
  return null;
};
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { ARTICLE_TYPES, articleConfig } from '../../constants/articles';
import { MobilePageLayout } from '../../components/MobileApp';
import { articlesApi, categoriesApi } from '../../lib/api';

export default function ArticlesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openCategories, setOpenCategories] = useState({});
  const [articlesData, setArticlesData] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Tree structure data for categories
  const [categoriesTree, setCategoriesTree] = useState([]);

  useEffect(() => {
    categoriesApi.getAll().then(data => {
      if (Array.isArray(data)) {
        // Map DB fields to page format
        const mapped = data
          .filter(c => c.visible)
          .map(c => ({
            id: c.slug,
            name: c.name,
            icon: null,
            count: 0,
            order: c.order || 0,
            children: (c.children || []).filter(ch => ch.visible).map(ch => ({ id: ch.slug, name: ch.name, count: 0, order: ch.order || 0 })),
          }));
        setCategoriesTree(mapped);
      }
    }).catch(() => {});
  }, []);

  // Sort categories by recency: whichever category most recently received a
  // new article shows up first. Categories with no articles yet fall back to
  // their `order` field and go after every category that does have articles.
  // Also compute the real article count per category (was hardcoded to 0).
  const sortedCategoriesTree = (() => {
    const countForSlug = (slug) => articlesData.filter(a => a.category === slug).length;
    const latestForSlug = (slug) => {
      let latest = null;
      articlesData.forEach(a => {
        if (a.category === slug) {
          const t = new Date(a.createdAt || 0).getTime();
          if (latest === null || t > latest) latest = t;
        }
      });
      return latest;
    };
    const withCounts = categoriesTree.map(cat => {
      const childCounts = (cat.children || []).map(ch => ({ ...ch, count: countForSlug(ch.id) }));
      const totalChildCount = childCounts.reduce((sum, ch) => sum + ch.count, 0);
      return {
        ...cat,
        count: countForSlug(cat.id) + totalChildCount,
        children: childCounts,
      };
    });
    return withCounts.sort((a, b) => {
      const la = latestForSlug(a.id);
      const lb = latestForSlug(b.id);
      if (la === null && lb === null) return (a.order || 0) - (b.order || 0);
      if (la === null) return 1;
      if (lb === null) return -1;
      return lb - la;
    });
  })();

  // Handle category selection/deselection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setPage(1);
  };

  // Check if a category or any of its children is selected
  const isCategorySelected = (categoryId, children = []) => {
    if (selectedCategories.includes(categoryId)) return true;
    if (children.length > 0) {
      return children.some(child => selectedCategories.includes(child.id));
    }
    return false;
  };

  // Expand each selected category to include all of its sub-categories, so
  // selecting a parent also shows articles filed under its children.
  const findNodeBySlug = (nodes, id) => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) { const f = findNodeBySlug(n.children, id); if (f) return f; }
    }
    return null;
  };
  const slugsUnder = (node) => {
    if (!node) return [];
    let acc = [node.id];
    (node.children || []).forEach(ch => { acc = acc.concat(slugsUnder(ch)); });
    return acc;
  };
  const effectiveCategorySlugs = (() => {
    const set = new Set();
    selectedCategories.forEach(slug => {
      set.add(slug);
      slugsUnder(findNodeBySlug(categoriesTree, slug)).forEach(s => set.add(s));
    });
    return set;
  })();

  // Filter articles based on search term and selected categories
  const filteredArticles = articlesData.filter(article => {
    const matchesSearch = article.title.includes(searchTerm) || 
                          stripHtml(article.intro).includes(searchTerm);
    
    let matchesCategory = true;
    if (selectedCategories.length > 0) {
      matchesCategory = effectiveCategorySlugs.has(article.category);
    }
    
    return matchesSearch && matchesCategory;
  });

  // Separate main and normal articles
  const mainArticles = filteredArticles
    .filter(article => article.articleType === (ARTICLE_TYPES?.MAIN || 'main'))
    .sort((a, b) => (a.order || 999) - (b.order || 999));
  
  const normalArticles = filteredArticles
    .filter(article => article.articleType === (ARTICLE_TYPES?.NORMAL || 'normal'))
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  // Pagination only for normal articles
  const articlesPerPage = 6;
  const paginatedNormalArticles = normalArticles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  useEffect(() => {
    setMounted(true);
    const initialOpenState = {};
    categoriesTree.forEach(cat => {
      initialOpenState[cat.id] = false;
    });
    setOpenCategories(initialOpenState);
    // Load which articles this visitor already liked
    try {
      const stored = JSON.parse(localStorage.getItem('aban_liked_articles') || '[]');
      if (Array.isArray(stored)) setLikedIds(new Set(stored));
      const bookmarked = JSON.parse(localStorage.getItem('aban_bookmarked_articles') || '[]');
      if (Array.isArray(bookmarked)) setBookmarkedIds(new Set(bookmarked));
    } catch {}
    // Fetch articles from database
    articlesApi.getAll().then(data => {
      if (Array.isArray(data)) {
        // Map DB fields to page expected fields
        const mapped = data
          .filter(a => a.status === 'published')
          .map(a => ({
            ...a,
            articleType: a.type === 'main' ? ARTICLE_TYPES.MAIN : ARTICLE_TYPES.NORMAL,
            isFeatured: a.type === 'main',
            readTime: calculateReadTime(a.intro, a.content),
            likes: a.likes ?? 0,
            author: 'تیم آبان',
            order: a.id,
          }));
        setArticlesData(mapped);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCategoryToggle = (categoryId) => {
    setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const toggleBookmark = (article) => {
    const id = article.id;
    const next = new Set(bookmarkedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setBookmarkedIds(next);
    try { localStorage.setItem('aban_bookmarked_articles', JSON.stringify([...next])); } catch {}
  };

  // Toggle like on an article (one like per visitor, tracked in localStorage)
  const toggleLike = async (article) => {
    const id = article.id;
    const liked = likedIds.has(id);
    const delta = liked ? -1 : 1;

    // optimistic UI update
    setArticlesData(prev => prev.map(a => a.id === id ? { ...a, likes: Math.max(0, (a.likes || 0) + delta) } : a));
    const nextLiked = new Set(likedIds);
    if (liked) nextLiked.delete(id); else nextLiked.add(id);
    setLikedIds(nextLiked);
    try { localStorage.setItem('aban_liked_articles', JSON.stringify([...nextLiked])); } catch {}

    try {
      const res = await fetch(`/api/articles/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error('like failed');
      const data = await res.json();
      // reconcile with the authoritative count from the server
      if (typeof data.likes === 'number') {
        setArticlesData(prev => prev.map(a => a.id === id ? { ...a, likes: data.likes } : a));
      }
    } catch {
      // revert on failure
      setArticlesData(prev => prev.map(a => a.id === id ? { ...a, likes: Math.max(0, (a.likes || 0) - delta) } : a));
      const revert = new Set(likedIds);
      setLikedIds(revert);
      try { localStorage.setItem('aban_liked_articles', JSON.stringify([...revert])); } catch {}
    }
  };

  const renderCategoryTree = (items, level = 0) => {
    return items.map((item) => (
      <Box key={item.id}>
        <ListItem
          sx={{
            pl: level * 2,
            borderRadius: '12px',
            mb: 0.5,
            cursor: 'pointer',
            bgcolor: isCategorySelected(item.id, item.children) ? 'rgba(197,165,108,0.1)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(197,165,108,0.08)',
            },
          }}
          onClick={() => handleCategorySelect(item.id)}
        >
          <ListItemIcon sx={{ minWidth: 40, color: colors.gold }}>
            {openCategories[item.id] ? item.openIcon || item.icon : item.icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: selectedCategories.includes(item.id) ? 'bold' : 500,
                  color: selectedCategories.includes(item.id) ? colors.gold : colors.primary,
                }}>
                  {item.name}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)' }}>
                  {item.count}
                </Typography>
              </Box>
            }
          />
          {item.children?.length > 0 && (
            <Box 
              sx={{ color: colors.gold, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryToggle(item.id);
              }}
            >
              {openCategories[item.id] ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItem>
        {item.children && (
          <Collapse in={openCategories[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderCategoryTree(item.children, level + 1)}
            </List>
          </Collapse>
        )}
      </Box>
    ));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPage(1);
  };

  // Render article card based on type with SAME width and height for all cards
  const renderArticleCard = (article, index, isMainArticle = false) => {
    // Main articles have larger dimensions but SAME WIDTH as normal articles
    const imageHeight = isMainArticle ? 280 : 200;
    const titleFontSize = isMainArticle ? '1.3rem' : '1rem';
    
    // ALL articles use the SAME grid size for consistent width
    // xs=12 (full width on mobile), sm=6 (2 per row on tablet), md=4 (3 per row on desktop)
    const gridSize = { xs: 12, sm: 6, md: 4 };
    
    return (
      <Grid size={gridSize} key={article.id}>
        <Box
          sx={{
            animation: mounted ? `fadeInUp ${0.3 + (index % 5) * 0.1}s ease-out` : 'none',
            height: '100%',
          }}
        >
          <Card
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: isMainArticle 
                ? `2px solid ${colors.gold}` 
                : '1px solid rgba(197,165,108,0.15)',
              boxShadow: isMainArticle 
                ? `0 5px 20px rgba(197,165,108,0.15)` 
                : 'none',
              transition: 'all 0.3s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                borderColor: colors.gold,
              },
            }}
          >
            {isMainArticle && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1,
                  bgcolor: colors.gold,
                  color: colors.dark,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                }}
              >
                <StarIcon sx={{ fontSize: 14 }} />
                <span>مقاله اصلی</span>
              </Box>
            )}
            
            <Box
              sx={{
                position: 'relative',
                height: imageHeight,
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#f2f0ec',
              }}
            >
              <CardMedia
                component="img"
                image={article.image}
                alt={article.imageAlt || article.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Chip
                label={article.readTime}
                size="small"
                icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                }}
              />
            </Box>

            <CardContent sx={{ 
              p: isMainArticle ? 3 : 2.5, 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: isMainArticle ? 14 : 12, color: colors.gold }} />
                  <Typography sx={{ fontSize: isMainArticle ? '0.75rem' : '0.65rem', color: colors.dark, opacity: 0.7 }}>
                    {article.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon sx={{ fontSize: isMainArticle ? 14 : 12, color: colors.gold }} />
                  <Typography sx={{ fontSize: isMainArticle ? '0.75rem' : '0.65rem', color: colors.dark, opacity: 0.7 }}>
                    {article.views}
                  </Typography>
                </Box>
                <Box
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleLike(article); }}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', userSelect: 'none', borderRadius: '10px', px: 0.5, py: 0.2, transition: 'all 0.15s', '&:hover': { bgcolor: 'rgba(224,80,110,0.08)' }, '&:active': { transform: 'scale(0.92)' } }}
                >
                  {likedIds.has(article.id)
                    ? <FavoriteIcon sx={{ fontSize: isMainArticle ? 14 : 12, color: '#e0506e' }} />
                    : <FavoriteBorderIcon sx={{ fontSize: isMainArticle ? 14 : 12, color: colors.gold }} />}
                  <Typography sx={{ fontSize: isMainArticle ? '0.75rem' : '0.65rem', color: colors.dark, opacity: 0.7 }}>
                    {article.likes}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontSize: titleFontSize,
                  fontWeight: 'bold',
                  color: colors.primary,
                  mb: 1.5,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: isMainArticle ? '3.6rem' : '2.8rem',
                  '&:hover': {
                    color: colors.gold,
                  },
                  flexShrink: 0,
                }}
              >
                {article.title}
              </Typography>

              {/* Fixed height container for intro text */}
              <Box sx={{ 
                minHeight: '120px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Typography
                  sx={{
                    fontSize: isMainArticle ? '0.85rem' : '0.75rem',
                    color: colors.dark,
                    lineHeight: 1.7,
                    opacity: 0.75,
                    display: '-webkit-box',
                    WebkitLineClamp: isMainArticle ? 4 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {stripHtml(article.intro)}
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: 1,
                mt: 2,
                flexShrink: 0,
              }}>
                <Typography sx={{ 
                  fontSize: isMainArticle ? '0.75rem' : '0.7rem', 
                  color: colors.gold, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  maxWidth: '120px' 
                }}>
                  {article.author}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleBookmark(article); }}
                    title={bookmarkedIds.has(article.id) ? 'حذف از نشان‌شده‌ها' : 'نشان کردن'}
                    sx={{
                      color: bookmarkedIds.has(article.id) ? colors.primary : colors.gold,
                      p: 0.5,
                      transition: 'all 0.15s',
                      '&:hover': { bgcolor: 'rgba(197,165,108,0.1)' },
                      '&:active': { transform: 'scale(0.92)' },
                    }}
                  >
                    {bookmarkedIds.has(article.id)
                      ? <BookmarkIcon sx={{ fontSize: isMainArticle ? 20 : 18 }} />
                      : <BookmarkBorderIcon sx={{ fontSize: isMainArticle ? 20 : 18 }} />}
                  </IconButton>
                  <Button
                    variant="text"
                    href={`/articles/${article.slug || article.id}`}
                    size="small"
                    sx={{
                      color: colors.gold,
                      fontWeight: 'bold',
                      fontSize: isMainArticle ? '0.8rem' : '0.7rem',
                      minWidth: 'auto',
                      '&:hover': {
                        bgcolor: 'rgba(197,165,108,0.1)',
                      },
                    }}
                  >
                    ادامه مطلب ←
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    );
  };

  // Render sidebar content (search and filters)
  const renderSidebar = () => (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: '120px' },
        animation: mounted ? 'fadeInLeft 0.6s ease-out' : 'none',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '24px',
          background: 'white',
          border: '1px solid rgba(197,165,108,0.15)',
        }}
      >
        <TextField
          fullWidth
          placeholder="جستجوی مقالات..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.gold }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '16px',
              '&:hover fieldset': {
                borderColor: colors.gold,
              },
            },
          }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '24px',
          background: 'white',
          border: '1px solid rgba(197,165,108,0.15)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: colors.primary,
              pb: 1,
              borderBottom: `2px solid ${colors.gold}`,
              display: 'inline-block',
            }}
          >
            دسته‌بندی مقالات
          </Typography>
          {selectedCategories.length > 0 && (
            <Button
              size="small"
              onClick={clearFilters}
              sx={{
                color: colors.gold,
                fontSize: '0.7rem',
              }}
            >
              حذف فیلترها
            </Button>
          )}
        </Box>
        
        {selectedCategories.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {selectedCategories.map(catId => {
              const findCategory = (items) => {
                for (let item of items) {
                  if (item.id === catId) return item.name;
                  if (item.children) {
                    const found = findCategory(item.children);
                    if (found) return found;
                  }
                }
                return null;
              };
              const catName = findCategory(categoriesTree);
              return (
                <Chip
                  key={catId}
                  label={catName}
                  size="small"
                  onDelete={() => handleCategorySelect(catId)}
                  sx={{
                    bgcolor: 'rgba(197,165,108,0.15)',
                    color: colors.primary,
                    borderRadius: '12px',
                  }}
                />
              );
            })}
          </Box>
        )}
        
        <List sx={{ width: '100%', mt: 1 }}>
          {renderCategoryTree(sortedCategoriesTree)}
        </List>
      </Paper>
    </Box>
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
    {/* Mobile */}
    <MobilePageLayout title="خواندنی‌ها" subtitle="آخرین مقالات و آموزش‌های تخصصی دیجیتال مارکتینگ">

      {/* Search bar */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box component="input"
          type="text"
          placeholder="جستجو در مقالات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '100%', boxSizing: 'border-box',
            p: '11px 16px 11px 40px',
            borderRadius: '50px',
            border: '1.5px solid rgba(197,165,108,0.2)',
            bgcolor: 'white',
            fontSize: '0.88rem', fontFamily: 'inherit',
            color: colors.primary, direction: 'rtl',
            outline: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            '&:focus': { borderColor: colors.gold },
          }}
        />
        <Box sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.3)', fontSize: 18, pointerEvents: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </Box>
      </Box>

      {/* Category chips - scrollable */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, mb: 2.5, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
        <Box onClick={() => setSelectedCategories([])}
          sx={{ flexShrink: 0, px: 2.5, py: 0.8, borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s',
            bgcolor: selectedCategories.length === 0 ? colors.gold : 'white',
            color: selectedCategories.length === 0 ? colors.dark : colors.primary,
            border: '1.5px solid', borderColor: selectedCategories.length === 0 ? colors.gold : 'rgba(197,165,108,0.2)',
            fontWeight: selectedCategories.length === 0 ? 'bold' : '400', fontSize: '0.8rem',
            boxShadow: selectedCategories.length === 0 ? '0 2px 12px rgba(197,165,108,0.3)' : 'none',
          }}>
          همه
        </Box>
        {sortedCategoriesTree.map(cat => (
          <Box key={cat.id}>
            <Box onClick={() => handleCategorySelect(cat.id)}
              sx={{ flexShrink: 0, px: 2.5, py: 0.8, borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                bgcolor: selectedCategories.includes(cat.id) ? colors.gold : 'white',
                color: selectedCategories.includes(cat.id) ? colors.dark : colors.primary,
                border: '1.5px solid', borderColor: selectedCategories.includes(cat.id) ? colors.gold : 'rgba(197,165,108,0.2)',
                fontWeight: selectedCategories.includes(cat.id) ? 'bold' : '400', fontSize: '0.8rem',
                boxShadow: selectedCategories.includes(cat.id) ? '0 2px 12px rgba(197,165,108,0.3)' : 'none',
                display: 'flex', alignItems: 'center', gap: 0.8,
              }}>
              {cat.name}
              <Box sx={{ bgcolor: selectedCategories.includes(cat.id) ? 'rgba(0,0,0,0.15)' : 'rgba(197,165,108,0.15)', px: 0.8, py: 0.1, borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                {cat.count}
              </Box>
            </Box>
            {/* Sub-categories when parent selected */}
            {selectedCategories.includes(cat.id) && cat.children.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.8, mt: 1, flexWrap: 'wrap' }}>
                {cat.children.map(child => (
                  <Box key={child.id} onClick={() => handleCategorySelect(child.id)}
                    sx={{ px: 2, py: 0.5, borderRadius: '50px', cursor: 'pointer', fontSize: '0.72rem', whiteSpace: 'nowrap',
                      bgcolor: selectedCategories.includes(child.id) ? colors.primary : 'rgba(197,165,108,0.08)',
                      color: selectedCategories.includes(child.id) ? 'white' : colors.primary,
                      border: '1px solid', borderColor: selectedCategories.includes(child.id) ? colors.primary : 'rgba(197,165,108,0.2)',
                      transition: 'all 0.2s',
                    }}>
                    {child.name}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Active filter indicator */}
      {(selectedCategories.length > 0 || searchTerm) && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 0.5 }}>
          <Typography sx={{ fontSize: '0.78rem', color: colors.dark, opacity: 0.6 }}>
            {filteredArticles.length} مقاله یافت شد
          </Typography>
          <Box onClick={() => { setSelectedCategories([]); setSearchTerm(''); }}
            sx={{ fontSize: '0.72rem', color: colors.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { opacity: 0.7 } }}>
            پاک کردن فیلتر
            <Box>×</Box>
          </Box>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid rgba(197,165,108,0.2)`, borderTop: `3px solid ${colors.gold}`, animation: 'spin 0.8s linear infinite' }} />
        </Box>
      ) : filteredArticles.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
          <Typography sx={{ fontSize: '0.9rem', color: colors.dark, opacity: 0.5 }}>مقاله‌ای یافت نشد</Typography>
        </Box>
      ) : (
        <>
          {/* Featured article */}
          {filteredArticles.filter(a => a.type === 'main' || a.articleType === ARTICLE_TYPES?.MAIN).slice(0,1).map(article => (
            <Box key={article.id} href={`/articles/${article.slug || article.id}`} sx={{ borderRadius: '24px', overflow: 'hidden', mb: 2.5, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', position: 'relative', cursor: 'pointer', transition: 'all 0.2s', '&:active': { transform: 'scale(0.99)' } }}>
              <Box component="img" src={article.image} alt={article.imageAlt || article.title} sx={{ width: '100%', height: 200, objectFit: 'contain', backgroundColor: '#f2f0ec' }} />
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: colors.gold, color: colors.dark, px: 1.5, py: 0.4, borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold' }}>ویژه</Box>
              <Box sx={{ p: 2.5, bgcolor: 'white' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: colors.primary, mb: 1, lineHeight: 1.4 }}>{article.title}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: colors.dark, opacity: 0.7, lineHeight: 1.7, mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{stripHtml(article.intro)}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: colors.gold }}>{article.date}</Typography>
              </Box>
            </Box>
          ))}
          {/* Normal articles list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredArticles.filter(a => a.type !== 'main' && a.articleType !== ARTICLE_TYPES?.MAIN).map(article => (
              <Box key={article.id} onClick={() => router.push(`/articles/${article.slug || article.id}`)} sx={{ bgcolor: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(197,165,108,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s', '&:active': { transform: 'scale(0.99)' } }}>
                <Box component="img" src={article.image} alt={article.imageAlt || article.title} sx={{ width: '100%', height: 180, objectFit: 'contain', backgroundColor: '#f2f0ec', display: 'block' }} />
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ bgcolor: 'rgba(197,165,108,0.1)', px: 1.2, py: 0.2, borderRadius: '20px' }}>
                      <Typography sx={{ fontSize: '0.62rem', color: colors.gold, fontWeight: 'bold' }}>{findCategoryInTree(categoriesTree, article.category)?.name || article.category}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.65rem', color: colors.dark, opacity: 0.45 }}>{article.date}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.primary, mb: 0.8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: colors.dark, opacity: 0.7, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{stripHtml(article.intro)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </MobilePageLayout>

    {/* Desktop */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
    <PageWrapper>
      <Box
        sx={{
          minHeight: '100vh',
          background: colors.background,
          pt: { xs: '120px', sm: '140px', md: '240px', lg: '256px' },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ mb: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              position: 'relative',
              py: { xs: 4, sm: 5, md: 7 },
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
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                animation: mounted ? 'fadeInDown 0.6s ease-out' : 'none',
              }}
            >
              خواندنی‌ها
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
              آخرین مقالات و مطالب آموزشی در حوزه طراحی، توسعه، سئو و بازاریابی دیجیتال
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

        <Container maxWidth="xl">
          {/* Responsive layout: Column on mobile, Row on desktop */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, sm: 3, md: 4 },
            }}
          >
            {/* ARTICLES SECTION - Left on desktop, below search on mobile */}
            <Box sx={{ flex: { md: '1 1 70%' }, order: { xs: 2, md: 1 } }}>
              
              {loading ? (
                <Grid container spacing={3}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                      <Skeleton variant="rectangular" height={380} sx={{ borderRadius: '24px' }} />
                    </Grid>
                  ))}
                </Grid>
              ) : filteredArticles.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    bgcolor: 'white',
                    borderRadius: '30px',
                    border: '1px solid rgba(197,165,108,0.15)',
                  }}
                >
                  <Typography sx={{ fontSize: '1.2rem', color: colors.primary, mb: 1 }}>
                    مقاله‌ای یافت نشد
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: colors.dark, opacity: 0.6 }}>
                    لطفاً فیلترهای دیگری را امتحان کنید
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Main Articles Section */}
                  {mainArticles.length > 0 && (
                    <Box sx={{ mb: 6 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          mb: 3,
                          pb: 1,
                          borderBottom: `2px solid ${colors.gold}`,
                        }}
                      >
                        <WhatshotIcon sx={{ color: colors.gold, fontSize: 28 }} />
                        <Typography
                          variant="h2"
                          sx={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: colors.primary,
                          }}
                        >
                          مقالات اصلی و ویژه
                        </Typography>
                        <Chip
                          label={mainArticles.length}
                          size="small"
                          sx={{
                            bgcolor: colors.gold,
                            color: colors.dark,
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                      <Grid container spacing={3}>
                        {mainArticles.map((article, index) => renderArticleCard(article, index, true))}
                      </Grid>
                    </Box>
                  )}

                  {/* Normal Articles Section */}
                  {normalArticles.length > 0 && (
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          mb: 3,
                          pb: 1,
                          borderBottom: `2px solid ${colors.gold}`,
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: colors.primary,
                          }}
                        >
                          سایر مقالات
                        </Typography>
                        <Chip
                          label={normalArticles.length}
                          size="small"
                          sx={{
                            bgcolor: colors.gold,
                            color: colors.dark,
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                      <Grid container spacing={3}>
                        {paginatedNormalArticles.map((article, index) => renderArticleCard(article, index, false))}
                      </Grid>

                      {/* Pagination only for normal articles */}
                      {normalArticles.length > articlesPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                          <Pagination
                            count={Math.ceil(normalArticles.length / articlesPerPage)}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                            sx={{
                              '& .MuiPaginationItem-root': {
                                borderRadius: '12px',
                                '&.Mui-selected': {
                                  backgroundColor: colors.gold,
                                  color: colors.dark,
                                  '&:hover': {
                                    backgroundColor: colors.primary,
                                    color: 'white',
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}
            </Box>

            {/* SIDEBAR (Search + Filters) - Right on desktop, TOP on mobile */}
            <Box sx={{ flex: { md: '1 1 25%' }, order: { xs: 1, md: 2 } }}>
              {renderSidebar()}
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