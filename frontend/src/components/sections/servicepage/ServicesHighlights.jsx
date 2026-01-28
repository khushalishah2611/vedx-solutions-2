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
  category = 'Mobile App Development',
  subcategory = 'Android App',
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = theme.palette.primary.main;
  const subtleText = theme.palette.text.secondary;

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

        const response = await fetch(
          apiUrl(`/api/why-choose?${params.toString()}`)
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

        let services = config?.services || [];
        if (config?.id) {
          const serviceParams = new URLSearchParams(params);
          serviceParams.append('whyChooseId', String(config.id));
          const servicesResponse = await fetch(
            apiUrl(`/api/why-services?${serviceParams.toString()}`)
          );
          const servicesData = await servicesResponse.json();
          if (!servicesResponse.ok) {
            throw new Error(
              servicesData?.error || 'Failed to load why services'
            );
          }
          services = Array.isArray(servicesData) ? servicesData : [];
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
  }, [category, subcategory]);

  const resolvedHero = useMemo(
    () => ({
      title: hero?.title || '',
      description: hero?.description || '',
      image: hero?.image || '/placeholder.jpg',
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
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        Failed to load data
      </Typography>
    );
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
          <Typography sx={{ color: subtleText, lineHeight: 1.7 }}>
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
          <Typography sx={{ color: subtleText, maxWidth: 720 }}>
            {resolvedTable.description}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {resolvedTable.services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.5 : 0.6
                  )}`,
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: alpha(accentColor, 0.7),
                  },
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {service.title}
                </Typography>
                <Typography sx={{ color: subtleText, mt: 1 }}>
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
