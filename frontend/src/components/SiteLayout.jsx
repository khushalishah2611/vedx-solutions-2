import { Box, Container, Divider, Stack } from '@mui/material';
import HeroSection from './hero/HeroSection.jsx';
import AdvantageGrid from './hero/AdvantageGrid.jsx';
import DifferentiatorPanels from './sections/DifferentiatorPanels.jsx';
import ReasonsGrid from './sections/ReasonsGrid.jsx';
import ProductShowcase from './sections/ProductShowcase.jsx';
import MetricsBar from './sections/MetricsBar.jsx';
import FAQAccordion from './sections/FAQAccordion.jsx';
import TestimonialHighlight from './sections/TestimonialHighlight.jsx';
import FooterSection from './sections/FooterSection.jsx';
import LoadingOverlay from './shared/LoadingOverlay.jsx';

const SiteLayout = () => {
  return (
    <Box>
      <LoadingOverlay />
      <HeroSection />
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Stack spacing={{ xs: 8, md: 12 }}>
          <AdvantageGrid />
          <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <DifferentiatorPanels />
          <MetricsBar />
          <ReasonsGrid />
          <ProductShowcase />
          <TestimonialHighlight />
          <FAQAccordion />
        </Stack>
      </Container>
      <FooterSection />
    </Box>
  );
};

export default SiteLayout;