import { useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha
} from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { servicesShowcase } from '../../data/content.js';

const ServicesShowcase = () => {
  const { eyebrow, heading, description, services } = servicesShowcase;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];
  const capabilityCount = activeService.capabilities.length;

  return (
    
    <Stack spacing={4} id="services">
      <Stack spacing={1.5} alignItems="flex-start">
       
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, lineHeight: 1.1 }}>
          {heading}
        </Typography>
       
      </Stack>

      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            {services.map((service, index) => {
              const active = index === activeIndex;
              return (
                <Grid item xs={12} sm={4} key={service.title}>
                  <ButtonBase
                    onClick={() => setActiveIndex(index)}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height:240,
                      borderRadius: 0.8,
                      overflow: 'hidden',
                      textAlign: 'left',
                      border: active
                        ? '2px solid rgba(103, 232, 249, 0.9)'
                        : '1px solid rgba(255,255,255,0.18)',
                      boxShadow: active
                        ? '0 24px 48px rgba(5, 9, 18, 0.55)'
                        : '0 16px 36px rgba(5, 9, 18, 0.4)',
                      transform: active ? 'translateY(-6px)' : 'translateY(0)',
                      transition: 'all 0.3s ease'
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
                        transition: 'transform 0.4s ease'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(5,9,18,0.1) 10%, rgba(5,9,18,0.75) 85%)'
                      }}
                    />
                    <Stack spacing={1} sx={{ position: 'relative', p: 2, height: '100%', justifyContent: 'flex-end' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {service.title}
                      </Typography>
                     
                    </Stack>
                  </ButtonBase>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
            
              p: { xs: 3, md: 5 },
            
            }}
          >
   
            <Stack spacing={3} sx={{ position: 'relative' }}>
              <Stack spacing={1}>
              
                <Typography variant="h4" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}>
                  {activeService.title}
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.78) }}>
                  {activeService.blurb}
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                {activeService.capabilities.map((capability) => (
                  <Grid item xs={12} sm={6} key={capability}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <CheckCircleRoundedIcon sx={{ color: 'secondary.light', fontSize: 22 }} />
                      <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.78) }}>
                        {capability}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  href="#contact"
                >
                  Discuss Your Project
                </Button>
                <Button variant="outlined" color="inherit" size="large" href="#about">
                  Explore More
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ServicesShowcase;
