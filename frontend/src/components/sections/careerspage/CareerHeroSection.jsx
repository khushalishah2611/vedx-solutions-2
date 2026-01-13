import { Box, Container, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { AppButton } from '../../shared/FormControls.jsx';

const CareerHeroSection = ({ hero, onCtaClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);

  const buttonProps = onCtaClick
    ? { onClick: onCtaClick }
    : { href: hero?.ctaHref || '#contact' };

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: hero?.image
          ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.84)), url("${hero.image}")`
          : 'linear-gradient(to bottom, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.84))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: isDark ? 'brightness(0.95)' : 'brightness(0.85)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '60vh', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 10, md: 14 },
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
        <Grid container alignItems="center" spacing={{ xs: 5, md: 8 }}>
          <Grid item xs={12} md={7}>
            <Stack
              spacing={3}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, sm: 46, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#fff',
                }}
              >
                {hero?.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: subtleText, maxWidth: 560, lineHeight: 1.7 }}
              >
                {hero?.description}
              </Typography>
              {hero?.caption && (
                <Typography
                  variant="body2"
                  sx={{ color: subtleText, maxWidth: 560, lineHeight: 1.7 }}
                >
                  {hero.caption}
                </Typography>
              )}
              <AppButton
                variant="contained"
                size="large"
                {...buttonProps}
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
                {hero?.ctaLabel || 'Contact us'}
              </AppButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

CareerHeroSection.propTypes = {
  hero: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    caption: PropTypes.string,
    ctaLabel: PropTypes.string,
    ctaHref: PropTypes.string,
    image: PropTypes.string,
  }),
  onCtaClick: PropTypes.func,
};

CareerHeroSection.defaultProps = {
  hero: null,
  onCtaClick: null,
};

export default CareerHeroSection;
