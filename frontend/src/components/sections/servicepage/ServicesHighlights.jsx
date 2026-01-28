import { useEffect, useState } from 'react';
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
    setLoading(true);

    fetch(
      `/api/why-choose?category=${encodeURIComponent(
        category
      )}&subcategory=${encodeURIComponent(subcategory)}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('API DATA 👉', data);

        setHero({
          title: data.heroTitle,
          description: data.heroDescription,
          image: data.heroImage || '/placeholder.jpg',
        });

        setTable({
          title: data.tableTitle,
          description: data.tableDescription,
          services: data.services || [],
        });

        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [category, subcategory]);

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
            {hero.title}
          </Typography>

          <Box
            component="img"
            src={hero.image}
            alt={hero.title}
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
            {hero.description}
          </Typography>
        </Grid>
      </Grid>

      {/* SERVICES */}
      <Box sx={{ mt: 10 }}>
        <Stack alignItems="center" spacing={2} mb={6}>
          <Typography variant="h3" fontWeight={700}>
            {table.title}
          </Typography>
          <Typography sx={{ color: subtleText, maxWidth: 720 }}>
            {table.description}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {table.services.map((service) => (
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
