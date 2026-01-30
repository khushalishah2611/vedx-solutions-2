import { Box, Container, Divider, alpha, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';
import CreativeAgencySection from '../sections/homepage/CreativeAgencySection.jsx';
import HeroSection from '../sections/homepage/HeroSection.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesContact from '../sections/servicepage/ServicesContact.jsx';
import ServicesBusinessSolutions from '../sections/servicepage/ServicesBusinessSolutions.jsx';
import ServicesEngagementModels from '../sections/servicepage/ServicesEngagementModels.jsx';
import ServicesShowcase from '../sections/servicepage/ServicesShowcase.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';

const HomePage = () => {
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);
  const [contactPrefill, setContactPrefill] = useState('');

  const handleContactRequest = useCallback((projectType) => {
    setContactPrefill(projectType || '');
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroSection onRequestContact={handleContactRequest} />



      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >
        <Box my={5}>
          <CreativeAgencySection />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesShowcase />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <ServicesWhyChoose onRequestContact={handleContactRequest} />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}> <ServicesProcess apiPath="/api/process-steps" /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesIndustries /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesBusinessSolutions onRequestContact={handleContactRequest} />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesTestimonials /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesEngagementModels /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesContact contactType="contact" prefillProjectType={contactPrefill} />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesBlog showHeading />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
