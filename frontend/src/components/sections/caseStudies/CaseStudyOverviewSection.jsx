import React from 'react';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudyOverviewSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box my={5}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: 0.5,
              background: alpha(accentColor, isDark ? 0.12 : 0.08),
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,
              transition: 'border-color 220ms ease, box-shadow 0.25s ease',
              boxShadow: '0 0 0 rgba(0,0,0,0)',
              '&:hover': {
                borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                boxShadow: isDark
                  ? '0 18px 30px rgba(0,0,0,0.7)'
                  : '0 18px 32px rgba(15,23,42,0.15)',
              },
            }}
          >
            <Box
              component="img"
              src={caseStudy.heroImage}
              alt="overview image"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateX(0)' : 'translateX(-24px)',
                transition: 'all 700ms ease',
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <CaseStudySectionLabel text="Project OverView" animate={animate} />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(14px)',
                transition: 'all 480ms ease 140ms',
              }}
            >
              Inspire more {caseStudy.category?.toLowerCase() || 'growth'}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.9,
                maxWidth: 900,
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 500ms ease 220ms',
              }}
            >
              {caseStudy.excerpt}
            </Typography>

            {caseStudy.tagline && (
              <CaseStudySectionLabel
                text={caseStudy.tagline}
                animate={animate}
                delay={280}
                sx={{ transform: animate ? 'translateY(0)' : 'translateY(18px)' }}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

CaseStudyOverviewSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyOverviewSection;
