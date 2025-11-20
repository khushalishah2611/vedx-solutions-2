import { Box, Container, Divider, alpha, useTheme } from '@mui/material';
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

const HomePage = () => {
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroSection />

      {/* All sections wrapped inside common padding */}
      <Container maxWidth={false}
        sx={{
            px: { xs:3, md: 20} ,
        }}>
        <Box my={10}>
          <CreativeAgencySection />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesShowcase />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <ServicesWhyChoose /></Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}> <ServicesProcess /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesIndustries /></Box>  
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesBusinessSolutions /></Box>  
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesTestimonials /></Box> 
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesEngagementModels /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}> <ServicesContact /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesBlog /></Box>
      </Container>
    </Box>
  );
};

export default HomePage;
