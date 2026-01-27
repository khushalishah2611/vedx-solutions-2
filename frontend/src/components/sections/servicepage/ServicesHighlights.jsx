import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { fullStackBenefits } from '../../../data/servicesPage.js';

// Simple hook to detect when an element enters the viewport
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
};

const ServicesHighlights = ({ title, description, image }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const imageUrl =
    image ||
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80';

  // Animation hooks
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();
  const [benefitsRef, benefitsInView] = useInView();

  return (
    <Box component="section">
      {/* ========== SECTION 1: IMAGE + DESCRIPTION ========== */}
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"

      >
        {/* Left - Image */}
        <Grid
          item
          xs={12}
          md={6}
          ref={leftRef}
          sx={{
            opacity: leftInView ? 1 : 0,
            transform: leftInView ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 28, md: 40 },
              fontWeight: 700,
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 4, md: 5 },
            }}
          >
            {title || 'Full Stack Development Service'}
          </Typography>

          <Box
            component="img"
            src={imageUrl}
            alt={title || 'Full Stack Development'}
            sx={{
              width: '100%',
              borderRadius: 0.5,
              objectFit: 'cover',
              boxShadow: isDark
                ? '0 24px 45px rgba(15,23,42,0.5)'
                : '0 24px 45px rgba(15,23,42,0.18)',
              transition: 'transform 0.4s ease, box-shadow 0.4s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: isDark
                  ? '0 30px 60px rgba(15,23,42,0.7)'
                  : '0 30px 60px rgba(15,23,42,0.25)',
              },
            }}
          />
        </Grid>

        {/* Right - Text */}
        <Grid
          item
          xs={12}
          md={6}
          ref={rightRef}
          sx={{
            opacity: rightInView ? 1 : 0,
            transform: rightInView ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Stack
            spacing={2.5}
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            <Typography
              variant="body1"
              sx={{
                color: subtleText,
                maxWidth: 620,
                textAlign: { xs: 'center', md: 'left' },
                lineHeight: 1.7,
              }}
            >
              {description || (
                <>
                  From concept to deployment, we craft scalable, high-performance
                  web applications with clean, maintainable architecture across
                  front-end and back-end.
                  <br />
                  <br />
                  Our full stack team takes care of everything – APIs, databases,
                  cloud deployment, and pixel-perfect UI – so you can focus on
                  growing your business, not managing tech complexity.
                </>
              )}
            </Typography>



          </Stack>
        </Grid>
      </Grid>

      {/* ========== SECTION 2: BENEFITS GRID ========== */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          mt: { xs: 8, md: 10 },
        }}
        ref={benefitsRef}
      >
        <Grid
          container
          justifyContent="center"
          sx={{
            opacity: benefitsInView ? 1 : 0,
            transform: benefitsInView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Grid item xs={12} md={10}>
            <Stack
              spacing={2}
              alignItems="center"
              sx={{ mb: { xs: 4, md: 6 } }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 26, md: 36 },
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Why Full Stack With Us?
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  maxWidth: 720,
                  textAlign: 'center',
                }}
              >
                We combine modern front-end frameworks, robust back-end
                engineering, and cloud-native practices to deliver reliable,
                future-ready digital products.
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {fullStackBenefits.map(({ title, description, Icon }) => (
                <Grid item xs={12} sm={6} md={4} key={title}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 0.5,
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        isDark ? 0.85 : 0.98
                      ),
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        isDark ? 0.5 : 0.6
                      )}`,
                      transition:
                        'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        borderColor: alpha(accentColor, 0.7),
                        boxShadow: isDark
                          ? '0 20px 40px rgba(15,23,42,0.8)'
                          : '0 20px 40px rgba(15,23,42,0.18)',
                      },
                    }}
                  >
                    {Icon && (
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: alpha(accentColor, 0.16),
                          color: accentColor,
                          mb: 1.5,
                        }}
                      >
                        <Icon />
                      </Box>
                    )}

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition:
                          'color 0.3s ease, background-image 0.3s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage:
                            'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                    >
                      {title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: subtleText, lineHeight: 1.7 }}
                    >
                      {description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ServicesHighlights;
