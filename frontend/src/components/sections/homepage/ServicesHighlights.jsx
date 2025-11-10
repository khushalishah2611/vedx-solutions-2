import { Box, Button, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { fullStackServiceFeatures } from '../../../data/servicesPage.js';

const ServicesHighlights = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section" sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)'
            : 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,0.9) 100%)'
        }}
      />
      <Stack spacing={6} sx={{ position: 'relative' }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
            Full Stack Development Service
          </Typography>
          <Typography variant="body1" sx={{ color: subtleText, maxWidth: 760 }}>
            From strategy to support, VedX Solutions unifies design, engineering, DevOps, and analytics to deliver
            outcome-driven digital products.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {fullStackServiceFeatures.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  p: 3.5,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.98),
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                  boxShadow: isDark
                    ? '0 24px 45px rgba(15,23,42,0.45)'
                    : '0 24px 45px rgba(15,23,42,0.12)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: alpha(accentColor, 0.6),
                    boxShadow: isDark
                      ? '0 28px 60px rgba(103,232,249,0.18)'
                      : '0 28px 60px rgba(59,130,246,0.18)'
                  }
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Stack alignItems="center">
          <Button
            variant="contained"
            size="large"
            onClick={onContactClick}
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 4, md: 8 },
              py: { xs: 1.5, md: 2 },
              '&:hover': {
                background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
              }
            }}
          >
            Request a Quote
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ServicesHighlights;
