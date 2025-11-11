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
import { useNavigate } from 'react-router-dom';
import ServicesHero from '../sections/homepage/ServicesHero.jsx';
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

  if (!category || !service) return null;

  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);

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
                {category.title}
              </MuiLink>

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
        <PageSectionsContainer>
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
      </Container>

    </Box>
  );
};

export default ServiceDetailPage;
