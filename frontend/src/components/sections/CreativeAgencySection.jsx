import { Box, Container, Grid, Stack, Typography, alpha } from '@mui/material';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';

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
        <Grid
          container
          spacing={{ xs: 6, md: 10 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -24,
                  borderRadius: 6,
                  background: alpha('#9c27b0', 0.15),
                  filter: 'blur(40px)',
                  zIndex: 0,
                },
              }}
            >
              <Box
                component="img"
                src={HERO_IMAGE_URL}
                alt="Creative team collaborating in a modern workspace"
                loading="lazy"
                sx={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  borderRadius: 4,
                  border: `1px solid ${alpha('#ffffff', 0.08)}`,
                  boxShadow: '0 35px 120px rgba(0,0,0,0.55)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: 16, md: 24 },
                  left: { xs: 16, md: 24 },
                  px: 3,
                  py: 1.5,
                  borderRadius: 999,
                  background: alpha('#050505', 0.9),
                  border: `1px solid ${alpha('#ffffff', 0.08)}`,
                  boxShadow: '0 20px 45px rgba(9, 9, 13, 0.45)',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    letterSpacing: 0.4,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: alpha('#ffffff', 0.85),
                  }}
                >
                  Human-centric Experiences
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
                  color: alpha('#ffffff', 0.8),
                  lineHeight: 1.7,
                }}
              >
                We’re a collective of product strategists, designers, and engineers who
                build the industry's most forward-thinking solutions across web, mobile,
                commerce, IoT, AI/ML, and cloud ecosystems. Technology is the medium in
                which we sculpt meaningful impact.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#ffffff', 0.75),
                  lineHeight: 1.7,
                }}
              >
                If your organization is preparing for its next software initiative or
                needs on-demand access to elite talent, reach out and let’s start the
                conversation.
              </Typography>

              <Grid container spacing={3}>
                {[
                  { label: 'Years Crafting Products', value: '12+' },
                  { label: 'Growth-focused Partners', value: '80+' },
                  { label: 'Innovation Awards', value: '24' },
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
