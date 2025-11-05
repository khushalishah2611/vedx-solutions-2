import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { serviceHighlights } from '../../../data/servicesPage.js';

const ServicesHighlights = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Why choose Vedx Solutions
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          A partner obsessed with outcomes, clarity, and dependable delivery. We build every engagement around
          collaboration and trust.
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {serviceHighlights.map((highlight) => {
          const Icon = highlight.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={highlight.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                  boxShadow: isDark ? '0 20px 45px rgba(15,23,42,0.35)' : '0 20px 45px rgba(15,23,42,0.12)'
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(accentColor, 0.16),
                    color: accentColor
                  }}
                >
                  <Icon />
                </Box>
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
