import { Box, Container, Divider, alpha, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { serviceDetailContent } from '../../data/serviceDetailContent.js';
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

const ServiceDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categorySlug, serviceSlug } = useParams();
  const { openDialog } = useContactDialog();

  const category = serviceDetailContent[categorySlug ?? ''];
  const service = category?.services?.[serviceSlug ?? ''];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, serviceSlug]);

  useEffect(() => {
    if (!category || !service) {
      navigate('/services', { replace: true });
    }
  }, [category, navigate, service]);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  if (!category || !service) {
    return null;
  }

  const isDark = theme.palette.mode === 'dark';

  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);


  return (
    <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      <ServiceHero
        categoryTitle="Services"
        serviceName="Full Stack Development"
        heroTitle="Enterprise-Grade Full Stack Development"
        heroDescription="We build scalable, secure, and high-performing digital platforms tailored to your growth."
        stats={[
          { label: 'Projects Delivered', value: '120+' },
          { label: 'Client Retention', value: '95%' },
          { label: 'Avg. ROI', value: '3.5x' },
        ]}
      />


      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >

        <ServicesHighlights onContactClick={handleOpenContact} />
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesBenefits onContactClick={handleOpenContact} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><FullStackDeveloper onContactClick={handleOpenContact} /></Box>
        <Box my={10}><ServicesTechnologies /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesWhyChoose /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesProcess /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesIndustries /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <ServicesTestimonials /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <FAQAccordion /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}><ServicesCTA onContactClick={handleOpenContact} /></Box>
        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}> <ServicesBlog /></Box>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
