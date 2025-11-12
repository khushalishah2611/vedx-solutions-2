import {
  Box,
  Divider,
  useTheme, alpha
} from '@mui/material';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import {
  aboutHero,
  aboutStats,
  aboutHighlights,
  aboutMissionVision,
} from '../../data/company.js';
import {
  AboutHeroSection,
  AboutMissionVisionSection,
  AboutWhyChooseSection,
} from '../sections/aboutpage/index.js';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';


import {

  CareerStorySection,

} from '../sections/careerspage/index.js';

const AboutPage = () => {
  const theme = useTheme();

  const dividerColor = alpha(theme.palette.divider, 0.6);
  const { openDialog: handleOpenContact } = useContactDialog();

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      <AboutHeroSection hero={aboutHero} stats={aboutStats} onCtaClick={handleOpenContact} />


      <PageSectionsContainer>
        <CareerStorySection story={careerStory} />
        <Divider sx={{ borderColor: dividerColor }} />
        <AboutWhyChooseSection highlights={aboutHighlights} />
        <Divider sx={{ borderColor: dividerColor }} />
        <AboutMissionVisionSection content={aboutMissionVision} />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesCTA onContactClick={handleOpenContact} />
      </PageSectionsContainer>
    </Box>
  );
};

export default AboutPage;
