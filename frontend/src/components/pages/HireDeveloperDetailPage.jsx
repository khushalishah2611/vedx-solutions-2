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
import NotFoundPage from '../shared/NotFoundPage.jsx';

import { useServiceHireCatalog } from '../../hooks/useServiceHireCatalog.js';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const HireDeveloperDetailPage = () => {
  const theme = useTheme();
  const { categorySlug, roleSlug } = useParams();
  const navigate = useNavigate();
  const { fetchWithLoading } = useLoadingFetch();
  const { hireCategories, hireRoles, isLoading } = useServiceHireCatalog();
  const [benefits, setBenefits] = useState([]);
  const [benefitConfig, setBenefitConfig] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [serviceConfig, setServiceConfig] = useState(null);

  const apiCategory = useMemo(
    () => hireCategories.find((item) => item.slug === categorySlug),
    [categorySlug, hireCategories]
  );
  const apiRole = useMemo(
    () => hireRoles.find((item) => item.slug === roleSlug),
    [hireRoles, roleSlug]
  );
  const isValidRoute = useMemo(() => {
    if (!categorySlug) return false;
    if (!apiCategory) return false;
    if (roleSlug) {
      if (!apiRole) return false;
      if (apiRole?.hireCategoryId && apiCategory?.id) {
        return apiRole.hireCategoryId === apiCategory.id;
      }
    }
    return true;
  }, [apiCategory, apiRole, categorySlug, roleSlug]);
  const category = isValidRoute ? apiCategory ?? null : null;
  const role = isValidRoute ? apiRole ?? null : null;

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, roleSlug]);

  const handleOpenContact = useCallback(() => {
    navigate('/contact');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }, [navigate]);

  const resolvedCategory = category;
  const resolvedRole = role;
  const categoryName = resolvedCategory?.title ?? resolvedCategory?.name;
  const roleName = resolvedRole?.title ?? resolvedRole?.name;
  const normalizedRoleName = useMemo(
    () => (roleName || '').trim().toLowerCase(),
    [roleName]
  );
  const normalizedRoleSlug = useMemo(
    () => (roleSlug || '').trim().toLowerCase(),
    [roleSlug]
  );

  const normalizeToken = useCallback((value) => {
    if (!value) return '';
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }, []);

  const buildRoleTokens = useCallback(
    () =>
      [normalizedRoleName, normalizedRoleSlug, roleName, roleSlug]
        .map((value) => normalizeToken(value))
        .filter(Boolean),
    [normalizeToken, normalizedRoleName, normalizedRoleSlug, roleName, roleSlug]
  );

  const doesSubcategoryMatchRole = useCallback(
    (subcategory, roleTokens) => {
      if (!roleTokens.length) return false;

      const candidates = [];

      if (typeof subcategory === 'string') {
        candidates.push(subcategory);
      } else if (subcategory && typeof subcategory === 'object') {
        candidates.push(subcategory.name, subcategory.title, subcategory.slug);
      }

      const normalizedCandidates = candidates
        .map((candidate) => normalizeToken(candidate))
        .filter(Boolean);

      if (!normalizedCandidates.length) return false;

      return normalizedCandidates.some((candidate) =>
        roleTokens.some(
          (token) =>
            candidate === token ||
            candidate.includes(token) ||
            token.includes(candidate)
        )
      );
    },
    [normalizeToken]
  );

  useEffect(() => {
    if (!categoryName && !roleName) return;
    let isMounted = true;

    const params = new URLSearchParams();
    if (categoryName) params.append('category', categoryName);
    if (roleName) params.append('subcategory', roleName);
    params.append('public', 'true');

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
        const response = await fetchWithLoading(apiUrl('/api/hire-developer/technologies?public=true'));
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
    if (roleName) params.append('subcategory', roleName);
    params.append('public', 'true');

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
        const roleTokens = buildRoleTokens();

        let selected = null;

        if (roleTokens.length) {
          selected =
            list.find((service) =>
              (service?.subcategories ?? []).some((sub) =>
                doesSubcategoryMatchRole(sub, roleTokens)
              )
            ) || null;
        }

        if (!selected && list.length) {
          selected = list[0];
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
  }, [
    buildRoleTokens,
    categoryName,
    doesSubcategoryMatchRole,
    fetchWithLoading,
    roleName,
  ]);

  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const categoryHref = categorySlug ? `/hire-developers/${categorySlug}` : '/hire-developers';

  const servicesHeroStats = useMemo(() => {
    const totalServices = serviceConfig?.totalServices;
    const totalProjects = serviceConfig?.totalProjects;
    const totalClients = serviceConfig?.totalClients;

    if (totalServices || totalProjects || totalClients) {
      return [
        totalServices ? { label: 'Recurring Client', value: `${totalServices}+` } : null,
        totalProjects ? { label: 'Team Experience', value: `${totalProjects}+` } : null,
        totalClients ? { label: 'Satisfaction Ratio', value: `${totalClients}+` } : null,
      ].filter(Boolean);
    }

    return [];
  }, [serviceConfig?.totalClients, serviceConfig?.totalProjects, serviceConfig?.totalServices]);

  // If redirecting, avoid rendering
  if (!isValidRoute && isLoading) {
    return null;
  }

  if (!isValidRoute && !isLoading) {
    return <NotFoundPage />;
  }

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
