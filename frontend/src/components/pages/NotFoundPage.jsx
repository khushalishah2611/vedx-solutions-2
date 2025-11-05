import { Box, Button, Container, Stack, Typography, alpha, useTheme } from '@mui/material';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link as RouterLink } from 'react-router-dom';

const NOT_FOUND_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80';

const NotFoundPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const surface = alpha(theme.palette.background.paper, isDark ? 0.85 : 0.93);
  const muted = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section" sx={{ position: 'relative', py: { xs: 14, md: 18 } }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${NOT_FOUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.45)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            isDark
              ? 'linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.95) 60%, rgba(2,6,23,0.98) 100%)'
              : 'linear-gradient(160deg, rgba(248,250,252,0.94) 0%, rgba(236,243,254,0.9) 60%, rgba(226,232,240,0.94) 100%)',
          zIndex: 1
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
          textAlign="center"
          sx={{
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            borderRadius: 0.5,
            background: surface,
            boxShadow: isDark
              ? '0 30px 70px rgba(2,6,23,0.55)'
              : '0 30px 70px rgba(15,23,42,0.18)'
          }}
        >
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                isDark
                  ? 'linear-gradient(135deg, rgba(103,232,249,0.18) 0%, rgba(168,85,247,0.22) 100%)'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.18) 100%)',
              color: isDark ? '#e0f2fe' : theme.palette.primary.main
            }}
          >
            <TravelExploreRoundedIcon sx={{ fontSize: 42 }} />
          </Box>
          <Stack spacing={1}>
            <Typography variant="h1" sx={{ fontSize: { xs: 72, md: 96 }, fontWeight: 800 }}>
              404
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Oops! That page went exploring.
            </Typography>
            <Typography variant="body1" sx={{ color: muted, maxWidth: 520, mx: 'auto' }}>
              The page you are looking for may have been moved, renamed, or never existed. Let's guide you back to the right
              place.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                background: 'linear-gradient(90deg, #FF5E5E 0%, #A855F7 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
                }
              }}
            >
              Back to Home
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
