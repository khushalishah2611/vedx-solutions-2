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
  useTheme
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { serviceDetailContent } from '../../data/serviceDetailContent.js';
import ServicesHighlights from '../sections/homepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/homepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/homepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/homepage/ServicesTechnologies.jsx';
import ServicesCTA from '../sections/homepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import ServicesWhyChoose from '../sections/homepage/ServicesWhyChoose.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';

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

  const handleOpenContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  if (!category || !service) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
            url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.25)}`
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
          <Stack spacing={5}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha('#fff', 0.75) }} />}
              aria-label="breadcrumb"
            >
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/services">
                {category.title}
              </MuiLink>
              <Typography sx={{ color: alpha('#fff', 0.85) }}>{service.name}</Typography>
            </Breadcrumbs>

            <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: 38, sm: 46, md: 56 },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: '#fff'
                    }}
                  >
                    {service.name}
                  </Typography>

                  <Typography variant="h6" sx={{ color: alpha('#fff', 0.85), fontWeight: 600 }}>
                    {category.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: alpha('#fff', 0.82), maxWidth: 560, lineHeight: 1.7 }}
                  >
                    {service.summary}
                  </Typography>

                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), maxWidth: 540 }}>
                    {category.description}
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleOpenContact}
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
                      Talk to our team
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/services"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: alpha('#fff', 0.5),
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 3, md: 4 },
                        '&:hover': {
                          borderColor: '#fff',
                          backgroundColor: alpha('#fff', 0.08)
                        }
                      }}
                    >
                      Explore all services
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card
                  sx={{
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.9 : 0.95),
                    borderRadius: 3,
                    boxShadow: '0 30px 60px rgba(15, 23, 42, 0.35)'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Outcomes we drive
                    </Typography>

                    <Stack spacing={1.5}>
                      {service.outcomes.map((outcome) => (
                        <Stack key={outcome} direction="row" spacing={1.5} alignItems="flex-start">
                          <ArrowForwardIcon sx={{ color: accentColor, mt: 0.5 }} />
                          <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                            {outcome}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={{ xs: 8, md: 12 }}>
          <Grid container spacing={4} component="section">
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  How we partner on {service.name.toLowerCase()}
                </Typography>
                <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.7 }}>
                  {service.summary}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Core capabilities
                </Typography>

                <Stack spacing={1.5}>
                  {service.capabilities.map((capability) => (
                    <Stack key={capability} direction="row" spacing={1.5} alignItems="flex-start">
                      <ArrowForwardIcon sx={{ color: accentColor, mt: 0.5 }} />
                      <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.6 }}>
                        {capability}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 40 }, fontWeight: 700 }}>
                What you receive
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Each engagement combines strategic planning, cross-functional delivery, and operational enablement so your team
                can launch and scale with confidence.
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {service.deliverables.map((deliverable) => (
                <Grid item xs={12} md={4} key={deliverable.title}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      p: { xs: 2.5, md: 3 },
                      border: `1px solid ${alpha(theme.palette.divider, 0.4)}`
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {deliverable.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
                      {deliverable.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />
          <PageSectionsContainer spacing={{ xs: 8, md: 12 }}>
            <ServicesHighlights onContactClick={handleOpenContact} />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesBenefits />
            <Divider sx={{ borderColor: dividerColor }} />
            <FullStackDeveloper onContactClick={handleOpenContact} />
            <ServicesTechnologies />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesWhyChoose />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesProcess />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesIndustries />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesTestimonials />
            <Divider sx={{ borderColor: dividerColor }} />
            <FAQAccordion />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesCTA onContactClick={handleOpenContact} />
            <Divider sx={{ borderColor: dividerColor }} />
            <ServicesBlog />
          </PageSectionsContainer>
        </Stack>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
