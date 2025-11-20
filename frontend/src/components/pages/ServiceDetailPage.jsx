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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { serviceDetailContent } from '../../data/serviceDetailContent.js';
import { servicesHeroStats } from '../../data/servicesPage.js';
import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/servicepage/ServicesTechnologies.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';

const ServiceDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categorySlug, serviceSlug } = useParams();
  const { openDialog } = useContactDialog();

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
    openDialog();
  }, [openDialog]);

  if (!category || !service) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box sx={{ bgcolor: 'background.default',  overflowX: 'hidden' }}>
      <Box
        sx={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
            url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
    
          transform: 'scale(1.05)',
          transition: 'transform 0.6s ease, filter 0.6s ease',
          filter: isDark ? 'brightness(0.55)' : 'brightness(0.8)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '90vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 12, md: 14 },
          pt: { xs: 14, md: 18 }
        }}
      >
        <Container >
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
            <Grid
              container

              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Content */}
              <Grid item xs={12} md={6}>
                <Stack spacing={4}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: 38, sm: 46, md: 56 },
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    Full Stack Development Services
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: subtleText, maxWidth: 540, lineHeight: 1.7 }}
                  >
                    VedX Solutions offers full stack development services to help
                    achieve your business objectives across platforms. Our agile
                    squads deliver resilient, scalable solutions with zero
                    disruption to your operations.
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    href="#contact"
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
                    Contact us
                  </Button>

                  <Stack
                    spacing={{ xs: 3, sm: 5 }}
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    pt={2}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 2.5, sm: 4 }}
                    >
                      {servicesHeroStats.map((stat) => (
                        <Stack key={stat.label} spacing={0.5}>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: 28, md: 32 },
                              fontWeight: 700,
                              color: accentColor,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: subtleText, fontWeight: 500 }}
                          >
                            {stat.label}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>


            </Grid>
          </Stack>
        </Container>
      </Box>

     <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >

        <Box my={10}><ServicesHighlights onContactClick={handleOpenContact} /></Box> 
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesBenefits onContactClick={handleOpenContact} /></Box> 
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><FullStackDeveloper onContactClick={handleOpenContact} /></Box> 
        <Box my={10}><ServicesTechnologies /></Box> 
        <Divider sx={{ borderColor: dividerColor }} />
       <Box my={10}><ServicesWhyChoose /></Box>  
        <Divider sx={{ borderColor: dividerColor }} />
       <Box my={10}><ServicesProcess /></Box>  
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesIndustries /></Box> 
        <Divider sx={{ borderColor: dividerColor }} />
       <Box my={10}> <ServicesTestimonials /></Box> 
        <Divider sx={{ borderColor: dividerColor }} />
    <Box my={10}> <FAQAccordion /></Box>    
        <Divider sx={{ borderColor: dividerColor }} />
      <Box my={10}><ServicesCTA onContactClick={handleOpenContact} /></Box>   
        <Divider sx={{ borderColor: dividerColor }} />
      <Box my={10}> <ServicesBlog /></Box>  
     </Container>
    </Box>
  );
};

export default ServiceDetailPage;
