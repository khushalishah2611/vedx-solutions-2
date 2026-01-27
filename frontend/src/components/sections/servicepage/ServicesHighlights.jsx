import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fullStackBenefits } from '../../../data/servicesPage.js';
import { apiUrl } from '../../../utils/const.js';
import { useLoadingFetch } from '../../../hooks/useLoadingFetch.js';

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

const ServicesHighlights = ({
  title,
  description,
  image,
  highlights: highlightsProp,
  benefitsTitle,
  benefitsDescription,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();
  const [apiConfig, setApiConfig] = useState(null);
  const [apiHighlights, setApiHighlights] = useState([]);

  useEffect(() => {
    const shouldFetch =
      !title ||
      !description ||
      !image ||
      !benefitsTitle ||
      !benefitsDescription ||
      !highlightsProp;

    if (!shouldFetch) return;

    let isMounted = true;

    const loadHighlights = async () => {
      try {
        const response = await fetchWithLoading(apiUrl('/api/why-choose'));
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load why choose config');
        }

        const config = Array.isArray(data) ? data[0] : data;

        if (isMounted) {
          setApiConfig(config || null);
        }

        if (config?.id) {
          const serviceResponse = await fetchWithLoading(
            apiUrl(`/api/why-services?whyChooseId=${config.id}`)
          );
          const servicesData = await serviceResponse.json();
          if (!serviceResponse.ok) {
            throw new Error(servicesData?.error || 'Unable to load why services');
          }

          if (isMounted) {
            setApiHighlights(
              (servicesData || []).map((item) => ({
                title: item.title || '',
                description: item.description || '',
              }))
            );
          }
        } else if (isMounted) {
          setApiHighlights([]);
        }
      } catch (error) {
        console.error('Failed to load why choose highlights', error);
      }
    };

    loadHighlights();

    return () => {
      isMounted = false;
    };
  }, [benefitsDescription, benefitsTitle, description, fetchWithLoading, highlightsProp, image, title]);

  const resolvedTitle = title || apiConfig?.heroTitle || 'Full Stack Development Service';
  const resolvedDescription = description || apiConfig?.heroDescription;
  const resolvedImage =
    image ||
    apiConfig?.heroImage ||
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80';

  const resolvedBenefitsTitle =
    benefitsTitle || apiConfig?.tableTitle || 'Why Full Stack With Us?';
  const resolvedBenefitsDescription =
    benefitsDescription ||
    apiConfig?.tableDescription ||
    'We combine modern front-end frameworks, robust back-end engineering, and cloud-native practices to deliver reliable, future-ready digital products.';

  const highlights = useMemo(() => {
    if (highlightsProp?.length) return highlightsProp;
    if (apiHighlights.length > 0) return apiHighlights;
    return fullStackBenefits;
  }, [apiHighlights, highlightsProp]);

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
            {resolvedTitle}
          </Typography>

          <Box
            component="img"
            src={resolvedImage}
            alt={resolvedTitle || 'Full Stack Development'}
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
              {resolvedDescription || (
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
                {resolvedBenefitsTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  maxWidth: 720,
                  textAlign: 'center',
                }}
              >
                {resolvedBenefitsDescription}
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {highlights.map((highlight) => {
                const Icon = highlight.Icon || highlight.icon;
                return (
                <Grid item xs={12} sm={6} md={4} key={highlight.title}>
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
                      {highlight.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: subtleText, lineHeight: 1.7 }}
                    >
                      {highlight.description}
                    </Typography>
                  </Paper>
                </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ServicesHighlights;
