import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, MenuItem, Stack, Typography, alpha, useTheme } from '@mui/material';
import { AppButton, AppSelectField, AppTextField } from '../../shared/FormControls.jsx';

import { contactProjectTypes, servicesContactImage } from '../../../data/servicesPage.js';

// Simple hook to detect when an element enters the viewport
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target); // run once
          }
        });
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
};

const ServicesContact = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  return (
    <Box component="section">
      {/* Heading */}
      <Stack spacing={2} sx={{ mb: { xs: 4, md: 6 } }} alignItems="center">
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 28, md: 40 },
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          Share your idea, challenge, or growth plan — we’ll help you turn it into a solid product roadmap.
        </Typography>
      </Stack>

      {/* Main Content */}
      <Grid
        container
        sx={{
          borderRadius: 0.5,
          overflow: 'hidden',
          boxShadow: isDark
            ? '0 24px 48px rgba(15,23,42,0.7)'
            : '0 24px 48px rgba(15,23,42,0.14)',
        }}
      >
        {/* Left: Image */}
        <Grid
          item
          xs={12}
          md={5}
          ref={leftRef}
          sx={{
            minHeight: { xs: 260, md: '70vh' },
            backgroundImage: `url(${servicesContactImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: leftInView ? 1 : 0,
            transform: leftInView ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        />

        {/* Right: Form */}
        <Grid
          item
          xs={12}
          md={7}
          ref={rightRef}
          sx={{
            backgroundColor: isDark ? alpha('#020617', 0.96) : '#ffffff',
            opacity: rightInView ? 1 : 0,
            transform: rightInView ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Stack
            spacing={3}
            sx={{
              p: { xs: 3, md: 5 },
            }}
          >
            {/* Title & Subtitle */}
            <Stack spacing={1}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Ready to build something remarkable?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Tell us about your next project and we’ll assemble the right team within 48 hours.
              </Typography>
            </Stack>

            {/* Form */}
            <Stack component="form" spacing={2.5}>
              {/* Name + Email */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <AppTextField
                  label="Name"
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                />
                <AppTextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                />
              </Stack>

              {/* Mobile + Project Type */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <AppTextField
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
                <AppSelectField
                 
                  label="Project Type"
                  fullWidth
                  defaultValue={contactProjectTypes[0]}
                  variant="outlined"
                  size="medium"
                >
                  {contactProjectTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </AppSelectField>
              </Stack>

              {/* Description */}
              <AppTextField
                label="Project Description"
                fullWidth
                multiline
                minRows={4}
                variant="outlined"
              />

              {/* Submit Button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 1,
                }}
              >
                <AppButton
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 1.75 },
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                    },
                  }}
                >
                  Submit Now
                </AppButton>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServicesContact;
