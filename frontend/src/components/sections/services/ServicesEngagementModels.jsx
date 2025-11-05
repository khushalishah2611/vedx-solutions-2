import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { engagementModels } from '../../../data/servicesPage.js';

const ServicesEngagementModels = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = '#9c27b0'; // purple accent

  return (
    <Box component="section" >
      {/* Header Section */}
      <Stack
        spacing={3}
        sx={{
          mb: 6,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderRadius: 0.5,
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
            background: !isDark
              ? alpha('#ddddddff', 0.9)
              : alpha('#0000007c', 0.9),
            color: alpha(accentColor, 0.9),
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontSize: 11,
            lineHeight: 1.3,
            width: 'fit-content',
          }}
        >
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            What We Can Do For You
          </Box>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
          }}
        >
          Ways to Choose Our Expertise for VedX Solutions
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78),
            maxWidth: 720,
          }}
        >
          Select the engagement model that aligns with your budget, project goals, and delivery rhythm —
          from flexible collaborations to dedicated teams tailored for your business success.
        </Typography>
      </Stack>

      {/* Engagement Cards */}
      <Grid container spacing={4}>
        {engagementModels.map((model) => (
          <Grid item xs={12} md={4} key={model.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: isDark ? alpha('#0f172a', 0.9) : alpha('#f9f9f9', 0.95),
                boxShadow: isDark
                  ? '0 30px 70px rgba(2,6,23,0.6)'
                  : '0 30px 70px rgba(15,23,42,0.22)',
                transition: 'all 0.4s ease',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: isDark
                    ? '0 40px 90px rgba(2,6,23,0.9)'
                    : '0 40px 90px rgba(15,23,42,0.3)',
                },
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  height: 300,
                  backgroundImage: `url(${model.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />

              {/* Text Section */}
              <Stack spacing={1.5} sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? 'common.white' : 'text.primary',
                  }}
                >
                  {model.title}
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
