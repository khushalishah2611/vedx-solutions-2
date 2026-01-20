import { useEffect, useState } from 'react';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { Box, ButtonBase, Divider, Grid, Paper, Stack, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import { AppButton } from '../../shared/FormControls.jsx';

import { businessSolutions } from '../../../data/servicesPage.js';
import { apiUrl } from '../../../utils/const.js';
import { useLoadingFetch } from '../../../hooks/useLoadingFetch.js';

const ServicesBusinessSolutions = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.6);
  const { fetchWithLoading } = useLoadingFetch();
  const [apiConfig, setApiConfig] = useState(null);
  const [apiSolutions, setApiSolutions] = useState([]);

  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // animation + selection
  const [animate, setAnimate] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // first index selected by default

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSolutions = async () => {
      try {
        const [configResponse, itemsResponse] = await Promise.all([
          fetchWithLoading(apiUrl('/api/tech-solutions/config')),
          fetchWithLoading(apiUrl('/api/tech-solutions')),
        ]);

        if (!configResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch tech solutions');
        }

        const configData = await configResponse.json();
        const itemsData = await itemsResponse.json();

        if (!isMounted) return;

        setApiConfig(configData);
        const mapped = (itemsData ?? [])
          .filter((item) => item?.isActive ?? true)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((item) => ({
            title: item.title,
            description: item.description || '',
          }));
        setApiSolutions(mapped);
      } catch (error) {
        console.error('Failed to load tech solutions', error);
      }
    };

    loadSolutions();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const resolvedSolutions = apiSolutions.length > 0 ? apiSolutions : businessSolutions;
  const headerTitle = apiConfig?.title || 'Tech solutions for all business types';
  const headerDescription =
    apiConfig?.description ||
    'Whether you are validating an idea or optimising global operations, our playbooks adapt to your stage and ambition.';

  const activeSolution = resolvedSolutions[activeIndex] ?? resolvedSolutions[0];

  useEffect(() => {
    if (activeIndex >= resolvedSolutions.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, resolvedSolutions.length]);

  return (
    <Box component="section">
      {/* Header */}
      <Stack
        spacing={3}
        sx={{
          mb: { xs: 6, md: 8 },
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            letterSpacing: '-0.5px',
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
          }}
        >
          {headerTitle}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 720,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
            transitionDelay: '80ms',
          }}
        >
          {headerDescription}
        </Typography>
      </Stack>

      {/* === MOBILE LAYOUT (cards) – same style you liked === */}
      <Grid
        container
        spacing={2}
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        {resolvedSolutions.map((solution, index) => (
          <Grid item xs={12} sm={6} key={solution.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.7 : 0.95
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                boxShadow: isDark
                  ? '0 4px 30px rgba(2,6,23,0.35)'
                  : '0 4px 30px rgba(15,23,42,0.15)',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(12px)',
                transition:
                  'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                transitionDelay: animate ? `${index * 70}ms` : '0ms',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                  boxShadow: isDark
                    ? '0 16px 40px rgba(2,6,23,0.6)'
                    : '0 18px 40px rgba(15,23,42,0.22)',
                },
              }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition:
                      'color 0.3s ease, background-image 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage:
                        'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {solution.title}
                </Typography>

                <Divider sx={{ borderColor: dividerColor }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: subtleText,
                    lineHeight: 1.6,
                  }}
                >
                  {solution.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* === DESKTOP LAYOUT (left list + right description) === */}
      <Grid
        container
        spacing={3}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        {/* Left: List of titles */}
        <Grid item xs={12} md={4}>
          <Stack spacing={1.5}>
            {resolvedSolutions.map((solution, index) => {
              const isActive = index === activeIndex;
              return (
                <ButtonBase
                  key={solution.title}
                  onClick={() => setActiveIndex(index)}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    borderRadius: 0.5,
                    p: 1.5,
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    border: `1px solid ${isActive
                        ? alpha(accentColor, isDark ? 0.9 : 0.8)
                        : alpha(theme.palette.divider, 0.6)
                      }`,
                    boxShadow: isActive
                      ? isDark
                        ? '0 12px 30px rgba(2,6,23,0.7)'
                        : '0 14px 30px rgba(15,23,42,0.18)'
                      : 'none',
                    opacity: animate ? 1 : 0,
                    transform: animate
                      ? 'translateY(0)'
                      : 'translateY(10px)',
                    transition:
                      'opacity 0.35s ease, transform 0.35s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    transitionDelay: animate ? `${index * 60}ms` : '0ms',

                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.4,
                      backgroundImage: isActive
                        ? 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)'
                        : 'none',
                      color: isActive ? 'transparent' : 'inherit',
                      WebkitBackgroundClip: isActive ? 'text' : 'unset',
                      backgroundClip: isActive ? 'text' : 'unset',
                      WebkitTextFillColor: isActive ? 'transparent' : 'inherit',
                    }}
                  >
                    {solution.title}
                  </Typography>
                </ButtonBase>
              );
            })}
          </Stack>
        </Grid>

        {/* Right: Description of selected title */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            key={activeSolution?.title}
            sx={{
              height: '100%',
              borderRadius: 0.5,
              p: 3,
              backgroundColor: alpha(
                theme.palette.background.paper,
                isDark ? 0.9 : 0.98
              ),
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              boxShadow: isDark
                ? '0 18px 40px rgba(2,6,23,0.7)'
                : '0 20px 45px rgba(15,23,42,0.18)',
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(14px)',
              transition:
                'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.35s ease',
            }}
          >
            <Stack spacing={2.5}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {activeSolution?.title}
              </Typography>

              <Divider sx={{ borderColor: dividerColor }} />

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  lineHeight: 1.7,
                  maxWidth: 640,
                }}
              >
                {activeSolution?.description}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Centered Button (common for both layouts) */}
      <Stack alignItems="center" sx={{ width: '100%', mt: 6 }}>
        <AppButton
          variant="contained"
          size="large"
          endIcon={<ArrowOutwardRoundedIcon />}
          sx={{
            background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
            color: '#fff',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            px: { xs: 4, md: 8 },
            py: { xs: 1.5, md: 2 },
            '&:hover': {
              background:
                'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
            },
          }}
        >
          Get Started
        </AppButton>
      </Stack>
    </Box>
  );
};

export default ServicesBusinessSolutions;
