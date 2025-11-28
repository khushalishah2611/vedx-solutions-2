import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

const AboutHeroSection = ({ hero, onCtaClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';


  const subtleText = alpha('#ffffff', isDark ? 0.88 : 0.92);

  const handleCtaClick = (event) => {
    if (onCtaClick) {
      event.preventDefault();
      onCtaClick();
    }
  };

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
          url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80")
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.6s ease, filter 0.6s ease',
        filter: isDark ? 'brightness(0.9)' : 'brightness(0.8)',
        position: 'relative',
        overflow: 'hidden',
      minHeight: { xs: "60vh", md: "70vh" },
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
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Stack
              spacing={4}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, sm: 46, md: 56 },
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
                  maxWidth: 540,
                  lineHeight: 1.7,
                  fontSize: { xs: 14, sm: 16, md: 18 },
                }}
              >
                {hero?.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                href="#contact"
                onClick={handleCtaClick}
                sx={{
                  background:
                    'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: { xs: 4, sm: 6 },
                  py: 1.25,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                {hero?.ctaLabel}
              </Button>
            </Stack>
          </Grid>


        </Grid>
      </Container>
    </Box>
  );
};

export default AboutHeroSection;
