import { Box, Container, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';

const HERO_IMAGE_BASE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
const HERO_IMAGE_OVERLAY =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';

export default function CreativeAgencySection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box sx={{ py: { xs: 10, md: 14 }, position: 'relative' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          {/* === IMAGES SECTION === */}
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
                alt="Creative team collaborating"
                loading="lazy"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '80%',
                  height: '80%',
                  borderRadius: 2,
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
                alt="Creative digital process"
                loading="lazy"
                sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '80%',
                  height: '80%',
                  borderRadius: 2,
                  border: `1px solid ${alpha('#ffffff', 0.08)}`,
                  boxShadow: '0 35px 120px rgba(0,0,0,0.8)',
                  objectFit: 'cover',
                  zIndex: 2,
                }}
              />
            </Box>
          </Grid>

          {/* === TEXT SECTION === */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Label */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2,          
                  py: 1,           
                  borderRadius: 999, 
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  background: !isDark ? alpha('#ddddddff', 0.9) : alpha('#000', 0.9),
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
                  We are
                </Box>
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
                  Enterprise Growth
                </Box>
              </Typography>

              {/* Description (Short Intro) */}
              <Typography
                variant="body1"
                sx={{
                  color: !isDark ? alpha('#000', 0.9) : alpha('#ffffff', 0.9),
                  fontSize: { xs: 16, md: 17 },
                  lineHeight: 1.75,
                  maxWidth: 520,
                }}
              >
                We design, develop, and scale digital products that transform the way brands connect
                with their audiences. Our team merges creativity and technology to craft meaningful,
                measurable experiences.
              </Typography>

              {/* Extended Description */}
              <Typography
                variant="body2"
                sx={{
                  color: !isDark ? alpha('#000', 0.9) : alpha('#ffffff', 0.9),
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                From brand strategy to full-stack engineering, we partner with enterprises to build
                the next generation of customer experiences — blending design thinking, storytelling,
                and advanced technology.
              </Typography>

              {/* === STATS === */}
              <Grid container spacing={3} sx={{ pt: 1 }}>
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
                        sx={{ color: !isDark ? alpha('#000', 0.9) : alpha('#ffffff', 0.9), lineHeight: 1.4 }}
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
