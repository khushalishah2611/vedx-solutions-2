import { Box, Divider, alpha, useTheme } from '@mui/material';
import CreativeAgencySection from '../sections/homepage/CreativeAgencySection.jsx';
import HeroSection from '../sections/homepage/HeroSection.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesBusinessSolutions from '../sections/servicepage/ServicesBusinessSolutions.jsx';
import ServicesContact from '../sections/servicepage/ServicesContact.jsx';
import ServicesEngagementModels from '../sections/servicepage/ServicesEngagementModels.jsx';

import ServicesShowcase from '../sections/servicepage/ServicesShowcase.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';

const HomePage = () => {
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroSection />

      <PageSectionsContainer>
        <CreativeAgencySection />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesShowcase />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesWhyChoose />
        <Divider sx={{ borderColor: dividerColor }} />
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
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesBlog />
      </PageSectionsContainer>
    </Box>
  );
};

export default HomePage;
