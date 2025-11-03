import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Container,
  Fade,
  Grid,
  Stack,
  Typography,
  alpha
} from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { heroContent } from '../../data/content.js';

const SLIDE_INTERVAL = 7000;

const HeroSection = () => {
  const slides = heroContent.slides;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '90vh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 }
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {slides.map((slide, index) => (
          <Box
            key={slide.image}
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scale(1.05)',
              transition: 'opacity 1.2s ease-in-out',
              opacity: index === activeSlide ? 1 : 0,
              filter: 'brightness(0.55)'
            }}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 45%), rgba(5,9,18,0.78)'
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={7} lg={6}>
            <Fade in key={currentSlide.title} timeout={900}>
              <Stack spacing={3}>
                <Chip
                  label={heroContent.eyebrow}
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: alpha('#67e8f9', 0.15),
                    color: 'secondary.light',
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    borderRadius: 2
                  }}
                />
                <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 60 }, lineHeight: 1.05, maxWidth: 640 }}>
                  {currentSlide.title}
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.75), fontWeight: 500 }}>
                  {currentSlide.subtitle}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: 16, md: 18 }, maxWidth: 540 }}>
                  {currentSlide.description}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" color="secondary" size="large" href="#contact">
                    {currentSlide.ctaPrimary}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    endIcon={<ArrowOutwardRoundedIcon />}
                    href="#services"
                  >
                    {currentSlide.ctaSecondary}
                  </Button>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} pt={2}>
                  {heroContent.stats.map((stat) => (
                    <Box key={stat.label}>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5} lg={6}>
            <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: alpha('#ffffff', 0.6) }}>
                Featured snapshots
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                {slides.map((slide, index) => (
                  <ButtonBase
                    key={slide.title}
                    onClick={() => setActiveSlide(index)}
                    sx={{
                      width: 96,
                      height: 64,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: index === activeSlide ? '2px solid #67e8f9' : '1px solid rgba(255,255,255,0.24)',
                      transition: 'transform 0.3s ease, border 0.3s ease',
                      transform: index === activeSlide ? 'translateY(-6px)' : 'translateY(0)',
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(5,9,18,0.35)' }} />
                  </ButtonBase>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;