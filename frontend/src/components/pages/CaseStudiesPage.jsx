import { alpha, Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import CaseStudiesHero from '../sections/caseStudies/CaseStudiesHero.jsx';
import CaseStudyCard from '../sections/caseStudies/CaseStudyCard.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import { featuredCaseStudies } from '../../data/caseStudies.js';

const CaseStudiesPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' , overflow: 'hidden'}}>
      <CaseStudiesHero />

      <PageSectionsContainer>
        <Stack
        
          textAlign="center"
          alignItems="center"
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Featured Client Success Stories
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 720,
            }}
          >
            Explore how VedX Solutions elevates ambitious brands through thoughtful product strategy,
            delightful interfaces, and resilient engineering.
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {featuredCaseStudies.map((study) => (
            <Grid item xs={12} md={4} key={study.slug}>
              <CaseStudyCard caseStudy={study} />
            </Grid>
          ))}
        </Grid>
      </PageSectionsContainer>

     
    </Box>
  );
};

export default CaseStudiesPage;
