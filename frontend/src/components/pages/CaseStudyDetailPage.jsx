import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import { apiUrl } from '../../utils/const.js';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const theme = useTheme();

  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const loadCaseStudy = async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const response = await fetch(apiUrl(`/api/case-studies/${slug}`));
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 404) setNotFound(true);
        throw new Error(payload?.message || 'Unable to load case study.');
      }
      setCaseStudy(payload.caseStudy || null);
    } catch (err) {
      console.error('Load case study failed', err);
      setError(err?.message || 'Unable to load case study right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseStudy();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const heroCaseStudy = useMemo(() => {
    if (!caseStudy) return null;
    const tags = Array.isArray(caseStudy.tags)
      ? caseStudy.tags.map((tag) => (typeof tag === 'string' ? tag : tag?.name)).filter(Boolean)
      : [];

    return {
      ...caseStudy,
      heroImage: caseStudy.coverImage || FALLBACK_IMAGE,
      heroTitle: caseStudy.title,
      heroDescription: caseStudy.subtitle || caseStudy.description || '',
      category: tags[0] || 'Case Study',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Case Studies', href: '/casestudy' },
        { label: caseStudy.title },
      ],
    };
  }, [caseStudy]);

  if (notFound) {
    return <Navigate to="/casestudy" replace />;
  }

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <Typography color="error">{error}</Typography>
      </Stack>
    );
  }

  if (!caseStudy || !heroCaseStudy) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudyDetailHero caseStudy={heroCaseStudy} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {caseStudy.title}
            </Typography>
            {caseStudy.subtitle && (
              <Typography variant="h6" color="text.secondary">
                {caseStudy.subtitle}
              </Typography>
            )}
          </Box>

          {caseStudy.tags?.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {caseStudy.tags.map((tag) => (
                <Chip
                  key={typeof tag === 'string' ? tag : tag.id}
                  label={typeof tag === 'string' ? tag : tag?.name}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Stack>
          )}

          <Divider />

          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              color: theme.palette.text.secondary,
              whiteSpace: 'pre-line',
            }}
          >
            {caseStudy.description || 'No description provided for this case study yet.'}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default CaseStudyDetailPage;
