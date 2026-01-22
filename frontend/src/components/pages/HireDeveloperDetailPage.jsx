import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Container, Divider, alpha, useTheme } from '@mui/material';

import ServicesHighlights from '../sections/servicepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/servicepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/servicepage/FullStackDeveloper.jsx';
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

const HireDeveloperDetailPage = () => {
  const theme = useTheme();
  const { categorySlug, roleSlug } = useParams();
  const navigate = useNavigate();
  const { openDialog } = useContactDialog();
  const { hireCategories, hireRoles, isLoading } = useServiceHireCatalog();

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

  const relatedRoles = useMemo(() => {
    if (!category?.roles) return [];
    return Object.entries(category.roles)
      .filter(([slug]) => slug !== roleSlug)
      .map(([slug, item]) => ({ slug, ...item }));
  }, [category, roleSlug]);

  // If redirecting, avoid rendering
  if (!category && !role && !apiCategory && !apiRole && isLoading) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);
  const categoryHref = categorySlug ? `/hire-developers/${categorySlug}` : '/hire-developers';

  const servicesHeroStats = [
    { label: 'Projects Delivered', value: '120+' },
    { label: 'Senior Engineers', value: '60+' },
    { label: 'Client Countries', value: '10+' }
  ];

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
        category={category ?? apiCategory}
        role={role ?? apiRole}
        stats={servicesHeroStats}
        onContactClick={handleOpenContact}
        dividerColor={dividerColor}
        categoryHref={categoryHref}
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
          <ServicesHighlights onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesBenefits onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <FullStackDeveloper onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <ServicesWhyChoose onContactClick={handleOpenContact} />
        </Box>

        <Box my={10}>
          <Divider sx={{ borderColor: dividerColor }} />
        </Box>

        <Box my={10}>
          <ServicesProcess />
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
          <FAQAccordion />
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
          <ServicesCTA onContactClick={handleOpenContact} />
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
