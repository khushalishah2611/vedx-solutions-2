import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

const CaseStudyKeyFeaturesSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#a855f7' : theme.palette.primary.main;

  const features = useMemo(() => {
    const coreItems = caseStudy.coreFeatures?.slice(0, 3) || [];
    if (coreItems.length > 0) {
      return coreItems;
    }
    return [
      {
        title: 'User Onboarding and Profile Management',
        description: 'Secure registration, admin approvals, and travel preferences.',
      },
      {
        title: 'Personalised & AI Recommendations',
        description: 'Smart itinerary suggestions, budgets, and best-time insights.',
      },
      {
        title: 'Real-time Insight & Local Discovery',
        description: 'Local events, alerts, and weather-ready plans.',
      },
    ];
  }, [caseStudy]);

  const icons = [PersonOutlineIcon, PsychologyOutlinedIcon, PublicOutlinedIcon];

  const getBullets = (text) => {
    if (!text) {
      return [];
    }
    return text
      .split('.')
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px dashed ${alpha(theme.palette.divider, isDark ? 0.6 : 0.4)}`,
        px: { xs: 2.5, md: 4 },
        py: { xs: 4, md: 5 },
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center' }}>
          Key Feature
        </Typography>

        <Stack spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => {
            const Icon = icons[index % icons.length];
            const bullets = getBullets(feature.description);

            return (
              <Grid
                container
                spacing={3}
                alignItems="center"
                key={feature.title}
                direction={index % 2 === 1 ? 'row-reverse' : 'row'}
              >
                <Grid item xs={12} md={7}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 1.5,
                      bgcolor: isDark ? alpha('#111827', 0.85) : '#f8fafc',
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(12px)',
                      transition: `all 450ms ease ${120 + index * 120}ms`,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Stack component="ul" spacing={0.8} sx={{ pl: 2, color: 'text.secondary', mb: 0 }}>
                      {(bullets.length ? bullets : [feature.description]).map((bullet) => (
                        <Typography component="li" variant="body2" key={bullet} sx={{ lineHeight: 1.8 }}>
                          {bullet}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      width: { xs: 120, md: 160 },
                      height: { xs: 120, md: 160 },
                      borderRadius: '50%',
                      mx: { xs: 'auto', md: 0 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `radial-gradient(circle at top, ${alpha(accentColor, 0.6)}, ${
                        isDark ? '#111827' : '#ffffff'
                      })`,
                      border: `1px solid ${alpha(accentColor, 0.4)}`,
                      boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.45)' : '0 12px 30px rgba(15,23,42,0.12)',
                    }}
                  >
                    <Icon sx={{ fontSize: 56, color: accentColor }} />
                  </Box>
                </Grid>
              </Grid>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

CaseStudyKeyFeaturesSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyKeyFeaturesSection;
