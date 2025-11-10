import { Box, Container, Divider, Stack, alpha, useTheme } from '@mui/material';
import ServicesHero from '../sections/homepage/ServicesHero.jsx';
import ServicesHighlights from '../sections/homepage/ServicesHighlights.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesBusinessSolutions from '../sections/homepage/ServicesBusinessSolutions.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import ServicesEngagementModels from '../sections/homepage/ServicesEngagementModels.jsx';
import ServicesContact from '../shared/ServicesContact.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';

const ServicesPage = ({ showHero = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {showHero && <ServicesHero />}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Stack spacing={{ xs: 6, md: 10 }}>
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
          <FAQAccordion/>
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesBlog />
        </Stack>
      </Container>
    </Box>
  );
};

export default ServicesPage;
