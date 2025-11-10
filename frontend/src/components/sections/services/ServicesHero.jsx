import { Box, Button, Chip, Container, Stack, Typography, alpha, useTheme } from '@mui/material';

const SERVICES_HERO_IMAGE =
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=80';

const HERO_STATS = [
  { label: 'Recurring Client', value: '80%' },
  { label: 'Team Experience', value: '10+' },
  { label: 'Satisfaction Ratio', value: '98%' }
];

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
        <Stack spacing={4} alignItems="flex-start">
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
            Android App Development Service
          </Typography>
          <Typography variant="body1" sx={{ color: subtleText, maxWidth: 640 }}>
            Build next-gen mobile solutions with a reliable Android app development company from concept to code. Our
            strategists, designers, and engineers partner with you to create delightful, scalable experiences.
          </Typography>
          <Stack spacing={{ xs: 4, md: 6 }} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 999,
                fontWeight: 600,
                boxShadow: '0 20px 45px rgba(59,130,246,0.35)'
              }}
              href="/contact"
            >
              Contact Us
            </Button>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 3, sm: 5 }}
              flexWrap="wrap"
              useFlexGap
            >
              {HERO_STATS.map((stat) => (
                <Stack key={stat.label} spacing={0.5}>
                  <Typography
                    component="span"
                    sx={{ fontSize: { xs: 28, md: 32 }, fontWeight: 700, color: accentColor }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography component="span" variant="body2" sx={{ color: subtleText, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ServicesHero;
