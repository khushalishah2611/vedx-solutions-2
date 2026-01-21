import { useCallback } from 'react';
import {
  Box,
  Container,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';

import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';

import ServicesHero from '../sections/servicepage/ServicesHero.jsx';
import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/servicepage/ServicesTechnologies.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';

import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';


const ServicesPage = ({ showHero = true }) => {
  const { openDialog } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  return (
    <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      {showHero && <ServicesHero onContactClick={handleOpenContact} />}

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
          <ServicesTechnologies />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesWhyChoose onContactClick={handleOpenContact} />
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

export default ServicesPage;
