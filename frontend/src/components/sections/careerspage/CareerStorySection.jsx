import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

const CareerStorySection = ({ story, onCtaClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const HERO_IMAGE_BASE =
    story?.baseImage ||
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
  const HERO_IMAGE_OVERLAY =
    story?.overlayImage ||
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';

  return (
    <Box sx={{ position: 'relative',  }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
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
           <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start', // ✅ top alignment
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Stack spacing={3.5} sx={{ maxWidth: 520 }}>
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
                    background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {story?.label || 'We are Vedx Solutions'}
                </Box>
              </Box>

              {/* Heading */}
              {story?.title && (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: 28, md: 36 },
                    color: isDark
                      ? alpha('#ffffff', 0.95)
                      : alpha('#000000', 0.95),
                    lineHeight: 1.3,
                  }}
                >
                  {story.title}
                </Typography>
              )}

              {/* Description */}
              {story?.description && (
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark
                      ? alpha('#ffffff', 0.9)
                      : alpha('#000', 0.9),
                    fontSize: { xs: 16, md: 17 },
                    lineHeight: 1.75,
                  }}
                >
                  {story.description}
                </Typography>
              )}

              {/* Extended Description */}
              {story?.extendedDescription && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? alpha('#ffffff', 0.85)
                      : alpha('#000', 0.85),
                    lineHeight: 1.7,
                  }}
                >
                  {story.extendedDescription}
                </Typography>
              )}

              {/* CTA Button */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ pt: 1, mx: { xs: 'auto', md: 0 } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={onCtaClick}
                  sx={{
                    background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                    },
                  }}
                >
                  {story?.ctaLabel || 'Contact Us'}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CareerStorySection;
