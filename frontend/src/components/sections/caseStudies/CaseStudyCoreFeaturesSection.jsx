import React from 'react';
import { alpha, Grid, Paper, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CaseStudyCoreFeaturesSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="center" textAlign="center">
      {caseStudy.coreFeatures?.slice(0, 4).map((feature, index) => (
        <Grid item xs={12} sm={6} md={3} key={feature.title}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              p: '10px',
              borderRadius: 0.5,
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,
              bgcolor: isDark ? alpha('#0b1120', 0.8) : '#f7fafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontWeight: 700,
              color: isDark ? '#e2e8f0' : '#0f172a',
              transition:
                'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.45s ease',
              boxShadow: '0 0 0 rgba(0,0,0,0)',
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(18px)',
              transitionDelay: `${150 + index * 80}ms`,
              '&:hover': {
                transform: 'translateY(-6px)',
                borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                boxShadow: isDark
                  ? '0 18px 30px rgba(0,0,0,0.7)'
                  : '0 18px 32px rgba(15,23,42,0.15)',
              },
            }}
          >
            <Typography
              variant="subtitle1"
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
              {feature.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

CaseStudyCoreFeaturesSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyCoreFeaturesSection;
