import React from 'react';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudyApproachSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box my={10}>
      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={2.5}>
            <CaseStudySectionLabel text="Our Approach" animate={animate} />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(14px)',
                transition: 'all 480ms ease 140ms',
              }}
            >
              Building experiences that stay on the correct path
            </Typography>

            <Stack spacing={1.5}>
              {caseStudy.clientRequirements?.slice(0, 2).map((paragraph, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.9,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(16px)',
                    transition: `all 500ms ease ${220 + index * 80}ms`,
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              overflow: 'hidden',
              borderRadius: 0.5,
              background: alpha(accentColor, isDark ? 0.12 : 0.09),
              minHeight: { xs: 240, md: 280 },
              display: 'flex',
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
              alt={`${caseStudy.title} journey visual`}
              loading="lazy"
              sx={{
                width: '100%',
                objectFit: 'cover',
                mixBlendMode: isDark ? 'screen' : 'normal',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateX(0)' : 'translateX(24px)',
                transition: 'all 650ms ease 140ms',
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

CaseStudyApproachSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyApproachSection;
