import { Box, Container, Divider, Stack, alpha, useTheme } from '@mui/material';
import HeroSection from '../hero/HeroSection.jsx';
import AdvantageGrid from '../hero/AdvantageGrid.jsx';
import CreativeAgencySection from '../sections/CreativeAgencySection.jsx';
import DifferentiatorPanels from '../sections/DifferentiatorPanels.jsx';
import ReasonsGrid from '../sections/ReasonsGrid.jsx';
import ProductShowcase from '../sections/ProductShowcase.jsx';
import MetricsBar from '../sections/MetricsBar.jsx';
import FAQAccordion from '../sections/FAQAccordion.jsx';
import TestimonialHighlight from '../sections/TestimonialHighlight.jsx';
import ServicesShowcase from '../sections/ServicesShowcase.jsx';

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
          <AdvantageGrid />
          <Divider sx={{ borderColor: dividerColor }} />
          <DifferentiatorPanels />
          <MetricsBar />
          <ReasonsGrid />
          <ProductShowcase />
          <TestimonialHighlight />
          <FAQAccordion />
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
