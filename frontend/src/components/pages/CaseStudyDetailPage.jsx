import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { alpha, Box, Container, Divider, useTheme } from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import CaseStudyOverviewSection from '../sections/caseStudies/CaseStudyOverviewSection.jsx';
import CaseStudySolutionSection from '../sections/caseStudies/CaseStudySolutionSection.jsx';
import CaseStudyKeyFeaturesSection from '../sections/caseStudies/CaseStudyKeyFeaturesSection.jsx';
import CaseStudyChallengesSection from '../sections/caseStudies/CaseStudyChallengesSection.jsx';
import CaseStudyAppShowcaseSection from '../sections/caseStudies/CaseStudyAppShowcaseSection.jsx';
import CaseStudyTechnologiesSection from '../sections/caseStudies/CaseStudyTechnologiesSection.jsx';
import CaseStudyTeamSection from '../sections/caseStudies/CaseStudyTeamSection.jsx';
import CaseStudyRoadmapSection from '../sections/caseStudies/CaseStudyRoadmapSection.jsx';
import CaseStudyRelatedSection from '../sections/caseStudies/CaseStudyRelatedSection.jsx';
import CaseStudyConclusionBlock from '../sections/caseStudies/CaseStudyConclusionBlock.jsx';
import CaseStudyImpactBlock from '../sections/caseStudies/CaseStudyImpactBlock.jsx';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const mapCaseStudyFromApi = (caseStudy) => ({
  id: caseStudy.id,
  slug: caseStudy.slug,
  title: caseStudy.title,
  summary: caseStudy.description || '',
  heroImage: caseStudy.coverImage || '',
  tags: Array.isArray(caseStudy.tags) ? caseStudy.tags.map((tag) => tag.name) : [],
});

const mapCaseStudyDetailFromApi = (caseStudy) => {
  const detail = caseStudy.detail || {};
  const projectOverview = detail.projectOverview || {};
  const problemConfig = detail.problemConfig || {};
  const solutionConfig = detail.solutionConfig || {};
  const problems = Array.isArray(detail.problems) ? detail.problems : [];
  const solutions = Array.isArray(detail.solutions) ? detail.solutions : [];
  const features = Array.isArray(detail.features) ? detail.features : [];
  const developmentChallenges = Array.isArray(detail.developmentChallenges) ? detail.developmentChallenges : [];
  const apps = Array.isArray(detail.apps) ? detail.apps : [];
  const impacts = Array.isArray(detail.impacts) ? detail.impacts : [];
  const timelines = Array.isArray(detail.timelines) ? detail.timelines : [];
  const conclusions = Array.isArray(detail.conclusions) ? detail.conclusions : [];
  const technologies = Array.isArray(detail.technologies) ? detail.technologies : [];

  const screenshots = apps.flatMap((app) => (Array.isArray(app.images) ? app.images : []));

  return {
    ...mapCaseStudyFromApi(caseStudy),
    heroTitle: caseStudy.title,
    heroDescription: caseStudy.description || '',
    overviewTitle: projectOverview.title || caseStudy.title,
    overviewDescription: projectOverview.description || caseStudy.description || '',
    overviewImage: projectOverview.image || caseStudy.coverImage || '',
    problemStatements: problems.map((problem) => problem.description).filter(Boolean),
    problemImage: problemConfig.image || '',
    journeyHighlight: { description: solutionConfig.description || '' },
    solutionHighlights: solutions.map((solution, index) => ({
      title: `Solution ${index + 1}`,
      description: solution.description || '',
      image: solution.image || '',
    })),
    coreFeatures: features.map((feature) => ({
      title: feature.title || '',
      description: feature.description || '',
      image: feature.image || '',
    })),
    challengeHighlights: developmentChallenges.map((challenge) => ({
      title: challenge.title || '',
      description: challenge.description || '',
      image: challenge.image || '',
    })),
    appDescription: detail.appConfig?.description || '',
    screenshots,
    impactMetrics: impacts.map((impact) => ({
      title: impact.title || '',
      image: impact.image || '',
    })),
    technologyHighlights: technologies.map((technology) => ({
      title: technology.title || '',
      image: technology.image || '',
    })),
    timelineSteps: timelines.map((item) => ({
      label: item.title || '',
      duration: item.duration || item.time || '',
      detail: item.description || '',
    })),
    conclusion: conclusions[0]?.description || '',
  };
};

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const { fetchWithLoading } = useLoadingFetch();
  const [caseStudy, setCaseStudy] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const accentColor = caseStudy?.accentColor || theme.palette.secondary.main;
  const impactMetrics = caseStudy?.impactMetrics || [];
  const conclusion = caseStudy?.conclusion || '';
  const [animate, setAnimate] = useState(false);
  const sectionSpacing = { xs: 6, md: 10 };

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 40);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadCaseStudy = async () => {
      setLoading(true);
      setError('');

      try {
        const [detailResponse, listResponse] = await Promise.all([
          fetchWithLoading(apiUrl(`/api/case-studies/${slug}`)),
          fetchWithLoading(apiUrl('/api/case-studies')),
        ]);

        const detailPayload = await detailResponse.json();
        const listPayload = await listResponse.json();

        if (!detailResponse.ok) {
          throw new Error(detailPayload?.message || 'Unable to load case study details right now.');
        }

        if (!listResponse.ok) {
          throw new Error(listPayload?.message || 'Unable to load case studies right now.');
        }

        if (isActive) {
          setCaseStudy(mapCaseStudyDetailFromApi(detailPayload.caseStudy));
          setCaseStudies((listPayload.caseStudies || []).map(mapCaseStudyFromApi));
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || 'Unable to load case study details right now.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadCaseStudy();
    }

    return () => {
      isActive = false;
    };
  }, [fetchWithLoading, slug]);

  const dividerColor = alpha(theme.palette.divider, 0.6);

  const relatedCaseStudies = useMemo(
    () => caseStudies.filter((item) => item.slug !== slug).slice(0, 3),
    [caseStudies, slug]
  );

  if (!loading && !caseStudy && !error) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {!loading && caseStudy ? (
        <>
          <CaseStudyDetailHero caseStudy={caseStudy} />

          <Container
            maxWidth={false}
            sx={{
              px: { xs: 3, md: 20 },
              py: { xs: 6, md: 10 },
            }}
          >
            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyOverviewSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudySolutionSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyKeyFeaturesSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyChallengesSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyImpactBlock impactMetrics={impactMetrics} accentColor={accentColor} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyAppShowcaseSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyTechnologiesSection caseStudy={caseStudy} animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyTeamSection animate={animate} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyRoadmapSection animate={animate} steps={caseStudy.timelineSteps} />
            </Box>

            <Box sx={{ my: sectionSpacing }}>
              <CaseStudyConclusionBlock conclusion={conclusion} accentColor={accentColor} />
            </Box>

            {Array.isArray(relatedCaseStudies) && relatedCaseStudies.length > 0 && (
              <>
                <Divider sx={{ borderColor: dividerColor }} />
                <Box sx={{ my: sectionSpacing }}>
                  <CaseStudyRelatedSection relatedCaseStudies={relatedCaseStudies} />
                </Box>
              </>
            )}
          </Container>
        </>
      ) : null}
    </Box>
  );
};

export default CaseStudyDetailPage;
