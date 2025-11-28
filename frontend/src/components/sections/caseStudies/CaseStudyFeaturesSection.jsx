import React from 'react';
import { alpha, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CaseStudyFeaturesSection = ({ featureBadges, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  if (!featureBadges.length) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: { xs: 5, md: 7 },
        p: { xs: 3, md: 4 },
        borderRadius: 0.5,
        background: isDark
          ? `linear-gradient(135deg, ${alpha('#0b1120', 0.95)}, ${alpha('#0ea5e9', 0.16)})`
          : `linear-gradient(135deg, ${alpha('#0f172a', 0.92)}, ${alpha(accentColor, 0.28)})`,
        color: '#e2e8f0',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(18px)',
        transition: 'all 520ms ease 120ms',
        border: `1px solid ${alpha(accentColor, 0.45)}`,
      }}
    >
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 460ms ease 160ms',
          }}
        >
          Features that make the app a success ✨
        </Typography>

        <Grid container spacing={1.5}>
          {featureBadges.map((badge, index) => (
            <Grid item xs={12} sm={6} md={4} key={badge}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 0.75,
                  bgcolor: alpha('#0b1120', 0.4),
                  border: `1px solid ${alpha('#ffffff', 0.18)}`,
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'translateY(0)' : 'translateY(14px)',
                  transition:
                    'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
                  transitionDelay: `${190 + index * 60}ms`,
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                    boxShadow: isDark
                      ? '0 16px 26px rgba(0,0,0,0.7)'
                      : '0 14px 26px rgba(15,23,42,0.2)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, background-image 0.3s ease',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  }}
                >
                  {badge}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
};

CaseStudyFeaturesSection.propTypes = {
  featureBadges: PropTypes.arrayOf(PropTypes.string).isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyFeaturesSection;
