import React from 'react';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudyTechnologySection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box my={10}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <CaseStudySectionLabel text="Technology Stack" animate={animate} />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(14px)',
            transition: 'all 480ms ease 130ms',
          }}
        >
          The tools we chose to make this project a success
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {caseStudy.technologyStack?.map((tech, index) => {
            const techName = typeof tech === 'string' ? tech : tech?.name;
            const techIcon = typeof tech === 'object' ? tech?.icon : null;
            const displayName = techName || 'Technology';

            return (
              <Grid item xs={6} sm={4} md={3} key={techName || `${displayName}-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 0.5,
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.98),
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
                    transition:
                      'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.45s ease',
                    boxShadow: isDark
                      ? '0 20px 35px rgba(15,23,42,0.35)'
                      : '0 20px 35px rgba(15,23,42,0.08)',
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(18px)',
                    transitionDelay: `${150 + index * 80}ms`,
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                      boxShadow: isDark
                        ? '0 24px 40px rgba(15,23,42,0.6)'
                        : '0 24px 40px rgba(15,23,42,0.14)',
                    },
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    {techIcon ? (
                      <Box
                        component="img"
                        src={techIcon}
                        alt={displayName}
                        loading="lazy"
                        sx={{ width: 36, height: 36, objectFit: 'contain' }}
                      />
                    ) : null}

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        transition: 'color 0.3s ease, background-image 0.3s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                    >
                      {displayName}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Box>
  );
};

CaseStudyTechnologySection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyTechnologySection;
