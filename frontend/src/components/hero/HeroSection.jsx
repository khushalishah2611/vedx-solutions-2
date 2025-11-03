import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Container,
  Fade,
  IconButton,
  Stack,
  Typography,
  alpha
} from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { heroContent } from '../../data/content.js';

const SLIDE_INTERVAL = 7000;

const HeroSection = () => {
  const slides = heroContent.slides;
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startAutoplay]);

  const handleSelectSlide = useCallback(
    (index) => {
      setActiveSlide(index);
      startAutoplay();
    },
    [startAutoplay]
  );

  const handlePrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoplay();
  }, [slides.length, startAutoplay]);

  const handleNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    startAutoplay();
  }, [slides.length, startAutoplay]);

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
        <Stack spacing={{ xs: 6, md: 8 }}>
          <Fade in key={currentSlide.title} timeout={900}>
            <Stack spacing={3} maxWidth={{ xs: '100%', md: 720 }}>
              <Chip
                label={heroContent.eyebrow}
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: alpha('#67e8f9', 0.15),
                  color: 'secondary.light',
                  fontWeight: 600,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  borderRadius: 2
                }}
              />
              <Typography variant="h2" sx={{ fontSize: { xs: 44, md: 64 }, lineHeight: 1.05 }}>
                {currentSlide.title}{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #67e8f9 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  {currentSlide.highlight}
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.78), fontWeight: 500 }}>
                {currentSlide.subtitle}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: alpha('#ffffff', 0.72), fontSize: { xs: 16, md: 18 }, maxWidth: 640 }}
              >
                {currentSlide.description}
              </Typography>
              {currentSlide.insights && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                  {currentSlide.insights.map((insight) => (
                    <Stack direction="row" spacing={1.2} alignItems="center" key={insight}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                      <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.75) }}>
                        {insight}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1.5}>
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
            </Stack>
          </Fade>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 3, md: 6 }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Stack direction="row" spacing={{ xs: 3, md: 5 }} flexWrap="wrap">
              {heroContent.stats.map((stat) => (
                <Box key={stat.label}>
                  <Typography variant="h4" sx={{ color: 'secondary.light', fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton
                color="inherit"
                onClick={handlePrev}
                aria-label="View previous slide"
                sx={{ border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <NavigateBeforeRoundedIcon />
              </IconButton>
              <Stack direction="row" spacing={1}>
                {slides.map((slide, index) => {
                  const active = index === activeSlide;
                  return (
                    <ButtonBase
                      key={slide.title}
                      onClick={() => handleSelectSlide(index)}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        color: active ? 'secondary.light' : alpha('#ffffff', 0.65),
                        backgroundColor: active ? alpha('#67e8f9', 0.18) : 'transparent',
                        border: active ? '1px solid rgba(103, 232, 249, 0.6)' : '1px solid transparent'
                      }}
                    >
                      <Stack spacing={0.5} alignItems="flex-start">
                        <Typography variant="caption" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
                          {`${index + 1}`.padStart(2, '0')}
                        </Typography>
                        <Box
                          sx={{
                            height: 3,
                            width: 40,
                            borderRadius: 999,
                            backgroundColor: active ? 'secondary.main' : alpha('#ffffff', 0.24)
                          }}
                        />
                      </Stack>
                    </ButtonBase>
                  );
                })}
              </Stack>
              <IconButton
                color="inherit"
                onClick={handleNext}
                aria-label="View next slide"
                sx={{ border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <NavigateNextRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;