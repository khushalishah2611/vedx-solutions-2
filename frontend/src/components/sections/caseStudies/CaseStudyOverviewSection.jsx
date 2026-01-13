import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, useTheme } from '@mui/material';
import CaseStudyOverviewBlock from './CaseStudyOverviewBlock.jsx';
import CaseStudyProblemStatementBlock from './CaseStudyProblemStatementBlock.jsx';
import CaseStudyConclusionBlock from './CaseStudyConclusionBlock.jsx';
import CaseStudyImpactBlock from './CaseStudyImpactBlock.jsx';

const CaseStudyOverviewSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const accentColor = caseStudy?.accentColor || theme.palette.secondary.main;

  const overviewContent = useMemo(
    () => ({
      title: caseStudy?.overviewTitle || 'Overview',
      description:
        caseStudy?.overviewDescription ||
        caseStudy?.excerpt ||
        `Our client wanted to unify patient, provider, and payer journeys under a single intelligent platform that delivers faster care, secure collaboration, and measurable outcomes.`,
      image:
        caseStudy?.overviewImage ||
        caseStudy?.heroImage ||
        'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
    }),
    [caseStudy]
  );

  const problemStatements = useMemo(() => {
    if (caseStudy?.problemStatements?.length > 0) {
      return caseStudy.problemStatements;
    }
    return [
      'Fragmented patient records slowed care coordination between hospitals and labs.',
      'Manual claims processing created delays in reimbursements and approvals.',
      'Limited predictive insights made it harder to detect early health risks.',
      'Lack of unified interfaces increased the burden on patients and caregivers.',
      'No centralized medication reminders or allergy alerts for clinicians.',
      'Data sharing compliance required stricter privacy controls and audit trails.',
    ];
  }, [caseStudy]);

  const problemImage =
    caseStudy?.problemImage ||
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';

  const conclusion =
    caseStudy?.conclusion ||
    `The solution delivered a secure, patient-centered ecosystem that connects care teams and empowers faster decisions—setting the foundation for a future-ready digital health network.`;

  const impactMetrics = useMemo(() => {
    if (caseStudy?.impactMetrics?.length > 0) {
      return caseStudy.impactMetrics;
    }
    return [
      { label: 'Reduced claim processing time', value: '40%' },
      { label: 'Increased patient engagement', value: '35%' },
      { label: 'Enhanced interoperability', value: '4x' },
      { label: 'Real-time coordination', value: '24/7' },
      { label: 'Improved medication safety', value: '98%' },
    ];
  }, [caseStudy]);

  return (
    <Stack spacing={6}>
      <CaseStudyOverviewBlock overviewContent={overviewContent} animate={animate} />
      <CaseStudyProblemStatementBlock
        problemStatements={problemStatements}
        accentColor={accentColor}
        image={problemImage}
      />
      <CaseStudyConclusionBlock conclusion={conclusion} accentColor={accentColor} />
      <CaseStudyImpactBlock impactMetrics={impactMetrics} accentColor={accentColor} />
    </Stack>
  );
};

CaseStudyOverviewSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyOverviewSection;
