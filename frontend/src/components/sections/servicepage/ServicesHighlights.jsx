import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Stack,
  Paper,
  alpha,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { apiUrl } from '../../../utils/const.js';

export default function ServicePage({
  category,
  subcategory,
  configPath = '/api/why-choose',
  servicesPath = '/api/why-services',
  configIdParam = 'whyChooseId',
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const [hero, setHero] = useState(null);
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);

    const loadHighlights = async () => {
      try {
        setLoading(true);
        setError(false);

        const configQuery = params.toString();
        const response = await fetch(
          apiUrl(`${configPath}${configQuery ? `?${configQuery}` : ''}`)
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load why choose config');
        }

        const config = Array.isArray(data) ? data[0] : data;

        if (!isMounted) return;

        setHero({
          title: config?.heroTitle,
          description: config?.heroDescription,
          image: config?.heroImage || '/placeholder.jpg',
        });

        let services = [];
        const serviceParams = new URLSearchParams(params);
        if (config?.id) {
          serviceParams.append(configIdParam, String(config.id));
        }
        const serviceQuery = serviceParams.toString();
        const servicesResponse = await fetch(
          apiUrl(`${servicesPath}${serviceQuery ? `?${serviceQuery}` : ''}`)
        );
        const servicesData = await servicesResponse.json();
        if (!servicesResponse.ok) {
          throw new Error(
            servicesData?.error || 'Failed to load why services'
          );
        }
        services = Array.isArray(servicesData) ? servicesData : [];
        if (!services.length && Array.isArray(config?.services)) {
          services = config.services;
        }

        if (!isMounted) return;

        setTable({
          title: config?.tableTitle,
          description: config?.tableDescription,
          services,
        });
      } catch (err) {
        console.error('Why choose load error:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHighlights();

    return () => {
      isMounted = false;
    };
  }, [category, subcategory, configIdParam, configPath, servicesPath]);

  const resolvedHero = useMemo(
    () => ({
      title: hero?.title || '',
      description: hero?.description || '',
      image: hero?.image || "",
    }),
    [hero]
  );

  const resolvedTable = useMemo(
    () => ({
      title: table?.title || '',
      description: table?.description || '',
      services: table?.services || [],
    }),
    [table]
  );

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return null;
  }

  return (
    <>
      {/* HERO */}
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} mb={4}>
            {resolvedHero.title}
          </Typography>

          <Box
            component="img"
            src={resolvedHero.image}
            alt={resolvedHero.title}
            sx={{
              width: '100%',
              borderRadius: 0.5,
              boxShadow: isDark
                ? '0 24px 45px rgba(15,23,42,0.5)'
                : '0 24px 45px rgba(15,23,42,0.18)',
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            sx={{ color: subtleText, lineHeight: 1.7, whiteSpace: 'pre-line' }}
          >
            {resolvedHero.description}
          </Typography>
        </Grid>
      </Grid>

      {/* SERVICES */}
      <Box sx={{ mt: 10 }}>
        <Stack alignItems="center" spacing={2} mb={6}>
          <Typography variant="h3" fontWeight={700}>
            {resolvedTable.title}
          </Typography>
          <Typography sx={{ color: subtleText }}>
            {resolvedTable.description}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {resolvedTable.services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
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
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, background-image 0.3s ease',
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
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: subtleText, lineHeight: 1.7 }}
                >
                  {service.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
