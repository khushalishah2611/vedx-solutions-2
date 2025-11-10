import { Box, Container, Divider, Stack, alpha, useTheme } from '@mui/material';
import ServicesHero from './services/ServicesHero.jsx';
import ServicesHighlights from './services/ServicesHighlights.jsx';
import ServicesProcess from './services/ServicesProcess.jsx';
import ServicesIndustries from './services/ServicesIndustries.jsx';
import ServicesBusinessSolutions from './services/ServicesBusinessSolutions.jsx';
import ServicesTestimonials from './services/ServicesTestimonials.jsx';
import ServicesEngagementModels from './services/ServicesEngagementModels.jsx';
import ServicesContact from './services/ServicesContact.jsx';
import ServicesBlog from './services/ServicesBlog.jsx';

const ServicesPage = ({ showHero = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {showHero && <ServicesHero />}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Stack spacing={{ xs: 6, md: 10 }}>
       
          <ServicesHighlights />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesProcess />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesIndustries />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesBusinessSolutions />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesTestimonials />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesEngagementModels />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesContact />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesBlog />
        </Stack>
      </Container>
    </Box>
  );
};

export default ServicesPage;
