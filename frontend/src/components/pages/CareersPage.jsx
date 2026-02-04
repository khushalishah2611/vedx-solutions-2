import { useCallback, useEffect, useMemo, useState } from 'react';
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
  // CareerTrustedSection
} from '../sections/careerspage/index.js';

const CareersPage = () => {
  const { openDialog: handleOpenContact } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);
  const { banner } = useBannerByType('career');
  const [storyContent, setStoryContent] = useState(careerStory);
  const defaultBenefitsContent = useMemo(
    () => ({
      title: 'Why You Will Love Working With Us',
      description: 'The benefits, culture, and support you need to do your best work.',
      items: careerBenefits,
    }),
    []
  );
  const defaultTechnologyContent = useMemo(
    () => ({
      title: 'Trusted Technology Partners',
      description: 'We collaborate with platforms and tools our teams love working with.',
      items: careerLogos,
    }),
    []
  );
  const defaultHiringContent = useMemo(
    () => ({
      title: 'Hiring Journey',
      description: 'A transparent process designed to help you showcase your strengths.',
      items: hiringJourney,
    }),
    []
  );

  const [benefitsContent, setBenefitsContent] = useState(defaultBenefitsContent);
  const [technologyContent, setTechnologyContent] = useState(defaultTechnologyContent);
  const [hiringContent, setHiringContent] = useState(defaultHiringContent);
  const [openRoles, setOpenRoles] = useState(careerOpenings);
  const resolvedHero = useMemo(
    () => ({
      ...careerHero,
      title: banner?.title || careerHero.title,
      image: banner?.image || careerHero.image,
    }),
    [banner]
  );
  const handleApplyNow = useCallback(
    (role) => {
      handleOpenContact(role?.id ?? '');
    },
    [handleOpenContact]
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

    const loadBenefits = async () => {
      try {
        const [configRes, itemsRes] = await Promise.all([
          fetch(apiUrl('/api/career/benefits/config')),
          fetch(apiUrl('/api/career/benefits')),
        ]);
        const configData = await configRes.json();
        const itemsData = await itemsRes.json();
        if (!configRes.ok) throw new Error(configData?.error || 'Unable to load career benefits config');
        if (!itemsRes.ok) throw new Error(itemsData?.error || 'Unable to load career benefits');

        if (isMounted) {
          setBenefitsContent({
            title: configData?.title || defaultBenefitsContent.title,
            description: configData?.description || defaultBenefitsContent.description,
            items: Array.isArray(itemsData) && itemsData.length > 0
              ? itemsData.map((item) => ({
                title: item.title,
                description: item.description,
                icon: item.image,
              }))
              : defaultBenefitsContent.items,
          });
        }
      } catch (error) {
        console.error('Failed to load career benefits', error);
      }
    };

    const loadTechnologies = async () => {
      try {
        const [configRes, itemsRes] = await Promise.all([
          fetch(apiUrl('/api/career/technologies/config')),
          fetch(apiUrl('/api/career/technologies')),
        ]);
        const configData = await configRes.json();
        const itemsData = await itemsRes.json();
        if (!configRes.ok) throw new Error(configData?.error || 'Unable to load career technology config');
        if (!itemsRes.ok) throw new Error(itemsData?.error || 'Unable to load career technologies');

        if (isMounted) {
          setTechnologyContent({
            title: configData?.title || defaultTechnologyContent.title,
            description: configData?.description || defaultTechnologyContent.description,
            items: Array.isArray(itemsData) && itemsData.length > 0
              ? itemsData.map((item) => ({
                name: item.name,
                logo: item.image,
              }))
              : defaultTechnologyContent.items,
          });
        }
      } catch (error) {
        console.error('Failed to load career technologies', error);
      }
    };

    const loadHiring = async () => {
      try {
        const [configRes, itemsRes] = await Promise.all([
          fetch(apiUrl('/api/career/hiring/config')),
          fetch(apiUrl('/api/career/hiring')),
        ]);
        const configData = await configRes.json();
        const itemsData = await itemsRes.json();
        if (!configRes.ok) throw new Error(configData?.error || 'Unable to load hiring config');
        if (!itemsRes.ok) throw new Error(itemsData?.error || 'Unable to load hiring steps');

        if (isMounted) {
          setHiringContent({
            title: configData?.title || defaultHiringContent.title,
            description: configData?.description || defaultHiringContent.description,
            items: Array.isArray(itemsData) && itemsData.length > 0
              ? itemsData.map((item) => ({
                step: item.step,
                title: item.title,
                description: item.description,
              }))
              : defaultHiringContent.items,
          });
        }
      } catch (error) {
        console.error('Failed to load hiring journey', error);
      }
    };

    const loadOpenRoles = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const endpoint = adminToken ? '/api/admin/careers/jobs' : '/api/careers/jobs';
        const res = await fetch(apiUrl(endpoint), {
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Unable to load careers');

        if (isMounted) {
          setOpenRoles(
            Array.isArray(data?.jobs) && data.jobs.length > 0
              ? data.jobs.map((job) => ({
                id: job.id,
                title: job.title,
                experience: job.experience || '',
                positions: job.position || '',
                type: job.employmentType || '',
                description: job.description || '',
              }))
              : careerOpenings
          );
        }
      } catch (error) {
        console.error('Failed to load career jobs', error);
      }
    };

    loadStory();
    loadBenefits();
    loadTechnologies();
    loadHiring();
    loadOpenRoles();

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
        <Box my={10}>
          <CareerBenefitsSection
            benefits={benefitsContent.items}
            title={benefitsContent.title}
            description={benefitsContent.description}
          />
        </Box>
        {/* <Box my={10}>
          <CareerTrustedSection
            logos={technologyContent.items}
            title={technologyContent.title}
            description={technologyContent.description}
          />
        </Box> */}
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <CareerJourneySection
            journey={hiringContent.items}
            title={hiringContent.title}
            description={hiringContent.description}
          />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <CareerOpenRolesSection
            roles={openRoles}
            applyHref={careerHero.ctaHref}
            onApply={handleApplyNow}
          />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <ServicesCTA apiPath="/api/career/cta" />
        </Box>
      </Container>

    </Box>
  );
};

export default CareersPage;
