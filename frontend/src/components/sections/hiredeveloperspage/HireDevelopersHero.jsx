import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { servicesHeroStats } from '../../../data/servicesPage.js';

const HireDevelopersHero = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
            url("https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80")
          `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.25)}`,
        transform: 'scale(1.05)',
        transition: 'transform 0.6s ease, filter 0.6s ease',
        filter: isDark ? 'brightness(0.55)' : 'brightness(0.85)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '90vh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 36, sm: 44, md: 54 },
                  fontWeight: 800,
                  lineHeight: 1.1
                }}
              >
                Hire Dedicated Remote Developers
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: subtleText, maxWidth: 560, lineHeight: 1.7 }}
              >
                Scale your engineering capacity with vetted VedX developers who embed with
                your workflows from day one. Spin up agile pods or individual experts to
                accelerate delivery without compromising on quality.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onContactClick}
                  sx={{
                    minWidth: 180,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                    }
                  }}
                >
                  Book a Consultation
                </Button>

              
              </Stack>

              <Stack
                spacing={{ xs: 3, sm: 5 }}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                pt={2}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 4 }}>
                  {servicesHeroStats.map((stat) => (
                    <Stack key={stat.label} spacing={0.5}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: 28, md: 32 },
                          fontWeight: 700,
                          color: accentColor
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
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

HireDevelopersHero.propTypes = {
  onContactClick: PropTypes.func
};

HireDevelopersHero.defaultProps = {
  onContactClick: () => {}
};

export default HireDevelopersHero;
