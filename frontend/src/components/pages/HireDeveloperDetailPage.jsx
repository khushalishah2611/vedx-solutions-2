import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Container, Divider, alpha, useTheme } from '@mui/material';

import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import ServicesTechnologies from '../sections/servicepage/ServicesTechnologies.jsx';
import HireDeveloperHero from '../sections/servicepage/HireDeveloperHero.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import PricingModels from '../shared/PricingModels.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';

import { hireDeveloperDetailContent } from '../../data/hireDevelopers.js';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import { useServiceHireCatalog } from '../../hooks/useServiceHireCatalog.js';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const HireDeveloperDetailPage = () => {
  const theme = useTheme();
  const { categorySlug, roleSlug } = useParams();
  const navigate = useNavigate();
  const { openDialog } = useContactDialog();
  const { fetchWithLoading } = useLoadingFetch();
  const { hireCategories, hireRoles, isLoading } = useServiceHireCatalog();
  const [benefits, setBenefits] = useState([]);
  const [benefitConfig, setBenefitConfig] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [serviceConfig, setServiceConfig] = useState(null);

  const category = hireDeveloperDetailContent[categorySlug ?? ''];
  const role = category?.roles?.[roleSlug ?? ''];
  const apiCategory = useMemo(
    () => hireCategories.find((item) => item.slug === categorySlug),
    [categorySlug, hireCategories]
  );
  const apiRole = useMemo(
    () => hireRoles.find((item) => item.slug === roleSlug),
    [hireRoles, roleSlug]
  );

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, roleSlug]);

  // Redirect if invalid category / role
  useEffect(() => {
    if (!category && !role && !apiCategory && !apiRole && !isLoading) {
      navigate('/hire-developers', { replace: true });
    }
  }, [apiCategory, apiRole, category, isLoading, navigate, role]);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  const resolvedCategory = apiCategory ?? category;
  const resolvedRole = apiRole ?? role;
  const categoryName = resolvedCategory?.title ?? resolvedCategory?.name;
  const roleName = resolvedRole?.title ?? resolvedRole?.name;
  const normalizedRoleName = useMemo(
    () => (roleName || '').trim().toLowerCase(),
    [roleName]
  );

  useEffect(() => {
    if (!categoryName && !roleName) return;
    let isMounted = true;

    const params = new URLSearchParams();
    if (categoryName) params.append('category', categoryName);
    if (roleName) params.append('subcategory', roleName);

    const loadBenefits = async () => {
      try {
        const configResponse = await fetchWithLoading(
          apiUrl(`/api/hire-developer/benefit-configs?${params.toString()}`)
        );
        const configData = await configResponse.json();
        if (!configResponse.ok) {
          throw new Error(configData?.error || 'Unable to load hire benefit configs');
        }

        const config = Array.isArray(configData) ? configData[0] : configData;
        const benefitParams = new URLSearchParams(params);
        if (config?.id) benefitParams.append('benefitConfigId', String(config.id));

        const response = await fetchWithLoading(
          apiUrl(`/api/hire-developer/benefits?${benefitParams.toString()}`)
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
        const response = await fetchWithLoading(apiUrl('/api/hire-developer/technologies'));
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
  }, [categoryName, fetchWithLoading, roleName]);

  useEffect(() => {
    if (!categoryName && !roleName) return;
    let isMounted = true;

    const params = new URLSearchParams();
    if (categoryName) params.append('category', categoryName);

    const loadServiceConfig = async () => {
      try {
        const response = await fetchWithLoading(
          apiUrl(`/api/hire-developer/services${params.toString() ? `?${params.toString()}` : ''}`)
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load hire developer services');
        }

        const list = Array.isArray(data) ? data : [];
        let selected = list[0] || null;

        if (normalizedRoleName) {
          const matched = list.find((service) =>
            (service?.subcategories ?? []).some(
              (sub) => String(sub || '').trim().toLowerCase() === normalizedRoleName
            )
          );
          selected = matched || selected;
        }

        if (!isMounted) return;
        setServiceConfig(selected);
      } catch (error) {
        console.error('Failed to load hire developer services', error);
      }
    };

    loadServiceConfig();

    return () => {
      isMounted = false;
    };
  }, [categoryName, fetchWithLoading, normalizedRoleName]);

  // If redirecting, avoid rendering
  if (!category && !role && !apiCategory && !apiRole && isLoading) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const categoryHref = categorySlug ? `/hire-developers/${categorySlug}` : '/hire-developers';

  const servicesHeroStats = useMemo(() => {
    const totalServices = serviceConfig?.totalServices;
    const totalProjects = serviceConfig?.totalProjects;
    const totalClients = serviceConfig?.totalClients;

    if (totalServices || totalProjects || totalClients) {
      return [
        totalServices ? { label: 'Total services', value: `${totalServices}+` } : null,
        totalProjects ? { label: 'Total projects', value: `${totalProjects}+` } : null,
        totalClients ? { label: 'Total clients', value: `${totalClients}+` } : null,
      ].filter(Boolean);
    }

    return [
      { label: 'Projects Delivered', value: '120+' },
      { label: 'Senior Engineers', value: '60+' },
      { label: 'Client Countries', value: '10+' },
    ];
  }, [serviceConfig?.totalClients, serviceConfig?.totalProjects, serviceConfig?.totalServices]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden'
      }}
    >
      {/* === HERO SECTION === */}
      <HireDeveloperHero
        category={resolvedCategory}
        role={resolvedRole}
        stats={servicesHeroStats}
        onContactClick={handleOpenContact}
        dividerColor={dividerColor}
        categoryHref={categoryHref}
        heroTitle={serviceConfig?.bannerTitle}
        heroDescription={serviceConfig?.bannerSubtitle || serviceConfig?.description}
        heroImage={serviceConfig?.bannerImage}
      />

      {/* === MAIN CONTENT === */}
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 }
        }}
      >
        <Box my={5}>
          <ServicesHighlights
            onContactClick={handleOpenContact}
            category={categoryName}
            subcategory={roleName}
            configPath="/api/hire-developer/why-choose"
            servicesPath="/api/hire-developer/why-choose-services"
            configIdParam="whyChooseConfigId"
          />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesBenefits
            onContactClick={handleOpenContact}
            title={benefitConfig?.title}
            description={benefitConfig?.description}
            benefits={benefits}
          />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesTechnologies technologyGroups={technologies} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesWhyChoose
            onContactClick={handleOpenContact}
            mode="hire"
            category={categoryName}
            subcategory={roleName}
          />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesProcess
            apiPath="/api/hire-developer/processes"
      
          />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesIndustries />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesTestimonials />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <FAQAccordion faqs={serviceConfig?.faqs} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <PricingModels />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesCTA
            onContactClick={handleOpenContact}
            category={categoryName}
            subcategory={roleName}
            apiPath="/api/hire-developer/contact-buttons"
          />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesBlog />
        </Box>
      </Container>
    </Box>
  );
};

export default HireDeveloperDetailPage;
