import { useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { keyframes } from '@mui/system';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import { blogPosts, getBlogBySlug, getRelatedPosts } from '../../data/blogs.js';

// === ANIMATIONS ===
const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

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

  if (!post) return null;

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.75);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.5 : 0.3);

  const heroOverlay = isDark
    ? 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.92) 100%)'
    : 'linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.82) 100%)';

  const relatedPosts = getRelatedPosts(post.slug, post.category, post.tags);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* ---------- HERO SECTION ---------- */}
      <Box
        sx={{
          position: 'relative',
          color: '#fff',
          backgroundImage: `${heroOverlay}, url(${post.heroImage ?? post.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: isDark ? 'brightness(0.9)' : 'brightness(0.8)',
          overflow: 'hidden',
          minHeight: { xs: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 12, md: 14 },
          pt: { xs: 14, md: 18 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={5}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              alignItems: { xs: 'center', md: 'flex-start' },
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Breadcrumbs (mobile responsive) */}
            <Breadcrumbs
              separator={
                <NavigateNextIcon fontSize="small" sx={{ color: alpha('#e2e8f0', 0.9) }} />
              }
              aria-label="breadcrumb"
              sx={{
                color: alpha('#e2e8f0', 0.9),
                fontSize: { xs: 12, sm: 18 },
                '& .MuiBreadcrumbs-ol': {
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                },
                '& .MuiBreadcrumbs-li': {
                  display: 'flex',
                  alignItems: 'center',
                },
                '& a, & p': {
                  fontSize: { xs: 12, sm: 18 },
                  textAlign: { xs: 'center', md: 'left' },
                },
              }}
            >
              <MuiLink
                component={RouterLink}
                underline="hover"
                color="inherit"
                to="/"
              >
                Home
              </MuiLink>
              <MuiLink
                component={RouterLink}
                underline="hover"
                color="inherit"
                to="/blog"
              >
                Blog
              </MuiLink>
              <Typography color="inherit">{post.title}</Typography>
            </Breadcrumbs>

            {/* Title + Meta Info */}
            <Stack spacing={3} sx={{ maxWidth: 720 }}>
              {/* Category Label */}
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
                  width: 'fit-content',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {post.category}
                </Box>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 32, sm: 38, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.15,
                }}
              >
                {post.title}
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{
                  color: alpha('#f8fafc', 0.9),
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Typography variant="h6">{post.publishedOn}</Typography>
              </Stack>

              {/* CTA Button */}
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
                      background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                    },
                  }}
                >
                  {post.cta.primaryCtaLabel}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ---------- MAIN CONTENT ---------- */}
      <Container
        maxWidth={false}
        sx={{
          zIndex: 1,
          px: { xs: 3, md: 20 },
          py: { xs: 8, md: 10 },
        }}
      >
        <Box my={5}>
          <Grid container spacing={{ xs: 8, md: 10 }}>
            {/* Left: Article Content */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                opacity: 0,
                animation: `${slideInLeft} 0.7s ease-out forwards`,
                animationDelay: '0.1s',
              }}
            >
              <Stack spacing={5}>
                {post.sections.map((section) => (
                  <Stack key={section.heading} spacing={2.5}>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}
                    >
                      {section.heading}
                    </Typography>

                    {section.paragraphs?.map((p, i) => (
                      <Typography
                        key={i}
                        variant="body1"
                        sx={{ color: subtleText, lineHeight: 1.8 }}
                      >
                        {p}
                      </Typography>
                    ))}

                    {section.bullets && (
                      <Box component="ul" sx={{ pl: 3, color: subtleText }}>
                        {section.bullets.map((item) => (
                          <Typography
                            key={item}
                            component="li"
                            variant="body1"
                            sx={{ mb: 1.5, lineHeight: 1.7 }}
                          >
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Stack>
                ))}

                <Divider sx={{ borderColor: dividerColor }} />

                {/* Conclusion */}
                <Stack spacing={2.5}>
                  <Typography
                    variant="h4"
                    sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}
                  >
                    {post.conclusion.heading}
                  </Typography>
                  {post.conclusion.paragraphs.map((p, i) => (
                    <Typography
                      key={i}
                      variant="body1"
                      sx={{ color: subtleText, lineHeight: 1.8 }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Stack>

                {/* CTA Box */}
                <Box
                  sx={{
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.5 : 0.2
                    )}`,
                    backgroundColor: alpha(
                      theme.palette.primary.main,
                      isDark ? 0.12 : 0.08
                    ),
                    p: { xs: 4, md: 5 },
                  }}
                >
                  <Stack spacing={3}>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}
                    >
                      {post.cta.heading}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: subtleText, lineHeight: 1.8 }}
                    >
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
                            background:
                              'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
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

            {/* Right: Sidebar */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                opacity: 0,
                animation: `${slideInRight} 0.7s ease-out forwards`,
                animationDelay: '0.25s',
              }}
            >
              <Stack spacing={2}>
                {/* Tags */}
                <Box
                  sx={{
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.5 : 0.22
                    )}`,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      isDark ? 0.6 : 0.96
                    ),
                    p: 2.0,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                    >
                      Tags
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1.2}>
                      {post.tags.map((tag) => (
                        <Box
                          key={tag}
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
                            width: 'fit-content',
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              background:
                                'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {tag}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                {/* Recent Articles */}
                <Box
                  sx={{
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.5 : 0.22
                    )}`,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      isDark ? 0.6 : 0.96
                    ),
                    p: 2.0,
                  }}
                >
                  <Stack spacing={2.5}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                    >
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
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background:
                                  'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              },
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: subtleText }}>
                            {item.publishedOn ?? '10, Nov 2025'}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------- RELATED POSTS ---------- */}
        {relatedPosts.length > 0 && (
          <Box mt={10}>
            <Container maxWidth="lg">
              <Stack
                sx={{
                  mb: 6,
                  alignItems: 'center',
                  textAlign: 'center',
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
            </Container>
          </Box>
        )}

        <ServicesBlog showHeading={false} posts={relatedPosts} />
      </Container>
    </Box>
  );
};

export default BlogDetailPage;
