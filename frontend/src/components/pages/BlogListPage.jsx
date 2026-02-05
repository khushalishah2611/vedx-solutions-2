import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  PaginationItem,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchParams } from 'react-router-dom';

import { AppTextField } from '../shared/FormControls.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import { useBannerByType } from '../../hooks/useBannerByType.js';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const POSTS_PER_PAGE = 6;

const BlogListPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const { banner } = useBannerByType('blogs');
  const heroTitle = banner?.title;
  const heroImage =
    banner?.image;

  const { fetchWithLoading } = useLoadingFetch();

  const [apiPosts, setApiPosts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const [searchValue, setSearchValue] = useState(queryParam);

  useEffect(() => {
    let isMounted = true;

    const loadBlogData = async () => {
      try {
        const [categoriesResponse, postsResponse] = await Promise.all([
          fetchWithLoading(apiUrl('/api/blog-categories')),
          fetchWithLoading(apiUrl('/api/blog-posts?page=1&pageSize=50')),
        ]);

        if (!categoriesResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to load blog data.');
        }

        const categoriesPayload = await categoriesResponse.json();
        const postsPayload = await postsResponse.json();

        if (!isMounted) return;

        const mappedPosts = (postsPayload.posts ?? postsPayload.blogPosts ?? postsPayload.items ?? []).map((post) => ({
          id: post.id,
          title: post.title || '',
          slug: post.slug || '',
          category: post.category?.name || post.categoryName || post.category || 'Uncategorized',
          tags: post.tags || [],
          excerpt: post.shortDescription || post.description || '',
          image: post.coverImage || post.blogImage || '',
          heroImage: post.coverImage || post.blogImage || '',
          publishedOn: post.publishDate || post.publishedAt || post.createdAt || '',
        }));

        setApiPosts(mappedPosts);
        setApiCategories(categoriesPayload.categories ?? categoriesPayload.items ?? []);
      } catch (error) {
        console.error('Failed to load blog list data', error);
      }
    };

    loadBlogData();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  // ✅ no blogPosts fallback to avoid crash
  const allPosts = apiPosts.length > 0 ? apiPosts : [];

  const categories = useMemo(() => {
    if (apiCategories.length > 0) {
      const unique = new Set(apiCategories.map((category) => category?.name).filter(Boolean));
      return ['all', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
    }

    const unique = new Set(allPosts.map((post) => post.category).filter(Boolean));
    return ['all', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [allPosts, apiCategories]);

  const categoryParam = searchParams.get('category');
  const categoriesParam = searchParams.get('categories');

  const selectedCategories = useMemo(() => {
    const raw = categoriesParam ?? categoryParam;
    if (!raw) return ['all'];

    const parsed = raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const valid = parsed.filter((item) => categories.includes(item));
    return valid.length > 0 ? valid : ['all'];
  }, [categories, categoryParam, categoriesParam]);

  const hasAllSelected = selectedCategories.includes('all');

  const categoryCounts = useMemo(() => {
    return allPosts.reduce(
      (acc, post) => {
        const cat = post.category || 'Uncategorized';
        acc.all += 1;
        acc[cat] = (acc[cat] ?? 0) + 1;
        return acc;
      },
      { all: 0 }
    );
  }, [allPosts]);

  const activeCategories = useMemo(() => (hasAllSelected ? [] : selectedCategories), [hasAllSelected, selectedCategories]);

  const normalisedPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  const filteredPosts = useMemo(() => {
    const normalisedQuery = queryParam.trim().toLowerCase();

    return allPosts.filter((post) => {
      const cat = post.category || 'Uncategorized';
      if (activeCategories.length > 0 && !activeCategories.includes(cat)) return false;
      if (!normalisedQuery) return true;

      const haystack = [post.title, post.excerpt, ...(post.tags ?? [])].join(' ').toLowerCase();
      return haystack.includes(normalisedQuery);
    });
  }, [activeCategories, allPosts, queryParam]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(totalPages, normalisedPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategories, currentPage]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.72);

  const handleCategoryChange = (value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === 'all') {
      nextParams.delete('categories');
      nextParams.delete('category');
    } else {
      const currentSelections = hasAllSelected ? [] : [...selectedCategories];
      const exists = currentSelections.includes(value);

      const updatedSelections = exists
        ? currentSelections.filter((item) => item !== value)
        : [...currentSelections, value];

      if (updatedSelections.length === 0) {
        nextParams.delete('categories');
        nextParams.delete('category');
      } else {
        nextParams.set('categories', updatedSelections.join(','));
        nextParams.delete('category');
      }
    }

    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    const nextParams = new URLSearchParams(searchParams);
    if (value.trim().length > 0) nextParams.set('q', value);
    else nextParams.delete('q');

    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const handlePageChange = (_, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value <= 1) nextParams.delete('page');
    else nextParams.set('page', value.toString());
    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    setSearchValue('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const hasFilters = !hasAllSelected || queryParam.trim().length > 0;
  const totalResults = filteredPosts.length;
  const startIndex = totalResults === 0 ? 0 : (currentPage - 1) * POSTS_PER_PAGE + 1;
  const endIndex = Math.min(totalResults, currentPage * POSTS_PER_PAGE);

  const heroGradient = isDark
    ? `linear-gradient(
        90deg,
        rgba(5,9,18,0.85) 0%,
        rgba(5,9,18,0.65) 40%,
        rgba(5,9,18,0.2) 70%,
        rgba(5,9,18,0) 100%
      )`
    : `linear-gradient(
        90deg,
        rgba(241,245,249,0.9) 0%,
        rgba(241,245,249,0.7) 40%,
        rgba(241,245,249,0.3) 70%,
        rgba(241,245,249,0) 100%
      )`;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          backgroundImage: `${heroGradient}, url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: isDark ? 'brightness(0.9)' : 'brightness(0.85)',
          minHeight: { xs: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 10, md: 14 },
          pt: { xs: 12, md: 18 },
          color: 'common.white',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            zIndex: 1,
            px: { xs: 3, md: 20 },
          }}
        >
          <Stack spacing={2.5} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 34, sm: 42, md: 56 },
                fontWeight: 800,
                lineHeight: 1.1,
                textAlign: { xs: "center", md: "left" },
                color: isDark ? "#fff" : "#0f172a",
              }}
            >
              {heroTitle}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: isDark ? alpha("#ffffff", 0.85) : alpha("#0f172a", 0.78),
                maxWidth: 640,
                fontSize: { xs: 14, md: 16 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Browse our latest thinking across engineering, UX, data, and growth. Filter
              by category or search for a topic to discover practical guidance from the
              VedX Solutions team.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container
        maxWidth={false}
        sx={{
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Box my={10}>
          <Grid container spacing={{ xs: 6, md: 8 }}>
            {/* SIDEBAR – mobile top, desktop right */}
            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
              <Stack spacing={2}>
                {/* SEARCH BOX */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 0.5,
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.92),
                  }}
                >
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Search
                    </Typography>
                    <AppTextField
                      value={searchValue}
                      onChange={handleSearchChange}
                      placeholder="Search articles..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Paper>

                {/* CATEGORIES */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 0.5,
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.92),
                  }}
                >
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Categories
                    </Typography>

                    <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {categories.map((item) => {
                        const label = item === 'all' ? 'All Topics' : item;
                        const isSelected = hasAllSelected ? item === 'all' : selectedCategories.includes(item);
                        const count = categoryCounts[item] ?? 0;

                        return (
                          <ListItemButton
                            key={item}
                            onClick={() => handleCategoryChange(item)}
                            selected={isSelected}
                            sx={{
                              borderRadius: 0.5,
                              transition: 'all 0.2s ease',
                              '&.Mui-selected': {
                                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12),
                              },
                            }}
                          >
                            <ListItemText primary={label} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {count}
                            </Typography>
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>

            {/* MAIN CONTENT – mobile below filters, desktop left */}
            <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
              <Stack spacing={4}>
                {/* HEADER */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: 'center', sm: 'center' }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: 26, md: 32 } }}>
                    Latest Articles
                  </Typography>

                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {totalResults === 0
                      ? 'No posts match your filters yet.'
                      : `Showing ${startIndex}${endIndex !== startIndex ? `-${endIndex}` : ''} of ${totalResults} articles.`}
                  </Typography>
                </Stack>

                {/* ACTIVE FILTER BOXES */}
                {hasFilters && (
                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    {!hasAllSelected &&
                      selectedCategories.map((category) => (
                        <Box
                          key={category}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                            borderRadius: 0.5,
                            border: `1px solid ${alpha('#ffffff', 0.1)}`,
                            background: !isDark ? alpha('#ddddddff', 0.9) : alpha('#0000007c', 0.9),
                            color: alpha(accentColor, 0.9),
                            fontWeight: 600,
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            fontSize: 11,
                            lineHeight: 1.3,
                            width: 'fit-content',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleCategoryChange(category)}
                          title={`Remove ${category} filter`}
                        >
                          <Box
                            component="span"
                            sx={{
                              background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            Category: {category}
                          </Box>
                        </Box>
                      ))}

                    {queryParam.trim().length > 0 && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 2,
                          py: 1,
                          borderRadius: 0.5,
                          border: `1px solid ${alpha('#ffffff', 0.1)}`,
                          background: !isDark ? alpha('#ddddddff', 0.9) : alpha('#0000007c', 0.9),
                          color: alpha(accentColor, 0.9),
                          fontWeight: 600,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          fontSize: 11,
                          lineHeight: 1.3,
                          width: 'fit-content',
                          cursor: 'pointer',
                        }}
                        onClick={clearSearch}
                        title="Clear search"
                      >
                        <Box
                          component="span"
                          sx={{
                            background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          Search: {queryParam.trim()}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                )}

                {paginatedPosts.length > 0 ? (
                  <Box my={10}>
                    <ServicesBlog showHeading={false} posts={paginatedPosts} limit={paginatedPosts.length} />
                  </Box>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 4, md: 6 },
                      textAlign: 'center',
                      borderRadius: 0.5,
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.9),
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      Nothing to see here yet
                    </Typography>
                    <Typography variant="body1" sx={{ color: subtleText }}>
                      Try clearing your filters or exploring another category to find more expert insights from our team.
                    </Typography>
                  </Paper>
                )}

                {/* PAGINATION – custom UI */}
                {filteredPosts.length > POSTS_PER_PAGE && (
                  <Stack alignItems="center" sx={{ mt: { xs: 4, md: 6 } }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      shape="rounded"
                      variant="text"
                      renderItem={(item) => (
                        <PaginationItem
                          {...item}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: 1,
                            mx: 0.5,
                            fontWeight: 600,
                            fontSize: 14,
                            boxShadow: item.selected
                              ? '0 0 0 1px rgba(255,255,255,0.25), 0 18px 35px rgba(0,0,0,0.6)'
                              : '0 10px 20px rgba(0,0,0,0.45)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backgroundImage: item.selected
                              ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%)'
                              : 'none',
                            backgroundColor: item.selected ? 'transparent' : alpha('#000000', isDark ? 0.7 : 0.9),
                            color: '#ffffff',
                            '&:hover': {
                              backgroundImage: item.selected
                                ? 'linear-gradient(135deg, #a855f7 0%, #f472b6 50%, #fb923c 100%)'
                                : 'none',
                              backgroundColor: item.selected ? 'transparent' : alpha('#000000', isDark ? 0.85 : 0.95),
                            },
                            '&.Mui-disabled': {
                              opacity: 0.4,
                              boxShadow: 'none',
                            },
                          }}
                        />
                      )}
                      sx={{
                        '& .MuiPagination-ul': {
                          m: 0,
                        },
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogListPage;
