import {
  alpha,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const CaseStudiesHero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Correct gradient with dynamic isDark
  const overlayGradient = isDark
    ? `radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 45%), rgba(5,9,18,0.78)`
    : `radial-gradient(circle at 20% 20%, rgba(79,70,229,0.18), transparent 45%), rgba(241,245,249,0.88)`;

  return (
    <Box
      sx={{
        pt: { xs: 14, md: 18 },
        pb: { xs: 12, md: 16 },
        minHeight: { xs: '90vh', md: '100vh' },
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',

        backgroundImage: `${overlayGradient}, url(https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=2000&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        borderBottom: `1px solid ${alpha(
          theme.palette.divider,
          isDark ? 0.5 : 0.25
        )}`,

        filter: isDark ? 'brightness(0.6)' : 'brightness(0.85)',
        transform: 'scale(1.03)',
        transition: 'transform 0.6s ease, filter 0.6s ease',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          spacing={4}
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          {/* Title + Subtitle */}
          <Stack spacing={2} sx={{ maxWidth: { xs: '100%', md: '65%' } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 42, md: 64 },
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Explore Our Case Studies Gallery, Where Ideas Flourish.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: alpha('#f8fafc', 0.88),
                lineHeight: 1.8,
                fontSize: { xs: 16, md: 18 },
              }}
            >
              Explore the best of VedX Solutions by diving into our tech-powered
              transformations. Each partnership blends domain expertise, design
              thinking, and reliable engineering to move mission-ready solutions
              into market.
            </Typography>
          </Stack>

          {/* CTA Button */}
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/contact"
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { sm: 5 },
              py: 1.4,
              fontSize: 16,

              '&:hover': {
                background:
                  'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
              },
            }}
          >
            Let’s Build Together
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default CaseStudiesHero;
