import PropTypes from 'prop-types';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { blogPosts } from '../../data/blogs.js';
import BlogPreviewCard from './BlogPreviewCard.jsx';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const ServicesBlog = ({ showHeading = true, posts, limit }) => {
  const [apiPosts, setApiPosts] = useState([]);
  const { fetchWithLoading } = useLoadingFetch();

  // 👉 heading true = 4 cards, false = 3 cards
  const resolvedLimit =  showHeading
    ? 4
    : 3;

  useEffect(() => {
    let isMounted = true;

    const loadLatestPosts = async () => {
      if (posts?.length) return;

      try {
        const response = await fetchWithLoading(
          apiUrl(`/api/blog-posts?page=1&pageSize=${resolvedLimit}`)
        );

        if (!response.ok) {
          throw new Error('Failed to fetch latest blog posts');
        }

        const payload = await response.json();
        if (!isMounted) return;

        const resolved = (
          payload.blogPosts ||
          payload.posts ||
          payload.blogs ||
          payload.items ||
          []
        ).map((post) => ({
          title: post.title || '',
          slug: post.slug || '',
          image: post.coverImage || post.blogImage || '',
          category:
            post.category?.name ||
            post.categoryName ||
            post.category ||
            'Uncategorized',
          publishDate: post.publishDate || post.publishedAt || '',
        }));

        setApiPosts(resolved);
      } catch (error) {
        console.error('Failed to load latest blog posts', error);
      }
    };

    loadLatestPosts();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading, posts, resolvedLimit]);

  const resolvedPosts = useMemo(() => {
    if (posts?.length) return posts;

    if (apiPosts.length > 0) {
      return [...apiPosts].sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      });
    }

    return blogPosts;
  }, [apiPosts, posts]);

  const visiblePosts = resolvedPosts.slice(0, resolvedLimit);

  // ✅ Grid columns: if limit is 4 (or more), show 4 cards on lg (12/3 = 4)
  const lgCols = resolvedLimit >= 4 ? 3 : 4;

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

      <Grid container spacing={2}>
        {visiblePosts.map((post, idx) => (
          <Grid
            item
            xs={12}
            md={6}
                        lg={lgCols}
            key={post.slug || post.id || post.title || `blog-${idx}`}
          >
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
  posts: PropTypes.arrayOf(PropTypes.object),
  limit: PropTypes.number,
};

export default ServicesBlog;
