import { Box, Container, Divider, alpha, useTheme } from '@mui/material';
import {
  careerBenefits,
  careerCta,
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
  CareerPrimaryCTASection,
  CareerStorySection,
  CareerTrustedSection
} from '../sections/careerspage/index.js';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
const CareersPage = () => {
  const { openDialog: handleOpenContact } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default',   overflow: 'hidden', }}>
      <CareerHeroSection hero={careerHero} />
      <PageSectionsContainer>


        <CareerStorySection story={careerStory} />
        <Divider sx={{ borderColor: dividerColor }} />
        <CareerBenefitsSection benefits={careerBenefits} />
        <CareerTrustedSection logos={careerLogos} />
        <CareerJourneySection journey={hiringJourney} />
        <CareerOpenRolesSection roles={careerOpenings} applyHref={careerHero.ctaHref} />
        <CareerPrimaryCTASection cta={careerCta} />
        <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 }, pb: { xs: 10, md: 14 } }}>
          <ServicesCTA onContactClick={handleOpenContact} />
        </Container>
      </PageSectionsContainer>

    </Box>
  );
};

export default CareersPage;
