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
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import ServiceHero from '../sections/servicepage/ServiceHero.jsx';
import { useServiceHireCatalog } from '../../hooks/useServiceHireCatalog.js';
import { apiUrl } from '../../utils/const.js';

const ServiceDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categorySlug, serviceSlug } = useParams();
  const { openDialog } = useContactDialog();
  const { serviceCategories, serviceSubCategories, isLoading } = useServiceHireCatalog();
  const [serviceMenu, setServiceMenu] = useState(null);
  const [benefits, setBenefits] = useState([]);
  const [benefitConfig, setBenefitConfig] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [whyChooseConfig, setWhyChooseConfig] = useState(null);
  const [whyServices, setWhyServices] = useState([]);
  const [whyVedxConfig, setWhyVedxConfig] = useState(null);
  const [whyVedxReasons, setWhyVedxReasons] = useState([]);

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
        const response = await fetch(apiUrl(`/api/service-menus?${params.toString()}`));
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
          const configResponse = await fetch(apiUrl(`/api/benefit-configs?${configParams.toString()}`));
          const configData = await configResponse.json();
          if (configResponse.ok && Array.isArray(configData) && configData.length > 0) {
            config = configData[0];
          }
        }

        const benefitParams = new URLSearchParams(params);
        if (config?.id) benefitParams.append('benefitConfigId', String(config.id));
        const response = await fetch(apiUrl(`/api/benefits?${benefitParams.toString()}`));
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
        const response = await fetch(apiUrl('/api/technologies'));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load technologies');
        if (!isMounted) return;
        setTechnologies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load technologies', error);
      }
    };

    const loadWhyChoose = async () => {
      try {
        const response = await fetch(apiUrl(`/api/why-choose?${params.toString()}`));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load why choose');
        if (!isMounted) return;
        const config = Array.isArray(data) ? data[0] : data;
        setWhyChooseConfig(config || null);

        if (config?.id) {
          const serviceParams = new URLSearchParams(params);
          serviceParams.append('whyChooseId', String(config.id));
          const servicesResponse = await fetch(apiUrl(`/api/why-services?${serviceParams.toString()}`));
          const servicesData = await servicesResponse.json();
          if (!servicesResponse.ok) {
            throw new Error(servicesData?.error || 'Unable to load why services');
          }
          if (!isMounted) return;
          setWhyServices(Array.isArray(servicesData) ? servicesData : []);
        } else {
          setWhyServices([]);
        }
      } catch (error) {
        console.error('Failed to load why choose services', error);
      }
    };

    const loadWhyVedx = async () => {
      try {
        const response = await fetch(apiUrl('/api/why-vedx'));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load why VEDX');
        const list = Array.isArray(data) ? data : [];
        const matched =
          list.find(
            (item) =>
              (apiSubCategory?.id && item.subcategoryId === apiSubCategory.id) ||
              (!apiSubCategory?.id && apiCategory?.id && item.categoryId === apiCategory.id)
          ) || list[0];
        if (!isMounted) return;
        setWhyVedxConfig(matched || null);

        if (matched?.id) {
          const reasonParams = new URLSearchParams(params);
          reasonParams.append('whyVedxId', String(matched.id));
          const reasonsResponse = await fetch(
            apiUrl(`/api/why-vedx-reasons?${reasonParams.toString()}`)
          );
          const reasonsData = await reasonsResponse.json();
          if (!reasonsResponse.ok) {
            throw new Error(reasonsData?.error || 'Unable to load why VEDX reasons');
          }
          if (!isMounted) return;
          setWhyVedxReasons(Array.isArray(reasonsData) ? reasonsData : []);
        } else {
          setWhyVedxReasons([]);
        }
      } catch (error) {
        console.error('Failed to load why VEDX data', error);
      }
    };

    loadServiceMenu();
    loadBenefits();
    loadTechnologies();
    loadWhyChoose();
    loadWhyVedx();

    return () => {
      isMounted = false;
    };
  }, [apiCategory, apiSubCategory, categoryName, subcategoryName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, serviceSlug]);

  useEffect(() => {
    if (!apiCategory && !apiSubCategory && !isLoading) {
      navigate('/services', { replace: true });
    }
  }, [apiCategory, apiSubCategory, isLoading, navigate]);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  if (!apiCategory && !apiSubCategory && isLoading) {
    return null;
  }

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
  const whyHighlights = useMemo(() => {
    if (whyServices.length > 0) {
      return whyServices.map((item) => ({
        title: item.title,
        description: item.description,
      }));
    }
    return whyVedxReasons.map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
    }));
  }, [whyServices, whyVedxReasons]);


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
            title={serviceMenu?.bannerTitle || heroTitle}
            description={serviceMenu?.description}
            image={serviceMenu?.bannerImage}
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
        <Box my={10}><FullStackDeveloper onContactClick={handleOpenContact} /></Box>
        <Box my={10}><ServicesTechnologies technologyGroups={technologies} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <ServicesWhyChoose
            onContactClick={handleOpenContact}
            title={whyChooseConfig?.heroTitle || whyVedxConfig?.heroTitle}
            description={whyChooseConfig?.heroDescription || whyVedxConfig?.heroDescription}
            highlights={whyHighlights}
          />
        </Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesProcess /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesIndustries /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <ServicesTestimonials /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <FAQAccordion faqs={serviceMenu?.faqs} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesCTA onContactClick={handleOpenContact} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <ServicesBlog /></Box>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
