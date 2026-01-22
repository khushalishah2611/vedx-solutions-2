import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';

const CaseStudyTechnologiesSection = ({ caseStudy, animate = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const technologies = useMemo(() => {
    if (caseStudy?.technologyHighlights?.length) {
      return caseStudy.technologyHighlights;
    }

    return [
      { title: 'React Native', image: '' },
      { title: 'Node.js', image: '' },
      { title: 'PostgreSQL', image: '' },
      { title: 'AWS', image: '' },
      { title: 'Redis', image: '' },
      { title: 'Figma', image: '' },
    ];
  }, [caseStudy]);

  return (
    <Stack spacing={3} alignItems="center">
      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: 0.5,
          border: `1px solid ${alpha('#fff', 0.12)}`,
          background: isDark ? alpha('#000', 0.55) : alpha('#ddd', 0.9),
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        <Box
          component="span"
          sx={{
            background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Technologies
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Grid container spacing={2.5} justifyContent="center">
          {technologies.map((technology, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${technology.title}-${index}`}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 0.5,
                  bgcolor: isDark ? alpha('#0b1120', 0.9) : '#fff',
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                  textAlign: 'center',
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'none' : 'translateY(14px)',
                  transition: `all 500ms ease ${120 + index * 80}ms`,
                }}
              >
                {technology.image ? (
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 1.5,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      border: `1px solid ${alpha('#a855f7', 0.4)}`,
                      backgroundColor: alpha('#a855f7', 0.1),
                    }}
                  >
                    <Box
                      component="img"
                      src={technology.image}
                      alt={technology.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 1.5,
                      borderRadius: 1.5,
                      border: `1px solid ${alpha('#a855f7', 0.35)}`,
                      background: alpha('#a855f7', 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: alpha('#a855f7', 0.8),
                      fontWeight: 600,
                    }}
                  >
                    {technology.title?.slice(0, 2)?.toUpperCase() || 'TX'}
                  </Box>
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {technology.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

CaseStudyTechnologiesSection.propTypes = {
  caseStudy: PropTypes.object,
  animate: PropTypes.bool,
};

export default CaseStudyTechnologiesSection;
