import { Box, Button, Chip, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
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

          borderColor: alpha(accentColor, 0.5)
        }
      }}
    >
      <Box
        component={RouterLink}
        to={`/blog/${post.slug}`}
        sx={{
          display: 'block',
          textDecoration: 'none',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            height: imageHeight,
            backgroundImage: `url(${post.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.6s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
      </Box>

      <Stack spacing={2} sx={{ p: { xs: 3, md: 3.25 }, flexGrow: 1 }}>
        <Chip
          label={post.category}
          sx={{
            alignSelf: 'flex-start',
            bgcolor: alpha(accentColor, 0.14),
            color: accentColor,
            fontWeight: 600,
            letterSpacing: 0.75
          }}
        />

        <Stack spacing={1.5}>
          <Typography
            component={RouterLink}
            to={`/blog/${post.slug}`}
            variant="h6"
            sx={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              fontWeight: 700,
              lineHeight: 1.3,
              '&:hover': {
                color: accentColor
              }
            }}
          >
            {post.title}
          </Typography>

          {showExcerpt && (
            <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
              {post.excerpt}
            </Typography>
          )}
        </Stack>

        {showMeta && (
          <Stack direction="row" spacing={2} sx={{ color: subtleText, fontSize: 14 }}>
            <Typography variant="body2">{post.publishedOn}</Typography>
            <Typography variant="body2">• {post.readTime}</Typography>
          </Stack>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to={`/blog/${post.slug}`}

          sx={{
            background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
            color: '#fff',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 2, // optional: adds nice horizontal padding
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
