import {
  alpha,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CaseStudiesHero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);

  // Dynamic overlay gradient based on theme
  const overlayGradient = isDark
    ? `radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 45%), rgba(5,9,18,0.78)`
    : `radial-gradient(circle at 20% 20%, rgba(79,70,229,0.18), transparent 45%), rgba(241,245,249,0.88)`;

  return (
    <Box
      component="section"
      sx={{
       backgroundImage:
            'linear-gradient(to bottom, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.82)), url(https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80)',
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
                  fontSize: { xs: 32, sm: 40, md: 52 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: isDark ? '#f9fafb' : '#0f172a',
                }}
              >
                Explore Our Case Studies Gallery, Where Ideas Flourish.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  maxWidth: 540,
                  lineHeight: 1.7,
                }}
              >
                Explore the best of VedX Solutions by diving into our tech-powered
                transformations. Each partnership blends domain expertise, design
                thinking, and reliable engineering to move mission-ready solutions
                into market.
              </Typography>

              <Button
                variant="contained"
                size="large"
                href="#contact"
                endIcon={<ArrowForwardIcon />}
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
                Let’s Build Together
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CaseStudiesHero;
