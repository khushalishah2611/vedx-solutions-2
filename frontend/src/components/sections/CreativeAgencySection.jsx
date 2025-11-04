import { Box, Container, Grid, Stack, Typography, alpha } from '@mui/material';

const HERO_IMAGE_BASE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
const HERO_IMAGE_OVERLAY =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';

export default function CreativeAgencySection() {
  return (
    <Box
      sx={{
        bgcolor: '#050505',
        color: '#fff',
        py: { xs: 8, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: { xs: '-20%', md: '-30%' },
          right: { xs: '-30%', md: '-20%' },
          width: { xs: '65%', md: '45%' },
          height: { xs: '65%', md: '70%' },
          background: 'radial-gradient(circle at top, rgba(156, 39, 176, 0.35), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: { xs: '-30%', md: '-40%' },
          left: { xs: '-30%', md: '-20%' },
          width: { xs: '70%', md: '50%' },
          height: { xs: '70%', md: '65%' },
          background: 'radial-gradient(circle at bottom, rgba(33, 150, 243, 0.3), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
                height: { xs: 320, md: 440 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: { xs: 24, md: 32 },
                  borderRadius: 5,
                  background: 'radial-gradient(circle at 20% 30%, rgba(33, 150, 243, 0.32), transparent 55%)',
                  filter: 'blur(25px)',
                  opacity: 0.85,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: -42, md: -64 },
                  right: { xs: 28, md: 56 },
                  width: { xs: 110, md: 140 },
                  height: { xs: 110, md: 140 },
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(255,214,79,0.55) 0%, rgba(255,214,79,0) 70%)',
                  filter: 'blur(12px)',
                  opacity: 0.85,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 32, md: 24 },
                  left: { xs: 16, md: -32 },
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(140deg, rgba(33,150,243,0.4), rgba(156,39,176,0.45))',
                  filter: 'blur(6px)',
                  opacity: 0.9,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: -42, md: -64 },
                  left: { xs: -12, md: -36 },
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(156,39,176,0.45) 0%, rgba(156,39,176,0) 70%)',
                  filter: 'blur(16px)',
                  opacity: 0.75,
                }}
              />

              <Box
                component="img"
                src={HERO_IMAGE_BASE}
                alt="Creative product team collaborating around laptops"
                loading="lazy"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 5,
                  border: `1px solid ${alpha('#ffffff', 0.06)}`,
                  boxShadow: '0 35px 120px rgba(0,0,0,0.6)',
                  objectFit: 'cover',
                }}
              />

              <Box
                component="img"
                src={HERO_IMAGE_OVERLAY}
                alt="Designers reviewing creative mood board"
                loading="lazy"
                sx={{
                  position: 'absolute',
                  bottom: { xs: '-6%', md: '-10%' },
                  right: { xs: '-2%', md: '-8%' },
                  width: { xs: '68%', md: '62%' },
                  borderRadius: 4,
                  border: `1px solid ${alpha('#ffffff', 0.12)}`,
                  boxShadow: '0 45px 120px rgba(0,0,0,0.75)',
                  transform: { xs: 'rotate(-3deg)', md: 'rotate(-6deg)' },
                  objectFit: 'cover',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 18, md: 28 },
                  right: { xs: 18, md: 28 },
                  px: 2.5,
                  py: 1,
                  borderRadius: 999,
                  background: alpha('#050505', 0.92),
                  border: `1px solid ${alpha('#ffffff', 0.08)}`,
                  boxShadow: '0 20px 45px rgba(9, 9, 13, 0.55)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    color: alpha('#ffffff', 0.85),
                  }}
                >
                  Product Sprints
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2.5,
                  py: 1,
                  borderRadius: 999,
                  border: `1px solid ${alpha('#ffffff', 0.08)}`,
                  background: alpha('#101012', 0.75),
                  color: alpha('#9c27b0', 0.8),
                  fontWeight: 600,
                  letterSpacing: 1.1,
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                We Are
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  fontSize: { xs: '2.4rem', md: '3.2rem' },
                }}
              >
                Creative Digital Agency Working For{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Enterprise
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#ffffff', 0.82),
                  lineHeight: 1.7,
                }}
              >
                We’re a collective of strategists, storytellers, and engineers blending
                research, design systems, and full-stack engineering to launch standout
                brand experiences across every platform.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#ffffff', 0.72),
                  lineHeight: 1.7,
                }}
              >
                Partner with us when you’re ready to accelerate your roadmap, unlock new
                revenue streams, or evolve your visual identity through high-impact digital
                products.
              </Typography>

              <Grid container spacing={3}>
                {[
                  { label: 'Years Crafting Products', value: '12+' },
                  { label: 'Brand Launches', value: '150+' },
                  { label: 'NPS Score', value: '92' },
                ].map((item) => (
                  <Grid item xs={4} key={item.label}>
                    <Stack spacing={0.5}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(90deg, #f48fb1, #90caf9)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: alpha('#ffffff', 0.6), lineHeight: 1.4 }}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
