import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Fade,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { heroContent } from '../../../data/content.js';

const SLIDE_INTERVAL = 7000;

const HeroSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const slides = heroContent.slides;
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, [startAutoplay]);

  const handleSelectSlide = (index) => {
    setActiveSlide(index);
    startAutoplay();
  };

  const currentSlide = slides[activeSlide];

  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '60vh', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 },
      }}
    >
      {/* Background Images */}
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
              filter: isDark ? 'brightness(0.9)' : 'brightness(0.8)',
            }}
          />
        ))}

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 45%), rgba(5,9,18,0.78)'
              : 'radial-gradient(circle at 20% 20%, rgba(79,70,229,0.18), transparent 45%), rgba(241,245,249,0.88)',
          }}
        />
      </Box>

      {/* CONTENT */}
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Stack spacing={{ xs: 6, md: 8 }}>
          <Fade in key={currentSlide.title} timeout={900}>
            <Stack
              spacing={4}
              maxWidth={{ xs: '100%', md: 720 }}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: 44, md: 64 }, lineHeight: 1.05 }}
              >
                {currentSlide.title}{' '}
                <Box
                  component="span"
                  sx={{
                    background:
                      'linear-gradient(90deg, #67e8f9 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  {currentSlide.highlight}
                </Box>
              </Typography>


              {/* CTA */}
              <Button
                variant="contained"
                size="large"
                href="#contact"
                sx={{
                  background:
                    'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 1.75 },
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                Contact us
              </Button>
            </Stack>
          </Fade>
        </Stack>
      </Container>

      {/* Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 40, md: 60 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        <Stack direction="row" spacing={1.2}>
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
                  backgroundColor: active
                    ? 'secondary.main'
                    : alpha('#ffffff', 0.4),
                  transition: 'all 0.3s ease',
                }}
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default HeroSection;
