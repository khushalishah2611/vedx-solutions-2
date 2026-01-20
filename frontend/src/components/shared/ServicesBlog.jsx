import PropTypes from 'prop-types';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { AppButton } from './FormControls.jsx';

import { blogPosts } from '../../data/blogs.js';
import BlogPreviewCard from './BlogPreviewCard.jsx';
import { Link as RouterLink } from 'react-router-dom';

const ServicesBlog = ({ showHeading = true, posts, limit = 4 }) => {
  const resolvedPosts = posts ?? blogPosts;
  const visiblePosts = Number.isFinite(limit) ? resolvedPosts.slice(0, limit) : resolvedPosts;

  return (
    <Box component="section">
      {showHeading && (
        <Stack alignItems="center" justifyContent="center" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 700,
              textAlign: "center",
              width: "100%"
            }}
          >
            Latest Blogs
          </Typography>
        </Stack>
      )}

      <Grid container spacing={2}>
        {visiblePosts.map((post) => (
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
  posts: PropTypes.arrayOf(PropTypes.object),
  limit: PropTypes.number,
};

export default ServicesBlog;
