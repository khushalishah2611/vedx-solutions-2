import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Stack, Typography, useTheme } from '@mui/material';

const CaseStudyAppShowcaseSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const screenshots = caseStudy.screenshots?.slice(0, 5) || [];

  return (
    <Stack spacing={3} alignItems="center" textAlign="center">
      <Stack spacing={1.5} maxWidth={820}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Our App
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
          {caseStudy.excerpt ||
            'The experience brings discovery, planning, and booking into one place with immersive mobile views.'}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 2, md: 3 },
        }}
      >
        {screenshots.map((shot, index) => (
          <Box
            key={shot.src}
            sx={{
              width: { xs: 140, sm: 160, md: 180 },
              height: { xs: 280, sm: 320, md: 360 },
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.4)}`,
              bgcolor: isDark ? alpha('#0f172a', 0.9) : '#fff',
              boxShadow: isDark ? '0 16px 35px rgba(0,0,0,0.45)' : '0 16px 35px rgba(15,23,42,0.18)',
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(16px)',
              transition: `all 500ms ease ${160 + index * 120}ms`,
            }}
          >
            <Box
              component="img"
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

CaseStudyAppShowcaseSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyAppShowcaseSection;
