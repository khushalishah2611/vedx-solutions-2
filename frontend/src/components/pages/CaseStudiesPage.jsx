import { alpha, Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import CaseStudiesHero from '../sections/caseStudies/CaseStudiesHero.jsx';
import CaseStudyCard from '../sections/caseStudies/CaseStudyCard.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import { featuredCaseStudies } from '../../data/caseStudies.js';

const CaseStudiesPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudiesHero />

      <PageSectionsContainer spacing={{ xs: 8, md: 10 }}>
        <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Featured Client Success Stories
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            Explore how VedX Solutions elevates ambitious brands through thoughtful product strategy, delightful interfaces, and resilient engineering.
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

      <Container maxWidth="lg" sx={{ pb: { xs: 10, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 6 },
            py: { xs: 6, md: 8 },
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha('#6366f1', 0.12)} 0%, ${alpha('#8b5cf6', 0.18)} 100%)`,
            border: `1px solid ${alpha('#8b5cf6', 0.25)}`,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Transform Your Business Growth with Us
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680 }}>
              Let’s co-create the next success story. Share your challenge, and we will help you architect, design, and build a product that delights your customers.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CaseStudiesPage;
