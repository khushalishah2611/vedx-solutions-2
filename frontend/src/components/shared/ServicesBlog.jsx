import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { blogPosts } from '../../data/blogs.js';
import BlogPreviewCard from './BlogPreviewCard.jsx';
import { Link as RouterLink } from 'react-router-dom';

const ServicesBlog = () => {
  return (
    <Box component="section">
      <Stack
       
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 8 }}
      >
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

      <Grid container spacing={2}>
        {blogPosts.slice(0, 4).map((post) => (
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

export default ServicesBlog;
