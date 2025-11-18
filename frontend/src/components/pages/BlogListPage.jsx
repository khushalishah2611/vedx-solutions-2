import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
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
import { blogPosts } from '../../data/blogs.js';

const POSTS_PER_PAGE = 9;

const BlogListPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const [searchValue, setSearchValue] = useState(queryParam);

  const categories = useMemo(() => {
    const unique = new Set(blogPosts.map((post) => post.category));
    return ['all', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, []);

  const categoryParam = searchParams.get('category');
  const categoriesParam = searchParams.get('categories');

  const selectedCategories = useMemo(() => {
    const raw = categoriesParam ?? categoryParam;

    if (!raw) return ['all'];

    const parsed = raw
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const valid = parsed.filter((item) => categories.includes(item));
    return valid.length > 0 ? valid : ['all'];
  }, [categories, categoryParam, categoriesParam]);

  const hasAllSelected = selectedCategories.includes('all');

  const categoryCounts = useMemo(() => {
    return blogPosts.reduce(
      (acc, post) => {
        acc.all += 1;
        acc[post.category] = (acc[post.category] ?? 0) + 1;
        return acc;
      },
      { all: 0 }
    );
  }, []);

  const activeCategories = useMemo(
    () => (hasAllSelected ? [] : selectedCategories),
    [hasAllSelected, selectedCategories]
  );
  const normalisedPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  const filteredPosts = useMemo(() => {
    const normalisedQuery = queryParam.trim().toLowerCase();

    return blogPosts.filter((post) => {
      if (activeCategories.length > 0 && !activeCategories.includes(post.category)) return false;
      if (!normalisedQuery) return true;

      const haystack = [post.title, post.excerpt, ...(post.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalisedQuery);
    });
  }, [activeCategories, queryParam]);

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

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
            url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.25)}`,
          transform: 'scale(1.05)',
          transition: 'transform 0.6s ease, filter 0.6s ease',
          filter: isDark ? 'brightness(0.55)' : 'brightness(0.8)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '90vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 12, md: 14 },
          pt: { xs: 14, md: 18 }
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 36, md: 52 },
                fontWeight: 800,
                textAlign: { xs: 'left', md: 'center' }
              }}
            >
              Insights that Power Product Growth
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 720,
                textAlign: { xs: 'left', md: 'center' },
                color: subtleText,
                lineHeight: 1.7
              }}
            >
              Browse our latest thinking across engineering, UX, data, and growth. Filter by category or search for a topic to
              discover practical guidance from the VedX Solutions team.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }}>
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* HEADER */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
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
                        onClick={() => handleCategoryChange(category)}
                        title={`Remove ${category} filter`}
                      >
                        <Box
                          component="span"
                          sx={{
                            background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
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
                        Search: "{queryParam.trim()}"
                      </Box>
                    </Box>
                  )}
                </Stack>
              )}

              {/* POSTS GRID */}
              {paginatedPosts.length > 0 ? (
                <Grid container spacing={4}>
                  {paginatedPosts.map((post) => (
                    <Grid item xs={12} sm={6} key={post.slug}>
                      <BlogPreviewCard post={post} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
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

              {/* PAGINATION */}
              {paginatedPosts.length > 0 && (
                <Stack alignItems="center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* SIDEBAR */}
          <Grid item xs={12} md={4}>
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
                              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12)
                            }
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
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogListPage;
