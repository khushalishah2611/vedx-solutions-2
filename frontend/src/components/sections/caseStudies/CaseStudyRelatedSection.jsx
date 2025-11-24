import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudyCard from './CaseStudyCard.jsx';

const CaseStudyRelatedSection = ({ relatedCaseStudies }) => {
  if (!relatedCaseStudies.length) return null;

  return (
    <Stack spacing={3} sx={{ mt: { xs: 5, md: 7 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>
        Related Case Studies
      </Typography>

      <Grid container spacing={2}>
        {relatedCaseStudies.map((study) => (
          <Grid item xs={12} sm={6} md={4} key={study.slug}>
            <CaseStudyCard caseStudy={study} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

CaseStudyRelatedSection.propTypes = {
  relatedCaseStudies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CaseStudyRelatedSection;
