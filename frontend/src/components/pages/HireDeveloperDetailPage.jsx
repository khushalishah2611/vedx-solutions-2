import { useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
  useTheme
} from '@mui/material';

import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import PricingModels from '../shared/PricingModels.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';

import { hireDeveloperDetailContent } from '../../data/hireDevelopers.js';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';

// Reusable section title – keep if you’ll use it later, otherwise you can delete it
const SectionTitle = ({ eyebrow, title, description }) => (
  <Stack spacing={2} textAlign={{ xs: 'center', md: 'left' }}>
    {eyebrow ? (
      <Typography
        component="span"
        variant="overline"
        sx={{ letterSpacing: 1.5, color: 'primary.main' }}
      >
        {eyebrow}
      </Typography>
    ) : null}

    <Typography
      variant="h3"
      sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 } }}
    >
      {title}
    </Typography>

    {description ? (
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', maxWidth: 720, mx: { xs: 'auto', md: 0 } }}
      >
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

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, roleSlug]);

  // Redirect if invalid category / role
  useEffect(() => {
    if (!category || !role) {
      navigate('/hire-developers', { replace: true });
    }
  }, [category, navigate, role]);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  const relatedRoles = useMemo(() => {
    if (!category?.roles) return [];
    return Object.entries(category.roles)
      .filter(([slug]) => slug !== roleSlug)
      .map(([slug, item]) => ({ slug, ...item }));
  }, [category, roleSlug]);

  // If redirecting, avoid rendering
  if (!category || !role) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const heroOverlay = isDark ? 'rgba(8, 15, 30, 0.8)' : 'rgba(5, 12, 28, 0.75)';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const servicesHeroStats = [
    { label: 'Projects Delivered', value: '120+' },
    { label: 'Senior Engineers', value: '60+' },
    { label: 'Client Countries', value: '10+' }
  ];

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden'
      }}
    >
      {/* === HERO SECTION === */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(${heroOverlay}, ${heroOverlay}), url(${
            role.heroImage || category.heroImage
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: { xs: '90vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 12, md: 14 },
          borderBottom: `1px solid ${dividerColor}`
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={{ xs: 5, md: 6 }}>
            <Breadcrumbs
              separator={
                <NavigateNextIcon
                  fontSize="small"
                  sx={{ color: alpha('#fff', 0.7) }}
                />
              }
              aria-label="breadcrumb"
            >
              <MuiLink
                component={RouterLink}
                underline="hover"
                color="#fff"
                to="/"
              >
                Home
              </MuiLink>

              <MuiLink
                component={RouterLink}
                underline="hover"
                color="#fff"
                to="/hire-developers"
              >
                {category.title}
              </MuiLink>

              <Typography sx={{ color: alpha('#fff', 0.85) }}>
                {role.name}
              </Typography>
            </Breadcrumbs>

            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={4}
            >
              <Grid item xs={12} md={7}>
                <Stack spacing={4}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: 36, sm: 44, md: 54 },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: '#fff'
                    }}
                  >
                    Hire Dedicated Remote Developers
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: alpha('#fff', 0.8),
                      maxWidth: 560,
                      lineHeight: 1.7
                    }}
                  >
                    Scale your engineering capacity with vetted VedX developers
                    who embed with your workflows from day one. Spin up agile
                    pods or individual experts to accelerate delivery without
                    compromising on quality.
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleOpenContact}
                      sx={{
                        minWidth: 180,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        background:
                          'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                        '&:hover': {
                          background:
                            'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                        }
                      }}
                    >
                      Book a Consultation
                    </Button>
                  </Stack>

                  {/* Stats */}
                  <Stack
                    spacing={{ xs: 3, sm: 5 }}
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    pt={2}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 2.5, sm: 4 }}
                    >
                      {servicesHeroStats.map((stat) => (
                        <Stack key={stat.label} spacing={0.5}>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: 28, md: 32 },
                              fontWeight: 700,
                              color: accentColor
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              color: alpha('#fff', 0.8),
                              fontWeight: 500
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>

              {/* If later you want a right column (image/cards), add a Grid item here */}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* === MAIN CONTENT === */}
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 }
        }}
      >
        <Box my={5}>
          <ServicesHighlights onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesBenefits onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <FullStackDeveloper onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <ServicesWhyChoose />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesProcess />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesIndustries />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesTestimonials />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <FAQAccordion />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <PricingModels />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesCTA onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesBlog />
        </Box>
      </Container>
    </Box>
  );
};

export default HireDeveloperDetailPage;
