import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { hireDeveloperDetailContent } from '../../data/hireDevelopers.js';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import PricingModels from '../shared/PricingModels.jsx';
import ServicesCTA from '../sections/homepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';

const SectionTitle = ({ eyebrow, title, description }) => (
  <Stack spacing={2} textAlign={{ xs: 'center', md: 'left' }}>
    {eyebrow ? (
      <Typography component="span" variant="overline" sx={{ letterSpacing: 1.5, color: 'primary.main' }}>
        {eyebrow}
      </Typography>
    ) : null}
    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 } }}>
      {title}
    </Typography>
    {description ? (
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: { xs: 'auto', md: 0 } }}>
        {description}
      </Typography>
    ) : null}
  </Stack>
);

const HireDeveloperDetailPage = () => {
  const theme = useTheme();
  const { categorySlug, roleSlug } = useParams();
  const navigate = useNavigate();
  const { openDialog } = useContactDialog();

  const category = hireDeveloperDetailContent[categorySlug ?? ''];
  const role = category?.roles?.[roleSlug ?? ''];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, roleSlug]);

  useEffect(() => {
    if (!category || !role) {
      navigate('/hire-developers', { replace: true });
    }
  }, [category, navigate, role]);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  const relatedRoles = useMemo(() => {
    if (!category) {
      return [];
    }

    return Object.entries(category.roles)
      .filter(([slug]) => slug !== roleSlug)
      .map(([slug, item]) => ({ slug, ...item }));
  }, [category, roleSlug]);

  if (!category || !role) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const heroOverlay = isDark ? 'rgba(8, 15, 30, 0.8)' : 'rgba(5, 12, 28, 0.75)';

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', overflowX: 'hidden' }}>
      <Box
        sx={{
          backgroundImage: `linear-gradient(${heroOverlay}, ${heroOverlay}), url(${role.heroImage || category.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: { xs: '70vh', md: '75vh' },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 12, md: 14 },
          borderBottom: `1px solid ${dividerColor}`
        }}
      >
        <Container>
          <Stack spacing={{ xs: 5, md: 6 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha('#fff', 0.7) }} />}
              aria-label="breadcrumb"
            >
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/hire-developers">
                {category.title}
              </MuiLink>
              <Typography sx={{ color: alpha('#fff', 0.85) }}>{role.name}</Typography>
            </Breadcrumbs>

            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Typography component="span" variant="overline" sx={{ letterSpacing: 2, color: alpha('#fff', 0.8) }}>
                    Dedicated talent · {category.title}
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: 40, sm: 48, md: 56 },
                      fontWeight: 800,
                      color: '#fff',
                      lineHeight: 1.1
                    }}
                  >
                    {role.heroTitle}
                  </Typography>
                  <Typography variant="h5" sx={{ color: alpha('#fff', 0.85), fontWeight: 500 }}>
                    {role.heroSubtitle}
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.75), maxWidth: 640 }}>
                    {role.heroDescription}
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      endIcon={<ArrowOutwardIcon />}
                      onClick={handleOpenContact}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: { xs: 16, md: 18 }
                      }}
                    >
                      {role.ctaLabel || 'Book a Consultation'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      color="inherit"
                      onClick={handleOpenContact}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#fff',
                        borderColor: alpha('#fff', 0.35),
                        '&:hover': {
                          borderColor: alpha('#fff', 0.6),
                          backgroundColor: alpha('#fff', 0.1)
                        }
                      }}
                    >
                      Talk to our experts
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Grid container spacing={2.5}>
                  {role.metrics?.map((metric) => (
                    <Grid item xs={12} sm={4} md={12} key={metric.label}>
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: alpha('#0f172a', isDark ? 0.7 : 0.6),
                          border: `1px solid ${alpha('#fff', 0.2)}`,
                          borderRadius: 3,
                          px: 3,
                          py: 3,
                          color: '#fff'
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          {metric.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), fontWeight: 500 }}>
                          {metric.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <PageSectionsContainer>
        <Stack spacing={{ xs: 8, md: 10 }}>
          <Stack spacing={4}>
            <SectionTitle
              eyebrow="Why VedX"
              title={`What our ${role.name.toLowerCase()} unlock`}
              description={role.relatedTagline}
            />
            <Grid container spacing={4}>
              {role.outcomes?.map((outcome) => (
                <Grid item xs={12} md={4} key={outcome.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08),
                      border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15)}`
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {outcome.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {outcome.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>

          <Divider sx={{ borderColor: dividerColor }} />

          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={5}>
              <SectionTitle
                eyebrow="Deep expertise"
                title="Where our specialists excel"
                description="Blend product thinking, engineering rigour, and platform mastery tailored to your stack."
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, isDark ? 0.6 : 1),
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.2)}`
                }}
              >
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {role.coreExpertise?.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      color="primary"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        '& .MuiChip-label': { px: 1.5, py: 0.75 }
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: dividerColor }} />

          <Stack spacing={4}>
            <SectionTitle
              eyebrow="Partnering models"
              title="Choose an engagement approach that fits"
              description="Right-size the collaboration with squads, augmentation, or managed services depending on your roadmap."
            />
            <Grid container spacing={3}>
              {role.engagementModels?.map((model) => (
                <Grid item xs={12} md={4} key={model.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.15)}`
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {model.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {model.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>

          {role.toolstack?.length ? (
            <Stack spacing={3}>
              <SectionTitle
                eyebrow="Tooling"
                title="Toolchain & platforms"
                description="Talent fluent in the platforms, languages, and automation that matter most to your organisation."
              />
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.15)}`
                }}
              >
                <Stack direction="row" flexWrap="wrap" gap={1.25}>
                  {role.toolstack.map((tool) => (
                    <Chip
                      key={tool}
                      label={tool}
                      sx={{
                        bgcolor: alpha('#020617', isDark ? 0.7 : 0.05),
                        color: isDark ? '#e2e8f0' : '#0f172a',
                        fontWeight: 600,
                        '& .MuiChip-label': { px: 1.5, py: 0.75 }
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Stack>
          ) : null}

          {relatedRoles.length ? (
            <Stack spacing={3}>
              <SectionTitle
                eyebrow="Explore more"
                title="Related roles we staff"
                description="Expand your bench with additional specialisations ready to embed alongside this capability."
              />
              <Grid container spacing={3}>
                {relatedRoles.slice(0, 6).map((related) => (
                  <Grid item xs={12} md={4} key={related.slug}>
                    <Paper
                      component={RouterLink}
                      to={`/hire-developers/${categorySlug}/${related.slug}`}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        textDecoration: 'none',
                        bgcolor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.95),
                        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.2)}`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: `0 20px 40px ${alpha('#0f172a', isDark ? 0.6 : 0.15)}`
                        }
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: 'primary.main', fontWeight: 700 }}>
                          {category.title}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {related.heroTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                          {related.heroSubtitle}
                        </Typography>
                        <Button
                          size="small"
                          endIcon={<ArrowOutwardIcon fontSize="small" />}
                          sx={{ mt: 1, alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600 }}
                        >
                          View role
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ) : null}

          <Divider sx={{ borderColor: dividerColor }} />

          <ServicesTestimonials />
          <Divider sx={{ borderColor: dividerColor }} />
          <FAQAccordion />
          <Divider sx={{ borderColor: dividerColor }} />
          <PricingModels />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesCTA onContactClick={handleOpenContact} />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesBlog />
        </Stack>
      </PageSectionsContainer>
    </Box>
  );
};

export default HireDeveloperDetailPage;
