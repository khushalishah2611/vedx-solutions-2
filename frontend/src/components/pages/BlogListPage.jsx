import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import BlogPreviewCard from '../shared/BlogPreviewCard.jsx';
import { blogPosts } from '../../data/blogs.js';

const BlogListPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [category, setCategory] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(blogPosts.map((post) => post.category));
    return ['all', ...unique];
  }, []);

  const filteredPosts = useMemo(() => {
    if (category === 'all') {
      return blogPosts;
    }

    return blogPosts.filter((post) => post.category === category);
  }, [category]);

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.72);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box
        sx={{
          bgcolor: isDark ? alpha('#0f172a', 0.92) : alpha('#dbeafe', 0.68),
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
          <Stack spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
           
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 36, md: 52 },
                fontWeight: 800,
                textAlign: { xs: 'left', md: 'center' }
              }}
            >
              Build Without Limits with Our Full Stack Development Company
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
              VedX Solutions offers full stack development services that help you turn ambitious ideas into production-ready
              platforms. Explore our latest thinking on engineering, UX, and growth.
            </Typography>

            <ToggleButtonGroup
              value={category}
              exclusive
              onChange={(_, value) => value && setCategory(value)}
              sx={{
                flexWrap: 'wrap',
                gap: 1,
                '& .MuiToggleButton-root': {
                  borderRadius: 0.5,
                  px: 2.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                  color: theme.palette.text.primary,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }
                }
              }}
            >
              {categories.map((item) => (
                <ToggleButton key={item} value={item}>
                  {item === 'all' ? 'All Topics' : item}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={4}>
          {filteredPosts.map((post) => (
            <Grid item xs={12} md={4} key={post.slug}>
              <BlogPreviewCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogListPage;
