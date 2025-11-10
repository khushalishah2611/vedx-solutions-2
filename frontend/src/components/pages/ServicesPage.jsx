import {
  Box, Divider, alpha, useTheme
} from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesHero from '../sections/homepage/ServicesHero.jsx';
import ServicesHighlights from '../sections/homepage/ServicesHighlights.jsx';
import ServicesBenefits from '../sections/homepage/ServicesBenefits.jsx';
import FullStackDeveloper from '../sections/homepage/FullStackDeveloper.jsx';
import ServicesTechnologies from '../sections/homepage/ServicesTechnologies.jsx';
import ServicesCTA from '../sections/homepage/ServicesCTA.jsx';
import ServicesBlog from '../shared/ServicesBlog.jsx';
import FAQAccordion from '../shared/FAQAccordion.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';


import ServicesWhyChoose from '../sections/homepage/ServicesWhyChoose.jsx';

import ServicesIndustries from '../shared/ServicesIndustries.jsx';
import ServicesProcess from '../shared/ServicesProcess.jsx';
import ServicesTestimonials from '../shared/ServicesTestimonials.jsx';




const ServicesPage = ({ showHero = true }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dividerColor = alpha(theme.palette.divider, 0.6);
  const handleOpenContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {showHero && <ServicesHero onContactClick={handleOpenContact} />}
      <PageSectionsContainer>
        <ServicesHighlights onContactClick={handleOpenContact} />
        <Divider sx={{ borderColor: dividerColor }} />
        <ServicesBenefits />
        <Divider sx={{ borderColor: dividerColor }} />
        <FullStackDeveloper onContactClick={handleOpenContact} />
        <ServicesTechnologies />
        <Divider sx={{ borderColor: dividerColor }} />
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

export default ServicesPage;
