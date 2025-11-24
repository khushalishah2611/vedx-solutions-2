import React from 'react';
import {
  alpha,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudyScreenshotsSection = ({ screenshotsToShow, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  if (!screenshotsToShow || !screenshotsToShow.length) return null;

  return (
    <Box
      component="section"
   
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <CaseStudySectionLabel text="Application Screenshots" animate={animate} />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: 24, md: 32 },
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(14px)',
            transition: 'all 480ms ease 130ms',
          }}
        >
          Bringing the experience to life
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 640,
            lineHeight: 1.7,
          }}
        >
          Every case study surfaces immersive visuals with subtle motion so the
          story and UI details stay front and center.
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            width: '100%',
            mt: { xs: 2, md: 3 },
          }}
        >
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
                    background: isDark
                      ? alpha('#0b1120', 0.75)
                      : alpha(accentColor, 0.08),
                    boxShadow: isDark
                      ? '0 18px 32px rgba(0,0,0,0.65)'
                      : '0 18px 32px rgba(15,23,42,0.14)',
                    position: 'relative',
                    isolation: 'isolate',
                    transform: 'translateY(0)',
                    transition:
                      'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',

                    '@keyframes glowPulse': {
                      '0%': { opacity: 0.35 },
                      '50%': { opacity: 0.8 },
                      '100%': { opacity: 0.35 },
                    },

                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: accentColor,
                      boxShadow: isDark
                        ? '0 26px 40px rgba(0,0,0,0.85)'
                        : '0 26px 40px rgba(15,23,42,0.22)',
                    },

                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 0.5,
                      border: `1px solid ${alpha(accentColor, 0.35)}`,
                      opacity: 0.5,
                      zIndex: -1,
                      filter: 'blur(0.8px)',
                      animation: animate
                        ? 'glowPulse 5s ease-in-out infinite'
                        : 'none',
                      transition:
                        'border-color 0.4s ease, opacity 0.4s ease',
                    },

                    '&:hover::after': {
                      borderColor: accentColor,
                      opacity: 0.9,
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
                      transform: animate
                        ? 'translateX(0)'
                        : `translateX(${slideDistance})`,
                      transition: `all 560ms ease ${160 + index * 70}ms`,
                    }}
                  />

                  <Stack spacing={1.2} sx={{ p: { xs: 2, md: 2.5 } }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#e2e8f0' : '#0f172a',
                        letterSpacing: 0.2,
                        transition: 'color 0.35s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage:
                            'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                    >
                      {shot.alt}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.8,
                        transition: 'color 0.35s ease',
                      }}
                    >
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

CaseStudyScreenshotsSection.defaultProps = {
  animate: false,
};

export default CaseStudyScreenshotsSection;
