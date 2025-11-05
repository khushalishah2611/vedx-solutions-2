import { Box, Button, Container, Stack, Typography, alpha, useTheme } from '@mui/material';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link as RouterLink } from 'react-router-dom';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80';

const ComingSoonPage = ({
  title,
  description,
  ctaLabel = 'Back to Home',
  primaryActionHref,
  illustration = DEFAULT_IMAGE
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentGradient = isDark
    ? 'linear-gradient(135deg, rgba(103,232,249,0.2) 0%, rgba(168,85,247,0.25) 100%)'
    : 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(14,165,233,0.18) 100%)';
  const surfaceColor = alpha(theme.palette.background.paper, isDark ? 0.86 : 0.92);
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const actionProps = primaryActionHref
    ? { component: 'a', href: primaryActionHref }
    : { component: RouterLink, to: '/' };

  return (
    <Box component="section" sx={{ position: 'relative', py: { xs: 14, md: 18 } }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${illustration})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            isDark
              ? 'linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(8,11,21,0.92) 55%, rgba(2,6,23,0.96) 100%)'
              : 'linear-gradient(160deg, rgba(248,250,252,0.94) 0%, rgba(241,245,249,0.9) 60%, rgba(226,232,240,0.95) 100%)',
          zIndex: 1
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack
          spacing={{ xs: 4, md: 5 }}
          sx={{
            borderRadius: 4,
            px: { xs: 4, md: 8 },
            py: { xs: 5, md: 8 },
            background: surfaceColor,
            boxShadow: isDark
              ? '0 30px 70px rgba(2,6,23,0.55)'
              : '0 30px 70px rgba(15,23,42,0.18)'
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1,
                borderRadius: 999,
                background: accentGradient,
                color: isDark ? '#e0f2fe' : theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 0.6
              }}
            >
              <HourglassBottomRoundedIcon sx={{ fontSize: 20 }} />
              Coming Soon
            </Box>
            <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 48 }, fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: subtleText, maxWidth: 560 }}>
              {description}
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                background: 'linear-gradient(90deg, #FF5E5E 0%, #A855F7 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
                }
              }}
              {...actionProps}
            >
              {ctaLabel}
            </Button>
            <Typography variant="body2" sx={{ color: subtleText }}>
              We will notify you once the experience is live. Stay tuned!
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;
