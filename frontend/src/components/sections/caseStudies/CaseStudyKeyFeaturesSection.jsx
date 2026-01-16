import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

const CaseStudyKeyFeaturesSection = ({ caseStudy, animate = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#a855f7' : theme.palette.primary.main;

  const features = useMemo(() => {
    if (caseStudy?.coreFeatures?.length) {
      return caseStudy.coreFeatures.slice(0, 3);
    }

    return [
      {
        title: 'Delivery Command Center',
        description:
          'Operations dashboards blend telematics, kitchen queueing, and driver ETAs to predict late deliveries before they happen.',
      },
      {
        title: 'Community and Social Planning',
        description:
          'Create community groups, chat rooms, invite friends, and share itineraries with emergency contacts.',
      },
      {
        title: 'Personalised & AI Recommendations',
        description:
          'Smart itineraries, budget planning, and best-time insights powered by AI.',
      },
    ];
  }, [caseStudy]);

  const getBullets = (text = '') =>
    text
      .split('.')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}>
      <Stack spacing={6}>
        {/* SECTION LABEL */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              border: `1px solid ${alpha('#fff', 0.15)}`,
              background: isDark
                ? alpha('#000', 0.55)
                : alpha('#fff', 0.8),
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${accentColor}, #2196f3)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Key Features
            </Box>
          </Box>
        </Box>

        {/* FEATURES */}
        {features.map((feature, index) => {
          const bullets = getBullets(feature.description);
          const imageLeftDesktop = index % 2 === 1;

          return (
            <Grid
              key={index}
              container
              spacing={2}
              alignItems="center"
              direction={{
                xs: 'column', // 📱 image top, text bottom
                md: imageLeftDesktop ? 'row-reverse' : 'row',
              }}
              textAlign={{ xs: 'center', md: 'left' }}
            >
              {/* IMAGE */}
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 250,
                    height: 250,
                    overflow: 'hidden',
                  
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'none' : 'translateY(20px)',
                    transition: 'all 600ms ease',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                    alt={feature.title}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Grid>

              {/* TEXT */}
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {feature.title}
                  </Typography>

                  <Stack
                    component="ul"
                    spacing={1}
                    sx={{
                      pl: { xs: 0, md: 2 },
                      listStylePosition: 'inside',
                    }}
                  >
                    {(bullets.length ? bullets : [feature.description]).map(
                      (item, i) => (
                        <Typography
                          component="li"
                          variant="body2"
                          key={i}
                          sx={{
                            lineHeight: 1.8,
                            color: isDark
                              ? alpha('#fff', 0.75)
                              : 'text.secondary',
                          }}
                        >
                          {item}
                        </Typography>
                      )
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          );
        })}
      </Stack>
    </Box>
  );
};

CaseStudyKeyFeaturesSection.propTypes = {
  caseStudy: PropTypes.object,
  animate: PropTypes.bool,
};

export default CaseStudyKeyFeaturesSection;
