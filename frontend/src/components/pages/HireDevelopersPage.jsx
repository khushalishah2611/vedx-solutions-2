import { Box, Divider, alpha, useTheme, Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import HireDevelopersHero from '../sections/hiredeveloperspage/HireDevelopersHero.jsx';
import ServicesTechnologies from '../sections/servicepage/ServicesTechnologies.jsx';
import { apiUrl } from '../../utils/const.js';

const HireDevelopersPage = () => {
  const { openDialog } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);
  const [benefits, setBenefits] = useState([]);
  const [benefitConfig, setBenefitConfig] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [heroConfig, setHeroConfig] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadBenefits = async () => {
      try {
        const configResponse = await fetch(apiUrl('/api/hire-developer/benefit-configs'));
        const configData = await configResponse.json();
        if (!configResponse.ok) {
          throw new Error(configData?.error || 'Unable to load hire benefit configs');
        }

        const config = Array.isArray(configData) ? configData[0] : configData;
        const params = new URLSearchParams();
        if (config?.id) params.append('benefitConfigId', String(config.id));

        const response = await fetch(
          apiUrl(`/api/hire-developer/benefits${params.toString() ? `?${params.toString()}` : ''}`)
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load hire benefits');
        }

        if (!isMounted) return;
        setBenefitConfig(config || null);
        setBenefits(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load hire benefits', error);
      }
    };

    const loadTechnologies = async () => {
      try {
        const response = await fetch(apiUrl('/api/hire-developer/technologies'));
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load hire technologies');
        }
        if (!isMounted) return;
        setTechnologies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load hire technologies', error);
      }
    };

    loadBenefits();
    loadTechnologies();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHeroConfig = async () => {
      try {
        const response = await fetch(apiUrl('/api/hire-developer/services'));
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load hire developer services');
        }
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        setHeroConfig(list[0] || null);
      } catch (error) {
        console.error('Failed to load hire developer hero data', error);
      }
    };

    loadHeroConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  return (
    <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      <HireDevelopersHero
        onContactClick={handleOpenContact}
        title={heroConfig?.bannerTitle}
        description={heroConfig?.bannerSubtitle || heroConfig?.description}
        backgroundImage={heroConfig?.bannerImage}
        stats={[
          heroConfig?.totalServices ? { label: 'Total services', value: `${heroConfig.totalServices}+` } : null,
          heroConfig?.totalProjects ? { label: 'Total projects', value: `${heroConfig.totalProjects}+` } : null,
          heroConfig?.totalClients ? { label: 'Total clients', value: `${heroConfig.totalClients}+` } : null,
        ].filter(Boolean)}
      />


      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >

        <Box my={5}>
          <ServicesHighlights
            onContactClick={handleOpenContact}
            configPath="/api/hire-developer/why-choose"
            servicesPath="/api/hire-developer/why-choose-services"
            configIdParam="whyChooseConfigId"
          />
        </Box>

        <Box my={10}><Divider sx={{ borderColor: dividerColor }} /></Box>

        <Box my={10}>
          <ServicesBenefits
            onContactClick={handleOpenContact}
            title={benefitConfig?.title}
            description={benefitConfig?.description}
            benefits={benefits}
          />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <FullStackDeveloper onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}><ServicesTechnologies technologyGroups={technologies} /></Box>

        <Box my={10}>
          <ServicesWhyChoose onContactClick={handleOpenContact} mode="hire" />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesProcess apiPath="/api/hire-developer/processes" />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesIndustries />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesTestimonials />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <FAQAccordion faqs={heroConfig?.faqs} />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesCTA
            onContactClick={handleOpenContact}
            apiPath="/api/hire-developer/contact-buttons"
          />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesBlog />
        </Box>
      </Container>
    </Box>
  );
};

export default HireDevelopersPage;
