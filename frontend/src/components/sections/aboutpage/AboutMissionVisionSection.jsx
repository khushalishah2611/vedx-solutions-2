import { Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const AboutMissionVisionSection = ({ content }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const mission = content?.mission;
  const vision = content?.vision;

  if (!mission && !vision) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 0.5,
          background: isDark
            ? 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(79,70,229,0.45) 100%)'
            : 'linear-gradient(135deg, rgba(226,232,255,0.95) 0%, rgba(129,140,248,0.35) 100%)',
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.5)}`,
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {mission && (
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5} sx={{ height: '100%' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: isDark ? alpha('#ffffff', 0.92) : alpha('#000000', 0.9) }}
                >
                  {mission.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: isDark ? alpha('#ffffff', 0.8) : 'text.primary', lineHeight: 1.9 }}
                >
                  {mission.description}
                </Typography>
              </Stack>
            </Grid>
          )}

          {vision && (
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5} sx={{ height: '100%' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: isDark ? alpha('#ffffff', 0.92) : alpha('#000000', 0.9) }}
                >
                  {vision.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: isDark ? alpha('#ffffff', 0.8) : 'text.primary', lineHeight: 1.9 }}
                >
                  {vision.description}
                </Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutMissionVisionSection;
