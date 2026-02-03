import { Box, Container, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

// === SIMPLE IN-VIEW HOOK (NO LIB) ===
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
};

// === TYPING TITLE COMPONENT ===
const TypingTitle = () => {
  const words = ['Brands', 'Enterprise', 'Company']; // Add more words if needed
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
        setLoopNum((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

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
export default function CreativeAgencySection({ story = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const HERO_IMAGE_BASE =
    story?.imageBase ||
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
  const HERO_IMAGE_OVERLAY =
    story?.imageOverlay ||
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';
  const title = story?.title || 'Creative Digital Agency Working For';
  const description =
    story?.description ||
    "We're made up of top product experts and engineers who are capable in the invention and development of the industry's most advanced technologies including web, mobile apps, eCommerce, Commerce, loT, Al/ML, enterprise mobility, on-demand, cross-platform, cloud integration and alike. Technology happens to be the medium in which we work.";
  const extendedDescription =
    story?.extendedDescription ||
    'If your organization is looking for an assistance on an upcoming software project or would like access to our talent, feel free to get in touch and begin a conversation.';

  // Left/right animation
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  return (
    <Box sx={{ position: 'relative', }}>
      {/* Full-width container with same side padding as hero/navbar */}
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Grid
          container
          spacing={{ xs: 6, md: 10 }}
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* === IMAGES SECTION (LEFT) === */}
          <Grid
            item
            xs={12}
            md={6}
            ref={leftRef}
            sx={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: 800,
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

          {/* === TEXT SECTION (RIGHT) === */}
          <Grid
            item
            xs={12}
            md={6}
            ref={rightRef}
            sx={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <Stack
              spacing={3}
              sx={{
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
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
                  mx: { xs: 'auto', md: 0 },
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
                {title}
                <br />
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
                }}
              >
                {description}
              </Typography>

              {/* Extended Description */}
              <Typography
                variant="body2"
                sx={{
                  color: !isDark
                    ? alpha('#000', 0.9)
                    : alpha('#ffffff', 0.9),
                  lineHeight: 1.7,
                }}
              >
                {extendedDescription}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
