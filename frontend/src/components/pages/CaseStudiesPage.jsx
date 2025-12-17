import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Container, Grid, Pagination, Stack, TextField, Typography } from '@mui/material';
import CaseStudiesHero from '../sections/caseStudies/CaseStudiesHero.jsx';
import CaseStudyCard from '../sections/caseStudies/CaseStudyCard.jsx';
import { apiUrl } from '../../utils/const.js';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80';

const mapCaseStudyToCard = (study) => ({
  ...study,
  heroImage: study.coverImage || study.heroImage || FALLBACK_IMAGE,
  category: study.subtitle || 'Case Study',
  summary: study.description || '',
  tags: Array.isArray(study.tags)
    ? study.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name)).filter(Boolean)
    : [],
});

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const loadCaseStudies = async (targetPage = page, searchTerm = search) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: '8',
      });
      if (searchTerm.trim()) params.set('search', searchTerm.trim());

      const response = await fetch(apiUrl(`/api/case-studies?${params.toString()}`));
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load case studies.');

      setCaseStudies((payload.caseStudies || []).map(mapCaseStudyToCard));
      const incomingPagination = payload.pagination || {};
      setPagination({
        page: incomingPagination.page || 1,
        totalPages: incomingPagination.totalPages || 1,
        total: incomingPagination.total || 0,
      });
    } catch (err) {
      console.error('Load case studies failed', err);
      setCaseStudies([]);
      setError(err?.message || 'Unable to load case studies right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseStudies(page, search);
  }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasResults = useMemo(() => caseStudies.length > 0, [caseStudies.length]);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      <CaseStudiesHero />

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

        <Box my={4} display="flex" justifyContent="center">
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search case studies"
            variant="outlined"
            size="small"
            sx={{ width: '100%', maxWidth: 420 }}
          />
        </Box>

        <Box my={10}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : error ? (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          ) : (
            <>
              <Grid container spacing={2}>
                {caseStudies.map((study) => (
                  <Grid item xs={12} sm={6} md={3} key={study.slug}>
                    <CaseStudyCard caseStudy={study} />
                  </Grid>
                ))}
              </Grid>

              {!hasResults && (
                <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                  No case studies found.
                </Typography>
              )}

              <Stack direction="row" justifyContent="center" mt={4}>
                <Pagination
                  page={pagination.page}
                  count={pagination.totalPages}
                  onChange={(_event, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default CaseStudiesPage;
