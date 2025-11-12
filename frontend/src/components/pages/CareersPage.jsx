import { Box, Container } from '@mui/material';
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

const CareersPage = () => {
  const { openDialog: handleOpenContact } = useContactDialog();

  return (
    <Box sx={{ bgcolor: 'background.default', pb: { xs: 10, md: 16 } }}>
      <CareerHeroSection hero={careerHero} />
      <CareerStorySection story={careerStory} />
      <CareerBenefitsSection benefits={careerBenefits} />
      <CareerTrustedSection logos={careerLogos} />
      <CareerJourneySection journey={hiringJourney} />
      <CareerOpenRolesSection roles={careerOpenings} applyHref={careerHero.ctaHref} />
      <CareerPrimaryCTASection cta={careerCta} />
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 }, pb: { xs: 10, md: 14 } }}>
        <ServicesCTA onContactClick={handleOpenContact} />
      </Container>
    </Box>
  );
};

export default CareersPage;
