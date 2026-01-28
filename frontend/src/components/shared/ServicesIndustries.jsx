import { Box, Grid, Paper, Stack, Typography, Divider, alpha, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { industriesServed } from '../../data/servicesPage.js';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const ServicesIndustries = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();
  const [apiConfig, setApiConfig] = useState(null);
  const [apiIndustries, setApiIndustries] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadIndustries = async () => {
      try {
        const [configResponse, itemsResponse] = await Promise.all([
          fetchWithLoading(apiUrl('/api/industries/config')),
          fetchWithLoading(apiUrl('/api/industries')),
        ]);

        if (!configResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch industries');
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
            image: item.image,
          }));
        setApiIndustries(mapped);
      } catch (error) {
        console.error('Failed to load industries', error);
      }
    };

    loadIndustries();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const resolvedIndustries =
    apiIndustries.length > 0 ? apiIndustries : industriesServed;
  const headerTitle = apiConfig?.title ;
  const headerDescription =
    apiConfig?.description ;

  return (
    <Box component="section">
      {/* Centered Header */}
      <Stack
        spacing={3}
        sx={{
          mb: 6,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
          }}
        >
          {headerTitle}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
           
          }}
        >
          {headerDescription}
        </Typography>
      </Stack>

      {/* Industry Cards */}
      <Grid container spacing={2} justifyContent="center">
        {resolvedIndustries.map((industry) => (
          <Grid item xs={12} sm={6} md={3} key={industry.title}>
            <Paper
              elevation={0}
              sx={{
                height: 300,
                borderRadius: 0.5,
                overflow: 'hidden',
                position: 'relative',
                color: 'common.white',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.7 : 0.95
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                transition: 'all 0.35s ease',
                transform: 'translateY(0)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                boxShadow: isDark
                  ? '0 10px 25px rgba(255,255,255,0.08)'
                  : '0 10px 25px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),

                },
              }}
            >
              {/* Background Image */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${industry.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              />

              {/* Overlay Gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: isDark
                    ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 90%)'
                    : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 90%)',
                }}
              />

              {/* Text Content at Bottom */}
              <Stack
                spacing={1.5}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{
                  fontWeight: 700, "&:hover": {
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, background-image 0.3s ease',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  },
                }}>
                  {industry.title}
                </Typography>
                <Divider sx={{ borderColor: alpha('#ffffff', 0.8) }} />
                <Typography
                  variant="body2"
                  sx={{ color: alpha('#ffffff', 0.8) }}
                >
                  {industry.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesIndustries;
