import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { blogPosts } from '../../data/blogs.js';
import BlogPreviewCard from './BlogPreviewCard.jsx';
import { Link as RouterLink } from 'react-router-dom';

const ServicesBlog = () => {
  return (
    <Box component="section">
      <Stack
        spacing={{ xs: 2, md: 3 }}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 8 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            textAlign: { xs: 'left', md: 'left' }
          }}
        >
          Latest Blogs
        </Typography>
        <Button
          component={RouterLink}
          to="/blog"
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
            color: '#fff',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            alignSelf: { xs: 'flex-start', md: 'flex-end' },
            px: { xs: 3, md: 4 },
            '&:hover': {
              background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
            }
          }}
        >
          View All
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {blogPosts.slice(0, 4).map((post) => (
          <Grid item xs={12} md={6} lg={3} key={post.slug}>
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
