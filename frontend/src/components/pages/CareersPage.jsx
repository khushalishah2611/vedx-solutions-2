import { Box, Divider, alpha, useTheme, Container } from '@mui/material';
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

const CareersPage = () => {
  const { openDialog: handleOpenContact } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden', }}>
      <CareerHeroSection hero={careerHero} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >


        <Box my={5}><CareerStorySection story={careerStory} /></Box>
        <Box my={10}><Divider sx={{ borderColor: dividerColor }} /></Box>
        <Box my={10}><CareerBenefitsSection benefits={careerBenefits} /></Box>
        <Box my={10}> <CareerTrustedSection logos={careerLogos} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <CareerJourneySection journey={hiringJourney} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <CareerOpenRolesSection roles={careerOpenings} applyHref={careerHero.ctaHref} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesCTA onContactClick={handleOpenContact} /></Box>
      </Container>

    </Box>
  );
};

export default CareersPage;
