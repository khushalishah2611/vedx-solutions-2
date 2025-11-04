import { Box, Container, Divider, Stack } from '@mui/material';
import HeroSection from './hero/HeroSection.jsx';
import AdvantageGrid from './hero/AdvantageGrid.jsx';
import CreativeAgencySection from './sections/CreativeAgencySection.jsx';
import DifferentiatorPanels from './sections/DifferentiatorPanels.jsx';
import ReasonsGrid from './sections/ReasonsGrid.jsx';
import ProductShowcase from './sections/ProductShowcase.jsx';
import MetricsBar from './sections/MetricsBar.jsx';
import FAQAccordion from './sections/FAQAccordion.jsx';
import TestimonialHighlight from './sections/TestimonialHighlight.jsx';
import ServicesShowcase from './sections/ServicesShowcase.jsx';
import FooterSection from './sections/FooterSection.jsx';
import NavigationBar from './shared/NavigationBar.jsx';

const SiteLayout = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <NavigationBar />
    
      <HeroSection />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <CreativeAgencySection />
          <ServicesShowcase />
          <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
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
