import { useState } from 'react';
import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  Slide,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { servicesShowcase } from '../../../data/content.js';

const ServicesShowcase = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const { heading, services } = servicesShowcase;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];

  const activeBorder = `2px solid ${alpha(accentColor, 0.9)}`;
  const inactiveBorder = `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`;

  const activeShadow = isDark
    ? '0 24px 48px rgba(5, 9, 18, 0.55)'
    : '0 24px 48px rgba(15, 23, 42, 0.18)';
  const baseShadow = isDark
    ? '0 16px 36px rgba(5, 9, 18, 0.4)'
    : '0 16px 32px rgba(15, 23, 42, 0.12)';
  const hoverShadow = isDark
    ? '0 28px 52px rgba(5, 9, 18, 0.6)'
    : '0 28px 52px rgba(15, 23, 42, 0.2)';

  const overlayGradient = isDark
    ? 'linear-gradient(180deg, rgba(5,9,18,0.15) 10%, rgba(5,9,18,0.8) 85%)'
    : 'linear-gradient(180deg, rgba(15,23,42,0.35) 15%, rgba(15,23,42,0.75) 90%)';

  const supportingTextColor = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.9);

  return (
    <Box
      id="services"
      sx={{
        position: 'relative',
        width: '100vw',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <Stack spacing={6}>
        {/* Heading */}
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 44 },
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.1,
            }}
          >
            {heading}
          </Typography>
        </Stack>

        {/* Layout */}
        <Grid
          container
          spacing={{ xs: 4, md: 0 }}
          alignItems="stretch"
          justifyContent="center"
        >
          {/* Left side cards */}
          <Grid item xs={12} md={5.5}>
            <Grid container spacing={3}>
              {services.map((service, index) => {
                const active = index === activeIndex;
                return (
                  <Grid item xs={12} sm={4} key={service.title}>
                    <ButtonBase
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: { xs: 180, sm: 200, md: 220 },
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        border: active ? activeBorder : inactiveBorder,
                        boxShadow: active ? activeShadow : baseShadow,
                        transform: active ? 'translateY(-6px)' : 'translateY(0)',
                        transition: 'all 0.35s ease',
                        color: 'common.white',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: hoverShadow,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${service.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transform: active ? 'scale(1.05)' : 'scale(1)',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: overlayGradient }} />
                      <Stack
                        spacing={1}
                        sx={{
                          position: 'relative',
                          p: 2,
                          height: '100%',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, color: 'inherit' }}>
                          {service.title}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* Divider */}
          <Grid
            item
            md="auto"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'stretch',
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: alpha(theme.palette.divider, 0.7),
                mr: 3.5,
                ml: 2,
              }}
            />
          </Grid>

          {/* Right side content with animation */}
          <Grid item xs={12} md={6}>
            <Slide
              in={true}
              direction="left"
              timeout={500}
              key={activeIndex}
            >
              <Stack spacing={3} sx={{ height: '100%' }}>
                <Stack spacing={1}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: 26, md: 34 },
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    {activeService.title}
                  </Typography>
                  <Divider
                    sx={{
                      my: { xs: 2, md: 3 },
                      borderColor: alpha(theme.palette.divider, 0.7),
                    }}
                  />
                  <Typography variant="body1" sx={{ color: supportingTextColor }}>
                    {activeService.blurb}
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {activeService.capabilities.map((capability) => (
                    <Stack
                      key={capability}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <CheckCircleRoundedIcon
                        sx={{ color: theme.palette.secondary.main, fontSize: 22 }}
                      />
                      <Typography variant="body2" sx={{ color: supportingTextColor }}>
                        {capability}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Slide>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ServicesShowcase;
