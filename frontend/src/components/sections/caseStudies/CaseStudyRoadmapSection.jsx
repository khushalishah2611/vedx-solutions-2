import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Stack, Typography, useTheme } from '@mui/material';

const steps = [
  { label: 'Discovery & Planning', duration: '4 Weeks', detail: 'Requirements, roadmap alignment, and success KPIs.' },
  { label: 'UI/UX', duration: '7 Weeks', detail: 'Wireframes, visual systems, and prototypes for core flows.' },
  { label: 'Rapid Prototyping', duration: '2 Weeks', detail: 'Clickable prototypes and stakeholder validations.' },
  { label: 'Frontend Development', duration: '12 Weeks', detail: 'Mobile + web implementation and integrations.' },
  { label: 'AI Feature Enhancement', duration: '5 Weeks', detail: 'Recommendation tuning and analytics dashboards.' },
  { label: 'Quality Assurance', duration: '2 Weeks', detail: 'Manual + automated testing across devices.' },
  { label: 'UAT & Beta Testing', duration: '2 Weeks', detail: 'Pilot launches with performance monitoring.' },
  { label: 'Deployment & Go Live', duration: '2 Weeks', detail: 'Release management, training, and support.' },
];

const CaseStudyRoadmapSection = ({ animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#7c3aed' : theme.palette.primary.main;

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        bgcolor: isDark ? alpha('#0b1120', 0.92) : '#f8fafc',
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.7 : 0.35)}`,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center' }}>
          Execution Roadmap & Timeline: <Box component="span" sx={{ color: 'text.secondary' }}>34 Weeks</Box>
        </Typography>

        <Stack spacing={2.5} sx={{ position: 'relative', pl: { xs: 0, md: 4 } }}>
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 10, md: 24 },
              top: 6,
              bottom: 6,
              width: 2,
              bgcolor: alpha(accentColor, 0.6),
              display: { xs: 'none', md: 'block' },
            }}
          />
          {steps.map((step, index) => (
            <Stack
              key={step.label}
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(10px)',
                transition: `all 420ms ease ${160 + index * 70}ms`,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  bgcolor: alpha(accentColor, 0.2),
                  border: `2px solid ${alpha(accentColor, 0.8)}`,
                  color: accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isDark ? alpha('#111827', 0.8) : '#fff',
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {step.label} <Box component="span" sx={{ color: 'text.secondary' }}>{step.duration}</Box>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {step.detail}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

CaseStudyRoadmapSection.propTypes = {
  animate: PropTypes.bool,
};

export default CaseStudyRoadmapSection;
