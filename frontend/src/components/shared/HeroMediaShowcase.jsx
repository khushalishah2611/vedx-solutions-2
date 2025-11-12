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

const DEFAULT_BASE_IMAGE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
const DEFAULT_OVERLAY_IMAGE =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80';

const HeroMediaShowcase = ({
  eyebrow,
  title,
  description,
  extendedDescription,
  baseImage = DEFAULT_BASE_IMAGE,
  overlayImage = DEFAULT_OVERLAY_IMAGE,
  baseImageAlt = 'Creative team collaborating',
  overlayImageAlt = 'Creative digital process',
  accentColor: accentColorProp,
  ctaLabel,
  onCtaClick,
  actions,
  children,
  sx,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = accentColorProp ?? (isDark ? '#67e8f9' : theme.palette.primary.main);

  return (
    <Box sx={{ position: 'relative', py: { xs: 8, md: 12 }, ...sx }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
                height: { xs: 360, md: 560 },
              }}
            >
              <Box
                component="img"
                src={baseImage}
                alt={baseImageAlt}
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

              <Box
                component="img"
                src={overlayImage}
                alt={overlayImageAlt}
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

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Stack spacing={3.5} sx={{ maxWidth: 520 }}>
              {eyebrow && (
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
                    {eyebrow}
                  </Box>
                </Box>
              )}

              {title && (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: 28, md: 36 },
                    color: isDark ? alpha('#ffffff', 0.95) : alpha('#000000', 0.95),
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </Typography>
              )}

              {description && (
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? alpha('#ffffff', 0.9) : alpha('#000', 0.9),
                    fontSize: { xs: 16, md: 17 },
                    lineHeight: 1.75,
                  }}
                >
                  {description}
                </Typography>
              )}

              {extendedDescription && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? alpha('#ffffff', 0.85) : alpha('#000', 0.85),
                    lineHeight: 1.7,
                  }}
                >
                  {extendedDescription}
                </Typography>
              )}

              {children}

              {(ctaLabel || actions) && (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ pt: 1, mx: { xs: 'auto', md: 0 } }}
                >
                  {actions ?? (
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
                          background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                        },
                      }}
                    >
                      {ctaLabel}
                    </Button>
                  )}
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroMediaShowcase;
