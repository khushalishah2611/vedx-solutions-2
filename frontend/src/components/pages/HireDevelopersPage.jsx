import { Box, Divider, alpha, useTheme, Container } from '@mui/material';
import { useCallback } from 'react';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import HireDevelopersHero from '../sections/hiredeveloperspage/HireDevelopersHero.jsx';

const HireDevelopersPage = () => {
  const { openDialog } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  return (
    <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      <HireDevelopersHero onContactClick={handleOpenContact} />


      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >

        <Box my={5}><ServicesHighlights onContactClick={handleOpenContact} /></Box>

        <Box my={10}><Divider sx={{ borderColor: dividerColor }} /></Box>

        <Box my={10}>
          <ServicesBenefits onContactClick={handleOpenContact} />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <FullStackDeveloper onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <ServicesWhyChoose />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesProcess />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesIndustries />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesTestimonials />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <FAQAccordion />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesCTA onContactClick={handleOpenContact} />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesBlog />
        </Box>
      </Container>
    </Box>
  );
};

export default HireDevelopersPage;
