import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

const CaseStudyChallengesSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const cards = useMemo(() => {
    if (caseStudy.challengeHighlights?.length > 0) {
      return caseStudy.challengeHighlights;
    }
    return [
      {
        title: 'Fast Third-Party API Integrations',
        description: 'Implemented API caching and async request handling for reliable partner syncs.',
      },
      {
        title: 'Adaptive AI Travel Model',
        description: 'Feedback loops retrain recommendations so every itinerary stays relevant.',
      },
      {
        title: 'Offline Access for Travelers',
        description: 'Local data storage with periodic sync keeps maps and bookings available.',
      },
      {
        title: 'Security & Reliability',
        description: 'Geo-fencing, role-based access, and 99.9% uptime monitoring ensure trust.',
      },
    ];
  }, [caseStudy]);

  const icons = [BoltOutlinedIcon, AutoAwesomeOutlinedIcon, WifiOffOutlinedIcon, ShieldOutlinedIcon];

  return (
    <Stack spacing={4}>
      <Stack spacing={1.5}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Development Challenge and Solution
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9, maxWidth: 880 }}>
          {caseStudy.journeyHighlight?.description ||
            'We focused on speed, intelligence, and reliability to keep every trip seamless across devices.'}
        </Typography>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Grid container spacing={2.5} wrap="nowrap" sx={{ minWidth: { xs: 720, md: '100%' } }}>
          {cards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Grid item xs={12} sm={6} md={3} key={card.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 2.5,
                    borderRadius: 1.5,
                    bgcolor: isDark ? alpha('#0b1120', 0.9) : '#f8fafc',
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                    minHeight: 190,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(16px)',
                    transition: `all 450ms ease ${160 + index * 90}ms`,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                      bgcolor: isDark ? alpha('#111827', 0.6) : '#fff',
                    }}
                  >
                    <Icon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {card.description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Stack>
  );
};

CaseStudyChallengesSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyChallengesSection;
