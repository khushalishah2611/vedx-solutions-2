import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { processSteps } from '../../../data/servicesPage.js';

const ServicesProcess = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Process
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          We follow a transparent roadmap—from discovery to deployment—so you always know what is happening next.
        </Typography>
      </Stack>
      <Grid container spacing={4}>
        {processSteps.map((step, index) => (
          <Grid item xs={12} md={4} key={step.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  backgroundImage: `url(${step.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    px: 2,
                    py: 0.5,
                    borderRadius: 999,
                    background: alpha('#0f172a', 0.7),
                    color: 'common.white',
                    fontWeight: 600,
                    letterSpacing: 1.2
                  }}
                >
                  {index + 1}
                </Box>
              </Box>
              <Stack spacing={1.5} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: subtleText }}>
                  {step.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesProcess;
