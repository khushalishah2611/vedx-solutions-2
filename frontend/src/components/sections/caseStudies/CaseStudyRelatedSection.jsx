import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudyCard from './CaseStudyCard.jsx';

const CaseStudyRelatedSection = ({ relatedCaseStudies }) => {
  if (!relatedCaseStudies || !relatedCaseStudies.length) return null;

  return (
    <Box component="section" sx={{ mt: 6 }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 4, px: { xs: 2, md: 0 } }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Related Case Studies
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {relatedCaseStudies.slice(0, 4).map((study) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={study.slug}>
            <CaseStudyCard
              caseStudy={study}
              imageHeight={200}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CaseStudyRelatedSection.propTypes = {
  relatedCaseStudies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CaseStudyRelatedSection;
