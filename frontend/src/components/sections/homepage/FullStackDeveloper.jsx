import { Box, Button, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { fullStackDeveloperHighlights } from '../../../data/servicesPage.js';

const FullStackDeveloper = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box component="section">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.75))'
            : 'linear-gradient(135deg, rgba(250,250,255,0.98), rgba(191,219,254,0.9))',
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.4)}`,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 }
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <Typography variant="overline" sx={{ letterSpacing: 1, fontWeight: 600, color: alpha('#fff', 0.9) }}>
                Full Stack Developer
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 40 }, fontWeight: 700, color: '#fff' }}>
                Our result-oriented developer develops robust, secure and scalable enterprise-grade web applications.
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#fff', 0.85) }}>
                Get it through user-centric design and clean code. We design, build, and optimise digital experiences that deliver measurable value.
              </Typography>
              <Stack spacing={1.5}>
                {fullStackDeveloperHighlights.map((highlight) => (
                  <Stack key={highlight} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: alpha('#fff', 0.9),
                        mt: 1
                      }}
                    />
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.88), lineHeight: 1.6 }}>
                      {highlight}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Button
                variant="contained"
                size="large"
                onClick={onContactClick}
                sx={{
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 1.75 },
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
                  }
                }}
              >
                Hire Full Stack Expert
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                height: { xs: 280, md: 360 },
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: isDark
                  ? '0 30px 60px rgba(15,23,42,0.55)'
                  : '0 30px 60px rgba(15,23,42,0.16)'
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FullStackDeveloper;
