import React from 'react';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudyScreenshotsSection = ({ screenshotsToShow, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  if (!screenshotsToShow.length) return null;

  return (
    <Box
      my={10}
      sx={{
        '@keyframes glowPulse': {
          '0%': {
            boxShadow: isDark
              ? '0 18px 32px rgba(0,0,0,0.65)'
              : '0 18px 32px rgba(15,23,42,0.14)',
          },
          '50%': {
            boxShadow: isDark
              ? '0 24px 36px rgba(0,0,0,0.75)'
              : '0 24px 38px rgba(15,23,42,0.2)',
          },
          '100%': {
            boxShadow: isDark
              ? '0 18px 32px rgba(0,0,0,0.65)'
              : '0 18px 32px rgba(15,23,42,0.14)',
          },
        },
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <CaseStudySectionLabel text="Application Screenshots" animate={animate} />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(14px)',
            transition: 'all 480ms ease 130ms',
          }}
        >
          Bringing the experience to life
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', maxWidth: 640, lineHeight: 1.7 }}
        >
          Every case study surfaces immersive visuals with subtle motion so the story and UI details stay front and center.
        </Typography>

        <Grid container spacing={2}>
          {screenshotsToShow.map((shot, index) => {
            const slideDistance = index % 2 === 0 ? '-22px' : '22px';
            return (
              <Grid item xs={12} sm={6} md={4} key={shot.src}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 0.5,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(accentColor, 0.35)}`,
                    background: isDark ? alpha('#0b1120', 0.75) : alpha(accentColor, 0.08),
                    boxShadow: isDark
                      ? '0 18px 32px rgba(0,0,0,0.65)'
                      : '0 18px 32px rgba(15,23,42,0.14)',
                    position: 'relative',
                    isolation: 'isolate',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 0.5,
                      border: `1px solid ${alpha(accentColor, 0.35)}`,
                      opacity: 0.5,
                      filter: 'blur(0.5px)',
                      zIndex: -1,
                      animation: animate ? 'glowPulse 4.8s ease-in-out infinite' : 'none',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: { xs: 220, sm: 240, md: 260 },
                      objectFit: 'cover',
                      display: 'block',
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateX(0)' : `translateX(${slideDistance})`,
                      transition: `all 560ms ease ${160 + index * 70}ms`,
                    }}
                  />

                  <Stack spacing={1.2} sx={{ p: { xs: 2, md: 2.5 } }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800, color: isDark ? '#e2e8f0' : '#0f172a', letterSpacing: 0.2 }}
                    >
                      {shot.alt}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                      {shot.caption}
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

CaseStudyScreenshotsSection.propTypes = {
  screenshotsToShow: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      caption: PropTypes.string,
    })
  ).isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyScreenshotsSection;
