import React, { useMemo } from 'react';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CaseStudySectionLabel from './CaseStudySectionLabel.jsx';

const CaseStudySolutionSection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const solutionCards = useMemo(() => {
    const primaryCards =
      caseStudy.solutionHighlights?.length > 0
        ? caseStudy.solutionHighlights
        : caseStudy.coreFeatures?.map((feature) => ({
            title: feature.title,
            description: feature.description,
          })) || [];

    const fallbackCards = [
      {
        title: 'AI-powered personalisation',
        description: 'Smart recommendations blend real-time signals, preferences, and travel intent.',
      },
      {
        title: 'Always-on updates',
        description: 'Live availability, forecasts, and local insights keep every plan accurate.',
      },
      {
        title: 'Loved by explorers',
        description: 'Design-led experiences keep users engaged from discovery to post-trip review.',
      },
      {
        title: 'Integrated safety',
        description: 'SOS, location sharing, and offline access keep travelers supported anywhere.',
      },
    ];

    const mergedCards = [...primaryCards, ...fallbackCards].slice(0, 4);
    return mergedCards;
  }, [caseStudy]);

  return (
    <Box my={{ xs: 6, md: 10 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 0.5,
          border: `1px solid ${alpha(accentColor, 0.4)}`,
          bgcolor: isDark ? alpha('#0b1120', 0.9) : '#f1f5f9',
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(18px)',
          transition:
            'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.52s ease 120ms',
          '&:hover': {
            borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
            boxShadow: isDark
              ? '0 18px 30px rgba(0,0,0,0.7)'
              : '0 18px 32px rgba(15,23,42,0.15)',
          },
        }}
      >
        <Stack spacing={3}>
          <Stack
            spacing={1.5}
            alignItems={{ xs: 'center', md: 'center' }}
            textAlign={{ xs: 'center', md: 'center' }}
          >
            <CaseStudySectionLabel text="Our Solution" animate={animate} />

            <Typography variant="h5" sx={{ fontWeight: 800, maxWidth: 720 }}>
              {caseStudy.journeyHighlight?.title || 'A journey that moves fast and stays reliable'}
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9, maxWidth: 800 }}>
              {caseStudy.journeyHighlight?.description ||
                'We launched quickly, iterated with user feedback, and kept performance tight across every platform.'}
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {solutionCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={card.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 2.5,
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                    bgcolor: isDark ? alpha('#0f172a', 0.85) : '#ffffff',
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(16px)',
                    transition: `all 480ms ease ${160 + index * 80}ms`,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {card.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};

CaseStudySolutionSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudySolutionSection;
