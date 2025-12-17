import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { alpha, Box, Container, Divider, Typography, useTheme } from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import CaseStudyOverviewSection from '../sections/caseStudies/CaseStudyOverviewSection.jsx';
import CaseStudyApproachSection from '../sections/caseStudies/CaseStudyApproachSection.jsx';
import CaseStudyCoreFeaturesSection from '../sections/caseStudies/CaseStudyCoreFeaturesSection.jsx';
import CaseStudySolutionSection from '../sections/caseStudies/CaseStudySolutionSection.jsx';
import CaseStudyTechnologySection from '../sections/caseStudies/CaseStudyTechnologySection.jsx';
import CaseStudyFeaturesSection from '../sections/caseStudies/CaseStudyFeaturesSection.jsx';
import CaseStudyScreenshotsSection from '../sections/caseStudies/CaseStudyScreenshotsSection.jsx';
import CaseStudyRelatedSection from '../sections/caseStudies/CaseStudyRelatedSection.jsx';
import { caseStudiesBySlug, caseStudiesList } from '../../data/caseStudies.js';
import { apiUrl } from '../../utils/const.js';

const mapCaseStudyForView = (incoming) => {
  if (!incoming) return null;

  const detail = incoming.detail || {};
  const projectOverview = detail.projectOverview || {};
  const approaches = Array.isArray(detail.approaches) ? detail.approaches : [];
  const solutions = Array.isArray(detail.solutions) ? detail.solutions : [];
  const technologies = Array.isArray(detail.technologies) ? detail.technologies : [];
  const features = Array.isArray(detail.features) ? detail.features : [];
  const screenshots = Array.isArray(detail.screenshots) ? detail.screenshots : [];

  const heroImage = projectOverview.image || incoming.coverImage || incoming.heroImage || '';
  const excerpt = projectOverview.description || incoming.description || incoming.excerpt || '';
  const tagline = projectOverview.subtitle || incoming.subtitle || incoming.tagline || '';

  const clientRequirements = approaches.length
    ? approaches.map((item) => item.subtitle || item.title).filter(Boolean)
    : incoming.clientRequirements || [];

  const journeyHighlight = solutions.length
    ? {
      title: solutions[0]?.title || incoming.journeyHighlight?.title,
      description: solutions[0]?.subtitle || incoming.journeyHighlight?.description || '',
    }
    : incoming.journeyHighlight;

  const advancedContent = solutions.length > 1
    ? solutions.slice(1).map((item) => ({ title: item.title, description: item.subtitle || '' }))
    : incoming.advancedContent;

  const coreFeatures = features.length
    ? features.map((item) => ({ title: item.title }))
    : incoming.coreFeatures;

  const technologyStack = technologies.length
    ? technologies.map((item) => ({ name: item.title, icon: item.image }))
    : incoming.technologyStack;

  const screenshotsMapped = screenshots.length
    ? screenshots.map((item) => ({
      src: item.image,
      alt: item.title || 'Case study screenshot',
      caption: item.subtitle || '',
    })).filter((item) => item.src)
    : incoming.screenshots || [];

  return {
    ...incoming,
    detail: detail.projectOverview ? detail : undefined,
    heroImage,
    excerpt,
    tagline,
    category: incoming.category || incoming.subtitle || '',
    clientRequirements,
    journeyHighlight,
    advancedContent,
    coreFeatures,
    technologyStack,
    screenshots: screenshotsMapped,
  };
};

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const theme = useTheme();

  const fallbackCaseStudy = caseStudiesBySlug[slug] || null;

  const [caseStudy, setCaseStudy] = useState(mapCaseStudyForView(fallbackCaseStudy));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let animationTimer;
    setAnimate(false);

    const fetchCaseStudy = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(apiUrl(`/api/case-studies/${slug}`));
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load case study.');
        }

        if (!payload?.caseStudy) {
          throw new Error('Case study not found.');
        }

        if (isMounted) {
          setCaseStudy(mapCaseStudyForView(payload.caseStudy));
        }
      } catch (err) {
        console.error('Case study fetch failed', err);
        if (isMounted) {
          if (fallbackCaseStudy) {
            setCaseStudy(mapCaseStudyForView(fallbackCaseStudy));
          } else {
            setError(err?.message || 'Unable to load case study right now.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          animationTimer = setTimeout(() => {
            if (isMounted) {
              setAnimate(true);
            }
          }, 40);
        }
      }
    };

    fetchCaseStudy();

    return () => {
      isMounted = false;
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [slug, fallbackCaseStudy]);

  const dividerColor = alpha(theme.palette.divider, 0.6);

  const featureBadges = useMemo(() => {
    const badges = [
      ...(caseStudy?.coreFeatures?.map((feature) => feature.title) || []),
      ...(caseStudy?.advancedContent?.map((module) => module.title) || []),
    ].filter(Boolean);

    return Array.from(new Set(badges)).slice(0, 12);
  }, [caseStudy]);

  const relatedCaseStudies = useMemo(
    () => caseStudiesList.filter((item) => item.slug !== slug).slice(0, 3),
    [slug]
  );

  // Application screenshots – max 5, in a responsive grid
  const screenshotsToShow = useMemo(
    () => (caseStudy?.screenshots || []).slice(0, 5),
    [caseStudy]
  );

  if (!caseStudy && !loading) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {caseStudy && <CaseStudyDetailHero caseStudy={caseStudy} />}

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
        py: { xs: 6, md: 10 },
      }}
      >
        {error && !caseStudy && (
          <Typography color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {caseStudy && (
          <>
            <Box my={5}><CaseStudyOverviewSection caseStudy={caseStudy} animate={animate} /></Box>

            <Divider sx={{ borderColor: dividerColor }} />

            <Box my={10}><CaseStudyApproachSection caseStudy={caseStudy} animate={animate} /></Box>

            <Box my={10}>
              <CaseStudyCoreFeaturesSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Divider sx={{ borderColor: dividerColor }} />

            <Box my={10}><CaseStudySolutionSection caseStudy={caseStudy} animate={animate} /></Box>

            <Divider sx={{ borderColor: dividerColor }} />

            <Box my={10}> <CaseStudyTechnologySection caseStudy={caseStudy} animate={animate} />
            </Box>
            <Divider sx={{ borderColor: dividerColor }} />

            <Box my={10}>
              <CaseStudyFeaturesSection featureBadges={featureBadges} animate={animate} />
            </Box>

            <Divider sx={{ borderColor: dividerColor }} />

            <Box my={10}><CaseStudyScreenshotsSection screenshotsToShow={screenshotsToShow} animate={animate} /></Box>

            <Divider sx={{ borderColor: dividerColor }} />

            <Box my={10}>
              <CaseStudyRelatedSection relatedCaseStudies={relatedCaseStudies} />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CaseStudyDetailPage;
