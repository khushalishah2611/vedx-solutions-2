import { Box, Button, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const BlogPreviewCard = ({
  post,
  imageHeight = 260,
  showExcerpt = true,
  showMeta = true
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.78);

  const slug = post.slug || post.id || '#';
  const imageUrl =
    post.coverImage ||
    post.blogImage ||
    post.image ||
    post.heroImage ||
    'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80';
  const categoryLabel = post.category?.name || post.category || 'Uncategorized';
  const excerpt = post.shortDescription || post.description || post.excerpt || '';

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0.5,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.97),
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,

        transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        '&:hover': {
          transform: 'translateY(-6px)',

          borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
        }
      }}
    >
      <Box
        component={RouterLink}
        to={`/blog/${slug}`}
        sx={{
          display: 'block',
          textDecoration: 'none',
          borderTopLeftRadius: 0.5,
          borderTopRightRadius: 0.5,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            height: imageHeight,
            borderRadius: 0.5,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',

          }}
        />
      </Box>

      <Stack spacing={2} sx={{ p: { xs: 2, md: 2}, flexGrow: 1 }}>

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
            width: 'fit-content'
          }}
        >
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {categoryLabel}
          </Box>
        </Box>

        <Stack spacing={1.5}>
          <Typography
            component={RouterLink}
            to={`/blog/${slug}`}
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              lineHeight: 1.3,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s ease, background-image 0.3s ease',
              '&:hover': {
                color: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },

            }}
          >
            {post.title}
          </Typography>
          {showExcerpt && excerpt && (
            <Typography
              variant="body2"
              color={subtleText}
              sx={{ lineHeight: 1.6 }}
            >
              {excerpt}
            </Typography>
          )}
        </Stack>


        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to={`/blog/${slug}`}

          sx={{
            background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
            color: '#fff',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            '&:hover': {
              background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
            },
          }}
        >
          Read More
        </Button>

      </Stack>
    </Paper>
  );
};

export default BlogPreviewCard;
