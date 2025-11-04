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
            <Stack spacing={5} maxWidth={{ xs: '100%', md: 720 }}>
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1.5}>
                <Button variant="contained" color="secondary" size="large" href="#contact">
                  {currentSlide.ctaPrimary}
                </Button>

              </Stack>
            </Stack>
          </Fade>



          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1.2}
            sx={{ pt: 10 }}
          >
            {slides.map((slide, index) => {
              const active = index === activeSlide;
              return (
                <ButtonBase
                  key={slide.title}
                  onClick={() => handleSelectSlide(index)}
                  sx={{
                    width: active ? 14 : 10,
                    height: active ? 14 : 10,
                    borderRadius: '50%',
                    backgroundColor: active ? 'secondary.main' : alpha('#ffffff', 0.4),
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;