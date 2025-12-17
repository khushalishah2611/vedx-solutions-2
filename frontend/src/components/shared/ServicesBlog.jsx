import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { apiUrl } from '../../utils/const.js';
import BlogPreviewCard from './BlogPreviewCard.jsx';

const mapPreviewPost = (post) => {
  const slug = post.slug || `post-${post.id || Math.random().toString(16).slice(2)}`;

  return {
    slug,
    title: post.title,
    category: post.category?.name || post.category || 'Uncategorized',
    image: post.coverImage || post.blogImage || post.heroImage || post.image,
    excerpt: post.shortDescription || post.description || post.excerpt || '',
  };
};

const ServicesBlog = ({ showHeading = true, posts: providedPosts = [] }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasProvidedPosts = useMemo(() => (providedPosts ?? []).length > 0, [providedPosts]);

  useEffect(() => {
    if (hasProvidedPosts) {
      setPosts((providedPosts || []).map(mapPreviewPost));
      setError('');
      setLoading(false);
      return;
    }

    const fetchLatestPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(apiUrl('/api/blog-posts?page=1&pageSize=4'));
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || 'Unable to load blogs.');
        setPosts((payload.posts || []).map(mapPreviewPost));
      } catch (error) {
        console.error('Load latest blogs failed', error);
        setError(error?.message || 'Unable to load blogs right now.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, [hasProvidedPosts, providedPosts]);

  const postsToRender = (hasProvidedPosts ? posts : posts.slice(0, 4)) || [];

  return (
    <Box component="section">
      {showHeading && (
        <Stack alignItems="center" justifyContent="center" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 700,
              textAlign: 'center',
              width: '100%',
            }}
          >
            Latest Blogs
          </Typography>
        </Stack>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Loading blogs...
        </Typography>
      )}

      {!loading && postsToRender.length === 0 && !error && (
        <Typography variant="body2" color="text.secondary">
          No blog posts available yet.
        </Typography>
      )}

      <Grid container spacing={2}>
        {postsToRender.map((post) => (
          <Grid item xs={12} md={6} lg={3} key={post.slug}>
            <BlogPreviewCard
              post={post}
              imageHeight={200}
              showExcerpt={false}
              showMeta={false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

ServicesBlog.propTypes = {
  showHeading: PropTypes.bool,
  posts: PropTypes.array,
};

export default ServicesBlog;
