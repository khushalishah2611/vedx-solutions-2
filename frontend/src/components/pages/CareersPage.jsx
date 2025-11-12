import { Box,  Divider, alpha, useTheme } from '@mui/material';
import {
  careerBenefits,
  careerHero,
  careerLogos,
  careerOpenings,
  careerStory,
  hiringJourney
} from '../../data/company.js';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import {
  CareerBenefitsSection,
  CareerHeroSection,
  CareerJourneySection,
  CareerOpenRolesSection,
  CareerStorySection,
  CareerTrustedSection
} from '../sections/careerspage/index.js';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
const CareersPage = () => {
  const { openDialog: handleOpenContact } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden', }}>
      <CareerHeroSection hero={careerHero} />
      <PageSectionsContainer>


        <CareerStorySection story={careerStory} />
        <Divider sx={{ borderColor: dividerColor }} />
        <CareerBenefitsSection benefits={careerBenefits} />
        <CareerTrustedSection logos={careerLogos} />
        <Divider sx={{ borderColor: dividerColor }} />
        <CareerJourneySection journey={hiringJourney} />
        <Divider sx={{ borderColor: dividerColor }} />
        <CareerOpenRolesSection roles={careerOpenings} applyHref={careerHero.ctaHref} />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesCTA onContactClick={handleOpenContact} />
      </PageSectionsContainer>

    </Box>
  );
};

export default CareersPage;
