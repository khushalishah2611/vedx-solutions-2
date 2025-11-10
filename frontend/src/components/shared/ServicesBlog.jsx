import { Box, Grid, Stack, Typography } from '@mui/material';
import { blogPosts } from '../../data/blogs.js';
import BlogPreviewCard from './BlogPreviewCard.jsx';

const ServicesBlog = () => {
  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          Latest Blogs
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {blogPosts.slice(0, 3).map((post) => (
          <Grid item xs={12} md={4} key={post.slug}>
            <BlogPreviewCard
              post={post}
              imageHeight={220}
              showExcerpt={false}
              showMeta={false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesBlog;
