import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { serviceDetailContent } from '../../data/serviceDetailContent.js';
import { blogPosts } from '../../data/blogs.js';
import BlogPreviewCard from '../shared/BlogPreviewCard.jsx';

const ServiceDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categorySlug, serviceSlug } = useParams();

  const category = serviceDetailContent[categorySlug ?? ''];
  const service = category?.services?.[serviceSlug ?? ''];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, serviceSlug]);

  useEffect(() => {
    if (!category || !service) {
      navigate('/services', { replace: true });
    }
  }, [category, navigate, service]);

  if (!category || !service) return null;

  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? theme.palette.primary.light : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);
  const relatedBlogs = blogPosts.slice(0, 3);

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)),
            url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.25)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 20 } }}>
          <Stack spacing={3}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: subtleText }} />}
              aria-label="breadcrumb"
            >
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/services">
                Services
              </MuiLink>
              <Typography color="#fff">{category.title}</Typography>
              <Typography sx={{ color: alpha('#fff', 0.85) }}>{service.name}</Typography>
            </Breadcrumbs>

            <Stack spacing={2.5}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 32, md: 44 },
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                {service.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: alpha('#fff', 0.85), maxWidth: 720 }}
              >
                {category.description}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/contact')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: { xs: 3.5, md: 5 },
                    py: { xs: 1.5, md: 1.75 },
                  }}
                >
                  Discuss Your Project
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/services"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    color: '#fff',
                    borderColor: alpha('#fff', 0.5),
                    px: { xs: 3.5, md: 5 },
                    py: { xs: 1.5, md: 1.75 },
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: alpha('#fff', 0.1),
                    },
                  }}
                >
                  View All Services
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ================= MAIN CONTENT ================= */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }}>
          {/* Left Column */}
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              {/* Overview Card */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.96),
                  boxShadow: isDark
                    ? '0 30px 60px rgba(15,23,42,0.45)'
                    : '0 30px 60px rgba(15,23,42,0.12)',
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Typography variant="overline" sx={{ fontWeight: 600, color: subtleText }}>
                        Overview
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {service.summary}
                      </Typography>
                    </Stack>

                    <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.3) }} />

                    <Stack spacing={2}>
                      <Typography variant="overline" sx={{ fontWeight: 600, color: subtleText }}>
                        Outcomes We Drive
                      </Typography>
                      <Stack spacing={1.5}>
                        {service.outcomes.map((outcome) => (
                          <Stack
                            key={outcome}
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                mt: 1,
                                borderRadius: '50%',
                                backgroundColor: accentColor,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: subtleText, lineHeight: 1.7 }}
                            >
                              {outcome}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Deliverables Card */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.55 : 0.98),
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Typography variant="overline" sx={{ fontWeight: 600, color: subtleText }}>
                      What You Receive
                    </Typography>
                    <Grid container spacing={2.5}>
                      {service.deliverables.map((item) => (
                        <Grid item xs={12} sm={6} key={item.title}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: subtleText, lineHeight: 1.6 }}
                            >
                              {item.description}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.3)}`,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(79,70,229,0.75))'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(147,197,253,0.45))',
                color: isDark ? '#f8fafc' : theme.palette.text.primary,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Stack spacing={1}>
                  <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                    Core Capabilities
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Expertise that activates your {service.name} roadmap
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {service.capabilities.map((capability) => (
                    <Stack key={capability} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          mt: 1,
                          borderRadius: '50%',
                          backgroundColor: isDark ? alpha('#fff', 0.9) : accentColor,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: isDark ? alpha('#fff', 0.85) : subtleText, lineHeight: 1.7 }}
                      >
                        {capability}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.3) }} />

                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Ready to explore how this fits your roadmap?
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/contact')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start' }}
                  >
                    Talk to an Expert
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ================= RELATED INSIGHTS ================= */}
      {relatedBlogs.length > 0 && (
        <Box
          sx={{
            bgcolor: isDark ? alpha('#0f172a', 0.92) : alpha('#eff6ff', 0.6),
            borderTop: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.25)}`,
            mt: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
            <Stack spacing={3} sx={{ mb: 6, alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}>
                Related Insights
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 640 }}>
                Dig deeper into the strategies, architectures, and best practices our specialists use to deliver
                measurable outcomes across full stack engagements.
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
                  px: { xs: 3, md: 4 },
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                  }
                }}
              >
                View All Blogs
              </Button>
            </Stack>

            <Grid container spacing={4}>
              {relatedBlogs.map((post) => (
                <Grid item xs={12} md={4} key={post.slug}>
                  <BlogPreviewCard post={post} imageHeight={220} showExcerpt={false} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default ServiceDetailPage;
