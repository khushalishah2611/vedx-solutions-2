import { Box, Container, Divider, Stack, alpha, useTheme } from '@mui/material';
import HeroSection from '../sections/homepage/HeroSection.jsx';
import CreativeAgencySection from '../sections/homepage/CreativeAgencySection.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ServicesShowcase from '../sections/homepage/ServicesShowcase.jsx';
import ServicesPage from './ServicesPage.jsx';

const HomePage = () => {
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroSection />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <CreativeAgencySection />

          <Divider sx={{ borderColor: dividerColor }} />

          <ServicesShowcase />

          <Divider sx={{ borderColor: dividerColor }} />

          <ServicesPage showHero={false} />

          {/* <FAQAccordion /> */}
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
