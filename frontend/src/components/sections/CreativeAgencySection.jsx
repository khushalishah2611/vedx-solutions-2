import { Box, Container, Grid, Stack, Typography, alpha } from '@mui/material';

const HERO_IMAGE_BASE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
const HERO_IMAGE_OVERLAY =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';

export default function CreativeAgencySection() {
  return (
    <Box

    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          {/* Images Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
                height: { xs: 380, md: 500 },
              }}
            >
              {/* Base Image */}
              <Box
                component="img"
                src={HERO_IMAGE_BASE}
                alt="Creative product team collaborating"
                loading="lazy"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '80%',
                  height: '80%',
                  borderRadius: 1,
                  border: `1px solid ${alpha('#ffffff', 0.06)}`,
                  boxShadow: '0 25px 100px rgba(0,0,0,0.6)',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
              />

              {/* Overlay Image */}
              <Box
                component="img"
                src={HERO_IMAGE_OVERLAY}
                alt="Overlay creative image"
                loading="lazy"
                sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',

                  width: '80%',
                  height: '80%',
                  borderRadius: 1,
                  border: `1px solid ${alpha('#ffffff', 0.08)}`,
                  boxShadow: '0 35px 120px rgba(0,0,0,0.8)',
                  objectFit: 'cover',
                  zIndex: 2,
                }}
              />
            </Box>
          </Grid>

          {/* Text & Stats Section */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {/* Label */}
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
                  width: 'fit-content',
                }}
              >
                We Are
              </Box>
              {/* Heading */}
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

              {/* Body Text */}
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.82), lineHeight: 1.7 }}>
                We’re a collective of strategists, storytellers, and engineers blending research, design systems, and full-stack engineering to launch standout brand experiences across every platform.
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.72), lineHeight: 1.7 }}>
                Partner with us when you’re ready to accelerate your roadmap, unlock new revenue streams, or evolve your visual identity through high-impact digital products.
              </Typography>

              {/* Stats */}
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
                      <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.6), lineHeight: 1.4 }}>
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
