import React from 'react';
import { alpha, Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudySolutionSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box my={{ xs: 6, md: 10 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 0.5,
          border: `1px solid ${alpha(accentColor, 0.4)}`,
          bgcolor: isDark ? alpha('#0b1120', 0.9) : '#f1f5f9',
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(18px)',
          transition:
            'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.52s ease 120ms',
          '&:hover': {
            borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
            boxShadow: isDark
              ? '0 18px 30px rgba(0,0,0,0.7)'
              : '0 18px 32px rgba(15,23,42,0.15)',
          },
        }}
      >
        <Stack spacing={2.5} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
          <CaseStudySectionLabel text="Our Solution" animate={animate} />

          <Typography variant="h5" sx={{ fontWeight: 800, maxWidth: 720 }}>
            {caseStudy.journeyHighlight?.title || 'A journey that moves fast and stays reliable'}
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9, maxWidth: 800 }}>
            {caseStudy.journeyHighlight?.description ||
              'We launched quickly, iterated with user feedback, and kept performance tight across every platform.'}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'center', md: 'flex-start' }}>
            {(caseStudy.advancedContent || []).slice(0, 4).map((module, index) => (
              <CaseStudySectionLabel
                key={module.title}
                text={module.title}
                animate={animate}
                delay={60 + index * 60}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

CaseStudySolutionSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudySolutionSection;
