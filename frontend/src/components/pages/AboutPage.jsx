import { useEffect, useMemo, useState } from 'react';
import { Box, Divider, alpha, useTheme, Container } from '@mui/material';
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
import { useBannerByType } from '../../hooks/useBannerByType.js';
import { apiUrl } from '../../utils/const.js';

import {
  CareerBenefitsSection, CareerStorySection
} from '../sections/careerspage/index.js';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
const AboutPage = () => {
  const theme = useTheme();

  const dividerColor = alpha(theme.palette.divider, 0.6);
  const { openDialog: handleOpenContact } = useContactDialog();
  const { banner } = useBannerByType('about');
  const [missionVisionContent, setMissionVisionContent] = useState(aboutMissionVision);
  const [whyChooseConfig, setWhyChooseConfig] = useState({ title: '', description: '' });
  const [whyChooseItems, setWhyChooseItems] = useState([]);
  const resolvedHero = useMemo(
    () => ({
      ...aboutHero,
      title: banner?.title || aboutHero.title,
      baseImage: banner?.image || aboutHero.baseImage,
    }),
    [banner]
  );

  useEffect(() => {
    let isMounted = true;

    const loadMissionVision = async () => {
      try {
        const res = await fetch(apiUrl('/api/about/mission-vision'));
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Unable to load mission/vision');

        const next = {
          mission: data?.mission ? { title: data.mission.title, description: data.mission.description } : null,
          vision: data?.vision ? { title: data.vision.title, description: data.vision.description } : null,
        };

        if (isMounted && (next.mission || next.vision)) {
          setMissionVisionContent(next);
        }
      } catch (error) {
        console.error('Failed to load mission/vision', error);
      }
    };

    const loadWhyChoose = async () => {
      try {
        const [configRes, itemsRes] = await Promise.all([
          fetch(apiUrl('/api/about/why-choose/config')),
          fetch(apiUrl('/api/about/why-choose/items')),
        ]);

        const configData = await configRes.json();
        const itemsData = await itemsRes.json();

        if (configRes.ok && isMounted && configData) {
          setWhyChooseConfig({
            title: configData.title || '',
            description: configData.description || '',
          });
        }

        if (itemsRes.ok && isMounted && Array.isArray(itemsData)) {
          setWhyChooseItems(
            itemsData.map((item) => ({
              title: item.title || '',
              description: item.description || '',
              image: item.image || '',
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load about why-choose', error);
      }
    };

    loadMissionVision();
    loadWhyChoose();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      <AboutHeroSection hero={resolvedHero} stats={aboutStats} onCtaClick={handleOpenContact} />


      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >

        <Box my={5}><CareerStorySection story={careerStory} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesWhyChoose
            title={whyChooseConfig.title}
            description={whyChooseConfig.description}
            highlights={whyChooseItems}
            onContactClick={handleOpenContact}
          />
        </Box><Divider sx={{ borderColor: dividerColor }} />


        <Box my={10}><AboutMissionVisionSection content={missionVisionContent} /></Box>


        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><ServicesCTA onContactClick={handleOpenContact} category="about" /></Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
