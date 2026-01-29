import {
  Box,
  Container,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/servicepage/ServicesTechnologies.jsx';
import ServicesCTA from '../sections/servicepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import ServicesWhyChoose from '../sections/servicepage/ServicesWhyChoose.jsx';
import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';
import ServiceHero from '../sections/servicepage/ServiceHero.jsx';
import NotFoundPage from '../shared/NotFoundPage.jsx';
import { useServiceHireCatalog } from '../../hooks/useServiceHireCatalog.js';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const ServiceDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categorySlug, serviceSlug } = useParams();
  const { fetchWithLoading } = useLoadingFetch();

  const { serviceCategories, serviceSubCategories, isLoading } = useServiceHireCatalog();

  const [serviceMenu, setServiceMenu] = useState(null);
  const [benefits, setBenefits] = useState([]);
  const [benefitConfig, setBenefitConfig] = useState(null);
  const [technologies, setTechnologies] = useState([]);

  const apiCategory = useMemo(
    () => serviceCategories.find((item) => item.slug === categorySlug),
    [categorySlug, serviceCategories]
  );
  const apiSubCategory = useMemo(
    () => serviceSubCategories.find((item) => item.slug === serviceSlug),
    [serviceSlug, serviceSubCategories]
  );

  const categoryName = apiCategory?.name;
  const subcategoryName = apiSubCategory?.name;

  useEffect(() => {
    if (!categoryName && !subcategoryName) return;
    let isMounted = true;

    const params = new URLSearchParams();
    if (categoryName) params.append('category', categoryName);
    if (subcategoryName) params.append('subcategory', subcategoryName);

    const loadServiceMenu = async () => {
      try {
        const response = await fetchWithLoading(apiUrl(`/api/service-menus?${params.toString()}`));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load service menu');
        if (!isMounted) return;
        setServiceMenu(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error('Failed to load service menu', error);
      }
    };

    const loadBenefits = async () => {
      try {
        let config = null;
        if (apiCategory?.id || apiSubCategory?.id) {
          const configParams = new URLSearchParams();
          if (apiCategory?.id) configParams.append('categoryId', String(apiCategory.id));
          if (apiSubCategory?.id) configParams.append('subcategoryId', String(apiSubCategory.id));
          const configResponse = await fetchWithLoading(
            apiUrl(`/api/benefit-configs?${configParams.toString()}`)
          );
          const configData = await configResponse.json();
          if (configResponse.ok && Array.isArray(configData) && configData.length > 0) {
            config = configData[0];
          }
        }

        const benefitParams = new URLSearchParams(params);
        if (config?.id) benefitParams.append('benefitConfigId', String(config.id));
        const response = await fetchWithLoading(apiUrl(`/api/benefits?${benefitParams.toString()}`));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load benefits');
        if (!isMounted) return;
        setBenefitConfig(config);
        setBenefits(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load benefits', error);
      }
    };

    const loadTechnologies = async () => {
      try {
        const response = await fetchWithLoading(apiUrl('/api/technologies'));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load technologies');
        if (!isMounted) return;
        setTechnologies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load technologies', error);
      }
    };

    loadServiceMenu();
    loadBenefits();
    loadTechnologies();

    return () => {
      isMounted = false;
    };
  }, [apiCategory, apiSubCategory, categoryName, fetchWithLoading, subcategoryName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, serviceSlug]);

  const isValidRoute = useMemo(() => {
    if (!apiCategory) return false;
    if (!serviceSlug) return true;
    if (!apiSubCategory) return false;
    if (apiSubCategory?.categoryId && apiCategory?.id) {
      return apiSubCategory.categoryId === apiCategory.id;
    }
    return true;
  }, [apiCategory, apiSubCategory, serviceSlug]);

  // ✅ Dialog remove -> Contact page redirect + smooth scroll top
  const handleOpenContact = useCallback(() => {
    navigate('/contact');
    // route change પછી top પર smooth scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }, [navigate]);

  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);

  const categoryTitle = apiCategory?.name ?? 'Services';
  const serviceName = apiSubCategory?.name;
  const heroTitle = serviceMenu?.bannerTitle || apiSubCategory?.name || apiCategory?.name;
  const heroDescription =
    serviceMenu?.bannerSubtitle || apiSubCategory?.description || apiCategory?.description;
  const categoryHref = categorySlug ? `/services/${categorySlug}` : '/services';

  const heroStats = useMemo(() => {
    if (!serviceMenu) return [];
    return [
      serviceMenu.totalServices ? { label: 'Total services', value: `${serviceMenu.totalServices}+` } : null,
      serviceMenu.totalProjects ? { label: 'Total projects', value: `${serviceMenu.totalProjects}+` } : null,
      serviceMenu.totalClients ? { label: 'Total clients', value: `${serviceMenu.totalClients}+` } : null,
    ].filter(Boolean);
  }, [serviceMenu]);

  if (!isValidRoute && isLoading) {
    return null;
  }

  if (!isValidRoute && !isLoading) {
    return <NotFoundPage />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      <ServiceHero
        categoryTitle={categoryTitle}
        serviceName={serviceName}
        heroTitle={heroTitle}
        heroDescription={heroDescription}
        backgroundImage={serviceMenu?.bannerImage}
        categoryHref={categoryHref}
        onContactClick={handleOpenContact}
        stats={heroStats}
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
            category={categoryName}
            subcategory={subcategoryName}
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
          <FullStackDeveloper
            onContactClick={handleOpenContact}
            category={categoryName}
            subcategory={subcategoryName}
          />
        </Box>

        <Box my={10}><ServicesTechnologies technologyGroups={technologies} /></Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesWhyChoose
            onContactClick={handleOpenContact}
            mode="service"
            category={categoryName}
            subcategory={subcategoryName}
          />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <ServicesProcess category={categoryName} subcategory={subcategoryName} />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesIndustries /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesTestimonials /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><FAQAccordion faqs={serviceMenu?.faqs} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <ServicesCTA
            category={categoryName}
            subcategory={subcategoryName}
            apiPath="/api/contact-buttons"
            onContactClick={handleOpenContact}
          />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesBlog /></Box>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
