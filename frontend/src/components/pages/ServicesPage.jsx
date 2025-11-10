import { Box, Container, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import ServicesHero from '../sections/homepage/ServicesHero.jsx';
import ServicesHighlights from '../sections/homepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/homepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/homepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/homepage/ServicesTechnologies.jsx';
import ServicesWhyChoose from '../sections/homepage/ServicesWhyChoose.jsx';
import ServicesCTA from '../sections/homepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ContactDialog from '../shared/ContactDialog.jsx';

const ServicesPage = ({ showHero = true }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleOpenContact = useCallback(() => setIsContactOpen(true), []);
  const handleCloseContact = useCallback(() => setIsContactOpen(false), []);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {showHero && <ServicesHero onContactClick={handleOpenContact} />}
      <Container maxWidth="lg" sx={{ pb: { xs: 10, md: 14 } }}>
        <Stack spacing={{ xs: 6, md: 10 }}>
          <ServicesHighlights onContactClick={handleOpenContact} />
          <ServicesBenefits />
          <FullStackDeveloper onContactClick={handleOpenContact} />
          <ServicesTechnologies />
          <ServicesWhyChoose />
          <ServicesCTA onContactClick={handleOpenContact} />
          <ServicesBlog />
          <FAQAccordion />
        </Stack>
      </Container>
      <ContactDialog open={isContactOpen} onClose={handleCloseContact} />
    </Box>
  );
};

export default ServicesPage;
