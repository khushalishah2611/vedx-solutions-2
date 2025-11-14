import { alpha, Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const overlayGradient =
  'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.86) 45%, rgba(15, 23, 42, 0.92) 100%)';

const CaseStudiesHero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        color: 'common.white',
        backgroundImage:
          `${overlayGradient}, url(https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=2000&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottom: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.5 : 0.25)}`,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 12, md: 16 },
        }}
      >
        <Stack
          spacing={4}
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              px: 2,
              py: 0.75,
              borderRadius: 999,
              border: `1px solid ${alpha('#ffffff', 0.12)}`,
              backgroundColor: alpha('#ffffff', 0.08),
              letterSpacing: 1.2,
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: 12,
              mx: { xs: 'auto', md: 0 },
            }}
          >
            Case Studies
          </Box>

          <Stack spacing={2} sx={{ maxWidth: { xs: 1, md: '60%' } }}>
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
              sx={{ color: alpha('#f8fafc', 0.88), lineHeight: 1.8 }}
            >
              Explore the best of VedX Solutions by diving into our tech-powered transformations. Each partnership blends domain expertise, design thinking, and reliable engineering to move mission-ready solutions into market.
            </Typography>
          </Stack>

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
              '&:hover': {
                background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
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
