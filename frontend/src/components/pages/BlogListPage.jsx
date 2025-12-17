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
  TextField,
  Typography,
  alpha,
  useTheme,
  InputAdornment
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchParams } from 'react-router-dom';
import BlogPreviewCard from '../shared/BlogPreviewCard.jsx';
import { apiUrl } from '../../utils/const.js';
const POSTS_PER_PAGE = 4;

const BlogListPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const categoriesParam = searchParams.get('categories') ?? '';
  const [searchValue, setSearchValue] = useState(queryParam);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsError, setPostsError] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.72);

  const selectedCategoryIds = useMemo(() => {
    const parsed = categoriesParam
      .split(',')
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value));

    const knownIds = categories.map((cat) => cat.id);
    if (knownIds.length === 0) return parsed;
    return parsed.filter((id) => knownIds.includes(id));
  }, [categories, categoriesParam]);

  const hasAllSelected = selectedCategoryIds.length === 0;

  const normalisedPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError('');
    try {
      const response = await fetch(apiUrl('/api/blog-categories'));
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load categories.');
      setCategories(payload.categories || []);
    } catch (error) {
      console.error('Load blog categories failed', error);
      setCategories([]);
      setCategoriesError(error?.message || 'Unable to load categories right now.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    setPostsError('');
    try {
      const params = new URLSearchParams();
      params.set('page', normalisedPage);
      params.set('pageSize', POSTS_PER_PAGE);
      if (queryParam.trim()) params.set('search', queryParam.trim());
      if (!hasAllSelected) params.set('categoryIds', selectedCategoryIds.join(','));

      const response = await fetch(apiUrl(`/api/blog-posts?${params.toString()}`));
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load blogs.');

      setPosts(payload.posts || []);
      setPagination(
        payload.pagination || {
          page: normalisedPage,
          totalPages: 1,
          total: (payload.posts || []).length,
        }
      );
    } catch (error) {
      console.error('Load blogs failed', error);
      setPosts([]);
      setPagination({ page: 1, totalPages: 1, total: 0 });
      setPostsError(error?.message || 'Unable to load blogs right now.');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [queryParam, categoriesParam, normalisedPage, hasAllSelected, selectedCategoryIds]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagination.page]);

  const categoryCounts = useMemo(() => {
    const counts = { all: categories.reduce((sum, cat) => sum + (cat.postCount ?? 0), 0) };
    categories.forEach((cat) => {
      counts[cat.id] = cat.postCount ?? 0;
    });
    return counts;
  }, [categories]);

  const categoryItems = useMemo(
    () => [
      { id: 'all', name: 'All Topics', count: categoryCounts.all || pagination.total || 0 },
      ...categories.map((category) => ({
        id: category.id,
        name: category.name,
        count: categoryCounts[category.id] ?? category.postCount ?? 0,
      })),
    ],
    [categories, categoryCounts, pagination.total]
  );

  const handleCategoryChange = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      nextParams.delete('categories');
    } else {
      const currentSelections = [...selectedCategoryIds];
      const exists = currentSelections.includes(value);
      const updatedSelections = exists
        ? currentSelections.filter((item) => item !== value)
        : [...currentSelections, value];

      if (updatedSelections.length === 0) nextParams.delete('categories');
      else nextParams.set('categories', updatedSelections.join(','));
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
  const totalResults = pagination.total ?? posts.length;
  const startIndex = totalResults === 0 ? 0 : (pagination.page - 1) * POSTS_PER_PAGE + 1;
  const endIndex = Math.min(totalResults, pagination.page * POSTS_PER_PAGE);
  const totalPages = pagination.totalPages ?? Math.max(1, Math.ceil(totalResults / POSTS_PER_PAGE));

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        overflowX: 'hidden'
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.82)), url(https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: isDark ? 'brightness(0.9)' : 'brightness(0.85)',
          minHeight: { xs: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 10, md: 14 },
          pt: { xs: 12, md: 18 },
          color: 'common.white'
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            zIndex: 1,
            px: { xs: 3, md: 20 }
          }}
        >
          <Stack spacing={2.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 34, sm: 42, md: 56 },
                fontWeight: 800,
                lineHeight: 1.1,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Insights that Power Product Growth
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                maxWidth: 640,
                fontSize: { xs: 14, md: 16 },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Browse our latest thinking across engineering, UX, data, and growth. Filter by category or search for a topic to
              discover practical guidance from the VedX Solutions team.
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
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.92)
                  }}
                >
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Search
                    </Typography>
                    <TextField
                      value={searchValue}
                      onChange={handleSearchChange}
                      placeholder="Search articles..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" />
                          </InputAdornment>
                        )
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
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.92)
                  }}
                >
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Categories
                    </Typography>
                    {categoriesError && (
                      <Typography variant="body2" color="error">
                        {categoriesError}
                      </Typography>
                    )}
                    <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {categoriesLoading && categoryItems.length === 0 && (
                        <ListItemButton disabled>
                          <ListItemText primary="Loading categories..." />
                        </ListItemButton>
                      )}
                      {categoryItems.map((item) => {
                        const isSelected = item.id === 'all' ? hasAllSelected : selectedCategoryIds.includes(item.id);

                        return (
                          <ListItemButton
                            key={item.id}
                            onClick={() => handleCategoryChange(item.id)}
                            selected={isSelected}
                            sx={{
                              borderRadius: 0.5,
                              transition: 'all 0.2s ease',
                              '&.Mui-selected': {
                                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12)
                              }
                            }}
                          >
                            <ListItemText primary={item.name} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.count ?? 0}
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
                      selectedCategoryIds.map((categoryId) => {
                        const categoryName =
                          categories.find((cat) => cat.id === categoryId)?.name || `Category ${categoryId}`;
                        return (
                          <Box
                            key={categoryId}
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 2,
                              py: 1,
                              borderRadius: 0.5,
                              border: `1px solid ${alpha('#ffffff', 0.1)}`,
                              background: !isDark
                                ? alpha('#ddddddff', 0.9)
                                : alpha('#0000007c', 0.9),
                              color: alpha(accentColor, 0.9),
                              fontWeight: 600,
                              letterSpacing: 1,
                              textTransform: 'uppercase',
                              fontSize: 11,
                              lineHeight: 1.3,
                              width: 'fit-content',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleCategoryChange(categoryId)}
                            title={`Remove ${categoryName} filter`}
                          >
                            <Box
                              component="span"
                              sx={{
                                background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}
                            >
                              Category: {categoryName}
                            </Box>
                          </Box>
                        );
                      })}

                    {queryParam.trim().length > 0 && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 2,
                          py: 1,
                          borderRadius: 0.5,
                          border: `1px solid ${alpha('#ffffff', 0.1)}`,
                          background: !isDark
                            ? alpha('#ddddddff', 0.9)
                            : alpha('#0000007c', 0.9),
                          color: alpha(accentColor, 0.9),
                          fontWeight: 600,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          fontSize: 11,
                          lineHeight: 1.3,
                          width: 'fit-content',
                          cursor: 'pointer'
                        }}
                        onClick={clearSearch}
                      >
                        <Box
                          component="span"
                          sx={{
                            background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}
                        >
                          Search: {queryParam.trim()}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                )}

                {postsError && (
                  <Typography color="error" variant="body2">
                    {postsError}
                  </Typography>
                )}

                {loadingPosts && (
                  <Typography variant="body2" color="text.secondary">
                    Loading articles...
                  </Typography>
                )}

                {posts.length > 0 && (
                  <Grid container spacing={3}>
                    {posts.map((post) => (
                      <Grid item xs={12} sm={6} key={post.slug || post.id}>
                        <BlogPreviewCard post={post} imageHeight={220} showExcerpt />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {!loadingPosts && posts.length === 0 && !postsError && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 4, md: 6 },
                      textAlign: 'center',
                      borderRadius: 0.5,
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.9)
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
                {posts.length > 0 && totalPages > 1 && (
                  <Stack alignItems="center" sx={{ mt: { xs: 4, md: 6 } }}>
                    <Pagination
                      count={totalPages}
                      page={pagination.page}
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
                            backgroundColor: item.selected
                              ? 'transparent'
                              : alpha('#000000', isDark ? 0.7 : 0.9),
                            color: '#ffffff',
                            '&:hover': {
                              backgroundImage: item.selected
                                ? 'linear-gradient(135deg, #a855f7 0%, #f472b6 50%, #fb923c 100%)'
                                : 'none',
                              backgroundColor: item.selected
                                ? 'transparent'
                                : alpha('#000000', isDark ? 0.85 : 0.95)
                            },
                            '&.Mui-disabled': {
                              opacity: 0.4,
                              boxShadow: 'none'
                            }
                          }}
                        />
                      )}
                      sx={{
                        '& .MuiPagination-ul': {
                          m: 0
                        }
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

      </Container >
    </Box >
  );
};

export default BlogListPage;
