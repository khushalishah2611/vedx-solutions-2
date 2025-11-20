import { Box, Button, Container, Grid, Stack, Typography, useTheme } from '@mui/material';

const CareerHeroSection = ({ hero, onCtaClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = isDark ? theme.palette.grey[300] : theme.palette.grey[100];

  const handleCtaClick = (event) => {
    if (onCtaClick) {
      event.preventDefault();
      onCtaClick(hero?.ctaHref);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.8)),
          url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80")
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: isDark ? 'brightness(0.95)' : 'brightness(0.85)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '70vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 },
        color: 'common.white',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 6, md: 4 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={6} lg={5}>
            <Stack
              spacing={3}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              {hero?.caption && (
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 2,
                    color: subtleText,
                  }}
                >
                  {hero.caption}
                </Typography>
              )}

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 36, sm: 44, md: 52 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {hero?.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  maxWidth: 600,
                  lineHeight: 1.7,
                  fontSize: { xs: 15, sm: 16, md: 18 },
                }}
              >
                {hero?.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                href={hero?.ctaHref || '#contact'}
                onClick={handleCtaClick}
                sx={{
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: { xs: 4, sm: 6 },
                  py: 1.25,
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                {hero?.ctaLabel}
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0px 24px 80px rgba(0,0,0,0.45)',
                transform: { xs: 'none', md: 'translateY(10px)' },
              }}
            >
              <Box
                component="img"
                src={hero?.image}
                alt={hero?.title}
                sx={{
                  width: '100%',
                  height: { xs: 260, sm: 320, md: 420 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)',
                }}
              />
              {hero?.caption && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: { xs: 20, sm: 28 },
                    right: { xs: 20, sm: 28 },
                    color: 'common.white',
                    opacity: 0.9,
                    fontWeight: 600,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  {hero.caption}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CareerHeroSection;
