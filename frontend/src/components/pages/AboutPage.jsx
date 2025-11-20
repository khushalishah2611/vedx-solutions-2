import {
  Box,
  Divider,
  alpha,
  useTheme,Container
} from '@mui/material';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import {
  aboutHero,
  aboutStats,
  careerBenefits,
  aboutMissionVision,
  careerStory,
} from '../../data/company.js';
import {
  AboutHeroSection,
  AboutMissionVisionSection,
} from '../sections/aboutpage/index.js';

import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';

import {
  CareerBenefitsSection, CareerStorySection
} from '../sections/careerspage/index.js';
const AboutPage = () => {
  const theme = useTheme();

  const dividerColor = alpha(theme.palette.divider, 0.6);
  const { openDialog: handleOpenContact } = useContactDialog();

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      <AboutHeroSection hero={aboutHero} stats={aboutStats} onCtaClick={handleOpenContact} />


      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >

        <Box my={5}><CareerStorySection story={careerStory} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
      
        <Box my={10}><CareerBenefitsSection benefits={careerBenefits} /></Box>  
        <Divider sx={{ borderColor: dividerColor }} />
      
        <Box my={10}><AboutMissionVisionSection content={aboutMissionVision} /></Box>  
        <Divider sx={{ borderColor: dividerColor }} />
       
        <Box my={10}><ServicesCTA onContactClick={handleOpenContact} /></Box> 
      </Container>
    </Box>
  );
};

export default AboutPage;
