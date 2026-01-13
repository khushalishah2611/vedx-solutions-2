import { Box, Container, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { AppButton } from '../../shared/FormControls.jsx';

const AboutHeroSection = ({ hero, stats, onCtaClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const buttonProps = onCtaClick
    ? { onClick: onCtaClick }
    : { href: '#contact' };

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: hero?.baseImage
          ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.82)), url("${hero.baseImage}")`
          : 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.82))',
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
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack
              spacing={3}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              {hero?.label && (
                <Typography
                  variant="overline"
                  sx={{ color: alpha('#fff', 0.75), letterSpacing: 2 }}
                >
                  {hero.label}
                </Typography>
              )}
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
              {hero?.extendedDescription && (
                <Typography
                  variant="body2"
                  sx={{ color: subtleText, maxWidth: 560, lineHeight: 1.7 }}
                >
                  {hero.extendedDescription}
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

              {stats?.length > 0 && (
                <Stack
                  pt={2}
                  width="100%"
                  alignItems={{ xs: 'center', sm: 'flex-start' }}
                >
                  <Stack
                    direction="row"
                    spacing={{ xs: 3, sm: 4 }}
                    justifyContent={{ xs: 'center', sm: 'flex-start' }}
                    alignItems="center"
                    sx={{
                      width: '100%',
                      overflowX: { xs: 'auto', sm: 'visible' },
                      pb: { xs: 1, sm: 0 },
                    }}
                  >
                    {stats.map((stat) => (
                      <Stack
                        key={stat.label}
                        spacing={0.5}
                        sx={{
                          minWidth: { xs: 110, sm: 'auto' },
                          textAlign: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontSize: { xs: 24, md: 30 },
                            fontWeight: 700,
                            color: accentColor,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: subtleText, fontWeight: 500 }}
                        >
                          {stat.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
              }}
            >
              <Box
                component="img"
                src={hero?.overlayImage || hero?.baseImage}
                alt={hero?.title || 'About Vedx Solutions'}
                sx={{
                  width: { xs: '100%', md: '85%' },
                  maxWidth: 520,
                  borderRadius: 4,
                  boxShadow: isDark
                    ? '0 30px 60px rgba(15,23,42,0.6)'
                    : '0 30px 60px rgba(15,23,42,0.2)',
                  border: `1px solid ${alpha('#fff', 0.25)}`,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

AboutHeroSection.propTypes = {
  hero: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    extendedDescription: PropTypes.string,
    baseImage: PropTypes.string,
    overlayImage: PropTypes.string,
    ctaLabel: PropTypes.string,
  }),
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  onCtaClick: PropTypes.func,
};

AboutHeroSection.defaultProps = {
  hero: null,
  stats: [],
  onCtaClick: null,
};

export default AboutHeroSection;
