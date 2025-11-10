import {
  Box, Container, Stack, Divider, alpha, useTheme
} from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesHero from '../sections/homepage/ServicesHero.jsx';
import ServicesHighlights from '../sections/homepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/homepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/homepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/homepage/ServicesTechnologies.jsx';
import ServicesCTA from '../sections/homepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';

const ServicesPage = ({ showHero = true }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);
  const handleOpenContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {showHero && <ServicesHero onContactClick={handleOpenContact} />}
      <Container maxWidth="lg" sx={{ pb: { xs: 10, md: 14 } }}>
        <Stack spacing={{ xs: 6, md: 10 }}>

          <ServicesHighlights onContactClick={handleOpenContact} />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesBenefits />
          <Divider sx={{ borderColor: dividerColor }} />
          <FullStackDeveloper onContactClick={handleOpenContact} />
          <ServicesTechnologies />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesCTA onContactClick={handleOpenContact} />
          <Divider sx={{ borderColor: dividerColor }} />
          <ServicesBlog />
          <Divider sx={{ borderColor: dividerColor }} />

          <FAQAccordion />
        </Stack>
      </Container>
    </Box>
  );
};

export default ServicesPage;
