import { useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import BlogPreviewCard from '../shared/BlogPreviewCard.jsx';
import { blogPosts, getBlogBySlug, getRelatedPosts } from '../../data/blogs.js';

const BlogDetailPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { slug } = useParams();
  const post = getBlogBySlug(slug ?? '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (!post) {
      navigate('/blog', { replace: true });
    }
  }, [navigate, post]);

  if (!post) {
    return null;
  }

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.75);
  const heroOverlay = isDark ? 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.92) 100%)' : 'linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.82) 100%)';
  const relatedPosts = getRelatedPosts(post.slug, post.category, post.tags);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box
        sx={{
          position: 'relative',
          color: '#fff',
          backgroundImage: `${heroOverlay}, url(${post.heroImage ?? post.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
          filter: isDark ? 'brightness(0.6)' : 'brightness(0.85)',
          overflow: 'hidden',
          minHeight: { xs: '70vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 12, md: 14 },
          pt: { xs: 14, md: 18 }
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={5}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              alignItems: { xs: 'center', md: 'flex-start' },
              position: 'relative',
              zIndex: 1
            }}
          >
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha('#e2e8f0', 0.9) }} />}
              aria-label="breadcrumb"
              sx={{ color: alpha('#e2e8f0', 0.9) }}
            >
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/blog">
                Blog
              </MuiLink>
              <Typography color="inherit">{post.title}</Typography>
            </Breadcrumbs>

            <Stack spacing={3} sx={{ maxWidth: 720 }}>
              <Chip
                label={post.category}
                sx={{
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  bgcolor: alpha('#38bdf8', 0.35),
                  color: '#fff',
                  fontWeight: 600,
                  letterSpacing: 0.75
                }}
              />
              <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 56 }, fontWeight: 800, lineHeight: 1.15 }}>
                {post.title}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{
                  color: alpha('#f8fafc', 0.9),
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Typography variant="body2">{post.publishedOn}</Typography>
                <Typography variant="body2">• {post.readTime}</Typography>
                <Typography variant="body2">• {post.author}</Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  color: alpha('#f8fafc', 0.82),
                  lineHeight: 1.8,
                  maxWidth: { xs: '100%', md: 620 }
                }}
              >
                {post.excerpt}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{ pt: 1, alignItems: { xs: 'center', md: 'flex-start' } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={post.cta.primaryCtaHref}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { sm: 5 },
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                    }
                  }}
                >
                  {post.cta.primaryCtaLabel}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={{ xs: 8, md: 10 }}>
          <Grid item xs={12} md={8}>
            <Stack spacing={5}>
              {post.sections.map((section) => (
                <Stack key={section.heading} spacing={2.5}>
                  <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}>
                    {section.heading}
                  </Typography>
                  {section.paragraphs?.map((paragraph, index) => (
                    <Typography key={index} variant="body1" sx={{ color: subtleText, lineHeight: 1.8 }}>
                      {paragraph}
                    </Typography>
                  ))}
                  {section.bullets && (
                    <Box component="ul" sx={{ pl: 3, color: subtleText }}>
                      {section.bullets.map((item) => (
                        <Typography key={item} component="li" variant="body1" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Stack>
              ))}

              <Divider sx={{ borderColor: alpha(theme.palette.divider, isDark ? 0.5 : 0.3) }} />

              <Stack spacing={2.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}>
                  {post.conclusion.heading}
                </Typography>
                {post.conclusion.paragraphs.map((paragraph, index) => (
                  <Typography key={index} variant="body1" sx={{ color: subtleText, lineHeight: 1.8 }}>
                    {paragraph}
                  </Typography>
                ))}
              </Stack>

              <Box
                sx={{
                  borderRadius: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.2)}`,
                  backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                  p: { xs: 4, md: 5 }
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}>
                    {post.cta.heading}
                  </Typography>
                  <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.8 }}>
                    {post.cta.description}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                    <Button
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to={post.cta.primaryCtaHref}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                        },
                      }}
                    >
                      {post.cta.primaryCtaLabel}
                    </Button>

                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <Box
                sx={{
                  borderRadius: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.96),
                  p: 3.5
                }}
              >
                <Stack spacing={2.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    Tags
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.2}>
                    {post.tags.map((tag) => (
                      <Chip key={tag} label={tag} sx={{ fontWeight: 600 }} />
                    ))}
                  </Stack>
                </Stack>
              </Box>

              <Box
                sx={{
                  borderRadius: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.96),
                  p: 3.5
                }}
              >
                <Stack spacing={2.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    Recent Articles
                  </Typography>
                  <Stack spacing={2.5}>
                    {blogPosts.slice(0, 3).map((item) => (
                      <Stack key={item.slug} spacing={0.5}>
                        <Typography
                          component={RouterLink}
                          to={`/blog/${item.slug}`}
                          sx={{
                            textDecoration: 'none',
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            '&:hover': { color: isDark ? '#67e8f9' : theme.palette.primary.main }
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: subtleText }}>
                          {item.readTime}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {relatedPosts.length > 0 && (
        <Box
         
        >
          <Container maxWidth="lg">
            <Stack
              spacing={3}
              sx={{
                mb: 6,
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}
              >
                Related Blogs
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: subtleText, maxWidth: 600 }}
              >
                Continue exploring insights curated by our full stack engineers,
                product strategists, and UX experts.
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {relatedPosts.map((related) => (
                <Grid item xs={12} md={4} key={related.slug}>
                  <BlogPreviewCard post={related} imageHeight={220} showExcerpt={false} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default BlogDetailPage;
