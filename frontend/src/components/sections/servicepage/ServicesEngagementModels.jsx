import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { engagementModels } from '../../../data/servicesPage.js';
import { apiUrl } from '../../../utils/const.js';
import { useLoadingFetch } from '../../../hooks/useLoadingFetch.js';

const ServicesEngagementModels = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();
  const [apiConfig, setApiConfig] = useState(null);
  const [apiModels, setApiModels] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadExpertise = async () => {
      try {
        const [configResponse, itemsResponse] = await Promise.all([
          fetchWithLoading(apiUrl('/api/expertise/config')),
          fetchWithLoading(apiUrl('/api/expertise')),
        ]);

        if (!configResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch expertise');
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
        setApiModels(mapped);
      } catch (error) {
        console.error('Failed to load expertise', error);
      }
    };

    loadExpertise();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const resolvedModels = apiModels.length > 0 ? apiModels : engagementModels;
  const headerTitle = apiConfig?.title || 'Ways to Choose Our Expertise for VedX Solutions';
  const headerDescription =
    apiConfig?.description ||
    'Select the engagement model that aligns with your budget, project goals, and delivery rhythm — from flexible collaborations to dedicated teams tailored for your business success.';

  return (
    <Box component="section" >
      {/* Header Section */}
      <Stack
        spacing={3}
        sx={{
          mb: 6,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderRadius: 0.5,
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
            background: !isDark
              ? alpha('#ddddddff', 0.9)
              : alpha('#0000007c', 0.9),
            color: alpha(accentColor, 0.9),
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontSize: 11,
            lineHeight: 1.3,
            width: 'fit-content',
          }}
        >
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            What We Can Do For You
          </Box>
        </Box>

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
            color: alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78),
            maxWidth: 720,
          }}
        >
          {headerDescription}
        </Typography>
      </Stack>

      {/* Engagement Cards */}
      <Grid container spacing={2}>
        {resolvedModels.map((model) => (
          <Grid item xs={12} md={4} key={model.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',

                textAlign: 'left',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.97
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                transition:
                  'transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease',
                boxShadow: isDark
                  ? '0 4px 30px rgba(2,6,23,0.35)'
                  : '0 4px 30px rgba(15,23,42,0.15)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                }
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  height: 300,
                  backgroundImage: `url(${model.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 0.5,

                }}
              />

              {/* Text Section */}
              <Stack spacing={1.5} sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
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
                  }}
                >
                  {model.title}
                </Typography>


              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesEngagementModels;
