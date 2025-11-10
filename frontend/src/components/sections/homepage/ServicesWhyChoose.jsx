import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { serviceHighlights } from '../../../data/servicesPage.js';

const ServicesHighlights = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      {/* Section Header */}
      <Stack
        spacing={3}
        sx={{
          mb: 4,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}
        >
          Why choose Vedx Solutions
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: subtleText, maxWidth: 720 }}
        >
          A partner obsessed with outcomes, clarity, and dependable delivery. We build every engagement around
          collaboration and trust.
        </Typography>
      </Stack>

      {/* Highlights Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          textAlign: 'center',
          alignItems: 'stretch',
        }}
      >
        {serviceHighlights.map((highlight) => {
          const Icon = highlight.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={highlight.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 0.5,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.75 : 0.97
                  ),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.4 : 0.6
                  )}`,
                  transition:
                    'transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease',
                  boxShadow: isDark
                    ? '0 4px 30px rgba(2,6,23,0.35)'
                    : '0 4px 30px rgba(15,23,42,0.15)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: isDark
                      ? '0 12px 40px rgba(255,255,255,0.12)'
                      : '0 12px 40px rgba(0,0,0,0.12)',
                    borderColor: alpha(accentColor, 0.5),
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(accentColor, 0.16),
                    color: accentColor,
                    mb: 2,
                  }}
                >
                  <Icon />
                </Box>

                {/* Text */}
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {highlight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {highlight.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ServicesHighlights;
