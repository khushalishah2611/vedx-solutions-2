import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import CaseStudiesHero from '../sections/caseStudies/CaseStudiesHero.jsx';
import CaseStudyCard from '../sections/caseStudies/CaseStudyCard.jsx';

import { useBannerByType } from '../../hooks/useBannerByType.js';
import { apiUrl } from '../../utils/const.js';

const mapCaseStudyFromApi = (caseStudy) => ({
  id: caseStudy.id,
  slug: caseStudy.slug,
  title: caseStudy.title,
  summary: caseStudy.description || '',
  heroImage: caseStudy.coverImage || '',
  tags: Array.isArray(caseStudy.tags) ? caseStudy.tags.map((tag) => tag.name) : [],
});

const CaseStudiesPage = () => {
  const { banner } = useBannerByType('case-study');
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadCaseStudies = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(apiUrl('/api/case-studies'));
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || 'Unable to load case studies right now.');

        if (isActive) {
          setCaseStudies((payload.caseStudies || []).map(mapCaseStudyFromApi));
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || 'Unable to load case studies right now.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadCaseStudies();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      <CaseStudiesHero banner={banner} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >
        <Box my={5}>
          <Stack textAlign="center" alignItems="center" spacing={1.5}>
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
              Explore how VedX Solutions elevates ambitious brands through thoughtful product
              strategy, delightful interfaces, and resilient engineering.
            </Typography>
          </Stack>
        </Box>

        <Box my={10}>
          {loading ? (
            <Stack alignItems="center" spacing={2} py={6}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading case studies...
              </Typography>
            </Stack>
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : null}

          {!loading && !error ? (
            <Grid container spacing={2}>
              {caseStudies.map((study) => (
                <Grid item xs={12} sm={6} md={3} key={study.slug}>
                  <CaseStudyCard caseStudy={study} />
                </Grid>
              ))}
            </Grid>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
};

export default CaseStudiesPage;
