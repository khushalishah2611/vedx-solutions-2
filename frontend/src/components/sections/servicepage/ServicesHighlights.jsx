import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { fullStackBenefits } from '../../../data/servicesPage.js';

const ServicesHighlights = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.35 : 0.6);

  // 🌐 Replace with your actual image URL
  const imageUrl =
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80';

  return (
    <Box component="section">
      <Grid container spacing={6} alignItems="center">
        {/* Left Side - Image + Short Text */}
        <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 30, md: 42 },
              fontWeight: 700,
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 2, md: 3 }, // Adds space below heading
            }}
          >
            Full Stack Development Service
          </Typography>

          <Box
            component="img"
            src={imageUrl}
            alt="Full Stack Development"
            sx={{
              width: '100%',
              borderRadius: 0.5,
              objectFit: 'cover',
              boxShadow: isDark
                ? '0 24px 45px rgba(15,23,42,0.4)'
                : '0 24px 45px rgba(15,23,42,0.15)',
              transition: 'transform 0.4s ease',
              '&:hover': { transform: 'scale(1.03)' },
              mb: { xs: 3, md: 4 }, // Bottom margin under image
            }}
          />
        </Grid>


        {/* Right Side - Title + Benefits */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3} alignItems="flex-start" sx={{ mb: -15 }}>
            <Typography
              variant="body1"
              sx={{
                color: subtleText,
                maxWidth: 700,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.
              From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.
              From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.
              From concept to deployment, we ensure high performance, scalability, and clean. architecture for every solution.
              From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.  From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: subtleText,
                maxWidth: 700,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.  From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.  From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.
            </Typography>

          </Stack>

        </Grid>
      </Grid>

      <Box
        component="section"
        sx={{
          position: "relative",
          mt: 10
        }}
      >
        <Grid item xs={12} md={6}>
          <Stack
            spacing={3}
            alignItems={{ xs: 'center', md: 'center' }}
            sx={{ mb: 10 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: 30, md: 42 },
                fontWeight: 700,
                textAlign: { xs: 'center', md: 'center' },
              }}
            >
              Full Stack Development Service
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: subtleText,
                maxWidth: 700,
                textAlign: { xs: 'center', md: 'center' },
              }}
            >
              From concept to deployment, we ensure high performance, scalability, and clean
              architecture for every solution.
            </Typography>
          </Stack>


          <Grid container spacing={3}>
            {fullStackBenefits.map(({ title, description, Icon }) => (
              <Grid item xs={12} sm={6} key={title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 0.5,
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      isDark ? 0.75 : 0.98
                    ),
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.4 : 0.5
                    )}`,
                    transition:
                      'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: alpha(accentColor, 0.6),
                    },
                  }}
                >
                  {Icon && (
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
                        mb: 1.5,
                      }}
                    >
                      <Icon />
                    </Box>
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease, background-image 0.3s ease',
                      '&:hover': {
                        color: 'transparent',
                        backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      },
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: subtleText, lineHeight: 1.7 }}
                  >
                    {description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ServicesHighlights;
