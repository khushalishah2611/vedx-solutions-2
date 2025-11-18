import { Box, Container, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

// === TYPING TITLE COMPONENT ===
const TypingTitle = () => {
  const words = ['Enterprise Growth']; // Add more words if needed
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const current = loopNum % words.length;
      const fullText = words[current];

      setText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  return (
    <Box
      component="span"
      sx={{
        background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        borderRight: '2px solid #ff0000ff',
        animation: 'blink 0.8s step-end infinite',
        '@keyframes blink': {
          '50%': { borderColor: 'transparent' },
        },
      }}
    >
      {text}
    </Box>
  );
};

// === MAIN SECTION COMPONENT ===
export default function CreativeAgencySection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const HERO_IMAGE_BASE =
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
  const HERO_IMAGE_OVERLAY =
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';

  return (
    <Box sx={{ position: 'relative' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }}justifyContent="flex-start" 
  alignItems="center">
          {/* === IMAGES SECTION === */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
                height: { xs: 400, md: 600 },
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
                  borderRadius: 0.5,
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
                  borderRadius: 0.5,
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
                  borderRadius: 0.5,
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  background: !isDark
                    ? alpha('#ddddddff', 0.9)
                    : alpha('#0000007c', 0.9),
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
                    background:
                      'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  We are
                </Box>
              </Box>

              {/* Heading with typing effect */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.5,
                }}
              >
                Creative Digital Agency Working For
                <br /> {/* ✅ Use <br /> for a new line */}
                <TypingTitle />
              </Typography>
              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: !isDark
                    ? alpha('#000', 0.9)
                    : alpha('#ffffff', 0.9),
                  fontSize: { xs: 16, md: 17 },
                  lineHeight: 1.75,
                  maxWidth: 520,
                }}
              >
                We design, develop, and scale digital products that transform the
                way brands connect with their audiences. Our team merges
                creativity and technology to craft meaningful, measurable
                experiences.
              </Typography>

              {/* Extended Description */}
              <Typography
                variant="body2"
                sx={{
                  color: !isDark
                    ? alpha('#000', 0.9)
                    : alpha('#ffffff', 0.9),
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                From brand strategy to full-stack engineering, we partner with
                enterprises to build the next generation of customer experiences
                — blending design thinking, storytelling, and advanced
                technology.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
