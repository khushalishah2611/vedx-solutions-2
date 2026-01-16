import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Stack, Typography, useTheme } from '@mui/material';

const CaseStudyProblemStatementBlock = ({
  problemStatements = [],
  accentColor,
  image,
  animate = true,
  description,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 0 } }}>
      <Stack spacing={4} alignItems="center">
        {/* Header */}
        <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: 0.5,
                border: `1px solid ${alpha('#ffffff', 0.1)}`,
                background: isDark
                  ? alpha('#000000', 0.55)
                  : alpha('#dddddd', 0.9),
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: 11,
              }}
            >
              <Box
                component="span"
                sx={{
                  background:
                    'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Problem Statement
              </Box>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: isDark ? alpha('#fff', 0.74) : 'text.secondary',
              lineHeight: 1.9,
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 500ms ease 200ms',
              textAlign: 'center',
              maxWidth: 900,
            }}
          >
            {description ||
              `Our Client is a travel enthusiast who wants to design and develop a
              solution that consolidates all travel activities and information in
              one place. He also wanted to integrate AI into his application,
              where personalised travel recommendations can be made based on your
              preferences and previous journeys.`}
          </Typography>
        </Stack>

        {/* Content */}
        <Grid
          container
          spacing={3}
          alignItems="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: '100%' }}
        >
          {/* Image */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Box
                component="img"
                src={image}
                alt="Problem statement illustration"
                loading="lazy"
                sx={{
                  width: '100%',
                  maxWidth: 520,
                  borderRadius: 1,
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>

          {/* Points */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 720,
                mx: 'auto', // ✅ equal left-right space
              }}
            >
              <Stack spacing={1.8}>
                {problemStatements.map((item, idx) => (
                  <Box
                    key={`${item}-${idx}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    {/* Dot */}
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        mt: '7px',
                        flexShrink: 0,
                        bgcolor: alpha(
                          accentColor,
                          isDark ? 0.95 : 0.9
                        ),
                        boxShadow: `0 0 0 4px ${alpha(
                          accentColor,
                          isDark ? 0.12 : 0.1
                        )}`,
                      }}
                    />

                    {/* Text */}
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        color: isDark
                          ? alpha('#fff', 0.72)
                          : 'text.secondary',
                        lineHeight: 1.85,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

CaseStudyProblemStatementBlock.propTypes = {
  problemStatements: PropTypes.arrayOf(PropTypes.string).isRequired,
  accentColor: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  animate: PropTypes.bool,
  description: PropTypes.string,
};

export default CaseStudyProblemStatementBlock;
