import { Box, Divider, alpha, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
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


const HireDevelopersPage = () => {
  const { openDialog } = useContactDialog();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);

  const handleOpenContact = useCallback(() => {
    openDialog();
  }, [openDialog]);

  return (
    <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      <HireDevelopersHero onContactClick={handleOpenContact} />
      <PageSectionsContainer>
        <ServicesHighlights onContactClick={handleOpenContact} />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesBenefits onContactClick={handleOpenContact} />
        <Divider sx={{ borderColor: dividerColor }} />
        <FullStackDeveloper onContactClick={handleOpenContact} />
        <ServicesWhyChoose />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesProcess />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesIndustries />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesTestimonials />
        <Divider sx={{ borderColor: dividerColor }} />
        <FAQAccordion />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesCTA onContactClick={handleOpenContact} />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesBlog />
      </PageSectionsContainer>
    </Box>
  );
};

export default HireDevelopersPage;
