import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { alpha, Box, Container, Divider, useTheme } from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import CaseStudyOverviewSection from '../sections/caseStudies/CaseStudyOverviewSection.jsx';
import CaseStudySolutionSection from '../sections/caseStudies/CaseStudySolutionSection.jsx';
import CaseStudyKeyFeaturesSection from '../sections/caseStudies/CaseStudyKeyFeaturesSection.jsx';
import CaseStudyChallengesSection from '../sections/caseStudies/CaseStudyChallengesSection.jsx';
import CaseStudyAppShowcaseSection from '../sections/caseStudies/CaseStudyAppShowcaseSection.jsx';
import CaseStudyTeamSection from '../sections/caseStudies/CaseStudyTeamSection.jsx';
import CaseStudyRoadmapSection from '../sections/caseStudies/CaseStudyRoadmapSection.jsx';
import CaseStudyRelatedSection from '../sections/caseStudies/CaseStudyRelatedSection.jsx';
import { caseStudiesBySlug, caseStudiesList } from '../../data/caseStudies.js';
import CaseStudyConclusionBlock from './CaseStudyConclusionBlock.jsx';
import CaseStudyImpactBlock from './CaseStudyImpactBlock.jsx';
const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const caseStudy = caseStudiesBySlug[slug] || null;
  const theme = useTheme();
  const accentColor = caseStudy?.accentColor || theme.palette.secondary.main;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 40);
    return () => clearTimeout(timer);
  }, []);

  const dividerColor = alpha(theme.palette.divider, 0.6);

  const relatedCaseStudies = useMemo(
    () => caseStudiesList.filter((item) => item.slug !== slug).slice(0, 3),
    [slug]
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


        <Box my={10}><CaseStudySolutionSection caseStudy={caseStudy} animate={animate} /></Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}>
          <CaseStudyKeyFeaturesSection caseStudy={caseStudy} animate={animate} />
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><CaseStudyChallengesSection caseStudy={caseStudy} animate={animate} /></Box>

            <Box my={10}><CaseStudyImpactBlock impactMetrics={impactMetrics} accentColor={accentColor} /></Box> 

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><CaseStudyAppShowcaseSection caseStudy={caseStudy} animate={animate} /></Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><CaseStudyTeamSection animate={animate} /></Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><CaseStudyRoadmapSection animate={animate} /></Box>

        <Divider sx={{ borderColor: dividerColor }} />

        <Box my={10}><CaseStudyConclusionBlock conclusion={conclusion} accentColor={accentColor} /></Box>

        <Divider sx={{ borderColor: dividerColor }} />
        <Box my={10}>
          <CaseStudyRelatedSection relatedCaseStudies={relatedCaseStudies} />
        </Box>
      </Container>
    </Box>
  );
};

export default CaseStudyDetailPage;
