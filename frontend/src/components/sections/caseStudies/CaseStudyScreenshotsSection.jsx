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
      sx={{
        borderRadius: { xs: 4, md: 6 },
        px: { xs: 3, md: 6 },
        py: { xs: 5, md: 7 },
        background: isDark
          ? 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(2,6,23,0.9) 100%)'
          : 'linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(226,232,240,0.65) 100%)',
        boxShadow: isDark
          ? '0 28px 60px rgba(0,0,0,0.55)'
          : '0 24px 48px rgba(15,23,42,0.12)',
        border: `1px solid ${alpha(accentColor, isDark ? 0.25 : 0.18)}`,
      }}
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
          spacing={{ xs: 3, md: 4 }}
          sx={{
            width: '100%',
            mt: { xs: 2, md: 3 },
          }}
        >
          {screenshotsToShow.map((shot, index) => {
            const slideDistance = index % 2 === 0 ? '-22px' : '22px';

            return (
              <Grid item xs={12} md={6} key={shot.src}>
                <Stack spacing={2.5} alignItems="center">
                  <Paper
                    elevation={0}
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: `1px solid ${alpha(accentColor, 0.35)}`,
                      background: isDark
                        ? 'linear-gradient(160deg, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 100%)'
                        : alpha('#ffffff', 0.85),
                      boxShadow: isDark
                        ? '0 24px 40px rgba(0,0,0,0.6)'
                        : '0 20px 38px rgba(15,23,42,0.18)',
                      position: 'relative',
                      isolation: 'isolate',
                      transform: 'translateY(0)',
                      transition:
                        'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',

                      '@keyframes glowPulse': {
                        '0%': { opacity: 0.25 },
                        '50%': { opacity: 0.6 },
                        '100%': { opacity: 0.25 },
                      },

                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: accentColor,
                        boxShadow: isDark
                          ? '0 30px 48px rgba(0,0,0,0.75)'
                          : '0 28px 44px rgba(15,23,42,0.22)',
                      },

                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 4,
                        border: `1px solid ${alpha(accentColor, 0.35)}`,
                        opacity: 0.4,
                        zIndex: -1,
                        filter: 'blur(1.4px)',
                        animation: animate
                          ? 'glowPulse 5s ease-in-out infinite'
                          : 'none',
                        transition:
                          'border-color 0.4s ease, opacity 0.4s ease',
                      },

                      '&:hover::after': {
                        borderColor: accentColor,
                        opacity: 0.8,
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
                        height: { xs: 420, md: 520 },
                        objectFit: 'cover',
                        display: 'block',
                        opacity: animate ? 1 : 0,
                        transform: animate
                          ? 'translateX(0)'
                          : `translateX(${slideDistance})`,
                        transition: `all 560ms ease ${160 + index * 70}ms`,
                      }}
                    />
                  </Paper>

                  <Stack spacing={1} sx={{ maxWidth: 360, textAlign: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#e2e8f0' : '#0f172a',
                        letterSpacing: 0.2,
                        transition: 'color 0.35s ease',
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
                </Stack>
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
