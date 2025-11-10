import { Box, Grid, Paper, Stack, Typography, Divider, alpha, useTheme } from '@mui/material';
import { industriesServed } from '../../data/servicesPage.js';

const ServicesIndustries = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.6);
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box component="section">
      {/* Centered Header */}
      <Stack
        spacing={3}
        sx={{
          mb: 6,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
          }}
        >
          Industry we serve
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 720,
          }}
        >
          Deep domain partnerships let us tailor solutions that match regulatory,
          customer, and market realities across sectors.
        </Typography>
      </Stack>

      {/* Industry Cards */}
      <Grid container spacing={3} justifyContent="center">
        {industriesServed.map((industry) => (
          <Grid item xs={12} sm={6} md={3} key={industry.title}>
            <Paper
              elevation={0}
              sx={{
                height: 300,
                borderRadius: 0.5,
                overflow: 'hidden',
                position: 'relative',
                color: 'common.white',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.7 : 0.95
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                transition: 'all 0.35s ease',
                transform: 'translateY(0)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                boxShadow: isDark
                  ? '0 10px 25px rgba(255,255,255,0.08)'
                  : '0 10px 25px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),

                },
              }}
            >
              {/* Background Image */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${industry.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              />

              {/* Overlay Gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: isDark
                    ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 90%)'
                    : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 90%)',
                }}
              />

              {/* Text Content at Bottom */}
              <Stack
                spacing={1.5}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{
                  fontWeight: 700, "&:hover": {
                    color: isDark ? "#67e8f9" : theme.palette.primary.main,
                  },
                }}>
                  {industry.title}
                </Typography>
                <Divider sx={{ borderColor: alpha('#ffffff', 0.8) }} />
                <Typography
                  variant="body2"
                  sx={{ color: alpha('#ffffff', 0.8) }}
                >
                  {industry.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesIndustries;
