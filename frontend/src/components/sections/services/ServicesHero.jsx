import { Box, Chip, Container, Stack, Typography, alpha, useTheme } from '@mui/material';

const SERVICES_HERO_IMAGE =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

const ServicesHero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section" sx={{ position: 'relative', pt: { xs: 16, md: 20 }, pb: { xs: 10, md: 14 } }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${SERVICES_HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.45)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            isDark
              ? 'linear-gradient(160deg, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 65%, rgba(2,6,23,0.98) 100%)'
              : 'linear-gradient(160deg, rgba(248,250,252,0.94) 0%, rgba(226,232,240,0.92) 65%, rgba(226,232,240,0.96) 100%)',
          zIndex: 1
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={3} alignItems="flex-start">
          <Chip
            label="Our Services"
            sx={{
              bgcolor: alpha(accentColor, 0.15),
              color: accentColor,
              fontWeight: 600,
              letterSpacing: 0.75,
              px: 1.5,
              py: 1.5,
              borderRadius: 999
            }}
          />
          <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 56 }, fontWeight: 800, maxWidth: 720 }}>
            Digital product teams that deliver clarity, velocity, and measurable business growth.
          </Typography>
          <Typography variant="body1" sx={{ color: subtleText, maxWidth: 640 }}>
            Partner with Vedx Solutions to strategise, design, and build experiences that delight users and accelerate
            operations. From discovery workshops to launch and beyond, we bring a human approach to every engagement.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default ServicesHero;
