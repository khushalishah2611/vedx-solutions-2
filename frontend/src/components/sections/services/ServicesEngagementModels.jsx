import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { engagementModels } from '../../../data/servicesPage.js';

const ServicesEngagementModels = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Ways to choose our expertise
        </Typography>
        <Typography variant="body1" sx={{ color: alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78), maxWidth: 720 }}>
          Select the engagement model that matches your budget, timeline, and delivery rhythm.
        </Typography>
      </Stack>
      <Grid container spacing={4}>
        {engagementModels.map((model) => (
          <Grid item xs={12} md={4} key={model.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                color: 'common.white',
                backgroundColor: alpha('#0f172a', 0.95),
                boxShadow: isDark ? '0 30px 70px rgba(2,6,23,0.6)' : '0 30px 70px rgba(15,23,42,0.22)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${model.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(1.05)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: isDark
                    ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 85%)'
                    : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 85%)'
                }}
              />
              <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1, p: 3.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {model.title}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                  {model.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesEngagementModels;
