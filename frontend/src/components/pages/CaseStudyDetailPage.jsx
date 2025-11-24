import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { alpha, Box, Container, Divider, useTheme } from '@mui/material';
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

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const caseStudy = caseStudiesBySlug[slug] || null;
  const theme = useTheme();

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 40);
    return () => clearTimeout(timer);
  }, []);

  const dividerColor = alpha(theme.palette.divider, 0.6);

  const featureBadges = useMemo(() => {
    const badges = [
      ...(caseStudy?.coreFeatures?.map((feature) => feature.title) || []),
      ...(caseStudy?.advancedContent?.map((module) => module.title) || []),
    ];

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

  if (!caseStudy) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudyDetailHero caseStudy={caseStudy} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >
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
      </Container>
    </Box>
  );
};

export default CaseStudyDetailPage;
