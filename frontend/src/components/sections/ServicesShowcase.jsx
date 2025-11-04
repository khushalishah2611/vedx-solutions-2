import { useState } from 'react';
import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  Stack,
  Typography,
  alpha
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { servicesShowcase } from '../../data/content.js';

const ServicesShowcase = () => {
  const { heading, services } = servicesShowcase;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];

  return (
    <Stack spacing={6} id="services" >
      {/* Heading */}
      <Stack spacing={1} alignItems="center" textAlign="center">
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 44 },
            fontWeight: 700,
            color: 'common.white',
            lineHeight: 1.1
          }}
        >
          {heading}
        </Typography>
      </Stack>

      {/* Services Layout */}
      <Grid
        container
        spacing={{ xs: 4, md: 0 }}
        alignItems="stretch"
        justifyContent="center"
      >
        {/* Left Side: Thumbnails */}
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
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: active
                        ? '2px solid rgba(103, 232, 249, 0.9)'
                        : '1px solid rgba(255,255,255,0.18)',
                      boxShadow: active
                        ? '0 24px 48px rgba(5, 9, 18, 0.55)'
                        : '0 16px 36px rgba(5, 9, 18, 0.4)',
                      transform: active ? 'translateY(-6px)' : 'translateY(0)',
                      transition: 'all 0.35s ease',
                      color: 'common.white',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 28px 52px rgba(5, 9, 18, 0.6)'
                      }
                    }}
                  >
                    {/* Background Image */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${service.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: active ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.4s ease'
                      }}
                    />

                    {/* Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(5,9,18,0.15) 10%, rgba(5,9,18,0.8) 85%)'
                      }}
                    />

                    {/* Title */}
                    <Stack
                      spacing={1}
                      sx={{
                        position: 'relative',
                        p: 3,
                        height: '100%',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: 'common.white' }}
                      >
                        {service.title}
                      </Typography>
                    </Stack>
                  </ButtonBase>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Divider (hidden on mobile) */}
        <Grid
          item
          md="auto"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'stretch',
            mx: 2
          }}
        >
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: 'rgba(255, 255, 255, 1)' }}
          />
        </Grid>

        {/* Right Side: Active Service Details */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            {/* Service Title & Description */}
            <Stack spacing={1}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: 26, md: 34 },
                  fontWeight: 700,
                  color: 'common.white'
                }}
              >
                {activeService.title}
              </Typography>
               <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: 'rgba(255, 255, 255, 1)' }} />
              <Typography
                variant="body1"
                sx={{ color: alpha('#ffffff', 0.78) }}
              >
                {activeService.blurb}
              </Typography>
            </Stack>

           

            {/* Capabilities List */}
            <Stack spacing={1.5}>
              {activeService.capabilities.map((capability) => (
                <Stack
                  key={capability}
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <CheckCircleRoundedIcon
                    sx={{ color: 'secondary.light', fontSize: 22 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: alpha('#ffffff', 0.78) }}
                  >
                    {capability}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ServicesShowcase;
