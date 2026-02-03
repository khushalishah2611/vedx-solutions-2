import { useEffect, useMemo, useState } from 'react';
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
import { useBannerByType } from '../../hooks/useBannerByType.js';
import { apiUrl } from '../../utils/const.js';
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
  const { banner } = useBannerByType('career');
  const [storyContent, setStoryContent] = useState(careerStory);
  const resolvedHero = useMemo(
    () => ({
      ...careerHero,
      title: banner?.title || careerHero.title,
      image: banner?.image || careerHero.image,
    }),
    [banner]
  );

  useEffect(() => {
    let isMounted = true;

    const loadStory = async () => {
      try {
        const res = await fetch(apiUrl('/api/career/story'));
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Unable to load career story');

        if (isMounted && data) {
          setStoryContent({
            ...careerStory,
            title: data.title || careerStory.title,
            description: data.description || careerStory.description,
            extendedDescription: data.extendedDescription || careerStory.body,
            imageBase: data.imageBase || careerStory.image,
            imageOverlay: data.imageOverlay || careerStory.image,
          });
        }
      } catch (error) {
        console.error('Failed to load career story', error);
      }
    };

    loadStory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden', }}>
      <CareerHeroSection hero={resolvedHero} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >


        <Box my={5}><CareerStorySection story={storyContent} /></Box>
        <Box my={10}><Divider sx={{ borderColor: dividerColor }} /></Box>
        <Box my={10}><CareerBenefitsSection benefits={careerBenefits} /></Box>
        <Box my={10}> <CareerTrustedSection logos={careerLogos} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <CareerJourneySection journey={hiringJourney} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <CareerOpenRolesSection roles={careerOpenings} applyHref={careerHero.ctaHref} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesCTA onContactClick={handleOpenContact} category="career" /></Box>
      </Container>

    </Box>
  );
};

export default CareersPage;
