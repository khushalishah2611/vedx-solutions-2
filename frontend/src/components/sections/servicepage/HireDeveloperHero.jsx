import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

const HireDeveloperHero = ({ category, role, stats = [], onContactClick, dividerColor }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const heroOverlay = isDark ? 'rgba(8, 15, 30, 0.8)' : 'rgba(5, 12, 28, 0.75)';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const borderColor = useMemo(
    () => dividerColor ?? alpha(theme.palette.divider, isDark ? 0.4 : 0.25),
    [dividerColor, isDark, theme.palette.divider]
  );

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(${heroOverlay}, ${heroOverlay}), url(${role.heroImage || category.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: { xs: '90vh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 12, md: 14 },
        borderBottom: `1px solid ${borderColor}`
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 5, md: 6 }}>
          <Breadcrumbs
            separator={
              <NavigateNextIcon fontSize="small" sx={{ color: alpha('#fff', 0.7) }} />
            }
            aria-label="breadcrumb"
          >
            <MuiLink component={RouterLink} underline="hover" color="#fff" to="/">
              Home
            </MuiLink>

            <MuiLink component={RouterLink} underline="hover" color="#fff" to="/hire-developers">
              {category.title}
            </MuiLink>

            <Typography sx={{ color: alpha('#fff', 0.85) }}>{role.name}</Typography>
          </Breadcrumbs>

          <Grid container alignItems="center" justifyContent="space-between" spacing={4}>
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: 36, sm: 44, md: 54 },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: '#fff'
                  }}
                >
                  Hire Dedicated Remote Developers
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: alpha('#fff', 0.8),
                    maxWidth: 560,
                    lineHeight: 1.7
                  }}
                >
                  Scale your engineering capacity with vetted VedX developers who embed with your
                  workflows from day one. Spin up agile pods or individual experts to accelerate
                  delivery without compromising on quality.
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
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  pt={2}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 4 }}>
                    {stats.map((stat) => (
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
                          sx={{
                            color: alpha('#fff', 0.8),
                            fontWeight: 500
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* If later you want a right column (image/cards), add a Grid item here */}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default HireDeveloperHero;
