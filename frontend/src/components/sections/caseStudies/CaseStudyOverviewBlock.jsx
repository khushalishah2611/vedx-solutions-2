import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Stack, Typography, useTheme } from '@mui/material';

/**
 * imagePosition: 'right' | 'left'
 * default = 'right' (Text left, Image right on desktop)
 * On mobile (xs): Image first, then description/text
 */
const CaseStudyOverviewBlock = ({
  overviewContent,
  animate = true,
  imagePosition = 'right',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isImageLeft = imagePosition === 'left';

  return (
    <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
      {/* ================= IMAGE SECTION (MOBILE FIRST) ================= */}
      <Grid
        item
        xs={12}
        md={5}
        order={{ xs: 1, md: isImageLeft ? 1 : 2 }}
        display="flex"
        justifyContent={{ xs: 'center', md: isImageLeft ? 'flex-start' : 'flex-end' }}
      >
        <Box
          sx={{
            height: { xs: 240, sm: 300, md: 350 },
            width: { xs: '100%', sm: 320, md: 350 },
            maxWidth: 350,
            overflow: 'hidden',
            borderRadius: 0.5,
            border: `1px solid ${alpha('#fff', isDark ? 0.1 : 0.4)}`,
            boxShadow: isDark
              ? '0 20px 60px rgba(15, 23, 42, 0.55)'
              : '0 20px 50px rgba(15, 23, 42, 0.15)',
            opacity: animate ? 1 : 0,
            transform: animate
              ? 'translateX(0)'
              : isImageLeft
              ? 'translateX(-20px)'
              : 'translateX(20px)',
            transition: 'all 600ms ease 220ms',
          }}
        >
          <Box
            component="img"
            src={overviewContent.image}
            alt={`${overviewContent.title} overview`}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      </Grid>

      {/* ================= TEXT SECTION ================= */}
      <Grid
        item
        xs={12}
        md={7}
        order={{ xs: 2, md: isImageLeft ? 2 : 1 }}
      >
        <Stack spacing={2.5}>
          {/* Badge */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
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
                Overview
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: isDark ? alpha('#fff', 0.74) : 'text.secondary',
              lineHeight: 1.9,
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 500ms ease 200ms',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Our Client is a travel enthusiast who wants to design and develop a
            solution that consolidates all travel activities and information in
            one place. He also wanted to integrate AI into his application,
            where personalised travel recommendations can be made based on your
            preferences and previous journeys.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

CaseStudyOverviewBlock.propTypes = {
  overviewContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  animate: PropTypes.bool,
  imagePosition: PropTypes.oneOf(['left', 'right']),
};

export default CaseStudyOverviewBlock;
